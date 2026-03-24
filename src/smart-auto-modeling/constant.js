// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME COLORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const TH = {
  ac: "#00d4ff",
  gn: "#00e68a",
  rd: "#ff4d6a",
  yl: "#ffb84d",
  pr: "#a78bfa",
  bl: "#60a5fa",
  tx: "#e2e8f4",
  t2: "#8aa0c8",
  t3: "#4a6090",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLANT / SCENE / ALGO DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const PLANTS = {
  A厂: {
    turbines: [
      "A01",
      "A02",
      "A03",
      "A04",
      "A05",
      "A06",
      "A07",
      "A08",
      "A09",
      "A10",
      "A11",
      "A12",
    ],
    type: "SG4.2-145",
  },
  B厂: {
    turbines: ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08"],
    type: "MY-SE166",
  },
  C厂: {
    turbines: ["C01", "C02", "C03", "C04", "C05", "C06"],
    type: "GW155-4.5",
  },
};

export const SCENES = [
  "齿轮箱",
  "发电机",
  "叶片",
  "偏航",
  "变桨",
  "主轴承",
  "变流器",
];

export const ALGOS = [
  {
    id: "ae",
    name: "Autoencoder",
    type: "深度学习",
    desc: "多测点关联异常",
    best: ["齿轮箱", "发电机"],
  },
  {
    id: "lstm",
    name: "LSTM-AE",
    type: "深度学习",
    desc: "时序模式异常",
    best: ["叶片", "变桨"],
  },
  {
    id: "if",
    name: "IsolationForest",
    type: "集成学习",
    desc: "无监督快速",
    best: ["齿轮箱", "偏航"],
  },
  {
    id: "xgb",
    name: "XGBoost",
    type: "集成学习",
    desc: "有标签效果佳",
    best: ["偏航", "变桨"],
  },
  {
    id: "svm",
    name: "One-Class SVM",
    type: "统计",
    desc: "小样本",
    best: ["主轴承"],
  },
];

