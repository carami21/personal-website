import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0f',
        ps2: '#4a7aff',
        'ps2-light': '#8ab4ff',
        'ps2-deep': '#1a3aff',
        cream: '#e8e8f0',
        muted: '#6b7090',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        crt: ['"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
