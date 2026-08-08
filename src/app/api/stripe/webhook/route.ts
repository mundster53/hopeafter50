// ============================================================
// HopeAfter50 — Stripe Webhook
// On checkout.session.completed, records the Partner donation
// and sends a thank-you email via Resend.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? '', process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session
    const email = checkoutSession.customer_details?.email ?? checkoutSession.customer_email
    const memberId = checkoutSession.metadata?.memberId || null
    const interval = checkoutSession.metadata?.mode === 'subscription' ? 'monthly' : 'one_time'
    const amount = checkoutSession.amount_total ?? 0

    if (email) {
      let firstName = checkoutSession.customer_details?.name?.split(' ')[0]?.trim() ?? ''
      if (!firstName && memberId) {
        const member = await prisma.member.findUnique({ where: { id: memberId }, select: { firstName: true } })
        firstName = member?.firstName ?? ''
      }

      const partner = await prisma.partner.upsert({
        where: { stripeSessionId: checkoutSession.id },
        update: {},
        create: {
          memberId,
          email,
          amount,
          interval,
          stripeCustomerId:
            typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.customer?.id ?? null,
          stripeSessionId: checkoutSession.id,
          status: 'complete',
        },
      })

      await sendThankYouEmail(email, firstName, amount, checkoutSession.created, partner.id)
    }
  }

  return NextResponse.json({ received: true })
}

async function sendThankYouEmail(email: string, firstName: string, amountCents: number, createdAt: number, partnerId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const amount = (amountCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const date = new Date(createdAt * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  try {
    await resend.emails.send({
      from: 'Hope After 50 <noreply@hopeafter50.org>',
      to: email,
      subject: 'Thank you for making this possible.',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:'Inter',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(27,43,75,0.08);">
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:16px;line-height:1.6;">${firstName ? `${firstName},` : 'Friend,'}</p>
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:16px;line-height:1.6;">
                Because of what you just did, someone who has lost their job, their confidence, and maybe their hope — will find Hope After 50 free.
              </p>
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:16px;line-height:1.6;">
                They won't know your name. But what you did today will matter to them more than you know.
              </p>
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:16px;line-height:1.6;">
                Your gift has been received and will go directly to keeping Hope After 50 free for everyone who needs it.
              </p>
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:16px;line-height:1.6;">
                If you gave monthly, you can cancel anytime by replying to this email.
              </p>
              <p style="margin:0;color:#1B2B4B;font-size:16px;line-height:1.6;">
                Thank you.<br />— The Hope After 50 Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#E8EDE8;padding:20px 40px;">
              <p style="margin:0;color:#6B7A8D;font-size:12px;">
                This email serves as your donation receipt. Hope After 50 is operated by Bret Mundt. ${amount} given on ${date}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    })
  } catch (err) {
    console.error(`Failed to send thank-you email for partner ${partnerId}:`, err)
  }
}
