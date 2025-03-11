/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    port: 4000,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api/auth': {
        target: process.env.VITE_AUTH_SERVICE_URL || 'http://auth-service:3000',
        changeOrigin: true,
      },
      '/api/vote': {
        target: process.env.VITE_PROJECT_SERVICE_URL || 'http://project-service:3002',
        changeOrigin: true,
      },
      '/api/chat': {
        target: process.env.VITE_CHAT_SERVICE_URL || 'http://chat-service:3001',
        changeOrigin: true,
      },
    },
  },
});
