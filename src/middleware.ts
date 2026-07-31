// ============================================================
// HopeAfter50 — Route Protection Middleware
// All /platform/* routes require authentication
// Unauthenticated users are redirected to sign-in
// ============================================================

export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/platform/:path*',  // All member platform routes
  ],
}
