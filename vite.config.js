import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['5173-i2jmg8x03wucfw6uxvoxv-e05b5922.manusvm.computer', 'localhost', '127.0.0.1']
  }
})
