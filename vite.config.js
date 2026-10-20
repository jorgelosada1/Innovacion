import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Las escenas 3D (three.js) viven en un chunk aparte cargado bajo demanda
    chunkSizeWarningLimit: 1100,
  },
})
