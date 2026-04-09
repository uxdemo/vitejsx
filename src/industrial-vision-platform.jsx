import { useState, useEffect, useRef, useCallback } from "react";
import "./industrial-vision-platform.css";

// ─── Mock Data ───────────────────────────────────────────────
const SCENES = [
  { id: "leak", name: "跑冒滴漏检测", icon: "💧", target: "火电厂管道、阀门、法兰", desc: "蒸汽泄漏、液体滴漏、油渍渗出等", color: "#3b82f6" },
  { id: "blade", name: "风机叶片异常识别", icon: "🔄", target: "风力发电机叶片", desc: "裂纹、雷击损伤、前缘腐蚀、涂层脱落等", color: "#10b981" },
  { id: "rust", name: "设备锈蚀检测", icon: "🔩", target: "钢结构、管道外壁", desc: "锈蚀面积、锈蚀等级", color: "#f59e0b" },
  { id: "meter", name: "仪表读数识别", icon: "🔢", target: "压力表、温度表、液位计", desc: "当前读数、是否超限", color: "#8b5cf6" },
  { id: "safety", name: "安全着装合规检测", icon: "🦺", target: "现场作业人员", desc: "安全帽、工服、护目镜等佩戴情况", color: "#ef4444" },
];

const SEVERITY_MAP = { "严重": { color: "#ef4444", bg: "rgba(239,68,68,0.12)" }, "中等": { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" }, "轻微": { color: "#facc15", bg: "rgba(250,204,21,0.12)" }, "正常": { color: "#22c55e", bg: "rgba(34,197,94,0.12)" } };

const ANOMALY_TYPES_LEAK = ["蒸汽泄漏", "液体滴漏", "油渍渗出", "气体逸散"];

function generateMockResults(frameCount) {
  const results = [];
  for (let i = 0; i < frameCount; i++) {
    const totalSec = i * 5;
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    const isAnomaly = Math.random() < 0.35;
    const severity = isAnomaly ? ["严重", "中等", "轻微"][Math.floor(Math.random() * 3)] : "正常";
    const anomalyType = isAnomaly ? ANOMALY_TYPES_LEAK[Math.floor(Math.random() * ANOMALY_TYPES_LEAK.length)] : "—";
    const confidence = isAnomaly ? (0.55 + Math.random() * 0.44) : (0.1 + Math.random() * 0.3);
    const positions = ["画面左上方法兰接口处", "画面中部管道弯头", "画面右下方阀门底部", "画面左侧仪表盘附近", "画面中央焊接点"];
    const phenomena = [
      "法兰连接处可见白色蒸汽持续喷出，扩散范围约30cm",
      "管道弯头下方有液滴间歇性滴落，频率约2秒/滴",
      "阀门底部可见油渍渗出痕迹，面积约5cm×3cm",
      "管线接头处有轻微雾气逸散，范围较小",
      "焊缝处可见微量渗液，暂未形成明显流淌",
    ];
    results.push({
      id: i + 1, timestamp: `${h}:${m}:${s}`, frameNo: i + 1, isAnomaly, anomalyType, severity,
      position: isAnomaly ? positions[Math.floor(Math.random() * positions.length)] : "—",
      phenomenon: isAnomaly ? phenomena[Math.floor(Math.random() * phenomena.length)] : "未检测到异常",
      confidence: parseFloat(confidence.toFixed(3)),
      hue: Math.floor(Math.random() * 360),
    });
  }
  return results;
}

// ─── Subcomponents ───────────────────────────────────────────

function FrameThumbnail({ result, size = 48, onClick }) {
  const c = result.isAnomaly ? SEVERITY_MAP[result.severity]?.color || "#666" : "#2a3a2a";
  return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius: 4, overflow: "hidden", cursor: "pointer", border: `2px solid ${c}`, background: `hsl(${result.hue}, 15%, ${result.isAnomaly ? 18 : 22}%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
      <svg width={size - 8} height={size - 8} viewBox="0 0 40 40">
        <rect x="2" y="6" width="36" height="28" rx="2" fill="none" stroke="hsl(210,10%,35%)" strokeWidth="1" />
        {result.isAnomaly && <>
          <rect x={8 + Math.random() * 10} y={10 + Math.random() * 8} width={12 + Math.random() * 6} height={8 + Math.random() * 6} rx="1" fill="none" stroke={c} strokeWidth="1.5" strokeDasharray="2 1" />
          <circle cx="30" cy="10" r="3" fill={c} opacity="0.8" />
        </>}
      </svg>
    </div>
  );
}

function SeverityBadge({ severity }) {
  const s = SEVERITY_MAP[severity] || { color: "#888", bg: "rgba(136,136,136,0.1)" };
  return <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.color}22`, whiteSpace: "nowrap" }}>{severity}</span>;
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent || "var(--text)", fontFamily: "var(--mono)" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, label, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: "var(--text)" }}>{label}</span>
        <span style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color || "var(--accent)", borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// ─── Image Lightbox ──────────────────────────────────────────
