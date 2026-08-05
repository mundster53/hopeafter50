// ============================================================
// HopeAfter50 — Rebuild Engine v1
// Based on Artifact 5: deterministic rule-based service
// Takes assessment inputs → outputs personalized plan
// ============================================================

import {
  Assessment,
  RebuildPlan,
  FinancialUrgency,
  CareerDirection,
  RebuildStage,
  Priority,
  TodayAction,
  ToolId,
} from '@/types'

// ----------------------------
// Step 1: Financial Urgency
// ----------------------------
function determineFinancialUrgency(assessment: Assessment): FinancialUrgency {
  const map: Record<Assessment['financialRunway'], FinancialUrgency> = {
    under_1_month: 1,
    '1_3_months': 2,
    '3_6_months': 3,
    '6_12_months': 4,
    over_1_year: 5,
  }
  return map[assessment.financialRunway]
}

// ----------------------------
// Step 2: Career Directions
// ----------------------------
function determineCareerDirections(assessment: Assessment): CareerDirection[] {
  const directions: CareerDirection[] = []

  if (assessment.workInterests.includes('executive_role')) directions.push('corporate_leadership')
  if (assessment.workInterests.includes('fractional_leadership')) directions.push('fractional_executive')
  if (assessment.workInterests.includes('consulting')) directions.push('consulting')
  if (assessment.workInterests.includes('buying_business')) directions.push('business_ownership')
  if (assessment.workInterests.includes('board_positions')) directions.push('board_service')
  if (assessment.workInterests.includes('open_to_anything')) {
    return ['corporate_leadership', 'fractional_executive', 'consulting']
  }

  return directions.length > 0 ? directions : ['corporate_leadership']
}

// ----------------------------
// Step 3: Rebuild Stage
// ----------------------------
function determineRebuildStage(assessment: Assessment, urgency: FinancialUrgency): RebuildStage {
  // Immediate financial crisis → stabilize
  if (urgency <= 2) return 'stabilize'

  // Just starting or no clarity → stabilize
  if (
    assessment.rebuildDuration === 'under_30_days' ||
    assessment.clarityLevel === 'no_idea_where_to_start'
  ) return 'stabilize'

  // Has resume and getting interviews → execute
  if (
    assessment.hasCurrentResume === 'yes' &&
    assessment.interviewFrequency !== 'none' &&
    assessment.interviewFrequency !== 'rarely'
  ) return 'execute'

  // Has resume but not getting traction → position
  if (assessment.hasCurrentResume !== 'no' && urgency >= 3) return 'position'

  return 'stabilize'
}

// ----------------------------
// Step 4: Top 3 Priorities
// ----------------------------
function buildPriorities(
  assessment: Assessment,
  urgency: FinancialUrgency,
  stage: RebuildStage
): Priority[] {
  const priorities: Priority[] = []

  // Priority 1 is always income-related when urgency is high
  if (urgency <= 3 || assessment.primaryFear === 'replacing_income' || assessment.primaryFear === 'paying_bills') {
    priorities.push({
      rank: 1,
      label: 'Replace Income',
      description: 'Identify and pursue the fastest path to replacing your income.',
      toolId: 'income_strategy',
    })
  } else if (assessment.primaryFear === 'retirement') {
    priorities.push({
      rank: 1,
      label: 'Retirement Recovery',
      description: 'Develop a practical strategy to restore long-term financial security.',
      toolId: 'retirement_planner',
    })
  } else {
    priorities.push({
      rank: 1,
      label: 'Replace Income',
      description: 'Identify and pursue the fastest path to replacing your income.',
      toolId: 'income_strategy',
    })
  }

  // Priority 2 based on resume / positioning stage
  if (assessment.hasCurrentResume !== 'yes' || stage === 'stabilize' || stage === 'position') {
    priorities.push({
      rank: 2,
      label: 'Optimize Your Resume',
      description: 'Present decades of experience in a way today\'s hiring systems understand.',
      toolId: 'resume_optimizer',
    })
  } else if (assessment.interviewFrequency === 'none' || assessment.interviewFrequency === 'rarely') {
    priorities.push({
      rank: 2,
      label: 'Strengthen Your Executive Positioning',
      description: 'Update LinkedIn and executive presence to increase visibility.',
      toolId: 'linkedin_optimizer',
    })
  } else {
    priorities.push({
      rank: 2,
      label: 'Interview Preparation',
      description: 'Convert interviews into offers with focused preparation.',
      toolId: 'interview_prep',
    })
  }

  // Priority 3 — network / direction
  if (assessment.workInterests.includes('buying_business')) {
    priorities.push({
      rank: 3,
      label: 'Evaluate Business Acquisition',
      description: 'Determine whether buying a business fits your goals and financial situation.',
      toolId: 'business_acquisition',
    })
  } else if (assessment.workInterests.includes('fractional_leadership') || assessment.workInterests.includes('consulting')) {
    priorities.push({
      rank: 3,
      label: 'Build Your Consulting Strategy',
      description: 'Convert your leadership experience into consulting income.',
      toolId: 'fractional_planner',
    })
  } else {
    priorities.push({
      rank: 3,
      label: 'Expand Your Executive Network',
      description: 'Reconnect with colleagues and build new relationships in your target areas.',
    })
  }

  return priorities
}

