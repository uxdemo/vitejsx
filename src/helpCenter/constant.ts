export interface TourStep {
  title: string;
  description: string;
}

export interface NavGroup {
  id: string;
  label: string;
  itemCount: number;
  hasVideo: boolean;
}

export interface NavItem {
  id: string;
  title: string;
  videoTimestamp?: string;
  mdPath?: string;
}

export const tourSteps: TourStep[] = [
  {
    title: '欢迎来到「工况模式配置」',
    description:
      '当前页是模型配置的第 3 步。左侧导航显示 6 步配置流程,完成后才能上线模型。模式有两个核心作用:限定样本选取范围、控制 AI 计算生效时段。',
  },
  {
    title: '点击 ? 获取本页教程',
    description:
      '右上角橙色"?"按钮打开侧抽屉,显示与本页强相关的 4 篇文档 + V1 视频(自动跳到 02:30「配置工况模式」章节)。',
  },
  {
    title: '专有术语有 ⓘ 提示',
    description:
      '看到字段旁的 ⓘ 图标时,悬停即可看到术语解释。例如「优先级」「AND/OR 顺序」这些都附带示意和"查看完整教程"链接。',
  },
];

export const navGroups: NavGroup[] = [
  { id: 'overview', label: '1 · 产品概览', itemCount: 3, hasVideo: false },
  { id: 'quickstart', label: '2 · 快速入门', itemCount: 2, hasVideo: false },
  { id: 'modelConfig', label: '3 · 模型配置', itemCount: 7, hasVideo: true },
  { id: 'ruleConfig', label: '4 · 规则配置', itemCount: 4, hasVideo: true },
  { id: 'calcPoint', label: '5 · 计算测点', itemCount: 3, hasVideo: true },
  { id: 'globalTrigger', label: '6 · 全局触发器', itemCount: 2, hasVideo: true },
  { id: 'trendMonitor', label: '7 · 趋势监测', itemCount: 5, hasVideo: true },
  { id: 'alarmMgmt', label: '8 · 告警管理', itemCount: 5, hasVideo: true },
  { id: 'ticketMgmt', label: '9 · 告警单管理', itemCount: 3, hasVideo: true },
  { id: 'knowledgeBase', label: '10 · 知识库', itemCount: 4, hasVideo: true },
  { id: 'faq', label: '11 · 常见问题', itemCount: 8, hasVideo: false },
];

