// ============================================================
// HopeAfter50 — Stripe Checkout Session Creation
// Creates a Checkout session for a voluntary Partner donation,
// either a monthly subscription or a one-time gift.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

const SUCCESS_URL = 'https://www.hopeafter50.org/platform/dashboard?partner=true'
const CANCEL_URL = 'https://www.hopeafter50.org/platform/plan/support'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  try {
    const body = await req.json()
    const { amount, interval, email } = body

    const amountCents = Math.round(Number(amount))
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.json({ success: false, error: 'A valid amount is required.' }, { status: 400 })
    }

    if (interval !== 'month' && interval !== 'one_time') {
      return NextResponse.json(
        { success: false, error: 'Interval must be "month" or "one_time".' },
        { status: 400 }
      )
    }

    const donorEmail = email ?? session?.user?.email ?? undefined

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: interval === 'month' ? 'subscription' : 'payment',
      customer_email: donorEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'HopeAfter50 Partner Donation' },
            unit_amount: amountCents,
            ...(interval === 'month' ? { recurring: { interval: 'month' as const } } : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        memberId: session?.user?.id ?? '',
        interval,
      },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    })

    return NextResponse.json({ success: true, url: checkoutSession.url })
  } catch (err) {
    console.error('Stripe checkout creation error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong starting checkout. Please try again.' },
      { status: 500 }
    )
  }
}
