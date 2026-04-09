import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

/**
 * 让 Vite 识别 .modules.less 为 CSS Modules
 * 等价于 zcfontend webpack 中 getPubgLocalIdent 对 .modules.less 的处理
 */
function modulesLessPlugin() {
  return {
    name: 'vite-modules-less',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!/\.modules\.less$/.test(source)) return
      const importerDir = importer
        ? path.dirname(importer.replace(/[?#].*/, ''))
        : process.cwd()
      const realPath = path.resolve(importerDir, source)
      // 返回一个以 .module.less 结尾的虚拟 id（触发 Vite 的 CSS Modules 处理）
      // 真实文件路径编码在 query 中
      return (
        realPath.replace(/\.modules\.less$/, '.module.less') +
        '?real=' +
        encodeURIComponent(realPath)
      )
    },
    load(id) {
      const match = id.match(/\.module\.less\?real=(.+)$/)
      if (!match) return
      const realPath = decodeURIComponent(match[1])
      if (fs.existsSync(realPath)) {
        return fs.readFileSync(realPath, 'utf-8')
      }
    },
  }
}

export default defineConfig({
  plugins: [modulesLessPlugin(), react()],
  define: {
    global: 'globalThis',
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // 等价于 zcfontend 的 getLessLoader additionalData
        // 每个 .less 文件编译前自动注入变量定义，无需手动 @import
        additionalData: `@import "${path.resolve(__dirname, 'theme/variables.less')}";`,
      },
    },
  },
})
