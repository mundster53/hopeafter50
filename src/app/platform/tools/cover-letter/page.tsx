// ============================================================
// HopeAfter50 — Cover Letter Builder
// prompts/cover-letter.md
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import MarkdownView from '@/components/platform/MarkdownView'
import RatingBadge from '@/components/platform/RatingBadge'
import { CoverLetterResult } from '@/types/ai'

export default function CoverLetterPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [hiringManagerName, setHiringManagerName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CoverLetterResult | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company, description, hiringManagerName }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setResult(data.result)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.cover_letter_markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-navy py-4 px-6 flex items-center justify-between">
        <Link href="/platform/dashboard" className="font-display text-white font-bold">HopeAfter50 — Cover Letter Builder</Link>
        <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white text-sm">← Dashboard</Link>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">Cover Letter Builder</p>
        <h1 className="font-display text-display-md text-navy mb-4">A letter that sounds like you.</h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Built from your actual resume — never generic, never exaggerated.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Job title" value={jobTitle} onChange={setJobTitle} required />
              <Field label="Company" value={company} onChange={setCompany} required />
              <Field
                label="Hiring manager name (optional)"
                value={hiringManagerName}
                onChange={setHiringManagerName}
              />
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
              {loading ? 'Writing your letter…' : 'Generate Cover Letter'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase">Your Cover Letter</p>
                <div className="flex items-center gap-3">
                  <RatingBadge label={`Confidence: ${result.confidence}`} />
                  <button onClick={handleCopy} className="font-body text-amber-hope text-sm hover:underline">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="bg-warm-white rounded-card p-6 border border-sage">
                <MarkdownView content={result.cover_letter_markdown} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {result.key_strengths_emphasized.length > 0 && (
                <div className="card">
                  <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Strengths Emphasized</p>
                  <div className="flex flex-wrap gap-2">
                    {result.key_strengths_emphasized.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-xs font-medium bg-sage text-navy">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.customizations.length > 0 && (
                <div className="card">
                  <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">How It Was Tailored</p>
                  <ul className="space-y-2">
                    {result.customizations.map((s, i) => (
                      <li key={i} className="font-body text-navy text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                className="btn-secondary"
              >
                Write Another Letter
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
