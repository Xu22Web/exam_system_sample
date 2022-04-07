import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src',
      },
      { find: 'views', replacement: '/src/views' },
      { find: 'components', replacement: '/src/components' },
    ],
  },
  server: {
    host: '0.0.0.0',
    // open: true,
    // 是否自动在浏览器打开
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:5000/",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
});
