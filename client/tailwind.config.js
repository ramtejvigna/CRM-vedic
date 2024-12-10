import { requirePropFactory } from '@mui/material';
import scrollabarHide from "tailwind-scrollbar-hide"
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
    scrollabarHide
  ],
}