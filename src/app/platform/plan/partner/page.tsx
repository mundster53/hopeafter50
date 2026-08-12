// ============================================================
// HopeAfter50 — Become a Partner
// Shown after a member receives their Rebuild Plan
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import PlatformNav from '@/components/platform/PlatformNav'

type Tier = {
  amount: string
  priceId: string
  mode: 'subscription' | 'payment'
  description: string
  cta: string
  featured?: boolean
}

const RECURRING_TIERS: Tier[] = [
  { amount: '$11/month', priceId: 'price_1U1u4SP3pCt2RBbZJUahh3mR', mode: 'subscription', description: 'Less than a cup of coffee a week. Keeps one member\'s tools running for a month.', cta: 'Become a Partner', featured: true },
  { amount: '$25/month', priceId: 'price_1U1u5BP3pCt2RBbZpsy2m7HQ', mode: 'subscription', description: 'Covers platform costs for one week', cta: 'Become a Partner' },
  { amount: '$50/month', priceId: 'price_1U1u63P3pCt2RBbZAAL9cQ8D', mode: 'subscription', description: 'Funds a month of AI tools for five members', cta: 'Become a Partner' },
]

const ONE_TIME_TIERS: Tier[] = [
  { amount: '$25', priceId: 'price_1U1u6uP3pCt2RBbZGIHWp9nT', mode: 'payment', description: 'A simple thank you', cta: 'Give Once' },
  { amount: '$50', priceId: 'price_1U1u7UP3pCt2RBbZEa0f9RW1', mode: 'payment', description: 'Help someone else find their next step', cta: 'Give Once' },
  { amount: '$100', priceId: 'price_1U1u8GP3pCt2RBbZlZnAZ81S', mode: 'payment', description: 'A generous gift', cta: 'Give Once' },
]

function TierCard({ tier, onSelect, loading }: { tier: Tier; onSelect: (tier: Tier) => void; loading: boolean }) {
  return (
    <div
      className={
        tier.featured
          ? 'relative flex flex-col h-full bg-navy border-2 border-amber-hope rounded-card p-6 shadow-lg shadow-amber-hope/20 scale-[1.03] transition'
          : 'flex flex-col h-full bg-navy border border-white/20 rounded-card p-6 hover:border-amber-hope transition'
      }
    >
      {tier.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-hope text-navy text-xs font-body font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <p className="font-display text-2xl text-amber-hope mb-2">{tier.amount}</p>
      <p className="font-body text-white/60 text-sm mb-4">{tier.description}</p>
      <button
        onClick={() => onSelect(tier)}
        disabled={loading}
        className="btn-primary inline-block disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
      >
        {loading ? 'Redirecting…' : tier.cta}
      </button>
    </div>
  )
}

export default function PartnerPage() {
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [organizationName, setOrganizationName] = useState('')

  async function handleSelect(tier: Tier) {
    setError(null)
    setPendingPriceId(tier.priceId)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier.priceId, mode: tier.mode, organizationName: organizationName.trim() || undefined }),
      })
      const data = await res.json()

      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || 'Something went wrong starting checkout.')
      }

      window.location.href = data.url
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Something went wrong starting checkout. Please try again.')
      setPendingPriceId(null)
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <PlatformNav />
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

        {/* Organization name */}
        <div className="space-y-2">
          <label className="font-body text-white/50 text-xs tracking-widest uppercase" htmlFor="organizationName">
            Organization name (optional)
          </label>
          <input
            id="organizationName"
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Church, company, or organization name (optional)"
            className="w-full bg-navy border border-white/20 rounded px-3 py-2 text-white font-body text-sm focus:outline-none focus:border-amber-hope"
          />
        </div>

        {/* Recurring */}
        <div className="space-y-4">
          <p className="font-body text-white/50 text-xs tracking-widest uppercase">Recurring Monthly</p>
          <div className="grid sm:grid-cols-3 gap-4 items-stretch">
            {RECURRING_TIERS.map((tier) => (
              <TierCard
                key={tier.amount}
                tier={tier}
                onSelect={handleSelect}
                loading={pendingPriceId === tier.priceId}
              />
            ))}
          </div>
        </div>

        <p className="font-body text-white/40 text-sm text-center">or make a one-time gift</p>

        {/* One-time */}
        <div className="space-y-4">
          <p className="font-body text-white/50 text-xs tracking-widest uppercase">One-Time</p>
          <div className="grid sm:grid-cols-3 gap-4 items-stretch">
            {ONE_TIME_TIERS.map((tier) => (
              <TierCard
                key={tier.amount}
                tier={tier}
                onSelect={handleSelect}
                loading={pendingPriceId === tier.priceId}
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
