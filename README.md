# HopeAfter50

Practical tools, personalized plans, and renewed hope for experienced professionals rebuilding after career disruption.

---

## What This Platform Is

HopeAfter50 serves professionals 50+ who have experienced career disruption through layoff. The people who arrive here have tried everything, applied to hundreds of jobs, and are now quietly afraid they won't be able to retire, provide for their family, or rebuild their income. 

**The ministry serves people freely. It never charges them.**

The founder (Bret) has lived every stage of this journey personally. His authority comes from that — not credentials.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with custom design tokens
- **Database:** PostgreSQL via Prisma (Vercel Postgres recommended)
- **Auth:** NextAuth.js
- **AI:** Anthropic API (claude-sonnet-4-6)
- **Deployment:** Vercel
- **Email:** Resend

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (Artifact 1) ✅ COMPLETE
│   ├── platform/
│   │   ├── assessment/page.tsx     # 15-question assessment (Artifact 2) ✅ COMPLETE
│   │   ├── plan/page.tsx           # Personalized Rebuild Plan (Artifact 3) ✅ COMPLETE
│   │   ├── dashboard/page.tsx      # Member Dashboard (Artifact 4) ✅ COMPLETE
│   │   └── tools/
│   │       ├── resume/page.tsx     # AI Resume Intelligence (Artifact 6) 🔨 SCAFFOLD
│   │       ├── linkedin/page.tsx   # LinkedIn Optimizer 🔨 SCAFFOLD
│   │       ├── interview/page.tsx  # Interview Prep 🔨 SCAFFOLD
│   │       ├── income-strategy/    # Income Strategy + Runway 🔨 SCAFFOLD
│   │       ├── business-acquisition/ # Business Acquisition 🔨 SCAFFOLD
│   │       ├── fractional/         # Fractional & Consulting 🔨 SCAFFOLD
│   │       └── retirement/         # Retirement Rebuild 🔨 SCAFFOLD
│   └── api/
│       ├── assessment/route.ts     # Assessment → Plan generation ✅ COMPLETE
│       ├── resume/route.ts         # Resume AI analysis 🔨 SCAFFOLD
│       └── auth/                   # NextAuth 🔨 TODO
├── lib/
│   ├── rebuild-engine/index.ts     # Core plan logic (Artifact 5) ✅ COMPLETE
│   └── tools.ts                    # Tool registry ✅ COMPLETE
└── types/index.ts                  # All TypeScript types ✅ COMPLETE
```

---

## Design Tokens

Colors (see tailwind.config.ts):
- `navy` #1B2B4B — primary, backgrounds
- `amber-hope` #C8922A — accent, CTAs, highlights
- `slate-supporting` #6B7A8D — secondary text
- `sage` #E8EDE8 — section backgrounds, cards
- `warm-white` #F8F6F2 — main background

Fonts:
- `font-display` — Playfair Display (serif, for headlines)
- `font-body` — Inter (sans-serif, for all body text)

CSS utilities (see globals.css):
- `.btn-primary` — amber CTA button
- `.btn-secondary` — navy outlined button
- `.card` — white rounded shadow card
- `.card-hover` — card with hover shadow
- `.progress-bar` / `.progress-fill` — rebuild progress
- `.stage-badge` — amber stage indicator
- `.section-padding` — consistent section spacing

---

## What Claude Code Needs to Build

### 1. Authentication (NextAuth) — MOSTLY COMPLETE
Auth is fully scaffolded. Claude Code only needs to:
- Wire `SessionProvider` into `src/app/layout.tsx`
- Replace mock member data in dashboard with `getServerSession(authOptions)`

**Sign-in page:** `/auth/signin` — email magic link only ✅ BUILT
**Middleware:** protects all `/platform/*` routes ✅ BUILT
**API route:** `/api/auth/[...nextauth]` — email provider configured ✅ BUILT
**Email template:** branded magic link email ✅ BUILT

**Resend setup (magic link email):**
1. Go to resend.com → create account (free)
2. Add and verify your domain
3. Copy API key to RESEND_API_KEY env var

### 2. Database Integration
- Run `npx prisma migrate dev` to create tables
- Replace all mock data in dashboard with real DB queries
- Persist assessment + plan in `/api/assessment/route.ts` (TODO marked)
- Member milestones tracking

### 3. Resume Intelligence Tool (Artifact 6 — 12 steps)
File: `src/app/platform/tools/resume/page.tsx`
- File upload (PDF/DOCX) using Next.js API route
- Text extraction from uploaded file
- Anthropic API call using `RESUME_SYSTEM_PROMPT` from `/api/resume/route.ts`
- Display: Career Snapshot, Health Check scores, Strengths, Opportunities
- Before/After comparison view
- Generate supporting documents (cover letter, recruiter email, etc.)
- Optional: paste job description for job match scoring
- Version history (never overwrite)

### 4. LinkedIn Optimizer
- Input: paste LinkedIn sections OR connect via URL
- AI analyzes headline, about, experience, skills
- Returns specific recommendations + rewrites
- Consistent with resume optimization

### 5. Interview Preparation
- Input: resume analysis + target role
- Output: behavioral questions, technical questions, suggested answers from resume
- Questions the member should ask the employer

### 6. Income Strategy Planner
- Tab 1 (Strategy): evaluate all income paths based on assessment
- Tab 2 (Runway): financial runway calculator
  - Inputs: monthly expenses, current savings, severance, health insurance
  - Output: months of runway + recommendations

### 7. Business Acquisition Evaluator
- Guided evaluation: experience fit, financial requirements, risk tolerance, lifestyle
- AI synthesis of whether this path makes sense for member

### 8. Fractional & Consulting Planner
- Help member define their consulting offer
- Target market identification
- Pricing guidance
- Outreach strategy

### 9. Retirement Rebuild Planner
- Current retirement savings input
- Gap analysis
- Catch-up contribution options
- Timeline modeling

### 10. Weekly Check-In (Artifact 7.1)
- Once/week prompt: how did this week go? (5 options)
- Optional comment
- Adjusts rebuild plan recommendations

### 11. Stalled Member Detection (Artifact 5, Step 8)
- 7 days no activity → send encouragement email
- 14 days → recommend one small action
- 30 days → "How are you doing?" (not "we noticed you haven't logged in")

### 12. The "Start Here" Guide (Artifact 7)
- Static page: `/resources/start-here`
- Content: the 6 truths + 6 assignments from Artifact 7
- Available to all members from resources

---

## Core Principles (Never Violate)

1. **The platform never charges members.** Every tool is free to people who need it.
2. **One next action, never ten.** Every page should answer: what do I do right now?
3. **Never shame the member.** Language encourages, never criticizes.
4. **Never assume the only answer is another W-2 job.** Present all legitimate paths.
5. **Hope grows through progress.** Show what's accomplished, not just what remains.
6. **The member owns the journey.** HopeAfter50 provides guidance. They decide.
7. **The goal is to need the platform less.** Not to keep members engaged forever.

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Fill in your values

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
# Settings → Environment Variables → add all from .env.example
```

---

## Artifact Reference

| Artifact | What It Describes | Status |
|----------|-------------------|--------|
| Artifact 1 | Landing page content | ✅ Implemented |
| Artifact 2 | Rebuild Assessment (15 questions) | ✅ Implemented |
| Artifact 3 | Personalized Rebuild Plan output | ✅ Implemented |
| Artifact 4 | Member Dashboard | ✅ Implemented |
| Artifact 5 | Rebuild Engine logic | ✅ Implemented |
| Artifact 6 | AI Resume Intelligence System | 🔨 Scaffold only |
| Artifact 7 | "Start Here" guide | 🔨 Build as static resource page |
| Artifact 7.1 | Rebuild Operating System (ROS) | 🔨 Powers dashboard + check-ins |
