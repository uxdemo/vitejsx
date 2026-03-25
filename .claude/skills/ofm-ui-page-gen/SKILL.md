---
name: ofm-ui-page-gen
description: >
  基于 OFM UI 设计规范，生成 React 16 + Ant Design 3.x 生产级页面组件。
  严格遵守 OFM 深色主题规范中定义的颜色、字体、间距、按钮、标签、表格、导航、流程、提示等规范。
  触发条件："生成页面"、"帮我写页面"、"生成一个xxx页面"、"create page"、"generate page"、"写一个react页面"。
---

# OFM UI — React 16 + Ant Design 3.x 页面生成器

你是基于 **React 16 (Class Component / Hooks) + Ant Design 3.x** 的 OFM 专属页面生成器。
所有输出必须 **100% 遵守** 下方 `<design_system>` 中定义的 OFM UI 设计规范，禁止使用任何与规范冲突的值。

---

## 核心原则

1. **深色主题强制** — 整套 UI 为深色主题，背景、组件、文字色全部使用规范值，禁止出现白色背景页面
2. **青蓝色主色调** — 品牌主色为 `#009fda`，所有激活态、焦点、强调色统一使用此色；`#00C5F9` 为辅助蓝色（`@blue-color`）
3. **规范 Token 强制** — 颜色、字体、间距全部用规范定义的值，禁止硬编码任意魔法值
4. **Antd 3.x API** — 严格使用 Ant Design 3.x 的组件 API（`import { ... } from 'antd'`），禁用 4.x 新增 API
5. **零圆角原则** — 按钮、输入框、选择框、弹窗等所有组件圆角均为 `0`（特殊圆形按钮除外）
6. **防御性编程** — 接口数据必须加空值防御（`data && data.field || '—'`），遵循 ES5+ 兼容写法

---

<design_system>

## 设计规范 Design System

### 1. 颜色规范 Color

#### Less 变量定义（来自 `index.less`）

```less
/* 品牌色 */
@primary-color: #009fda; /* 产品主色、主要按钮、激活态、链接、焦点边框 */
@blue-color: #00c5f9; /* 辅助蓝色，图表/链接场景 */

/* 功能色 */
@success-color: #0fc38f;
@error-color: #ff5413;
@warning-color: #ff954d;

/* 浅背景色（10% 透明度） */
@primary-color-bg: fade(@primary-color, 10); /* rgba(0,159,218,0.10) */
@success-color-bg: fade(@success-color, 10); /* rgba(15,195,143,0.10) */
@error-color-bg: fade(@error-color, 10); /* rgba(255,84,19,0.10) */
@warning-color-bg: fade(@warning-color, 10); /* rgba(255,149,77,0.10) */
@blue-color-bg: fade(@blue-color, 10); /* rgba(0,197,249,0.10) */

/* Hover 背景 */
@primary-color-hover-bg: #198ab4; /* 主色按钮 Hover/Active */
@error-color-hover-bg: fade(@error-color, 80); /* rgba(255,84,19,0.80)，危险按钮背景 */

/* 页面背景 */
@body-background: #051120; /* 页面级背景色（最深层） */
@component-background: #0a1b2f; /* 组件背景（输入框、下拉、弹窗、表格行） */

/* 文本色 */
@heading-color: #fff; /* 标题、强调文字 */
@text-color: fade(#fff, 65); /* 默认正文 rgba(255,255,255,0.65) */
@text-color-secondary: fade(#fff, 45); /* 辅助说明 rgba(255,255,255,0.45) */
@disabled-color: fade(#fff, 30); /* 占位提示、禁用文字 rgba(255,255,255,0.3) */
@tooltip-color: #fff;

/* 边框色 */
@border-color-base: fade(#fff, 30); /* 通用描边 rgba(255,255,255,0.3) */
@border-color-split: fade(#fff, 10); /* 分割线 rgba(255,255,255,0.1) */
@tab-border-line-color: fade(#fff, 10); /* Tab 底部线 / 组件禁用背景 rgba(255,255,255,0.1) */
@pubg-tab-line-color: #fff; /* Tab 激活指示线 */
@background-color-light: fade(#fff, 5); /* 极浅悬浮层 rgba(255,255,255,0.05) */

/* 阴影 */
@box-shadow-base: 0px 2px 12px -2px rgba(0, 0, 0, 0.4);

/* 下拉菜单 */
@select-dropdown-color: #13274a; /* 下拉菜单背景 */
@select-dropdown-hover-color: #1a3260; /* 下拉菜单 hover */
```

#### 颜色速查表

