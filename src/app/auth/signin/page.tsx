// ============================================================
// HopeAfter50 — Sign In Page
// Email magic link only
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
