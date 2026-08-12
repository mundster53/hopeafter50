import Link from 'next/link'
import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'

const RESOURCES = [
  {
    title: 'AI Resume Guide',
    description: 'How to use AI tools to strengthen — not replace — your professional experience.',
  },
  {
    title: 'Networking Strategies',
    description: 'Practical ways to reconnect and build new relationships during a career transition.',
  },
  {
    title: 'Executive Interview Prep',
    description: 'Preparation strategies tailored to experienced, senior-level candidates.',
  },
  {
    title: 'Financial Recovery',
    description: 'First steps for stabilizing your finances after an unexpected income loss.',
  },
]

export default function ResourcesPage() {
  return (
    <>
      <Nav />
      <main className="bg-warm-white section-padding">
        <div className="max-content mx-auto">
          <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
            Learning Center
          </p>
          <h1 className="font-display text-display-md text-navy mb-4">Resources</h1>
          <p className="font-body text-lg text-navy mb-12">
            Practical guides to support you at every stage of rebuilding.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {RESOURCES.map((r) => (
              <div key={r.title} className="card-hover">
                <h3 className="font-display text-lg text-navy mb-3">{r.title}</h3>
                <p className="font-body text-slate-supporting leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
          <p className="font-body text-navy">
            Want guidance tailored to your situation?{' '}
            <Link href="/auth/signin" className="text-amber-hope hover:underline">
              Get your personalized Rebuild Plan
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
