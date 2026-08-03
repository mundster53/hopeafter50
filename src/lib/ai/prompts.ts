// ============================================================
// HopeAfter50 — Prompt Loader
// Reads the production prompts from /prompts/*.md verbatim.
// Never edit prompt content here — edit the .md files themselves.
// ============================================================
import fs from 'node:fs'
import path from 'node:path'

const PROMPTS_DIR = path.join(process.cwd(), 'prompts')
const cache = new Map<string, string>()

export function loadPrompt(filename: string): string {
  const cached = cache.get(filename)
  if (cached) return cached

  const content = fs.readFileSync(path.join(PROMPTS_DIR, filename), 'utf-8')
  cache.set(filename, content)
  return content
}
