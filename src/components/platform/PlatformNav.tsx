'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/platform/dashboard' },
  { label: 'My Plan', href: '/platform/plan' },
  { label: 'Resume Tool', href: '/platform/tools/resume' },
  { label: 'Become a Partner', href: '/platform/plan/partner' },
  { label: 'Get Help', href: '/platform/support' },
]

export default function PlatformNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-white/10 px-6 py-4">
      <div className="max-wide mx-auto flex items-center justify-between">
        <Link href="/platform/dashboard" className="font-display text-white font-bold text-lg shrink-0">
          Hope After 50
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-body text-sm transition-colors ${
                isActive(item.href) ? 'text-amber-hope' : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-body text-white/70 hover:text-white text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-1 pb-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`font-body text-sm py-2 px-1 transition-colors ${
                isActive(item.href) ? 'text-amber-hope' : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-body text-white/70 hover:text-white text-sm text-left py-2 px-1 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  )
}
