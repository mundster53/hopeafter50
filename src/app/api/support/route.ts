// ============================================================
// HopeAfter50 — Support Request
// Sends the member's message to the team and confirms receipt to the member
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/db/client'

const SUPPORT_INBOX = 'bretjmundt@gmail.com'

let resend: Resend | null = null
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'Name, email, and message are required.' }, { status: 400 })
  }

  const fromAddress = `HopeAfter50 <${process.env.FROM_EMAIL ?? 'hello@hopeafter50.org'}>`

  try {
    await prisma.supportRequest.create({ data: { name, email, message } })
  } catch (err) {
    console.error('Failed to save support request:', err)
  }

  try {
    const { error: teamError } = await getResend().emails.send({
      from: fromAddress,
      to: SUPPORT_INBOX,
      reply_to: email,
      subject: 'Hope After 50 Support Request',
      html: teamNotificationEmail(name, email, message),
    })

    if (teamError) {
      console.error('Support email to team failed:', teamError)
      return NextResponse.json({ success: false, error: 'Something went wrong sending your message.' }, { status: 500 })
    }

    const { error: memberError } = await getResend().emails.send({
      from: fromAddress,
      to: email,
      subject: 'We got your message.',
      html: memberConfirmationEmail(name),
    })

    if (memberError) {
      console.error('Support confirmation email to member failed:', memberError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Support request failed:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong sending your message.' }, { status: 500 })
  }
}

function teamNotificationEmail(name: string, email: string, message: string): string {
  const safeMessage = message.replace(/\n/g, '<br>')
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
          <tr>
            <td style="background:#1B2B4B;padding:28px 40px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;font-family:Georgia,serif;">HopeAfter50 Support Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;color:#6B7A8D;font-size:14px;">Name</p>
              <p style="margin:0 0 20px;color:#1B2B4B;font-size:16px;">${name}</p>
              <p style="margin:0 0 8px;color:#6B7A8D;font-size:14px;">Email</p>
              <p style="margin:0 0 20px;color:#1B2B4B;font-size:16px;">${email}</p>
              <p style="margin:0 0 8px;color:#6B7A8D;font-size:14px;">Message</p>
              <p style="margin:0;color:#1B2B4B;font-size:16px;line-height:1.6;">${safeMessage}</p>
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

function memberConfirmationEmail(name: string): string {
  const firstName = name.split(' ')[0]
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
          <tr>
            <td style="background:#1B2B4B;padding:28px 40px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;font-family:Georgia,serif;">HopeAfter50</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:24px;font-family:Georgia,serif;line-height:1.3;">
                We got your message, ${firstName}.
              </p>
              <p style="margin:0 0 16px;color:#6B7A8D;font-size:16px;line-height:1.6;">
                A real person will look at what you sent and get back to you — usually within 24 hours.
              </p>
              <p style="margin:0;color:#6B7A8D;font-size:16px;line-height:1.6;">
                You're not stuck. We'll figure it out together.
              </p>
            </td>
          </tr>
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
