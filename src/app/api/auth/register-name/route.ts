// ============================================================
// HopeAfter50 — Pending Sign-In Name
// The sign-in form collects first/last name before the member
// clicks their magic link, so this stashes it keyed by email.
// Consumed (and deleted) by the createUser event in lib/auth.ts.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  const { email, firstName, lastName, layoffDate } = await req.json()

  if (
    typeof email !== 'string' || !email.trim() ||
    typeof firstName !== 'string' || !firstName.trim() ||
    typeof lastName !== 'string' || !lastName.trim()
  ) {
    return NextResponse.json({ success: false, error: 'Email, first name, and last name are required.' }, { status: 400 })
  }

  // layoffDate arrives as a "YYYY-MM" string from the month input — optional
  const parsedLayoffDate =
    typeof layoffDate === 'string' && layoffDate.trim() ? new Date(`${layoffDate.trim()}-01`) : null

  await prisma.pendingSignupName.upsert({
    where: { email: email.trim().toLowerCase() },
    update: { firstName: firstName.trim(), lastName: lastName.trim(), layoffDate: parsedLayoffDate },
    create: {
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      layoffDate: parsedLayoffDate,
    },
  })

  return NextResponse.json({ success: true })
}
