// ============================================================
// HopeAfter50 — Anthropic Client Helper
// Every AI-powered tool routes through this one function so the
// model, system-prompt composition, and JSON parsing stay consistent
// with prompts/system.md's guardrails across every tool.
// ============================================================
import Anthropic from '@anthropic-ai/sdk'
import { loadPrompt } from './prompts'

// Locked per project constraint — do not change without explicit instruction.
const MODEL = 'claude-sonnet-4-6'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export class AiResponseParseError extends Error {
  constructor(public raw: string, cause: unknown) {
    super(`Failed to parse AI JSON response: ${(cause as Error)?.message ?? cause}`)
  }
}

/**
 * Runs one of the /prompts/*.md task prompts (always layered on top of
 * prompts/system.md, which defines the platform-wide guardrails) and
 * returns the model's JSON response, parsed and typed.
 */
export async function runStructuredPrompt<T>({
  promptFile,
  input,
  maxTokens = 4096,
}: {
  promptFile: string
  input: unknown
  maxTokens?: number
}): Promise<T> {
  const systemPrompt = loadPrompt('system.md')
  const taskPrompt = loadPrompt(promptFile)

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: `${systemPrompt}\n\n---\n\n${taskPrompt}`,
    messages: [
      {
        role: 'user',
        content: typeof input === 'string' ? input : JSON.stringify(input, null, 2),
      },
    ],
  })

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  )
  if (!textBlock) {
    throw new Error('No text content returned from Anthropic')
  }

  return parseJsonResponse<T>(textBlock.text)
}

/**
 * Runs a prompt file and returns the model's raw text (for prompts whose
 * output is markdown, not JSON — e.g. embedding a JSON field's markdown
 * value already handles that; this is for pure-text use if ever needed).
 */
export async function runTextPrompt({
  promptFile,
  input,
  maxTokens = 4096,
}: {
  promptFile: string
  input: unknown
  maxTokens?: number
}): Promise<string> {
  const systemPrompt = loadPrompt('system.md')
  const taskPrompt = loadPrompt(promptFile)

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: `${systemPrompt}\n\n---\n\n${taskPrompt}`,
    messages: [
      {
        role: 'user',
        content: typeof input === 'string' ? input : JSON.stringify(input, null, 2),
      },
    ],
  })

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === 'text'
  )
  if (!textBlock) {
    throw new Error('No text content returned from Anthropic')
  }
  return textBlock.text
}

function parseJsonResponse<T>(text: string): T {
  // Every prompt in /prompts instructs "Return valid JSON", but models
  // occasionally wrap the object in a ```json fence — strip it if present.
  const candidate = extractJsonCandidate(text)

  try {
    return JSON.parse(candidate) as T
  } catch (err) {
    throw new AiResponseParseError(text, err)
  }
}

/**
 * Prompts instruct the model to "return valid JSON", but it sometimes wraps
 * the object in a ```json fence and/or appends extra prose commentary after
 * it despite that instruction. Extract just the JSON object rather than
 * assuming the whole response is clean JSON.
 */
function extractJsonCandidate(text: string): string {
  const trimmed = text.trim()

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenced) return fenced[1].trim()

  // No fence — fall back to a balanced-brace scan from the first "{" so
  // trailing prose after the closing brace doesn't break JSON.parse. Tracks
  // string/escape state so braces inside quoted values don't miscount.
  const start = trimmed.indexOf('{')
  if (start === -1) return trimmed

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < trimmed.length; i++) {
    const char = trimmed[i]

    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }

    if (char === '"') inString = true
    else if (char === '{') depth++
    else if (char === '}') {
      depth--
      if (depth === 0) return trimmed.slice(start, i + 1)
    }
  }
  return trimmed.slice(start)
}
