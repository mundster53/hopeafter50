import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-warm-white flex flex-col">
      <div className="bg-navy py-4 px-6">
        <Link href="/" className="font-display text-white font-bold text-lg">HopeAfter50</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="card max-w-sm w-full text-center">
          <h1 className="font-display text-xl text-navy mb-2">Something went wrong.</h1>
          <p className="font-body text-slate-supporting mb-6">We weren't able to sign you in. The link may have expired or already been used.</p>
          <Link href="/auth/signin" className="btn-primary inline-block">Try Again</Link>
        </div>
      </div>
    </div>
  )
}
