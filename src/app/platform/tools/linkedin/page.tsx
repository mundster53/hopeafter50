// ============================================================
// HopeAfter50 — LinkedIn Optimizer
// Reuses prompts/resume-analysis.md guidance (no dedicated LinkedIn
// prompt exists), framing the profile sections as the resume input.
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import PlatformNav from '@/components/platform/PlatformNav'
import RatingBadge from '@/components/platform/RatingBadge'
import { ResumeAnalysisResult } from '@/types/ai'

const CATEGORY_LABELS: Record<keyof ResumeAnalysisResult['category_scores'], string> = {
  overall_impression: 'Overall Impression',
  professional_summary: 'Headline & About',
  work_experience: 'Experience Section',
  leadership: 'Leadership',
  measurable_results: 'Measurable Results',
  technical_skills: 'Technical Skills',
  education: 'Education',
  readability: 'Readability',
  formatting: 'Formatting',
}

export default function LinkedInToolPage() {
  const [headline, setHeadline] = useState('')
  const [about, setAbout] = useState('')
  const [experience, setExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, about, experience }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setResult(data.analysis)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
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
        <p className="font-body text-slate-supporting mb-4 text-lg">
          We&apos;d love to pull your LinkedIn profile automatically, but LinkedIn doesn&apos;t allow that — even for
          public profiles. So we&apos;ll do it the old-fashioned way: just paste in the parts below and we&apos;ll
          give you honest, specific feedback on each one.
        </p>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Paste your current LinkedIn sections and we&apos;ll tell you what&apos;s working and what to strengthen.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Operations Executive | Manufacturing Leadership | Continuous Improvement"
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={6}
                placeholder="Paste your About section here."
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Experience</label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={8}
                placeholder="Paste your Experience section here."
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || (!headline.trim() && !about.trim() && !experience.trim())}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing your profile…' : 'Analyze My LinkedIn Profile'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-8">
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Overall Impression</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <RatingBadge label={result.overall_rating} />
                <RatingBadge label={result.executive_presence} />
                <RatingBadge label={`Target Alignment: ${result.target_alignment}`} />
              </div>
              <p className="font-body text-navy whitespace-pre-line">{result.overall_assessment}</p>
            </div>

            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Profile Health Check</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {(Object.keys(CATEGORY_LABELS) as (keyof ResumeAnalysisResult['category_scores'])[]).map((key) => (
                  <div key={key} className="p-3 rounded-card bg-sage">
                    <p className="font-body text-navy text-sm font-medium mb-1">{CATEGORY_LABELS[key]}</p>
                    <RatingBadge label={result.category_scores[key]} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Strengths</p>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 font-body text-navy text-sm">
                      <span className="text-amber-hope">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Opportunities to Improve</p>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2 font-body text-navy text-sm">
                      <span className="text-amber-hope">{i + 1}.</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.missing_information.length > 0 && (
              <div className="card bg-sage">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Worth Adding (if accurate)</p>
                <ul className="space-y-1">
                  {result.missing_information.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                className="btn-secondary"
              >
                Analyze Another Version
              </button>
              <Link href="/platform/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
