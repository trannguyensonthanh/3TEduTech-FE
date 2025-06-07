import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    watch: {
      // Watch all files in the project
      ignored: ['!**/node_modules/@react-pdf/renderer/**'],
      // Hoặc thử một pattern khác nếu cần
    },
  },
  plugins: [
    react(),
    // componentTagger() has been removed
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
