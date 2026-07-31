import { NextRequest, NextResponse } from 'next/server'
import { generateRebuildPlan } from '@/lib/rebuild-engine'
import { Assessment } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Map raw form answers to typed Assessment
    const assessment: Assessment = {
      id: crypto.randomUUID(),
      memberId: crypto.randomUUID(), // TODO: replace with real auth user ID
      completedAt: new Date(),
      firstName: body.firstName,
      email: body.email,
      ageRange: body.ageRange,
      gender: body.gender,
      situation: body.situation,
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

    // Run the rebuild engine
    const planData = generateRebuildPlan(assessment, assessment.memberId)

    const plan = {
      id: crypto.randomUUID(),
      ...planData,
      generatedAt: new Date(),
      updatedAt: new Date(),
    }

    // TODO: Persist assessment + plan to database

    return NextResponse.json({
      success: true,
      assessment,
      plan,
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
