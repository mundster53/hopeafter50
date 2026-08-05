// ============================================================
// HopeAfter50 — Core Type Definitions
// All platform data structures defined here
// ============================================================

// ----------------------------
// Member / Auth
// ----------------------------
export interface Member {
  id: string
  firstName: string
  email: string
  createdAt: Date
  updatedAt: Date
  assessment?: Assessment
  rebuildPlan?: RebuildPlan
  guideId?: string
  faithBasedEncouragement: boolean
  preferredContact: ContactPreference
}

// ----------------------------
// Assessment (Artifact 2)
// ----------------------------
export type SituationType =
  | 'laid_off'
  | 'position_eliminated'
  | 'company_closed'
  | 'forced_retirement'
  | 'left_voluntarily'
  | 'other'

export type RebuildDuration =
  | 'under_30_days'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | 'over_1_year'

export type PrimaryFear =
  | 'replacing_income'
  | 'paying_bills'
  | 'retirement'
  | 'finding_leadership_role'
  | 'losing_confidence'
  | 'dont_know_where_to_start'

export type ClarityLevel =
  | 'knows_what_wants'
  | 'has_ideas_unsure'
  | 'no_idea_where_to_start'

export type WorkInterest =
  | 'executive_role'
  | 'fractional_leadership'
  | 'consulting'
  | 'buying_business'
  | 'starting_business'
  | 'board_positions'
  | 'open_to_anything'

export type FinancialRunway =
  | 'under_1_month'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | 'over_1_year'

export type InterviewFrequency =
  | 'frequently'
  | 'occasionally'
  | 'rarely'
  | 'none'

export type ContactPreference =
  | 'self_serve'
  | 'email'
  | 'text'
  | 'direct_message'
  | 'schedule_call'

export interface Assessment {
  id: string
  memberId: string
  completedAt: Date

  // Q1
  firstName: string
  email: string
  ageRange: 'under_50' | '50_54' | '55_59' | '60_64' | '65_plus'
  gender?: 'male' | 'female' | 'prefer_not_to_say'

  // Q2
  situation: SituationType

  // Q3
  rebuildDuration: RebuildDuration

  // Q4 - most important for prioritization
  primaryFear: PrimaryFear

  // Q5 - determines plan type
  clarityLevel: ClarityLevel

  // Q6 - multi-select
  workInterests: WorkInterest[]

  // Q7 - determines urgency
  financialRunway: FinancialRunway

  // Q8
  usingSavings: boolean

  // Q9 - diagnostic
  interviewFrequency: InterviewFrequency

  // Q10
  hasCurrentResume: 'yes' | 'mostly' | 'no'

  // Q11 - multi-select
  aiToolsNeeded: string[]

  // Q12
  contactPreference: ContactPreference

  // Q13
  faithBasedEncouragement: boolean

  // Q14
  additionalContext?: string

  // Q15
  successVision?: string
}

// ----------------------------
// Rebuild Engine (Artifact 5)
// ----------------------------
export type FinancialUrgency = 1 | 2 | 3 | 4 | 5
// 1 = Immediate (<1 month), 5 = Comfortable (>12 months)

export type CareerDirection =
  | 'corporate_leadership'
  | 'fractional_executive'
  | 'consulting'
  | 'business_ownership'
  | 'portfolio_career'
  | 'board_service'
  | 'teaching'

export type RebuildStage =
  | 'stabilize'
  | 'position'
  | 'execute'
  | 'transition'
  | 'restore'

export interface Priority {
  rank: 1 | 2 | 3
  label: string
  description: string
  toolId?: string
}

export interface RebuildPlan {
  id: string
  memberId: string
  generatedAt: Date
  updatedAt: Date

  // Engine outputs
  financialUrgency: FinancialUrgency
  careerDirections: CareerDirection[]
  currentStage: RebuildStage
  topPriorities: Priority[]
  recommendedToolIds: string[]
  todaysAction: TodayAction
  strengths: string[]
  watchItems: string[]
  progressPercent: number
}

export interface TodayAction {
  title: string
  description: string
  estimatedMinutes: number
  toolId?: string
  url?: string
}

// ----------------------------
// Tools
// ----------------------------
export type ToolId =
  | 'resume_optimizer'
  | 'linkedin_optimizer'
  | 'cover_letter'
  | 'interview_prep'
  | 'income_strategy'
  | 'business_acquisition'
  | 'fractional_planner'
  | 'financial_runway'
  | 'retirement_planner'
  | 'opportunity_evaluator'
  | 'weekly_review'

export interface Tool {
  id: ToolId
  label: string
  description: string
  estimatedMinutes: number
  href: string
}

// ----------------------------
// Resume Intelligence (Artifact 6)
// ----------------------------
export interface ResumeAnalysis {
  id: string
  memberId: string
  analyzedAt: Date

  careerSnapshot: string
  totalYearsExperience: number

  healthScores: {
    atsCompatibility: number
    executivePositioning: number
    leadershipImpact: number
    quantifiedResults: number
    readability: number
    keywordCoverage: number
  }

  strengths: string[]
  opportunities: string[]

  originalText: string
  optimizedText: string

  jobMatchScore?: number
  jobMatchGaps?: string[]

  documentsGenerated: GeneratedDocument[]
}

export interface GeneratedDocument {
  type: 'resume' | 'cover_letter' | 'networking_intro' | 'recruiter_email' | 'hiring_manager_email' | 'thank_you'
  content: string
  generatedAt: Date
}

// ----------------------------
// Progress Milestones
// ----------------------------
export interface Milestone {
  id: string
  label: string
  completedAt?: Date
}

export const ALL_MILESTONES: Omit<Milestone, 'completedAt'>[] = [
  { id: 'assessment_complete', label: 'Your story shared' },
  { id: 'resume_uploaded', label: 'Resume Uploaded' },
  { id: 'resume_optimized', label: 'Resume Optimized' },
  { id: 'linkedin_updated', label: 'LinkedIn Updated' },
  { id: 'cover_letter_generated', label: 'Cover Letter Generated' },
  { id: 'first_interview', label: 'First Interview' },
  { id: 'second_interview', label: 'Second Interview' },
  { id: 'first_consulting_conversation', label: 'First Consulting Conversation' },
  { id: 'offer_received', label: 'Offer Received' },
  { id: 'income_replaced', label: 'Income Replaced' },
  { id: 'emergency_fund_restarted', label: 'Emergency Fund Restarted' },
  { id: 'retirement_contributions_restarted', label: 'Retirement Contributions Restarted' },
]

// ----------------------------
// Dashboard (Artifact 4)
// ----------------------------
export interface DashboardData {
  member: Member
  plan: RebuildPlan
  milestones: Milestone[]
  unreadMessages: number
  guide?: Guide
  recentWins: Milestone[]
  recommendedResources: Resource[]
}

export interface Guide {
  id: string
  name: string
  photoUrl?: string
  lastMessage?: string
  nextCheckIn?: Date
}

export interface Resource {
  id: string
  title: string
  description: string
  href: string
  stage: RebuildStage
}

// ----------------------------
// Weekly / Monthly Check-ins (Artifact 7.1)
// ----------------------------
export type WeeklyRating = 'much_better' | 'better' | 'same' | 'worse' | 'much_worse'

export interface WeeklyCheckIn {
  id: string
  memberId: string
  week: string // ISO week string
  rating: WeeklyRating
  comment?: string
  submittedAt: Date
}
