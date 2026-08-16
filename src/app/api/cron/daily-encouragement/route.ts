// ============================================================
// HopeAfter50 — Daily Encouragement Cron
// Runs every morning (see vercel.json). Generates/reuses each member's
// Daily Word and emails it to them once, via Resend.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/db/client'
import { getDailyEncouragement, chicagoDateString, daysSinceJobLoss, jobLossSinceFor } from '@/lib/ai/dailyEncouragement'

function subjectFor(firstName: string, days: number): string {
  if (days < 30) return `Good morning, ${firstName} — you're just getting started.`
  if (days <= 90) return `Good morning, ${firstName} — keep going.`
  if (days <= 180) return `Good morning, ${firstName} — we see you.`
  return `Good morning, ${firstName} — you're still here. That matters.`
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const testEmail = req.nextUrl.searchParams.get('testEmail')

  const now = new Date()
  const date = chicagoDateString(now)
  const members = await prisma.member.findMany({
    where: testEmail ? { email: testEmail } : undefined,
    select: {
      id: true,
      firstName: true,
      email: true,
      createdAt: true,
      assessment: { select: { jobLossDate: true, completedAt: true } },
    },
  })

  let sent = 0
  let failed = 0

  for (const member of members) {
    try {
      const encouragement = await getDailyEncouragement(member.id, now, !!testEmail)
      if (!encouragement) continue
      if (encouragement.emailSentAt && !testEmail) continue

      const days = daysSinceJobLoss(jobLossSinceFor(member), now)

      const { error } = await getResend().emails.send({
        from: `HopeAfter50 <${process.env.FROM_EMAIL ?? 'hello@hopeafter50.org'}>`,
        to: member.email,
        subject: subjectFor(member.firstName, days),
        html: dailyEncouragementEmail(member.firstName, encouragement.message),
      })

      if (error) {
        console.error(`Daily encouragement email failed for ${member.id}:`, error)
        failed++
        continue
      }

      await prisma.dailyEncouragement.update({
        where: { memberId_date: { memberId: member.id, date } },
        data: { emailSentAt: now },
      })
      sent++
    } catch (err) {
      console.error(`Daily encouragement failed for ${member.id}:`, err)
      failed++
    }
  }

  return NextResponse.json({ success: true, sent, failed, total: members.length })
}

let resend: Resend | null = null
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

function dailyEncouragementEmail(firstName: string, message: string): string {
  const dashboardUrl = `${process.env.NEXTAUTH_URL ?? 'https://hopeafter50.org'}/platform/dashboard`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F8F6F2;font-family:'Inter',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(27,43,75,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1B2B4B;padding:28px 40px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;font-family:Georgia,serif;">HopeAfter50</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#6B7A8D;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">Your Daily Word</p>
              <p style="margin:0 0 24px;color:#1B2B4B;font-size:22px;font-family:Georgia,serif;line-height:1.5;">
                ${message}
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#C8922A;border-radius:8px;">
                    <a href="${dashboardUrl}" style="display:inline-block;padding:16px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                      Go to My Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;color:#6B7A8D;font-size:14px;line-height:1.6;">
                One step today. That's all.
              </p>
              <p style="margin:16px 0 0;color:#1B2B4B;font-size:14px;">— Bret</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#E8EDE8;padding:20px 40px;">
              <p style="margin:0;color:#6B7A8D;font-size:12px;">
                HopeAfter50 — You are not alone, and you are not forgotten.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
