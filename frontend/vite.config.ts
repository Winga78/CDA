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
    port: Number(process.env.PORT) || 4000,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api/auth': {
        target: process.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, '/auth'),
      },
      '/api/users': {
        target: process.env.VITE_USER_SERVICE_URL || 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/users'),
      },
      '/api/uploads': {
        target: process.env.VITE_UPLOADS_URL || 'http://localhost:3000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uploads/, ''),
      },
      '/api/projects': {
        target: process.env.VITE_PROJECT_SERVICE_URL || 'http://localhost:3002/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/projects/, '/projects'),
      },
      '/api/posts': {
        target: process.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3001/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/posts/, '/posts'),
        ws: true,
      },
      '/api/project-user': {
        target: process.env.VITE_PROJECT_USER_SERVICE_URL || 'http://localhost:3003/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/project-user/, '/project-user'),
      },
      '/api/post-user': {
        target: process.env.VITE_POST_USER_SERVICE_URL || 'http://localhost:3003/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/post-user/, '/post-user'),
        ws: true,
      },
     '/chat/socket.io': {
       target: process.env.VITE_SOCKET_CHAT_SERVICE_URL || 'http://localhost:3001/',
       rewrite: (path) => path.replace(/^\/chat\/socket.io/, '/socket.io'),
       changeOrigin: true,
       ws: true,
      },
    '/vote/socket.io': {
      target: process.env.VITE_SOCKET_VOTE_SERVICE_URL || 'http://localhost:3003/',
      rewrite: (path) => path.replace(/^\/vote\/socket.io/, '/socket.io'),
      changeOrigin: true,
      ws: true,
    }
    },
  }
});