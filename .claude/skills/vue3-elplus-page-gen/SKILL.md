---
name: vue3-elplus-page-gen
description: >
  基于项目 UI 规范，生成 Vue 3 + Element Plus 生产级页面组件。
  严格遵守 UI 规范图中定义的颜色、字体、圆角、间距、按钮、标签、表格、提示、气泡、日期等规范。
  触发条件："生成页面"、"帮我写页面"、"生成一个xxx页面"、"create page"、"generate page"、"写一个vue页面"。
---

# Vue 3 + Element Plus 页面生成器

你是基于 **Vue 3 (Composition API) + Element Plus** 的专属页面生成器。
所有输出必须 **100% 遵守** 下方 `<design_system>` 中定义的 UI 设计规范，禁止使用任何与规范冲突的值。

---

## 核心原则

1. **Composition API 优先** — 统一使用 `<script setup>` 语法，不使用 Options API
2. **规范 Token 强制** — 颜色、字体、间距、圆角全部用规范中定义的值，禁止硬编码任意魔法值
3. **Element Plus 语义化** — 反馈统一用 `ElMessage` / `ElMessageBox` / `ElNotification`，禁用浏览器原生 `alert` / `confirm`
4. **三态完整** — 所有交互元素必须响应 Normal / Hover / Disabled 三态
5. **防御性编程** — 所有来自接口的数据必须加空值防御（`data?.field ?? '—'`）

---

<design_system>

## 设计规范 Design System

### 1. 颜色规范 Color

#### 品牌色 Brand Color
| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--color-primary` | `#2468F1` | 产品主色、主要按钮、激活态、链接 |
| `--color-primary-hover` | `#4080F5` | 主色按钮 Hover 效果 |
| `--color-primary-active` | `#1A52CC` | 主色按钮点击效果 |
| `--color-primary-light` | `#EBF1FF` | 次要按钮 Hover / 浅色行高亮 |

#### 文本色 Text Color
| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--color-text-primary` | `#202145` | 强调 / 正文标题 |
| `--color-text-regular` | `#575B6B` | 正文内容 |
| `--color-text-secondary` | `#848B96` | 辅助内容 |
| `--color-text-placeholder` | `#AAAAAA` | 提示文字 / 禁用文字 |
| `--color-text-white` | `#FFFFFF` | 反白 / 纯白文字 |

#### 填充色 Fill Color
| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--color-border` | `#E5E6EB` | 描边 / 线条 / 分割线 |
| `--color-fill-header` | `#F2F2F4` | 表格顶部背景 / 输入框禁用背景 |
| `--color-fill-bg` | `#F7F8FF` | 页面浅灰背景 |
| `--color-fill-white` | `#FFFFFF` | 纯白背景 / 卡片背景 |

#### 功能色 Functional Color
| 语义 | 常规色 | 浅色背景 | 用途 |
|------|--------|----------|------|
| 成功 Succeed | `#00D4B8` | `#E5F8F5` | 操作成功、在线、正常 |
| 警示 Caution | `#FD6D05` | `#FFF1E9` | 警告、待办、异常 |
| 错误 Error | `#F44F19` | `#FFF1E9` | 失败、禁止、错误 |

#### Element Plus CSS 变量覆盖（必须在全局样式中注入）
```css
:root {
  --el-color-primary: #2468F1;
  --el-color-primary-light-3: #4080F5;
  --el-color-primary-light-5: #93B5F8;
  --el-color-primary-light-7: #C9DAFC;
  --el-color-primary-light-8: #D9E7FD;
  --el-color-primary-light-9: #EBF1FF;
  --el-color-success: #00D4B8;
  --el-color-warning: #FD6D05;
  --el-color-danger: #F44F19;
  --el-text-color-primary: #202145;
  --el-text-color-regular: #575B6B;
  --el-text-color-secondary: #848B96;
  --el-text-color-placeholder: #AAAAAA;
  --el-border-color: #E5E6EB;
  --el-fill-color: #F2F2F4;
  --el-bg-color-page: #F7F8FF;
}
```

---

### 2. 字体规范 Typography

#### 系统字体
```css
font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
```
- Mac 系统：PingFang SC（苹方-简）
- Windows 系统：Microsoft YaHei（微软雅黑）

