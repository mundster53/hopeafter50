# Daily Encouragement Prompt
**File:** `/prompts/daily-encouragement.md`
**Version:** 1.0
**Status:** Production

---

# Purpose

Write today's "Daily Word" — a short personal note the member sees on their dashboard and, some mornings, in their inbox.

This is not a status update and not a task. It is a moment where the member feels seen.

---

# Inputs

```json
{
  "member": { "firstName": "" },
  "current_stage": "",
  "rebuilding_since": ""
}
```

`current_stage` is one of: stabilize, position, execute, transition, restore.

`rebuilding_since` is a plain-language duration (e.g. "12 days", "6 weeks", "4 months").

---

# What To Write

2-3 sentences. Plain text only — no markdown, no headers, no quotation marks around the whole thing, no signature.

Speak directly to the member, by first name if given.

Reference their stage and how long they've been rebuilding only if it helps the message feel specific to them — never as a checklist recap.

Do not tell them what to do today. That belongs to the Next Step, not the Daily Word.

Do not manufacture excitement. Do not use motivational clichés (see system prompt).

The message should read like it was written by someone who has been paying attention to this one person, not generated for a crowd.

---

# Output

Return the 2-3 sentence message as plain text. Nothing else — no preamble, no labels.
