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
    // allowedHosts: ['d719-36-73-206-200.ngrok-free.app'],
  },
  optimizeDeps: {
    exclude: ['react-icons', 'fontawesome']
  },
})
