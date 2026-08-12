import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="bg-warm-white section-padding">
        <div className="max-content mx-auto">
          <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
            We'd Love to Hear From You
          </p>
          <h1 className="font-display text-display-md text-navy mb-8">Contact Us</h1>
          <div className="space-y-4 mb-10">
            <p className="font-body text-lg text-navy">
              The best way to reach us is by email. Whether you have a question, need help, or
              just want to share where you're at — we read every message.
            </p>
            <p className="font-body text-navy">
              We'll get back to you personally, as soon as we can.
            </p>
          </div>
          <div className="bg-sage rounded-card p-6">
            <p className="font-display text-display-sm text-navy mb-2">Email us</p>
            <a
              href="mailto:hello@hopeafter50.org"
              className="font-display text-xl text-amber-hope hover:underline"
            >
              hello@hopeafter50.org
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
