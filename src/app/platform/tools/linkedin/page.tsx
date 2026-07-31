// Claude Code: Implement LinkedIn Optimizer
// Ref: Artifact 6 Step 11 — review headline, about, experience, skills, featured
// Connect to Anthropic API via /api/resume (reuse resume AI service)
export default function LinkedInToolPage() {
  return <ToolScaffold title="LinkedIn Optimizer" description="Optimize your LinkedIn presence for executive visibility and recruiter discovery." />
}

function ToolScaffold({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-navy py-4 px-6">
        <p className="font-display text-white font-bold">HopeAfter50 — {title}</p>
      </div>
      <div className="max-content mx-auto px-6 py-12">
        <h1 className="font-display text-display-md text-navy mb-4">{title}</h1>
        <p className="font-body text-slate-supporting text-lg mb-8">{description}</p>
        <div className="card border-2 border-dashed border-sage text-center py-12">
          <p className="font-body text-slate-supporting">Claude Code: implement this tool</p>
        </div>
      </div>
    </div>
  )
}
