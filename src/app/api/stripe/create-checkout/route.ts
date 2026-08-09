// ============================================================
// HopeAfter50 — Stripe Checkout Session Creation
// Creates a Checkout session for a voluntary Partner donation,
// either a monthly subscription or a one-time gift.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const SUCCESS_URL = 'https://www.hopeafter50.org/thank-you/partner'
const CANCEL_URL = 'https://hopeafter50-52n2tz2pb-bret-mundts-projects.vercel.app/platform/plan/partner'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Stripe checkout creation error: STRIPE_SECRET_KEY is not set')
    return NextResponse.json(
      { success: false, error: 'Stripe is not configured on the server (missing STRIPE_SECRET_KEY).' },
      { status: 503 }
    )
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await getServerSession(authOptions)

    let body: any
    try {
      body = await req.json()
    } catch (parseErr) {
      console.error('Stripe checkout creation error: failed to parse request body:', parseErr)
      return NextResponse.json(
        { success: false, error: 'Request body must be valid JSON with priceId and mode.' },
        { status: 400 }
      )
    }

    const { priceId, mode, email, organizationName } = body ?? {}

    if (typeof priceId !== 'string' || !priceId) {
      return NextResponse.json({ success: false, error: 'A valid priceId is required.' }, { status: 400 })
    }

    if (mode !== 'subscription' && mode !== 'payment') {
      return NextResponse.json(
        { success: false, error: 'mode must be "subscription" or "payment".' },
        { status: 400 }
      )
    }

    const donorEmail = email ?? session?.user?.email ?? undefined

    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      customer_email: donorEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        memberId: session?.user?.id ?? '',
        mode,
        organizationName: typeof organizationName === 'string' ? organizationName.trim().slice(0, 200) : '',
      },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    })

    return NextResponse.json({ success: true, url: checkoutSession.url })
  } catch (err) {
    const message = err instanceof Stripe.errors.StripeError
      ? err.message
      : err instanceof Error
        ? err.message
        : 'Unknown error'

    console.error('Stripe checkout creation error:', err)

    return NextResponse.json(
      { success: false, error: `Something went wrong starting checkout: ${message}` },
      { status: 500 }
    )
  }
}