| 变量名                         | 计算值                   | 用途                                 |
| ------------------------------ | ------------------------ | ------------------------------------ |
| `@primary-color`               | `#009fda`                | 主色、主要按钮、激活态               |
| `@blue-color`                  | `#00c5f9`                | 辅助蓝色                             |
| `@success-color`               | `#0fc38f`                | 成功、在线、正常                     |
| `@warning-color`               | `#ff954d`                | 警告、异常、待处理                   |
| `@error-color`                 | `#ff5413`                | 失败、禁止、危险                     |
| `@error-color-hover-bg`        | `rgba(255,84,19,0.80)`   | 危险按钮背景/边框                    |
| `@body-background`             | `#051120`                | 页面级最深背景                       |
| `@component-background`        | `#0a1b2f`                | 组件背景（弹窗、表格行、输入框容器） |
| `@background-color-light`      | `rgba(255,255,255,0.05)` | 表头背景、极浅悬浮层                 |
| `@select-dropdown-color`       | `#13274a`                | 下拉菜单背景                         |
| `@select-dropdown-hover-color` | `#1a3260`                | 下拉 hover / 表格行 hover            |
| `@tab-border-line-color`       | `rgba(255,255,255,0.10)` | 分割线、禁用背景                     |
| `@text-color`                  | `rgba(255,255,255,0.65)` | 默认正文                             |
| `@text-color-secondary`        | `rgba(255,255,255,0.45)` | 辅助说明                             |
| `@disabled-color`              | `rgba(255,255,255,0.30)` | 占位提示、禁用文字                   |
| `@border-color-base`           | `rgba(255,255,255,0.30)` | 通用描边                             |

---

#### Ant Design 3.x Less 变量覆盖（`config-overrides.js`）

```javascript
// config-overrides.js (react-app-rewired + customize-cra)
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', { libraryName: 'antd', libraryDirectory: 'es', style: true }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#009fda',
      '@link-color': '#009fda',
      '@success-color': '#0fc38f',
      '@warning-color': '#ff954d',
      '@error-color': '#ff5413',
      '@body-background': '#051120',
      '@component-background': '#0a1b2f',
      '@heading-color': '#fff',
      '@text-color': 'fade(#fff, 65)',
      '@text-color-secondary': 'fade(#fff, 45)',
      '@disabled-color': 'fade(#fff, 30)',
      '@border-color-base': 'fade(#fff, 30)',
      '@border-color-split': 'fade(#fff, 10)',
      '@box-shadow-base': '0px 2px 12px -2px rgba(0,0,0,0.4)',
      '@background-color-light': 'fade(#fff, 5)',
      '@border-radius-base': '0px', // 零圆角原则
      '@item-hover-bg': '#1a3260',
      '@table-header-bg': 'fade(#fff, 5)',
      '@table-row-hover-bg': 'fade(#fff, 10)',
      '@input-bg': 'transparent',
      '@select-background': 'transparent',
      '@btn-default-bg': 'transparent',
      '@btn-default-border': 'fade(#fff, 30)',
      '@modal-content-bg': '#0a1b2f',
      '@modal-header-bg': '#0a1b2f',
      '@modal-footer-bg': '#0a1b2f',
      '@tooltip-bg': '#051120',
      '@menu-dark-bg': '#0a1b2f',
      '@menu-dark-item-active-bg': 'fade(#fff, 5)',
      '@layout-header-background': '#0a1b2f',
      '@layout-sider-background': '#0a1b2f',
    },
  }),
);
```

#### 全局 CSS 变量（来自 `index.less` `:root`，直接使用，无需另行定义）

```css
/* 以下变量由 index.less 自动注入，在 JSX 中直接使用 var(--xxx) */
--primary-color          /* #009fda */
--blue-color             /* #00c5f9 */
--success-color          /* #0fc38f */
--error-color            /* #ff5413 */
--warning-color          /* #ff954d */
--primary-color-bg       /* rgba(0,159,218,0.10) */
--success-color-bg       /* rgba(15,195,143,0.10) */
--error-color-bg         /* rgba(255,84,19,0.10) */
--warning-color-bg       /* rgba(255,149,77,0.10) */
--blue-color-bg          /* rgba(0,197,249,0.10) */
--primary-color-hover-bg /* #198ab4 */
--error-color-hover-bg   /* rgba(255,84,19,0.80) */
--body-background        /* #051120 */
--component-background   /* #0a1b2f */
--heading-color          /* #fff */
--text-color             /* rgba(255,255,255,0.65) */
--text-color-secondary   /* rgba(255,255,255,0.45) */
--disabled-color         /* rgba(255,255,255,0.30) */
--border-color-base      /* rgba(255,255,255,0.30) */
--border-color-split     /* rgba(255,255,255,0.10) */
--tab-border-line-color  /* rgba(255,255,255,0.10) */
--background-color-light /* rgba(255,255,255,0.05) */
--box-shadow-base        /* 0px 2px 12px -2px rgba(0,0,0,0.4) */
--select-dropdown-color  /* #13274a */
--select-dropdown-hover-color /* #1a3260 */
--pubg-tab-line-color    /* #fff */
--tooltip-color          /* #fff */
```

---

### 2. 字体规范 Typography

#### 系统字体

```css
font-family:
  'PingFang SC',
  'Microsoft YaHei',
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
```

#### 字体大小与行高阶梯