#### 字体大小与行高阶梯
| 级别 | 字号 | 行高 | 字重 | 使用场景 |
|------|------|------|------|---------|
| T1 | `32px` | `44px` | Bold (700) | 超大标题、页面主标题 |
| T2 | `24px` | `32px` | Bold (700) | 大标题、模块标题 |
| T3 | `20px` | `28px` | Bold (700) | 大中标题、卡片主标题 |
| T4 | `18px` | `24px` | Bold (700) | 中标题、区块标题 |
| T5 | `16px` | `22px` | Regular/Medium | 常规标题、表格列头 |
| T6 | `14px` | `20px` | Regular/Medium | **默认正文**、按钮文字、标签 |
| T7 | `12px` | `18px` | Regular | 辅助文字、提示、小标签 |

---

### 3. 圆角规范 Border Radius

圆角以 2 的倍数递增，最小 2px，最大 10px。

| 圆角值 | 适用组件 | Element Plus 覆盖 |
|--------|---------|------------------|
| `2px` | Tag 标签、状态点 Badge | `--el-border-radius-small: 2px` |
| `4px` | Input 输入框、Button 按钮、Select 选择器 | `--el-border-radius-base: 4px` |
| `6px` | Dropdown 下拉框悬浮层、Select 下拉层 | `--el-border-radius-medium: 6px` (自定义) |
| `8px` | Dialog 弹框、Drawer 抽屉 | `--el-border-radius-large: 8px` |
| `10px` | Card 大卡片容器、Layout 布局块 | 手动设置 `border-radius: 10px` |

---

### 4. 间距规范 Spacing

**4 倍数原则**：所有 margin / padding 必须是 4 的倍数，禁止出现 5px、10px、15px 等非倍数值。

| 阶梯 | 值 | 典型用途 |
|------|----|---------|
| XS | `4px` | 图标与文字间距、行内微间距 |
| SM | `8px` | 紧凑组件内间距、标签间距 |
| MD | `12px` | 表单行间距、列表行高补充 |
| LG | `16px` | 区块内边距、卡片 padding |
| XL | `24px` | 区块间距、卡片 margin |
| XXL | `32px` | 页面级大间距、章节间距 |

---

### 5. 按钮规范 Button

**圆角统一 4px**；所有按钮必须实现 Normal / Hover / Disabled 三态。

#### 尺寸体系
| 尺寸 | 高度 | Element Plus size 值 | 使用场景 |
|------|------|----------------------|---------|
| 大 Large | `36px` | `large` | 页面主操作、表单提交 |
| 中 Default | `32px` | `default` | 全局默认尺寸 |
| 小 Small | `28px` | `small` | 表格内操作、紧凑区域 |
| 迷你 Mini | `24px` | `small` + 自定义 | 标签内、密集型操作 |

#### 类型体系
| 类型 | Element Plus type | 视觉 | 适用场景 |
|------|------------------|------|---------|
| Primary 主要 | `type="primary"` | 品牌蓝色填充 | 页面核心操作 |
| Secondary 次要 | `type="default"` | 白底灰边框 | 辅助操作、取消 |
| Dashed 虚线 | 自定义 + `border-style:dashed` | 虚线边框 | 添加、占位操作 |
| Outline 线性 | `type="default"` + plain | 有色边框 | 次级强调操作 |
| Text 文本 | `type="text"` | 无边框纯文字 | 内嵌操作、弱操作 |

#### 组合模式
```vue
<!-- 图标 + 文字 -->
<el-button type="primary" :icon="Plus">新建</el-button>

<!-- 纯图标按钮（必须加 aria-label） -->
<el-button :icon="Edit" circle aria-label="编辑" />

<!-- 输入框 + 按钮 组合 -->
<el-input v-model="keyword" placeholder="请输入关键词">
  <template #append>
    <el-button :icon="Search" />
  </template>
</el-input>
```

---

### 6. 标签规范 Tag

**圆角 2px**；通过颜色区分语义状态。

#### 颜色语义对照表
| 颜色 | 场景 | Element Plus effect |
|------|------|---------------------|
| Blue `#2468F1` | 已预订、激活态 | `type=""` (默认蓝) |
| Green `#00D4B8` | 进行中、成功、在线 | `type="success"` |
| Red `#F44F19` | 失败、终止、禁止 | `type="danger"` |
| Gray `#848B96` | 完成、禁用、取消 | `type="info"` |
| Purple `#7B5EA7` | 待办、未完结 | 自定义 purple |
| Orange `#FD6D05` | 警告、异常 | `type="warning"` |
| Yellow `#F5A623` | — | 自定义 yellow |
| SkyBlue `#00BFFF` | — | 自定义 skyblue |

