import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { vuestic } from '@vuestic/compiler/vite'

import fs from 'fs'

// 读取 config.json 文件
const config = JSON.parse(
  fs.readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), './public/config.json'), 'utf-8'),
)
// 获取当前环境
const env = process.env.NODE_ENV || 'development'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vuestic({
      devtools: true,
      cssLayers: true,
    }),
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
  ],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: parseInt(config.baseUrl[env].split(':')[2]), // 从 config.json 中获取端口
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
