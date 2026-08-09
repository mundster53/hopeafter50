// ============================================================
// HopeAfter50 — Admin: single member detail page
// Bret-only. Server-rendered from Prisma. No mock data.
// ============================================================
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { ADMIN_EMAIL } from '@/lib/admin/auth'
import { labelFor, labelForList } from '@/lib/admin/assessmentLabels'
import { DeleteMemberButton } from '@/components/admin/DeleteMemberButton'
import { MessageMemberForm } from '@/components/admin/MessageMemberForm'
import type { Priority, TodayAction } from '@/types'

async function getMember(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      assessment: true,
      rebuildPlan: true,
      dailyEncouragements: { orderBy: { date: 'desc' }, take: 7 },
      partnerDonations: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const member = await getMember(params.id)
  if (!member) notFound()

  const supportRequests = await prisma.supportRequest.findMany({
    where: { email: member.email },
    orderBy: { createdAt: 'desc' },
  })

  const daysSinceJoined = Math.floor((Date.now() - member.createdAt.getTime()) / (24 * 60 * 60 * 1000))
  const a = member.assessment

  const questions: Array<[string, string]> = a
    ? [
        ['Age range', labelFor(member.ageRange)],
        ['Gender', labelFor(member.gender)],
        ['What happened', labelFor(a.situation)],
        ['Last role', a.lastRole || '—'],
        ['When it happened', a.jobLossDate ? formatMonth(a.jobLossDate) : '—'],
        ['How long they expect the rebuild to take', labelFor(a.rebuildDuration)],
        ['Primary fear', labelFor(a.primaryFear)],
        ['Clarity on direction', labelFor(a.clarityLevel)],
        ['Work interests', labelForList(a.workInterests)],
        ['Financial runway', labelFor(a.financialRunway)],
        ['Using savings', a.usingSavings ? 'Yes' : 'No'],
        ['Interview frequency', labelFor(a.interviewFrequency)],
        ['Has current resume', labelFor(a.hasCurrentResume)],
        ['Contact preference', labelFor(member.contactPreference)],
        ['Faith-based encouragement', member.faithBasedEncouragement ? 'Yes' : 'No'],
        ['Additional context', a.additionalContext || '—'],
        ['What success looks like', a.successVision || '—'],
      ]
    : []

  const plan = member.rebuildPlan
  const priorities = (plan?.topPriorities as unknown as Priority[]) ?? []
  const todaysAction = plan?.todaysAction as unknown as TodayAction | undefined

  return (
    <div className="min-h-screen bg-navy">
      <nav className="bg-navy border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-white font-bold text-lg">Hope After 50</Link>
        <span className="font-body text-amber-hope text-sm">Admin</span>
      </nav>

      <div className="max-w-wide mx-auto px-6 py-8 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="font-body text-sm text-white/50 hover:text-white/80">&larr; Back to dashboard</Link>
            <h1 className="font-display text-2xl text-white mt-2">{member.firstName || 'Unnamed'}</h1>
            <p className="font-body text-white/60">{member.email}</p>
          </div>
        </div>

        {/* Profile summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Joined" value={formatDate(member.createdAt)} />
          <Stat label="Days Since Joined" value={String(daysSinceJoined)} />
          <Stat label="Resume Uploaded" value={member.baseResumeFileUrl || member.baseResumeText ? `Yes — ${member.baseResumeSetAt ? formatDate(member.baseResumeSetAt) : ''}` : 'No'} />
          <Stat label="Partner" value={member.partnerDonations[0] ? 'Yes' : 'No'} />
        </section>

        {/* Assessment */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Assessment</h2>
          {a ? (
            <div className="bg-white/5 border border-white/10 rounded-card divide-y divide-white/5">
              {questions.map(([label, value]) => (
                <div key={label} className="px-5 py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                  <p className="font-body text-white/50 text-sm sm:col-span-1">{label}</p>
                  <p className="font-body text-white/90 text-sm sm:col-span-2">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-white/40 bg-white/5 border border-white/10 rounded-card px-5 py-6 text-center">
              This member hasn&apos;t completed their assessment yet.
            </p>
          )}
        </section>

        {/* Rebuild plan */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Rebuild Plan</h2>
          {plan ? (
            <div className="bg-white/5 border border-white/10 rounded-card p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat label="Financial Urgency" value={`${plan.financialUrgency} / 5`} />
                <Stat label="Current Stage" value={plan.currentStage} />
                <Stat label="Progress" value={`${plan.progressPercent}%`} />
              </div>
              {todaysAction && (
                <div>
                  <p className="font-body text-white/50 text-sm mb-1">Today&apos;s Action</p>
                  <p className="font-body text-white/90">{todaysAction.title} — {todaysAction.description}</p>
                </div>
              )}
              {priorities.length > 0 && (
                <div>
                  <p className="font-body text-white/50 text-sm mb-1">Top Priorities</p>
                  <ol className="font-body text-white/90 list-decimal list-inside space-y-1">
                    {priorities.map((p) => (
                      <li key={p.rank}>{p.label} — {p.description}</li>
                    ))}
                  </ol>
                </div>
              )}
              {plan.strengths.length > 0 && (
                <div>
                  <p className="font-body text-white/50 text-sm mb-1">Strengths</p>
                  <p className="font-body text-white/90">{plan.strengths.join(', ')}</p>
                </div>
              )}
              {plan.watchItems.length > 0 && (
                <div>
                  <p className="font-body text-white/50 text-sm mb-1">Watch Items</p>
                  <p className="font-body text-white/90">{plan.watchItems.join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="font-body text-white/40 bg-white/5 border border-white/10 rounded-card px-5 py-6 text-center">
              No rebuild plan generated yet.
            </p>
          )}
        </section>

        {/* Daily encouragement history */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Daily Encouragement — Last 7 Days</h2>
          {member.dailyEncouragements.length > 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-card divide-y divide-white/5">
              {member.dailyEncouragements.map((d) => (
                <div key={d.id} className="px-5 py-3">
                  <p className="font-body text-white/50 text-xs">{d.date}{d.emailSentAt ? ' · emailed' : ''}</p>
                  <p className="font-body text-white/90 text-sm mt-1">{d.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-white/40 bg-white/5 border border-white/10 rounded-card px-5 py-6 text-center">
              No daily encouragements yet.
            </p>
          )}
        </section>

        {/* Support requests */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Support Requests</h2>
          {supportRequests.length > 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-card divide-y divide-white/5">
              {supportRequests.map((r) => (
                <div key={r.id} className="px-5 py-3">
                  <p className="font-body text-white/50 text-xs">{formatDate(r.createdAt)} · {r.resolved ? 'Resolved' : 'Open'}</p>
                  <p className="font-body text-white/90 text-sm mt-1">{r.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-white/40 bg-white/5 border border-white/10 rounded-card px-5 py-6 text-center">
              No support requests from this member.
            </p>
          )}
        </section>

        {/* Direct message */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Send a Message</h2>
          <div className="bg-white/5 border border-white/10 rounded-card p-5">
            <MessageMemberForm memberId={member.id} />
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <DeleteMemberButton memberId={member.id} variant="full" redirectTo="/admin" />
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-card p-4">
      <p className="font-body text-white/60 text-xs">{label}</p>
      <p className="font-display text-lg text-white mt-1">{value}</p>
    </div>
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}
