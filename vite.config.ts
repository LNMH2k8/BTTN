
import { defineConfig } from 'vite';

export default defineConfig({
  // Cập nhật đường dẫn cơ sở để khớp với link: https://lnmh2k8.github.io/BTTN/
  base: '/BTTN/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
