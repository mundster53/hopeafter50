import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HopeAfter50 — Rebuild After Career Disruption',
  description:
    'Practical tools, personalized plans, and renewed hope for experienced professionals rebuilding after career disruption.',
  openGraph: {
    title: 'HopeAfter50',
    description: 'You spent decades building your career. You shouldn\'t have to rebuild your future alone.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-warm-white font-body text-navy antialiased">
        {children}
      </body>
    </html>
  )
}
