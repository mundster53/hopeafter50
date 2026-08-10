// ============================================================
// HopeAfter50 — Admin: delete a member and all associated records
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/db/client'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const member = await prisma.member.findUnique({ where: { id }, select: { id: true } })
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  // Member's owned tables (Assessment, RebuildPlan, resume history, etc.)
  // cascade via onDelete: Cascade on their relation to Member; Partner
  // donations are preserved via onDelete: SetNull. Member -> User has no
  // cascade defined, so delete Member first, then the linked User (which
  // cascades to Account/Session).
  try {
    await prisma.member.delete({ where: { id } })
  } catch (err) {
    console.error('[admin/members DELETE] failed to delete member', id, err)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
  await prisma.user.delete({ where: { id } }).catch(() => undefined)

  return NextResponse.json({ success: true })
}
