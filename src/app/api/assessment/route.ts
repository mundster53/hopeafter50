import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { generateRebuildPlan } from '@/lib/rebuild-engine'
import { Assessment } from '@/types'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const memberId = session.user.id

  try {
    const body = await req.json()

    // Map raw form answers to the typed Assessment shape used by the rebuild engine.
    const assessment: Assessment = {
      id: crypto.randomUUID(),
      memberId,
      completedAt: new Date(),
      firstName: body.firstName,
      email: body.email,
      ageRange: body.ageRange,
      gender: body.gender,
      situation: body.situation,
      lastRole: body.lastRole,
      rebuildDuration: body.rebuildDuration,
      primaryFear: body.primaryFear,
      clarityLevel: body.clarityLevel,
      workInterests: body.workInterests || [],
      financialRunway: body.financialRunway,
      usingSavings: body.usingSavings === 'yes',
      interviewFrequency: body.interviewFrequency,
      hasCurrentResume: body.hasCurrentResume,
      aiToolsNeeded: body.aiToolsNeeded || [],
      contactPreference: body.contactPreference,
      faithBasedEncouragement: body.faithBased === 'yes',
      additionalContext: body.additionalContext,
      successVision: body.successVision,
    }

    // Run the deterministic rebuild engine (Artifact 5) on the answers.
    const planData = generateRebuildPlan(assessment, memberId)

    // Persist everything in one transaction: member profile fields, the
    // assessment answers, the generated plan, and the completion milestone.
    const [, savedAssessment, savedPlan] = await prisma.$transaction([
      prisma.member.update({
        where: { id: memberId },
        data: {
          firstName: assessment.firstName || undefined,
          ageRange: assessment.ageRange,
          gender: assessment.gender,
          faithBasedEncouragement: assessment.faithBasedEncouragement,
          contactPreference: assessment.contactPreference,
        },
      }),
      prisma.assessment.upsert({
        where: { memberId },
        create: {
          memberId,
          situation: assessment.situation,
          lastRole: assessment.lastRole,
          rebuildDuration: assessment.rebuildDuration,
          primaryFear: assessment.primaryFear,
          clarityLevel: assessment.clarityLevel,
          workInterests: assessment.workInterests,
          financialRunway: assessment.financialRunway,
          usingSavings: assessment.usingSavings,
          interviewFrequency: assessment.interviewFrequency,
          hasCurrentResume: assessment.hasCurrentResume,
          aiToolsNeeded: assessment.aiToolsNeeded,
          additionalContext: assessment.additionalContext,
          successVision: assessment.successVision,
        },
        update: {
          situation: assessment.situation,
          lastRole: assessment.lastRole,
          rebuildDuration: assessment.rebuildDuration,
          primaryFear: assessment.primaryFear,
          clarityLevel: assessment.clarityLevel,
          workInterests: assessment.workInterests,
          financialRunway: assessment.financialRunway,
          usingSavings: assessment.usingSavings,
          interviewFrequency: assessment.interviewFrequency,
          hasCurrentResume: assessment.hasCurrentResume,
          aiToolsNeeded: assessment.aiToolsNeeded,
          additionalContext: assessment.additionalContext,
          successVision: assessment.successVision,
        },
      }),
      prisma.rebuildPlan.upsert({
        where: { memberId },
        create: {
          memberId,
          financialUrgency: planData.financialUrgency,
          currentStage: planData.currentStage,
          careerDirections: planData.careerDirections,
          topPriorities: planData.topPriorities as any,
          recommendedToolIds: planData.recommendedToolIds,
          todaysAction: planData.todaysAction as any,
          strengths: planData.strengths,
          watchItems: planData.watchItems,
          progressPercent: planData.progressPercent,
        },
        update: {
          financialUrgency: planData.financialUrgency,
          currentStage: planData.currentStage,
          careerDirections: planData.careerDirections,
          topPriorities: planData.topPriorities as any,
          recommendedToolIds: planData.recommendedToolIds,
          todaysAction: planData.todaysAction as any,
          strengths: planData.strengths,
          watchItems: planData.watchItems,
        },
      }),
      prisma.memberMilestone.upsert({
        where: { memberId_milestoneId: { memberId, milestoneId: 'assessment_complete' } },
        create: { memberId, milestoneId: 'assessment_complete' },
        update: {},
      }),
    ])

    return NextResponse.json({
      success: true,
      assessment: savedAssessment,
      plan: savedPlan,
      member: {
        firstName: assessment.firstName,
        email: assessment.email,
      },
    })
  } catch (err) {
    console.error('Assessment API error:', err)
    return NextResponse.json({ success: false, error: 'Failed to process assessment' }, { status: 500 })
  }
}
