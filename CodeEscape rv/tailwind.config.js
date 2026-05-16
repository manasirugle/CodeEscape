/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#020812',
        'abyss-soft': '#04122c',
        neon: '#00ff88',
        'neon-dim': '#00cc6a',
        azure: '#00d4ff',
        ember: '#ffcc44',
        danger: '#ff3355',
        mist: '#cde8d6',
        ghost: '#4f8a68',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['VT323', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 24px rgba(0, 255, 136, 0.24)',
        panel:
          '0 0 24px rgba(0, 255, 136, 0.12), 0 0 70px rgba(0, 255, 136, 0.05), inset 0 0 40px rgba(0, 10, 30, 0.6)',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.35' },
        },
        pulseGrid: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        caret: {
          '50%': { opacity: '0' },
        },
        floatUp: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '0.55' },
          '90%': { opacity: '0.15' },
          '100%': { transform: 'translateY(-12px) scale(1.25)', opacity: '0' },
        },
        sweep: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        flicker: 'flicker 3.2s infinite alternate',
        'pulse-grid': 'pulseGrid 8s ease-in-out infinite',
        caret: 'caret 0.8s step-end infinite',
        'float-up': 'floatUp linear infinite',
        sweep: 'sweep 7s linear infinite',
      },
      backgroundImage: {
        grid:
          'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
