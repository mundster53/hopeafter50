// ============================================================
// HopeAfter50 — "What's My Dream?" API
// A guided, multi-session conversation (prompts/dream.md) that helps a
// member name what they were uniquely made to do. One conversation per
// member, resumable — see prisma/schema.prisma DreamConversation.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runChatTurn } from '@/lib/ai/anthropic'
import { loadPrompt } from '@/lib/ai/prompts'
import Anthropic from '@anthropic-ai/sdk'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

// Keyword signals used to detect which layer the AI's response has moved
// the conversation into. Checked in order — layer only ever advances
// forward (see Math.max below), so an earlier match doesn't get overridden
// by a later, unrelated phrase.
const LAYER_SIGNALS: { layer: number; phrases: string[] }[] = [
  {
    layer: 2,
    phrases: ['set aside', 'put the mortgage', 'being practical', 'just for now', 'for a few minutes'],
  },
  {
    layer: 3,
    phrases: [
      'think back',
      'what did you love',
      'what do people come to you for',
      'always wanted to do',
      'most alive',
      'been through',
    ],
  },
  {
    layer: 4,
    phrases: ["i'm noticing", 'there\'s a thread', "you've said", 'connecting', "you've mentioned", 'every time you'],
  },
  {
    layer: 5,
    phrases: [
      'put it into words',
      'one statement',
      'what you were put here',
      'let me take a shot',
      'how does that land',
      'what would you change',
    ],
  },
  {
    layer: 6,
    phrases: ['pay the bills', 'mortgage', 'voice in the back', 'what that might look like', 'people get paid'],
  },
]

function detectLayer(responseText: string): number {
  const lower = responseText.toLowerCase()
  let detected = 1
  for (const { layer, phrases } of LAYER_SIGNALS) {
    if (phrases.some((phrase) => lower.includes(phrase))) {
      detected = Math.max(detected, layer)
    }
  }
  return detected
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const { message, conversationHistory = [], currentLayer = 1 } = body as {
      message: string
      conversationHistory?: ChatMessage[]
      currentLayer?: number
      isReturning?: boolean
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'A message is required.' }, { status: 400 })
    }

    const existing = await prisma.dreamConversation.findUnique({ where: { memberId } })
    // A brand-new conversation has nothing in the database yet — trust the
    // client-supplied history (e.g. the hardcoded opening message shown
    // before the member's first reply) so it's captured from turn one.
    const history: ChatMessage[] = existing
      ? ((existing.conversationHistory as unknown as ChatMessage[]) ?? [])
      : conversationHistory

    const updatedHistory: ChatMessage[] = [...history, { role: 'user', content: message }]

    const systemPrompt = loadPrompt('dream.md')
    const anthropicMessages: Anthropic.MessageParam[] = updatedHistory.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const responseText = await runChatTurn({
      systemPrompt,
      messages: anthropicMessages,
      maxTokens: 1024,
    })

    updatedHistory.push({ role: 'assistant', content: responseText })

    const detectedLayer = detectLayer(responseText)
    const nextLayer = Math.max(detectedLayer, existing?.currentLayer ?? 1, currentLayer)

    const saved = await prisma.dreamConversation.upsert({
      where: { memberId },
      create: {
        memberId,
        currentLayer: nextLayer,
        conversationHistory: updatedHistory as unknown as object,
      },
      update: {
        currentLayer: nextLayer,
        conversationHistory: updatedHistory as unknown as object,
      },
    })

    return NextResponse.json({
      success: true,
      response: responseText,
      currentLayer: saved.currentLayer,
      conversationHistory: updatedHistory,
    })
  } catch (err) {
    console.error("What's My Dream API error:", err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const conversation = await prisma.dreamConversation.findUnique({
    where: { memberId: session.user.id },
  })

  return NextResponse.json({ success: true, conversation: conversation ?? null })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json()
    const { purposeDeclaration } = body as { purposeDeclaration: string }

    if (!purposeDeclaration || typeof purposeDeclaration !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A purpose declaration is required.' },
        { status: 400 }
      )
    }

    const updated = await prisma.dreamConversation.update({
      where: { memberId },
      data: { purposeDeclaration, completedAt: new Date() },
    })

    return NextResponse.json({ success: true, conversation: updated })
  } catch (err) {
    console.error("What's My Dream PATCH error:", err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong saving your declaration. Please try again.' },
      { status: 500 }
    )
  }
}