export const navItems: Record<string, NavItem[]> = {
  overview: [
    { id: 'product-intro', title: '产品介绍', mdPath: 'overview/00_产品介绍.md' },
    { id: 'core-concepts', title: '核心概念', mdPath: 'overview/01_核心概念.md' },
    { id: 'glossary', title: '术语表', mdPath: 'overview/02_术语表.md' },
  ],
  quickstart: [
    { id: 'full-workflow', title: '5 分钟跑通完整流程', mdPath: 'quickstart/00_5分钟跑通完整流程.md' },
    { id: 'roles-permissions', title: '角色与权限', mdPath: 'quickstart/01_角色与权限.md' },
  ],
  modelConfig: [
    {
      id: 'create-model',
      title: '#1 如何创建一个 AI 监测预警模型(基本信息)',
      videoTimestamp: 'V1·0:00',
      mdPath: 'modelConfig/01_如何创建一个AI监测预警模型_基本信息.md',
    },
    {
      id: 'algorithm-choice',
      title: '#2 三种算法对比:MMLA / NRDA / PBA 如何选',
      mdPath: 'modelConfig/02_三种算法对比_MMLA_NRDA_PBA如何选.md',
    },
    { id: 'select-points', title: '#3 如何为模型选取测点', mdPath: 'modelConfig/03_如何为模型选取测点.md' },
    {
      id: 'config-mode',
      title: '#4 如何配置工况模式(单工况)',
      videoTimestamp: 'V1·2:30',
      mdPath: 'modelConfig/04_如何配置工况模式_单工况.md',
    },
    {
      id: 'config-params',
      title: '#5 如何配置测点参数(残差阈值与告警级别)',
      videoTimestamp: 'V1·5:00',
      mdPath: 'modelConfig/05_如何配置测点参数_残差阈值与告警级别.md',
    },
    {
      id: 'train-model',
      title: '#6 如何选取训练样本并训练模型',
      videoTimestamp: 'V1·7:30',
      mdPath: 'modelConfig/06_如何选取训练样本并训练模型.md',
    },
    {
      id: 'multi-mode',
      title: '#7 多工况场景下的模式配置',
      videoTimestamp: 'V1·10:30',
      mdPath: 'modelConfig/07_多工况场景下的模式配置.md',
    },
  ],
  ruleConfig: [
    {
      id: 'rule-types',
      title: '规则类型如何选择(普通 vs 高级)',
      videoTimestamp: 'V2·0:00',
      mdPath: 'ruleConfig/08_规则类型如何选择_普通vs高级.md',
    },
    {
      id: 'basic-rule',
      title: '如何配置一条普通规则',
      videoTimestamp: 'V2·1:00',
      mdPath: 'ruleConfig/09_如何配置一条普通规则.md',
    },
    {
      id: 'advanced-rule',
      title: '如何编写高级规则 Python 脚本',
      videoTimestamp: 'V2·4:00',
      mdPath: 'ruleConfig/10-如何编写高级规则Python脚本.md',
    },
    { id: 'rule-deploy', title: '规则的延迟预警与上线流程', mdPath: 'ruleConfig/11-规则的延迟预警与上线流程.md' },
  ],
  calcPoint: [
    {
      id: 'basic-calc',
      title: '如何创建一个普通计算测点',
      videoTimestamp: 'V3·0:00',
      mdPath: 'calcPoint/12-如何创建一个普通计算测点.md',
    },
    {
      id: 'advanced-calc',
      title: '如何编写高级计算测点脚本',
      videoTimestamp: 'V3·3:00',
      mdPath: 'calcPoint/13-如何编写高级计算测点脚本.md',
    },
    {
      id: 'calc-rules',
      title: '计算测点的引用、编辑与删除规则',
      mdPath: 'calcPoint/14-计算测点的引用编辑与删除规则.md',
    },
  ],
  globalTrigger: [
    {
      id: 'create-trigger',
      title: '如何创建一个全局触发器（6 级时间粒度）',
      videoTimestamp: 'V4·0:00',
      mdPath: 'globalTrigger/15-如何创建一个全局触发器.md',
    },
    {
      id: 'trigger-granularity',
      title: '触发器在计算测点 / 模型 / 规则中如何引用',
      mdPath: 'globalTrigger/16-触发器在计算测点模型规则中如何引用.md',
    },
  ],
  trendMonitor: [
    {
      id: 'realtime-monitor',
      title: '如何查看模型实时监测（告警点颜色解读）',
      videoTimestamp: 'V5·0:00',
      mdPath: 'trendMonitor/17-如何查看模型实时监测（告警点颜色解读）.md',
    },
    {
      id: 'realtime-switch',
      title: '如何使用实时告警与实时更新开关',
      mdPath: 'trendMonitor/18-如何使用实时告警与实时更新开关.md',
    },
    {
      id: 'history-replay',
      title: '如何回放历史告警（历史仿真）',
      videoTimestamp: 'V5·2:00',
      mdPath: 'trendMonitor/19-如何回放历史告警（历史仿真）.md',
    },
    {
      id: 'history-export',
      title: '如何查看历史告警与数据导出',
      mdPath: 'trendMonitor/20-如何查看历史告警与数据导出.md',
    },
    {
      id: 'rule-metric-monitor',
      title: '规则监测与高级规则的指标监测',
      videoTimestamp: 'V5·4:00',
      mdPath: 'trendMonitor/21-规则监测与高级规则的指标监测.md',
    },
  ],
  alarmMgmt: [
    { id: 'alarm-states', title: '告警四态(待办/处理中/挂起/归档)', videoTimestamp: 'V6·0:00' },
    { id: 'alarm-detail', title: '如何查看告警详情(故障诊断+告警分析)', videoTimestamp: 'V6·1:30' },
    { id: 'archive-alarm', title: '如何归档一条告警(误报/忽略/关闭)', videoTimestamp: 'V6·3:00' },
    { id: 'suspend-alarm', title: '如何挂起一条告警' },
    { id: 'batch-alarm', title: '如何对告警进行批量处理' },
  ],
  ticketMgmt: [
    { id: 'ticket-overview', title: '我的数据 vs 告警单中心', videoTimestamp: 'V7·0:00' },
    { id: 'ticket-workflow', title: '告警单的处理流程(状态轴 + 流程图)', videoTimestamp: 'V7·1:30' },
    { id: 'close-ticket', title: '如何关闭告警单并更新案例库', videoTimestamp: 'V7·3:30' },
  ],
  knowledgeBase: [
    { id: 'fmea-view', title: 'FMEA 库:案例查看与新建', videoTimestamp: 'V7·5:00' },
    { id: 'fmea-activate', title: 'FMEA 库:激活规则与模型联动' },
    { id: 'case-view', title: '案例库:案例查看与导入', videoTimestamp: 'V7·6:30' },
    { id: 'knowledge-link', title: '知识库与告警单的双向联动' },
  ],
  faq: [
    { id: 'first-alarm-timing', title: '模型上线后多久能看到第一批告警?' },
    { id: 'residual-limit', title: '残差曲线一直贴着上限是怎么回事?' },
    { id: 'mode-switching', title: '为什么我的模式频繁切换?' },
    { id: 'more', title: '查看更多 →' },
  ],
};
