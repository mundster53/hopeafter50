import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="bg-warm-white section-padding">
        <div className="max-content mx-auto">
          <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-display text-display-md text-navy mb-8">About HopeAfter50</h1>
          <div className="space-y-4 mb-10">
            <p className="font-body text-lg text-navy">
              HopeAfter50 exists for people who spent decades building a career, only to have it
              disrupted — through a layoff, a closed door, or a season they never expected.
            </p>
            <p className="font-body text-navy">
              We combine practical tools, AI-powered guidance, and real human support to help
              experienced professionals replace lost income, rebuild financial confidence, and
              move forward with a plan instead of guesswork.
            </p>
            <p className="font-body text-navy">
              Whatever path fits you best — a new leadership role, consulting, business ownership,
              or retirement rebuilding — we help you evaluate it and take the next practical step.
            </p>
          </div>
          <div className="bg-sage rounded-card p-6">
            <p className="font-display text-display-sm text-navy mb-2">You're not alone.</p>
            <p className="font-body text-navy text-lg">And you're not without options.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
