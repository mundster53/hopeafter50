import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="bg-warm-white section-padding">
        <div className="max-content mx-auto">
          <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
            Your Trust Matters
          </p>
          <h1 className="font-display text-display-md text-navy mb-8">Privacy Policy</h1>
          <div className="space-y-4 mb-10">
            <p className="font-body text-lg text-navy">
              We know you're trusting us with a difficult season of your life. Here's a plain-language
              explanation of what we collect and how we use it — no legal jargon.
            </p>
            <p className="font-body text-navy">
              We collect your email address, the responses you share with us about your story and
              situation, and any resume content you upload or paste into our tools.
            </p>
            <p className="font-body text-navy">
              We use this information to provide the platform's tools — your personalized Rebuild
              Plan, resume and interview help, and other features — and to send you encouragement
              and updates by email.
            </p>
            <p className="font-body text-navy">
              We never sell your information, and we never share it with third parties for
              marketing or advertising purposes.
            </p>
            <p className="font-body text-navy">
              If you'd like your data deleted, just email Bret directly at{' '}
              <a href="mailto:hello@hopeafter50.org" className="text-amber-hope hover:underline">
                hello@hopeafter50.org
              </a>{' '}
              and we'll take care of it.
            </p>
          </div>
          <div className="bg-sage rounded-card p-6">
            <p className="font-display text-display-sm text-navy mb-2">You're not alone.</p>
            <p className="font-body text-navy text-lg">And your information is safe with us.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
