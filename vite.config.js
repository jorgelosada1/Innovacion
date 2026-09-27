import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import expressApp from './server/app.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-api-middleware',
      configureServer(server) {
        server.middlewares.use(expressApp);
      },
    },
  ],
})
