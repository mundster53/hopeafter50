// ============================================================
// HopeAfter50 — Shared Resume Analysis + Optimization pipeline
// Used by both the initial upload (app/api/resume) and re-analyze
// (app/api/resume/reanalyze) routes so a member can re-run their
// analysis without re-uploading. Never touches Member.baseResumeText.
// ============================================================
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext } from '@/lib/ai/context'
import { AGE_50_PLUS_INSTRUCTION } from '@/lib/ai/agePolicy'
import { ResumeAnalysisResult, ResumeOptimizationResult } from '@/types/ai'

const AGE_DATING_SUGGESTION_PATTERN = /graduation year|early career.{0,20}date|date.{0,20}early career/i

function isAgeDatingSuggestion(suggestion: string): boolean {
  return AGE_DATING_SUGGESTION_PATTERN.test(suggestion)
}

export async function runAnalysisAndOptimization({
  memberId,
  resumeText,
  resumeFileUrl,
  targetRoles,
  targetIndustries,
}: {
  memberId: string
  resumeText: string
  resumeFileUrl: string | null
  targetRoles: string[]
  targetIndustries: string[]
}) {
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

  return {
    analysisId: savedAnalysis.id,
    analysis,
    optimizationId: savedOptimization.id,
    optimization,
  }
}
