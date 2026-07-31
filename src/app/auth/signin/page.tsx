// ============================================================
// HopeAfter50 — Sign In Page
// Two options: Google (one click) + Email magic link
// ============================================================
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn('email', { email, callbackUrl: '/platform/dashboard', redirect: false })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      {/* Header */}
      <div className="bg-navy py-4 px-6">
        <Link href="/" className="font-display text-white font-bold text-lg">HopeAfter50</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {sent ? (
            // Magic link sent state
            <div className="card text-center">
              <div className="w-12 h-12 rounded-full bg-amber-pale flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-hope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="font-display text-xl text-navy mb-2">Check your email.</h1>
              <p className="font-body text-slate-supporting mb-1">We sent a sign-in link to</p>
              <p className="font-body text-navy font-medium mb-4">{email}</p>
              <p className="font-body text-slate-supporting text-sm">Click the link in the email to sign in. It expires in 24 hours.</p>
              <button
                onClick={() => setSent(false)}
                className="font-body text-amber-hope text-sm mt-4 hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h1 className="font-display text-display-sm text-navy mb-2">Welcome back.</h1>
                <p className="font-body text-slate-supporting">Sign in to continue your rebuild.</p>
              </div>

              <div className="card space-y-4">

                {/* Google Sign-In */}
                <button
                  onClick={() => signIn('google', { callbackUrl: '/platform/dashboard' })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-sage rounded-card font-body font-medium text-navy hover:border-slate-supporting transition-colors"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-sage" />
                  <span className="font-body text-slate-supporting text-sm">or</span>
                  <div className="flex-1 h-px bg-sage" />
                </div>

                {/* Magic Link Email */}
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div>
                    <label className="font-body text-sm text-slate-supporting mb-1 block">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending link...' : 'Send sign-in link'}
                  </button>
                </form>

              </div>

              <p className="font-body text-slate-supporting text-sm text-center mt-6">
                New here?{' '}
                <Link href="/platform/assessment" className="text-amber-hope hover:underline">
                  Start your Rebuild Assessment
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
    </svg>
  )
}
