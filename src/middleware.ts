// ============================================================
// HopeAfter50 — Route Protection Middleware
// All /platform/* and /admin/* routes require authentication
// Unauthenticated users are redirected to sign-in
// ============================================================

import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  matcher: ['/platform/:path*', '/admin/:path*'],
}
