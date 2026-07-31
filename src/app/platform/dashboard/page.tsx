// ============================================================
// HopeAfter50 — Member Dashboard
// Artifact 4 — the daily operating center
// TODO: replace mock data with real session + DB queries
// ============================================================
'use client'

import Link from 'next/link'
import { TOOLS } from '@/lib/tools'
import { STAGE_LABELS } from '@/lib/rebuild-engine'
import { RebuildStage, ToolId } from '@/types'

// Mock data — replace with real data from DB/session
const MOCK = {
  name: 'Bret',
  currentFocus: 'Replace Income',
  stage: 'execute' as RebuildStage,
  progressPercent: 40,
  financialRunway: 'Approximately 4 Months',
  nextAction: {
    title: 'Optimize Your Resume',
    estimatedMinutes: 30,
    url: '/platform/tools/resume',
  },
  todayActions: [
    { label: 'Resume Optimization', url: '/platform/tools/resume', done: false },
    { label: 'LinkedIn Optimization', url: '/platform/tools/linkedin', done: false },
    { label: 'Executive Job Strategy', url: '/platform/tools/income-strategy', done: false },
  ],
  activeTools: ['resume_optimizer', 'linkedin_optimizer', 'income_strategy', 'financial_runway'] as ToolId[],
  recentWins: ['Assessment Completed'],
  unreadMessages: 0,
  faithBased: true,
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Platform Nav */}
      <nav className="bg-navy border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-white font-bold text-lg">HopeAfter50</Link>
        <div className="flex items-center gap-6">
          <Link href="/platform/tools/resume" className="font-body text-white/70 hover:text-white text-sm transition-colors">Tools</Link>
          <Link href="/resources" className="font-body text-white/70 hover:text-white text-sm transition-colors">Resources</Link>
          <button className="font-body text-white/70 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </nav>

      <div className="max-wide mx-auto px-6 py-8">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-display text-display-sm text-navy">Good Morning, {MOCK.name}.</h1>
          <p className="font-body text-slate-supporting mt-1">Welcome back. Today is about progress, not perfection.</p>
        </div>

        {/* Four Anchors — always at top */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Anchor
            label="My Current Focus"
            value={MOCK.currentFocus}
            sub={`${STAGE_LABELS[MOCK.stage]} Stage`}
          />
          <Anchor
            label="My Next Step"
            value={MOCK.nextAction.title}
            sub={`Est. ${MOCK.nextAction.estimatedMinutes} min`}
            action={{ label: 'Continue', href: MOCK.nextAction.url }}
          />
          <Anchor
            label="My Financial Runway"
            value={MOCK.financialRunway}
            action={{ label: 'Update', href: '/platform/tools/income-strategy?tab=runway' }}
          />
          <div className="card">
            <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">My Rebuild Progress</p>
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${MOCK.progressPercent}%` }} />
            </div>
            <p className="font-body text-sm text-navy font-medium">{MOCK.progressPercent}%</p>
            <p className="font-body text-slate-supporting text-xs mt-1">Every completed action advances your rebuild.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Today's Actions */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Today's Actions</p>
              <p className="font-body text-slate-supporting text-sm mb-4">Complete these in any order.</p>
              <div className="space-y-3">
                {MOCK.todayActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.url}
                    className="flex items-center gap-3 p-3 rounded-card border-2 border-sage hover:border-amber-hope transition-colors"
                  >
                    <div className={`w-5 h-5 rounded border-2 shrink-0 ${action.done ? 'bg-amber-hope border-amber-hope' : 'border-slate-supporting'}`} />
                    <span className="font-body text-navy">{action.label}</span>
                    <span className="ml-auto text-slate-supporting text-sm">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* My Toolbox */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">My Toolbox</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {MOCK.activeTools.map((id) => {
                  const tool = TOOLS[id]
                  if (!tool) return null
                  return (
                    <Link
                      key={id}
                      href={tool.href}
                      className="flex items-start gap-3 p-4 rounded-card bg-sage hover:bg-amber-pale transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-hope mt-2 shrink-0" />
                      <div>
                        <p className="font-body text-navy font-medium text-sm">{tool.label}</p>
                        <p className="font-body text-slate-supporting text-xs mt-0.5">{tool.estimatedMinutes} min</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Wins */}
            {MOCK.recentWins.length > 0 && (
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Recent Wins</p>
                <div className="space-y-2">
                  {MOCK.recentWins.map((win) => (
                    <div key={win} className="flex items-center gap-3">
                      <span className="text-amber-hope">✓</span>
                      <span className="font-body text-navy text-sm">{win}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Messages */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Messages</p>
              {MOCK.unreadMessages > 0 ? (
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-hope text-white text-xs flex items-center justify-center font-bold">{MOCK.unreadMessages}</span>
                  <span className="font-body text-navy text-sm">Unread messages</span>
                </div>
              ) : (
                <p className="font-body text-slate-supporting text-sm mb-3">No unread messages.</p>
              )}
              <Link href="/platform/messages" className="btn-primary text-sm py-2 px-4 inline-block">Open Inbox</Link>
            </div>

            {/* My Guide */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">My Guide</p>
              <p className="font-body text-slate-supporting text-sm mb-3">Need to ask a question?</p>
              <div className="space-y-2">
                <Link href="/platform/messages" className="block font-body text-amber-hope text-sm hover:underline">Message our team</Link>
                <Link href="/platform/ai" className="block font-body text-amber-hope text-sm hover:underline">Ask AI</Link>
                <Link href="/schedule" className="block font-body text-amber-hope text-sm hover:underline">Schedule a conversation</Link>
              </div>
            </div>

            {/* Faith-based (optional) */}
            {MOCK.faithBased && (
              <div className="card bg-sage border border-sage">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Prayer & Encouragement</p>
                <p className="font-display text-navy text-sm italic mb-3">"I can do all things through Christ who strengthens me."</p>
                <div className="space-y-1">
                  <Link href="/platform/community?tab=prayer" className="block font-body text-amber-hope text-sm hover:underline">Prayer Requests</Link>
                  <Link href="/platform/community?tab=praise" className="block font-body text-amber-hope text-sm hover:underline">Praise Reports</Link>
                  <Link href="/platform/community?tab=testimony" className="block font-body text-amber-hope text-sm hover:underline">Share a Testimony</Link>
                </div>
              </div>
            )}

            {/* Learning Center */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Learning Center</p>
              <p className="font-body text-slate-supporting text-xs mb-3">Recommended for you</p>
              <div className="space-y-2">
                {['AI Resume Guide', 'Networking Strategies', 'Executive Interview Prep', 'Financial Recovery'].map((r) => (
                  <Link key={r} href="/resources" className="block font-body text-amber-hope text-sm hover:underline">{r}</Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-sage flex flex-wrap gap-6 text-sm">
          <Link href="/help" className="font-body text-slate-supporting hover:text-navy">Need Help?</Link>
          <Link href="/platform/messages" className="font-body text-slate-supporting hover:text-navy">Message Us</Link>
          <Link href="/schedule" className="font-body text-slate-supporting hover:text-navy">Schedule a Conversation</Link>
          <Link href="/resources" className="font-body text-slate-supporting hover:text-navy">Resources</Link>
          <Link href="/privacy-policy" className="font-body text-slate-supporting hover:text-navy">Privacy</Link>
        </div>

      </div>
    </div>
  )
}

function Anchor({ label, value, sub, action }: {
  label: string
  value: string
  sub?: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="card">
      <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-2">{label}</p>
      <p className="font-display text-lg text-navy font-medium mb-1">{value}</p>
      {sub && <p className="font-body text-slate-supporting text-xs mb-3">{sub}</p>}
      {action && (
        <Link href={action.href} className="font-body text-amber-hope text-sm font-medium hover:underline">
          {action.label} →
        </Link>
      )}
    </div>
  )
}
