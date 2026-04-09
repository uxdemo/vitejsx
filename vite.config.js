import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 等价于 zcfontend 的 getLessLoader modifyVars/additionalData
        // 每个 .less 文件编译前自动注入变量定义，无需手动 @import
        additionalData: `@import "${path.resolve(__dirname, 'theme/variables.less')}";`,
      },
    },
  },
})
