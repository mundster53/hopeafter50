// ============================================================
// HopeAfter50 — Sign In Page
// Email magic link only
// ============================================================
'use client'

import { signIn } from 'next-auth/react'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const REASSURANCES = [
  'Free for everyone who needs it',
  'No password to create — just click the link we send you',
  'We will never share your email',
]

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

function SignInForm() {
  const searchParams = useSearchParams()
  // Existing members (e.g. clicking a dashboard link whose session expired,
  // or "Already have an account?") skip the onboarding fields entirely —
  // they just need their email to get a sign-in link, same as before.
  const isExistingMember = searchParams.get('mode') === 'existing'
  const callbackUrl = searchParams.get('callbackUrl') || '/platform/dashboard'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [layoffDate, setLayoffDate] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()

    if (!isExistingMember && (!firstName.trim() || !lastName.trim())) {
      setError('Please tell us your first and last name.')
      return
    }
    setError('')
    setLoading(true)

    if (!isExistingMember) {
      try {
        await fetch('/api/auth/register-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            layoffDate: layoffDate.trim(),
          }),
        })
      } catch {
        // If this fails, sign-in still proceeds — the name is a nice-to-have, not a blocker
      }

      localStorage.setItem('ha50_firstName', firstName.trim())
      localStorage.setItem('ha50_lastName', lastName.trim())
      localStorage.setItem('ha50_layoffDate', layoffDate.trim())
    }

    await signIn('email', { email, callbackUrl, redirect: false })
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
            {isExistingMember ? (
              <>
                <h1 className="font-display text-display-md text-white mt-10 mb-4">
                  Welcome back.
                </h1>
                <p className="font-body text-white/80 mb-10">
                  Enter your email and we&rsquo;ll send you a secure link straight to your dashboard.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-display-md text-white mt-10 mb-4">
                  You tell us what you&rsquo;re going through.
                </h1>
                <p className="font-body text-amber-hope text-lg">
                  We create a plan. We help you implement it. And we support you until things get better.
                </p>

                <p className="font-body text-white/80 mt-6 mb-10">
                  That&rsquo;s it. No complicated process. No judgment. Just honest help from people who
                  understand what you&rsquo;re carrying right now. Enter your email and we&rsquo;ll send
                  you a secure link to get started.
                </p>
              </>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-3">
              {!isExistingMember && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-body text-sm text-white/70 mb-1 block">
                        First name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="First name"
                        required
                        className="w-full bg-navy border-2 border-white/20 rounded-card px-4 py-3 font-body text-white placeholder-white/40 focus:outline-none focus:border-amber-hope"
                      />
                    </div>
                    <div>
                      <label className="font-body text-sm text-white/70 mb-1 block">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Last name"
                        required
                        className="w-full bg-navy border-2 border-white/20 rounded-card px-4 py-3 font-body text-white placeholder-white/40 focus:outline-none focus:border-amber-hope"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-sm text-white/70 mb-1 block">
                      When did you last lose a job?
                    </label>
                    <input
                      type="month"
                      value={layoffDate}
                      onChange={e => setLayoffDate(e.target.value)}
                      max={new Date().toISOString().slice(0, 7)}
                      className="w-full bg-navy border-2 border-white/20 rounded-card px-4 py-3 font-body text-white placeholder-white/40 focus:outline-none focus:border-amber-hope"
                    />
                  </div>
                </>
              )}
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
              {error && (
                <p className="font-body text-sm text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !email || (!isExistingMember && (!firstName.trim() || !lastName.trim()))}
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
              {isExistingMember ? (
                <Link href="/auth/signin" className="text-white/40 text-sm hover:underline">
                  New here? Start your plan
                </Link>
              ) : (
                <Link href="/auth/signin?mode=existing" className="text-white/40 text-sm hover:underline">
                  Already have an account? Sign in here
                </Link>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
