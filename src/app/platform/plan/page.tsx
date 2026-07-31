// ============================================================
// HopeAfter50 — Personalized Rebuild Plan
// Artifact 3 — displayed immediately after assessment
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { RebuildPlan } from '@/types'
import { STAGE_LABELS, STAGE_DESCRIPTIONS, FINANCIAL_URGENCY_LABELS } from '@/lib/rebuild-engine'
import { TOOLS } from '@/lib/tools'

export default function PlanPage() {
  const [plan, setPlan] = useState<RebuildPlan | null>(null)
  const [name, setName] = useState('Friend')

  useEffect(() => {
    const stored = sessionStorage.getItem('rebuildPlan')
    const storedName = sessionStorage.getItem('memberName')
    if (stored) setPlan(JSON.parse(stored))
    if (storedName) setName(storedName)
  }, [])

  if (!plan) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <p className="font-body text-slate-supporting">Loading your plan...</p>
      </div>
    )
  }

  const runwayLabel = FINANCIAL_URGENCY_LABELS[plan.financialUrgency]
  const stageLabel = STAGE_LABELS[plan.currentStage]
  const stageDesc = STAGE_DESCRIPTIONS[plan.currentStage]

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-navy py-4 px-6">
        <p className="font-display text-white text-lg font-bold max-wide mx-auto">HopeAfter50</p>
      </div>

      <div className="max-content mx-auto px-6 py-12 space-y-10">

        {/* Greeting */}
        <div>
          <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-2">Your Rebuild Plan</p>
          <h1 className="font-display text-display-md text-navy mb-4">{name},</h1>
          <div className="bg-sage rounded-card p-6 space-y-2">
            <p className="font-body text-navy">We've finished building your initial Rebuild Plan.</p>
            <p className="font-body text-navy">First — take a breath.</p>
            <p className="font-body text-slate-supporting">You do not have to solve your entire future today. You only need to take the next step. That's what we're going to help you do.</p>
          </div>
        </div>

        {/* Current Stage */}
        <div className="card">
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">Your Current Stage</p>
          <div className="flex items-center gap-3 mb-2">
            <span className="stage-badge">{stageLabel}</span>
          </div>
          <p className="font-body text-slate-supporting">{stageDesc}</p>
        </div>

        {/* Highest Priority */}
        <div className="card border-l-4 border-amber-hope">
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">Your Highest Priority</p>
          <h2 className="font-display text-xl text-navy">{plan.topPriorities[0]?.label}</h2>
          <p className="font-body text-slate-supporting mt-1">Everything else becomes easier once this is addressed.</p>
        </div>

        {/* Today's Action */}
        <div className="bg-navy rounded-card p-6">
          <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-2">Today's First Step</p>
          <h3 className="font-display text-xl text-white mb-1">{plan.todaysAction.title}</h3>
          <p className="font-body text-white/70 mb-1">{plan.todaysAction.description}</p>
          <p className="font-body text-white/50 text-sm mb-4">Estimated time: {plan.todaysAction.estimatedMinutes} minutes</p>
          {plan.todaysAction.url && (
            <Link href={plan.todaysAction.url} className="btn-primary inline-block">
              Continue →
            </Link>
          )}
        </div>

        {/* Top 3 Actions */}
        <div>
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Your Top Three Actions</p>
          <div className="space-y-4">
            {plan.topPriorities.map((p) => {
              const tool = p.toolId ? TOOLS[p.toolId as keyof typeof TOOLS] : null
              return (
                <div key={p.rank} className="card flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-pale flex items-center justify-center shrink-0">
                    <span className="font-body font-bold text-amber-hope text-sm">{p.rank}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-navy font-medium">{p.label}</p>
                    <p className="font-body text-slate-supporting text-sm mt-1">{p.description}</p>
                    {tool && (
                      <Link href={tool.href} className="font-body text-amber-hope text-sm font-medium mt-2 inline-block hover:underline">
                        Open {tool.label} →
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="card">
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">Your Rebuild Progress</p>
          <div className="progress-bar mb-2">
            <div className="progress-fill" style={{ width: `${plan.progressPercent}%` }} />
          </div>
          <p className="font-body text-sm text-slate-supporting">{plan.progressPercent}% — Not because you've failed. Because today is Day One.</p>
        </div>

        {/* Financial Runway */}
        <div className="card">
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">Your Financial Runway</p>
          <p className="font-display text-xl text-navy">{runwayLabel}</p>
          <p className="font-body text-slate-supporting text-sm mt-1">This doesn't define you. It simply helps us prioritize.</p>
        </div>

        {/* Strengths */}
        <div className="card">
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Your Strengths</p>
          <div className="flex flex-wrap gap-2">
            {plan.strengths.map((s) => (
              <span key={s} className="bg-sage text-navy font-body text-sm px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        {/* Watch Items */}
        {plan.watchItems.length > 0 && (
          <div className="card border border-amber-pale">
            <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Things We Want to Watch</p>
            <p className="font-body text-slate-supporting text-sm mb-3">Long job searches often create these challenges. Recognizing them early helps us respond before they become overwhelming.</p>
            <div className="space-y-1">
              {plan.watchItems.map((w) => (
                <p key={w} className="font-body text-navy text-sm flex items-start gap-2">
                  <span className="text-amber-hope mt-0.5">→</span>{w}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Message from Bret */}
        <div className="bg-navy rounded-card p-6">
          <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-3">A Message from Bret</p>
          <div className="space-y-2 font-body text-white/80">
            <p>If you're anything like me, you've probably wondered: "Am I ever going to get through this?"</p>
            <p className="text-white">I have. You're not crazy. You're not weak. And you're certainly not alone.</p>
            <p>Let's focus on the next step. We'll worry about tomorrow... tomorrow.</p>
          </div>
        </div>

        {/* Today's Win */}
        <div className="card text-center">
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">Today's Win</p>
          <p className="font-display text-display-sm text-navy mb-2">You now have a plan.</p>
          <p className="font-body text-slate-supporting">Yesterday, everything was in your head. Today, you have direction. That matters.</p>
        </div>

        {/* Next Decision */}
        <div>
          <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Your Next Decision</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/platform/dashboard" className="card-hover text-center block p-6">
              <p className="font-display text-lg text-navy mb-1">Continue My Rebuild</p>
              <p className="font-body text-slate-supporting text-sm">Recommended</p>
            </Link>
            <Link href="/platform/tools/resume" className="card-hover text-center block p-6">
              <p className="font-display text-lg text-navy mb-1">Upload My Résumé</p>
              <p className="font-body text-slate-supporting text-sm">Optional — personalizes your plan further</p>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Link href="/contact" className="card-hover text-center block p-6">
              <p className="font-display text-lg text-navy">Send a Message</p>
            </Link>
            <Link href="/schedule" className="card-hover text-center block p-6">
              <p className="font-display text-lg text-navy">Schedule a Conversation</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
