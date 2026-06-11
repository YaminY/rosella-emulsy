/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#591D35',
          light: '#728b00',
        },
        secondary: {
          gold: '#CBA560',
          amber: '#d7a220',
          dark: '#380835',
          navy: '#01153e',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
        jp: ['Noto Sans JP', 'system-ui', 'sans-serif'],
        cn: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        kr: ['Noto Sans KR', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}