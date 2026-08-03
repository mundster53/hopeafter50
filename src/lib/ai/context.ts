// ============================================================
// HopeAfter50 — Shared AI Input Context
// Builds the "member" object every prompt's input schema expects,
// using only real, already-known fields. Never invent data here.
// ============================================================
import { prisma } from '@/lib/db/client'

export async function getMemberAiContext(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { firstName: true, assessment: true },
  })

  if (!member) return { member: {}, assessment_analysis: {} }

  return {
    member: { firstName: member.firstName },
    // No dedicated "assessment analysis" AI pass exists yet — pass the raw
    // assessment answers we do have rather than fabricate an analysis.
    assessment_analysis: member.assessment ?? {},
  }
}

/**
 * Most tools that reference "the resume" (opportunity evaluation, cover
 * letters, interview prep) need the member's latest resume text and its
 * analysis. Returns nulls rather than inventing resume content if the
 * member hasn't run the Resume Intelligence tool yet.
 */
export async function getLatestResumeContext(memberId: string) {
  const analysis = await prisma.resumeAnalysis.findFirst({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
  })

  return {
    resumeText: analysis?.resumeText ?? '',
    resumeAnalysis: (analysis?.analysis as unknown) ?? {},
  }
}
