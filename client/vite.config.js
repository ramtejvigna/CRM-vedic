import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://vedic-backend.netlify.app',
        changeOrigin: true,
      },
    },
  },  
})
