// ============================================================
// HopeAfter50 — LinkedIn Optimizer API
// No dedicated /prompts/*.md file exists for LinkedIn — the task
// prompt below is LinkedIn-specific (not resume guidance) and is
// layered on top of prompts/system.md via runStructuredPrompt's
// inline `taskPrompt` option.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { LinkedInAnalysisResult, LinkedInJobInput } from '@/types/ai'

const LINKEDIN_TASK_PROMPT = `You are a LinkedIn profile coach helping a job seeker over 50 get noticed by recruiters and hiring managers. The member has pasted sections from their LinkedIn profile. Your job is to give them specific, actionable suggestions to improve each section they provided so their profile gives them the best possible chance of landing a new opportunity.

For each section the member provided (headline, about/summary, experience, skills), do two things:
1. Tell them honestly what is working and what is not — in plain language, like a trusted friend who knows LinkedIn well
2. Give them a ready-to-use rewrite they can copy and paste directly into their LinkedIn profile

Format your response as clearly separated sections, one per field they filled in. Each section should have:
- A brief honest assessment (2-4 sentences)
- A 'Here's what to use instead:' block with the actual suggested copy they can paste in

Ground your suggestions in what actually works on LinkedIn today:
- Headlines should be keyword-rich, human-readable, and tell the reader who you help and how — not just a job title
- About sections should open with a strong hook, tell a human story, include measurable accomplishments, and end with what the person is looking for next
- Experience sections should lead with scope (team size, budget, geography) then accomplishments with numbers wherever possible
- Skills should reflect what recruiters in that industry actually search for

CRITICAL RULE — EXPERIENCE ISOLATION: Each job experience entry must be treated as a completely independent unit. You may ONLY use information explicitly provided for that specific role when writing or rewriting it. Do NOT transfer accomplishments, metrics, skills, tools, or language from one job to another. Do NOT infer, invent, or embellish anything that was not stated by the member for that specific role. If a role has limited information, write a stronger version of what was provided — do not supplement it with details from other roles. Members must be able to defend every word in an interview.

The Experience section, if provided, is a numbered list of jobs, each clearly demarcated like this:

--- JOB 1: [Title] at [Company] ---
[Member's input for this job only]

--- JOB 2: [Title] at [Company] ---
[Member's input for this job only]

Treat each "--- JOB N ---" block as walled off from every other block. Write one assessment and one rewrite per job, using only what appears inside that job's own block.

Do not use the words optimize, leverage, assessment, or synergy. Write like a trusted friend, not a career coach. Do not reference resumes, ATS systems, or resume formatting — this is a LinkedIn profile, not a resume. Never suggest converting their profile into a resume.

---

Respond with ONLY valid JSON (no markdown fences, no commentary outside it) matching this exact structure. Include a key only for each section the member actually provided text for; omit keys for sections left blank. If experience was provided, "experience" must be an array with exactly one entry per JOB block, in the same order they were given, and each entry's "title"/"company" must match that job's block:

{
  "headline": { "assessment": "...", "rewrite": "..." },
  "about": { "assessment": "...", "rewrite": "..." },
  "experience": [
    { "title": "...", "company": "...", "assessment": "...", "rewrite": "..." }
  ],
  "skills": { "assessment": "...", "rewrite": "..." }
}`

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const {
      headline = '',
      about = '',
      experience = [],
      skills = '',
    }: { headline?: string; about?: string; experience?: LinkedInJobInput[]; skills?: string } = body

    const jobs = (Array.isArray(experience) ? experience : []).filter(
      (job) => job?.title?.trim() || job?.company?.trim() || job?.details?.trim()
    )

    if (!headline.trim() && !about.trim() && jobs.length === 0 && !skills.trim()) {
      return NextResponse.json(
        { success: false, error: 'Paste at least one section of your LinkedIn profile.' },
        { status: 400 }
      )
    }

    const experienceBlock = jobs.length
      ? `Experience:\n${jobs
          .map(
            (job, i) =>
              `--- JOB ${i + 1}: ${job.title.trim() || 'Untitled role'} at ${job.company.trim() || 'Unknown company'} ---\n${job.details.trim()}`
          )
          .join('\n\n')}`
      : ''

    const profileSections = [
      headline.trim() && `Headline:\n${headline.trim()}`,
      about.trim() && `About/Summary:\n${about.trim()}`,
      experienceBlock,
      skills.trim() && `Skills:\n${skills.trim()}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const analysis = await runStructuredPrompt<LinkedInAnalysisResult>({
      taskPrompt: LINKEDIN_TASK_PROMPT,
      input: profileSections,
      maxTokens: 4096,
    })

    // Fall back to the member's own title/company if the model omitted or
    // altered them, so the UI heading always reflects the source job.
    if (analysis.experience) {
      analysis.experience = analysis.experience.map((entry, i) => ({
        ...entry,
        title: jobs[i]?.title.trim() || entry.title,
        company: jobs[i]?.company.trim() || entry.company,
      }))
    }

    const saved = await prisma.linkedInOptimization.create({
      data: {
        memberId,
        headline: headline || null,
        about: about || null,
        experience: jobs.length ? JSON.stringify(jobs) : null,
        analysis: analysis as any,
      },
    })

    await prisma.memberMilestone.upsert({
      where: { memberId_milestoneId: { memberId, milestoneId: 'linkedin_updated' } },
      create: { memberId, milestoneId: 'linkedin_updated' },
      update: {},
    })

    return NextResponse.json({ success: true, linkedInOptimizationId: saved.id, analysis })
  } catch (err) {
    console.error('LinkedIn Optimizer API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong analyzing your profile. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const optimizations = await prisma.linkedInOptimization.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, optimizations })
}
