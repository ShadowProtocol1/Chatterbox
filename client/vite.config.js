import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import compression from "vite-plugin-compression"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
