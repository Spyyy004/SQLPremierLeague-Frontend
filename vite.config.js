import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/',
  server: {
    port: 3000, // 👈 Set the port to 3000
    historyApiFallback: true, 
  }
})
