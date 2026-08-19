// ============================================================
// HopeAfter50 — AI Tool Response Types
// One interface per /prompts/*.md JSON output schema. These must
// stay in sync with the prompt files' "Output Format" sections —
// do not add fields the prompts don't actually return.
// ============================================================

// ----------------------------
// prompts/resume-analysis.md
// ----------------------------
export interface ResumeAnalysisResult {
  overall_rating: string
  executive_presence: string
  ats_rating: string
  target_alignment: string
  category_scores: {
    overall_impression: string
    professional_summary: string
    work_experience: string
    leadership: string
    measurable_results: string
    technical_skills: string
    education: string
    readability: string
    formatting: string
  }
  strengths: string[]
  improvements: string[]
  missing_information: string[]
  overall_assessment: string
  confidence: string
}

// ----------------------------
// LinkedIn Optimizer (inline task prompt — see src/app/api/linkedin/route.ts,
// no dedicated /prompts/*.md file)
// ----------------------------
export interface LinkedInSectionFeedback {
  assessment: string
  rewrite: string
}

// One job the member entered in the Experience section of the form.
// Kept as discrete entries (rather than one pasted blob) so the AI can
// never blend accomplishments across roles.
export interface LinkedInJobInput {
  title: string
  company: string
  details: string
}

export interface LinkedInExperienceFeedback extends LinkedInSectionFeedback {
  title: string
  company: string
}

export interface LinkedInAnalysisResult {
  headline?: LinkedInSectionFeedback
  about?: LinkedInSectionFeedback
  experience?: LinkedInExperienceFeedback[]
  skills?: LinkedInSectionFeedback
}

// ----------------------------
// prompts/resume-optimization.md
// ----------------------------
export interface ResumeOptimizationResult {
  optimized_resume_markdown: string
  major_changes: string[]
  recommended_follow_up: string[]
  confidence: string
}

// ----------------------------
// prompts/resume-tailoring.md
// ----------------------------
export interface ResumeTailoringResult {
  tailored_resume_markdown: string
  match_score: number
  match_label: string
  top_strengths: string[]
  honest_gaps: {
    gap: string
    guidance: string
  }[]
  keywords_incorporated: string[]
  confidence: string
}

// ----------------------------
// prompts/opportunity-evaluation.md
// ----------------------------
export interface OpportunityEvaluationResult {
  fit_score: number
  recommendation: string
  category_scores: {
    overall_experience: string
    leadership_alignment: string
    industry_alignment: string
    technical_alignment: string
    management_alignment: string
    education_alignment: string
    location_alignment: string
    career_progression: string
    overall_fit: string
  }
  match_strengths: string[]
  potential_gaps: string[]
  resume_recommendations: string[]
  interview_focus: string[]
  questions_for_employer: string[]
  red_flags: string[]
  overall_assessment: string
  confidence: string
}

// ----------------------------
// prompts/cover-letter.md
// ----------------------------
export interface CoverLetterResult {
  cover_letter_markdown: string
  key_strengths_emphasized: string[]
  customizations: string[]
  confidence: string
}

// ----------------------------
// prompts/interview-prep.md
// ----------------------------
export interface InterviewPrepResult {
  interview_focus: string[]
  likely_topics: string[]
  interview_questions: {
    question: string
    why_it_is_asked: string
    guidance: string
  }[]
  resume_talking_points: string[]
  potential_concerns: string[]
  questions_for_interviewer: string[]
  preparation_checklist: string[]
  interview_tips: string[]
  encouragement: string
  confidence: string
}

// ----------------------------
// prompts/weekly-review.md
// ----------------------------
export interface WeeklyReviewResult {
  progress_rating: string
  momentum: string
  wins: string[]
  top_obstacles: string[]
  current_focus: string
  next_step: string
  dashboard_updates: {
    recommended_actions: string[]
    progress_percent: number
  }
  rebuild_plan_action: string
  alerts: string[]
  encouragement: string
  confidence: string
}