| 级别 | 字号   | 行高   | 字重        | 使用场景                         |
| ---- | ------ | ------ | ----------- | -------------------------------- |
| T1   | `46px` | `60px` | Bold 700    | 超大展示数字、KPI 大值           |
| T2   | `32px` | `44px` | Bold 700    | 页面主标题                       |
| T3   | `24px` | `32px` | Bold 700    | 模块标题、弹窗标题               |
| T4   | `20px` | `28px` | Bold 700    | 卡片主标题、区块标题             |
| T5   | `16px` | `22px` | Medium 500  | 常规标题、标签栏文字             |
| T6   | `14px` | `20px` | Regular 400 | **默认正文**、按钮文字、表格内容 |
| T7   | `12px` | `18px` | Regular 400 | 辅助文字、时间戳、小标签         |

---

### 3. 间距规范 Spacing

**8 倍数原则**：所有 margin / padding 优先使用 8 的倍数，紧凑间距可用 4px。

| 阶梯 | 值     | 典型用途                     |
| ---- | ------ | ---------------------------- |
| XS   | `4px`  | 图标与文字间距、行内微间距   |
| SM   | `8px`  | 紧凑组件内间距、按钮图标间距 |
| MD   | `12px` | 表单项间距、标签内边距       |
| LG   | `16px` | 卡片内边距、区块内间距       |
| XL   | `24px` | 区块间距、卡片 margin        |
| XXL  | `32px` | 页面级大间距、章节间距       |

---

### 4. 按钮规范 Button

**圆角统一 0**；三态：Normal / Hover / Disabled。

来自 `antchange.less` 的实际样式：

- 所有按钮 `background-color: transparent`，`border-radius: 0`
- Primary 按钮背景 `var(--primary-color)`，hover 时切换为 `var(--primary-color-hover-bg)`
- Danger 按钮背景/边框 `var(--error-color-hover-bg)`（即 `rgba(255,84,19,0.80)`）
- Ghost 按钮边框/文字色 `var(--primary-color)`
- 禁用状态背景 `var(--tab-border-line-color)`，边框/文字 `var(--border-color-base)`

#### 尺寸体系

| 尺寸       | 高度   | Antd size | 使用场景             |
| ---------- | ------ | --------- | -------------------- |
| 大 Large   | `40px` | `large`   | 页面主操作、表单提交 |
| 中 Default | `32px` | `default` | 全局默认             |
| 小 Small   | `28px` | `small`   | 表格内操作、紧凑区域 |

#### 类型体系

| 类型         | Antd type        | 视觉                                   | 适用场景             |
| ------------ | ---------------- | -------------------------------------- | -------------------- |
| Primary 主要 | `type="primary"` | `#009fda` 填充                         | 页面核心操作         |
| Default 默认 | `type="default"` | 透明背景，`rgba(255,255,255,0.3)` 边框 | 辅助操作             |
| Danger 危险  | `type="danger"`  | `rgba(255,84,19,0.80)` 填充            | 删除、危险操作       |
| Ghost 幽灵   | `ghost`          | 透明背景，主色边框/文字                | 深色背景上的次级操作 |
| Link 文本    | `type="link"`    | 无背景，主色文字                       | 内嵌操作、弱操作     |

#### 代码示例

```jsx
import { Button } from 'antd';

// 主要按钮
<Button type="primary" icon="plus" size="default">新建</Button>

// 默认按钮
<Button icon="sync" onClick={handleReset}>重置</Button>

// 危险按钮（Antd 3.x 用 type="danger"）
<Button type="danger" icon="delete">删除</Button>

// 幽灵按钮（深色背景场景）
<Button ghost type="primary">导出</Button>

// Ghost 危险按钮（透明底，错误色边框/文字）
<Button ghost type="danger">危险操作</Button>

// 表格内文字操作按钮
<Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
<Button type="link" size="small" style={{ color: '#ff5413' }} onClick={() => handleDelete(record)}>删除</Button>

// loading 防重复提交
<Button type="primary" loading={submitLoading} onClick={handleSubmit}>提交</Button>
```

---

### 5. 输入组件规范 Form Controls

来自 `antchange.less`：背景 `transparent`，边框 `var(--border-color-base)`，圆角 `0`，焦点时主色边框。
输入框内禁用态背景 `var(--tab-border-line-color)`，文字 `var(--border-color-base)`。

