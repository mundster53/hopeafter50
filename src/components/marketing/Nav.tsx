'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-navy border-b border-white/10 sticky top-0 z-50">
      <div className="max-wide mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-white font-bold tracking-tight">
          HopeAfter50
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="font-body text-white/70 hover:text-white transition-colors text-sm">About</Link>
          <Link href="/resources" className="font-body text-white/70 hover:text-white transition-colors text-sm">Resources</Link>
          <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white transition-colors text-sm">Sign In</Link>
          <Link href="/platform/assessment" className="btn-primary py-2 px-5 text-sm">
            Start My Rebuild
          </Link>
        </div>
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10 px-6 py-4 space-y-4">
          <Link href="/about" className="block font-body text-white/70 hover:text-white">About</Link>
          <Link href="/resources" className="block font-body text-white/70 hover:text-white">Resources</Link>
          <Link href="/platform/dashboard" className="block font-body text-white/70 hover:text-white">Sign In</Link>
          <Link href="/platform/assessment" className="btn-primary block text-center">Start My Rebuild</Link>
        </div>
      )}
    </nav>
  )
}
