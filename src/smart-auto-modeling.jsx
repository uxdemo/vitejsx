import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Ic({ name, size = 16 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    chevR: <path d="m9 18 6-6-6-6" />,
    chevL: <path d="m15 18-6-6 6-6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
    play: <polygon points="5 3 19 12 5 21 5 3" />,
    pause: <><rect width="4" x="6" y="4" height="16" /><rect width="4" x="14" y="4" height="16" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
    cpu: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" /></>,
    wind: <><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></>,
    alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" /></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    unlock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
    file: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></>,
    mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></>,
    send: <><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
    sparkle: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" /><path d="M5 3v4M19 17v4M3 5h4M17 19h4" /></>,
    gauge: <><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
    ext: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></>,
    search2: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    sliders: <><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" /><line x1="18" x2="22" y1="16" y2="16" /></>,
    edit3: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THEME + DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TH = {
  bg: "#04080f", s1: "#0a1122", s2: "#101b33", hov: "#1a2d52",
  b1: "#172040", b2: "#243864",
  tx: "#e2e8f4", t2: "#8aa0c8", t3: "#4a6090",
  ac: "#00d4ff", acD: "rgba(0,212,255,.08)",
  gn: "#00e68a", gnD: "rgba(0,230,138,.07)",
  rd: "#ff4d6a", rdD: "rgba(255,77,106,.07)",
  yl: "#ffb84d", ylD: "rgba(255,184,77,.07)",
  pr: "#a78bfa", prD: "rgba(167,139,250,.07)",
  bl: "#60a5fa", blD: "rgba(96,165,250,.07)",
  fn: "'DM Sans','Noto Sans SC',system-ui,sans-serif",
  mn: "'JetBrains Mono','Fira Code',monospace",
};

const PLANTS = {
  "A厂": { turbines: ["A01","A02","A03","A04","A05","A06","A07","A08","A09","A10","A11","A12"], type: "SG4.2-145" },
  "B厂": { turbines: ["B01","B02","B03","B04","B05","B06","B07","B08"], type: "MY-SE166" },
  "C厂": { turbines: ["C01","C02","C03","C04","C05","C06"], type: "GW155-4.5" },
};

const SCENES = ["齿轮箱","发电机","叶片","偏航","变桨","主轴承","变流器"];

const ALGOS = [
  { id: "ae", name: "Autoencoder", type: "深度学习", desc: "多测点关联异常", best: ["齿轮箱","发电机"] },
  { id: "lstm", name: "LSTM-AE", type: "深度学习", desc: "时序模式异常", best: ["叶片","变桨"] },
  { id: "if", name: "IsolationForest", type: "集成学习", desc: "无监督快速", best: ["齿轮箱","偏航"] },
  { id: "xgb", name: "XGBoost", type: "集成学习", desc: "有标签效果佳", best: ["偏航","变桨"] },
  { id: "svm", name: "One-Class SVM", type: "统计", desc: "小样本", best: ["主轴承"] },
];

const SCENE_PTS = {
  "齿轮箱": [
    { id: "a", nm: "齿轮箱油温", tag: "GBX_OIL_T", u: "°C", rec: true, imp: 0.95 },
    { id: "b", nm: "驱动端轴承温度", tag: "GBX_DE_T", u: "°C", rec: true, imp: 0.92 },
    { id: "c", nm: "非驱动端轴承温度", tag: "GBX_NDE_T", u: "°C", rec: true, imp: 0.88 },
    { id: "d", nm: "齿轮箱油压", tag: "GBX_OIL_P", u: "bar", rec: true, imp: 0.82 },
    { id: "e", nm: "振动X", tag: "GBX_VIB_X", u: "mm/s", rec: false, imp: 0.71 },
    { id: "f", nm: "环境温度", tag: "AMB_T", u: "°C", rec: true, imp: 0.75 },
    { id: "g", nm: "有功功率", tag: "ACT_PWR", u: "kW", rec: true, imp: 0.85 },
    { id: "h", nm: "风速", tag: "WIND_SPD", u: "m/s", rec: true, imp: 0.88 },
  ],
  "发电机": [
    { id: "a", nm: "驱动端轴承温度", tag: "GEN_DE_T", u: "°C", rec: true, imp: 0.94 },
    { id: "b", nm: "非驱动端轴承温度", tag: "GEN_NDE_T", u: "°C", rec: true, imp: 0.93 },
    { id: "c", nm: "绕组温度U", tag: "GEN_U_T", u: "°C", rec: true, imp: 0.91 },
    { id: "d", nm: "有功功率", tag: "ACT_PWR", u: "kW", rec: true, imp: 0.86 },
    { id: "e", nm: "环境温度", tag: "AMB_T", u: "°C", rec: true, imp: 0.74 },
  ],
  "叶片": [
    { id: "a", nm: "叶片1桨距角", tag: "BLD1_PIT", u: "°", rec: true, imp: 0.91 },
    { id: "b", nm: "叶片2桨距角", tag: "BLD2_PIT", u: "°", rec: true, imp: 0.91 },
    { id: "c", nm: "转子转速", tag: "ROT_SPD", u: "rpm", rec: true, imp: 0.85 },
    { id: "d", nm: "风速", tag: "WIND_SPD", u: "m/s", rec: true, imp: 0.88 },
  ],
};
const getPts = (sc) => SCENE_PTS[sc] || SCENE_PTS["齿轮箱"];

const STATUS_MAP = {
  completed: { l: "已完成", c: "#00e68a", bg: "rgba(0,230,138,.07)" },
  training: { l: "训练中", c: "#60a5fa", bg: "rgba(96,165,250,.07)" },
  optimizing: { l: "优化中", c: "#ffb84d", bg: "rgba(255,184,77,.07)" },
  review: { l: "待审核", c: "#a78bfa", bg: "rgba(167,139,250,.07)" },
  failed: { l: "未达标", c: "#ff4d6a", bg: "rgba(255,77,106,.07)" },
};

const DEFAULT_PT_CFG = [
  { nm: "齿轮箱油温", tag: "GBX_OIL_T", hi: 72, lo: 15, lv: "严重", sup: "连续3次/5min", lock: true },
  { nm: "驱动端轴承温度", tag: "GBX_DE_T", hi: 85, lo: 20, lv: "警告", sup: "连续2次/3min", lock: false },
  { nm: "齿轮箱油压", tag: "GBX_OIL_P", hi: 4.5, lo: 1.2, lv: "注意", sup: "连续5次/10min", lock: false },
  { nm: "有功功率", tag: "ACT_PWR", hi: 4500, lo: 0, lv: "参考", sup: "无", lock: true },
  { nm: "风速", tag: "WIND_SPD", hi: 25, lo: 3, lv: "参考", sup: "无", lock: false },
];

function createInitModels() {
  return [
    { id: 1, name: "齿轮箱高温预警", plant: "A厂", turb: "A01~A12", type: "SG4.2-145", status: "completed", algo: "Autoencoder", p: 94.2, r: 91.8, f1: 93.0, fa: 3.1, iter: 4, pts: 12, sc: "齿轮箱", ptCfg: [...DEFAULT_PT_CFG] },
    { id: 2, name: "发电机轴承温度预警", plant: "A厂", turb: "A05", type: "SG4.2-145", status: "training", algo: "IsolationForest", p: null, r: null, f1: null, fa: null, iter: 2, pts: 8, sc: "发电机", progress: 67, ptCfg: [] },
    { id: 3, name: "叶片结冰检测", plant: "B厂", turb: "B01~B08", type: "MY-SE166", status: "optimizing", algo: "LSTM-AE", p: 87.5, r: 78.3, f1: 82.6, fa: 8.2, iter: 3, pts: 15, sc: "叶片", ptCfg: [] },
    { id: 4, name: "偏航异常检测", plant: "A厂", turb: "A01~A12", type: "SG4.2-145", status: "review", algo: "XGBoost", p: 96.1, r: 93.5, f1: 94.8, fa: 1.9, iter: 5, pts: 10, sc: "偏航", ptCfg: [] },
    { id: 5, name: "变桨故障预警", plant: "B厂", turb: "B03", type: "MY-SE166", status: "failed", algo: "RandomForest", p: 62.3, r: 55.1, f1: 58.5, fa: 22.4, iter: 6, pts: 9, sc: "变桨", ptCfg: [] },
  ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Badge({ status }) {
  const s = STATUS_MAP[status] || { l: "未知", c: "#4a6090", bg: "transparent" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 16, fontSize: 10, fontWeight: 600, color: s.c, background: s.bg, border: `1px solid ${s.c}20` }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.c, animation: (status === "training" || status === "optimizing") ? "pulse 1.5s infinite" : "none" }} />
      {s.l}
    </span>
  );
}

function Btn({ children, primary, small, danger, ghost, disabled, onClick, icon }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: small ? "4px 9px" : "7px 13px",
      fontSize: small ? 10 : 11.5, fontWeight: 600,
      color: primary ? "#000" : danger ? TH.rd : ghost ? TH.ac : TH.tx,
      background: primary ? TH.ac : danger ? TH.rdD : "transparent",
      border: primary ? `1px solid ${TH.ac}` : ghost ? "none" : `1px solid ${TH.b1}`,
      borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, transition: "all .15s", whiteSpace: "nowrap",
    }}>
      {icon && <Ic name={icon} size={small ? 11 : 13} />}
      {children}
    </button>
  );
}

