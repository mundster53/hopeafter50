// ============================================================
// HopeAfter50 — Derived "Today's Action"
// Computes what a member should do next from what they've
// actually completed, instead of relying on the static
// RebuildPlan.todaysAction snapshot going stale.
// ============================================================
import { TodayAction } from '@/types'

export function getNextAction(
  completedMilestoneIds: Set<string>,
  hasResumeTailoring: boolean
): TodayAction {
  if (!completedMilestoneIds.has('assessment_complete')) {
    return {
      title: 'Tell Us Your Story',
      description: 'Tell us about your situation so we can build your Rebuild Plan.',
      estimatedMinutes: 10,
      url: '/platform/assessment',
    }
  }

  if (!completedMilestoneIds.has('resume_uploaded')) {
    return {
      title: 'Fix & Improve My Resume',
      description: "Upload your resume and we'll analyze it, improve it, and help you present your experience in the best possible way.",
      estimatedMinutes: 30,
      toolId: 'resume_optimizer',
      url: '/platform/tools/resume',
    }
  }

  if (!completedMilestoneIds.has('resume_optimized')) {
    return {
      title: 'Analyze and Improve Your Resume',
      description: "Let's take your resume and make it as strong as it can be.",
      estimatedMinutes: 30,
      toolId: 'resume_optimizer',
      url: '/platform/tools/resume',
    }
  }

  if (!hasResumeTailoring) {
    return {
      title: 'Target a Job You Want',
      description: "Find a job posting that excites you and paste the description into the Resume Tool. We'll tailor your resume specifically for that role.",
      estimatedMinutes: 20,
      toolId: 'resume_optimizer',
      url: '/platform/tools/resume',
    }
  }

  if (!completedMilestoneIds.has('linkedin_updated')) {
    return {
      title: 'Strengthen Your LinkedIn Profile',
      description: "Let's make sure your LinkedIn profile is presenting you in the best possible light.",
      estimatedMinutes: 30,
      toolId: 'linkedin_optimizer',
      url: '/platform/tools/linkedin',
    }
  }

  if (!completedMilestoneIds.has('cover_letter_generated')) {
    return {
      title: 'Create a Cover Letter',
      description: "Generate a cover letter tailored to a role you're targeting.",
      estimatedMinutes: 20,
      toolId: 'cover_letter',
      url: '/platform/tools/cover-letter',
    }
  }

  return {
    title: 'Keep Going — Check Your Weekly Review',
    description: "You've completed the core steps. Check in on your weekly review to see what's next.",
    estimatedMinutes: 15,
    url: '/platform/tools/weekly-review',
  }
}
