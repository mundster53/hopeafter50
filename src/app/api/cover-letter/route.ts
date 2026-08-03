// ============================================================
// HopeAfter50 — Cover Letter API
// Runs prompts/cover-letter.md against the member's latest resume
// and a specific job posting.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext, getLatestResumeContext } from '@/lib/ai/context'
import { CoverLetterResult } from '@/types/ai'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const {
      jobTitle,
      company,
      description,
      requirements = [],
      hiringManagerName = '',
      opportunityEvaluationId = null,
    } = body

    if (!jobTitle || !company || !description) {
      return NextResponse.json(
        { success: false, error: 'Job title, company, and job description are required.' },
        { status: 400 }
      )
    }

    const { member, assessment_analysis } = await getMemberAiContext(memberId)
    const { resumeText, resumeAnalysis } = await getLatestResumeContext(memberId)

    if (!resumeText) {
      return NextResponse.json(
        {
          success: false,
          error: 'Run the Resume Intelligence tool first — a cover letter needs your resume to draw from.',
        },
        { status: 422 }
      )
    }

    // The prompt's job_posting schema is company/title/description/requirements.
    // A hiring manager name has nowhere else to go, so it's folded into the
    // description text itself, matching how the prompt already discusses
    // detecting whether one was provided.
    const descriptionWithGreeting = hiringManagerName
      ? `Hiring Manager: ${hiringManagerName}\n\n${description}`
      : description

    const result = await runStructuredPrompt<CoverLetterResult>({
      promptFile: 'cover-letter.md',
      input: {
        member,
        resume_text: resumeText,
        resume_analysis: resumeAnalysis,
        assessment_analysis,
        job_posting: {
          company,
          title: jobTitle,
          description: descriptionWithGreeting,
          requirements,
        },
      },
      maxTokens: 4096,
    })

    const saved = await prisma.coverLetter.create({
      data: {
        memberId,
        opportunityEvaluationId,
        jobTitle,
        company,
        coverLetterMarkdown: result.cover_letter_markdown,
        keyStrengths: result.key_strengths_emphasized,
        customizations: result.customizations,
        confidence: result.confidence,
      },
    })

    await prisma.memberMilestone.upsert({
      where: { memberId_milestoneId: { memberId, milestoneId: 'cover_letter_generated' } },
      create: { memberId, milestoneId: 'cover_letter_generated' },
      update: {},
    })

    return NextResponse.json({ success: true, coverLetterId: saved.id, result })
  } catch (err) {
    console.error('Cover Letter API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong generating your cover letter. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const coverLetters = await prisma.coverLetter.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, coverLetters })
}
