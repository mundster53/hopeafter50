// ============================================================
// HopeAfter50 — Member Support
// A simple, human way to ask for help when something's not working
// ============================================================
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getMemberForSession } from '@/lib/db/queries'
import SupportForm from '@/components/platform/SupportForm'

export default async function SupportPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const member = await getMemberForSession(session.user.id)
  if (!member) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-navy">
      <div className="bg-navy py-4 px-6 flex items-center justify-between border-b border-white/10">
        <Link href="/platform/dashboard" className="font-display text-white font-bold">HopeAfter50</Link>
        <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white text-sm">← Dashboard</Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 space-y-8">

        <p className="font-body text-amber-hope text-xs tracking-widest uppercase">
          We're Here
        </p>

        <h1 className="font-display text-display-md text-white">
          Something not working?
        </h1>

        <p className="font-body text-white/70">
          Tell us what's going on. A real person will look at it and get back to you — usually within 24 hours.
        </p>

        <SupportForm
          initialName={member.firstName ?? ''}
          initialEmail={member.email ?? ''}
        />

      </div>
    </div>
  )
}
