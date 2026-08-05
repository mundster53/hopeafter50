// ============================================================
// HopeAfter50 — Resume Text Extraction
// Supports PDF, DOCX, and plain text uploads.
// ============================================================
import mammoth from 'mammoth'

export async function extractResumeText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const name = file.name.toLowerCase()
  const type = file.type

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    // pdf-parse's bundled pdfjs-dist references the browser-only `DOMMatrix`
    // global at module load time. It tries to source one from the optional
    // @napi-rs/canvas native binary, but Vercel's Node serverless runtime
    // doesn't ship a matching platform binary for it, so that require fails
    // and pdf-parse crashes with "DOMMatrix is not defined" on load. A static
    // top-level `import` gets hoisted above other statements when compiled
    // to CJS, so the polyfill has to be set via a runtime require() — and
    // pdf-parse itself required lazily here — to guarantee ordering. We only
    // need text extraction, not real canvas transforms.
    if (typeof (globalThis as any).DOMMatrix === 'undefined') {
      // Webpack resolves this to dommatrix's ESM build, which comes back
      // through webpack's CJS interop as { default: CSSMatrix, ... } rather
      // than the constructor itself (unlike a plain Node require, which
      // resolves the package's CJS build and returns the constructor
      // directly) — unwrap .default so both cases work.
      const dommatrixModule: any = require('dommatrix')
      ;(globalThis as any).DOMMatrix = dommatrixModule.default ?? dommatrixModule
    }
    const { PDFParse } = require('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    try {
      const result = await parser.getText()
      return result.text.trim()
    } finally {
      await parser.destroy()
    }
  }

  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
  }

  if (type === 'text/plain' || name.endsWith('.txt') || name.endsWith('.md')) {
    return buffer.toString('utf-8').trim()
  }

  throw new Error('Unsupported file type. Please upload a PDF, DOCX, or plain text resume.')
}
