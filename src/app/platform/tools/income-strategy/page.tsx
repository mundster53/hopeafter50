// Claude Code: Implement Income Strategy Planner + Financial Runway Calculator
// Supports tabs: strategy | runway
// Ref: Artifact 4 (Financial Runway), Artifact 5 (career direction logic)
// Financial Runway: monthly expenses, savings, severance, health insurance timeline
import PlatformNav from '@/components/platform/PlatformNav'

export default function IncomeStrategyPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <PlatformNav />
      <div className="max-content mx-auto px-6 py-12">
        <h1 className="font-display text-display-md text-navy mb-4">Income Strategy Planner</h1>
        <p className="font-body text-slate-supporting text-lg mb-8">Identify your fastest path to income and calculate your financial runway.</p>
        <div className="card border-2 border-dashed border-sage text-center py-12">
          <p className="font-body text-slate-supporting">Claude Code: implement this tool</p>
        </div>
      </div>
    </div>
  )
}
