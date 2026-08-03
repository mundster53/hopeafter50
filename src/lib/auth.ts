// ============================================================
// HopeAfter50 — NextAuth Configuration
// Providers: Email magic link (Resend)
// Adapter: Prisma (persists sessions and accounts to DB)
// ============================================================

import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/client'
import { Resend } from 'resend'

export const authOptions: NextAuthOptions = {
  // Persist sessions and accounts in your Postgres database
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    // ----------------------------
    // Magic Link Email — via Resend
    // Member enters email → gets a link → clicks → signed in
    // No password ever created or stored
    // ----------------------------
    EmailProvider({
      from: process.env.FROM_EMAIL ?? 'hello@hopeafter50.com',
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: `HopeAfter50 <${process.env.FROM_EMAIL ?? 'hello@hopeafter50.com'}>`,
          to: email,
          subject: 'Your sign-in link for HopeAfter50',
          html: magicLinkEmail(url),
        })
      },
    }),
  ],

  // Custom pages — styled to match HopeAfter50 design
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify',   // "Check your email" page
    error: '/auth/error',
  },

  // Session strategy: database (persisted, works across devices)
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days — members stay logged in
  },

  callbacks: {
    // Make member data available in session throughout the app
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },

    // After sign-in, redirect new members to assessment
    // Returning members go to dashboard
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },

  events: {
    // When a new member signs in for the first time, create their Member record
    async createUser({ user }) {
      await prisma.member.upsert({
        where: { email: user.email! },
        update: {},
        create: {
          id: user.id,
          email: user.email!,
          firstName: user.name?.split(' ')[0] ?? '',
        },
      })
    },
  },
}

// ----------------------------
// Magic link email template
// Styled to match HopeAfter50 brand
// ----------------------------
function magicLinkEmail(url: string): string {
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
              <p style="margin:0 0 16px;color:#1B2B4B;font-size:24px;font-family:Georgia,serif;line-height:1.3;">
                Your sign-in link is ready.
              </p>
              <p style="margin:0 0 32px;color:#6B7A8D;font-size:16px;line-height:1.6;">
                Click the button below to sign in to HopeAfter50. This link expires in 24 hours and can only be used once.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#C8922A;border-radius:8px;">
                    <a href="${url}" style="display:inline-block;padding:16px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                      Sign In to HopeAfter50
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:32px 0 0;color:#6B7A8D;font-size:14px;line-height:1.6;">
                If you didn't request this link, you can safely ignore this email.
              </p>
              <p style="margin:8px 0 0;color:#6B7A8D;font-size:13px;">
                Or copy this URL into your browser:<br>
                <span style="color:#1B2B4B;word-break:break-all;">${url}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#E8EDE8;padding:20px 40px;">
              <p style="margin:0;color:#6B7A8D;font-size:12px;">
                HopeAfter50 — Practical tools and renewed hope for experienced professionals rebuilding after career disruption.
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
