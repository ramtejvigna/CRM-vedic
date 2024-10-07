import { requirePropFactory } from '@mui/material';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', // Enables class-based dark mode

  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}