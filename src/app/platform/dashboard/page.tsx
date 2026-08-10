// ============================================================
// HopeAfter50 — Member Dashboard
// Artifact 4 — the daily operating center
// Server-rendered from the authenticated session + Prisma. No mock data.
// ============================================================

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getMemberForSession, buildDashboardViewModel } from '@/lib/db/queries'
import { TOOLS } from '@/lib/tools'
import { STAGE_LABELS } from '@/lib/rebuild-engine'
import { ToolId } from '@/types'
import PlatformNav from '@/components/platform/PlatformNav'
import { getDailyEncouragement, chicagoHour, greetingFor } from '@/lib/ai/dailyEncouragement'
import { ADMIN_EMAIL } from '@/lib/admin/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const member = await getMemberForSession(session.user.id)
  if (!member) {
    redirect('/auth/signin')
  }

  const data = buildDashboardViewModel(member)

  const now = new Date()
  const hour = chicagoHour(now)
  const greeting = greetingFor(hour)
  const isLateNight = hour >= 0 && hour < 5
  const dailyEncouragement = await getDailyEncouragement(session.user.id, now).catch(() => null)

  return (
    <div className="min-h-screen bg-navy">
      <PlatformNav />

      <div className="max-wide mx-auto px-6 py-8">

        {/* TEMP DEBUG — remove before shipping. Shows admin-gate values for all users. */}
        <div className="bg-red-900/80 text-white text-xs font-mono p-4 mb-4 rounded-card border-2 border-red-500">
          <p>DEBUG session?.user?.email: {JSON.stringify(session?.user?.email)}</p>
          <p>DEBUG ADMIN_EMAIL: {JSON.stringify(ADMIN_EMAIL)}</p>
          <p>DEBUG match: {JSON.stringify(session?.user?.email === ADMIN_EMAIL)}</p>
        </div>

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-display text-display-sm text-white">{data.firstName ? `Welcome back, ${data.firstName}` : 'Welcome'}</h1>
          <p className="font-body text-white/70 mt-1">Here's your one step for today.</p>
        </div>

        {/* Daily Word — a personal note before the day's task */}
        {dailyEncouragement && (
          <div className="bg-white/5 rounded-card p-6 mb-4">
            <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-3">
              Your Daily Word · Day {data.daysOnJourney}
            </p>
            <p className="font-body text-white/70 text-sm mb-2">
              {greeting}{data.firstName ? `, ${data.firstName}` : ''}.
            </p>
            <p className="font-display text-white text-lg leading-relaxed">{dailyEncouragement.message}</p>
            {isLateNight && (
              <p className="font-body text-white/70 text-sm mt-4 italic">
                Most problems look smaller in the morning. Rest if you can.
              </p>
            )}
          </div>
        )}

        {/* The one thing — always the first, unmissable thing on the page */}
        {!data.hasAssessment ? (
          <div className="bg-amber-hope text-white rounded-card p-8 md:p-12 mb-4">
            <h2 className="font-display text-display-md mb-4">Help us understand what you're feeling.</h2>
            <p className="font-body text-white/90 text-lg mb-8 max-w-2xl">
              Tell us where you are emotionally, what you're going through, and what you need right now.
              We'll use that to build a plan that gives you hope and a path forward.
            </p>
            <Link href="/platform/assessment" className="inline-block bg-white text-navy font-body font-semibold px-8 py-4 rounded-card text-lg hover:bg-white/90 transition-colors">
              I'm ready — let's do this
            </Link>
            <p className="font-body text-white/70 text-sm mt-4">Takes about 5 minutes. No wrong answers.</p>
          </div>
        ) : (
          <div className="bg-amber-hope text-white rounded-card p-8 md:p-12 mb-4">
            <p className="font-body text-white/90 text-xs tracking-widest uppercase mb-3">Today's Action</p>
            <h2 className="font-display text-display-md mb-4">{data.nextAction.title}</h2>
            <p className="font-body text-white/90 text-lg mb-8 max-w-2xl">
              Est. {data.nextAction.estimatedMinutes} min. This is the one thing to focus on right now.
            </p>
            <Link href={data.nextAction.url ?? '#'} className="inline-block bg-white text-navy font-body font-semibold px-8 py-4 rounded-card text-lg hover:bg-white/90 transition-colors">
              Continue →
            </Link>
          </div>
        )}
        <p className="font-body text-white font-semibold text-lg mt-4 mb-8">Complete this step first. Everything else can wait.</p>

        {/* Four Anchors — always at top */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Anchor
            label="My Current Focus"
            value={data.currentFocus}
            sub={`${STAGE_LABELS[data.currentStage]} Stage`}
          />
          <Anchor
            label="My Next Step"
            value={data.nextAction.title}
            sub={`Est. ${data.nextAction.estimatedMinutes} min`}
            action={data.nextAction.url ? { label: 'Continue', href: data.nextAction.url } : undefined}
          />
          <Anchor
            label="My Savings Timeline"
            value={data.financialRunway}
            action={{ label: 'Update', href: '/platform/tools/income-strategy?tab=runway' }}
          />
          <div className="bg-white/5 rounded-card p-6">
            <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-2">My Rebuild Progress</p>
            <div className="progress-bar mb-2">
              <div className="progress-fill" style={{ width: `${data.progressPercent}%` }} />
            </div>
            <p className="font-body text-sm text-white font-medium">{data.progressPercent}%</p>
            <p className="font-body text-white/70 text-xs mt-1">Every completed action advances your rebuild.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Today's Actions */}
            {data.todayActions.length > 0 && (
              <div className="bg-white/5 rounded-card p-6">
                <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-1">When You're Ready for More</p>
                <p className="font-body text-white/70 text-sm mb-4">These are here whenever you want them. No pressure.</p>
                <div className="space-y-3">
                  {data.todayActions.map(({ toolId, done }) => {
                    const tool = TOOLS[toolId as ToolId]
                    if (!tool) return null
                    return (
                      <Link
                        key={toolId}
                        href={tool.href}
                        className="flex items-center gap-3 p-3 rounded-card border-2 border-white/10 hover:border-amber-hope transition-colors"
                      >
                        <div className={`w-5 h-5 rounded border-2 shrink-0 ${done ? 'bg-amber-hope border-amber-hope' : 'border-white/40'}`} />
                        <span className="font-body text-white">{tool.label}</span>
                        <span className="ml-auto text-white/70 text-sm">→</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* My Toolbox */}
            <div className="bg-white/5 rounded-card p-6">
              <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-1">Your Tools</p>
              <p className="font-body text-white/70 text-sm mb-4">Use these at your own pace, in any order.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.recommendedToolIds.map((id) => {
                  const tool = TOOLS[id as ToolId]
                  if (!tool) return null
                  return (
                    <Link
                      key={id}
                      href={tool.href}
                      className="flex items-start gap-3 p-4 rounded-card bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-hope mt-2 shrink-0" />
                      <div>
                        <p className="font-body text-white font-medium text-sm">{tool.label}</p>
                        <p className="font-body text-white/70 text-xs mt-0.5">{tool.estimatedMinutes} min</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Wins */}
            {data.recentWins.length > 0 && (
              <div className="bg-white/5 rounded-card p-6">
                <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-3">Recent Wins</p>
                <div className="space-y-2">
                  {data.recentWins.map((win) => (
                    <div key={win} className="flex items-center gap-3">
                      <span className="text-amber-hope">✓</span>
                      <span className="font-body text-white text-sm">{win}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Messages */}
            <div className="bg-white/5 rounded-card p-6">
              <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-3">Messages</p>
              {data.unreadMessages > 0 ? (
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-hope text-white text-xs flex items-center justify-center font-bold">{data.unreadMessages}</span>
                  <span className="font-body text-white text-sm">Unread messages</span>
                </div>
              ) : (
                <p className="font-body text-white/70 text-sm mb-3">No unread messages.</p>
              )}
              <Link href="/platform/messages" className="btn-primary text-sm py-2 px-4 inline-block">Open Inbox</Link>
            </div>

            {/* My Guide */}
            <div className="bg-white/5 rounded-card p-6">
              <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-3">My Guide</p>
              <p className="font-body text-white/70 text-sm mb-3">Need to ask a question?</p>
              <div className="space-y-2">
                <Link href="/platform/messages" className="block font-body text-amber-hope text-sm hover:underline">Message our team</Link>
                <Link href="/platform/ai" className="block font-body text-amber-hope text-sm hover:underline">Ask AI</Link>
                <Link href="/schedule" className="block font-body text-amber-hope text-sm hover:underline">Schedule a conversation</Link>
              </div>
            </div>

            {/* Faith-based (optional) */}
            {data.faithBased && (
              <div className="bg-white/5 rounded-card p-6 border border-white/10">
                <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-3">Prayer & Encouragement</p>
                <p className="font-display text-white text-sm italic mb-3">"I can do all things through Christ who strengthens me."</p>
                <div className="space-y-1">
                  <Link href="/platform/community?tab=prayer" className="block font-body text-amber-hope text-sm hover:underline">Prayer Requests</Link>
                  <Link href="/platform/community?tab=praise" className="block font-body text-amber-hope text-sm hover:underline">Praise Reports</Link>
                  <Link href="/platform/community?tab=testimony" className="block font-body text-amber-hope text-sm hover:underline">Share a Testimony</Link>
                </div>
              </div>
            )}

            {/* Learning Center */}
            <div className="bg-white/5 rounded-card p-6">
              <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-3">Learning Center</p>
              <p className="font-body text-white/70 text-xs mb-3">Recommended for you</p>
              <div className="space-y-2">
                {['AI Resume Guide', 'Networking Strategies', 'Executive Interview Prep', 'Financial Recovery'].map((r) => (
                  <Link key={r} href="/resources" className="block font-body text-amber-hope text-sm hover:underline">{r}</Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-6 text-sm">
          <Link href="/platform/support" className="font-body text-white/70 hover:text-white">Need Help?</Link>
          <Link href="/platform/messages" className="font-body text-white/70 hover:text-white">Message Us</Link>
          <Link href="/schedule" className="font-body text-white/70 hover:text-white">Schedule a Conversation</Link>
          <Link href="/resources" className="font-body text-white/70 hover:text-white">Resources</Link>
          <Link href="/privacy-policy" className="font-body text-white/70 hover:text-white">Privacy</Link>
          {session.user.email === ADMIN_EMAIL && (
            <Link href="/admin" className="font-body text-white/40 hover:text-white/70 ml-auto">Admin</Link>
          )}
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
    <div className="bg-white/5 rounded-card p-6">
      <p className="font-body text-white/70 text-xs tracking-widest uppercase mb-2">{label}</p>
      <p className="font-display text-lg text-white font-medium mb-1">{value}</p>
      {sub && <p className="font-body text-white/70 text-xs mb-3">{sub}</p>}
      {action && (
        <Link href={action.href} className="font-body text-amber-hope text-sm font-medium hover:underline">
          {action.label} →
        </Link>
      )}
    </div>
  )
}
