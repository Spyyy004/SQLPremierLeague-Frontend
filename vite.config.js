import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/challenges',
  server: {
    port: 3000, // 👈 Set the port to 3000
  }
})
