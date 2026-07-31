import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 py-10 px-6">
      <div className="max-wide mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-display text-white/60 text-sm">
          © {new Date().getFullYear()} HopeAfter50. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-6 text-sm">
          {['About', 'Resources', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, '-')}`}
              className="font-body text-white/60 hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
