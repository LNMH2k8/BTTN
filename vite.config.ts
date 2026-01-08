
import { defineConfig } from 'vite';

export default defineConfig({
  // Base path này cực kỳ quan trọng để các file JS/CSS được load đúng từ thư mục con
  base: '/WebTaoTracNghiem/',
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
