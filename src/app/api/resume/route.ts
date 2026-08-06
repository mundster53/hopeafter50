// ============================================================
// HopeAfter50 — Resume Intelligence API
// Artifact 6 — AI-powered resume analysis + optimization
// 1. Extract text from the uploaded resume (PDF/DOCX/plain text)
// 2. Store the original file in Vercel Blob
// 3. Run prompts/resume-analysis.md, then prompts/resume-optimization.md
// 4. Persist both results and return them
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext } from '@/lib/ai/context'
import { AGE_50_PLUS_INSTRUCTION } from '@/lib/ai/agePolicy'
import { extractResumeText } from '@/lib/resume/extractText'
import { uploadMemberFile } from '@/lib/storage/blob'
import { ResumeAnalysisResult, ResumeOptimizationResult } from '@/types/ai'

export const runtime = 'nodejs'

const AGE_DATING_SUGGESTION_PATTERN = /graduation year|early career.{0,20}date|date.{0,20}early career/i

function isAgeDatingSuggestion(suggestion: string): boolean {
  return AGE_DATING_SUGGESTION_PATTERN.test(suggestion)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const formData = await req.formData()
    const file = formData.get('resume')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: 'A resume file is required.' }, { status: 400 })
    }

    const targetRoles = splitList(formData.get('targetRoles'))
    const targetIndustries = splitList(formData.get('targetIndustries'))

    const resumeText = await extractResumeText(file)
    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'We could not read enough text from that file. Please try a different file.' },
        { status: 422 }
      )
    }

    const resumeFileUrl = await uploadMemberFile(file, 'resumes', memberId)
    const { member, assessment_analysis, isAge50Plus } = await getMemberAiContext(memberId)

    // Step 1: Resume Analysis (prompts/resume-analysis.md)
    const analysis = await runStructuredPrompt<ResumeAnalysisResult>({
      promptFile: 'resume-analysis.md',
      input: {
        member,
        resume_text: resumeText,
        target_roles: targetRoles,
        target_industries: targetIndustries,
        career_preferences: {},
        assessment_analysis,
      },
      maxTokens: 4096,
      extraSystemInstruction: isAge50Plus ? AGE_50_PLUS_INSTRUCTION : undefined,
    })

    const savedAnalysis = await prisma.resumeAnalysis.create({
      data: {
        memberId,
        resumeFileUrl,
        resumeText,
        targetRoles,
        targetIndustries,
        analysis: analysis as any,
        atsRating: analysis.ats_rating,
        overallRating: analysis.overall_rating,
      },
    })

    // Step 2: Resume Optimization (prompts/resume-optimization.md)
    const optimization = await runStructuredPrompt<ResumeOptimizationResult>({
      promptFile: 'resume-optimization.md',
      input: {
        original_resume: resumeText,
        resume_analysis: analysis,
        assessment_analysis,
        target_roles: targetRoles,
        target_industries: targetIndustries,
        career_preferences: {},
      },
      maxTokens: 8192,
      extraSystemInstruction: isAge50Plus ? AGE_50_PLUS_INSTRUCTION : undefined,
    })

    if (isAge50Plus) {
      optimization.recommended_follow_up = optimization.recommended_follow_up.filter(
        (suggestion) => !isAgeDatingSuggestion(suggestion)
      )
    }

    const savedOptimization = await prisma.resumeOptimization.create({
      data: {
        memberId,
        resumeAnalysisId: savedAnalysis.id,
        optimizedResumeMarkdown: optimization.optimized_resume_markdown,
        majorChanges: optimization.major_changes,
        recommendedFollowUp: optimization.recommended_follow_up,
        confidence: optimization.confidence,
      },
    })

    await prisma.memberMilestone.upsert({
      where: { memberId_milestoneId: { memberId, milestoneId: 'resume_uploaded' } },
      create: { memberId, milestoneId: 'resume_uploaded' },
      update: {},
    })
    await prisma.memberMilestone.upsert({
      where: { memberId_milestoneId: { memberId, milestoneId: 'resume_optimized' } },
      create: { memberId, milestoneId: 'resume_optimized' },
      update: {},
    })

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id,
      analysis,
      optimizationId: savedOptimization.id,
      optimization,
    })
  } catch (err) {
    console.error('Resume Intelligence API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong analyzing your resume. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const analyses = await prisma.resumeAnalysis.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  const optimizations = await prisma.resumeOptimization.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, analyses, optimizations })
}

function splitList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string' || !value.trim()) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}
