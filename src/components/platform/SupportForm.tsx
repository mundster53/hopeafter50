'use client'

import { useState } from 'react'

export default function SupportForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong sending your message.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong sending your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white/5 rounded-card p-8 text-center">
        <p className="font-display text-2xl text-white mb-3">Got it.</p>
        <p className="font-body text-white/70">
          We'll take a look and get back to you soon. You're not stuck — we'll figure it out together.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="font-body text-red-400 text-sm">{error}</p>
      )}

      <div>
        <label htmlFor="name" className="block font-body text-white/70 text-sm mb-1">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-navy border border-white/20 rounded-card px-4 py-3 text-white font-body focus:outline-none focus:border-amber-hope"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-body text-white/70 text-sm mb-1">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-navy border border-white/20 rounded-card px-4 py-3 text-white font-body focus:outline-none focus:border-amber-hope"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-body text-white/70 text-sm mb-1">What's happening?</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Describe what you were trying to do and what went wrong."
          className="w-full bg-navy border border-white/20 rounded-card px-4 py-3 text-white font-body focus:outline-none focus:border-amber-hope resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary inline-block disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Sending…' : 'Send it'}
      </button>
    </form>
  )
}
