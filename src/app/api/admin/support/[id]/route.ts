// ============================================================
// HopeAfter50 — Admin: toggle resolved status on a support request
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { prisma } from '@/lib/db/client'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { resolved } = await req.json()
  if (typeof resolved !== 'boolean') {
    return NextResponse.json({ error: '"resolved" must be a boolean.' }, { status: 400 })
  }

  const request_ = await prisma.supportRequest.update({
    where: { id: params.id },
    data: { resolved, resolvedAt: resolved ? new Date() : null },
  })

  return NextResponse.json({ success: true, request: request_ })
}
