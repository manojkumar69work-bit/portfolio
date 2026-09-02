import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Three.js, xterm and MediaPipe are all lazy-loaded, so keep them out
    // of the entry bundle instead of letting them block first paint.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Rolldown only accepts the function form here, not an object map.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/](three|@react-three)[\\/]/.test(id)) return 'three'
          if (/node_modules[\\/]@xterm[\\/]/.test(id)) return 'xterm'
          if (/node_modules[\\/]gsap[\\/]/.test(id)) return 'gsap'
          if (/node_modules[\\/]motion(-dom|-utils)?[\\/]/.test(id)) return 'motion'
          if (/node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          return undefined
        },
      },
    },
  },
})
