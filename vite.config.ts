import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:5000",
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Prevent Vite from pre-bundling onnxruntime — it ships its own ESM/WASM
  // loader and must be loaded as-is (especially the /webgpu sub-path).
  optimizeDeps: {
    exclude: ["onnxruntime-web"],
  },
  // Tell Vite to pass .mjs files from node_modules through untransformed
  build: {
    rollupOptions: {
      external: [],
    },
  },
})