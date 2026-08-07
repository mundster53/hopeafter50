// ============================================================
// HopeAfter50 — Resume Intelligence API
// Artifact 6 — AI-powered resume analysis + optimization
// 1. Extract text from the uploaded resume (PDF/DOCX/plain text)
// 2. Store the original file in Vercel Blob
// 3. Run prompts/resume-analysis.md, then prompts/resume-optimization.md
// 4. Persist both results and return them
//
// The member's very first upload becomes their permanent "base resume"
// (Member.baseResumeText) — it is set once and never overwritten. Every
// analysis/optimization run after that is a new, separate history entry;
// none of them ever modify the base.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { extractResumeText } from '@/lib/resume/extractText'
import { uploadMemberFile } from '@/lib/storage/blob'
import { runAnalysisAndOptimization } from '@/lib/resume/analyze'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const formData = await req.formData()
    const file = formData.get('resume')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: 'A resume file is required.' }, { status: 400 })
    }

    const targetRoles = splitList(formData.get('targetRoles'))
    const targetIndustries = splitList(formData.get('targetIndustries'))

    const resumeText = await extractResumeText(file)
    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        { success: false, error: 'We could not read enough text from that file. Please try a different file.' },
        { status: 422 }
      )
    }

    const resumeFileUrl = await uploadMemberFile(file, 'resumes', memberId)

    // The first upload becomes the member's permanent base resume. It is
    // never overwritten by later uploads, optimizations, or tailoring.
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { baseResumeText: true },
    })
    if (member && !member.baseResumeText) {
      await prisma.member.update({
        where: { id: memberId },
        data: { baseResumeText: resumeText, baseResumeFileUrl: resumeFileUrl, baseResumeSetAt: new Date() },
      })
    }

    const result = await runAnalysisAndOptimization({
      memberId,
      resumeText,
      resumeFileUrl,
      targetRoles,
      targetIndustries,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('Resume Intelligence API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong analyzing your resume. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  const analyses = await prisma.resumeAnalysis.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
  })

  const optimizations = await prisma.resumeOptimization.findMany({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
  })

  // Convenience pairing: the most recent analysis and its matching
  // optimization, so the frontend can restore the tool's last session
  // without re-uploading.
  const latestAnalysis = analyses[0] ?? null
  const latestOptimization = latestAnalysis
    ? optimizations.find((o) => o.resumeAnalysisId === latestAnalysis.id) ?? optimizations[0] ?? null
    : null

  return NextResponse.json({
    success: true,
    analyses,
    optimizations,
    latest: latestAnalysis && latestOptimization
      ? {
          analysisId: latestAnalysis.id,
          analysis: latestAnalysis.analysis,
          optimizationId: latestOptimization.id,
          optimization: {
            optimized_resume_markdown: latestOptimization.optimizedResumeMarkdown,
            major_changes: latestOptimization.majorChanges,
            recommended_follow_up: latestOptimization.recommendedFollowUp,
            confidence: latestOptimization.confidence,
          },
          targetRoles: latestAnalysis.targetRoles,
          targetIndustries: latestAnalysis.targetIndustries,
        }
      : null,
  })
}

function splitList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string' || !value.trim()) return []
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}
