/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg: '#08090d',
          surface: '#0e111a',
          card: '#121622',
          cardHover: '#181e30',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(56, 189, 248, 0.35)',
          muted: '#94a3b8',
          subtext: '#64748b',
        },
        neon: {
          cyan: '#00f2fe',
          blue: '#38bdf8',
          purple: '#a855f7',
          emerald: '#10b981',
          orange: '#f97316',
          amber: '#fbbf24',
          rose: '#f43f5e',
        },
        amazon: {
          nav: '#0a0d14',
          subnav: '#111624',
          accent: '#38bdf8',
          yellow: '#fbbf24',
          orange: '#f97316',
          dark: '#08090d',
          btn: '#38bdf8',
          btnHover: '#0ea5e9',
          btnSecondary: '#f97316',
          btnSecondaryHover: '#ea580c',
          blue: '#38bdf8',
          blueDark: '#0284c7',
          link: '#38bdf8',
          price: '#f43f5e',
          badge: '#ef4444',
          border: 'rgba(255, 255, 255, 0.1)',
          lightBg: '#08090d'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(56, 189, 248, 0.2)',
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.2)',
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.2)',
        'card-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