function Lightbox({ result, onClose, results, onNavigate }) {
  if (!result) return null;
  const idx = results.findIndex(r => r.id === result.id);
  const s = SEVERITY_MAP[result.severity] || {};
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 14, width: "min(90vw, 860px)", maxHeight: "90vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--mono)", color: "var(--muted)", fontSize: 13 }}>帧 #{result.frameNo}</span>
            <span style={{ fontFamily: "var(--mono)", color: "var(--muted)", fontSize: 13 }}>{result.timestamp}</span>
            <SeverityBadge severity={result.severity} />
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 22, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        {/* Image area */}
        <div style={{ position: "relative", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340, padding: 24 }}>
          {/* Nav arrows */}
          {idx > 0 && <button onClick={() => onNavigate(results[idx - 1])} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, width: 40, height: 40, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>◂</button>}
          {idx < results.length - 1 && <button onClick={() => onNavigate(results[idx + 1])} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, width: 40, height: 40, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>▸</button>}
          {/* Mock image */}
          <svg width="560" height="320" viewBox="0 0 560 320" style={{ borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
            <defs>
              <linearGradient id="imgBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={`hsl(${result.hue},12%,14%)`} /><stop offset="100%" stopColor={`hsl(${result.hue},8%,10%)`} /></linearGradient>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0v20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" /></pattern>
            </defs>
            <rect width="560" height="320" fill="url(#imgBg)" />
            <rect width="560" height="320" fill="url(#grid)" />
            {/* Mock industrial scene */}
            <rect x="40" y="200" width="480" height="8" rx="4" fill="hsl(210,8%,25%)" />
            <rect x="100" y="140" width="12" height="68" rx="2" fill="hsl(210,8%,30%)" />
            <rect x="260" y="120" width="40" height="88" rx="4" fill="hsl(210,8%,22%)" stroke="hsl(210,8%,30%)" />
            <rect x="400" y="160" width="16" height="48" rx="2" fill="hsl(210,8%,28%)" />
            <text x="280" y="280" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="monospace">模拟工业场景图像 · {result.timestamp}</text>
            {result.isAnomaly && <>
              <rect x="220" y="100" width="120" height="80" rx="3" fill="none" stroke={s.color} strokeWidth="2.5" strokeDasharray="6 3" opacity="0.9" />
              <rect x="220" y="86" width="120" height="16" rx="2" fill={s.color} opacity="0.85" />
              <text x="280" y="96" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">{result.anomalyType} {(result.confidence * 100).toFixed(1)}%</text>
            </>}
          </svg>
        </div>
        {/* Detail Info */}
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", borderTop: "1px solid var(--border)" }}>
          {[
            ["异常类型", result.anomalyType],
            ["置信度", (result.confidence * 100).toFixed(1) + "%"],
            ["位置描述", result.position],
            ["严重程度", result.severity],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{v}</div>
            </div>
          ))}
          <div style={{ gridColumn: "1/-1" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>现象描述</div>
            <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{result.phenomenon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline View ───────────────────────────────────────────
function TimelineView({ results, onClickFrame }) {
  const total = results.length;
  if (!total) return null;
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10, fontWeight: 600 }}>时间轴异常分布</div>
      <div style={{ display: "flex", gap: 1, height: 28, borderRadius: 4, overflow: "hidden" }}>
        {results.map((r, i) => {
          const c = r.isAnomaly ? (SEVERITY_MAP[r.severity]?.color || "#888") : "#1a2a1a";
          return <div key={i} onClick={() => onClickFrame(r)} title={`${r.timestamp} - ${r.severity}`} style={{ flex: 1, background: c, opacity: r.isAnomaly ? 0.85 : 0.25, cursor: "pointer", transition: "opacity 0.15s", minWidth: 2 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = r.isAnomaly ? 0.85 : 0.25} />;
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>
        <span>{results[0]?.timestamp}</span>
        <span>{results[results.length - 1]?.timestamp}</span>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0); // 0=scene, 1=config, 2=progress, 3=results
  const [scene, setScene] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoMeta, setVideoMeta] = useState(null);
  const [params, setParams] = useState({ startTime: "00:00:00", endTime: "00:05:20", interval: 5, mode: "fixed", preprocess: false, threshold: 0.5 });
  const [progress, setProgress] = useState({ phase: 0, pct: [0, 0, 0], current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [filter, setFilter] = useState({ onlyAnomaly: false, severity: "all", type: "all" });
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const fileInputRef = useRef();
  const progressRef = useRef();

  // Simulate file upload
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoFile(f);
    setVideoMeta({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + " MB", duration: "05:20", resolution: "1920×1080", fps: 30, codec: "H.264" });
    setParams(p => ({ ...p, endTime: "00:05:20" }));
  };

  // Simulate analysis
  const startAnalysis = () => {
    setStep(2);
    const totalFrames = 64;
    setProgress({ phase: 0, pct: [0, 0, 0], current: 0, total: totalFrames });
    let tick = 0;
    const labels = [totalFrames, totalFrames, totalFrames];
    progressRef.current = setInterval(() => {
      tick++;
      setProgress(prev => {
        let p = { ...prev, pct: [...prev.pct] };
        if (tick <= 20) { p.pct[0] = Math.min(tick * 5, 100); p.phase = 0; p.current = Math.min(Math.round(tick / 20 * totalFrames), totalFrames); }
        else if (tick <= 55) { p.pct[0] = 100; p.pct[1] = Math.min((tick - 20) * 100 / 35, 100); p.phase = 1; p.current = Math.min(Math.round((tick - 20) / 35 * totalFrames), totalFrames); }
        else if (tick <= 65) { p.pct[0] = 100; p.pct[1] = 100; p.pct[2] = Math.min((tick - 55) * 10, 100); p.phase = 2; p.current = totalFrames; }
        else {
          clearInterval(progressRef.current);
          setResults(generateMockResults(totalFrames));
          setTimeout(() => setStep(3), 300);
        }
        p.total = totalFrames;
        return p;
      });
    }, 80);
  };

  useEffect(() => () => clearInterval(progressRef.current), []);

  // Filtering & sorting
  const filteredResults = results.filter(r => {
    if (filter.onlyAnomaly && !r.isAnomaly) return false;
    if (filter.severity !== "all" && r.severity !== filter.severity) return false;
    if (filter.type !== "all" && r.anomalyType !== filter.type) return false;
    return true;
  }).sort((a, b) => {
    if (!sortCol) return 0;
    let va = a[sortCol], vb = b[sortCol];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const pagedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);
  const anomalyCount = results.filter(r => r.isAnomaly).length;

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const overallPct = (progress.pct[0] * 0.2 + progress.pct[1] * 0.65 + progress.pct[2] * 0.15);
  const phaseLabels = ["视频抽帧", "AI 模型推理", "结果整合"];

  const sevDistribution = results.reduce((acc, r) => { if (r.isAnomaly) acc[r.severity] = (acc[r.severity] || 0) + 1; return acc; }, {});
  const typeDistribution = results.reduce((acc, r) => { if (r.isAnomaly) acc[r.anomalyType] = (acc[r.anomalyType] || 0) + 1; return acc; }, {});

  // ─── Render ──────────────────────────────────────────────
  return (
    <div style={{
      "--accent2": "#10b981",
      "--mono": "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
      "--sans": "'DM Sans', 'Noto Sans SC', system-ui, sans-serif",
      fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--text)", minHeight: "100vh", fontSize: 14, lineHeight: 1.5,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-color-base); border-radius: 99px; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
        input[type="text"], input[type="number"], select {
          background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 12px;
          border-radius: 6px; font-size: 13px; font-family: var(--mono); outline: none; transition: border-color 0.2s;
        }
        input:focus, select:focus { border-color: var(--accent); }
        button { font-family: var(--sans); }
      `}</style>

      {/* ─── Header ─── */}
      <header style={{ padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", background: "rgba(11,16,23,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>工业视觉智能识别平台</span>
          {scene && step > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12, padding: "3px 12px", borderRadius: 99, background: scene.color + "18", border: `1px solid ${scene.color}33` }}>
              <span>{scene.icon}</span>
              <span style={{ fontSize: 12, color: scene.color, fontWeight: 600 }}>{scene.name}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Step indicator */}
          {[["场景选择", 0], ["任务配置", 1], ["分析中", 2], ["分析结果", 3]].map(([label, i]) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 99, background: step >= i ? "var(--accent)" : "var(--border)", color: step >= i ? "#fff" : "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, transition: "all 0.3s" }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: step >= i ? "var(--text)" : "var(--muted)", fontWeight: step === i ? 600 : 400, display: i === 2 && step !== 2 ? "none" : undefined }}>{label}</span>
              {i < 3 && <span style={{ color: "var(--border)", margin: "0 2px" }}>›</span>}
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px 60px" }}>

        {/* ═══════ STEP 0: Scene Selection ═══════ */}
        {step === 0 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: -0.5 }}>选择识别场景</h1>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>请选择需要进行图像智能识别的工业场景，系统将加载对应的 AI 模型与分析模板。</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {SCENES.map((s, i) => (
                <div key={s.id} onClick={() => { setScene(s); setStep(1); }}
                  style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, cursor: "pointer", transition: "all 0.25s", position: "relative", overflow: "hidden", animation: `slideUp 0.4s ease ${i * 0.06}s both` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "66"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle at top right, ${s.color}12, transparent 70%)` }} />
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color + "18", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{s.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>适用：{s.target}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{s.desc}</div>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: s.color, fontWeight: 600 }}>
                    进入配置 <span style={{ fontSize: 14 }}>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ STEP 1: Config ═══════ */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setStep(0)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>← 返回</button>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>任务配置</h1>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
              {/* Left: Video Upload & Preview */}
              <div>
                {/* Upload area */}
                {!videoFile ? (
                  <div onClick={() => fileInputRef.current?.click()}
                    style={{ background: "var(--card)", border: "2px dashed var(--border)", borderRadius: 12, padding: "60px 40px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                    <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📁</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>拖拽视频文件到此处，或点击上传</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>支持 MP4 格式，最大 200MB</div>
                    <input ref={fileInputRef} type="file" accept="video/mp4" style={{ display: "none" }} onChange={handleFile} />
                  </div>
                ) : (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                    {/* Mock video player */}
                    <div style={{ background: "var(--bg)", height: 320, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <svg width="100%" height="100%" viewBox="0 0 640 320" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="sceneBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f1923" /><stop offset="100%" stopColor="#0a0f14" /></linearGradient>
                          <pattern id="scanline" width="640" height="2" patternUnits="userSpaceOnUse"><rect width="640" height="1" fill="rgba(255,255,255,0.015)" /></pattern>
                        </defs>
                        <rect width="640" height="320" fill="url(#sceneBg)" />
                        <rect width="640" height="320" fill="url(#scanline)" />
                        <rect x="60" y="200" width="520" height="10" rx="5" fill="#1a2535" />
                        <rect x="180" y="100" width="16" height="110" rx="3" fill="#1e2d3d" />
                        <rect x="280" y="80" width="80" height="130" rx="6" fill="#15202d" stroke="#1e2d3d" />
                        <rect x="440" y="140" width="20" height="70" rx="3" fill="#1a2838" />
                        <circle cx="320" cy="160" r="30" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
                        <polygon points="312,148 312,172 332,160" fill="rgba(59,130,246,0.5)" />
                        <text x="320" y="290" textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="12" fontFamily="monospace">视频预览区域</text>
                      </svg>
                      {/* Playback bar */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 16px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", display: "flex", alignItems: "center", gap: 10 }}>
                        <button style={{ background: "none", border: "none", color: "#fff", fontSize: 16, cursor: "pointer" }}>▶</button>
                        <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, position: "relative" }}>
                          <div style={{ width: "30%", height: "100%", background: "var(--accent)", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--mono)" }}>01:36 / 05:20</span>
                      </div>
                    </div>
                    {/* Video meta */}
                    <div style={{ padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: "8px 20px", borderTop: "1px solid var(--border)" }}>
                      {videoMeta && Object.entries({ "文件名": videoMeta.name, "时长": videoMeta.duration, "分辨率": videoMeta.resolution, "帧率": videoMeta.fps + " fps", "大小": videoMeta.size, "编码": videoMeta.codec }).map(([k, v]) => (
                        <div key={k} style={{ fontSize: 12 }}>
                          <span style={{ color: "var(--muted)" }}>{k}: </span>
                          <span style={{ fontFamily: "var(--mono)", fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                      <button onClick={() => { setVideoFile(null); setVideoMeta(null); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>移除视频</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Parameter Panel */}
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, position: "sticky", top: 72 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>分析参数</div>

                {/* Time range */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>分析区间</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="text" value={params.startTime} onChange={e => setParams({ ...params, startTime: e.target.value })} style={{ flex: 1, textAlign: "center" }} />
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>至</span>
                    <input type="text" value={params.endTime} onChange={e => setParams({ ...params, endTime: e.target.value })} style={{ flex: 1, textAlign: "center" }} />
                  </div>
                </div>

                {/* Interval */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>抽帧间隔（秒）</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1, 2, 5, 10].map(v => (
                      <button key={v} onClick={() => setParams({ ...params, interval: v })}
                        style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${params.interval === v ? "var(--accent)" : "var(--border)"}`, background: params.interval === v ? "var(--accent)" + "22" : "transparent", color: params.interval === v ? "var(--accent)" : "var(--muted)", fontSize: 13, fontFamily: "var(--mono)", fontWeight: 600, cursor: "pointer" }}>{v}s</button>
                    ))}
                  </div>
                </div>

                {/* Mode */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>抽帧模式</label>
                  <select value={params.mode} onChange={e => setParams({ ...params, mode: e.target.value })} style={{ width: "100%" }}>
                    <option value="fixed">固定间隔</option>
                    <option value="keyframe">关键帧（I帧）</option>
                    <option value="change">变化检测</option>
                  </select>
                </div>

                {/* Preprocess */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6, fontWeight: 600 }}>图像预处理</label>
                  <div onClick={() => setParams({ ...params, preprocess: !params.preprocess })} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{ width: 38, height: 20, borderRadius: 99, background: params.preprocess ? "var(--accent)" : "var(--border)", padding: 2, transition: "background 0.2s" }}>
                      <div style={{ width: 16, height: 16, borderRadius: 99, background: "#fff", transition: "transform 0.2s", transform: params.preprocess ? "translateX(18px)" : "translateX(0)" }} />
                    </div>
                    <span style={{ fontSize: 13, color: params.preprocess ? "var(--text)" : "var(--muted)" }}>自动增强（亮度/对比度/去雾）</span>
                  </div>
                </div>

                {/* Advanced */}
                <details style={{ marginBottom: 20 }}>
                  <summary style={{ fontSize: 12, color: "var(--muted)", cursor: "pointer", fontWeight: 600, marginBottom: 10 }}>高级参数 ▾</summary>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 4 }}>置信度阈值</label>
                    <input type="number" min="0" max="1" step="0.05" value={params.threshold} onChange={e => setParams({ ...params, threshold: parseFloat(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                </details>

                {/* Estimate */}
                <div style={{ padding: "12px 14px", background: "var(--accent)" + "0a", border: `1px solid var(--accent)22`, borderRadius: 8, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>📊 预计抽帧数量</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--mono)", marginTop: 4 }}>约 {Math.round(320 / params.interval)} 帧</div>
                </div>

                {/* Submit */}
                <button onClick={startAnalysis} disabled={!videoFile}
                  style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", background: videoFile ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "var(--border)", color: videoFile ? "#fff" : "var(--muted)", fontSize: 15, fontWeight: 700, cursor: videoFile ? "pointer" : "not-allowed", transition: "all 0.2s", letterSpacing: 0.3 }}>
                  开始分析
                </button>
                {!videoFile && <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>请先上传视频</div>}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: Progress ═══════ */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 600, margin: "60px auto" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12, animation: "pulse 2s infinite" }}>⚙️</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>正在分析中...</h1>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>系统正在处理视频，请耐心等待</p>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 28 }}>
              {/* Overall */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>总进度</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{Math.round(overallPct)}%</span>
                </div>
                <div style={{ height: 10, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${overallPct}%`, background: "linear-gradient(90deg, #3b82f6, #10b981)", borderRadius: 99, transition: "width 0.3s" }} />
                </div>
              </div>

              {/* Phases */}
              {phaseLabels.map((label, i) => (
                <ProgressBar key={i} label={`${i + 1}. ${label}`} value={progress.pct[i]}
                  color={progress.phase === i ? "var(--accent)" : progress.pct[i] >= 100 ? "var(--accent2)" : "var(--border)"} />
              ))}

              {/* Stats */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", borderTop: "1px solid var(--border)", marginTop: 8 }}>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  已处理 <span style={{ color: "var(--text)", fontFamily: "var(--mono)", fontWeight: 600 }}>{progress.current}</span> / {progress.total} 帧
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>
                  预计剩余 <span style={{ color: "var(--text)", fontFamily: "var(--mono)", fontWeight: 600 }}>{Math.max(0, Math.round((100 - overallPct) * 0.08))}s</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { clearInterval(progressRef.current); setStep(1); }}
                style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 6, padding: "8px 24px", cursor: "pointer", fontSize: 13 }}>取消分析</button>
            </div>
          </div>
        )}

        {/* ═══════ STEP 3: Results ═══════ */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>分析结果</h1>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>{scene?.name} · {videoMeta?.name}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setStep(0); setVideoFile(null); setVideoMeta(null); setResults([]); setScene(null); }}
                  style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>新建任务</button>
                <button style={{ background: "var(--accent)", border: "none", color: "#fff", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>导出报告 ↓</button>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <StatCard label="总分析帧数" value={results.length} />
              <StatCard label="异常帧数" value={anomalyCount} accent="#ef4444" />
              <StatCard label="异常检出率" value={(anomalyCount / results.length * 100).toFixed(1) + "%"} accent="#f59e0b" />
              <StatCard label="严重程度分布" value={`严${sevDistribution["严重"] || 0} / 中${sevDistribution["中等"] || 0} / 轻${sevDistribution["轻微"] || 0}`} sub={
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                  {["严重", "中等", "轻微"].map(s => {
                    const cnt = sevDistribution[s] || 0;
                    const pct = anomalyCount ? cnt / anomalyCount * 100 : 0;
                    return <div key={s} style={{ height: 4, borderRadius: 99, background: SEVERITY_MAP[s].color, flex: pct || 0.5, opacity: cnt ? 1 : 0.2, transition: "flex 0.3s" }} />;
                  })}
                </div>
              } />
            </div>

            {/* Timeline */}
            <TimelineView results={results} onClickFrame={setLightboxItem} />

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div onClick={() => setFilter({ ...filter, onlyAnomaly: !filter.onlyAnomaly })}
                style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${filter.onlyAnomaly ? "var(--accent)" : "var(--border)"}`, background: filter.onlyAnomaly ? "var(--accent)18" : "transparent", color: filter.onlyAnomaly ? "var(--accent)" : "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {filter.onlyAnomaly ? "✓ " : ""}仅异常帧
              </div>
              <select value={filter.severity} onChange={e => { setFilter({ ...filter, severity: e.target.value }); setPage(1); }} style={{ fontSize: 12, padding: "6px 10px" }}>
                <option value="all">全部严重程度</option>
                <option value="严重">严重</option>
                <option value="中等">中等</option>
                <option value="轻微">轻微</option>
              </select>
              <select value={filter.type} onChange={e => { setFilter({ ...filter, type: e.target.value }); setPage(1); }} style={{ fontSize: 12, padding: "6px 10px" }}>
                <option value="all">全部异常类型</option>
                {ANOMALY_TYPES_LEAK.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                共 <b style={{ color: "var(--text)" }}>{filteredResults.length}</b> 条结果
              </div>
            </div>

            {/* Table */}
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {[
                        { key: "frameNo", label: "序号", w: 60 },
                        { key: "timestamp", label: "时间戳", w: 90 },
                        { key: null, label: "缩略图", w: 64 },
                        { key: "isAnomaly", label: "异常", w: 60 },
                        { key: "anomalyType", label: "异常类型", w: 100 },
                        { key: "severity", label: "严重程度", w: 90 },
                        { key: null, label: "位置描述", w: 160 },
                        { key: null, label: "现象描述", w: null },
                        { key: "confidence", label: "置信度", w: 80 },
                      ].map((col, ci) => (
                        <th key={ci} onClick={() => col.key && handleSort(col.key)}
                          style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, cursor: col.key ? "pointer" : "default", userSelect: "none", whiteSpace: "nowrap", width: col.w || undefined, background: "rgba(0,0,0,0.2)" }}>
                          {col.label}{sortCol === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedResults.map((r, ri) => (
                      <tr key={r.id} style={{ borderBottom: "1px solid var(--border)", background: r.isAnomaly ? SEVERITY_MAP[r.severity].bg : "transparent", transition: "background 0.15s" }}
                        onMouseEnter={e => { if (!r.isAnomaly) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { if (!r.isAnomaly) e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{r.frameNo}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--mono)", fontSize: 12 }}>{r.timestamp}</td>
                        <td style={{ padding: "6px 12px" }}><FrameThumbnail result={r} size={42} onClick={() => setLightboxItem(r)} /></td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 99, background: r.isAnomaly ? "#ef4444" : "#22c55e", marginRight: 6 }} />
                          <span style={{ fontSize: 12 }}>{r.isAnomaly ? "是" : "否"}</span>
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 12 }}>{r.anomalyType}</td>
                        <td style={{ padding: "10px 12px" }}><SeverityBadge severity={r.severity} /></td>
                        <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--muted)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.position}</td>
                        <td style={{ padding: "10px 12px", fontSize: 12, color: "var(--muted)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.phenomenon}>{r.phenomenon}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 44, height: 4, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${r.confidence * 100}%`, background: r.confidence > 0.8 ? "#22c55e" : r.confidence > 0.5 ? "#f59e0b" : "#64748b", borderRadius: 99 }} />
                            </div>
                            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", minWidth: 38 }}>{(r.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
                  每页
                  <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1); }} style={{ fontSize: 12, padding: "4px 6px" }}>
                    {[20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  条
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                    style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid var(--border)", background: "transparent", color: page <= 1 ? "var(--border)" : "var(--text)", cursor: page <= 1 ? "default" : "pointer", fontSize: 12 }}>‹ 上一页</button>
                  <span style={{ padding: "4px 12px", fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center" }}>{page} / {totalPages || 1}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                    style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid var(--border)", background: "transparent", color: page >= totalPages ? "var(--border)" : "var(--text)", cursor: page >= totalPages ? "default" : "pointer", fontSize: 12 }}>下一页 ›</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox */}
      <Lightbox result={lightboxItem} onClose={() => setLightboxItem(null)} results={filteredResults} onNavigate={setLightboxItem} />
    </div>
  );
}
