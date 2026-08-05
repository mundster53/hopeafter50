// ============================================================
// HopeAfter50 — Resume Download API
// Converts the AI-optimized resume markdown (prompts/resume-optimization.md)
// into a downloadable, properly formatted Word document.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/client'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const { resumeMarkdown } = await req.json()
    if (typeof resumeMarkdown !== 'string' || !resumeMarkdown.trim()) {
      return NextResponse.json(
        { success: false, error: 'Resume text is required.' },
        { status: 400 }
      )
    }

    const member = await prisma.member.findUnique({
      where: { id: session.user.id },
      select: { firstName: true },
    })

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'resume-numbered-list',
            levels: [
              {
                level: 0,
                format: 'decimal',
                text: '%1.',
                alignment: AlignmentType.START,
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {},
          children: markdownToParagraphs(resumeMarkdown),
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const filenameBase = (member?.firstName || 'Member').replace(/[^a-z0-9]+/gi, '-')

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filenameBase}-Resume.docx"`,
      },
    })
  } catch (err) {
    console.error('Resume Download API error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong creating your Word document. Please try again.' },
      { status: 500 }
    )
  }
}

// Converts the resume's markdown (headings, bullet/numbered lists, bold
// text, and horizontal rules — the same subset MarkdownView renders) into
// docx paragraphs. Not a general-purpose markdown parser; only handles what
// prompts/resume-optimization.md actually produces.
function markdownToParagraphs(markdown: string): Paragraph[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const paragraphs: Paragraph[] = []

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      continue
    }

    if (/^-{3,}$/.test(line.trim())) {
      paragraphs.push(
        new Paragraph({
          border: { bottom: { color: 'C8922A', space: 1, style: 'single', size: 6 } },
          spacing: { before: 100, after: 200 },
        })
      )
      continue
    }

    const h1 = line.match(/^#\s+(.*)/)
    if (h1) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: stripInlineMarkdown(h1[1]), bold: true })],
        })
      )
      continue
    }

    const h2 = line.match(/^##\s+(.*)/)
    if (h2) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
          children: [new TextRun({ text: stripInlineMarkdown(h2[1]), bold: true, color: 'C8922A' })],
        })
      )
      continue
    }

    const h3 = line.match(/^###\s+(.*)/)
    if (h3) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: stripInlineMarkdown(h3[1]), bold: true })],
        })
      )
      continue
    }

    const bullet = line.match(/^[-*]\s+(.*)/)
    if (bullet) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: parseInlineRuns(bullet[1]),
        })
      )
      continue
    }

    const numbered = line.match(/^\d+\.\s+(.*)/)
    if (numbered) {
      paragraphs.push(
        new Paragraph({
          numbering: { reference: 'resume-numbered-list', level: 0 },
          spacing: { after: 80 },
          children: parseInlineRuns(numbered[1]),
        })
      )
      continue
    }

    paragraphs.push(
      new Paragraph({
        spacing: { after: 120 },
        children: parseInlineRuns(line),
      })
    )
  }

  return paragraphs
}

// Splits a line on **bold** markers and returns TextRuns preserving bold
// formatting; everything else renders as plain text.
function parseInlineRuns(text: string): TextRun[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  if (parts.length === 0) return [new TextRun('')]

  return parts.map((part) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/)
    if (boldMatch) {
      return new TextRun({ text: boldMatch[1], bold: true })
    }
    return new TextRun(part)
  })
}

function stripInlineMarkdown(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1')
}
