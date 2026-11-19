import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7259', // Reemplazar por el puerto HTTPS de MarkovLabBackend.Api
        changeOrigin: true,
        secure: false, // Certificado de desarrollo local de ASP.NET Core
      },
    },
  },
});
