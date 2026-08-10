// ============================================================
// HopeAfter50 — LinkedIn Optimizer
// LinkedIn-specific coaching (not resume guidance) — see the
// inline task prompt in src/app/api/linkedin/route.ts.
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import PlatformNav from '@/components/platform/PlatformNav'
import { LinkedInAnalysisResult, LinkedInSectionFeedback } from '@/types/ai'

const SECTION_LABELS: Record<keyof LinkedInAnalysisResult, string> = {
  headline: 'Headline',
  about: 'About / Summary',
  experience: 'Experience',
  skills: 'Skills',
}

function SectionCard({ sectionKey, label, feedback }: { sectionKey: string; label: string; feedback: LinkedInSectionFeedback }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(feedback.rewrite)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="card" key={sectionKey}>
      <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">{label}</p>
      <p className="font-body text-navy whitespace-pre-line mb-4">{feedback.assessment}</p>

      <div className="relative bg-amber-pale border border-amber-hope/30 rounded-card p-4 pt-10">
        <p className="font-body text-slate-supporting text-xs tracking-widest uppercase absolute top-3 left-4">
          Here&apos;s what to use instead
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 font-body text-xs font-semibold px-3 py-1.5 rounded-card bg-navy text-warm-white hover:opacity-90 transition"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <p className="font-body text-navy whitespace-pre-line">{feedback.rewrite}</p>
      </div>
    </div>
  )
}

export default function LinkedInToolPage() {
  const [headline, setHeadline] = useState('')
  const [about, setAbout] = useState('')
  const [experience, setExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LinkedInAnalysisResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, about, experience, skills }),
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

  const sectionEntries = result
    ? (Object.keys(SECTION_LABELS) as (keyof LinkedInAnalysisResult)[])
        .filter((key) => result[key])
        .map((key) => ({ key, label: SECTION_LABELS[key], feedback: result[key]! }))
    : []

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
              <label className="font-body text-sm text-slate-supporting mb-1 block">About / Summary</label>
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
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={3}
                placeholder="Paste your Skills section here."
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || (!headline.trim() && !about.trim() && !experience.trim() && !skills.trim())}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing your profile…' : 'Analyze My LinkedIn Profile'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-6">
            {sectionEntries.map(({ key, label, feedback }) => (
              <SectionCard key={key} sectionKey={key} label={label} feedback={feedback} />
            ))}

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
