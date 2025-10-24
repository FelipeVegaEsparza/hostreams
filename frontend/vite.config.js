import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // La URL de tu backend
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000', // La URL de tu backend
        changeOrigin: true,
      },
    },
  },
})