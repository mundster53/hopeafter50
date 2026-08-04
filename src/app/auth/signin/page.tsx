// ============================================================
// HopeAfter50 — Sign In Page
// Email magic link only
// ============================================================
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

const EXPECTATIONS = [
  'Answer a few questions about where you are right now. About 5 minutes.',
  'Receive your personalized plan immediately. Not generic advice — a real plan built around your situation.',
  'Get practical next steps, AI-powered tools, and someone in your corner.',
]

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: reassurance panel */}
      <div className="bg-navy text-white flex flex-col justify-between px-8 py-12 lg:w-1/2 lg:px-16 lg:py-16">
        <div>
          <Link href="/" className="font-display font-bold text-lg text-white">HopeAfter50</Link>

          <h1 className="font-display text-display-md text-white mt-10 mb-4">
            You just did something hard.
          </h1>
          <p className="font-body text-amber-light text-lg mb-10">
            Asking for help when everything feels uncertain takes courage. You&rsquo;re in the right place.
          </p>

          <ul className="space-y-5">
            {EXPECTATIONS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-amber-hope flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-body text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-body text-white/60 text-sm mt-12 lg:mt-0">
          Free for everyone who needs it. No pressure. No catch.
        </p>
      </div>

      {/* Right: sign-in form */}
      <div className="bg-warm-white flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          {sent ? (
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
              <p className="font-body text-amber-hope text-sm font-semibold uppercase tracking-wide mb-3">
                Let&rsquo;s get started
              </p>
              <h1 className="font-display text-display-sm text-navy mb-3">
                Where should we send your plan?
              </h1>
              <p className="font-body text-slate-supporting mb-8">
                Enter your email and we&rsquo;ll send you a secure sign-in link. No password needed.
              </p>

              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <div>
                  <label className="font-body text-sm text-slate-supporting mb-1 block">
                    Your email address
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
                  {loading ? 'Sending...' : 'Send My Plan Link'}
                </button>
              </form>

              <p className="font-body text-slate-supporting text-sm mt-4">
                We&rsquo;ll never share your email or send you anything you didn&rsquo;t ask for.
              </p>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-sage" />
                <span className="font-body text-slate-light text-sm">or</span>
                <div className="flex-1 h-px bg-sage" />
              </div>

              <p className="font-body text-center">
                <Link href="/auth/signin?mode=existing" className="text-amber-hope text-sm hover:underline">
                  I already have an account — sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
