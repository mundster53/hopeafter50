// ============================================================
// HopeAfter50 — LinkedIn Optimizer API
// Fetches a member's public LinkedIn profile HTML and has Claude
// give warm, human, actionable feedback on it.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Anthropic from '@anthropic-ai/sdk'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'

// Locked per project constraint — do not change without explicit instruction.
const MODEL = 'claude-sonnet-4-6'

const SYSTEM_PROMPT = `You are a career advisor helping a job seeker over 50 strengthen their LinkedIn presence. You will receive raw HTML from a public LinkedIn profile page. Extract what you can about their headline, about/summary section, most recent job title and company, and skills. Then provide warm, specific, actionable suggestions to improve each section. Write like a trusted friend who knows this world, not a coach or a platform. Do not use the words optimize, leverage, or assessment. Focus on making their profile feel human and credible, not keyword-stuffed.`

const TROUBLE_MESSAGE = "We had trouble reading that profile. Make sure it's set to public and try again."

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const { profileUrl } = await req.json()

    if (!profileUrl || typeof profileUrl !== 'string' || !profileUrl.trim()) {
      return NextResponse.json({ error: 'Please paste your LinkedIn profile URL.' }, { status: 400 })
    }

    let html: string
    try {
      const profileRes = await fetch(profileUrl.trim(), {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      if (!profileRes.ok) throw new Error(`Fetch failed with status ${profileRes.status}`)
      html = await profileRes.text()
    } catch (err) {
      console.error('LinkedIn profile fetch error:', err)
      return NextResponse.json({ error: TROUBLE_MESSAGE }, { status: 502 })
    }

    let analysis: string
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: html }],
      })
      const textBlock = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === 'text'
      )
      if (!textBlock) throw new Error('No text content returned from Anthropic')
      analysis = textBlock.text
    } catch (err) {
      console.error('LinkedIn Optimizer AI error:', err)
      return NextResponse.json({ error: TROUBLE_MESSAGE }, { status: 502 })
    }

    await prisma.linkedInOptimization.create({
      data: {
        memberId,
        headline: profileUrl.trim(),
        analysis: { text: analysis },
      },
    })

    await prisma.memberMilestone.upsert({
      where: { memberId_milestoneId: { memberId, milestoneId: 'linkedin_updated' } },
      create: { memberId, milestoneId: 'linkedin_updated' },
      update: {},
    })

    return NextResponse.json({ analysis })
  } catch (err) {
    console.error('LinkedIn Optimizer API error:', err)
    return NextResponse.json({ error: TROUBLE_MESSAGE }, { status: 500 })
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
