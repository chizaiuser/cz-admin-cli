import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
        target: 'http://192.168.0.150:9990/admin',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, '')
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'public': fileURLToPath(new URL('./public', import.meta.url))
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
})