export const TPLS = [
  { id: "sg42", name: "SG4.2-145", scenes: SCENES },
  { id: "my166", name: "MY-SE166", scenes: SCENES },
  { id: "gw155", name: "GW155-4.5", scenes: SCENES.slice(1) },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEASUREMENT POINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SCENE_PTS = {
  齿轮箱: [
    {
      id: "a",
      nm: "齿轮箱油温",
      tag: "GBX_OIL_T",
      u: "°C",
      rec: true,
      imp: 0.95,
    },
    {
      id: "b",
      nm: "驱动端轴承温度",
      tag: "GBX_DE_T",
      u: "°C",
      rec: true,
      imp: 0.92,
    },
    {
      id: "c",
      nm: "非驱动端轴承温度",
      tag: "GBX_NDE_T",
      u: "°C",
      rec: true,
      imp: 0.88,
    },
    {
      id: "d",
      nm: "齿轮箱油压",
      tag: "GBX_OIL_P",
      u: "bar",
      rec: true,
      imp: 0.82,
    },
    {
      id: "e",
      nm: "振动X",
      tag: "GBX_VIB_X",
      u: "mm/s",
      rec: false,
      imp: 0.71,
    },
    { id: "f", nm: "环境温度", tag: "AMB_T", u: "°C", rec: true, imp: 0.75 },
    { id: "g", nm: "有功功率", tag: "ACT_PWR", u: "kW", rec: true, imp: 0.85 },
    { id: "h", nm: "风速", tag: "WIND_SPD", u: "m/s", rec: true, imp: 0.88 },
  ],
  发电机: [
    {
      id: "a",
      nm: "驱动端轴承温度",
      tag: "GEN_DE_T",
      u: "°C",
      rec: true,
      imp: 0.94,
    },
    {
      id: "b",
      nm: "非驱动端轴承温度",
      tag: "GEN_NDE_T",
      u: "°C",
      rec: true,
      imp: 0.93,
    },
    { id: "c", nm: "绕组温度U", tag: "GEN_U_T", u: "°C", rec: true, imp: 0.91 },
    { id: "d", nm: "有功功率", tag: "ACT_PWR", u: "kW", rec: true, imp: 0.86 },
    { id: "e", nm: "环境温度", tag: "AMB_T", u: "°C", rec: true, imp: 0.74 },
  ],
  叶片: [
    {
      id: "a",
      nm: "叶片1桨距角",
      tag: "BLD1_PIT",
      u: "°",
      rec: true,
      imp: 0.91,
    },
    {
      id: "b",
      nm: "叶片2桨距角",
      tag: "BLD2_PIT",
      u: "°",
      rec: true,
      imp: 0.91,
    },
    { id: "c", nm: "转子转速", tag: "ROT_SPD", u: "rpm", rec: true, imp: 0.85 },
    { id: "d", nm: "风速", tag: "WIND_SPD", u: "m/s", rec: true, imp: 0.88 },
  ],
};

export const getPts = (sc) => SCENE_PTS[sc] || SCENE_PTS["齿轮箱"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATUS / LEVEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const STATUS_MAP = {
  completed: { l: "已完成", c: "#00e68a" },
  training: { l: "训练中", c: "#60a5fa" },
  optimizing: { l: "优化中", c: "#ffb84d" },
  review: { l: "待审核", c: "#a78bfa" },
  failed: { l: "未达标", c: "#ff4d6a" },
};

export const LV_COLORS = {
  严重: TH.rd,
  警告: TH.yl,
  注意: TH.bl,
  参考: TH.t3,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEFAULT POINT CONFIG / INIT MODELS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const DEFAULT_PT_CFG = [
  {
    nm: "齿轮箱油温",
    tag: "GBX_OIL_T",
    hi: 72,
    lo: 15,
    lv: "严重",
    sup: "连续3次/5min",
    lock: true,
  },
  {
    nm: "驱动端轴承温度",
    tag: "GBX_DE_T",
    hi: 85,
    lo: 20,
    lv: "警告",
    sup: "连续2次/3min",
    lock: false,
  },
  {
    nm: "齿轮箱油压",
    tag: "GBX_OIL_P",
    hi: 4.5,
    lo: 1.2,
    lv: "注意",
    sup: "连续5次/10min",
    lock: false,
  },
  {
    nm: "有功功率",
    tag: "ACT_PWR",
    hi: 4500,
    lo: 0,
    lv: "参考",
    sup: "无",
    lock: true,
  },
  {
    nm: "风速",
    tag: "WIND_SPD",
    hi: 25,
    lo: 3,
    lv: "参考",
    sup: "无",
    lock: false,
  },
];

export function createInitModels() {
  return [
    {
      id: 1,
      name: "齿轮箱高温预警",
      plant: "A厂",
      turb: "A01~A12",
      type: "SG4.2-145",
      status: "completed",
      algo: "Autoencoder",
      p: 94.2,
      r: 91.8,
      f1: 93.0,
      fa: 3.1,
      iter: 4,
      pts: 12,
      sc: "齿轮箱",
      ptCfg: [...DEFAULT_PT_CFG],
    },
    {
      id: 2,
      name: "发电机轴承温度预警",
      plant: "A厂",
      turb: "A05",
      type: "SG4.2-145",
      status: "training",
      algo: "IsolationForest",
      p: null,
      r: null,
      f1: null,
      fa: null,
      iter: 2,
      pts: 8,
      sc: "发电机",
      progress: 67,
      ptCfg: [],
    },
    {
      id: 3,
      name: "叶片结冰检测",
      plant: "B厂",
      turb: "B01~B08",
      type: "MY-SE166",
      status: "optimizing",
      algo: "LSTM-AE",
      p: 87.5,
      r: 78.3,
      f1: 82.6,
      fa: 8.2,
      iter: 3,
      pts: 15,
      sc: "叶片",
      ptCfg: [],
    },
    {
      id: 4,
      name: "偏航异常检测",
      plant: "A厂",
      turb: "A01~A12",
      type: "SG4.2-145",
      status: "review",
      algo: "XGBoost",
      p: 96.1,
      r: 93.5,
      f1: 94.8,
      fa: 1.9,
      iter: 5,
      pts: 10,
      sc: "偏航",
      ptCfg: [],
    },
    {
      id: 5,
      name: "变桨故障预警",
      plant: "B厂",
      turb: "B03",
      type: "MY-SE166",
      status: "failed",
      algo: "RandomForest",
      p: 62.3,
      r: 55.1,
      f1: 58.5,
      fa: 22.4,
      iter: 6,
      pts: 9,
      sc: "变桨",
      ptCfg: [],
    },
  ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DETAIL / AI DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const ITER_HISTORY = [
  { r: 1, p: 72.1, rc: 68.5, f: 70.2, fa: 18.3, act: "初始训练" },
  { r: 2, p: 81.4, rc: 79.2, f: 80.3, fa: 11.2, act: "扩充低风速样本" },
  { r: 3, p: 88.6, rc: 85.1, f: 86.8, fa: 6.8, act: "剔除噪声测点" },
  { r: 4, p: 94.2, rc: 91.8, f: 93.0, fa: 3.1, act: "优化阈值+抑制规则" },
];

export const AI_CATS = [
  { l: "批量建模", ic: "zap", desc: "创建预警模型", c: TH.gn },
  { l: "模型优化", ic: "gear", desc: "优化模型性能", c: TH.yl },
  { l: "状态查询", ic: "gauge", desc: "查看运行状态", c: TH.bl },
  { l: "参数调整", ic: "sliders", desc: "修改阈值规则", c: TH.pr },
];
