import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173, // Atur port sesuai kebutuhan
    allowedHosts: ['8353-36-73-207-44.ngrok-free.app'],
  },
  optimizeDeps: {
    exclude: ['react-icons', 'fontawesome']
  },
  build: {
    chunkSizeWarningLimit: 1000, // opsional: biar warning gak muncul
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react'
            if (id.includes('react-router-dom')) return 'router'
            if (id.includes('zustand')) return 'zustand'
            if (id.includes('axios')) return 'axios'
            if (id.includes('@fortawesome')) return 'fontawesome'
            if (id.includes('react-icons')) return 'icons'
            return 'vendor'
          }
        }
      }
    }
  },
})
