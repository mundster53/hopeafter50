'use client'

import { useState } from 'react'

export function MessageMemberForm({ memberId }: { memberId: string }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function send() {
    if (!subject.trim() || !body.trim()) return
    setStatus('sending')
    try {
      const res = await fetch(`/api/admin/members/${memberId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      })
      if (!res.ok) throw new Error('Send failed')
      setStatus('sent')
      setSubject('')
      setBody('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full bg-navy border border-white/20 rounded px-3 py-2 text-white font-body text-sm focus:outline-none focus:border-amber-hope"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your message…"
        rows={6}
        className="w-full bg-navy border border-white/20 rounded px-3 py-2 text-white font-body text-sm focus:outline-none focus:border-amber-hope resize-y"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void send()}
          disabled={status === 'sending' || !subject.trim() || !body.trim()}
          className="font-body text-sm bg-amber-hope hover:bg-amber-light disabled:opacity-50 disabled:cursor-not-allowed text-navy font-medium px-4 py-2 rounded transition-colors"
        >
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {status === 'sent' && <p className="font-body text-sm text-sage">Message sent.</p>}
        {status === 'error' && <p className="font-body text-sm text-red-400">Failed to send. Try again.</p>}
      </div>
    </div>
  )
}
