// ============================================================
// HopeAfter50 — Interview Preparation
// prompts/interview-prep.md
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/platform/RatingBadge'
import { InterviewPrepResult } from '@/types/ai'

export default function InterviewToolPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<InterviewPrepResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, description }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setResult(data.prep)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-navy py-4 px-6 flex items-center justify-between">
        <Link href="/platform/dashboard" className="font-display text-white font-bold">HopeAfter50 — Interview Preparation</Link>
        <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white text-sm">← Dashboard</Link>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">Interview Preparation</p>
        <h1 className="font-display text-display-md text-navy mb-4">Prepare, don't memorize.</h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Tell us about the role and we'll help you think through how to talk about your own experience.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-slate-supporting mb-1 block">Job title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                />
              </div>
              <div>
                <label className="font-body text-sm text-slate-supporting mb-1 block">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                />
              </div>
            </div>
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Job description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={10}
                placeholder="Paste the full job posting here."
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || !jobTitle || !company || !description}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Preparing…' : 'Prepare Me For This Interview'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-8">
            <div className="card bg-sage">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Before You Go In</p>
              <p className="font-body text-navy">{result.encouragement}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ListCard title="Likely Interview Focus" items={result.interview_focus} bullet="•" />
              <ListCard title="Likely Topics" items={result.likely_topics} bullet="•" />
            </div>

            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Likely Questions</p>
              <div className="space-y-4">
                {result.interview_questions.map((q, i) => (
                  <div key={i} className="p-4 rounded-card bg-warm-white border border-sage">
                    <p className="font-display text-navy mb-2">{i + 1}. {q.question}</p>
                    <p className="font-body text-slate-supporting text-sm mb-1"><span className="font-medium text-navy">Why they ask this:</span> {q.why_it_is_asked}</p>
                    <p className="font-body text-slate-supporting text-sm"><span className="font-medium text-navy">How to approach it:</span> {q.guidance}</p>
                  </div>
                ))}
              </div>
            </div>

            <ListCard title="Your Resume — Talking Points" items={result.resume_talking_points} bullet="✓" />

            {result.potential_concerns.length > 0 && (
              <ListCard title="Be Ready to Address" items={result.potential_concerns} bullet="⚠" />
            )}

            <ListCard title="Questions to Ask Them" items={result.questions_for_interviewer} bullet="?" />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Preparation Checklist</p>
                <ul className="space-y-2">
                  {result.preparation_checklist.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 font-body text-navy text-sm">
                      <span className="w-4 h-4 rounded border-2 border-slate-supporting shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Tips</p>
                <ul className="space-y-2">
                  {result.interview_tips.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">{i + 1}. {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <RatingBadge label={`Confidence: ${result.confidence}`} />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                className="btn-secondary"
              >
                Prepare for Another Interview
              </button>
              <Link href="/platform/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ListCard({ title, items, bullet }: { title: string; items: string[]; bullet: string }) {
  if (items.length === 0) return null
  return (
    <div className="card">
      <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2 font-body text-navy text-sm">
            <span className="text-amber-hope shrink-0">{bullet}</span>{s}
          </li>
        ))}
      </ul>
    </div>
  )
}
