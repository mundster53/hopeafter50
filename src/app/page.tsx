// ============================================================
// HopeAfter50 — Landing Page
// Content from Artifact 1
// Design: Navy / Amber / Playfair Display + Inter
// ============================================================

import Link from 'next/link'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WeUnderstand />
        <WhatWeDo />
        <WhatHappensNext />
        <AreasWeHelp />
        <OurPromise />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

// ----------------------------
// Hero
// ----------------------------
function Hero() {
  return (
    <section className="min-h-screen bg-navy flex items-center py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-6xl md:text-7xl text-white leading-tight mb-6">
          You spent decades building your career.
        </h1>
        <p className="font-display text-3xl md:text-4xl text-amber-hope leading-snug mb-10">
          You shouldn't have to rebuild your future alone.
        </p>
        <p className="font-body text-2xl text-white/90 leading-relaxed mb-6 max-w-2xl">
          If you've unexpectedly lost the career you spent years building and you're
          wondering how you'll replace your income, rebuild your confidence, and
          eventually retire...
        </p>
        <p className="font-display text-3xl text-white font-semibold mb-10">
          You're in the right place.
        </p>
        <p className="font-body text-xl text-white/80 leading-relaxed mb-12 max-w-2xl">
          Hope After 50 exists to help experienced professionals rebuild after career
          disruption with practical next steps, personalized tools, and renewed hope.
        </p>
        <Link href="/platform/assessment" className="btn-primary text-lg py-5 px-10">
          Find My Next Step
        </Link>
        <p className="font-body text-lg text-white font-semibold mt-6">
          Free for every professional who needs it.
        </p>
      </div>
    </section>
  )
}

