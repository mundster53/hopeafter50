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

    const nextLayer = Math.max(currentLayer, existing?.currentLayer ?? 1)

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
