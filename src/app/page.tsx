// ============================================================
// HopeAfter50 — Landing Page
// Design: Navy / Amber / Playfair Display + Inter
// ============================================================

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import ScrollToAnchorButton from '@/components/marketing/ScrollToAnchorButton'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session
  const ctaLabel = isLoggedIn ? 'Go to My Dashboard' : 'Start Your Next Chapter'
  const ctaHref = isLoggedIn ? '/platform/dashboard' : '/auth/signin'

  return (
    <>
      <Nav />
      <main>
        <Hero ctaLabel={ctaLabel} ctaHref={ctaHref} />
        <MoreThanEncouragement />
        <WhatYouGet ctaLabel={ctaLabel} ctaHref={ctaHref} />
        <TheBiggerQuestion ctaHref={ctaHref} />
        <YouAreNotAlone />
        <WhatHappensWhenYouJoin />
        <FinalCTA ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </main>
      <Footer />
    </>
  )
}

// ----------------------------
// Hero
// ----------------------------
function Hero({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  return (
    <section className="relative min-h-screen bg-navy flex items-center py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-6xl md:text-7xl text-white leading-tight mb-6">
          Your Career May Have Changed. Your Future Hasn't Ended.
        </h1>
        <p className="font-body text-xl text-white/90 leading-relaxed mb-6 max-w-2xl">
          Losing a job after 50 can make you question what comes next. Hope After 50
          helps experienced professionals turn that uncertainty into a plan—with
          practical tools, personalized career help, and a community that believes
          your best years don't have to be behind you.
        </p>
        <p className="font-body text-lg text-white/80 leading-relaxed mb-12 max-w-2xl">
          You don't have to figure out what's next alone.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <Link href={ctaHref} className="btn-primary text-lg py-5 px-10">
            {ctaLabel}
          </Link>
          <ScrollToAnchorButton
            targetId="what-you-get"
            className="font-body text-lg text-white border border-white/60 rounded-full py-5 px-10 hover:bg-white/10 transition-colors"
          >
            See What Members Get
          </ScrollToAnchorButton>
        </div>
        <p className="font-body text-lg font-semibold text-amber-hope text-center mt-6">
          Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
        </p>
      </div>
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="animate-bounce text-white/70">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// More Than Encouragement
// ----------------------------
function MoreThanEncouragement() {
  return (
    <section className="bg-warm-white section-padding">
      <div className="max-content mx-auto">
        <h2 className="font-display text-display-md text-navy mb-8">
          Hope Is Important. But So Is Action.
        </h2>
        <div className="space-y-4">
          <p className="font-body text-lg text-navy leading-relaxed">
            Hope After 50 isn't just a place to read encouraging words. It's a place
            to do something about what comes next.
          </p>
          <p className="font-body text-lg text-navy leading-relaxed">
            When you become a member, you get practical tools designed to help you
            present your experience better, pursue opportunities more strategically,
            and start thinking beyond the job you lost.
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <p className="font-body text-lg font-semibold text-navy bg-sage/50 border-l-4 border-amber-hope rounded-full px-6 py-3 text-center">
            Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
          </p>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// What You Get
// ----------------------------
function WhatYouGet({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  const cards = [
    {
      title: 'Resume Analysis & Improvement',
      description:
        "Upload your resume and get an analysis of how well it presents your experience, accomplishments, skills, and value. Then improve it—with help creating a stronger resume that still sounds like you.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Customize for Every Opportunity',
      description:
        "Have a job you're interested in? Upload or paste the job description and create a version of your resume specifically aligned with that opportunity—so your qualifications are easier for employers and applicant tracking systems to recognize.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <circle cx="12" cy="12" r="5" strokeWidth={2} />
          <circle cx="12" cy="12" r="1" strokeWidth={2} />
        </svg>
      ),
    },
    {
      title: 'LinkedIn Profile Optimization',
      description:
        "Get help improving your LinkedIn profile so your headline, About section, experience, and overall positioning accurately communicate the value of your experience. Your resume and LinkedIn profile should tell the same story.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="8" cy="8" r="3" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 21v-1a6 6 0 016-6h0a6 6 0 016 6v1" />
          <circle cx="18" cy="7" r="2" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 21v-1a4 4 0 013-3.87" />
        </svg>
      ),
    },
    {
      title: "Figure Out What's Next",
      description:
        "Maybe the answer isn't another job exactly like the one you had. Explore the skills, experience, interests, and opportunities that could shape your next chapter—including consulting, fractional work, entrepreneurship, or other paths.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-3 6-3-3 6-3z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="what-you-get" className="bg-sage section-padding">
      <div className="max-wide mx-auto">
        <h2 className="font-display text-display-md text-navy mb-12 text-center">
          Practical Help for Your Next Chapter
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {cards.map((card) => (
            <div key={card.title} className="card-hover">
              <div className="text-amber-hope mb-4">{card.icon}</div>
              <h3 className="font-display text-lg text-navy mb-3">{card.title}</h3>
              <p className="font-body text-slate-supporting leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mb-6">
          <p className="font-body text-lg font-semibold text-navy bg-amber-hope/15 border-l-4 border-amber-hope rounded-full px-6 py-3 text-center">
            Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
          </p>
        </div>
        <div className="text-center">
          <Link href={ctaHref} className="btn-primary text-lg py-5 px-10">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// The Bigger Question
// ----------------------------
function TheBiggerQuestion({ ctaHref }: { ctaHref: string }) {
  const buildingLines = [
    "Maybe you've spent decades doing what needed to be done.",
    'Building a career.',
    'Raising a family.',
    'Paying the bills.',
    'Taking care of everyone else.',
    'And somewhere along the way, you stopped asking:',
  ]

  const maybeLines = [
    "Maybe it's another career.",
    "Maybe it's consulting.",
    "Maybe it's building something of your own.",
    "Maybe it's doing work that gives you more freedom.",
    "Maybe it's something you've been putting off for years.",
  ]

  return (
    <section className="bg-navy section-padding">
      <div className="max-content mx-auto">
        <h2 className="font-display text-display-lg text-amber-hope mb-10">
          What Is Your Dream?
        </h2>
        <div className="space-y-3 mb-10">
          {buildingLines.map((line) => (
            <p key={line} className="font-body text-lg text-white/90">
              {line}
            </p>
          ))}
        </div>
        <p className="font-display text-3xl md:text-4xl italic text-white mb-10 leading-snug">
          "What do I actually want to do next?"
        </p>
        <div className="space-y-4 mb-10">
          <p className="font-body text-lg text-white leading-relaxed">
            We believe this season of life can be about more than replacing the
            paycheck you lost.
          </p>
          <p className="font-body text-lg text-white leading-relaxed">
            It can be an opportunity to step back and ask: What would I really like
            the next chapter of my life to look like?
          </p>
        </div>
        <div className="space-y-2 mb-10">
          {maybeLines.map((line) => (
            <p key={line} className="font-body text-lg text-amber-hope/90">
              {line}
            </p>
          ))}
        </div>
        <p className="font-body text-lg text-white mb-12">
          You don't have to have the answer today. But it's worth asking the question.
        </p>
        <p className="font-body text-lg font-semibold text-amber-hope text-center mb-6">
          Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
        </p>
        <div className="text-center">
          <Link href={ctaHref} className="btn-primary text-lg py-5 px-10">
            Start Exploring What's Next
          </Link>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// You Are Not Alone
// ----------------------------
function YouAreNotAlone() {
  return (
    <section className="bg-warm-white section-padding">
      <div className="max-content mx-auto">
        <h2 className="font-display text-display-md text-navy mb-8">
          Practical Help. Real Hope. A Community That Gets It.
        </h2>
        <div className="space-y-4 mb-8">
          <p className="font-body text-lg text-navy leading-relaxed">
            There is a unique experience that comes with trying to rebuild your
            career later in life.
          </p>
          <p className="font-body text-lg text-navy leading-relaxed">
            The uncertainty. The rejection. The frustration of being told you're
            overqualified. Wondering whether employers see your experience as an
            asset—or a liability. Wondering what happens if the next opportunity
            never comes.
          </p>
          <p className="font-body text-lg text-navy leading-relaxed">
            You don't have to pretend those things aren't real. But you also don't
            have to let them define your future.
          </p>
          <p className="font-body text-lg text-navy leading-relaxed">
            Hope After 50 combines practical career help with encouragement,
            community, prayer, and stories of people finding their way forward.
          </p>
        </div>
        <p className="font-display text-2xl text-navy">
          We believe there is still a future worth pursuing.
        </p>
        <div className="flex justify-center mt-8">
          <p className="font-body text-lg font-semibold text-navy bg-sage/50 border-l-4 border-amber-hope rounded-full px-6 py-3 text-center">
            Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
          </p>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// What Happens When You Join
// ----------------------------
function WhatHappensWhenYouJoin() {
  const steps = [
    {
      title: 'Tell Us Where You Are',
      description: 'Give us some context about your situation, experience, goals, and what you\'re looking for.',
    },
    {
      title: 'Strengthen Your Foundation',
      description: 'Analyze and improve your resume and LinkedIn presence so you\'re presenting yourself as strongly as possible.',
    },
    {
      title: 'Pursue Real Opportunities',
      description: 'Use your improved resume to pursue specific opportunities and customize it for the jobs that interest you.',
    },
    {
      title: 'Think Beyond the Immediate Problem',
      description: 'Begin exploring what your next chapter could actually look like—not simply how to replace what you lost.',
    },
    {
      title: 'Keep Moving Forward',
      description: 'Use the tools, encouragement, community, and resources available through Hope After 50 as you work toward what\'s next.',
    },
  ]

  return (
    <section className="bg-sage section-padding">
      <div className="max-content mx-auto">
        <h2 className="font-display text-display-md text-navy mb-12">
          Start Where You Are. Move Forward From There.
        </h2>
        <div className="space-y-10">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-6">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-hope flex items-center justify-center">
                  <span className="font-body font-bold text-white">{i + 1}</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="font-display text-xl text-navy mb-1">{step.title}</p>
                <p className="font-body text-slate-supporting leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <p className="font-body text-lg font-semibold text-navy bg-amber-hope/15 border-l-4 border-amber-hope rounded-full px-6 py-3 text-center">
            Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
          </p>
        </div>
      </div>
    </section>
  )
}

// ----------------------------
// Final CTA
// ----------------------------
function FinalCTA({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  return (
    <section className="bg-navy section-padding text-center">
      <div className="max-content mx-auto">
        <h2 className="font-display text-display-md text-white mb-8">
          Your Next Chapter Is Still Being Written.
        </h2>
        <div className="space-y-3 mb-10">
          <p className="font-body text-lg text-white/90">
            You may not know exactly where you're going yet. That's okay.
          </p>
          <p className="font-body text-lg text-white/90">
            You don't need to have everything figured out. You just need to take
            the next step.
          </p>
          <p className="font-body text-lg text-white/90">
            Hope After 50 is here to help you take it.
          </p>
        </div>
        <Link href={ctaHref} className="btn-primary text-lg py-5 px-10">
          {ctaLabel}
        </Link>
        <p className="font-body text-lg font-semibold text-amber-hope mt-6">
          Free to join. Always. Hope After 50 runs entirely on the generosity of people who believe in this mission.
        </p>
      </div>
    </section>
  )
}
