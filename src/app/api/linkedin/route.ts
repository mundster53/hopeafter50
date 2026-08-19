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
import { LinkedInAnalysisResult, LinkedInSectionFeedback } from '@/types/ai'

const LINKEDIN_TASK_PROMPT = `You are a LinkedIn profile coach helping a job seeker over 50 get noticed by recruiters and hiring managers. The member has pasted sections from their LinkedIn profile. Your job is to give them specific, actionable suggestions to improve each section they provided so their profile gives them the best possible chance of landing a new opportunity.

For each section the member provided (headline, about/summary, skills), do two things:
1. Tell them honestly what is working and what is not — in plain language, like a trusted friend who knows LinkedIn well
2. Give them a ready-to-use rewrite they can copy and paste directly into their LinkedIn profile

Format your response as clearly separated sections, one per field they filled in. Each section should have:
- A brief honest assessment (2-4 sentences)
- A 'Here's what to use instead:' block with the actual suggested copy they can paste in

Ground your suggestions in what actually works on LinkedIn today:
- Headlines should be keyword-rich, human-readable, and tell the reader who you help and how — not just a job title
- About sections should open with a strong hook, tell a human story, include measurable accomplishments, and end with what the person is looking for next
- Skills should reflect what recruiters in that industry actually search for

Do not use the words optimize, leverage, assessment, or synergy. Write like a trusted friend, not a career coach. Do not reference resumes, ATS systems, or resume formatting — this is a LinkedIn profile, not a resume. Never suggest converting their profile into a resume.

---

Respond with ONLY valid JSON (no markdown fences, no commentary outside it) matching this exact structure. Include a key only for each section the member actually provided text for; omit keys for sections left blank:

{
  "headline": { "assessment": "...", "rewrite": "..." },
  "about": { "assessment": "...", "rewrite": "..." },
  "skills": { "assessment": "...", "rewrite": "..." }
}`

// Each job is sent to Claude in its own isolated call — see FOUNDATION.md's
// commitment to never let a member say something in an interview they can't
// back up. A single multi-job prompt risks the model blending accomplishments
// across roles no matter how strong the isolation instruction is worded, so
// every job gets its own call with only that job's own pasted text in context.
const JOB_TASK_PROMPT = `You are helping someone strengthen a single job entry for their LinkedIn profile. They have pasted the text of one job directly from LinkedIn. Rewrite it to be stronger and more compelling using only what they provided. Do not add accomplishments, metrics, tools, or claims that were not stated. Do not invent anything. The member must be able to defend every word in an interview.

Also tell them honestly what is working and what is not about this entry — in plain language, like a trusted friend who knows LinkedIn well (2-4 sentences).

Do not use the words optimize, leverage, assessment, or synergy. Write like a trusted friend, not a career coach. Do not reference resumes, ATS systems, or resume formatting — this is a LinkedIn profile, not a resume.

---

Respond with ONLY valid JSON (no markdown fences, no commentary outside it) matching this exact structure:

{
  "assessment": "...",
  "rewrite": "..."
}`

async function analyzeJob(jobText: string): Promise<LinkedInSectionFeedback> {
  try {
    return await runStructuredPrompt<LinkedInSectionFeedback>({
      taskPrompt: JOB_TASK_PROMPT,
      input: jobText,
      maxTokens: 1024,
    })
  } catch (err) {
    console.error('LinkedIn job analysis failed:', err)
    return {
      assessment: "We couldn't analyze this job right now. Everything else below was still generated — try this one again in a moment.",
      rewrite: jobText,
    }
  }
}

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
    }: { headline?: string; about?: string; experience?: string[]; skills?: string } = body

    const jobs = (Array.isArray(experience) ? experience : [])
      .map((job) => (typeof job === 'string' ? job.trim() : ''))
      .filter(Boolean)

    if (!headline.trim() && !about.trim() && jobs.length === 0 && !skills.trim()) {
      return NextResponse.json(
        { success: false, error: 'Paste at least one section of your LinkedIn profile.' },
        { status: 400 }
      )
    }

    const profileSections = [
      headline.trim() && `Headline:\n${headline.trim()}`,
      about.trim() && `About/Summary:\n${about.trim()}`,
      skills.trim() && `Skills:\n${skills.trim()}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const [analysis, jobResults] = await Promise.all([
      profileSections
        ? runStructuredPrompt<LinkedInAnalysisResult>({
            taskPrompt: LINKEDIN_TASK_PROMPT,
            input: profileSections,
            maxTokens: 4096,
          })
        : Promise.resolve<LinkedInAnalysisResult>({}),
      Promise.all(jobs.map((job) => analyzeJob(job))),
    ])

    if (jobResults.length) {
      analysis.experience = jobResults
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
