'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function NavMobileMenu({
  dashboardLinkLabel,
  ctaLabel,
  ctaHref,
}: {
  dashboardLinkLabel: string
  ctaLabel: string
  ctaHref: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
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
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10 px-6 py-4 space-y-4">
          <Link href="/about" className="block font-body text-white/70 hover:text-white">About</Link>
          <Link href="/resources" className="block font-body text-white/70 hover:text-white">Resources</Link>
          <Link href="/platform/dashboard" className="block font-body text-white/70 hover:text-white">{dashboardLinkLabel}</Link>
          <Link href={ctaHref} className="btn-primary block text-center">{ctaLabel}</Link>
        </div>
      )}
    </>
  )
}