```jsx
import { Input, Select, DatePicker, Form } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;

// 文本输入（背景透明，由全局 antchange.less 控制）
<Input placeholder="请输入" />

// 搜索框（addon 背景为主色）
<Input.Search placeholder="请输入关键词" enterButton onSearch={handleSearch} />

// InputNumber（同样透明背景，圆角 0）
<InputNumber min={0} max={100} />

// 下拉选择（透明背景，下拉菜单背景 #13274a，hover #1a3260）
<Select placeholder="请选择" style={{ width: 200 }}>
  <Option value="active">启用</Option>
  <Option value="inactive">禁用</Option>
</Select>

// 多选（选中标签透明背景，边框 rgba(255,255,255,0.3)）
<Select mode="multiple" placeholder="请选择" style={{ width: 300 }}>
  <Option value="1">选项一</Option>
  <Option value="2">选项二</Option>
</Select>

// 日期选择（日历背景 #13274a）
<DatePicker placeholder="选择日期" format="YYYY-MM-DD" />

// 日期范围（提供快捷选项）
<RangePicker
  format="YYYY-MM-DD"
  ranges={{
    '最近7天': [moment().subtract(7, 'days'), moment()],
    '最近30天': [moment().subtract(30, 'days'), moment()],
    '本月': [moment().startOf('month'), moment().endOf('month')],
  }}
/>

// 文本域
<Input.TextArea rows={3} placeholder="请输入描述" maxLength={200} />
```

---

### 6. 标签规范 Tag

来自 `antchange.less`：Tag 背景 `transparent`，hover 时 `opacity: 1`（不褪色）。

#### 颜色语义对照

| 颜色           | 场景               | Antd color 值           |
| -------------- | ------------------ | ----------------------- |
| 青色 `#009fda` | 进行中、激活态     | `color="cyan"` 或自定义 |
| 绿色 `#0fc38f` | 成功、在线、正常   | `color="green"`         |
| 红色 `#ff5413` | 失败、终止、离线   | `color="red"`           |
| 橙色 `#fa8c16` | 警告、异常         | `color="orange"`        |
| 金色 `#ff954d` | 待处理、待确认     | `color="gold"`          |
| 灰色           | 已完成、禁用、取消 | `color="default"`       |
| 蓝色 `#00c5f9` | 信息、说明         | `color="blue"`          |

```jsx
import { Tag } from 'antd';

const statusTagMap = {
  active: { color: 'cyan', text: '进行中' },
  success: { color: 'green', text: '成功' },
  failed: { color: 'red', text: '失败' },
  pending: { color: 'gold', text: '待处理' },
  warning: { color: 'orange', text: '异常' },
  disabled: { color: 'default', text: '禁用' },
};

const StatusTag = ({ status }) => {
  const cfg = statusTagMap[status] || { color: 'default', text: status };
  return <Tag color={cfg.color}>{cfg.text}</Tag>;
};
```

---

### 7. 表格规范 Table

来自 `antchange.less` 的实际样式：

- 表格行背景：`var(--component-background)`（`#0a1b2f`）
- 表头背景：`var(--background-color-light)`（`rgba(255,255,255,0.05)`）
- 行 Hover / 选中 hover 背景：`var(--tab-border-line-color)`（`rgba(255,255,255,0.10)`）
- 空状态背景：`var(--component-background)`
- 固定列背景：`var(--component-background)`
- 所有圆角：`0`
- Bordered 表格边框色：`var(--border-color-base)`

#### 基础表格

```jsx
import { Table, Button, Tag, Popconfirm, Pagination } from 'antd';

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    render: (status) => <StatusTag status={status} />,
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
  {
    title: '操作',
    key: 'action',
    width: 140,
    fixed: 'right',
    align: 'center',
    render: (_, record) => (
      <>
        <Button type="link" size="small" onClick={() => handleEdit(record)}>
          编辑
        </Button>
        <Popconfirm title="确认删除此项？" onConfirm={() => handleDelete(record)}>
          <Button type="link" size="small" style={{ color: '#ff5413' }}>
            删除
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

<Table
  columns={columns}
  dataSource={tableData}
  rowKey="id"
  loading={loading}
  pagination={false}
  scroll={{ x: 'max-content' }}
/>;

{
  /* 独立分页（圆角为 0，由全局样式控制） */
}
<Pagination
  current={pagination.page}
  pageSize={pagination.pageSize}
  total={pagination.total}
  showSizeChanger
  showQuickJumper
  showTotal={(total) => `共 ${total} 条`}
  pageSizeOptions={['10', '20', '50', '100']}
  onChange={handlePageChange}
  onShowSizeChange={handlePageChange}
  style={{ textAlign: 'right', marginTop: 16 }}
/>;
```

---

### 8. 导航规范 Navigation

#### 8.1 页签栏 Tabs

来自 `antchange.less`：tabs bar 底部线颜色 `var(--border-color-base)`。

```jsx
import { Tabs } from 'antd';
const { TabPane } = Tabs;

{
  /* 一级标签栏 */
}
<Tabs defaultActiveKey="1" style={{ color: 'var(--text-color)' }}>
  <TabPane tab="Tab 1" key="1">
    <Content1 />
  </TabPane>
  <TabPane tab="Tab 2" key="2">
    <Content2 />
  </TabPane>
  <TabPane tab="Tab 3" key="3">
    <Content3 />
  </TabPane>
</Tabs>;

{
  /* 卡片式标签栏 */
}
<Tabs defaultActiveKey="1" type="card">
  <TabPane tab="Tab 1" key="1">
    ...
  </TabPane>
  <TabPane tab="Tab 2" key="2">
    ...
  </TabPane>
</Tabs>;
```

