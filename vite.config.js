import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import errorHandler from './vite-plugin-error-handler'

// Custom plugin to handle direct App.jsx requests
function appJsxBlocker() {
  return {
    name: 'block-app-jsx',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/src/App.jsx') {
            console.log('[App.jsx Blocker] Intercepted direct App.jsx request');
            res.statusCode = 301;
            res.setHeader('Location', '/');
            res.end();
            return;
          }
          next();
        });
      };
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    errorHandler(),
    appJsxBlocker()
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy API requests
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true,
      },
      // Proxy static file requests
      '/uploads': {
        target: process.env.VITE_STATIC_URL || 'http://localhost:5001',
        changeOrigin: true,
      },
    },
    // Prevent direct access to source files
    fs: {
      strict: true,
      allow: ['..'],
      deny: ['.git', 'node_modules/@vite/client', 'node_modules/@vitejs/plugin-react/node_modules']
    },
    hmr: {
      overlay: true
    },
    middlewareMode: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      './App.jsx': path.resolve(__dirname, './AppLoader.js')
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
