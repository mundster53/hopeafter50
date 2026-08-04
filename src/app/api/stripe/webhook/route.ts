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
    const interval = checkoutSession.metadata?.interval === 'month' ? 'monthly' : 'one_time'
    const amount = checkoutSession.amount_total ?? 0

    if (email) {
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

      await sendThankYouEmail(email, amount, interval, partner.id)
    }
  }

  return NextResponse.json({ received: true })
}

async function sendThankYouEmail(email: string, amountCents: number, interval: string, partnerId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const amount = (amountCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const cadence = interval === 'monthly' ? 'each month' : 'as a one-time gift'

  try {
    await resend.emails.send({
      from: `HopeAfter50 <${process.env.FROM_EMAIL ?? 'hello@hopeafter50.org'}>`,
      to: email,
      subject: 'Thank you for partnering with HopeAfter50',
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
            <td style="background:#1B2B4B;padding:28px 40px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;font-family:Georgia,serif;">HopeAfter50</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:24px;font-family:Georgia,serif;line-height:1.3;">
                Thank you for caring.
              </p>
              <p style="margin:0 0 16px;color:#6B7A8D;font-size:16px;line-height:1.6;">
                Your gift of ${amount} ${cadence} helps make sure the next person who needs HopeAfter50 finds it free, just like you did.
              </p>
              <p style="margin:0;color:#6B7A8D;font-size:16px;line-height:1.6;">
                It means more than you know. Thank you for standing with us.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#E8EDE8;padding:20px 40px;">
              <p style="margin:0;color:#6B7A8D;font-size:12px;">
                HopeAfter50 — Practical tools and renewed hope for experienced professionals rebuilding after career disruption.
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
