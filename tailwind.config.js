/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          bg: '#070a12',
          surface: '#0d1424',
          subtle: '#131b30',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          accent: '#10b981',
          gold: '#f59e0b',
          cyan: '#06b6d4',
          crimson: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        bangla: ['Hind Siliguri', 'Kalpurush', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      boxShadow: {
        'gov-card': '0 0 0 1px rgba(255, 255, 255, 0.06), 0 4px 16px -2px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        'gov-raised': '0 0 0 1px rgba(255, 255, 255, 0.1), 0 12px 32px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'gov-glow': '0 0 24px -4px rgba(16, 185, 129, 0.15)'
      }
    },
  },
  plugins: [],
}
