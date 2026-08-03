export default function RatingBadge({ label }: { label: string }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${toneFor(label)}`}>
      {label || 'Unknown'}
    </span>
  )
}

function toneFor(label: string): string {
  const l = label.toLowerCase()
  if (/excellent|strong|high|ready|great/.test(l)) return 'bg-sage text-navy'
  if (/good|moderate|healthy|worth/.test(l)) return 'bg-amber-pale text-amber-hope'
  if (/needs|weak|low|fair|almost|caution/.test(l)) return 'bg-amber-pale text-navy'
  return 'bg-sage-dark text-navy'
}
