import Link from 'next/link'

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      <div className="bg-navy py-4 px-6">
        <Link href="/" className="font-display text-white font-bold text-lg">HopeAfter50</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="card max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-amber-pale flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-hope" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-display text-xl text-navy mb-2">Check your email.</h1>
          <p className="font-body text-slate-supporting">A sign-in link is on its way. Click it to access your Rebuild dashboard.</p>
          <p className="font-body text-slate-supporting text-sm mt-4">The link expires in 24 hours.</p>
        </div>
      </div>
    </div>
  )
}
