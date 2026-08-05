// ============================================================
// HopeAfter50 — Shared DB Query Helpers
// Reads real member/assessment/plan/milestone data for the
// dashboard and other server components. No mock data.
// ============================================================

import { prisma } from '@/lib/db/client'
import { ALL_MILESTONES, Priority, RebuildPlan as RebuildPlanType, TodayAction } from '@/types'

// Milestone ids that mark a given tool as "done" for dashboard checklists.
const TOOL_COMPLETION_MILESTONES: Record<string, string> = {
  resume_optimizer: 'resume_optimized',
  linkedin_optimizer: 'linkedin_updated',
}

export async function getMemberForSession(memberId: string) {
  return prisma.member.findUnique({
    where: { id: memberId },
    include: {
      assessment: true,
      rebuildPlan: true,
      milestones: { orderBy: { completedAt: 'desc' } },
      weeklyCheckIns: { orderBy: { submittedAt: 'desc' }, take: 1 },
    },
  })
}

export type DashboardViewModel = ReturnType<typeof buildDashboardViewModel>

export function buildDashboardViewModel(
  member: NonNullable<Awaited<ReturnType<typeof getMemberForSession>>>
) {
  const plan = member.rebuildPlan
  const completedMilestoneIds = new Set(member.milestones.map((m) => m.milestoneId))

  const recentWins = member.milestones
    .slice(0, 3)
    .map((m) => ALL_MILESTONES.find((all) => all.id === m.milestoneId)?.label ?? m.milestoneId)

  const todaysAction = (plan?.todaysAction as unknown as TodayAction | null) ?? null
  const topPriorities = (plan?.topPriorities as unknown as Priority[] | null) ?? []
  const recommendedToolIds = (plan?.recommendedToolIds ?? []) as string[]

  const todayActions = recommendedToolIds.slice(0, 3).map((toolId) => ({
    toolId,
    done: TOOL_COMPLETION_MILESTONES[toolId]
      ? completedMilestoneIds.has(TOOL_COMPLETION_MILESTONES[toolId])
      : false,
  }))

  return {
    firstName: member.firstName,
    faithBased: member.faithBasedEncouragement,
    currentStage: (plan?.currentStage ?? 'stabilize') as RebuildPlanType['currentStage'],
    progressPercent: plan?.progressPercent ?? 0,
    currentFocus: topPriorities[0]?.label ?? 'Tell Us Your Story',
    nextAction: todaysAction ?? {
      title: 'Tell Us Your Story',
      description: 'Tell us about your situation so we can build your Rebuild Plan.',
      estimatedMinutes: 10,
      url: '/platform/assessment',
    },
    financialRunway: member.assessment
      ? FINANCIAL_RUNWAY_LABELS[member.assessment.financialRunway] ?? 'Unknown'
      : 'Unknown',
    recommendedToolIds,
    todayActions,
    recentWins,
    unreadMessages: 0, // Guide messaging system not yet built
    hasAssessment: Boolean(member.assessment),
    hasPlan: Boolean(plan),
  }
}

const FINANCIAL_RUNWAY_LABELS: Record<string, string> = {
  under_1_month: 'Under 1 Month',
  '1_3_months': '1–3 Months',
  '3_6_months': '3–6 Months',
  '6_12_months': '6–12 Months',
  over_1_year: 'Over 1 Year',
}