// ----------------------------
// We Understand
// ----------------------------
function WeUnderstand() {
  const questions = [
    'Will I ever replace this income?',
    'Will I have enough to retire?',
    'How long will my savings last?',
    'Where do I even start?',
  ]

  return (
    <section className="bg-warm-white section-padding">
      <div className="max-content mx-auto">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
          Because we've been there.
        </p>
        <h2 className="font-display text-display-md text-navy mb-8">
          We Understand.
        </h2>
        <div className="space-y-4 mb-10">
          <p className="font-body text-lg text-navy">You spent decades becoming good at what you do.</p>
          <p className="font-body text-lg text-navy">Then one day — everything changed.</p>
          <p className="font-body text-slate-supporting">
            Maybe it was a layoff. Maybe your position disappeared. Maybe the company changed.
          </p>
          <p className="font-body text-lg text-navy font-medium">Whatever happened — you now find yourself asking questions you never expected to ask.</p>
        </div>
        <div className="space-y-3 mb-10 pl-6 border-l-2 border-amber-hope">
          {questions.map((q) => (
            <p key={q} className="font-display text-xl text-navy italic">{q}</p>
          ))}
        </div>
        <div className="bg-sage rounded-card p-6">
          <p className="font-display text-display-sm text-navy mb-2">You're not alone.</p>
          <p className="font-body text-slate-supporting text-lg">And you're not without options.</p>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// What We Do
// ----------------------------
function WhatWeDo() {
  const items = [
    'Replace lost income.',
    'Evaluate every legitimate path forward.',
    'Use AI to strengthen — not replace — your experience.',
    'Rebuild financial confidence.',
    'Rebuild hope.',
  ]

  return (
    <section className="bg-navy section-padding">
      <div className="max-content mx-auto">
        <p className="font-body text-amber-hope text-sm tracking-widest uppercase mb-4">What We Do</p>
        <h2 className="font-display text-display-md text-white mb-10">
          HopeAfter50 helps experienced professionals:
        </h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-hope mt-3 shrink-0" />
              <p className="font-body text-lg text-white/90">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// What Happens Next
// ----------------------------
function WhatHappensNext() {
  const steps = [
    {
      title: 'Complete the Rebuild Assessment.',
      detail: 'Approximately 10 minutes.',
      sub: null,
    },
    {
      title: 'Receive your personalized Rebuild Plan immediately.',
      detail: 'Not generic advice.',
      sub: 'A practical plan built around your situation.',
    },
    {
      title: 'Continue however works best for you.',
      detail: null,
      sub: null,
      options: ['Work through the tools yourself.', 'Send us a message.', 'Schedule a conversation.'],
    },
  ]

  return (
    <section className="bg-warm-white section-padding">
      <div className="max-content mx-auto">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
          The Path Forward
        </p>
        <h2 className="font-display text-display-md text-navy mb-12">What Happens Next</h2>
        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-hope flex items-center justify-center">
                  <span className="font-body font-bold text-white">{i + 1}</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="font-display text-xl text-navy mb-1">{step.title}</p>
                {step.detail && <p className="font-body text-slate-supporting mb-1">{step.detail}</p>}
                {step.sub && <p className="font-body text-navy font-medium">{step.sub}</p>}
                {step.options && (
                  <ul className="mt-3 space-y-1">
                    {step.options.map((o) => (
                      <li key={o} className="font-body text-slate-supporting flex items-start gap-2">
                        <span className="text-amber-hope mt-1">→</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="font-body text-slate-supporting mt-10 text-lg">You decide.</p>
      </div>
    </section>
  )
}

// ----------------------------
// Areas We Help
// ----------------------------
function AreasWeHelp() {
  const areas = [
    {
      title: 'Replace My Income',
      description: 'Discover practical ways to replace lost income as quickly as possible.',
    },
    {
      title: 'Find Another Leadership Role',
      description: 'Modern job search strategies designed for experienced professionals.',
    },
    {
      title: 'Fractional & Consulting',
      description: 'Determine whether your experience can generate income outside a traditional W-2 position.',
    },
    {
      title: 'Business Acquisition',
      description: 'Evaluate whether buying a business fits your financial goals, experience, and lifestyle.',
    },
    {
      title: 'Retirement Rebuild',
      description: 'Develop a practical strategy to restore long-term financial security.',
    },
    {
      title: 'AI Career Tools',
      description: 'Résumé optimization. Cover letters. LinkedIn. Interview preparation. Career positioning.',
    },
  ]

  return (
    <section className="bg-sage section-padding">
      <div className="max-wide mx-auto">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4 text-center">
          Where We Can Help
        </p>
        <h2 className="font-display text-display-md text-navy mb-12 text-center">
          Areas We Can Help
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div key={area.title} className="card-hover">
              <h3 className="font-display text-lg text-navy mb-3">{area.title}</h3>
              <p className="font-body text-slate-supporting leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// Our Promise
// ----------------------------
function OurPromise() {
  const promises = [
    "We'll never overwhelm you.",
    "We'll never pressure you.",
    "We'll never waste your time.",
    "We'll never pretend to have all the answers.",
    "We'll help you determine the next practical step.",
    "And we'll walk beside you for as long as you need us.",
  ]

  return (
    <section className="bg-navy section-padding">
      <div className="max-content mx-auto">
        <p className="font-body text-amber-hope text-sm tracking-widest uppercase mb-4">
          Our Promise
        </p>
        <div className="space-y-4">
          {promises.map((p) => (
            <p
              key={p}
              className={`font-display text-xl leading-relaxed ${
                p.startsWith("And") ? 'text-amber-hope' : 'text-white'
              }`}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// Final CTA
// ----------------------------
function FinalCTA() {
  return (
    <section className="bg-warm-white section-padding text-center">
      <div className="max-content mx-auto">
        <h2 className="font-display text-display-md text-navy mb-4">
          You don't have to have everything figured out today.
        </h2>
        <p className="font-body text-lg text-slate-supporting mb-4">
          You simply need a place to begin.
        </p>
        <p className="font-display text-xl text-navy mb-10">
          Let's take the next step together.
        </p>
        <Link href="/platform/assessment" className="btn-primary">
          Find My Next Step
        </Link>
      </div>
    </section>
  )
}
