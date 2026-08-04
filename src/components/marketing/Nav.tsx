import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import NavMobileMenu from './NavMobileMenu'

export default async function Nav() {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session
  const ctaLabel = isLoggedIn ? 'Go to My Dashboard' : 'Find My Next Step'
  const ctaHref = isLoggedIn ? '/platform/dashboard' : '/auth/signin'
  const dashboardLinkLabel = isLoggedIn ? 'My Dashboard' : 'Sign In'

  return (
    <nav className="bg-navy border-b border-white/10 sticky top-0 z-50">
      <div className="max-wide mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-white font-bold tracking-tight">
          Hope After 50
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="font-body text-white/70 hover:text-white transition-colors text-sm">About</Link>
          <Link href="/resources" className="font-body text-white/70 hover:text-white transition-colors text-sm">Resources</Link>
          <Link href="/platform/dashboard" className="font-body text-white/70 hover:text-white transition-colors text-sm">{dashboardLinkLabel}</Link>
          <Link href={ctaHref} className="btn-primary py-2 px-5 text-sm">
            {ctaLabel}
          </Link>
        </div>
        <NavMobileMenu dashboardLinkLabel={dashboardLinkLabel} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </div>
    </nav>
  )
}
