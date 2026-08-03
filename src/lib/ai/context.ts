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
