// ============================================================
// HopeAfter50 — Daily Word API
// Returns (and caches) today's Daily Word for the signed-in member.
// ============================================================
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDailyEncouragement, chicagoHour, greetingFor } from '@/lib/ai/dailyEncouragement'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const now = new Date()
    const encouragement = await getDailyEncouragement(session.user.id, now)
    if (!encouragement) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404 })
    }

    const hour = chicagoHour(now)
    return NextResponse.json({
      success: true,
      message: encouragement.message,
      greeting: greetingFor(hour),
      isLateNight: hour >= 0 && hour < 5,
    })
  } catch (err) {
    console.error('Daily Word API error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
