// ============================================================
// HopeAfter50 — Partner Thank You Page
// Public — no authentication required. Reached after a Stripe
// checkout success redirect, so it must render for members and
// non-members alike.
// ============================================================
import Link from 'next/link'

export default function PartnerThankYouPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center">
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-body text-amber-hope text-xs tracking-widest uppercase">
          Your Gift Is Making a Difference
        </p>

        <h1 className="font-display text-display-md text-white mt-6 mb-8">
          Someone&rsquo;s life is about to change.
        </h1>

        <p className="font-body text-white/80">
          Because of what you just did, someone who has lost their job, their confidence, and maybe
          their hope — will find this place free. They won&rsquo;t know your name. But what you did
          today will matter to them more than you know.
        </p>

        <hr className="border-white/10 my-10" />

        <p className="font-body text-white/70">
          Hope After 50 exists because people like you believe that nobody should have to rebuild
          alone. Every dollar goes directly to keeping these tools, this plan, and this community
          free for everyone who needs it.
        </p>

        <hr className="border-white/10 my-10" />

        <div className="flex flex-col items-center gap-4">
          <Link href="/platform/dashboard" className="btn-primary inline-block">
            Go to my dashboard
          </Link>
          <Link
            href="/"
            className="inline-block border-2 border-white/30 text-white font-body font-semibold px-8 py-4 rounded-card hover:border-white transition-colors duration-200"
          >
            Return to hopeafter50.org
          </Link>
        </div>

        <p className="font-body text-white/40 text-sm mt-12">
          A confirmation and receipt has been sent to your email.
        </p>
      </div>
    </div>
  )
}
