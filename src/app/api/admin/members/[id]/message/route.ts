// ============================================================
// HopeAfter50 — Admin: send a direct email to a member via Resend
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { requireAdmin, ADMIN_EMAIL } from '@/lib/admin/auth'
import { prisma } from '@/lib/db/client'

let resend: Resend | null = null
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, body } = await req.json()
  if (!subject || !body) {
    return NextResponse.json({ error: 'Subject and body are required.' }, { status: 400 })
  }

  const member = await prisma.member.findUnique({ where: { id: params.id }, select: { email: true, firstName: true } })
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  const fromAddress = `Bret at HopeAfter50 <${process.env.FROM_EMAIL ?? 'hello@hopeafter50.org'}>`

  const { error } = await getResend().emails.send({
    from: fromAddress,
    to: member.email,
    reply_to: ADMIN_EMAIL,
    subject,
    html: `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#1B2B4B;white-space:pre-wrap;">${escapeHtml(body)}</div>`,
  })

  if (error) {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
