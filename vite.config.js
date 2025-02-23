import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 3000,
    historyApiFallback: true, // ✅ Ensures React Router handles unknown routes in development
  },
  build: {
    outDir: "dist",
  },
});
