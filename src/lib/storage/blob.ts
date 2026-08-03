// ============================================================
// HopeAfter50 — File Storage (Vercel Blob)
// ============================================================
import { put } from '@vercel/blob'

/**
 * Uploads a member-provided file to Vercel Blob and returns its public URL.
 * Returns null (and logs a warning) if BLOB_READ_WRITE_TOKEN isn't configured
 * yet — tools that call this should still complete using extracted text
 * alone rather than fail outright.
 */
export async function uploadMemberFile(
  file: File,
  folder: string,
  memberId: string
): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(
      'BLOB_READ_WRITE_TOKEN is not set — skipping file storage for this upload.'
    )
    return null
  }

  const blob = await put(`${folder}/${memberId}/${Date.now()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return blob.url
}