#### 形态变体（通过 effect 控制）
```vue
<!-- 面（实心底） -->
<el-tag type="success" effect="dark">进行中</el-tag>

<!-- 线（有色描边，浅底） -->
<el-tag type="success" effect="plain">进行中</el-tag>

<!-- 默认（浅底 + 有色字） -->
<el-tag type="success">进行中</el-tag>

<!-- 可关闭标签 -->
<el-tag closable @close="handleClose">可关闭</el-tag>
```

---

### 7. 表格规范 Table

基于 `el-table`，根据场景选择对应模式：

#### 基础表格
```vue
<el-table :data="tableData" stripe border style="width: 100%">
  <el-table-column prop="name" label="名称" min-width="120" />
  <el-table-column prop="status" label="状态" width="100">
    <template #default="{ row }">
      <el-tag :type="statusTypeMap[row.status]" effect="plain" size="small">
        {{ statusLabelMap[row.status] }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="操作" width="120" fixed="right">
    <template #default="{ row }">
      <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="text" size="small" style="color: #F44F19" @click="handleDelete(row)">删除</el-button>
    </template>
  </el-table-column>
</el-table>
```

#### 多选表格（批量操作场景）
```vue
<el-table :data="tableData" @selection-change="handleSelectionChange">
  <el-table-column type="selection" width="55" />
  <!-- 其余列 -->
</el-table>
<!-- 批量操作栏 -->
<div v-if="selectedRows.length" class="batch-bar">
  <span>已选 {{ selectedRows.length }} 项</span>
  <el-button size="small" type="danger" plain @click="handleBatchDelete">批量删除</el-button>
</div>
```

#### 宽表滚动（多维数据）
```vue
<el-table :data="tableData" height="500" border style="width: 100%">
  <el-table-column prop="name" label="名称" width="160" fixed="left" />
  <!-- 中间列（可横向滚动） -->
  <el-table-column label="操作" width="160" fixed="right">
    <template #default="{ row }">
      <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
      <el-button type="text" size="small" style="color: #F44F19" @click="handleDelete(row)">删除</el-button>
    </template>
  </el-table-column>
</el-table>
```

---

### 8. 反馈与提示规范 Feedback

#### 全局提示 ElMessage（轻量操作反馈）
```javascript
// 提示
ElMessage.info('这是一条提示信息')
// 成功
ElMessage.success('操作成功')
// 警告
ElMessage.warning('请注意此操作')
// 错误
ElMessage.error('操作失败，请重试')
```

#### 警告提示 ElAlert（页面级信息展示）
```vue
<el-alert title="这是一条提示信息" type="info" show-icon />
<el-alert title="操作成功" type="success" show-icon />
<el-alert title="请注意" type="warning" show-icon />
<el-alert title="操作失败" type="error" show-icon />
```

#### 二次确认 ElMessageBox
```javascript
// 操作确认
await ElMessageBox.confirm('确认删除该条记录？此操作不可撤销', '确认删除', {
  confirmButtonText: '确认',
  cancelButtonText: '取消',
  type: 'warning',
})
```

---

### 9. 气泡规范 Tooltip / Popover

#### 文字气泡 ElTooltip（深色背景，纯文字提示）
```vue
<!-- 图标按钮补充说明 -->
<el-tooltip content="编辑此记录" placement="top">
  <el-button :icon="Edit" circle aria-label="编辑" />
</el-tooltip>

<!-- 省略文字完整展示 -->
<el-tooltip :content="row.longText" placement="top">
  <span class="text-ellipsis">{{ row.longText }}</span>
</el-tooltip>
```

#### 气泡卡片 ElPopover（白底带描边，富内容）
```vue
<el-popover placement="bottom" :width="280" trigger="hover">
  <template #reference>
    <el-button type="text">查看详情</el-button>
  </template>
  <div>
    <p class="popover-title">标题</p>
    <p class="popover-content">这里是详细内容描述...</p>
  </div>
</el-popover>
```

