// ============================================================
// HopeAfter50 — Become a Partner
// Shown after a member receives their Rebuild Plan
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tier = {
  amount: string
  amountCents: number
  interval: 'month' | 'one_time'
  description: string
  cta: string
}

const RECURRING_TIERS: Tier[] = [
  { amount: '$10/month', amountCents: 1000, interval: 'month', description: "Sponsors one member's access for a month", cta: 'Become a Partner' },
  { amount: '$25/month', amountCents: 2500, interval: 'month', description: 'Covers platform costs for one week', cta: 'Become a Partner' },
  { amount: '$50/month', amountCents: 5000, interval: 'month', description: 'Funds a month of AI tools for five members', cta: 'Become a Partner' },
]

const ONE_TIME_TIERS: Tier[] = [
  { amount: '$25', amountCents: 2500, interval: 'one_time', description: 'A simple thank you', cta: 'Give Once' },
  { amount: '$50', amountCents: 5000, interval: 'one_time', description: 'Help someone else find their next step', cta: 'Give Once' },
  { amount: '$100', amountCents: 10000, interval: 'one_time', description: 'Cover a month of hope for someone in crisis', cta: 'Give Once' },
]

function TierCard({ tier, onSelect, loading }: { tier: Tier; onSelect: (tier: Tier) => void; loading: boolean }) {
  return (
    <div className="bg-navy border border-white/20 rounded-card p-6 hover:border-amber-hope transition">
      <p className="font-display text-2xl text-amber-hope mb-2">{tier.amount}</p>
      <p className="font-body text-white/60 text-sm mb-4">{tier.description}</p>
      <button
        onClick={() => onSelect(tier)}
        disabled={loading}
        className="btn-primary inline-block disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting…' : tier.cta}
      </button>
    </div>
  )
}

export default function PartnerPage() {
  const [pendingAmount, setPendingAmount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSelect(tier: Tier) {
    setError(null)
    setPendingAmount(tier.amountCents)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: tier.amountCents, interval: tier.interval }),
      })
      const data = await res.json()

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Something went wrong starting checkout.')
      }

      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setError('Something went wrong starting checkout. Please try again.')
      setPendingAmount(null)
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        {/* Eyebrow */}
        <p className="font-body text-amber-hope text-xs tracking-widest uppercase">
          Join the Mission
        </p>

        {/* Headline */}
        <h1 className="font-display text-display-md text-white">
          Become a Hope After 50 Partner.
        </h1>

        {/* Body */}
        <p className="font-body text-white/80">
          Hope After 50 is free for every member who needs it — because Partners make it possible.
          When you become a Partner, you're not just giving money. You're making sure the next
          person who needs this finds it free, just like you did. And every month, you'll receive
          a personal letter from Bret — what God is showing him, what's happening in the ministry,
          and who is finding hope.
        </p>

        <hr className="border-white/10" />

        {error && (
          <p className="font-body text-red-400 text-sm text-center">{error}</p>
        )}

        {/* Recurring */}
        <div className="space-y-4">
          <p className="font-body text-white/50 text-xs tracking-widest uppercase">Recurring Monthly</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {RECURRING_TIERS.map((tier) => (
              <TierCard
                key={tier.amount}
                tier={tier}
                onSelect={handleSelect}
                loading={pendingAmount === tier.amountCents}
              />
            ))}
          </div>
        </div>

        <p className="font-body text-white/40 text-sm text-center">or make a one-time gift</p>

        {/* One-time */}
        <div className="space-y-4">
          <p className="font-body text-white/50 text-xs tracking-widest uppercase">One-Time</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {ONE_TIME_TIERS.map((tier) => (
              <TierCard
                key={tier.amount}
                tier={tier}
                onSelect={handleSelect}
                loading={pendingAmount === tier.amountCents}
              />
            ))}
          </div>
        </div>

        <p className="font-body text-white/40 text-sm text-center">
          All contributions go directly to keeping Hope After 50 free for everyone who needs it.
        </p>

        {/* Continue link */}
        <div className="text-center pt-4">
          <Link href="/platform/dashboard" className="font-body text-amber-hope hover:underline">
            Continue to my dashboard →
          </Link>
        </div>

      </div>
    </div>
  )
}
