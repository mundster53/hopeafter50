// ============================================================
// HopeAfter50 — "What's My Dream?"
// A guided conversation (prompts/dream.md) that helps a member name
// what they were uniquely made to do.
// ============================================================
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PlatformNav from '@/components/platform/PlatformNav'
import DreamChat from '@/components/dream/DreamChat'

export default async function DreamPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <PlatformNav />
      <DreamChat />
    </div>
  )
}
