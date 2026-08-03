// ============================================================
// HopeAfter50 — Weekly Review
// prompts/weekly-review.md
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/platform/RatingBadge'
import { WeeklyReviewResult } from '@/types/ai'
import { WeeklyRating } from '@/types'

const RATING_OPTIONS: { value: WeeklyRating; label: string }[] = [
  { value: 'much_better', label: 'Much Better' },
  { value: 'better', label: 'Better' },
  { value: 'same', label: 'About the Same' },
  { value: 'worse', label: 'Worse' },
  { value: 'much_worse', label: 'Much Worse' },
]

export default function WeeklyReviewPage() {
  const [rating, setRating] = useState<WeeklyRating | ''>('')
  const [wins, setWins] = useState('')
  const [progressNotes, setProgressNotes] = useState('')
  const [obstacles, setObstacles] = useState('')
  const [applicationsSubmitted, setApplicationsSubmitted] = useState(0)
  const [networkingConversations, setNetworkingConversations] = useState(0)
  const [interviewsCompleted, setInterviewsCompleted] = useState(0)
  const [offersReceived, setOffersReceived] = useState(0)
  const [newEmployment, setNewEmployment] = useState(false)
  const [additionalComments, setAdditionalComments] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<WeeklyReviewResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/weekly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          wins,
          progressNotes,
          obstacles,
          applicationsSubmitted,
          networkingConversations,
          interviewsCompleted,
          offersReceived,
          newEmployment,
          additionalComments,
        }),
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

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-navy py-4 px-6 flex items-center justify-between">
        <Link href="/platform/dashboard" className="font-display text-white font-bold">HopeAfter50 — Weekly Review</Link>
        <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white text-sm">← Dashboard</Link>
      </div>

      <div className="max-content mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">Weekly Review</p>
        <h1 className="font-display text-display-md text-navy mb-4">A few minutes to check in.</h1>
        <p className="font-body text-slate-supporting mb-8 text-lg">
          This isn't a journal — it keeps your plan honest and current.
        </p>

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="font-body text-sm text-slate-supporting mb-2 block">Compared to last week, things feel...</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {RATING_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setRating(opt.value)}
                    className={`px-3 py-3 rounded-card border-2 font-body text-sm transition-colors ${
                      rating === opt.value ? 'border-amber-hope bg-amber-pale text-navy' : 'border-sage text-slate-supporting hover:border-slate-supporting'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-slate-supporting mb-1 block">What went well this week?</label>
                <textarea value={wins} onChange={(e) => setWins(e.target.value)} rows={4}
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope" />
              </div>
              <div>
                <label className="font-body text-sm text-slate-supporting mb-1 block">What got in the way?</label>
                <textarea value={obstacles} onChange={(e) => setObstacles(e.target.value)} rows={4}
                  className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope" />
              </div>
            </div>

            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Anything else about your progress this week?</label>
              <textarea value={progressNotes} onChange={(e) => setProgressNotes(e.target.value)} rows={3}
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <NumberField label="Applications" value={applicationsSubmitted} onChange={setApplicationsSubmitted} />
              <NumberField label="Networking Conversations" value={networkingConversations} onChange={setNetworkingConversations} />
              <NumberField label="Interviews" value={interviewsCompleted} onChange={setInterviewsCompleted} />
              <NumberField label="Offers" value={offersReceived} onChange={setOffersReceived} />
            </div>

            <label className="flex items-center gap-3 font-body text-navy text-sm">
              <input type="checkbox" checked={newEmployment} onChange={(e) => setNewEmployment(e.target.checked)} className="w-5 h-5" />
              I started a new job this week
            </label>

            <div>
              <label className="font-body text-sm text-slate-supporting mb-1 block">Anything else? (optional)</label>
              <textarea value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)} rows={2}
                className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope" />
            </div>

            {error && <p className="font-body text-sm text-red-700 bg-red-50 rounded-card px-4 py-3">{error}</p>}

            <button type="submit" disabled={loading || !rating} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Reviewing your week…' : 'Submit Weekly Review'}
            </button>
          </form>
        )}

        {result && (
          <div className="space-y-8">
            <div className="card bg-sage">
              <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Encouragement</p>
              <p className="font-body text-navy">{result.encouragement}</p>
            </div>

            <div className="card">
              <div className="flex flex-wrap gap-2 mb-4">
                <RatingBadge label={result.progress_rating} />
                <RatingBadge label={`Momentum: ${result.momentum}`} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-1">Current Focus</p>
                  <p className="font-display text-lg text-navy">{result.current_focus}</p>
                </div>
                <div>
                  <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-1">Your Next Step</p>
                  <p className="font-display text-lg text-navy">{result.next_step}</p>
                </div>
              </div>
            </div>

            {result.wins.length > 0 && (
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Wins This Week</p>
                <ul className="space-y-2">
                  {result.wins.map((s, i) => (
                    <li key={i} className="flex gap-2 font-body text-navy text-sm"><span className="text-amber-hope">✓</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.top_obstacles.length > 0 && (
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Top Obstacles</p>
                <ul className="space-y-2">
                  {result.top_obstacles.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">{i + 1}. {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.dashboard_updates.recommended_actions.length > 0 && (
              <div className="card">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Recommended Actions</p>
                <ul className="space-y-2">
                  {result.dashboard_updates.recommended_actions.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">• {s}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.alerts.length > 0 && (
              <div className="card bg-sage">
                <p className="font-body text-slate-supporting text-xs tracking-widest uppercase mb-3">Alerts</p>
                <ul className="space-y-1">
                  {result.alerts.map((s, i) => (
                    <li key={i} className="font-body text-navy text-sm">⚠ {s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/platform/dashboard" className="btn-primary">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="font-body text-xs text-slate-supporting mb-1 block">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
        className="w-full border-2 border-sage rounded-card px-3 py-2 font-body text-navy focus:outline-none focus:border-amber-hope"
      />
    </div>
  )
}