#### 气泡确认 ElPopconfirm（内嵌确认操作）
```vue
<el-popconfirm title="确认删除此项？" @confirm="handleDelete(row)">
  <template #reference>
    <el-button type="text" style="color: #F44F19">删除</el-button>
  </template>
</el-popconfirm>
```

---

### 10. 日期选择规范 DatePicker

统一使用 `el-date-picker`，根据粒度选择对应类型，范围选择必须提供 `shortcuts`。

```vue
<!-- 日期 -->
<el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />

<!-- 周选择器 -->
<el-date-picker v-model="week" type="week" format="YYYY 第 ww 周" />

<!-- 月份选择器 -->
<el-date-picker v-model="month" type="month" placeholder="选择月份" value-format="YYYY-MM" />

<!-- 季度选择器 -->
<el-date-picker v-model="quarter" type="year" placeholder="选择季度" />

<!-- 年份选择器 -->
<el-date-picker v-model="year" type="year" placeholder="选择年份" value-format="YYYY" />

<!-- 范围选择（必须带 shortcuts） -->
<el-date-picker
  v-model="dateRange"
  type="daterange"
  range-separator="至"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
  value-format="YYYY-MM-DD"
  :shortcuts="dateShortcuts"
/>
```

```javascript
// 范围快捷键（必须提供）
const dateShortcuts = [
  { text: '最近一周', value: () => { const end = new Date(); const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 7); return [start, end] } },
  { text: '最近一个月', value: () => { const end = new Date(); const start = new Date(); start.setMonth(start.getMonth() - 1); return [start, end] } },
  { text: '本月', value: () => { const now = new Date(); return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)] } },
]
```

</design_system>

---

## 页面类型模板

### 1. 列表页（List Page）

**结构：** 搜索区 → 操作区 → 表格 → 分页

```vue
<template>
  <div class="page-container">
    <!-- 搜索区 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区 -->
    <el-card class="table-card">
      <div class="table-toolbar">
        <el-button type="primary" :icon="Plus" @click="handleCreate">新建</el-button>
        <el-button
          type="danger"
          plain
          :icon="Delete"
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >批量删除</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'active' ? 'success' : 'info'"
              effect="plain"
              size="small"
            >{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确认删除此项？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="text" size="small" style="color: #F44F19">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @change="fetchData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh, Edit } from '@element-plus/icons-vue'

const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 替换为真实接口
    // const res = await api.getList({ ...searchForm, ...pagination })
    // tableData.value = res.data.list
    // pagination.total = res.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.page = 1; fetchData() }
const handleReset = () => { Object.assign(searchForm, { name: '', status: '' }); handleSearch() }
const handleSelectionChange = (rows) => { selectedRows.value = rows }

const handleCreate = () => { /* 打开新建弹窗或跳转新建页 */ }
const handleEdit = (row) => { /* 打开编辑弹窗，传入 row.id */ }

const handleDelete = async (row) => {
  try {
    // await api.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败，请重试')
  }
}

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 条记录？`, '批量删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  ElMessage.success('批量删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.page-container {
  padding: 24px;
  background: #F7F8FF;
  min-height: 100vh;
}
.search-card { margin-bottom: 16px; border-radius: 10px; }
.table-card { border-radius: 10px; }
.table-toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
```

---

### 2. 表单弹窗（Form Dialog）

```vue
<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑' : '新建'"
    width="560px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({ modelValue: Boolean, row: Object })
const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const isEdit = computed(() => !!props.row?.id)

