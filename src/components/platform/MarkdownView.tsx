'use client'

import ReactMarkdown from 'react-markdown'

// Renders AI-generated markdown (resumes, cover letters, etc.) using the
// HopeAfter50 design tokens instead of browser default styles.
export default function MarkdownView({ content }: { content: string }) {
  return (
    <div className="font-body text-navy text-sm leading-relaxed space-y-3">
      <ReactMarkdown
        components={{
          h1: (props) => <h1 className="font-display text-xl text-navy mt-4 mb-2" {...props} />,
          h2: (props) => <h2 className="font-display text-lg text-navy mt-4 mb-2" {...props} />,
          h3: (props) => <h3 className="font-display text-base text-navy mt-3 mb-1 font-semibold" {...props} />,
          p: (props) => <p className="mb-3" {...props} />,
          ul: (props) => <ul className="list-disc list-outside pl-5 mb-3 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal list-outside pl-5 mb-3 space-y-1" {...props} />,
          li: (props) => <li {...props} />,
          strong: (props) => <strong className="font-semibold text-navy" {...props} />,
          a: (props) => <a className="text-amber-hope hover:underline" {...props} />,
          hr: () => <hr className="border-sage my-4" />,
          blockquote: (props) => (
            <blockquote className="border-l-2 border-amber-hope pl-4 italic text-slate-supporting" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
