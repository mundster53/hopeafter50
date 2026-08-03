// ============================================================
// HopeAfter50 — Opportunity Evaluator API
// Runs prompts/opportunity-evaluation.md against the member's
// latest resume and a specific job posting.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext, getLatestResumeContext } from '@/lib/ai/context'
import { OpportunityEvaluationResult } from '@/types/ai'

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
      location = '',
      employmentType = '',
      salary = '',
      description,
      requirements = [],
      preferredQualifications = [],
    } = body

    if (!jobTitle || !company || !description) {
      return NextResponse.json(
        { success: false, error: 'Job title, company, and job description are required.' },
        { status: 400 }
      )
    }

    const { member, assessment_analysis } = await getMemberAiContext(memberId)
    const { resumeText, resumeAnalysis } = await getLatestResumeContext(memberId)

    const evaluation = await runStructuredPrompt<OpportunityEvaluationResult>({
      promptFile: 'opportunity-evaluation.md',
      input: {
        member,
        assessment_analysis,
        resume_analysis: resumeAnalysis,
        resume_text: resumeText,
        job_posting: {
          title: jobTitle,
          company,
          location,
          employment_type: employmentType,
          salary,
          description,
          requirements,
          preferred_qualifications: preferredQualifications,
        },
      },
      maxTokens: 4096,
    })

    const saved = await prisma.opportunityEvaluation.create({
      data: {
        memberId,
        jobTitle,
        company,
        jobDescription: description,
        evaluation: evaluation as any,
        fitScore: evaluation.fit_score,
        recommendation: evaluation.recommendation,
      },
    })

    return NextResponse.json({ success: true, evaluationId: saved.id, evaluation })
  } catch (err) {
    console.error('Opportunity Evaluator API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong evaluating that opportunity. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const evaluations = await prisma.opportunityEvaluation.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, evaluations })
}
