// ============================================================
// HopeAfter50 — Admin Dashboard
// Bret-only. Server-rendered from Prisma. No mock data.
// ============================================================
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { ADMIN_EMAIL } from '@/lib/admin/auth'
import { DeleteMemberButton } from '@/components/admin/DeleteMemberButton'
import { ResolvedToggle } from '@/components/admin/ResolvedToggle'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalMembers,
    assessmentsCompleted,
    activePartners,
    monthlyRevenue,
    openSupportRequests,
    members,
    partners,
    supportRequests,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.assessment.count(),
    prisma.partner.count({ where: { status: 'active' } }),
    prisma.partner.aggregate({ where: { interval: 'monthly' }, _sum: { amount: true } }),
    prisma.supportRequest.count({ where: { resolved: false } }),
    prisma.member.findMany({
      include: {
        assessment: { select: { id: true } },
        partnerDonations: { orderBy: { createdAt: 'desc' }, take: 1 },
        weeklyCheckIns: { orderBy: { submittedAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.partner.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.supportRequest.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  const activeLast7Days = members.filter((m) => {
    const lastActive = m.weeklyCheckIns[0]?.submittedAt ?? m.updatedAt
    return lastActive >= sevenDaysAgo
  }).length

  const monthlyRevenueCents = monthlyRevenue._sum.amount ?? 0

  const cards = [
    { label: 'Total Members', value: totalMembers.toLocaleString() },
    { label: 'Assessments Completed', value: assessmentsCompleted.toLocaleString() },
    { label: 'Active Partners', value: activePartners.toLocaleString() },
    { label: 'Monthly Revenue', value: formatCents(monthlyRevenueCents) },
    { label: 'Open Support Requests', value: openSupportRequests.toLocaleString() },
    { label: 'Active in Last 7 Days', value: activeLast7Days.toLocaleString() },
  ]

  return (
    <div className="min-h-screen bg-navy">
      <nav className="bg-navy border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-white font-bold text-lg">Hope After 50</Link>
        <span className="font-body text-amber-hope text-sm">Admin</span>
      </nav>

      <div className="max-w-wide mx-auto px-6 py-8 space-y-10">
        <div>
          <h1 className="font-display text-2xl text-white">Admin Dashboard</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-card p-5">
              <p className="font-body text-white/60 text-xs">{card.label}</p>
              <p className="font-display text-2xl text-white mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Members table */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Members</h2>
          <div className="bg-white/5 border border-white/10 rounded-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 border-b border-white/10">
                  <th className="px-4 py-3 font-body font-medium">Name / Email</th>
                  <th className="px-4 py-3 font-body font-medium">Days Since Joined</th>
                  <th className="px-4 py-3 font-body font-medium">Assessment</th>
                  <th className="px-4 py-3 font-body font-medium">Resume Uploaded</th>
                  <th className="px-4 py-3 font-body font-medium">Partner</th>
                  <th className="px-4 py-3 font-body font-medium">Last Active</th>
                  <th className="px-4 py-3 font-body font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const lastActive = member.weeklyCheckIns[0]?.submittedAt ?? member.updatedAt
                  const daysSinceJoined = Math.floor(
                    (Date.now() - member.createdAt.getTime()) / (24 * 60 * 60 * 1000)
                  )
                  return (
                    <tr key={member.id} className="border-b border-white/5 last:border-0 text-white/80 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <Link href={`/admin/members/${member.id}`} className="block hover:text-amber-light">
                          <span className="block text-white">{member.firstName || 'Unnamed'}</span>
                          <span className="block text-white/50 text-xs">{member.email}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/members/${member.id}`} className="block">{daysSinceJoined}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/members/${member.id}`} className="block">{member.assessment ? 'Yes' : 'No'}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/members/${member.id}`} className="block">
                          {member.baseResumeFileUrl || member.baseResumeText ? 'Yes' : 'No'}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/members/${member.id}`} className="block">{member.partnerDonations[0] ? 'Yes' : 'No'}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/members/${member.id}`} className="block">{formatDate(lastActive)}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <DeleteMemberButton memberId={member.id} />
                      </td>
                    </tr>
                  )
                })}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-white/40">No members yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Partners table */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Partners</h2>
          <div className="bg-white/5 border border-white/10 rounded-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 border-b border-white/10">
                  <th className="px-4 py-3 font-body font-medium">Email</th>
                  <th className="px-4 py-3 font-body font-medium">Amount</th>
                  <th className="px-4 py-3 font-body font-medium">Type</th>
                  <th className="px-4 py-3 font-body font-medium">Date</th>
                  <th className="px-4 py-3 font-body font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-white/5 last:border-0 text-white/80">
                    <td className="px-4 py-3">{partner.email}</td>
                    <td className="px-4 py-3">{formatCents(partner.amount)}</td>
                    <td className="px-4 py-3">{partner.interval === 'monthly' ? 'Monthly' : 'One-Time'}</td>
                    <td className="px-4 py-3">{formatDate(partner.createdAt)}</td>
                    <td className="px-4 py-3 capitalize">{partner.status}</td>
                  </tr>
                ))}
                {partners.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-white/40">No partners yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Support requests */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Support Requests</h2>
          <div className="bg-white/5 border border-white/10 rounded-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 border-b border-white/10">
                  <th className="px-4 py-3 font-body font-medium">Name</th>
                  <th className="px-4 py-3 font-body font-medium">Email</th>
                  <th className="px-4 py-3 font-body font-medium">Message</th>
                  <th className="px-4 py-3 font-body font-medium">Date</th>
                  <th className="px-4 py-3 font-body font-medium">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {supportRequests.map((request) => (
                  <tr key={request.id} className="border-b border-white/5 last:border-0 text-white/80 align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{request.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{request.email}</td>
                    <td className="px-4 py-3 max-w-md">{truncate(request.message, 120)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(request.createdAt)}</td>
                    <td className="px-4 py-3">
                      <ResolvedToggle id={request.id} resolved={request.resolved} />
                    </td>
                  </tr>
                ))}
                {supportRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-white/40">No support requests yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}
