import { Tool, ToolId } from '@/types'

export const TOOLS: Record<ToolId, Tool> = {
  resume_optimizer: {
    id: 'resume_optimizer',
    label: 'Resume Optimizer',
    description: 'AI-powered resume analysis, optimization, and tailored document generation.',
    estimatedMinutes: 30,
    href: '/platform/tools/resume',
  },
  linkedin_optimizer: {
    id: 'linkedin_optimizer',
    label: 'LinkedIn Optimizer',
    description: 'Optimize your LinkedIn headline, about section, and experience for executive visibility.',
    estimatedMinutes: 20,
    href: '/platform/tools/linkedin',
  },
  cover_letter: {
    id: 'cover_letter',
    label: 'Cover Letter Builder',
    description: 'Generate tailored cover letters that reflect your voice and experience.',
    estimatedMinutes: 15,
    href: '/platform/tools/resume?tab=cover-letter',
  },
  interview_prep: {
    id: 'interview_prep',
    label: 'Interview Preparation',
    description: 'Practice with AI-generated questions tailored to your experience and target roles.',
    estimatedMinutes: 25,
    href: '/platform/tools/interview',
  },
  income_strategy: {
    id: 'income_strategy',
    label: 'Income Strategy Planner',
    description: 'Evaluate every legitimate income path and build a strategy for your situation.',
    estimatedMinutes: 20,
    href: '/platform/tools/income-strategy',
  },
  business_acquisition: {
    id: 'business_acquisition',
    label: 'Business Acquisition Evaluator',
    description: 'Determine whether buying a business fits your financial goals, experience, and lifestyle.',
    estimatedMinutes: 30,
    href: '/platform/tools/business-acquisition',
  },
  fractional_planner: {
    id: 'fractional_planner',
    label: 'Fractional & Consulting Planner',
    description: 'Build a strategy for converting your leadership experience into consulting income.',
    estimatedMinutes: 25,
    href: '/platform/tools/fractional',
  },
  financial_runway: {
    id: 'financial_runway',
    label: 'Financial Runway Calculator',
    description: 'Know exactly how much time you have and how to extend it.',
    estimatedMinutes: 10,
    href: '/platform/tools/income-strategy?tab=runway',
  },
  retirement_planner: {
    id: 'retirement_planner',
    label: 'Retirement Rebuild',
    description: 'Develop a practical strategy to restore long-term financial security.',
    estimatedMinutes: 20,
    href: '/platform/tools/retirement',
  },
}

export function getToolsByIds(ids: ToolId[]): Tool[] {
  return ids.map(id => TOOLS[id]).filter(Boolean)
}
