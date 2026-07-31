import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // HopeAfter50 design tokens
        navy: {
          DEFAULT: '#1B2B4B',
          light: '#243660',
          dark: '#121E35',
        },
        amber: {
          hope: '#C8922A',
          light: '#DBA84A',
          pale: '#F5E9D0',
        },
        slate: {
          supporting: '#6B7A8D',
          light: '#8A98A8',
        },
        sage: {
          DEFAULT: '#E8EDE8',
          dark: '#D4DDD4',
        },
        warm: {
          white: '#F8F6F2',
          DEFAULT: '#F8F6F2',
        },
        // Semantic aliases
        brand: {
          primary: '#1B2B4B',
          accent: '#C8922A',
          muted: '#6B7A8D',
          surface: '#E8EDE8',
          bg: '#F8F6F2',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25' }],
      },
      spacing: {
        'section': '6rem',
        'section-sm': '4rem',
      },
      maxWidth: {
        'content': '680px',
        'wide': '1080px',
      },
      borderRadius: {
        'card': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(27, 43, 75, 0.08), 0 4px 16px rgba(27, 43, 75, 0.06)',
        'card-hover': '0 4px 12px rgba(27, 43, 75, 0.12), 0 8px 32px rgba(27, 43, 75, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
