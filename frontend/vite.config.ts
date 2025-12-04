import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts"],
          ui: ["lucide-react", "framer-motion"],
          date: ["date-fns"],
        }
      }
    },
    chunkSizeWarningLimit: 800
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
  },
})
