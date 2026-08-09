'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ResolvedToggle({ id, resolved }: { id: string; resolved: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function toggle() {
    setPending(true)
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: !resolved }),
      })
      if (!res.ok) throw new Error('Toggle failed')
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={pending}
      className={`font-body text-xs px-3 py-1 rounded-full border transition-colors disabled:opacity-50 ${
        resolved
          ? 'bg-sage/10 border-sage/40 text-sage'
          : 'bg-amber-hope/10 border-amber-hope/40 text-amber-light'
      }`}
    >
      {resolved ? 'Resolved' : 'Open'}
    </button>
  )
}
