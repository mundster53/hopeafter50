'use client'

import { useState } from 'react'

export function TestEncouragementButton() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function send() {
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/admin/test-encouragement')
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Failed to send.')
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send.')
      setStatus('error')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => void send()}
        disabled={status === 'sending'}
        className="font-body text-sm bg-amber-hope hover:bg-amber-light disabled:opacity-50 disabled:cursor-not-allowed text-navy font-medium px-4 py-2 rounded transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Send Test Encouragement Email'}
      </button>
      {status === 'sent' && (
        <p className="font-body text-sm text-sage">Sent to bretjmundt@gmail.com</p>
      )}
      {status === 'error' && <p className="font-body text-sm text-red-400">{error}</p>}
    </div>
  )
}
