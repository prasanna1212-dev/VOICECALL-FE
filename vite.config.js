import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis', // Use globalThis as a polyfill for the `global` variable
  },
  optimizeDeps: {
    include: ['global'], // Ensure Vite includes the global polyfill
  },
  server: {
    host:"172.16.32.125",
    port:"3001",
    build: {
      sourcemap: true, // Enable source maps
    },
    historyApiFallback: true, // <-- this is key
    proxy:{
      "/api":{
        target:"http://172.16.32.125:3001",
        changeOrigin: true
      }
    }
  }
})