const formRef = ref()
const submitLoading = ref(false)
const form = reactive({ name: '', status: 'active', date: '', description: '' })

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitLoading.value = true
  try {
    // await api.save(form)
    ElMessage.success(isEdit.value ? '编辑成功' : '新建成功')
    emit('success')
    visible.value = false
  } catch {
    ElMessage.error('提交失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

const handleClosed = () => { formRef.value?.resetFields() }
</script>
```

---

### 3. 详情页（Detail Page）

```vue
<template>
  <div class="page-container">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">详情信息</span>
          <el-button type="primary" size="small" :icon="Edit" @click="handleEdit">编辑</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="名称">{{ detail?.name ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detail?.status === 'active' ? 'success' : 'info'" effect="plain" size="small">
            {{ detail?.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail?.createdAt ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detail?.updatedAt ?? '—' }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ detail?.description ?? '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'

const route = useRoute()
const detail = ref(null)

onMounted(async () => {
  // const res = await api.getDetail(route.params.id)
  // detail.value = res.data
})

const handleEdit = () => { /* 跳转编辑或打开编辑弹窗 */ }
</script>

<style scoped>
.page-container { padding: 24px; background: #F7F8FF; min-height: 100vh; }
.detail-card { border-radius: 10px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 16px; font-weight: 600; color: #202145; }
</style>
```

---

### 4. Dashboard 仪表盘

```vue
<template>
  <div class="page-container">
    <!-- KPI 卡片 -->
    <el-row :gutter="16" class="kpi-row">
      <el-col v-for="card in kpiCards" :key="card.title" :xs="24" :sm="12" :lg="6">
        <el-card class="kpi-card">
          <div class="kpi-label">{{ card.title }}</div>
          <div class="kpi-value" :style="{ color: card.color }">{{ card.value }}</div>
          <div class="kpi-suffix">{{ card.suffix }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" header="趋势分析">
          <div class="chart-placeholder"><!-- 接入 ECharts --></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card" header="状态分布">
          <div class="chart-placeholder"><!-- 接入 ECharts 饼图 --></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
const kpiCards = [
  { title: '总数量', value: '1,128', suffix: '条', color: '#2468F1' },
  { title: '今日新增', value: '93', suffix: '条', color: '#00D4B8' },
  { title: '待处理', value: '27', suffix: '件', color: '#FD6D05' },
  { title: '异常告警', value: '3', suffix: '条', color: '#F44F19' },
]
</script>

<style scoped>
.page-container { padding: 24px; background: #F7F8FF; min-height: 100vh; }
.kpi-row { margin-bottom: 0; }
.kpi-card { border-radius: 10px; }
.kpi-label { font-size: 14px; color: #848B96; margin-bottom: 8px; }
.kpi-value { font-size: 32px; font-weight: 700; line-height: 44px; }
.kpi-suffix { font-size: 14px; color: #575B6B; margin-top: 4px; }
.chart-card { border-radius: 10px; }
.chart-placeholder { height: 280px; display: flex; align-items: center; justify-content: center; color: #AAAAAA; }
</style>
```

---

## 强制规范 Checklist

输出任何代码前，必须在脑内逐项确认：

### 规范合规
- [ ] 颜色只用规范中定义的色值，CSS 变量已注入 `:root`
- [ ] 圆角：Tag=2px，Input/Button=4px，Dropdown=6px，Dialog=8px，Card=10px
- [ ] 字号只用 T1~T7 阶梯值（32/24/20/18/16/14/12px）
- [ ] 间距只用 4px 倍数（4/8/12/16/24/32px），无 5px/10px/15px

### 组件规范
- [ ] 按钮三态完整（Normal/Hover/Disabled），`loading` 防重复提交
- [ ] 删除操作使用 `ElPopconfirm` 或 `ElMessageBox.confirm`，不用 `window.confirm`
- [ ] 表格有 `stripe`，操作列用 `fixed="right"`，长文本加 `show-overflow-tooltip`
- [ ] 表格内操作按钮用 `type="text"` + `size="small"`
- [ ] 日期范围选择提供 `shortcuts`
- [ ] 列表页有 `el-pagination`，受控分页

### 代码质量
- [ ] 使用 `<script setup>` Composition API
- [ ] 接口数据使用空值防御（`data?.field ?? '—'`）
- [ ] 反馈统一使用 `ElMessage` / `ElMessageBox`，无 `alert`
- [ ] 图标从 `@element-plus/icons-vue` 导入，不用字符串/emoji

---

## 示例调用

```
/vue3-elplus-page-gen 生成一个用户管理列表页，字段：ID、用户名、邮箱、角色（下拉：管理员/普通用户）、状态、创建时间，支持按用户名搜索和状态筛选，带新建和删除按钮

/vue3-elplus-page-gen 生成设备新建表单弹窗，字段：设备名称、设备类型（下拉）、安装位置、安装日期、描述，包含表单校验

/vue3-elplus-page-gen 生成运营 Dashboard，包含 4 个 KPI 指标卡（总设备数/在线数/离线数/告警数）和一个折线图占位区

/vue3-elplus-page-gen 生成订单详情页，展示订单基本信息和关联商品列表表格
```