#### 8.2 标题栏 Title Bar

```jsx
// 一级标题：大型独立标题，无装饰
const FirstTitle = ({ title }) => (
  <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 24 }}>{title}</h1>
);

// 二级标题：左侧主色竖条 + 主标题 + 副标题
const SecondTitle = ({ title, subTitle }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <div style={{ width: 4, minHeight: 36, background: 'var(--primary-color)', borderRadius: 0, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: '22px' }}>{title}</div>
        {subTitle && <div style={{ fontSize: 14, color: 'var(--text-color-secondary)', marginTop: 4 }}>{subTitle}</div>}
      </div>
    </div>
  </div>
);

// 三级标题：细主色竖条 + 标题 + 副标题（更紧凑）
const ThirdTitle = ({ title, subTitle }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      <div style={{ width: 3, minHeight: 28, background: 'var(--primary-color)', borderRadius: 0, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: '20px' }}>{title}</div>
        {subTitle && <div style={{ fontSize: 12, color: 'var(--text-color-secondary)', marginTop: 2 }}>{subTitle}</div>}
      </div>
    </div>
  </div>
);
```

---

### 9. 流程控件规范 Steps / Timeline

来自 `antchange.less`：

- 连接线颜色：`var(--border-color-base)`（等待/进行中的尾线），完成后 `var(--primary-color)`
- 等待态 icon：透明背景，`var(--border-color-base)` 边框，图标 `var(--text-color)`
- 完成态 icon：透明背景，主色边框
- 进行中 icon：主色背景

```jsx
import { Steps, Timeline } from 'antd';
const { Step } = Steps;

{
  /* 横向流程 */
}
<Steps current={1}>
  <Step title="Completed" description="已完成内容" />
  <Step title="Ongoing" description="进行中内容" />
  <Step title="Waited" description="等待中内容" />
</Steps>;

{
  /* 纵向流程 */
}
<Steps direction="vertical" current={1}>
  <Step title="Completed" description="已完成内容" />
  <Step title="Ongoing" description="进行中内容" />
  <Step title="Waited" description="等待中内容" />
</Steps>;

{
  /* 时间轴 */
}
<Timeline>
  <Timeline.Item color="var(--primary-color)" style={{ color: 'var(--primary-color)' }}>
    <strong>2018.01.01 12:23:11</strong>
    <p style={{ color: 'var(--text-color-secondary)', fontSize: 12 }}>Content</p>
  </Timeline.Item>
  <Timeline.Item color="gray">
    <span style={{ color: 'var(--text-color-secondary)' }}>2018.01.01 12:23:11</span>
    <p style={{ color: 'var(--text-color-secondary)', fontSize: 12 }}>Content</p>
  </Timeline.Item>
</Timeline>;
```

---

### 10. 加载控件规范 Loading

```jsx
import { Spin, Progress, Icon } from 'antd';

{
  /* 全局加载：环形进度 */
}
<div
  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
  <Progress
    type="circle"
    percent={loadingPercent}
    strokeColor="var(--primary-color)"
    trailColor="var(--tab-border-line-color)"
    format={(pct) => <span style={{ color: 'var(--primary-color)', fontSize: 14 }}>{pct}%</span>}
    width={80}
  />
  <span style={{ marginTop: 12, color: 'var(--text-color-secondary)', fontSize: 12 }}>加载中...</span>
</div>;

{
  /* 局部加载：包裹组件 */
}
<Spin
  spinning={loading}
  indicator={<Icon type="loading" style={{ fontSize: 24, color: 'var(--primary-color)' }} spin />}>
  <div>{content}</div>
</Spin>;
```

---

### 11. 反馈与提示规范 Feedback

来自 `antchange.less`：

- Message 背景：`var(--component-background)`，阴影 `var(--box-shadow-base)`
- Popover 背景：`var(--component-background)`，标题边框 `var(--border-color-base)`
- Tooltip 背景：`var(--body-background)`（`#051120`）
- Alert 错误：背景 `var(--error-color-bg)`，边框 `var(--error-color-bg)`
- Modal mask：`rgba(16, 23, 29, 0.6)`

#### 全局消息 Message

```javascript
import { message } from 'antd';
message.success('操作成功');
message.error('操作失败，请重试');
message.warning('请注意此操作');
message.info('这是一条提示信息');
message.loading('正在处理...', 0);
```

#### 通知提醒 Notification

```javascript
import { notification } from 'antd';
notification.success({ message: '操作成功', description: '数据已保存' });
notification.error({ message: '操作失败', description: '服务器异常，请重试' });
notification.warning({ message: '注意', description: '此操作不可撤销' });
```

#### 警告提示 Alert

