// ============================================================
// HopeAfter50 — AI Resume Intelligence System
// Artifact 6 — Upload → Analysis (prompts/resume-analysis.md) →
// Optimization (prompts/resume-optimization.md) → results
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import MarkdownView from '@/components/platform/MarkdownView'
import RatingBadge from '@/components/platform/RatingBadge'
import { ResumeAnalysisResult, ResumeOptimizationResult } from '@/types/ai'

type ApiResult = {
  analysis: ResumeAnalysisResult
  optimization: ResumeOptimizationResult
}

const CATEGORY_LABELS: Record<keyof ResumeAnalysisResult['category_scores'], string> = {
  overall_impression: 'Overall Impression',
  professional_summary: 'Professional Summary',
  work_experience: 'Work Experience',
  leadership: 'Leadership',
  measurable_results: 'Measurable Results',
  technical_skills: 'Technical Skills',
  education: 'Education',
  readability: 'Readability',
  formatting: 'Formatting',
}

export default function ResumeToolPage() {
  const [file, setFile] = useState<File | null>(null)
  const [targetRoles, setTargetRoles] = useState('')
  const [targetIndustries, setTargetIndustries] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ApiResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('targetRoles', targetRoles)
      formData.append('targetIndustries', targetIndustries)

      const res = await fetch('/api/resume', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setResult({ analysis: data.analysis, optimization: data.optimization })
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
        <Link href="/platform/dashboard" className="font-display text-white font-bold">HopeAfter50 — Resume Intelligence</Link>
        <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white text-sm">← Dashboard</Link>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">AI Resume Intelligence System</p>
        <h1 className="font-display text-display-md text-navy mb-4">
          Your experience deserves to be understood.
        </h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Upload your resume and we'll analyze it, identify improvements, and generate an optimized version — all while preserving your authentic voice.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="border-2 border-dashed border-sage rounded-card text-center py-12 px-6">
              <p className="font-display text-xl text-navy mb-2">Upload Your Résumé</p>
              <p className="font-body text-slate-supporting mb-6">PDF, DOCX, or plain text</p>
              <label className="btn-primary cursor-pointer inline-block">
                {file ? file.name : 'Choose File'}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-slate-supporting mb-1 block">
                  Target roles <span className="text-slate-supporting/70">(optional, comma separated)</span>
                </label>
                <input
                  type="text"
                  value={targetRoles}
                  onChange={(e) => setTargetRoles(e.target.value)}
                  placeholder="Operations Director, VP of Manufacturing"
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                />
              </div>
              <div>
                <label className="font-body text-sm text-slate-supporting mb-1 block">
                  Target industries <span className="text-slate-supporting/70">(optional, comma separated)</span>
                </label>
                <input
                  type="text"
                  value={targetIndustries}
                  onChange={(e) => setTargetIndustries(e.target.value)}
                  placeholder="Manufacturing, Supply Chain"
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                />
              </div>
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button type="submit" disabled={!file || loading} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Analyzing your resume…' : 'Analyze My Resume'}
            </button>
            {loading && (
              <p className="font-body text-slate-supporting text-sm text-center">
                This usually takes about a minute. We're reading closely — please don't close this tab.
              </p>
            )}
          </form>
        )}

        {result && (
          <div className="space-y-8">

            {/* Ratings row */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Career Snapshot</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <RatingBadge label={result.analysis.overall_rating} />
                <RatingBadge label={result.analysis.executive_presence} />
                <RatingBadge label={`ATS: ${result.analysis.ats_rating}`} />
                <RatingBadge label={`Target Alignment: ${result.analysis.target_alignment}`} />
              </div>
              <p className="font-body text-navy whitespace-pre-line">{result.analysis.overall_assessment}</p>
            </div>

            {/* Category scores */}
            <div className="card">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-4">Resume Health Check</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {(Object.keys(CATEGORY_LABELS) as (keyof ResumeAnalysisResult['category_scores'])[]).map((key) => (
                  <div key={key} className="p-3 rounded-card bg-sage">
                    <p className="font-body text-navy text-sm font-medium mb-1">{CATEGORY_LABELS[key]}</p>
                    <RatingBadge label={result.analysis.category_scores[key]} />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Strengths</p>
                <ul className="space-y-2">
                  {result.analysis.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 font-body text-navy text-sm">
                      <span className="text-amber-hope">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Opportunities to Improve</p>
                <ul className="space-y-2">
                  {result.analysis.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2 font-body text-navy text-sm">
                      <span className="text-amber-hope">{i + 1}.</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.analysis.missing_information.length > 0 && (
              <div className="card bg-sage">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Worth Adding (if accurate)</p>
                <ul className="space-y-1">
                  {result.analysis.missing_information.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Optimized resume */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase">Optimized Resume</p>
                <RatingBadge label={`Confidence: ${result.optimization.confidence}`} />
              </div>
              <div className="bg-warm-white rounded-card p-6 border border-sage">
                <MarkdownView content={result.optimization.optimized_resume_markdown} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">What Changed</p>
                <ul className="space-y-2">
                  {result.optimization.major_changes.map((s, i) => (
                    <li key={i} className="flex gap-2 font-body text-navy text-sm">
                      <span className="text-amber-hope">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              {result.optimization.recommended_follow_up.length > 0 && (
                <div className="card">
                  <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">
                    Strengthen It Further
                  </p>
                  <p className="font-body text-slate-supporting text-xs mb-3">
                    If any of these are accurate, add them yourself — we never invent details for you.
                  </p>
                  <ul className="space-y-2">
                    {result.optimization.recommended_follow_up.map((s, i) => (
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
                  setFile(null)
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
