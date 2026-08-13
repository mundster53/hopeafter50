'use client'

export default function ScrollToAnchorButton({
  targetId,
  children,
  className,
}: {
  targetId: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault()
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }}
      className={className}
    >
      {children}
    </a>
  )
}
