// ============================================================
// HopeAfter50 — Stripe Checkout Session Creation
// Creates a Checkout session for a voluntary Partner donation,
// either a monthly subscription or a one-time gift.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const SUCCESS_URL = 'https://hopeafter50-52n2tz2pb-bret-mundts-projects.vercel.app/platform/dashboard?partner=true'
const CANCEL_URL = 'https://hopeafter50-52n2tz2pb-bret-mundts-projects.vercel.app/platform/plan/partner'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const session = await getServerSession(authOptions)

  try {
    const body = await req.json()
    const { priceId, mode, email } = body

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
