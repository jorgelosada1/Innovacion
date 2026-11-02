import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, /api y /uploads se redirigen al servidor PHP local (npm run dev:api)
const apiTarget = process.env.API_PROXY || 'http://localhost:8000'
const proxy = {
  '/api': { target: apiTarget, changeOrigin: true },
  '/uploads': { target: apiTarget, changeOrigin: true },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  build: {
    // Las escenas 3D (three.js) viven en un chunk aparte cargado bajo demanda
    chunkSizeWarningLimit: 1100,
  },
})
