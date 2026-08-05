// ============================================================
// HopeAfter50 — Opportunity Evaluator
// prompts/opportunity-evaluation.md
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/platform/RatingBadge'
import { OpportunityEvaluationResult } from '@/types/ai'

const CATEGORY_LABELS: Record<keyof OpportunityEvaluationResult['category_scores'], string> = {
  overall_experience: 'Overall Experience',
  leadership_alignment: 'Leadership Alignment',
  industry_alignment: 'Industry Alignment',
  technical_alignment: 'Technical Skills',
  management_alignment: 'Management Experience',
  education_alignment: 'Education',
  location_alignment: 'Location',
  career_progression: 'Career Progression',
  overall_fit: 'Overall Fit',
}

export default function OpportunityEvaluatorPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OpportunityEvaluationResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, location, salary, description }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setResult(data.evaluation)
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
        <Link href="/platform/dashboard" className="font-display text-white font-bold">HopeAfter50 — Opportunity Evaluator</Link>
        <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white text-sm">← Dashboard</Link>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">Opportunity Evaluator</p>
        <h1 className="font-display text-display-md text-navy mb-4">Is this opportunity worth pursuing?</h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Paste a job posting and we'll give you a balanced, evidence-based evaluation against your experience — not just encouragement to apply.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Job title" value={jobTitle} onChange={setJobTitle} required />
              <Field label="Company" value={company} onChange={setCompany} required />
              <Field label="Location (optional)" value={location} onChange={setLocation} />
              <Field label="Salary (optional)" value={salary} onChange={setSalary} />
            </div>
            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Job description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={10}
                placeholder="Paste the full job posting here — responsibilities, requirements, and preferred qualifications."
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
              />
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || !jobTitle || !company || !description}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Evaluating…' : 'Evaluate This Opportunity'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-8">
            <div className="card">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-1">Fit Score</p>
                  <p className="font-display text-3xl text-navy">{result.fit_score}<span className="text-lg text-slate-supporting">/100</span></p>
                </div>
                <RatingBadge label={result.recommendation} />
              </div>
              <p className="font-body text-navy whitespace-pre-line">{result.overall_assessment}</p>
            </div>

            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Fit by Category</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {(Object.keys(CATEGORY_LABELS) as (keyof OpportunityEvaluationResult['category_scores'])[]).map((key) => (
                  <div key={key} className="p-3 rounded-card bg-sage">
                    <p className="font-body text-navy text-sm font-medium mb-1">{CATEGORY_LABELS[key]}</p>
                    <RatingBadge label={result.category_scores[key]} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ListCard title="Match Strengths" items={result.match_strengths} bullet="✓" />
              <ListCard title="Potential Gaps" items={result.potential_gaps} bullet="•" />
            </div>

            {result.resume_recommendations.length > 0 && (
              <ListCard title="Resume Recommendations for This Role" items={result.resume_recommendations} bullet="→" />
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <ListCard title="Interview Prep Focus" items={result.interview_focus} bullet="•" />
              <ListCard title="Questions to Ask the Employer" items={result.questions_for_employer} bullet="?" />
            </div>

            {result.red_flags.length > 0 && (
              <div className="card bg-sage">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Worth Considering</p>
                <ul className="space-y-2">
                  {result.red_flags.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">⚠ {s}</li>
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
                Evaluate Another Opportunity
              </button>
              <Link href="/platform/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, required }: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="font-body text-sm text-slate-supporting mb-1 block">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
      />
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
