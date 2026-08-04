// ============================================================
// HopeAfter50 — Voluntary Partner Support Page
// Shown after a member receives their Rebuild Plan
// ============================================================
import Link from 'next/link'

type Tier = {
  amount: string
  description: string
  cta: string
}

const RECURRING_TIERS: Tier[] = [
  { amount: '$10/month', description: "Sponsors one member's access for a month", cta: 'Become a Partner' },
  { amount: '$25/month', description: 'Covers platform costs for one week', cta: 'Become a Partner' },
  { amount: '$50/month', description: 'Funds a month of AI tools for five members', cta: 'Become a Partner' },
]

const ONE_TIME_TIERS: Tier[] = [
  { amount: '$25', description: 'A simple thank you', cta: 'Give Once' },
  { amount: '$50', description: 'Help someone else find their next step', cta: 'Give Once' },
  { amount: '$100', description: 'Cover a month of hope for someone in crisis', cta: 'Give Once' },
]

function TierCard({ tier }: { tier: Tier }) {
  return (
    <div className="bg-navy border border-white/20 rounded-card p-6 hover:border-amber-hope transition">
      <p className="font-display text-2xl text-amber-hope mb-2">{tier.amount}</p>
      <p className="font-body text-white/60 text-sm mb-4">{tier.description}</p>
      <Link href="/platform/dashboard" className="btn-primary inline-block">
        {tier.cta}
      </Link>
    </div>
  )
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        {/* Eyebrow */}
        <p className="font-body text-amber-hope text-xs tracking-widest uppercase">
          You're not alone — and neither are they
        </p>

        {/* Headline */}
        <h1 className="font-display text-display-md text-white">
          Someone helped make this possible for you.
        </h1>

        {/* Body */}
        <p className="font-body text-white/80">
          Hope After 50 is free because people who believe in this mission chose to make it that way.
          If this has meant something to you — or if you simply want someone else to have the same
          experience you just had — here's how you can help.
        </p>

        <hr className="border-white/10" />

        {/* Become a Partner */}
        <div className="space-y-3">
          <p className="font-body text-amber-hope text-sm tracking-widest uppercase">Become a Partner</p>
          <p className="font-body text-white/70">
            Partners make it possible for the next person who needs this to find it free, just like you
            did. There's no obligation, no pressure, and no difference in what you receive either way.
          </p>
        </div>

        {/* Recurring */}
        <div className="space-y-4">
          <p className="font-body text-white/50 text-xs tracking-widest uppercase">Recurring Monthly</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {RECURRING_TIERS.map((tier) => (
              <TierCard key={tier.amount} tier={tier} />
            ))}
          </div>
        </div>

        <p className="font-body text-white/40 text-sm text-center">or make a one-time gift</p>

        {/* One-time */}
        <div className="space-y-4">
          <p className="font-body text-white/50 text-xs tracking-widest uppercase">One-Time</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {ONE_TIME_TIERS.map((tier) => (
              <TierCard key={tier.amount} tier={tier} />
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
