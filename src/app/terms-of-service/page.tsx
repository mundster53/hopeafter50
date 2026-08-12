import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function TermsOfServicePage() {
  return (
    <>
      <Nav />
      <main className="bg-warm-white section-padding">
        <div className="max-content mx-auto">
          <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
            The Fine Print
          </p>
          <h1 className="font-display text-display-md text-navy mb-8">Terms of Service</h1>
          <div className="space-y-4 mb-10">
            <p className="font-body text-lg text-navy">
              HopeAfter50 is free for everyone who needs it. Here's what that means in plain
              language.
            </p>
            <p className="font-body text-navy">
              We provide tools, guidance, and encouragement to help you rebuild — but we can't
              guarantee any specific outcome, including whether or when you'll find a new role or
              income source. Your results depend on your own effort, circumstances, and choices.
            </p>
            <p className="font-body text-navy">
              Anything you share with us — your story, your resume, your responses — belongs to
              you. We use it only to provide the platform's tools and support to you.
            </p>
            <p className="font-body text-navy">
              We reserve the right to remove accounts that abuse the platform, harass others, or
              misuse the tools we've built.
            </p>
            <p className="font-body text-navy">
              The platform is provided as-is, without warranties of any kind. We do our best to
              keep it reliable and helpful, but we can't promise it will always be perfect or
              uninterrupted.
            </p>
          </div>
          <div className="bg-sage rounded-card p-6">
            <p className="font-display text-display-sm text-navy mb-2">Questions about any of this?</p>
            <p className="font-body text-navy text-lg">
              Just reach out — we're glad to talk it through.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
