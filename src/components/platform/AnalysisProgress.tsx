'use client'

import { useEffect, useState } from 'react'

// Reassures the member while an AI pass runs (roughly 30-90s). The bar
// creeps toward 90% over 90 seconds and holds there — it only reaches
// 100% once the caller actually has a result and stops rendering this.
const MESSAGES = [
  'Reading your career history...',
  'Identifying your strengths...',
  'Checking ATS compatibility...',
  'Reviewing your accomplishments...',
  'Building your analysis...',
  'Almost there — this is worth the wait...',
]

const DURATION_MS = 90_000
const MESSAGE_INTERVAL_MS = 8_000
const MAX_PROGRESS = 90

export default function AnalysisProgress() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed(Date.now() - start), 200)
    return () => clearInterval(id)
  }, [])

  const progress = Math.min(MAX_PROGRESS, (elapsed / DURATION_MS) * MAX_PROGRESS)
  const message = MESSAGES[Math.min(Math.floor(elapsed / MESSAGE_INTERVAL_MS), MESSAGES.length - 1)]

  return (
    <div className="space-y-3">
      <div className="w-full h-2 bg-sage rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-amber-hope rounded-full transition-[width] duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-body text-navy text-sm text-center">{message}</p>
      <p className="font-body text-slate-supporting text-sm text-center">
        This usually takes about a minute. We're reading closely — please don't close this tab.
      </p>
    </div>
  )
}