```jsx
import { Alert } from 'antd';

{
  /* 错误提示（背景 var(--error-color-bg)） */
}
<Alert message="操作失败" description="请检查网络连接后重试" type="error" showIcon />;

{
  /* 成功提示 */
}
<Alert message="操作成功" type="success" showIcon style={{ marginBottom: 16 }} />;

{
  /* 警告提示 */
}
<Alert message="系统警告" type="warning" showIcon closable />;

{
  /* 信息提示 */
}
<Alert message="提示信息" type="info" showIcon />;
```

#### 二次确认 Modal.confirm / Popconfirm

```javascript
import { Modal, Popconfirm } from 'antd';

// 重要操作二次确认（Modal 背景 #0a1b2f，圆角 0，mask rgba(16,23,29,0.6)）
Modal.confirm({
  title: '确认删除',
  content: '此操作不可撤销，确认删除该记录？',
  okText: '确认删除',
  okType: 'danger',
  cancelText: '取消',
  onOk: () => handleDelete(id),
});

// 表格内轻量确认（Popover 背景 var(--component-background)）
<Popconfirm title="确认删除此项？" okText="确认" cancelText="取消" onConfirm={() => handleDelete(record)}>
  <Button type="link" size="small" style={{ color: '#ff5413' }}>
    删除
  </Button>
</Popconfirm>;
```

---

### 12. 弹窗规范 Modal

来自 `antchange.less`：

- `background-color: var(--component-background)`（`#0a1b2f`）
- header / footer 边框色 `var(--border-color-base)`，`border-radius: 0`
- 关闭按钮颜色 `var(--text-color)`

```jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
const { Item: FormItem } = Form;
const { Option } = Select;

const EditModal = ({ visible, onCancel, isEdit, onSuccess, form }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const { getFieldDecorator } = form;

  const handleSubmit = () => {
    form.validateFields((err, values) => {
      if (err) return;
      setSubmitLoading(true);
      setTimeout(() => {
        message.success('保存成功');
        onSuccess();
        setSubmitLoading(false);
      }, 500);
    });
  };

  return (
    <Modal
      title={isEdit ? '编辑' : '新建'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitLoading}
      okText="确认"
      cancelText="取消"
      maskClosable={false}
      width={560}>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} colon={false}>
        <FormItem label="名称">
          {getFieldDecorator('name', { rules: [{ required: true, message: '请输入名称' }] })(
            <Input placeholder="请输入名称" maxLength={50} />,
          )}
        </FormItem>
        <FormItem label="状态">
          {getFieldDecorator('status', { initialValue: 'active', rules: [{ required: true }] })(
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem label="描述">
          {getFieldDecorator('description')(<Input.TextArea rows={3} placeholder="请输入描述" maxLength={200} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

// Antd 3.x 函数式组件仍需 Form.create() 包裹
export default Form.create()(EditModal);
```

---

### 13. 其他组件规范（来自 antchange.less）

#### Checkbox / Radio

```jsx
// Checkbox：透明背景，border-radius: 0，disabled 时边框 var(--tab-border-line-color)
// Radio Button：透明背景，边框 var(--border-color-base)，激活时主色边框/文字
// Radio 普通：透明背景，边框 var(--border-color-base)，文字 var(--heading-color)
```

#### Switch

```jsx
// 未选中：var(--border-color-base) 背景
// 选中：var(--primary-color) 背景
<Switch />
```

#### Divider

```jsx
// 背景色 var(--border-color-base)
<Divider />
```

#### Drawer

```jsx
// content 背景 var(--component-background)，header 边框 var(--border-color-base)
<Drawer title="标题" visible={visible} onClose={onClose}>
  {content}
</Drawer>
```

#### Tree / Select Tree

```jsx
// hover/selected 背景 var(--background-color-light)，文字 var(--heading-color)
// checkbox 透明背景、border-radius: 0，选中时主色背景
```

#### Menu

```jsx
// inline/vertical 边框 var(--border-color-base)
// 选中项背景 var(--background-color-light)，文字 var(--heading-color)
// hover 时 background: transparent
```

#### Upload

```jsx
// 卡片式上传区 transparent 背景，border-radius: 0
// hover 时 item 背景 var(--background-color-light)
```

#### Slider

```jsx
// handle 背景 var(--component-background)，边框 var(--primary-color)
<Slider />
```

</design_system>

---

## 页面类型模板

### 1. 列表页（List Page）

**结构：** 搜索区 → 操作区 → 表格 → 分页