// ----------------------------
// Step 5: Recommended Tools
// ----------------------------
function recommendTools(assessment: Assessment, stage: RebuildStage): ToolId[] {
  const tools: ToolId[] = ['resume_optimizer', 'linkedin_optimizer', 'financial_runway']

  if (assessment.aiToolsNeeded.includes('Cover Letter')) tools.push('cover_letter')
  if (assessment.aiToolsNeeded.includes('Interview Prep')) tools.push('interview_prep')
  if (assessment.workInterests.includes('buying_business')) tools.push('business_acquisition')
  if (
    assessment.workInterests.includes('fractional_leadership') ||
    assessment.workInterests.includes('consulting')
  ) tools.push('fractional_planner')
  if (assessment.primaryFear === 'retirement') tools.push('retirement_planner')

  return Array.from(new Set(tools))
}

// ----------------------------
// Step 6: Today's Action
// ----------------------------
function buildTodayAction(
  stage: RebuildStage,
  assessment: Assessment,
  priorities: Priority[]
): TodayAction {
  const topPriority = priorities[0]

  // If no resume, that's always the first concrete action
  if (assessment.hasCurrentResume === 'no') {
    return {
      title: 'Upload Your Resume',
      description: 'Upload your current resume so we can analyze it and build your career strategy.',
      estimatedMinutes: 5,
      toolId: 'resume_optimizer',
      url: '/platform/tools/resume',
    }
  }

  if (assessment.hasCurrentResume === 'mostly' || stage === 'stabilize' || stage === 'position') {
    return {
      title: 'Fix & Improve My Resume',
      description: 'Upload your resume and we\'ll analyze it, improve it, and help you present your experience in the best possible way.',
      estimatedMinutes: 30,
      toolId: 'resume_optimizer',
      url: '/platform/tools/resume',
    }
  }

  if (stage === 'execute') {
    return {
      title: 'Complete Your LinkedIn Executive Summary',
      description: 'A strong LinkedIn presence increases recruiter visibility and supports your income replacement goal.',
      estimatedMinutes: 20,
      toolId: 'linkedin_optimizer',
      url: '/platform/tools/linkedin',
    }
  }

  return {
    title: topPriority.label,
    description: topPriority.description,
    estimatedMinutes: 20,
    toolId: topPriority.toolId as ToolId | undefined,
    url: topPriority.toolId ? `/platform/tools/${topPriority.toolId.replace('_', '-')}` : undefined,
  }
}

// ----------------------------
// Strengths (inferred from assessment)
// ----------------------------
function inferStrengths(assessment: Assessment): string[] {
  const strengths: string[] = ['Leadership', 'Problem Solving', 'Strategic Thinking']

  if (assessment.workInterests.includes('consulting') || assessment.workInterests.includes('fractional_leadership')) {
    strengths.push('Subject Matter Expertise', 'Client Relationship Management')
  }
  if (assessment.workInterests.includes('buying_business')) {
    strengths.push('Operational Leadership', 'Business Analysis')
  }

  return strengths
}

// ----------------------------
// Watch Items
// ----------------------------
function buildWatchItems(assessment: Assessment, urgency: FinancialUrgency): string[] {
  const items: string[] = []

  if (assessment.rebuildDuration === '6_12_months' || assessment.rebuildDuration === 'over_1_year') {
    items.push('Loss of confidence from extended search')
    items.push('Decision fatigue')
  }
  if (assessment.interviewFrequency === 'none' || assessment.interviewFrequency === 'rarely') {
    items.push('Application strategy may need adjustment')
  }
  if (urgency <= 2) {
    items.push('Financial runway requires immediate attention')
  }
  if (assessment.primaryFear === 'losing_confidence') {
    items.push('Confidence protection is a priority')
  }

  return items.length > 0 ? items : ['Isolation', 'Analysis paralysis']
}

// ----------------------------
// Main Engine: Generate Plan
// ----------------------------
export function generateRebuildPlan(
  assessment: Assessment,
  memberId: string
): Omit<RebuildPlan, 'id' | 'generatedAt' | 'updatedAt'> {
  const financialUrgency = determineFinancialUrgency(assessment)
  const careerDirections = determineCareerDirections(assessment)
  const currentStage = determineRebuildStage(assessment, financialUrgency)
  const topPriorities = buildPriorities(assessment, financialUrgency, currentStage)
  const recommendedToolIds = recommendTools(assessment, currentStage)
  const todaysAction = buildTodayAction(currentStage, assessment, topPriorities)
  const strengths = inferStrengths(assessment)
  const watchItems = buildWatchItems(assessment, financialUrgency)

  return {
    memberId,
    financialUrgency,
    careerDirections,
    currentStage,
    topPriorities,
    recommendedToolIds,
    todaysAction,
    strengths,
    watchItems,
    progressPercent: 0, // starts at 0, advances with milestones
  }
}

// ----------------------------
// Stage labels for UI
// ----------------------------
export const STAGE_LABELS: Record<RebuildStage, string> = {
  stabilize: 'Stabilize',
  position: 'Position',
  execute: 'Execute',
  transition: 'Transition',
  restore: 'Restore',
}

export const STAGE_DESCRIPTIONS: Record<RebuildStage, string> = {
  stabilize: 'Reduce fear. Protect finances. Create clarity.',
  position: 'Present your experience effectively.',
  execute: 'Generate opportunities.',
  transition: 'Move into new income.',
  restore: 'Rebuild long-term security.',
}

export const FINANCIAL_URGENCY_LABELS: Record<FinancialUrgency, string> = {
  1: 'Immediate',
  2: 'Critical',
  3: 'Serious',
  4: 'Stable',
  5: 'Comfortable',
}
