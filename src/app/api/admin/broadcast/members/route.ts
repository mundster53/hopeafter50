// ============================================================
// HopeAfter50 — Admin: broadcast email to all members via Resend
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

const BATCH_SIZE = 10
const BATCH_DELAY_MS = 1000

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, body } = await req.json()
  if (!subject || !body) {
    return NextResponse.json({ error: 'Subject and body are required.' }, { status: 400 })
  }

  const members = await prisma.member.findMany({ select: { email: true } })
  const fromAddress = 'Hope After 50 <noreply@hopeafter50.org>'
  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#1B2B4B;white-space:pre-wrap;">${escapeHtml(body)}</div>`

  let sentCount = 0
  const client = getResend()

  for (let i = 0; i < members.length; i += BATCH_SIZE) {
    const batch = members.slice(i, i + BATCH_SIZE)
    const results = await Promise.all(
      batch.map((member) =>
        client.emails.send({
          from: fromAddress,
          to: member.email,
          reply_to: ADMIN_EMAIL,
          subject,
          html,
        })
      )
    )
    sentCount += results.filter((r) => !r.error).length

    if (i + BATCH_SIZE < members.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
    }
  }

  return NextResponse.json({ success: true, count: sentCount })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
