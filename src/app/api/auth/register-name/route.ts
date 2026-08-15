// ============================================================
// HopeAfter50 — Pending Sign-In Name
// The sign-in form collects first/last name before the member
// clicks their magic link, so this stashes it keyed by email.
// Consumed (and deleted) by the createUser event in lib/auth.ts.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'

export async function POST(req: NextRequest) {
  const { email, firstName, lastName } = await req.json()

  if (
    typeof email !== 'string' || !email.trim() ||
    typeof firstName !== 'string' || !firstName.trim() ||
    typeof lastName !== 'string' || !lastName.trim()
  ) {
    return NextResponse.json({ success: false, error: 'Email, first name, and last name are required.' }, { status: 400 })
  }

  await prisma.pendingSignupName.upsert({
    where: { email: email.trim().toLowerCase() },
    update: { firstName: firstName.trim(), lastName: lastName.trim() },
    create: { email: email.trim().toLowerCase(), firstName: firstName.trim(), lastName: lastName.trim() },
  })

  return NextResponse.json({ success: true })
}
