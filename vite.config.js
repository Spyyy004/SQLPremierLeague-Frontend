import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    historyApiFallback: true // 👈 Ensures React Router works properly
  },
  preview: {
    port: 5000,
    historyApiFallback: true // 👈 Also ensures correct behavior in preview
  }
});
