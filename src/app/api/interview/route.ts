// ============================================================
// HopeAfter50 — Interview Preparation API
// Runs prompts/interview-prep.md against the member's latest
// resume and a specific job posting.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext, getLatestResumeContext } from '@/lib/ai/context'
import { InterviewPrepResult } from '@/types/ai'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const { jobTitle, company, description, requirements = [] } = body

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
          error: 'Run the Resume Intelligence tool first — interview prep draws its talking points from your resume.',
        },
        { status: 422 }
      )
    }

    const prep = await runStructuredPrompt<InterviewPrepResult>({
      promptFile: 'interview-prep.md',
      input: {
        member,
        resume_text: resumeText,
        resume_analysis: resumeAnalysis,
        assessment_analysis,
        job_posting: { company, title: jobTitle, description, requirements },
      },
      maxTokens: 4096,
    })

    const saved = await prisma.interviewPrep.create({
      data: { memberId, jobTitle, company, prep: prep as any },
    })

    return NextResponse.json({ success: true, interviewPrepId: saved.id, prep })
  } catch (err) {
    console.error('Interview Prep API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong preparing for that interview. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const preps = await prisma.interviewPrep.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, preps })
}
