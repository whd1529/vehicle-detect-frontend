// frontend/vite.config.js 或 vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',   // ✅ 监听所有网卡，允许局域网/手机访问
    port: 5173,        // 固定端口
    // hmr: { overlay: true }  // 保留原有的 hmr 配置
  }
})