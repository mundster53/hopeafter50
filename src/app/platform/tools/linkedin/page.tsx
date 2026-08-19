// ============================================================
// HopeAfter50 — LinkedIn Optimizer
// LinkedIn-specific coaching (not resume guidance) — see the
// inline task prompt in src/app/api/linkedin/route.ts.
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import PlatformNav from '@/components/platform/PlatformNav'
import { LinkedInAnalysisResult, LinkedInJobInput, LinkedInSectionFeedback } from '@/types/ai'

function SectionCard({
  sectionKey,
  label,
  feedback,
}: {
  sectionKey: string
  label: string
  feedback: LinkedInSectionFeedback
}) {
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

const EMPTY_JOB: LinkedInJobInput = { title: '', company: '', details: '' }

export default function LinkedInToolPage() {
  const [headline, setHeadline] = useState('')
  const [about, setAbout] = useState('')
  const [jobs, setJobs] = useState<LinkedInJobInput[]>([{ ...EMPTY_JOB }])
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LinkedInAnalysisResult | null>(null)

  const hasAnyJobContent = jobs.some((job) => job.title.trim() || job.company.trim() || job.details.trim())

  function updateJob(index: number, field: keyof LinkedInJobInput, value: string) {
    setJobs((prev) => prev.map((job, i) => (i === index ? { ...job, [field]: value } : job)))
  }

  function addJob() {
    setJobs((prev) => [...prev, { ...EMPTY_JOB }])
  }

  function removeJob(index: number) {
    setJobs((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, about, experience: jobs, skills }),
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
              <p className="font-body text-slate-supporting text-sm mb-3">
                Add each job separately so we only use what you tell us about that specific role — never anything
                borrowed from another job.
              </p>
              <div className="space-y-4">
                {jobs.map((job, i) => (
                  <div key={i} className="border-2 border-sage rounded-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-slate-supporting text-xs tracking-widest uppercase">Job {i + 1}</p>
                      {jobs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeJob(i)}
                          className="font-body text-xs text-red-700 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={job.title}
                        onChange={(e) => updateJob(i, 'title', e.target.value)}
                        placeholder="Job title"
                        className="w-full border-2 border-sage rounded-card px-4 py-2 font-body text-navy focus:outline-none focus:border-amber-hope"
                      />
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => updateJob(i, 'company', e.target.value)}
                        placeholder="Company"
                        className="w-full border-2 border-sage rounded-card px-4 py-2 font-body text-navy focus:outline-none focus:border-amber-hope"
                      />
                    </div>
                    <textarea
                      value={job.details}
                      onChange={(e) => updateJob(i, 'details', e.target.value)}
                      rows={5}
                      placeholder="Paste what your LinkedIn profile says about this job only."
                      className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addJob}
                className="btn-secondary mt-3"
              >
                + Add another job
              </button>
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
              disabled={loading || (!headline.trim() && !about.trim() && !hasAnyJobContent && !skills.trim())}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing your profile…' : 'Analyze My LinkedIn Profile'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-6">
            {result.headline && <SectionCard sectionKey="headline" label="Headline" feedback={result.headline} />}
            {result.about && <SectionCard sectionKey="about" label="About / Summary" feedback={result.about} />}
            {result.experience?.map((job, i) => (
              <SectionCard
                key={`experience-${i}`}
                sectionKey={`experience-${i}`}
                label={`Experience — ${job.title || 'Untitled role'} at ${job.company || 'Unknown company'}`}
                feedback={job}
              />
            ))}
            {result.skills && <SectionCard sectionKey="skills" label="Skills" feedback={result.skills} />}

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
