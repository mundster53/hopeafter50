// ============================================================
// HopeAfter50 — Sign In Page
// Email magic link only
// ============================================================
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

const STEPS = [
  {
    number: '1',
    label: 'Share what’s going on',
    description:
      'We’ll ask you about your situation — what happened, what’s weighing on you most, and what you’re hoping for. Nothing you don’t already know the answer to. Takes about 5 minutes.',
  },
  {
    number: '2',
    label: 'Receive your personal plan',
    description:
      'The moment you finish we build a plan specifically for you. Not a template. Not generic advice. A real plan based on what you told us.',
  },
  {
    number: '3',
    label: 'We walk beside you',
    description:
      'Use our tools at your own pace. Reach out anytime. We’re here until things get better — however long that takes.',
  },
]

const REASSURANCES = [
  'Free for everyone who needs it',
  'No password to create — just click the link we send you',
  'We will never share your email',
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
    <div className="min-h-screen bg-navy">
      <div className="max-w-xl mx-auto px-6 py-20 lg:py-28">
        <Link href="/" className="font-display font-bold text-lg text-white">Hope After 50</Link>

        {sent ? (
          <div className="card text-center mt-12">
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
          <>
            <h1 className="font-display text-display-md text-white mt-10 mb-4">
              You tell us what you&rsquo;re going through.
            </h1>
            <p className="font-body text-amber-hope text-lg">
              We create a plan. We help you implement it. And we support you until things get better.
            </p>

            <p className="font-body text-white/80 mt-6">
              That&rsquo;s it. No complicated process. No judgment. Just honest help from people who
              understand what you&rsquo;re carrying right now.
            </p>

            <div className="h-px bg-white/10 mt-12 mb-12" />

            <p className="font-body text-white/90 text-lg mb-8">
              Here&rsquo;s how it works:
            </p>

            <ul className="space-y-8">
              {STEPS.map((step) => (
                <li key={step.number} className="flex items-start gap-4">
                  <span className="font-display text-amber-hope text-xl flex-shrink-0">{step.number}</span>
                  <div>
                    <p className="font-body text-white font-bold mb-1">{step.label}</p>
                    <p className="font-body text-white/70">{step.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="h-px bg-white/10 mt-12 mb-12" />

            <p className="font-body text-white/80 text-center mb-6">
              Ready to take the first step?
            </p>

            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div>
                <label className="font-body text-sm text-white/70 mb-1 block">
                  Your email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-navy border-2 border-white/20 rounded-card px-4 py-3 font-body text-white placeholder-white/40 focus:outline-none focus:border-amber-hope"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send My Secure Link'}
              </button>
            </form>

            <div className="space-y-1 mt-6 text-center">
              {REASSURANCES.map((line) => (
                <p key={line} className="font-body text-white/50 text-sm">
                  ✓ {line}
                </p>
              ))}
            </div>

            <p className="font-body text-center mt-10">
              <Link href="/auth/signin?mode=existing" className="text-white/40 text-sm hover:underline">
                Already have an account? Sign in here
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
