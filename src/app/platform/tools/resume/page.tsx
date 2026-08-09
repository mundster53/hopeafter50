// ============================================================
// HopeAfter50 — AI Resume Intelligence System
// Artifact 6 — Upload → Analysis (prompts/resume-analysis.md) →
// Optimization (prompts/resume-optimization.md) → results
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PlatformNav from '@/components/platform/PlatformNav'
import MarkdownView from '@/components/platform/MarkdownView'
import RatingBadge from '@/components/platform/RatingBadge'
import AnalysisProgress from '@/components/platform/AnalysisProgress'
import { ResumeAnalysisResult, ResumeOptimizationResult, ResumeTailoringResult } from '@/types/ai'

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
  const [checkingHistory, setCheckingHistory] = useState(true)
  const [loadedFromHistory, setLoadedFromHistory] = useState(false)
  const [optimizationId, setOptimizationId] = useState<string | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [targetRoles, setTargetRoles] = useState('')
  const [targetIndustries, setTargetIndustries] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const [reanalyzing, setReanalyzing] = useState(false)
  const [reanalyzeError, setReanalyzeError] = useState<string | null>(null)

  const [jobDescription, setJobDescription] = useState('')
  const [tailoring, setTailoring] = useState(false)
  const [tailorError, setTailorError] = useState<string | null>(null)
  const [tailoringResult, setTailoringResult] = useState<ResumeTailoringResult | null>(null)
  const [tailoredDownloading, setTailoredDownloading] = useState(false)
  const [tailoredDownloadError, setTailoredDownloadError] = useState<string | null>(null)

  const [partnerAskDismissed, setPartnerAskDismissed] = useState(true)

  useEffect(() => {
    setPartnerAskDismissed(localStorage.getItem('partnerAskDismissed') === 'true')
  }, [])

  function dismissPartnerAsk() {
    localStorage.setItem('partnerAskDismissed', 'true')
    setPartnerAskDismissed(true)
  }

  // On arrival, check for a previously analyzed resume so members never
  // have to upload the same resume twice.
  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      try {
        const res = await fetch('/api/resume')
        const data = await res.json()
        if (!cancelled && res.ok && data.success && data.latest) {
          setResult({ analysis: data.latest.analysis, optimization: data.latest.optimization })
          setOptimizationId(data.latest.optimizationId)
          setTargetRoles((data.latest.targetRoles ?? []).join(', '))
          setTargetIndustries((data.latest.targetIndustries ?? []).join(', '))
          setLoadedFromHistory(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setCheckingHistory(false)
      }
    }

    loadHistory()
    return () => {
      cancelled = true
    }
  }, [])

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
      setOptimizationId(data.optimizationId ?? null)
      setLoadedFromHistory(false)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReanalyze() {
    setReanalyzing(true)
    setReanalyzeError(null)

    try {
      const roles = targetRoles.split(',').map((v) => v.trim()).filter(Boolean)
      const industries = targetIndustries.split(',').map((v) => v.trim()).filter(Boolean)

      const res = await fetch('/api/resume/reanalyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRoles: roles, targetIndustries: industries }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setReanalyzeError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setResult({ analysis: data.analysis, optimization: data.optimization })
      setOptimizationId(data.optimizationId ?? null)
      setLoadedFromHistory(false)
      setTailoringResult(null)
    } catch (err) {
      console.error(err)
      setReanalyzeError('Something went wrong. Please try again.')
    } finally {
      setReanalyzing(false)
    }
  }

  function handleUploadNew() {
    setResult(null)
    setOptimizationId(null)
    setLoadedFromHistory(false)
    setFile(null)
    setTargetRoles('')
    setTargetIndustries('')
    setError(null)
    setReanalyzeError(null)
    setJobDescription('')
    setTailoringResult(null)
    setTailorError(null)
  }

  async function handleDownload() {
    if (!result) return
    setDownloading(true)
    setDownloadError(null)

    try {
      const res = await fetch('/api/resume/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeMarkdown: result.optimization.optimized_resume_markdown }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setDownloadError(data?.error ?? 'Something went wrong creating your Word document. Please try again.')
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Resume.docx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setDownloadError('Something went wrong creating your Word document. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  async function handleTailor(e: React.FormEvent) {
    e.preventDefault()
    if (!result || !jobDescription.trim()) return
    setTailoring(true)
    setTailorError(null)

    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optimizedResumeMarkdown: result.optimization.optimized_resume_markdown,
          jobDescription,
          resumeOptimizationId: optimizationId,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setTailorError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setTailoringResult(data.tailoring)
    } catch (err) {
      console.error(err)
      setTailorError('Something went wrong. Please try again.')
    } finally {
      setTailoring(false)
    }
  }

  async function handleDownloadTailored() {
    if (!tailoringResult) return
    setTailoredDownloading(true)
    setTailoredDownloadError(null)

    try {
      const res = await fetch('/api/resume/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeMarkdown: tailoringResult.tailored_resume_markdown }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setTailoredDownloadError(data?.error ?? 'Something went wrong creating your Word document. Please try again.')
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Tailored-Resume.docx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      setTailoredDownloadError('Something went wrong creating your Word document. Please try again.')
    } finally {
      setTailoredDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <PlatformNav />

      <div className="max-wide mx-auto px-6 pt-8">
        <p className="font-display text-navy text-lg font-semibold">Resume Intelligence</p>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">Your Resume</p>
        <h1 className="font-display text-display-md text-navy mb-4">
          Let's make your resume impossible to ignore.
        </h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          Upload your resume and we'll show you exactly what's working, what's not, and how to fix it — in plain language, in your own words.
        </p>

        {checkingHistory && (
          <div className="card text-center py-12">
            <p className="font-body text-slate-supporting">Checking for your resume…</p>
          </div>
        )}

        {!checkingHistory && !result && (
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
            {loading && <AnalysisProgress />}
          </form>
        )}

        {result && (
          <div className="space-y-8">

            {loadedFromHistory && (
              <div className="card bg-sage flex flex-wrap items-center justify-between gap-4">
                <p className="font-body text-navy text-sm">
                  Welcome back — here's your most recent resume analysis.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleReanalyze}
                    disabled={reanalyzing}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reanalyzing ? 'Re-analyzing…' : 'Re-analyze'}
                  </button>
                  <button onClick={handleUploadNew} className="btn-primary">
                    Upload New Resume
                  </button>
                </div>
              </div>
            )}
            {reanalyzeError && (
              <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{reanalyzeError}</p>
            )}
            {reanalyzing && (
              <div className="card">
                <AnalysisProgress />
              </div>
            )}

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
              <div className="mt-6 text-center">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? 'Preparing your document…' : 'Download My Resume'}
                </button>
                {downloadError && (
                  <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3 mt-3 inline-block">
                    {downloadError}
                  </p>
                )}
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

            {/* Job-specific tailoring */}
            <div className="card border-2 border-amber-hope">
              <p className="font-display text-amber-hope text-xl mb-2">
                Found a job you want to apply for?
              </p>
              <p className="font-body text-slate-supporting mb-4">
                Paste the job description below and we'll customize your resume to match what they're looking for — using your real experience, in your own words.
              </p>

              <form onSubmit={handleTailor} className="space-y-4">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={10}
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope"
                />

                {tailorError && (
                  <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{tailorError}</p>
                )}

                <button
                  type="submit"
                  disabled={!jobDescription.trim() || tailoring}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tailoring ? 'Tailoring your resume…' : 'Tailor My Resume For This Job'}
                </button>
                {tailoring && <AnalysisProgress />}
              </form>

              {tailoringResult && (
                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-block bg-amber-hope text-navy font-display font-bold text-sm px-4 py-2 rounded-full">
                      {tailoringResult.match_label} — {tailoringResult.match_score}%
                    </span>
                  </div>

                  <div>
                    <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">
                      Why You're a Strong Candidate
                    </p>
                    <ul className="space-y-2">
                      {tailoringResult.top_strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 font-body text-navy text-sm">
                          <span className="text-amber-hope">✓</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tailoringResult.honest_gaps.length > 0 && (
                    <div className="bg-sage rounded-card p-4">
                      <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">
                        Worth Preparing For
                      </p>
                      <ul className="space-y-3">
                        {tailoringResult.honest_gaps.map((g, i) => (
                          <li key={i} className="font-body text-navy text-sm">
                            <p className="font-medium mb-1">{g.gap}</p>
                            <p className="text-slate-supporting">{g.guidance}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">
                      Tailored Resume
                    </p>
                    <div className="bg-warm-white rounded-card p-6 border border-sage">
                      <MarkdownView content={tailoringResult.tailored_resume_markdown} />
                    </div>
                    <div className="mt-6 text-center">
                      <button
                        onClick={handleDownloadTailored}
                        disabled={tailoredDownloading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {tailoredDownloading ? 'Preparing your document…' : 'Download Tailored Resume'}
                      </button>
                      {tailoredDownloadError && (
                        <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3 mt-3 inline-block">
                          {tailoredDownloadError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!partnerAskDismissed && (
              <div className="relative bg-white/5 rounded-card p-6">
                <button
                  onClick={dismissPartnerAsk}
                  aria-label="Dismiss"
                  className="absolute top-3 right-3 text-slate-supporting hover:text-navy text-lg leading-none"
                >
                  ×
                </button>
                <p className="font-body text-amber-hope text-xs tracking-widest uppercase mb-2">
                  This analysis was free because of our Partners
                </p>
                <p className="font-body text-white text-sm mb-3">
                  Someone believed you deserved this kind of help without having to pay for it. If
                  you'd like to help someone else receive the same, consider becoming a Partner.
                </p>
                <Link href="/platform/plan/partner" className="font-body text-amber-hope text-sm hover:underline">
                  Learn about becoming a Partner →
                </Link>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={handleReanalyze} disabled={reanalyzing} className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
                {reanalyzing ? 'Re-analyzing…' : 'Re-analyze'}
              </button>
              <button onClick={handleUploadNew} className="btn-secondary">
                Upload New Resume
              </button>
              <Link href="/platform/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
