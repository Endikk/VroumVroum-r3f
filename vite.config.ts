import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/VroumVroum-r3f/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    open: true
  }
})
