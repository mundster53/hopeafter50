'use client'

import { useEffect, useRef, useState } from 'react'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const OPENING_MESSAGE =
  "Before we get into anything else — I want to start right here. When you lost your job, what did that feel like? There's no wrong answer. When I got let go the first time, I felt like I broke out of prison — and then felt terrible for feeling that way. Someone else I know cried for a week. Someone else felt nothing at first and then it hit them three months later. What was it like for you?"

const RETURN_TRIGGER = '(Continuing our conversation.)'

type LoadState = 'loading' | 'intro' | 'chatting'

export default function DreamChat() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentLayer, setCurrentLayer] = useState(1)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [declaration, setDeclaration] = useState('')
  const [savedDeclaration, setSavedDeclaration] = useState<string | null>(null)
  const [savingDeclaration, setSavingDeclaration] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/dream')
        const data = await res.json()
        const conversation = data?.conversation

        if (!conversation) {
          setLoadState('intro')
          return
        }

        setCurrentLayer(conversation.currentLayer)
        setSavedDeclaration(conversation.purposeDeclaration ?? null)
        const history: ChatMessage[] = conversation.conversationHistory ?? []

        if (conversation.currentLayer > 1 && history.length > 0) {
          setMessages(history)
          setLoadState('chatting')
          await sendMessage(RETURN_TRIGGER, history, conversation.currentLayer, true)
        } else {
          setLoadState('intro')
        }
      } catch (err) {
        console.error(err)
        setLoadState('intro')
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  function beginConversation() {
    setMessages([{ role: 'assistant', content: OPENING_MESSAGE }])
    setLoadState('chatting')
  }

  async function sendMessage(
    text: string,
    historyBeforeSend: ChatMessage[],
    layer: number,
    isReturning = false
  ) {
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: historyBeforeSend,
          currentLayer: layer,
          isReturning,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      setCurrentLayer(data.currentLayer)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

    const nextHistory: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(nextHistory)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    await sendMessage(text, messages, currentLayer)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleSaveDeclaration() {
    if (!declaration.trim()) return
    setSavingDeclaration(true)
    try {
      const res = await fetch('/api/dream', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purposeDeclaration: declaration.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSavedDeclaration(data.conversation.purposeDeclaration)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingDeclaration(false)
    }
  }

  if (loadState === 'loading') {
    return (
      <div className="max-content mx-auto px-6 py-24 text-center">
        <p className="font-body text-slate-supporting">Loading your conversation…</p>
      </div>
    )
  }

  if (loadState === 'intro') {
    return (
      <div className="max-content mx-auto px-6 py-16">
        <p className="font-body text-slate-supporting text-sm tracking-widest uppercase mb-4">
          What&apos;s My Dream?
        </p>
        <h1 className="font-display text-display-md text-navy mb-4">
          The question you&apos;ve been afraid to ask.
        </h1>
        <p className="font-body text-navy text-lg leading-relaxed mb-6">
          This isn&apos;t a quiz. It&apos;s a conversation. And it might be the most important one
          you&apos;ve had in years. We&apos;re going to go back — sometimes way back — and find
          what&apos;s been true about you your whole life that you may have stopped letting
          yourself see. There&apos;s no wrong answer. Nothing you say here will surprise us. Take
          your time. This conversation saves as you go, so if you need to step away and come
          back, we&apos;ll be right here.
        </p>
        <p className="font-body text-slate-supporting mb-8">
          Most people spend 45–60 minutes. Some come back over several days. Both are fine.
        </p>
        <button
          onClick={beginConversation}
          className="bg-amber-hope hover:bg-amber-light text-white font-body font-semibold px-8 py-4 rounded-card transition-colors"
        >
          I&apos;m Ready
        </button>
      </div>
    )
  }

  return (
    <div className="max-content mx-auto px-6 py-8 flex flex-col" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <p className="font-display text-navy text-lg font-semibold mb-4">What&apos;s My Dream?</p>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages
          .filter((m) => m.content !== RETURN_TRIGGER)
          .map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={
                  m.role === 'assistant'
                    ? 'max-w-[85%] bg-white border-l-4 border-amber-hope rounded-card px-5 py-4 shadow-card'
                    : 'max-w-[85%] bg-navy text-white rounded-card px-5 py-4'
                }
              >
                <p
                  className={`font-body whitespace-pre-wrap leading-relaxed ${
                    m.role === 'assistant' ? 'text-navy' : 'text-white'
                  }`}
                >
                  {m.content}
                </p>
              </div>
            </div>
          ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border-l-4 border-amber-hope rounded-card px-5 py-4 shadow-card">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-light animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-light animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-light animate-bounce" />
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <p className="font-body text-sm text-red-600 mb-2">{error}</p>}

      {currentLayer >= 5 && !savedDeclaration && (
        <div className="mb-4 bg-amber-pale border-2 border-amber-hope rounded-card p-5">
          <p className="font-display text-navy font-semibold mb-2">Ready to put it into words?</p>
          <p className="font-body text-sm text-slate-supporting mb-3">
            Write your purpose declaration in your own words below, then save it.
          </p>
          <textarea
            value={declaration}
            onChange={(e) => setDeclaration(e.target.value)}
            rows={3}
            className="w-full border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope mb-3"
            placeholder="I was made to…"
          />
          <button
            onClick={handleSaveDeclaration}
            disabled={savingDeclaration || !declaration.trim()}
            className="bg-navy hover:bg-navy-light text-white font-body font-semibold px-6 py-3 rounded-card transition-colors disabled:opacity-50"
          >
            {savingDeclaration ? 'Saving…' : 'Save My Declaration'}
          </button>
        </div>
      )}

      {savedDeclaration && (
        <div className="mb-4 bg-amber-pale border-2 border-amber-hope rounded-card p-5">
          <p className="font-display text-navy font-semibold mb-2">Your Purpose Declaration</p>
          <p className="font-body text-navy text-lg leading-relaxed mb-3">{savedDeclaration}</p>
          <button
            onClick={() => navigator.clipboard.writeText(savedDeclaration)}
            className="font-body text-sm text-amber-hope hover:text-navy transition-colors underline"
          >
            Copy
          </button>
        </div>
      )}

      <div className="flex gap-3 items-end border-t border-sage pt-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            e.target.style.height = 'auto'
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your response…"
          className="flex-1 border-2 border-sage rounded-card px-4 py-3 font-body text-navy focus:outline-none focus:border-amber-hope resize-none max-h-[200px]"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="bg-amber-hope hover:bg-amber-light text-white font-body font-semibold px-6 py-3 rounded-card transition-colors disabled:opacity-50 shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  )
}
