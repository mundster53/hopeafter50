// ============================================================
// HopeAfter50 — All Tools
// Every tool, reachable regardless of what the Rebuild Plan is
// currently recommending on the dashboard.
// ============================================================
import Link from 'next/link'
import { TOOLS } from '@/lib/tools'
import PlatformNav from '@/components/platform/PlatformNav'

export default function AllToolsPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <PlatformNav />

      <div className="max-wide mx-auto px-6 py-12">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">All Tools</p>
        <h1 className="font-display text-display-md text-navy mb-8">Every tool, whenever you need it.</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(TOOLS).map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="card-hover flex flex-col"
            >
              <p className="font-display text-lg text-navy mb-2">{tool.label}</p>
              <p className="font-body text-slate-supporting text-sm mb-4 flex-1">{tool.description}</p>
              <p className="font-body text-amber-hope text-sm font-medium">{tool.estimatedMinutes} min →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
