// ============================================================
// HopeAfter50 — Admin: delete a partner record
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/db/client'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params

  const partner = await prisma.partner.findUnique({ where: { id }, select: { id: true } })
  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
  }

  await prisma.partner.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
