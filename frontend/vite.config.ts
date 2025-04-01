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
        target: process.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log(`[VITE PROXY] Proxying request to: ${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log(`[VITE PROXY] Response received with status: ${proxyRes.statusCode}`);
          });
          proxy.on('error', (err) => {
            console.error(`[VITE PROXY] Proxy error: ${err.message}`);
          });
        },
      },
      '/api/projects': {
        target: process.env.VITE_PROJECT_SERVICE_URL || 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/projects/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log(`[VITE PROXY] Proxying request to: ${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log(`[VITE PROXY] Response received with status: ${proxyRes.statusCode}`);
          });
          proxy.on('error', (err) => {
            console.error(`[VITE PROXY] Proxy error: ${err.message}`);
          });
        },
      },
      '/api/chat': {
        target: process.env.VITE_CHAT_SERVICE_URL || 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log(`[VITE PROXY] Proxying request to: ${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log(`[VITE PROXY] Response received with status: ${proxyRes.statusCode}`);
          });
          proxy.on('error', (err) => {
            console.error(`[VITE PROXY] Proxy error: ${err.message}`);
          });
        },
      },
      '/api/project-user-post': {
        target: process.env.VITE_PROJECT_USER_POST_SERVICE_URL || 'http://localhost:3003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/project-user-post/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            console.log(`[VITE PROXY] Proxying request to: ${proxyReq.path}`);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log(`[VITE PROXY] Response received with status: ${proxyRes.statusCode}`);
          });
          proxy.on('error', (err) => {
            console.error(`[VITE PROXY] Proxy error: ${err.message}`);
          });
        },
      },
    },
  },
});
