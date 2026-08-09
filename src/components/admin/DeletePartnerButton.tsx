'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeletePartnerButton({
  partnerId,
  variant = 'compact',
  redirectTo,
}: {
  partnerId: string
  variant?: 'compact' | 'full'
  redirectTo?: string
}) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function doDelete() {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/partners/${partnerId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push(redirectTo ?? '/admin')
      router.refresh()
    } catch {
      setError('Failed to delete partner. Please try again.')
      setDeleting(false)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (window.confirm('Delete this partner record? This cannot be undone.')) {
            void doDelete()
          }
        }}
        disabled={deleting}
        className="font-body text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    )
  }

  return (
    <div className="border border-red-500/30 bg-red-500/5 rounded-card p-6 space-y-4">
      <div>
        <p className="font-display text-lg text-red-300">Danger Zone</p>
        <p className="font-body text-sm text-white/60 mt-1">
          This permanently deletes this partner record. This cannot be undone.
        </p>
      </div>
      <div className="space-y-2">
        <label className="font-body text-sm text-white/70 block">Type DELETE to confirm</label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full bg-navy border border-white/20 rounded px-3 py-2 text-white font-body text-sm focus:outline-none focus:border-red-400"
          placeholder="DELETE"
        />
      </div>
      {error && <p className="font-body text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={() => void doDelete()}
        disabled={confirmText !== 'DELETE' || deleting}
        className="font-body text-sm bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
      >
        {deleting ? 'Deleting…' : 'Delete Partner Permanently'}
      </button>
    </div>
  )
}
