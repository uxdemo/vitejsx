# 工业监测平台

基于 Vite + React 构建的工业设备监测与诊断平台，包含故障诊断系统和叶片监测系统。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/ 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📋 功能特性

### 🔧 故障诊断系统
- 支持多种故障场景模拟
- 完整的 MCP 工具调用链演示
- 多阶段 LLM 推理过程可视化
- 详细的诊断结果和处置建议

### 🌊 叶片监测系统
- 风机叶片实时状态监测
- 多维度健康度分析
- 实时图表展示
- 历史数据查询和报警记录

## 🗂️ 项目结构

```
├── public/              # 静态资源
├── src/
│   ├── App.jsx          # 主应用组件（导航路由）
│   ├── App.css          # 应用样式
│   ├── diagnostic-demo.jsx    # 故障诊断演示组件
│   ├── blade-monitor.jsx      # 叶片监测系统组件
│   ├── blade-monitor.css      # 叶片监测样式
│   ├── main.jsx         # 应用入口
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json         # 项目配置

```

## 🎯 使用说明

1. **导航切换**：点击顶部导航栏在两个系统之间切换
2. **故障诊断**：选择预设故障场景，观察完整诊断流程
3. **叶片监测**：查看实时监测数据和健康分析

## 🛠️ 技术栈

- ⚡️ **Vite** - 极速的前端构建工具
- ⚛️ **React 18** - 用户界面库
- 📊 **Chart.js** - 图表可视化
- 🎨 **CSS3** - 现代化样式设计
- 📦 **ES Modules** - 原生模块系统

## 🔧 开发指南

### 添加新组件

在 `src/` 目录下创建新的 `.jsx` 文件：

```jsx
// src/my-component.jsx
export default function MyComponent() {
  return <div>My Component</div>
}
```

然后在 `App.jsx` 中导入使用。

### 样式管理

- 全局样式放在 `src/index.css`
- 组件样式推荐使用 CSS Modules 或单独的 `.css` 文件
- 支持所有 CSS 特性，包括 flexbox、grid、动画等

## 🚢 部署

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 部署到静态服务器

将 `dist/` 目录的内容部署到任何静态文件服务器即可。

## 📝 许可证

MIT License
