'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="font-body text-white/70 hover:text-white text-sm transition-colors"
    >
      Sign Out
    </button>
  )
}
