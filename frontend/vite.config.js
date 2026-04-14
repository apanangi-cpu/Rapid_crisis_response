import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: 'http://localhost:5000', changeOrigin: true },
      '/incident': { target: 'http://localhost:5000', changeOrigin: true },
      '/ai': { target: 'http://localhost:5000', changeOrigin: true },
      '/analytics': { target: 'http://localhost:5000', changeOrigin: true },
      '/notifications': { target: 'http://localhost:5000', changeOrigin: true },
      '/location': { target: 'http://localhost:5000', changeOrigin: true },
      '/audit': { target: 'http://localhost:5000', changeOrigin: true },
      '/health': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
