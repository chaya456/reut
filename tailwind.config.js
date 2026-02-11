/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#FF9666',
        'brand-light': '#FFCE9E',
        'brand-soft': '#fff5ec',
        'dark-coal': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Assistant', 'sans-serif'],
      }
    },
  },
  plugins: [],
}