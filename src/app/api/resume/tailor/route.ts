// ============================================================
// HopeAfter50 — Resume Tailoring API
// Tailors a member's already-optimized resume to a specific job
// description, using prompts/resume-tailoring.md.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext } from '@/lib/ai/context'
import { AGE_50_PLUS_INSTRUCTION } from '@/lib/ai/agePolicy'
import { ResumeTailoringResult } from '@/types/ai'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const { optimizedResumeMarkdown, jobDescription } = await req.json()

    if (typeof optimizedResumeMarkdown !== 'string' || !optimizedResumeMarkdown.trim()) {
      return NextResponse.json(
        { success: false, error: 'A resume is required.' },
        { status: 400 }
      )
    }
    if (typeof jobDescription !== 'string' || jobDescription.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Please paste the full job description.' },
        { status: 422 }
      )
    }

    const { member, assessment_analysis, isAge50Plus } = await getMemberAiContext(memberId)

    const tailoring = await runStructuredPrompt<ResumeTailoringResult>({
      promptFile: 'resume-tailoring.md',
      input: {
        member,
        optimized_resume_markdown: optimizedResumeMarkdown,
        job_description: jobDescription,
        assessment_analysis,
      },
      maxTokens: 8192,
      extraSystemInstruction: isAge50Plus ? AGE_50_PLUS_INSTRUCTION : undefined,
    })

    return NextResponse.json({
      success: true,
      tailoring: {
        ...tailoring,
        top_strengths: tailoring.top_strengths ?? [],
        honest_gaps: tailoring.honest_gaps ?? [],
        keywords_incorporated: tailoring.keywords_incorporated ?? [],
      },
    })
  } catch (err) {
    console.error('Resume Tailoring API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong tailoring your resume. Please try again.' },
      { status: 500 }
    )
  }
}
