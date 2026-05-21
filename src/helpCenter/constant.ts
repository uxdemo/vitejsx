export const tourSteps = [
  {
    title: '欢迎来到「工况模式配置」',
    text:
      '当前页是模型配置的第 3 步。左侧导航显示 6 步配置流程,完成后才能上线模型。模式有两个核心作用:限定样本选取范围、控制 AI 计算生效时段。',
  },
  {
    title: '点击 ? 获取本页教程',
    text: '右上角橙色"?"按钮打开侧抽屉,显示与本页强相关的 4 篇文档 + V1 视频(自动跳到 02:30「配置工况模式」章节)。',
  },
  {
    title: '专有术语有 ⓘ 提示',
    text:
      '看到字段旁的 ⓘ 图标时,悬停即可看到术语解释。例如「优先级」「AND/OR 顺序」这些都附带示意和"查看完整教程"链接。',
  },
];

export const sbGroups = [
  { id: 'g1', label: '1 · 产品概览', count: 3, hasVideo: false },
  { id: 'g2', label: '2 · 快速入门', count: 2, hasVideo: false },
  { id: 'g3', label: '3 · 模型配置', count: 6, hasVideo: true },
  { id: 'g4', label: '4 · 规则配置', count: 4, hasVideo: true },
  { id: 'g5', label: '5 · 计算测点', count: 3, hasVideo: true },
  { id: 'g6', label: '6 · 全局触发器', count: 2, hasVideo: true },
  { id: 'g7', label: '7 · 趋势监测', count: 4, hasVideo: true },
  { id: 'g8', label: '8 · 告警管理', count: 5, hasVideo: true },
  { id: 'g9', label: '9 · 告警单管理', count: 3, hasVideo: true },
  { id: 'g10', label: '10 · 知识库', count: 4, hasVideo: true },
  { id: 'g11', label: '11 · 常见问题', count: 8, hasVideo: false },
];

export const sbItems: Record<string, { text: string; videoPill?: string }[]> = {
  g1: [{ text: '产品介绍' }, { text: '核心概念' }, { text: '术语表' }],
  g2: [{ text: '5 分钟跑通完整流程' }, { text: '角色与权限' }],
  g3: [
    { text: '如何创建一个模型(基本信息与算法选择)', videoPill: 'V1·0:00' },
    { text: '如何为模型选取测点' },
    { text: '如何配置工况模式', videoPill: 'V1·2:30' },
    { text: '如何配置测点参数(IO 类型与告警策略)', videoPill: 'V1·5:00' },
    { text: '如何选取训练样本并训练模型', videoPill: 'V1·7:30' },
    { text: '多工况模型与单工况的差异', videoPill: 'V1·10:30' },
  ],
  g4: [
    { text: '规则类型介绍(普通规则 vs 高级规则)', videoPill: 'V2·0:00' },
    { text: '如何配置一条普通规则', videoPill: 'V2·1:00' },
    { text: '如何编写高级规则 Python 脚本', videoPill: 'V2·4:00' },
    { text: '规则的延迟预警与上线' },
  ],
  g5: [
    { text: '如何创建一个普通计算测点', videoPill: 'V3·0:00' },
    { text: '如何编写高级计算测点脚本', videoPill: 'V3·3:00' },
    { text: '计算测点的引用、编辑与删除规则' },
  ],
  g6: [{ text: '如何创建一个全局触发器', videoPill: 'V4·0:00' }, { text: '触发器的 6 级时间粒度与预览' }],
  g7: [
    { text: '如何查看实时模型监测', videoPill: 'V5·0:00' },
    { text: '三色曲线解读(实际/预测/残差)' },
    { text: '如何回放历史告警(历史仿真)', videoPill: 'V5·2:00' },
    { text: '如何查看规则监测与指标监测', videoPill: 'V5·4:00' },
  ],
  g8: [
    { text: '告警四态(待办/处理中/挂起/归档)', videoPill: 'V6·0:00' },
    { text: '如何查看告警详情(故障诊断+告警分析)', videoPill: 'V6·1:30' },
    { text: '如何归档一条告警(误报/忽略/关闭)', videoPill: 'V6·3:00' },
    { text: '如何挂起一条告警' },
    { text: '如何对告警进行批量处理' },
  ],
  g9: [
    { text: '我的数据 vs 告警单中心', videoPill: 'V7·0:00' },
    { text: '告警单的处理流程(状态轴 + 流程图)', videoPill: 'V7·1:30' },
    { text: '如何关闭告警单并更新案例库', videoPill: 'V7·3:30' },
  ],
  g10: [
    { text: 'FMEA 库:案例查看与新建', videoPill: 'V7·5:00' },
    { text: 'FMEA 库:激活规则与模型联动' },
    { text: '案例库:案例查看与导入', videoPill: 'V7·6:30' },
    { text: '知识库与告警单的双向联动' },
  ],
  g11: [
    { text: '模型上线后多久能看到第一批告警?' },
    { text: '残差曲线一直贴着上限是怎么回事?' },
    { text: '为什么我的模式频繁切换?' },
    { text: '查看更多 →' },
  ],
};
