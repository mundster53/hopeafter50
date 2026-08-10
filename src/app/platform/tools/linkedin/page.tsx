// ============================================================
// HopeAfter50 — LinkedIn Optimizer
// Member pastes their public LinkedIn profile URL; the API fetches
// the page and has Claude give warm, human feedback on it.
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import PlatformNav from '@/components/platform/PlatformNav'

export default function LinkedInToolPage() {
  const [profileUrl, setProfileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl }),
      })
      const data = await res.json()

      if (!res.ok || !data.analysis) {
        setError(data.error ?? "We had trouble reading that profile. Make sure it's set to public and try again.")
        return
      }
      setAnalysis(data.analysis)
    } catch (err) {
      console.error(err)
      setError("We had trouble reading that profile. Make sure it's set to public and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <PlatformNav />

      <div className="max-wide mx-auto px-6 pt-8">
        <p className="font-display text-navy text-lg font-semibold">LinkedIn Optimizer</p>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">LinkedIn Optimizer</p>
        <h1 className="font-display text-display-md text-navy mb-4">Be findable for the right reasons.</h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Paste your LinkedIn profile URL below and we&apos;ll take a look at it.
        </p>

        {!analysis && (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">LinkedIn Profile URL</label>
              <input
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-name"
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || !profileUrl.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing your profile…' : 'Analyze My Profile'}
            </button>
          </form>
        )}

        {analysis && (
          <div className="space-y-8">
            <div className="card border-l-4 border-amber-hope bg-navy">
              <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-3">Your Profile, From a Friend</p>
              <p className="font-body text-warm-white whitespace-pre-line">{analysis}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setAnalysis(null)
                  setError(null)
                }}
                className="btn-secondary"
              >
                Analyze Another Profile
              </button>
              <Link href="/platform/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
