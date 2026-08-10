// ============================================================
// HopeAfter50 — LinkedIn Optimizer API
// No dedicated prompt file exists for LinkedIn — per instruction,
// this reuses prompts/resume-analysis.md's evaluation guidance,
// framing the member's LinkedIn sections as the "resume_text" input.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext } from '@/lib/ai/context'
import { ResumeAnalysisResult } from '@/types/ai'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const {
      headline = '',
      about = '',
      experience = '',
      targetRoles = [],
      targetIndustries = [],
    } = body

    if (!headline.trim() && !about.trim() && !experience.trim()) {
      return NextResponse.json(
        { success: false, error: 'Paste at least one section of your LinkedIn profile.' },
        { status: 400 }
      )
    }

    const profileText = [
      headline.trim() && `LinkedIn Headline:\n${headline.trim()}`,
      about.trim() && `LinkedIn About:\n${about.trim()}`,
      experience.trim() && `LinkedIn Experience:\n${experience.trim()}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const { member, assessment_analysis } = await getMemberAiContext(memberId)

    const analysis = await runStructuredPrompt<ResumeAnalysisResult>({
      promptFile: 'resume-analysis.md',
      input: {
        member,
        resume_text: profileText,
        target_roles: targetRoles,
        target_industries: targetIndustries,
        career_preferences: {},
        assessment_analysis,
      },
      maxTokens: 4096,
    })

    const saved = await prisma.linkedInOptimization.create({
      data: {
        memberId,
        headline: headline || null,
        about: about || null,
        experience: experience || null,
        analysis: analysis as any,
      },
    })

    await prisma.memberMilestone.upsert({
      where: { memberId_milestoneId: { memberId, milestoneId: 'linkedin_updated' } },
      create: { memberId, milestoneId: 'linkedin_updated' },
      update: {},
    })

    return NextResponse.json({ success: true, linkedInOptimizationId: saved.id, analysis })
  } catch (err) {
    console.error('LinkedIn Optimizer API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong analyzing your profile. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const optimizations = await prisma.linkedInOptimization.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, optimizations })
}