function Prog({ value, color }) {
  const c = color || TH.ac;
  return (
    <div style={{ height: 3, background: TH.b1, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: c, borderRadius: 2, transition: "width .5s" }} />
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width: 32, height: 17, borderRadius: 9, cursor: "pointer", background: on ? TH.ac : TH.b1, display: "flex", alignItems: "center", padding: 2, transition: "background .2s", flexShrink: 0 }}>
      <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#fff", transform: on ? "translateX(15px)" : "translateX(0)", transition: "transform .2s" }} />
    </div>
  );
}

const LV_COLORS = { "严重": TH.rd, "警告": TH.yl, "注意": TH.bl, "参考": TH.t3 };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WIZARD (自动建模向导)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TPLS = [
  { id: "sg42", name: "SG4.2-145", scenes: SCENES },
  { id: "my166", name: "MY-SE166", scenes: SCENES },
  { id: "gw155", name: "GW155-4.5", scenes: SCENES.slice(1) },
];

function Wizard({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState({
    turbine: null, scenes: [], points: {},
    sampleStrategy: "auto", sampleMonths: 6, excludeFaults: true,
    optimizeTarget: "balanced", maxIter: 10,
    autoThreshold: true, autoSuppress: true, autoAlgoSwitch: true,
  });

  const selTpl = TPLS.find((t) => t.id === cfg.turbine);
  const steps = ["设备与场景", "配置测点", "采样与算法", "优化策略", "确认启动"];

  const canNext = step === 0
    ? (cfg.turbine && cfg.scenes.length > 0)
    : step === 1
    ? cfg.scenes.every((sc) => (cfg.points[sc] || []).length >= 2)
    : true;

  const togScene = (sc) => setCfg((c) => ({
    ...c, scenes: c.scenes.includes(sc) ? c.scenes.filter((s) => s !== sc) : [...c.scenes, sc]
  }));

  const togPt = (sc, pid) => setCfg((c) => {
    const cur = c.points[sc] || [];
    return { ...c, points: { ...c.points, [sc]: cur.includes(pid) ? cur.filter((p) => p !== pid) : [...cur, pid] } };
  });

  const selRec = (sc) => {
    const pts = getPts(sc).filter((p) => p.rec).map((p) => p.id);
    setCfg((c) => ({ ...c, points: { ...c.points, [sc]: pts } }));
  };

  const doComplete = () => {
    const ms = cfg.scenes.map((sc, i) => ({
      id: Date.now() + i, name: `${sc}预警模型`, plant: "A厂",
      turb: selTpl ? (selTpl.id === "sg42" ? "A01~A12" : selTpl.id === "my166" ? "B01~B08" : "C01~C06") : "A01~A12",
      type: selTpl ? selTpl.name : "SG4.2-145", status: "training", algo: "AutoML",
      p: null, r: null, f1: null, fa: null, iter: 0, pts: (cfg.points[sc] || []).length,
      sc: sc, progress: 5, ptCfg: [],
    }));
    onComplete(ms);
  };

  return (
    <div>
      <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 22, cursor: "pointer", color: TH.t3 }}>
        <Ic name="chevL" size={15} /><span style={{ fontSize: 11.5 }}>返回模型列表</span>
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 26 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, fontFamily: TH.mn,
                background: i < step ? TH.ac : i === step ? TH.acD : "transparent",
                color: i < step ? "#000" : i === step ? TH.ac : TH.t3,
                border: `2px solid ${i <= step ? TH.ac : TH.b1}`,
              }}>
                {i < step ? <Ic name="check" size={11} /> : i + 1}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: i === step ? 600 : 400, color: i <= step ? TH.tx : TH.t3 }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, margin: "0 8px", background: i < step ? TH.ac : TH.b1 }} />}
          </div>
        ))}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>选择机型</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 22 }}>
            {TPLS.map((t) => (
              <div key={t.id} onClick={() => setCfg((c) => ({ ...c, turbine: t.id, scenes: [], points: {} }))}
                style={{ padding: 14, borderRadius: 12, cursor: "pointer", border: `2px solid ${cfg.turbine === t.id ? TH.ac : TH.b1}`, background: cfg.turbine === t.id ? TH.acD : TH.s1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <Ic name="wind" size={14} />
                  <span style={{ fontWeight: 600, fontSize: 12, color: TH.tx }}>{t.name}</span>
                </div>
                <div style={{ fontSize: 10, color: TH.t3 }}>{t.scenes.length} 故障场景</div>
              </div>
            ))}
          </div>
          {selTpl && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>选择监测场景</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
                {selTpl.scenes.map((sc) => {
                  const sel = cfg.scenes.includes(sc);
                  return (
                    <div key={sc} onClick={() => togScene(sc)}
                      style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${sel ? TH.ac : TH.b1}`, background: sel ? TH.acD : "transparent", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11.5, fontWeight: sel ? 600 : 400, color: sel ? TH.tx : TH.t2 }}>{sc}</span>
                      {sel && <Ic name="check" size={13} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div>
          {cfg.scenes.map((sc) => {
            const pts = getPts(sc);
            const sel = cfg.points[sc] || [];
            return (
              <div key={sc} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TH.tx }}>{sc} <span style={{ fontSize: 10, color: TH.t3, fontFamily: TH.mn }}>({sel.length}/{pts.length})</span></span>
                  <Btn small icon="zap" onClick={() => selRec(sc)}>一键推荐</Btn>
                </div>
                <div style={{ background: TH.s1, borderRadius: 8, border: `1px solid ${TH.b1}`, overflow: "hidden" }}>
                  {pts.map((pt) => {
                    const isOn = sel.includes(pt.id);
                    return (
                      <div key={pt.id} onClick={() => togPt(sc, pt.id)}
                        style={{ display: "grid", gridTemplateColumns: "20px 1fr 50px 36px 80px", padding: "7px 12px", borderBottom: `1px solid ${TH.b1}`, alignItems: "center", cursor: "pointer", background: isOn ? TH.acD : "transparent" }}>
                        <div style={{ width: 13, height: 13, borderRadius: 3, border: `2px solid ${isOn ? TH.ac : TH.b2}`, background: isOn ? TH.ac : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isOn && <Ic name="check" size={8} />}
                        </div>
                        <div>
                          <span style={{ fontSize: 11.5, color: TH.tx }}>{pt.nm}</span>
                          {pt.rec && <span style={{ color: TH.ac, marginLeft: 3, fontSize: 9 }}>★</span>}
                          <div style={{ fontSize: 9, color: TH.t3, fontFamily: TH.mn }}>{pt.tag}</div>
                        </div>
                        <span style={{ fontSize: 10, color: TH.t3, fontFamily: TH.mn }}>{pt.u}</span>
                        <span style={{ fontSize: 9, color: TH.t3, fontFamily: TH.mn, textAlign: "center" }}>{Math.round(pt.imp * 100)}</span>
                        <div style={{ height: 4, background: TH.b1, borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pt.imp * 100}%`, borderRadius: 2, background: pt.imp > 0.85 ? TH.ac : pt.imp > 0.7 ? TH.bl : TH.t3 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>训练样本</h3>
            <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 14 }}>
              {[{ k: "auto", l: "全自动选样", d: "自动识别正常工况段" }, { k: "semi", l: "半自动选样", d: "系统推荐+人工确认" }, { k: "manual", l: "手动指定", d: "手动设定时间范围" }].map((s) => (
                <div key={s.k} onClick={() => setCfg((c) => ({ ...c, sampleStrategy: s.k }))}
                  style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 5, cursor: "pointer", border: `1px solid ${cfg.sampleStrategy === s.k ? TH.ac : TH.b1}`, background: cfg.sampleStrategy === s.k ? TH.acD : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${cfg.sampleStrategy === s.k ? TH.ac : TH.b2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {cfg.sampleStrategy === s.k && <div style={{ width: 6, height: 6, borderRadius: "50%", background: TH.ac }} />}
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: TH.tx }}>{s.l}</span>
                  </div>
                  <div style={{ fontSize: 10, color: TH.t3, marginLeft: 20, marginTop: 1 }}>{s.d}</div>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 10, color: TH.t3 }}>回溯范围</label>
                <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
                  {[3, 6, 12, 24].map((m) => (
                    <button key={m} onClick={() => setCfg((c) => ({ ...c, sampleMonths: m }))}
                      style={{ padding: "4px 12px", borderRadius: 5, border: `1px solid ${cfg.sampleMonths === m ? TH.ac : TH.b1}`, background: cfg.sampleMonths === m ? TH.acD : "transparent", color: cfg.sampleMonths === m ? TH.ac : TH.t2, fontSize: 11, fontFamily: TH.mn, cursor: "pointer" }}>{m}月</button>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 7 }}>
                <Toggle on={cfg.excludeFaults} onToggle={() => setCfg((c) => ({ ...c, excludeFaults: !c.excludeFaults }))} />
                <span style={{ fontSize: 11, color: TH.tx }}>排除故障工单时段</span>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>算法池</h3>
            <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                <Toggle on={true} onToggle={() => {}} />
                <span style={{ fontSize: 11, color: TH.tx }}>AutoML 多算法竞赛</span>
              </div>
              {ALGOS.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${TH.b1}` }}>
                  <div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: TH.tx, fontFamily: TH.mn }}>{a.name}</span>
                    <span style={{ fontSize: 9, color: TH.ac, marginLeft: 5 }}>{a.type}</span>
                    <div style={{ fontSize: 9, color: TH.t3 }}>{a.desc}</div>
                  </div>
                  {a.best.length > 0 && (
                    <div style={{ display: "flex", gap: 2 }}>
                      {a.best.map((b) => <span key={b} style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: TH.acD, color: TH.ac }}>{b}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>优化目标</h3>
            {[{ k: "recall", l: "召回优先", d: "宁可多报不漏报", ic: "alert" }, { k: "precision", l: "精确优先", d: "减少误报", ic: "target" }, { k: "balanced", l: "均衡模式", d: "F1最大化", ic: "activity" }].map((o) => (
              <div key={o.k} onClick={() => setCfg((c) => ({ ...c, optimizeTarget: o.k }))}
                style={{ padding: "11px 12px", borderRadius: 8, marginBottom: 7, cursor: "pointer", border: `1px solid ${cfg.optimizeTarget === o.k ? TH.ac : TH.b1}`, background: cfg.optimizeTarget === o.k ? TH.acD : "transparent", display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ color: cfg.optimizeTarget === o.k ? TH.ac : TH.t3 }}><Ic name={o.ic} size={16} /></div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TH.tx }}>{o.l}</div>
                  <div style={{ fontSize: 10, color: TH.t3 }}>{o.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>迭代与自动化</h3>
            <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 14 }}>
              <label style={{ fontSize: 10, color: TH.t3 }}>最大迭代</label>
              <div style={{ display: "flex", gap: 5, marginTop: 4, marginBottom: 14 }}>
                {[5, 10, 20, 50].map((n) => (
                  <button key={n} onClick={() => setCfg((c) => ({ ...c, maxIter: n }))}
                    style={{ padding: "4px 12px", borderRadius: 5, border: `1px solid ${cfg.maxIter === n ? TH.ac : TH.b1}`, background: cfg.maxIter === n ? TH.acD : "transparent", color: cfg.maxIter === n ? TH.ac : TH.t2, fontSize: 11, fontFamily: TH.mn, cursor: "pointer" }}>{n}</button>
                ))}
              </div>
              {[{ k: "autoThreshold", l: "自动设置阈值(P1/P99)" }, { k: "autoSuppress", l: "自动配置抑制规则" }, { k: "autoAlgoSwitch", l: "不达标自动切换算法" }].map((o) => (
                <div key={o.k} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <Toggle on={cfg[o.k]} onToggle={() => setCfg((c) => ({ ...c, [o.k]: !c[o.k] }))} />
                  <span style={{ fontSize: 10.5, color: TH.tx }}>{o.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>确认配置</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 14 }}>
              {[["机型", selTpl ? selTpl.name : ""], ["场景", cfg.scenes.join("、")], ["选样", { auto: "全自动", semi: "半自动", manual: "手动" }[cfg.sampleStrategy]], ["回溯", cfg.sampleMonths + "月"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${TH.b1}` }}>
                  <span style={{ fontSize: 10, color: TH.t3 }}>{k}</span>
                  <span style={{ fontSize: 11, color: TH.tx, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 14 }}>
              {[["目标", { recall: "召回优先", precision: "精确优先", balanced: "均衡" }[cfg.optimizeTarget]], ["迭代", cfg.maxIter + "轮"], ["算法", "AutoML"], ["阈值", "自动(P1/P99)"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${TH.b1}` }}>
                  <span style={{ fontSize: 10, color: TH.t3 }}>{k}</span>
                  <span style={{ fontSize: 11, color: TH.tx, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 8, background: TH.acD, border: `1px solid ${TH.ac}20`, display: "flex", alignItems: "center", gap: 8 }}>
            <Ic name="info" size={14} />
            <span style={{ fontSize: 11, color: TH.t2 }}>
              {"将创建 "}<strong style={{ color: TH.ac }}>{cfg.scenes.length}</strong>{" 个模型"}
            </span>
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, paddingTop: 14, borderTop: `1px solid ${TH.b1}` }}>
        <Btn onClick={() => step > 0 ? setStep(step - 1) : onBack()} icon="chevL">{step > 0 ? "上一步" : "取消"}</Btn>
        <Btn primary disabled={!canNext} onClick={() => step < 4 ? setStep(step + 1) : doComplete()} icon={step === 4 ? "zap" : "chevR"}>
          {step === 4 ? "启动自动建模" : "下一步"}
        </Btn>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DETAIL PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ITER_HISTORY = [
  { r: 1, p: 72.1, rc: 68.5, f: 70.2, fa: 18.3, act: "初始训练" },
  { r: 2, p: 81.4, rc: 79.2, f: 80.3, fa: 11.2, act: "扩充低风速样本" },
  { r: 3, p: 88.6, rc: 85.1, f: 86.8, fa: 6.8, act: "剔除噪声测点" },
  { r: 4, p: 94.2, rc: 91.8, f: 93.0, fa: 3.1, act: "优化阈值+抑制规则" },
];

function Detail({ model, onBack, onUpdate }) {
  const [tab, setTab] = useState("iter");
  const [editPt, setEditPt] = useState(null);
  const [editVals, setEditVals] = useState({});

  const ptCfg = (model.ptCfg && model.ptCfg.length > 0) ? model.ptCfg : DEFAULT_PT_CFG;

  const startEdit = (i) => { setEditPt(i); setEditVals({ hi: ptCfg[i].hi, lo: ptCfg[i].lo, lv: ptCfg[i].lv, sup: ptCfg[i].sup }); };
  const saveEdit = () => { const u = [...ptCfg]; u[editPt] = { ...u[editPt], ...editVals }; if (onUpdate) onUpdate({ ...model, ptCfg: u }); setEditPt(null); };
  const toggleLock = (i) => { const u = [...ptCfg]; u[i] = { ...u[i], lock: !u[i].lock }; if (onUpdate) onUpdate({ ...model, ptCfg: u }); };

  return (
    <div>
      <div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16, cursor: "pointer", color: TH.t3 }}>
        <Ic name="chevL" size={15} /><span style={{ fontSize: 11 }}>返回</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: TH.tx, margin: 0 }}>{model.name}</h2>
            <Badge status={model.status} />
          </div>
          <div style={{ display: "flex", gap: 10, fontSize: 10, color: TH.t3 }}>
            <span>{model.plant}</span><span>{model.type}</span><span>{model.algo}</span><span>{"迭代" + model.iter + "轮"}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {model.status === "review" && <Btn small primary icon="check" onClick={() => onUpdate && onUpdate({ ...model, status: "completed" })}>审核通过</Btn>}
          {model.status === "failed" && <Btn small primary icon="refresh" onClick={() => onUpdate && onUpdate({ ...model, status: "training", progress: 10 })}>重新优化</Btn>}
          <Btn small icon="file">导出</Btn>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 16 }}>
        {[
          ["准确率", model.p, "%", TH.ac],
          ["召回率", model.r, "%", TH.bl],
          ["F1", model.f1, "%", TH.gn],
          ["误报率", model.fa, "%", (model.fa !== null && model.fa <= 5) ? TH.gn : TH.rd],
          ["迭代", model.iter, "轮", TH.tx],
        ].map(([l, v, u, c]) => (
          <div key={String(l)} style={{ padding: "11px 12px", background: TH.s1, borderRadius: 8, border: `1px solid ${TH.b1}` }}>
            <div style={{ fontSize: 9, color: TH.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
            <span style={{ fontSize: 19, fontWeight: 700, color: v !== null ? c : TH.t3, fontFamily: TH.mn }}>{v !== null ? v : "—"}</span>
            <span style={{ fontSize: 9, color: TH.t3, marginLeft: 2 }}>{u}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${TH.b1}`, marginBottom: 12 }}>
        {[{ k: "iter", l: "迭代记录" }, { k: "pts", l: "测点参数" }, { k: "diag", l: "自动诊断" }].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            style={{ padding: "6px 12px", border: "none", fontSize: 11, fontWeight: 500, cursor: "pointer", color: tab === t.k ? TH.ac : TH.t3, background: "transparent", borderBottom: `2px solid ${tab === t.k ? TH.ac : "transparent"}` }}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Iter tab */}
      {tab === "iter" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>指标趋势</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
              {ITER_HISTORY.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 120, width: "100%" }}>
                    {[[h.p, TH.ac], [h.rc, TH.bl], [h.f, TH.gn]].map(([v, c], bi) => (
                      <div key={bi} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                        <div style={{ fontSize: 7, color: TH.t3, fontFamily: TH.mn, marginBottom: 1 }}>{v}</div>
                        <div style={{ width: "100%", height: `${(v / 100) * 110}px`, background: c, borderRadius: "2px 2px 0 0", opacity: 0.8 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: TH.t2, fontFamily: TH.mn }}>{"R" + h.r}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: TH.tx, marginBottom: 12 }}>操作日志</div>
            {ITER_HISTORY.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < ITER_HISTORY.length - 1 ? 12 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i === ITER_HISTORY.length - 1 ? TH.acD : TH.hov, border: `2px solid ${i === ITER_HISTORY.length - 1 ? TH.ac : TH.b1}`, fontSize: 9, fontWeight: 700, color: i === ITER_HISTORY.length - 1 ? TH.ac : TH.t3, fontFamily: TH.mn }}>{h.r}</div>
                  {i < ITER_HISTORY.length - 1 && <div style={{ width: 2, flex: 1, background: TH.b1, marginTop: 2 }} />}
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: TH.tx }}>{h.act}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    {[["P", h.p, TH.ac], ["R", h.rc, TH.bl], ["FA", h.fa, h.fa <= 5 ? TH.gn : TH.rd]].map(([l2, v2, c2]) => (
                      <span key={l2} style={{ fontSize: 9, color: c2, fontFamily: TH.mn }}>{l2 + ":" + v2 + "%"}</span>
                    ))}
                  </div>
                  {i > 0 && <div style={{ fontSize: 9, color: TH.gn, marginTop: 1 }}>{"F1 +" + (h.f - ITER_HISTORY[i - 1].f).toFixed(1) + "%"}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pts tab */}
      {tab === "pts" && (
        <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 65px 65px 65px 1fr 45px 55px", padding: "7px 14px", borderBottom: `1px solid ${TH.b1}`, fontSize: 9, color: TH.t3, textTransform: "uppercase", letterSpacing: 1 }}>
            <span>测点</span><span>TAG</span><span style={{ textAlign: "center" }}>上限</span><span style={{ textAlign: "center" }}>下限</span><span style={{ textAlign: "center" }}>级别</span><span>抑制规则</span><span style={{ textAlign: "center" }}>锁定</span><span></span>
          </div>
          {ptCfg.map((p, i) => (
            <div key={i}>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 65px 65px 65px 1fr 45px 55px", padding: "9px 14px", borderBottom: `1px solid ${TH.b1}`, alignItems: "center", fontSize: 11.5, background: editPt === i ? TH.acD : "transparent" }}>
                <span style={{ color: TH.tx, fontWeight: 500 }}>{p.nm}</span>
                <span style={{ fontSize: 9, color: TH.ac, fontFamily: TH.mn }}>{p.tag}</span>
                <span style={{ textAlign: "center", fontFamily: TH.mn, color: TH.tx }}>{p.hi}</span>
                <span style={{ textAlign: "center", fontFamily: TH.mn, color: TH.tx }}>{p.lo}</span>
                <span style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, fontWeight: 600, color: LV_COLORS[p.lv] || TH.t3, background: (LV_COLORS[p.lv] || TH.t3) + "12" }}>{p.lv}</span>
                </span>
                <span style={{ fontSize: 9, color: TH.t2 }}>{p.sup}</span>
                <div style={{ textAlign: "center", cursor: "pointer", color: p.lock ? TH.ac : TH.t3 }} onClick={() => toggleLock(i)}>
                  <Ic name={p.lock ? "lock" : "unlock"} size={12} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <Btn small ghost onClick={() => editPt === i ? setEditPt(null) : startEdit(i)} icon={editPt === i ? "x" : "edit3"}>
                    {editPt === i ? "收起" : "编辑"}
                  </Btn>
                </div>
              </div>

              {editPt === i && (
                <div style={{ padding: "10px 14px 12px", borderBottom: `1px solid ${TH.b1}`, background: "rgba(0,212,255,.04)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 9, color: TH.t3, display: "block", marginBottom: 2 }}>上限阈值</label>
                      <input value={editVals.hi} onChange={(e) => setEditVals((v) => ({ ...v, hi: e.target.value }))}
                        style={{ width: "100%", padding: "5px 8px", background: TH.bg, border: `1px solid ${TH.b2}`, borderRadius: 8, color: TH.tx, fontSize: 11, fontFamily: TH.mn, outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 9, color: TH.t3, display: "block", marginBottom: 2 }}>下限阈值</label>
                      <input value={editVals.lo} onChange={(e) => setEditVals((v) => ({ ...v, lo: e.target.value }))}
                        style={{ width: "100%", padding: "5px 8px", background: TH.bg, border: `1px solid ${TH.b2}`, borderRadius: 8, color: TH.tx, fontSize: 11, fontFamily: TH.mn, outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 9, color: TH.t3, display: "block", marginBottom: 2 }}>报警级别</label>
                      <div style={{ display: "flex", gap: 3 }}>
                        {["严重", "警告", "注意", "参考"].map((lv) => (
                          <button key={lv} onClick={() => setEditVals((v) => ({ ...v, lv }))}
                            style={{ flex: 1, padding: "4px 0", borderRadius: 3, border: `1px solid ${editVals.lv === lv ? (LV_COLORS[lv] || TH.t3) : TH.b1}`, background: editVals.lv === lv ? (LV_COLORS[lv] || TH.t3) + "12" : "transparent", color: editVals.lv === lv ? (LV_COLORS[lv] || TH.t3) : TH.t3, fontSize: 8, cursor: "pointer" }}>
                            {lv}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 9, color: TH.t3, display: "block", marginBottom: 2 }}>抑制规则</label>
                      <input value={editVals.sup} onChange={(e) => setEditVals((v) => ({ ...v, sup: e.target.value }))}
                        style={{ width: "100%", padding: "5px 8px", background: TH.bg, border: `1px solid ${TH.b2}`, borderRadius: 8, color: TH.tx, fontSize: 11, outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 5, marginTop: 8 }}>
                    <Btn small onClick={() => setEditPt(null)}>取消</Btn>
                    <Btn small primary icon="check" onClick={saveEdit}>保存</Btn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Diag tab */}
      {tab === "diag" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 16 }}>
            <div style={{ padding: "8px 10px", borderRadius: 8, background: TH.gnD, border: `1px solid ${TH.gn}20`, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TH.gn }}>{"✓ 模型已达标"}</div>
              <div style={{ fontSize: 10, color: TH.t2, marginTop: 1 }}>{"F1 93.0%≥90% | 误报率 3.1%≤5%"}</div>
            </div>
            <div style={{ fontSize: 10.5, color: TH.t2, lineHeight: 1.8 }}>
              {"本轮优化："}<br />
              {"• 贝叶斯优化油温阈值 70→72°C"}<br />
              {"• 抑制规则：连续3次/5min窗口"}<br />
              {"• 85%误报来自启停机，已增补样本"}<br />
              {"• 剔除低重要性测点 GBX_FLT_DP"}
            </div>
          </div>
          <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: TH.tx, marginBottom: 10 }}>误报分布</div>
            {[["启停机", 85, TH.rd], ["极端风速", 10, TH.yl], ["传感器异常", 5, TH.bl]].map(([l, v, c]) => (
              <div key={String(l)} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 2 }}>
                  <span style={{ color: TH.t2 }}>{l}</span>
                  <span style={{ color: TH.tx, fontFamily: TH.mn }}>{v + "%"}</span>
                </div>
                <Prog value={Number(v)} color={String(c)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI ASSISTANT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AI_CATS = [
  { l: "批量建模", ic: "zap", desc: "创建预警模型", c: TH.gn },
  { l: "模型优化", ic: "gear", desc: "优化模型性能", c: TH.yl },
  { l: "状态查询", ic: "gauge", desc: "查看运行状态", c: TH.bl },
  { l: "参数调整", ic: "sliders", desc: "修改阈值规则", c: TH.pr },
];

function parseAiCmd(text, models) {
  const t = text.toLowerCase();
  const cm = t.match(/(?:创建|建立|新建|帮我.{0,8}(?:创建|建立|做|建)).*?(a厂|b厂|c厂).*?(?:所有|全部|每台|全场)?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)/);
  if (cm) {
    const pl = cm[1].charAt(0).toUpperCase() + "厂";
    const pi = PLANTS[pl];
    return {
      intent: "create", original: text,
      entities: { plant: pl, scene: cm[2], turbineType: pi ? pi.type : "SG4.2-145", turbineRange: pi ? (pi.turbines[0] + "~" + pi.turbines[pi.turbines.length - 1]) : "", count: pi ? pi.turbines.length : 0 },
    };
  }
  const om = t.match(/(?:优化|改进|调整|提升|改善).*?([abc]\d{1,3})?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)?/i);
  if (om && (om[1] || om[2])) {
    const turb = om[1] ? om[1].toUpperCase() : "";
    const sc = om[2] || "齿轮箱";
    const pl = turb ? (turb.startsWith("A") ? "A厂" : turb.startsWith("B") ? "B厂" : "C厂") : "A厂";
    const m = models.find((x) => x.plant === pl && x.sc === sc);
    return {
      intent: "optimize", original: text,
      entities: { plant: pl, turbine: turb || "全部", scene: sc, modelName: m ? m.name : sc + "预警模型" },
      model: m,
    };
  }
  const sm = t.match(/(?:状态|情况|概况|查看|汇报|报告|怎么样|运行)/);
  if (sm) {
    const pm = t.match(/(a厂|b厂|c厂)/);
    const pl = pm ? (pm[1].charAt(0).toUpperCase() + "厂") : "A厂";
    return { intent: "status", original: text, entities: { plant: pl, modelCount: models.filter((x) => x.plant === pl).length } };
  }
  return null;
}

function AiPanel({ expanded, onToggle, onNav, models }) {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "你好！我是 AI 建模助手。\n\n输入自然语言指令，我会先理解你的意图并确认后再执行。\n\n试试描述你想做什么。" },
  ]);
  const [input, setInput] = useState("");
  const [rec, setRec] = useState(false);
  const [phase, setPhase] = useState(null);
  const [voiceTxt, setVoiceTxt] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, phase]);

  const addMsg = (msg) => setMsgs((p) => [...p, msg]);

  const processInput = (text) => {
    if (!text.trim()) return;
    addMsg({ role: "user", text: text.trim() });
    setInput("");
    setPhase("thinking");

    setTimeout(() => {
      setPhase("parsing");
      const parsed = parseAiCmd(text, models);
      setTimeout(() => {
        setPhase(null);
        if (!parsed) {
          addMsg({ role: "ai", text: "抱歉，未能完全理解你的意图。可以换一种方式描述吗？\n\n例如：\n• \"帮我创建A厂全部风机的齿轮箱模型\"\n• \"优化B03的叶片检测模型\"\n• \"查看B厂的模型运行状态\"" });
          return;
        }
        addMsg({ role: "ai", text: "我对你的指令进行了语义分析：", card: { type: "parse", parsed: parsed } });
      }, 600);
    }, 800);
  };

  const confirmParse = (parsed) => {
    addMsg({ role: "user", text: "✓ 确认，请继续" });
    setPhase("thinking");
    setTimeout(() => {
      setPhase(null);
      if (parsed.intent === "create") {
        const pi = PLANTS[parsed.entities.plant];
        addMsg({ role: "ai", text: "已生成建模计划：", card: { type: "plan", data: parsed.entities } });
      } else if (parsed.intent === "optimize") {
        addMsg({ role: "ai", text: "已定位模型，优化方案如下：", card: { type: "opt", data: parsed } });
      } else if (parsed.intent === "status") {
        const list = models.filter((x) => x.plant === parsed.entities.plant);
        addMsg({ role: "ai", text: parsed.entities.plant + "模型概况：", card: { type: "status", data: { plant: parsed.entities.plant, list: list } } });
      }
    }, 600);
  };

  const rejectParse = () => {
    addMsg({ role: "user", text: "理解有误，我重新描述" });
    addMsg({ role: "ai", text: "好的，请重新描述你的需求。" });
  };

  const simVoice = () => {
    setRec(true); setVoiceTxt("");
    const phrases = ["请帮我", "请帮我创建", "请帮我创建A厂", "请帮我创建A厂所有风机的", "请帮我创建A厂所有风机的齿轮箱模型"];
    let i = 0;
    const iv = setInterval(() => {
      if (i < phrases.length) { setVoiceTxt(phrases[i]); i++; }
      else { clearInterval(iv); setTimeout(() => { setRec(false); setVoiceTxt(""); processInput(phrases[phrases.length - 1]); }, 500); }
    }, 450);
  };

  // ─── Sub-cards ────────────────────────────
  function ParseCard({ parsed }) {
    const intentLabels = { create: { l: "批量创建模型", c: TH.gn, ic: "zap" }, optimize: { l: "模型优化", c: TH.yl, ic: "gear" }, status: { l: "状态查询", c: TH.bl, ic: "gauge" } };
    const info = intentLabels[parsed.intent] || { l: "未知", c: TH.t3, ic: "info" };
    const entLabels = { plant: "目标风场", scene: "故障场景", turbineType: "机型", turbineRange: "风机范围", count: "风机数量", turbine: "目标风机", modelName: "目标模型", modelCount: "模型数量" };
    return (
      <div style={{ background: TH.s2, borderRadius: 12, border: `1px solid ${TH.b1}`, overflow: "hidden", marginTop: 6 }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${TH.b1}`, background: info.c + "06" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: info.c + "15", display: "flex", alignItems: "center", justifyContent: "center", color: info.c }}><Ic name="brain" size={12} /></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: TH.tx }}>语义理解结果</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, color: TH.t3 }}>识别意图：</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: info.c, padding: "2px 8px", borderRadius: 4, background: info.c + "12", display: "inline-flex", alignItems: "center", gap: 3 }}><Ic name={info.ic} size={10} />{info.l}</span>
          </div>
        </div>
        <div style={{ padding: "10px 14px" }}>
          <div style={{ fontSize: 9, color: TH.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>提取实体</div>
          {Object.entries(parsed.entities).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px solid ${TH.b1}` }}>
              <span style={{ fontSize: 10, color: TH.t3, width: 56 }}>{entLabels[k] || k}</span>
              <span style={{ fontSize: 10, color: TH.ac, fontFamily: TH.mn, fontWeight: 600, background: TH.acD, padding: "1px 6px", borderRadius: 3 }}>{String(v)}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "6px 0" }}>
            <span style={{ fontSize: 10, color: TH.t3, width: 56 }}>原始输入</span>
            <span style={{ fontSize: 10, color: TH.t2, fontStyle: "italic" }}>{'"' + parsed.original + '"'}</span>
          </div>
        </div>
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${TH.b1}`, display: "flex", justifyContent: "flex-end", gap: 6 }}>
          <Btn small icon="x" onClick={rejectParse}>重新描述</Btn>
          <Btn small primary icon="check" onClick={() => confirmParse(parsed)}>确认无误，继续</Btn>
        </div>
      </div>
    );
  }

  function PlanCard({ data }) {
    const [st, setSt] = useState("ready");
    const pi = PLANTS[data.plant];
    return (
      <div style={{ background: TH.s2, borderRadius: 12, border: `1px solid ${TH.b1}`, overflow: "hidden", marginTop: 6 }}>
        <div style={{ padding: "9px 14px", borderBottom: `1px solid ${TH.b1}` }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: TH.tx }}>{data.plant + " " + data.scene + " 建模计划"}</span>
        </div>
        <div style={{ padding: "6px 14px" }}>
          {[["风场", data.plant], ["机型", data.turbineType], ["场景", data.scene], ["风机", data.turbineRange + "（" + data.count + "台）"], ["测点", "知识图谱推荐"], ["算法", "AutoML竞赛"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", borderBottom: `1px solid ${TH.b1}` }}>
              <span style={{ fontSize: 9, color: TH.t3, width: 40 }}>{l}</span>
              <span style={{ fontSize: 10.5, color: TH.tx, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "7px 14px", borderTop: `1px solid ${TH.b1}`, display: "flex", justifyContent: "flex-end", gap: 5 }}>
          {st === "done" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 10, color: TH.gn }}>{"✓ 已启动"}</span>
              <Btn small ghost icon="ext" onClick={() => onNav("dashboard")}>查看列表</Btn>
            </div>
          ) : (
            <>
              <Btn small onClick={() => onNav("wizard")}>手动调整</Btn>
              <Btn small primary icon="zap" disabled={st === "launching"} onClick={() => {
                setSt("launching");
                setTimeout(() => {
                  const m = { id: Date.now(), name: data.scene + "预警模型", plant: data.plant, turb: data.turbineRange, type: data.turbineType, status: "training", algo: "AutoML", p: null, r: null, f1: null, fa: null, iter: 0, pts: 8, sc: data.scene, progress: 8, ptCfg: [] };
                  onNav("addModel", m);
                  setSt("done");
                }, 1000);
              }}>{st === "launching" ? "启动中..." : "确认启动"}</Btn>
            </>
          )}
        </div>
      </div>
    );
  }

  function OptCard({ data }) {
    const sugs = [
      { id: 1, act: "增加低风速训练样本", imp: "召回率+3~5%", tp: "sample", auto: true },
      { id: 2, act: "开启报警抑制优化", imp: "误报率-2~4%", tp: "threshold", auto: true },
      { id: 3, act: "切换Autoencoder算法", imp: "关联分析更优", tp: "algorithm", auto: false },
      { id: 4, act: "增加环境温补测点", imp: "季节误报改善", tp: "point", auto: true },
    ];
    const [sel, setSel] = useState(sugs.filter((s) => s.auto).map((s) => s.id));
    const [st, setSt] = useState("ready");
    const m = data.model;
    const mc = { p: m ? m.p || 87.5 : 87.5, r: m ? m.r || 78.3 : 78.3, f1: m ? m.f1 || 82.6 : 82.6, fa: m ? m.fa || 8.2 : 8.2 };
    const tpC = { sample: TH.bl, threshold: TH.yl, algorithm: TH.pr, point: TH.ac };
    const tpL = { sample: "样本", threshold: "阈值", algorithm: "算法", point: "测点" };
    return (
      <div style={{ background: TH.s2, borderRadius: 12, border: `1px solid ${TH.b1}`, overflow: "hidden", marginTop: 6 }}>
        <div style={{ padding: "9px 14px", borderBottom: `1px solid ${TH.b1}` }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: TH.tx }}>{data.entities.plant + " " + data.entities.turbine + " " + data.entities.scene}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {[["准确率", mc.p, TH.ac], ["召回率", mc.r, TH.bl], ["F1", mc.f1, TH.gn], ["误报率", mc.fa, mc.fa > 5 ? TH.rd : TH.gn]].map(([l, v, c]) => (
              <div key={String(l)} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 8, color: TH.t3 }}>{l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: TH.mn }}>{v + "%"}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "6px 14px" }}>
          {sugs.map((s) => {
            const on = sel.includes(s.id);
            const tc = tpC[s.tp] || TH.t3;
            return (
              <div key={s.id} onClick={() => st === "ready" && setSel((v) => v.includes(s.id) ? v.filter((x) => x !== s.id) : [...v, s.id])}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", borderRadius: 8, marginBottom: 3, cursor: st === "ready" ? "pointer" : "default", border: `1px solid ${on ? tc + "30" : TH.b1}`, background: on ? tc + "06" : "transparent" }}>
                <div style={{ width: 13, height: 13, borderRadius: 3, border: `2px solid ${on ? tc : TH.b2}`, background: on ? tc : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {on && <Ic name="check" size={7} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, color: TH.tx }}>{s.act}</div>
                  <div style={{ fontSize: 9, color: tc }}>{s.imp}</div>
                </div>
                <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: tc + "10", color: tc }}>{tpL[s.tp]}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "7px 14px", borderTop: `1px solid ${TH.b1}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: TH.t3 }}>{"已选" + sel.length + "项"}</span>
          {st === "done" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 10, color: TH.gn }}>{"✓ 已提交"}</span>
              {m && <Btn small ghost icon="ext" onClick={() => onNav("detail", m)}>查看详情</Btn>}
            </div>
          ) : (
            <Btn small primary icon="play" disabled={sel.length === 0 || st === "launching"} onClick={() => {
              setSt("launching");
              setTimeout(() => {
                if (m) onNav("updateModel", { ...m, status: "optimizing", iter: (m.iter || 3) + 1 });
                setSt("done");
              }, 1000);
            }}>{st === "launching" ? "提交中..." : "执行优化"}</Btn>
          )}
        </div>
      </div>
    );
  }

  function StatusCard({ data }) {
    const list = data.list || [];
    const st = { total: list.length, done: list.filter((x) => x.status === "completed").length, run: list.filter((x) => x.status === "training" || x.status === "optimizing").length, rev: list.filter((x) => x.status === "review").length, fail: list.filter((x) => x.status === "failed").length };
    return (
      <div style={{ background: TH.s2, borderRadius: 12, border: `1px solid ${TH.b1}`, overflow: "hidden", marginTop: 6 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", borderBottom: `1px solid ${TH.b1}` }}>
          {[["总数", st.total, TH.tx], ["完成", st.done, TH.gn], ["运行", st.run, TH.bl], ["审核", st.rev, TH.pr], ["未达标", st.fail, TH.rd]].map(([l, v, c]) => (
            <div key={String(l)} style={{ padding: "8px", textAlign: "center", borderRight: `1px solid ${TH.b1}` }}>
              <div style={{ fontSize: 8, color: TH.t3 }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: TH.mn }}>{v}</div>
            </div>
          ))}
        </div>
        {list.map((m) => (
          <div key={m.id} onClick={() => onNav("detail", m)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 14px", borderBottom: `1px solid ${TH.b1}`, cursor: "pointer" }}>
            <div>
              <span style={{ fontSize: 11, color: TH.tx, fontWeight: 500 }}>{m.name}</span>
              <span style={{ fontSize: 9, color: TH.t3, marginLeft: 4, fontFamily: TH.mn }}>{m.turb}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Badge status={m.status} />
              <Ic name="ext" size={11} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Render ───────────────────────────────
  if (!expanded) {
    return (
      <div onClick={onToggle} style={{ position: "fixed", bottom: 18, right: 18, width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${TH.ac},${TH.bl})`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 4px 20px rgba(0,212,255,.2)`, zIndex: 1000 }}>
        <Ic name="sparkle" size={22} />
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", bottom: 18, right: 18, width: 430, height: "calc(100vh - 90px)", maxHeight: 700, background: TH.s1, borderRadius: 14, border: `1px solid ${TH.b1}`, boxShadow: "0 8px 40px rgba(0,0,0,.5)", display: "flex", flexDirection: "column", zIndex: 1000, overflow: "hidden", animation: "slideUp .25s ease-out" }}>
      {/* Header */}
      <div style={{ padding: "11px 14px", borderBottom: `1px solid ${TH.b1}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: TH.s2, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${TH.ac},${TH.bl})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="sparkle" size={14} /></div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: TH.tx }}>AI 建模助手</div>
            <div style={{ fontSize: 9, color: TH.ac }}>语音 / 文字 · 语义理解</div>
          </div>
        </div>
        <div onClick={onToggle} style={{ cursor: "pointer", color: TH.t3, padding: 3 }}><Ic name="x" size={15} /></div>
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{ flex: 1, overflow: "auto", padding: "10px 10px 4px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "ai" && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <div style={{ width: 15, height: 15, borderRadius: 5, background: TH.acD, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="sparkle" size={8} /></div>
                <span style={{ fontSize: 8, color: TH.t3 }}>AI</span>
              </div>
            )}
            <div style={{ maxWidth: "92%", padding: "7px 11px", borderRadius: m.role === "user" ? "9px 9px 2px 9px" : "9px 9px 9px 2px", background: m.role === "user" ? "rgba(0,212,255,.08)" : TH.s2, border: `1px solid ${m.role === "user" ? TH.ac + "15" : TH.b1}`, fontSize: 11, color: TH.tx, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
            {m.card && m.card.type === "parse" && <ParseCard parsed={m.card.parsed} />}
            {m.card && m.card.type === "plan" && <PlanCard data={m.card.data} />}
            {m.card && m.card.type === "opt" && <OptCard data={m.card.data} />}
            {m.card && m.card.type === "status" && <StatusCard data={m.card.data} />}
          </div>
        ))}
        {phase && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
              <div style={{ width: 15, height: 15, borderRadius: 5, background: TH.acD, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="sparkle" size={8} /></div>
              <span style={{ fontSize: 8, color: TH.t3 }}>AI</span>
            </div>
            <div style={{ padding: "7px 11px", borderRadius: "9px 9px 9px 2px", background: TH.s2, border: `1px solid ${TH.b1}`, display: "flex", gap: 4, alignItems: "center" }}>
              <Ic name={phase === "thinking" ? "brain" : "search2"} size={13} />
              <span style={{ fontSize: 10.5, color: phase === "parsing" ? TH.ac : TH.t2 }}>
                {phase === "thinking" ? "正在理解你的意图" : "语义解析中，提取实体..."}
              </span>
              <div style={{ display: "flex", gap: 2, marginLeft: 2 }}>
                {[0, 1, 2].map((j) => <div key={j} style={{ width: 3, height: 3, borderRadius: "50%", background: TH.ac, animation: `dotP 1s ${j * 0.15}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice overlay */}
      {rec && (
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${TH.ac}15`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, height: 28 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: 2.5, borderRadius: 2, background: TH.ac, animation: `wv .5s ${i * 0.03}s infinite alternate ease-in-out` }} />
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: TH.ac, fontWeight: 600, minHeight: 16, marginTop: 3 }}>{voiceTxt || "聆听中..."}</div>
        </div>
      )}

      {/* Category picks */}
      <div style={{ padding: "6px 10px", borderTop: `1px solid ${TH.b1}`, flexShrink: 0 }}>
        <div style={{ fontSize: 8, color: TH.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>指令分类</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
          {AI_CATS.map((cat, i) => (
            <button key={i} onClick={() => {
              const hints = { "批量建模": "帮我创建", "模型优化": "优化", "状态查询": "查看模型状态", "参数调整": "调整参数" };
              setInput(hints[cat.l] || "");
            }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "7px 4px", borderRadius: 8, border: `1px solid ${TH.b1}`, background: TH.s2, cursor: "pointer" }}>
              <div style={{ color: cat.c, opacity: 0.7 }}><Ic name={cat.ic} size={14} /></div>
              <span style={{ fontSize: 10, fontWeight: 600, color: TH.tx }}>{cat.l}</span>
              <span style={{ fontSize: 8, color: TH.t3, lineHeight: 1.2, textAlign: "center" }}>{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: "9px 10px", borderTop: `1px solid ${TH.b1}`, background: TH.s2, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={simVoice} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0, background: rec ? TH.rd : `linear-gradient(135deg,${TH.ac},${TH.bl})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic name={rec ? "pause" : "mic"} size={15} />
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: TH.bg, borderRadius: 7, border: `1px solid ${TH.b1}`, padding: "0 3px 0 10px" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") processInput(input); }}
              placeholder="用自然语言描述你想做什么..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: TH.tx, fontSize: 11.5, padding: "7px 0" }} />
            <button onClick={() => processInput(input)} style={{ width: 26, height: 26, borderRadius: 5, border: "none", background: input.trim() ? TH.ac : "transparent", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic name="send" size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selModel, setSelModel] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [models, setModels] = useState(createInitModels);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleAiNav = (act, data) => {
    if (act === "dashboard") { setPage("dashboard"); setAiOpen(false); }
    else if (act === "wizard") { setPage("wizard"); setAiOpen(false); }
    else if (act === "detail" && data) { setSelModel(data); setPage("detail"); setAiOpen(false); }
    else if (act === "addModel" && data) { setModels((p) => [data, ...p]); showToast("模型「" + data.name + "」已创建"); }
    else if (act === "updateModel" && data) { setModels((p) => p.map((m) => m.id === data.id ? data : m)); showToast("模型已更新"); }
  };

  const handleUpdate = (u) => { setModels((p) => p.map((m) => m.id === u.id ? u : m)); setSelModel(u); showToast("参数已更新"); };

  const filtered = filter === "all" ? models : models.filter((m) => m.status === filter);
  const counts = { all: models.length };
  Object.keys(STATUS_MAP).forEach((s) => { counts[s] = models.filter((m) => m.status === s).length; });

  return (
    <div style={{ minHeight: "100vh", background: TH.bg, color: TH.tx, fontFamily: TH.fn }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes dotP { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wv { 0%{height:3px} 50%{height:20px} 100%{height:5px} }
        @keyframes toastIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        button:hover { filter: brightness(1.08); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #172040; border-radius: 2px; }
        input::placeholder { color: #4a6090; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", padding: "8px 18px", borderRadius: 7, background: TH.gnD, border: `1px solid ${TH.gn}30`, color: TH.gn, fontSize: 11, fontWeight: 600, zIndex: 2000, animation: "toastIn .3s ease-out", display: "flex", alignItems: "center", gap: 5 }}>
          <Ic name="check" size={13} />{toast}
        </div>
      )}

      {/* Nav */}
      <div style={{ padding: "0 22px", height: 46, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${TH.b1}`, background: TH.s1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: `linear-gradient(135deg,${TH.ac},${TH.bl})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic name="cpu" size={13} /></div>
          <span style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: -0.5 }}>智能预警建模平台</span>
          <span style={{ fontSize: 8, padding: "2px 6px", borderRadius: 3, background: TH.acD, color: TH.ac, fontWeight: 700, letterSpacing: 1 }}>AI AUTO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, background: TH.gnD, border: `1px solid ${TH.gn}20` }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: TH.gn, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, color: TH.gn, fontWeight: 600 }}>{models.filter((m) => m.status === "training" || m.status === "optimizing").length + " 运行中"}</span>
          </div>
          <div onClick={() => setAiOpen(!aiOpen)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 5, background: aiOpen ? TH.acD : "transparent", border: `1px solid ${aiOpen ? TH.ac + "40" : TH.b1}`, cursor: "pointer" }}>
            <Ic name="sparkle" size={11} />
            <span style={{ fontSize: 10, color: aiOpen ? TH.ac : TH.t2, fontWeight: 600 }}>AI 助手</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 22px", maxWidth: aiOpen ? "calc(100% - 460px)" : 1320, transition: "max-width .3s" }}>

        {/* Dashboard */}
        {page === "dashboard" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 9, marginBottom: 18 }}>
              {[
                ["模型总数", counts.all, "layers", TH.ac, TH.acD],
                ["已完成", counts.completed || 0, "check", TH.gn, TH.gnD],
                ["运行中", (counts.training || 0) + (counts.optimizing || 0), "activity", TH.bl, TH.blD],
                ["待审核", counts.review || 0, "eye", TH.pr, TH.prD],
                ["未达标", counts.failed || 0, "alert", TH.rd, TH.rdD],
              ].map(([l, v, ic, c, bg]) => (
                <div key={String(l)} style={{ padding: "14px 12px", background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -8, right: -8, width: 44, height: 44, borderRadius: "50%", background: String(bg), opacity: 0.4 }} />
                  <div style={{ fontSize: 8, color: String(c), textTransform: "uppercase", letterSpacing: 1, marginBottom: 3, display: "flex", alignItems: "center", gap: 3 }}>
                    <Ic name={String(ic)} size={10} />{l}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: TH.tx, fontFamily: TH.mn }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 2, background: TH.s1, padding: 2, borderRadius: 8, border: `1px solid ${TH.b1}` }}>
                {[{ k: "all", l: "全部" }, { k: "training", l: "训练中" }, { k: "optimizing", l: "优化中" }, { k: "review", l: "待审核" }, { k: "completed", l: "已完成" }, { k: "failed", l: "未达标" }].map((f) => (
                  <button key={f.k} onClick={() => setFilter(f.k)}
                    style={{ padding: "3px 9px", borderRadius: 5, border: "none", fontSize: 10, fontWeight: 500, cursor: "pointer", color: filter === f.k ? TH.tx : TH.t3, background: filter === f.k ? TH.hov : "transparent" }}>
                    {f.l}{(counts[f.k] || 0) > 0 ? (" " + (counts[f.k] || 0)) : ""}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn icon="sparkle" ghost small onClick={() => setAiOpen(true)}>AI 语音建模</Btn>
                <Btn primary small icon="zap" onClick={() => setPage("wizard")}>自动建模向导</Btn>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: TH.s1, borderRadius: 12, border: `1px solid ${TH.b1}`, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr .6fr .9fr .6fr .6fr .6fr .5fr .9fr 36px", padding: "7px 14px", borderBottom: `1px solid ${TH.b1}`, fontSize: 8.5, color: TH.t3, textTransform: "uppercase", letterSpacing: 1 }}>
                <span>模型</span><span>风场</span><span>算法</span><span style={{ textAlign: "center" }}>准确率</span><span style={{ textAlign: "center" }}>召回率</span><span style={{ textAlign: "center" }}>误报率</span><span style={{ textAlign: "center" }}>迭代</span><span>状态</span><span></span>
              </div>
              {filtered.map((m) => (
                <div key={m.id} onClick={() => { setSelModel(m); setPage("detail"); }}
                  style={{ display: "grid", gridTemplateColumns: "1.8fr .6fr .9fr .6fr .6fr .6fr .5fr .9fr 36px", padding: "9px 14px", borderBottom: `1px solid ${TH.b1}`, fontSize: 11, color: TH.tx, cursor: "pointer", transition: "background .1s", alignItems: "center" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = TH.hov; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 11.5 }}>{m.name}</div>
                    <div style={{ fontSize: 9, color: TH.t3, marginTop: 1 }}>{m.sc + "·" + m.turb + "·" + m.pts + "点"}</div>
                  </div>
                  <span style={{ fontSize: 10, color: TH.t2 }}>{m.plant}</span>
                  <span style={{ fontSize: 9.5, color: TH.ac, fontFamily: TH.mn }}>{m.algo}</span>
                  <span style={{ textAlign: "center", fontFamily: TH.mn, fontSize: 10.5, color: m.p && m.p >= 90 ? TH.gn : m.p ? TH.yl : TH.t3 }}>{m.p ? m.p + "%" : "—"}</span>
                  <span style={{ textAlign: "center", fontFamily: TH.mn, fontSize: 10.5, color: m.r && m.r >= 90 ? TH.gn : m.r ? TH.yl : TH.t3 }}>{m.r ? m.r + "%" : "—"}</span>
                  <span style={{ textAlign: "center", fontFamily: TH.mn, fontSize: 10.5, color: m.fa !== null ? (m.fa <= 5 ? TH.gn : TH.rd) : TH.t3 }}>{m.fa !== null ? m.fa + "%" : "—"}</span>
                  <span style={{ textAlign: "center", fontFamily: TH.mn, fontSize: 10.5 }}>{m.iter}</span>
                  <div>
                    <Badge status={m.status} />
                    {m.progress && <div style={{ marginTop: 3 }}><Prog value={m.progress} /></div>}
                  </div>
                  <div style={{ textAlign: "right", color: TH.t3 }}><Ic name="chevR" size={12} /></div>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding: 28, textAlign: "center", color: TH.t3, fontSize: 11 }}>暂无匹配模型</div>}
            </div>
          </div>
        )}

        {/* Wizard */}
        {page === "wizard" && (
          <Wizard onBack={() => setPage("dashboard")} onComplete={(ms) => { setModels((p) => [...ms, ...p]); showToast("已创建" + ms.length + "个模型"); setPage("dashboard"); }} />
        )}

        {/* Detail */}
        {page === "detail" && selModel && (
          <Detail model={models.find((m) => m.id === selModel.id) || selModel} onBack={() => setPage("dashboard")} onUpdate={handleUpdate} />
        )}
      </div>

      {/* AI Panel */}
      <AiPanel expanded={aiOpen} onToggle={() => setAiOpen(!aiOpen)} onNav={handleAiNav} models={models} />
    </div>
  );
}
