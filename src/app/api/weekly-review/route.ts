// ============================================================
// HopeAfter50 — Weekly Review API
// Runs prompts/weekly-review.md against the member's current
// dashboard/plan state and this week's structured check-in.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runStructuredPrompt } from '@/lib/ai/anthropic'
import { getMemberAiContext } from '@/lib/ai/context'
import { getIsoWeekString } from '@/lib/date/isoWeek'
import { WeeklyReviewResult } from '@/types/ai'
import { WeeklyRating } from '@/types'

const VALID_RATINGS: WeeklyRating[] = ['much_better', 'better', 'same', 'worse', 'much_worse']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const {
      rating,
      wins = '',
      progressNotes = '',
      obstacles = '',
      applicationsSubmitted = 0,
      networkingConversations = 0,
      interviewsCompleted = 0,
      offersReceived = 0,
      newEmployment = false,
      additionalComments = '',
    } = body

    if (!VALID_RATINGS.includes(rating)) {
      return NextResponse.json({ success: false, error: 'A valid rating is required.' }, { status: 400 })
    }

    const week = getIsoWeekString(new Date())

    const [{ member, assessment_analysis }, rebuildPlan, previousReviews] = await Promise.all([
      getMemberAiContext(memberId),
      prisma.rebuildPlan.findUnique({ where: { memberId } }),
      prisma.weeklyCheckIn.findMany({
        where: { memberId },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      }),
    ])

    const aiResponse = await runStructuredPrompt<WeeklyReviewResult>({
      promptFile: 'weekly-review.md',
      input: {
        member,
        assessment_analysis,
        current_dashboard: rebuildPlan
          ? {
              current_focus: (rebuildPlan.topPriorities as any)?.[0]?.label ?? null,
              current_stage: rebuildPlan.currentStage,
              progress_percent: rebuildPlan.progressPercent,
            }
          : {},
        current_rebuild_plan: rebuildPlan ?? {},
        weekly_review: {
          wins,
          progress: progressNotes,
          obstacles,
          applications_submitted: applicationsSubmitted,
          networking_conversations: networkingConversations,
          interviews_completed: interviewsCompleted,
          offers_received: offersReceived,
          new_employment: newEmployment,
          additional_comments: additionalComments,
        },
        previous_weekly_reviews: previousReviews.map((r) => ({
          week: r.week,
          rating: r.rating,
          wins: r.wins,
          obstacles: r.obstacles,
        })),
      },
      maxTokens: 3072,
    })

    const checkIn = await prisma.weeklyCheckIn.upsert({
      where: { memberId_week: { memberId, week } },
      create: {
        memberId,
        week,
        rating,
        comment: additionalComments || null,
        wins,
        progressNotes,
        obstacles,
        applicationsSubmitted,
        networkingConversations,
        interviewsCompleted,
        offersReceived,
        newEmployment,
        aiResponse: aiResponse as any,
      },
      update: {
        rating,
        comment: additionalComments || null,
        wins,
        progressNotes,
        obstacles,
        applicationsSubmitted,
        networkingConversations,
        interviewsCompleted,
        offersReceived,
        newEmployment,
        aiResponse: aiResponse as any,
      },
    })

    // The prompt's dashboard_updates.progress_percent is the one field with
    // an unambiguous, direct mapping onto RebuildPlan — apply it. Everything
    // else (current_focus, next_step, rebuild_plan_action) is surfaced back
    // to the member rather than auto-applied, since interpreting a free-text
    // directive into a structural plan change isn't something we can do
    // without guessing.
    if (rebuildPlan && typeof aiResponse.dashboard_updates?.progress_percent === 'number') {
      await prisma.rebuildPlan.update({
        where: { memberId },
        data: { progressPercent: aiResponse.dashboard_updates.progress_percent },
      })
    }

    return NextResponse.json({ success: true, checkInId: checkIn.id, result: aiResponse })
  } catch (err) {
    console.error('Weekly Review API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong processing your weekly review. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const checkIns = await prisma.weeklyCheckIn.findMany({
    where: { memberId: session.user.id },
    orderBy: { submittedAt: 'desc' },
  })

  return NextResponse.json({ success: true, checkIns })
}
