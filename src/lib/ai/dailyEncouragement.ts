// ============================================================
// HopeAfter50 — Daily Word
// One cached AI encouragement message per member per day (America/Chicago),
// shared by the dashboard widget and the 7am cron email so it's generated once.
// ============================================================
import { prisma } from '@/lib/db/client'
import { runTextPrompt } from './anthropic'

export function chicagoDateString(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function chicagoHour(now: Date): number {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    hour12: false,
  }).format(now)
  return parseInt(formatted, 10) % 24
}

export function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 24) return 'Good evening'
  return "You're up late — that's ok."
}

function describeDuration(since: Date, now: Date): string {
  const days = Math.max(0, Math.floor((now.getTime() - since.getTime()) / 86_400_000))
  if (days < 14) return `${days} day${days === 1 ? '' : 's'}`
  const weeks = Math.floor(days / 7)
  if (weeks < 10) return `${weeks} weeks`
  const months = Math.floor(days / 30)
  return `${months} month${months === 1 ? '' : 's'}`
}

/**
 * Returns today's Daily Word for a member, generating and caching it on
 * first request of the day. Safe to call repeatedly — later calls the
 * same day return the cached row instead of re-hitting the Anthropic API.
 */
export async function getDailyEncouragement(memberId: string, now: Date = new Date()) {
  const date = chicagoDateString(now)

  const existing = await prisma.dailyEncouragement.findUnique({
    where: { memberId_date: { memberId, date } },
  })
  if (existing) return existing

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: { rebuildPlan: true },
  })
  if (!member) return null

  const message = (
    await runTextPrompt({
      promptFile: 'daily-encouragement.md',
      input: {
        member: { firstName: member.firstName },
        current_stage: member.rebuildPlan?.currentStage ?? 'stabilize',
        rebuilding_since: describeDuration(member.createdAt, now),
      },
      maxTokens: 300,
    })
  ).trim()

  return prisma.dailyEncouragement.upsert({
    where: { memberId_date: { memberId, date } },
    create: { memberId, date, message },
    update: { message },
  })
}
