// ============================================================
// HopeAfter50 — Resume Re-Analysis API
// Re-runs analysis + optimization against the member's stored base
// resume (Member.baseResumeText) without requiring a re-upload.
// The base resume itself is never modified by this.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import { runAnalysisAndOptimization } from '@/lib/resume/analyze'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }
  const memberId = session.user.id

  try {
    const body = await req.json().catch(() => ({}))
    const targetRoles: string[] = Array.isArray(body?.targetRoles) ? body.targetRoles : []
    const targetIndustries: string[] = Array.isArray(body?.targetIndustries) ? body.targetIndustries : []

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { baseResumeText: true, baseResumeFileUrl: true },
    })

    if (!member?.baseResumeText) {
      return NextResponse.json(
        { success: false, error: 'No previous resume found. Please upload your resume first.' },
        { status: 404 }
      )
    }

    const result = await runAnalysisAndOptimization({
      memberId,
      resumeText: member.baseResumeText,
      resumeFileUrl: member.baseResumeFileUrl,
      targetRoles,
      targetIndustries,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('Resume Re-Analysis API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong re-analyzing your resume. Please try again.' },
      { status: 500 }
    )
  }
}
