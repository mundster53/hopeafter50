// ============================================================
// HopeAfter50 — Admin auth guard
// Every /api/admin/* route must call this before touching data.
// ============================================================
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const ADMIN_EMAIL = 'bretjmundt@gmail.com'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.email === ADMIN_EMAIL
}
