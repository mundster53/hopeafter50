// ============================================================
// HopeAfter50 — Route Protection Middleware
//
// Session strategy is "database" (src/lib/auth.ts), so the session
// cookie is an opaque token that references a row in the Session
// table — it is NOT a JWT. next-auth/middleware's withAuth() decodes
// the cookie with next-auth/jwt's getToken(), which only understands
// JWT-strategy cookies. Against a database session it always returns
// null, so withAuth() was redirecting every signed-in member to
// /auth/signin regardless of whether their session was valid.
//
// Real enforcement for database sessions has to happen server-side,
// where Prisma can look the token up (see the getServerSession +
// redirect() calls in each /platform page, e.g.
// src/app/platform/dashboard/page.tsx). Middleware can only check
// that the session cookie is present, as a fast redirect for the
// fully-logged-out case — it must not be the source of truth.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAMES = [
  '__Secure-next-auth.session-token', // https
  'next-auth.session-token', // http (local dev)
]

export function middleware(req: NextRequest) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) => req.cookies.get(name))

  if (!hasSessionCookie) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/platform/:path*', '/admin/:path*', '/dream/:path*'],
}
