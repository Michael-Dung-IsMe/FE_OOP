import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/fintrack/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ['ts-big-decimal']
  },
  // Thêm cấu hình server proxy tại đây
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Địa chỉ Backend của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
})