```jsx
import React, { Component } from 'react';
import { Form, Input, Select, Button, Table, Tag, Popconfirm, Pagination, Card, message, Modal } from 'antd';

const { Option } = Select;
const { Item: FormItem } = Form;

const statusTagMap = {
  active: { color: 'cyan', text: '进行中' },
  success: { color: 'green', text: '成功' },
  failed: { color: 'red', text: '失败' },
  pending: { color: 'gold', text: '待处理' },
  disabled: { color: 'default', text: '禁用' },
};

class ListPage extends Component {
  state = {
    loading: false,
    tableData: [],
    selectedRowKeys: [],
    pagination: { current: 1, pageSize: 10, total: 0 },
  };

  componentDidMount() {
    this.handleSearch();
  }

  fetchData = (searchParams = {}) => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    // TODO: 替换为真实接口
    // api.getList({ ...searchParams, page: pagination.current, pageSize: pagination.pageSize })
    //   .then(res => this.setState({ tableData: res.data.list, pagination: { ...pagination, total: res.data.total } }))
    //   .finally(() => this.setState({ loading: false }));
    this.setState({ loading: false });
  };

  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.setState(
        (prev) => ({ pagination: { ...prev.pagination, current: 1 } }),
        () => this.fetchData(values),
      );
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.handleSearch();
  };

  handlePageChange = (page, pageSize) => {
    this.setState((prev) => ({ pagination: { ...prev.pagination, current: page, pageSize } }), this.fetchData);
  };

  handleDelete = (record) => {
    // await api.delete(record.id)
    message.success('删除成功');
    this.fetchData();
  };

  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    Modal.confirm({
      title: '批量删除',
      content: `确认删除选中的 ${selectedRowKeys.length} 条记录？此操作不可撤销。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        message.success('批量删除成功');
        this.setState({ selectedRowKeys: [] });
        this.fetchData();
      },
    });
  };

  getColumns = () => [
    { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true, minWidth: 140 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => {
        const cfg = statusTagMap[status] || { color: 'default', text: status };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <React.Fragment>
          <Button type="link" size="small" onClick={() => this.handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除此项？"
            okText="确认"
            cancelText="取消"
            onConfirm={() => this.handleDelete(record)}>
            <Button type="link" size="small" style={{ color: '#ff5413' }}>
              删除
            </Button>
          </Popconfirm>
        </React.Fragment>
      ),
    },
  ];

  render() {
    const { loading, tableData, selectedRowKeys, pagination } = this.state;
    const { getFieldDecorator } = this.props.form;

    const rowSelection = {
      selectedRowKeys,
      onChange: (keys) => this.setState({ selectedRowKeys: keys }),
    };

    return (
      <div style={{ padding: 24, background: 'var(--body-background)', minHeight: '100vh' }}>
        {/* 搜索区 */}
        <Card
          style={{ marginBottom: 16, background: 'transparent', border: '1px solid var(--border-color-base)' }}
          bodyStyle={{ padding: '16px 24px' }}>
          <Form layout="inline">
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入名称" style={{ width: 220 }} allowClear />)}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择状态" style={{ width: 160 }} allowClear>
                  <Option value="active">进行中</Option>
                  <Option value="success">成功</Option>
                  <Option value="failed">失败</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" icon="search" onClick={this.handleSearch}>
                查询
              </Button>
              <Button icon="sync" style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>

        {/* 表格区 */}
        <Card
          style={{ background: 'transparent', border: '1px solid var(--border-color-base)' }}
          bodyStyle={{ padding: 24 }}>
          {/* 操作栏 */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            <Button type="primary" icon="plus" onClick={this.handleCreate}>
              新建
            </Button>
            <Button
              type="danger"
              ghost
              icon="delete"
              disabled={!selectedRowKeys.length}
              onClick={this.handleBatchDelete}>
              批量删除{selectedRowKeys.length > 0 && `（${selectedRowKeys.length}）`}
            </Button>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={this.getColumns()}
            dataSource={tableData}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              pageSizeOptions={['10', '20', '50', '100']}
              onChange={this.handlePageChange}
              onShowSizeChange={this.handlePageChange}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default Form.create()(ListPage);
```

---

### 2. 详情页（Detail Page）

```jsx
import React, { Component } from 'react';
import { Card, Descriptions, Tag, Button, Spin } from 'antd';

class DetailPage extends Component {
  state = { loading: true, detail: null };

  componentDidMount() {
    const { id } = this.props.match.params;
    // api.getDetail(id).then(res => this.setState({ detail: res.data })).finally(() => this.setState({ loading: false }));
    this.setState({ loading: false });
  }

  render() {
    const { loading, detail } = this.state;
    const safeVal = (val) => (val != null ? val : '—');

    return (
      <div style={{ padding: 24, background: 'var(--body-background)', minHeight: '100vh' }}>
        <Spin spinning={loading}>
          <Card
            title={<span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>详情信息</span>}
            extra={
              <Button
                type="primary"
                ghost
                icon="edit"
                onClick={() => {
                  /* handleEdit */
                }}>
                编辑
              </Button>
            }
            style={{ background: 'transparent', border: '1px solid var(--border-color-base)' }}
            headStyle={{
              background: 'var(--component-background)',
              borderBottom: '1px solid var(--border-color-base)',
              color: '#fff',
            }}>
            <Descriptions bordered column={2} colon>
              <Descriptions.Item label="名称">{safeVal(detail && detail.name)}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {detail && detail.status ? (
                  <Tag color={detail.status === 'active' ? 'cyan' : 'default'}>
                    {detail.status === 'active' ? '进行中' : '禁用'}
                  </Tag>
                ) : (
                  '—'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{safeVal(detail && detail.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{safeVal(detail && detail.updatedAt)}</Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {safeVal(detail && detail.description)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Spin>
      </div>
    );
  }
}

export default DetailPage;
```

---

### 3. 流程页（Steps Page）

```jsx
import React, { Component } from 'react';
import { Steps, Card, Button, message } from 'antd';
const { Step } = Steps;

class StepsPage extends Component {
  state = { current: 1 };

  render() {
    const { current } = this.state;
    const steps = [
      { title: 'Completed', description: '已完成内容' },
      { title: 'Ongoing', description: '进行中内容' },
      { title: 'Waited', description: '等待中内容' },
    ];

    return (
      <div style={{ padding: 24, background: 'var(--body-background)', minHeight: '100vh' }}>
        <Card style={{ background: 'transparent', border: '1px solid var(--border-color-base)' }}>
          <Steps current={current} style={{ marginBottom: 32 }}>
            {steps.map((s, i) => (
              <Step key={i} title={s.title} description={s.description} />
            ))}
          </Steps>

          <div style={{ minHeight: 120, padding: '24px 0', color: 'var(--text-color)' }}>
            {steps[current] && steps[current].description}
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
            {current > 0 && <Button onClick={() => this.setState({ current: current - 1 })}>上一步</Button>}
            {current < steps.length - 1 ? (
              <Button type="primary" onClick={() => this.setState({ current: current + 1 })}>
                下一步
              </Button>
            ) : (
              <Button type="primary" onClick={() => message.success('完成！')}>
                完成
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }
}

export default StepsPage;
```

---

## 强制规范 Checklist

输出任何代码前，必须在脑内逐项确认：

### 规范合规

- [ ] 页面背景使用 `var(--body-background)`（`#051120`），禁止白色背景
- [ ] 组件背景（弹窗、表格行、输入容器）使用 `var(--component-background)`（`#0a1b2f`）
- [ ] Card 组件背景为 `transparent`（由全局 CSS 控制），通过 `border: 1px solid var(--border-color-base)` 区分边界
- [ ] 主色只用 `var(--primary-color)`（`#009fda`），辅助蓝用 `var(--blue-color)`（`#00c5f9`）
- [ ] 字号只用规范阶梯（46/32/24/20/16/14/12px）
- [ ] 间距只用 4/8/12/16/24/32px，禁止 5/10/15px
- [ ] **圆角全部为 0**，禁止使用 4px 或其他圆角（圆形按钮 `border-radius: 50%` 除外）

### 组件规范

- [ ] 严格使用 **Ant Design 3.x** API（`Form.create()`、`getFieldDecorator`），禁用 4.x 写法
- [ ] 按钮三态完整（Normal/Hover/Disabled），提交按钮加 `loading` 防重复
- [ ] 删除操作使用 `Popconfirm` 或 `Modal.confirm`，禁用 `window.confirm`
- [ ] 表格操作列 `fixed="right"`，长文本加 `ellipsis: true`
- [ ] 表格内操作按钮用 `type="link"` + `size="small"`
- [ ] 日期范围选择提供 `ranges` 快捷选项
- [ ] 列表页有 `Pagination` 组件，受控分页

### CSS 变量使用

- [ ] 使用 `var(--primary-color)` 而非 `#009fda`（硬编码）
- [ ] 使用 `var(--text-color)`、`var(--text-color-secondary)`、`var(--heading-color)`
- [ ] 使用 `var(--border-color-base)`、`var(--tab-border-line-color)`
- [ ] 使用 `var(--component-background)`、`var(--body-background)`
- [ ] 使用 `var(--select-dropdown-hover-color)` 作为强调 hover 背景（`#1a3260`）
- [ ] 禁止使用 `--ofm-*` 前缀（项目实际变量无此前缀）

### 代码质量

- [ ] React 16 兼容写法：Class Component 或 Hooks 均可，同一文件保持一致
- [ ] 接口数据空值防御：`(val != null ? val : '—')` 或 `data && data.field || '—'`
- [ ] 反馈统一使用 `message` / `notification` / `Modal.confirm`，禁用浏览器原生 `alert`

---

## 示例调用

```
/ofm-ui-page-gen 生成一个用户管理列表页，字段：ID、用户名、手机号、角色（下拉：管理员/普通用户）、状态、创建时间，支持按用户名搜索和状态筛选，带新建和删除按钮

/ofm-ui-page-gen 生成设备新建表单弹窗，字段：设备名称、设备类型（下拉）、安装位置、安装日期、描述，包含表单校验，使用 Antd 3.x Form.create

/ofm-ui-page-gen 生成一个3步流程页面，横向步骤条，步骤1填写基本信息，步骤2上传文件，步骤3确认提交，带上一步/下一步按钮

/ofm-ui-page-gen 生成订单详情页，展示订单基本信息（状态用青色标签）和关联商品列表表格，包含二级标题组件
```
