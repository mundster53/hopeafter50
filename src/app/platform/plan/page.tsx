// ============================================================
// HopeAfter50 — Personalized Rebuild Plan
// Artifact 3 — displayed immediately after assessment
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RebuildPlan } from '@/types'

export default function PlanPage() {
  const [plan, setPlan] = useState<RebuildPlan | null>(null)
  const [firstName, setFirstName] = useState('Friend')

  useEffect(() => {
    const stored = sessionStorage.getItem('rebuildPlan')
    const storedName = sessionStorage.getItem('memberName')
    if (stored) setPlan(JSON.parse(stored))
    if (storedName) setFirstName(storedName.split(' ')[0])
  }, [])

  if (!plan) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="font-body text-white/70">Loading your plan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">

        <div>
          <p className="font-body text-amber-hope text-sm tracking-widest uppercase mb-4">Your Plan Is Ready</p>
          <h1 className="font-display text-display-md text-white mb-6">{firstName}, you made it through today.</h1>
          <p className="font-body text-white/80">That took courage. And we want you to know something before you do anything else:</p>
        </div>

        <p className="font-display italic text-2xl text-amber-hope leading-relaxed">
          "You don't have to figure out next month. You don't have to figure out next week. You just have to get through today. And we're going to help you do exactly that."
        </p>

        <p className="font-body text-white/70">
          Every day, we'll give you one step. One action. Something you can actually do today that moves you forward. That's it. No overwhelming lists. No pressure to have it all figured out.
        </p>

        <div className="border-t border-white/10" />

        <div className="bg-white/5 rounded-card p-8">
          <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-3">Your One Step for Today</p>
          <h2 className="font-display text-2xl text-white mb-3">{plan.todaysAction.title}</h2>
          <p className="font-body text-white/80 mb-6">{plan.todaysAction.description}</p>
          {plan.todaysAction.url && (
            <Link href={plan.todaysAction.url} className="btn-primary inline-block">
              I'm ready — let's do this
            </Link>
          )}
          <p className="font-body text-white/50 text-sm mt-3">Estimated time: {plan.todaysAction.estimatedMinutes} minutes</p>
        </div>

        <div className="border-t border-white/10" />

        <div className="bg-white/5 rounded-card p-8">
          <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-3">A Note from Bret</p>
          <div className="space-y-4 font-body text-white/80">
            <p>I built this because I'm living it right now. Not last year. Right now.</p>
            <p>I know what it feels like at 3am when the fear sets in. I know what it feels like to wonder if it's going to be ok.</p>
            <p>It is going to be ok. I promise you that. Not because I have all the answers — but because I've seen what happens when people stop trying to solve everything at once and just focus on today.</p>
            <p>You're not alone. We've got you.</p>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="text-center">
          <Link href="/platform/dashboard" className="btn-primary inline-block">
            Go to My Dashboard
          </Link>
          <p className="font-body text-white/50 text-sm mt-3">Your plan will be waiting for you there.</p>
        </div>

      </div>
    </div>
  )
}
