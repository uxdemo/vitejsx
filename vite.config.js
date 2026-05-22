import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

/**
 * 让 Vite 识别 .modules.less 为 CSS Modules
 * 等价于 zcfontend webpack 中 getPubgLocalIdent 对 .modules.less 的处理
 *
 * 虚拟 id 必须带 ?used 后缀：Vite 生产构建中只有当 usedRE(/[?&]used\b/) 匹配时
 * 才会输出类名映射对象，否则退化为导出 CSS 原始字符串，导致 css.navGroup 等全为 undefined。
 */
function modulesLessPlugin() {
  const realPaths = new Map()
  return {
    name: 'vite-modules-less',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!/\.modules\.less(\?.*)?$/.test(source)) return
      // 去掉原始 source 中可能已有的查询参数
      const cleanSource = source.replace(/\?.*$/, '')
      const importerDir = importer
        ? path.dirname(importer.replace(/[?#].*/, ''))
        : process.cwd()
      const realPath = path.resolve(importerDir, cleanSource)
      // ?used 告知 Vite 该模块被 JS 引用（需导出类名映射），而非仅注入 CSS
      const virtualId = realPath.replace(/\.modules\.less$/, '.module.less') + '?used'
      realPaths.set(virtualId, realPath)
      return virtualId
    },
    load(id) {
      const realPath = realPaths.get(id)
      if (!realPath) return
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
    modules: {
      localsConvention: 'camelCaseOnly',
    },
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
