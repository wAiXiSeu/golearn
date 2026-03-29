/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'go-black': '#1a1a1a',
        'go-white': '#f5f5f5',
        'board-wood': '#dcb35c',
        'board-wood-dark': '#c4a035',
        'star-point': '#8b7355',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}