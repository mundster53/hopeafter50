import NextAuth from 'next-auth'

// Extend the built-in session types to include member id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
