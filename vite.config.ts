import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5189',
        changeOrigin: true,
        secure: false, // Certificado de desarrollo local de ASP.NET Core
      },
    },
  },
});
