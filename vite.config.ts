import path from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // '/auth': {
      //   target: 'http://localhost:8880',
      //   changeOrigin: true,
      // },
      // '/files': {
      //   target: 'http://localhost:8880',
      //   changeOrigin: true,
      // },
    },
  },
});
