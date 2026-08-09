// ============================================================
// HopeAfter50 — Admin: single partner detail page
// Bret-only. Server-rendered from Prisma. No mock data.
// ============================================================
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { ADMIN_EMAIL } from '@/lib/admin/auth'
import { DeletePartnerButton } from '@/components/admin/DeletePartnerButton'
import { MessagePartnerForm } from '@/components/admin/MessagePartnerForm'

export default async function PartnerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  const partner = await prisma.partner.findUnique({ where: { id: params.id } })
  if (!partner) notFound()

  const allDonations = await prisma.partner.findMany({
    where: { email: partner.email },
    orderBy: { createdAt: 'desc' },
  })

  const member = await prisma.member.findUnique({
    where: { email: partner.email },
    include: { weeklyCheckIns: { orderBy: { submittedAt: 'desc' }, take: 1 } },
  })

  const employmentStatus = member
    ? member.weeklyCheckIns[0]
      ? member.weeklyCheckIns[0].newEmployment
        ? 'Employed'
        : 'Not yet employed'
      : 'Unknown'
    : 'Unknown'

  return (
    <div className="min-h-screen bg-navy">
      <nav className="bg-navy border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-white font-bold text-lg">Hope After 50</Link>
        <span className="font-body text-amber-hope text-sm">Admin</span>
      </nav>

      <div className="max-w-wide mx-auto px-6 py-8 space-y-10">
        <div>
          <Link href="/admin" className="font-body text-sm text-white/50 hover:text-white/80">&larr; Back to dashboard</Link>
          <h1 className="font-display text-2xl text-white mt-2">{partner.organizationName || partner.email}</h1>
          <p className="font-body text-white/60">{partner.email}</p>
        </div>

        {/* Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Organization" value={partner.organizationName || '—'} />
          <Stat label="Amount" value={formatCents(partner.amount)} />
          <Stat label="Type" value={partner.interval === 'monthly' ? 'Monthly' : 'One-Time'} />
          <Stat label="Status" value={partner.status} capitalize />
          <Stat label="Date Joined" value={formatDate(partner.createdAt)} />
          <Stat label="Also a Member" value={member ? 'Yes' : 'No'} />
          {member && <Stat label="Employment Status" value={employmentStatus} />}
        </section>

        {member && (
          <p className="font-body text-white/70">
            This partner is also a member.{' '}
            <Link href={`/admin/members/${member.id}`} className="text-amber-hope hover:underline">
              View member profile →
            </Link>
          </p>
        )}

        {/* Payments */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Payments &amp; Donations</h2>
          <div className="bg-white/5 border border-white/10 rounded-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 border-b border-white/10">
                  <th className="px-4 py-3 font-body font-medium">Amount</th>
                  <th className="px-4 py-3 font-body font-medium">Type</th>
                  <th className="px-4 py-3 font-body font-medium">Date</th>
                  <th className="px-4 py-3 font-body font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {allDonations.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 last:border-0 text-white/80">
                    <td className="px-4 py-3">{formatCents(d.amount)}</td>
                    <td className="px-4 py-3">{d.interval === 'monthly' ? 'Monthly' : 'One-Time'}</td>
                    <td className="px-4 py-3">{formatDate(d.createdAt)}</td>
                    <td className="px-4 py-3 capitalize">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Direct message */}
        <section>
          <h2 className="font-display text-lg text-white mb-3">Send a Message</h2>
          <div className="bg-white/5 border border-white/10 rounded-card p-5">
            <MessagePartnerForm partnerId={partner.id} />
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <DeletePartnerButton partnerId={partner.id} variant="full" redirectTo="/admin" />
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-card p-4">
      <p className="font-body text-white/60 text-xs">{label}</p>
      <p className={`font-display text-lg text-white mt-1 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  )
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
