import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      // ✅ Remove token from HMR connection
      // Use the same port for HMR
    },
    // ✅ Allow all hosts during development (or specify your hosts)
    allowedHosts: ['localhost', '127.0.0.1'],
    // ✅ Disable strict port to avoid conflicts
    strictPort: false,
    // ✅ Watch for file changes without polling (faster)
    watch: {
      usePolling: false,
    },
  },
})

