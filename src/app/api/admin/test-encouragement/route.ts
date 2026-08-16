// ============================================================
// HopeAfter50 — Admin: send a test Daily Word email to Bret
// Wraps the daily encouragement cron with a fixed test recipient.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'

const TEST_EMAIL = 'bretjmundt@gmail.com'

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 500 })
  }

  const url = new URL('/api/cron/daily-encouragement', req.nextUrl.origin)
  url.searchParams.set('testEmail', TEST_EMAIL)

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${cronSecret}` },
    cache: 'no-store',
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || !data?.success) {
    return NextResponse.json(
      { error: data?.error ?? 'Failed to send test encouragement email.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ success: true, sent: data.sent, failed: data.failed })
}
