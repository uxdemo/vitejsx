import { useState, useEffect, useRef } from "react";
import styles from "./index.modules.less";
import "./industrial-vision-platform.css";

// ─── Constants ───────────────────────────────────────────────
const SCENES = [
  { id: "leak",   name: "跑冒滴漏检测",      icon: "💧", target: "火电厂管道、阀门、法兰",  desc: "蒸汽泄漏、液体滴漏、油渍渗出等",          color: "#00c5f9" },
  { id: "blade",  name: "风机叶片异常识别",   icon: "🔄", target: "风力发电机叶片",        desc: "裂纹、雷击损伤、前缘腐蚀、涂层脱落等",     color: "#0fc38f" },
  { id: "rust",   name: "设备锈蚀检测",       icon: "🔩", target: "钢结构、管道外壁",      desc: "锈蚀面积、锈蚀等级",                       color: "#ff954d" },
  { id: "meter",  name: "仪表读数识别",       icon: "🔢", target: "压力表、温度表、液位计", desc: "当前读数、是否超限",                       color: "#722ed1" },
  { id: "safety", name: "安全着装合规检测",   icon: "🦺", target: "现场作业人员",          desc: "安全帽、工服、护目镜等佩戴情况",           color: "#ff5413" },
];

const SEVERITY_MAP = {
  "严重": { color: "#ff5413", bg: "rgba(255,84,19,0.12)" },
  "中等": { color: "#ff954d", bg: "rgba(255,149,77,0.12)" },
  "轻微": { color: "#faad14", bg: "rgba(250,173,20,0.12)" },
  "正常": { color: "#0fc38f", bg: "rgba(15,195,143,0.12)" },
};

const ANOMALY_TYPES_LEAK = ["蒸汽泄漏", "液体滴漏", "油渍渗出", "气体逸散"];

const generateMockResults = (frameCount) => {
  const positions = ["画面左上方法兰接口处", "画面中部管道弯头", "画面右下方阀门底部", "画面左侧仪表盘附近", "画面中央焊接点"];
  const phenomena = [
    "法兰连接处可见白色蒸汽持续喷出，扩散范围约30cm",
    "管道弯头下方有液滴间歇性滴落，频率约2秒/滴",
    "阀门底部可见油渍渗出痕迹，面积约5cm×3cm",
    "管线接头处有轻微雾气逸散，范围较小",
    "焊缝处可见微量渗液，暂未形成明显流淌",
  ];
  return Array.from({ length: frameCount }, (_, i) => {
    const totalSec = i * 5;
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    const isAnomaly = Math.random() < 0.35;
    const severity = isAnomaly ? ["严重", "中等", "轻微"][Math.floor(Math.random() * 3)] : "正常";
    const confidence = isAnomaly ? (0.55 + Math.random() * 0.44) : (0.1 + Math.random() * 0.3);
    return {
      id: i + 1, timestamp: `${h}:${m}:${s}`, frameNo: i + 1, isAnomaly,
      anomalyType: isAnomaly ? ANOMALY_TYPES_LEAK[Math.floor(Math.random() * ANOMALY_TYPES_LEAK.length)] : "—",
      severity,
      position: isAnomaly ? positions[Math.floor(Math.random() * positions.length)] : "—",
      phenomenon: isAnomaly ? phenomena[Math.floor(Math.random() * phenomena.length)] : "未检测到异常",
      confidence: parseFloat(confidence.toFixed(3)),
      hue: Math.floor(Math.random() * 360),
    };
  });
};

// ─── Subcomponents ───────────────────────────────────────────

const FrameThumbnail = ({ result, size = 48, onClick }) => {
  const borderColor = result.isAnomaly ? (SEVERITY_MAP[result.severity]?.color || "#666") : "#2a3a2a";
  const bg = `hsl(${result.hue}, 15%, ${result.isAnomaly ? 18 : 22}%)`;
  return (
    <div
      className={styles.frameThumbnail}
      style={{ width: size, height: size, border: `2px solid ${borderColor}`, background: bg }}
      onClick={onClick}
    >
      <svg width={size - 8} height={size - 8} viewBox="0 0 40 40">
        <rect x="2" y="6" width="36" height="28" rx="3" fill="none" stroke="hsl(210,10%,35%)" strokeWidth="1" />
        {result.isAnomaly && (
          <>
            <rect x={8 + Math.random() * 10} y={10 + Math.random() * 8} width={12 + Math.random() * 6} height={8 + Math.random() * 6} rx="3"
              fill="none" stroke={borderColor} strokeWidth="1.5" strokeDasharray="2 1" />
            <circle cx="30" cy="10" r="3" fill={borderColor} opacity="0.8" />
          </>
        )}
      </svg>
    </div>
  );
};

const SeverityBadge = ({ severity }) => {
  const s = SEVERITY_MAP[severity] || { color: "#888", bg: "rgba(136,136,136,0.1)" };
  return (
    <span className={styles.severityBadge} style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}22` }}>
      {severity}
    </span>
  );
};

const StatCard = ({ label, value, sub, accent, flex = 1 }) => (
  <div className={styles.statCard} style={{ flex }}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue} style={{ color: accent || "var(--heading-color)" }}>{value}</div>
    {sub && <div className={styles.statSub}>{sub}</div>}
  </div>
);

const ProgressBar = ({ value, label, color }) => (
  <div className={styles.progressBarWrap}>
    <div className={styles.progressBarHeader}>
      <span className={styles.progressBarLabel}>{label}</span>
      <span className={styles.progressBarPct}>{Math.round(value)}%</span>
    </div>
    <div className={styles.progressBarTrack}>
      <div className={styles.progressBarFill} style={{ width: `${value}%`, background: color || "var(--primary-color)" }} />
    </div>
  </div>
);

const Lightbox = ({ result, onClose, results, onNavigate }) => {
  if (!result) return null;
  const idx = results.findIndex(r => r.id === result.id);
  const s = SEVERITY_MAP[result.severity] || {};
  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div className={styles.lightbox} onClick={e => e.stopPropagation()}>
        <div className={styles.lightboxHeader}>
          <div className={styles.lightboxHeaderLeft}>
            <span className={styles.lightboxMeta}>帧 #{result.frameNo}</span>
            <span className={styles.lightboxMeta}>{result.timestamp}</span>
            <SeverityBadge severity={result.severity} />
          </div>
          <button className={styles.lightboxCloseBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.lightboxImageArea}>
          {idx > 0 && (
            <button className={`${styles.lightboxNavBtn} ${styles.prev}`} onClick={() => onNavigate(results[idx - 1])}>◂</button>
          )}
          {idx < results.length - 1 && (
            <button className={`${styles.lightboxNavBtn} ${styles.next}`} onClick={() => onNavigate(results[idx + 1])}>▸</button>
          )}
          <svg width="560" height="320" viewBox="0 0 560 320" style={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.06)" }}>
            <defs>
              <linearGradient id="imgBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={`hsl(${result.hue},12%,14%)`} />
                <stop offset="100%" stopColor={`hsl(${result.hue},8%,10%)`} />
              </linearGradient>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0v20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="560" height="320" fill="url(#imgBg)" />
            <rect width="560" height="320" fill="url(#grid)" />
            <rect x="40" y="200" width="480" height="8" rx="3" fill="hsl(210,8%,25%)" />
            <rect x="100" y="140" width="12" height="68" rx="3" fill="hsl(210,8%,30%)" />
            <rect x="260" y="120" width="40" height="88" rx="3" fill="hsl(210,8%,22%)" stroke="hsl(210,8%,30%)" />
            <rect x="400" y="160" width="16" height="48" rx="3" fill="hsl(210,8%,28%)" />
            <text x="280" y="280" textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize="11" fontFamily="monospace">
              模拟工业场景图像 · {result.timestamp}
            </text>
            {result.isAnomaly && (
              <>
                <rect x="220" y="100" width="120" height="80" rx="3" fill="none" stroke={s.color} strokeWidth="2.5" strokeDasharray="6 3" opacity="0.9" />
                <rect x="220" y="86" width="120" height="16" rx="3" fill={s.color} opacity="0.85" />
                <text x="280" y="96" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {result.anomalyType} {(result.confidence * 100).toFixed(1)}%
                </text>
              </>
            )}
          </svg>
        </div>
        <div className={styles.lightboxDetails}>
          {[["异常类型", result.anomalyType], ["置信度", (result.confidence * 100).toFixed(1) + "%"], ["位置描述", result.position], ["严重程度", result.severity]].map(([k, v]) => (
            <div key={k} className={styles.detailItem}>
              <div className={styles.detailKey}>{k}</div>
              <div className={styles.detailVal}>{v}</div>
            </div>
          ))}
          <div className={`${styles.detailItem} ${styles.fullWidth}`}>
            <div className={styles.detailKey}>现象描述</div>
            <div className={styles.detailVal}>{result.phenomenon}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineView = ({ results, onClickFrame }) => {
  if (!results.length) return null;
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineTitle}>时间轴异常分布</div>
      <div className={styles.timelineBar}>
        {results.map((r, i) => {
          const c = r.isAnomaly ? (SEVERITY_MAP[r.severity]?.color || "#888") : "transparent";
          return (
            <div
              key={i}
              className={styles.timelineSegment}
              style={{ background: c, opacity: r.isAnomaly ? 0.9 : 1, borderRadius: r.isAnomaly ? 5 : 0 }}
              title={`${r.timestamp} - ${r.severity}`}
              onClick={() => onClickFrame(r)}
            />
          );
        })}
      </div>
      <div className={styles.timelineFooter}>
        <span>{results[0]?.timestamp}</span>
        <span>{results[results.length - 1]?.timestamp}</span>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────
const IndustrialVisionPlatform = () => {
  const [step, setStep] = useState(0);
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

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoFile(f);
    setVideoMeta({ name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + " MB", duration: "05:20", resolution: "1920×1080", fps: 30, codec: "H.264" });
    setParams(p => ({ ...p, endTime: "00:05:20" }));
  };

  const startAnalysis = () => {
    setStep(2);
    const totalFrames = 64;
    setProgress({ phase: 0, pct: [0, 0, 0], current: 0, total: totalFrames });
    let tick = 0;
    progressRef.current = setInterval(() => {
      tick++;
      setProgress(prev => {
        const p = { ...prev, pct: [...prev.pct] };
        if (tick <= 20)      { p.pct[0] = Math.min(tick * 5, 100); p.phase = 0; p.current = Math.min(Math.round(tick / 20 * totalFrames), totalFrames); }
        else if (tick <= 55) { p.pct[0] = 100; p.pct[1] = Math.min((tick - 20) * 100 / 35, 100); p.phase = 1; p.current = Math.min(Math.round((tick - 20) / 35 * totalFrames), totalFrames); }
        else if (tick <= 65) { p.pct[0] = 100; p.pct[1] = 100; p.pct[2] = Math.min((tick - 55) * 10, 100); p.phase = 2; p.current = totalFrames; }
        else { clearInterval(progressRef.current); setResults(generateMockResults(totalFrames)); setTimeout(() => setStep(3), 300); }
        p.total = totalFrames;
        return p;
      });
    }, 80);
  };

  useEffect(() => () => clearInterval(progressRef.current), []);

  const filteredResults = results.filter(r => {
    if (filter.onlyAnomaly && !r.isAnomaly) return false;
    if (filter.severity !== "all" && r.severity !== filter.severity) return false;
    if (filter.type !== "all" && r.anomalyType !== filter.type) return false;
    return true;
  }).sort((a, b) => {
    if (!sortCol) return 0;
    const va = a[sortCol], vb = b[sortCol];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const pagedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);
  const anomalyCount = results.filter(r => r.isAnomaly).length;
  const overallPct = progress.pct[0] * 0.2 + progress.pct[1] * 0.65 + progress.pct[2] * 0.15;
  const phaseLabels = ["视频抽帧", "AI 模型推理", "结果整合"];
  const sevDistribution = results.reduce((acc, r) => { if (r.isAnomaly) acc[r.severity] = (acc[r.severity] || 0) + 1; return acc; }, {});

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const TABLE_COLS = [
    { key: "frameNo",    label: "序号",    w: 60,  sortable: true },
    { key: "timestamp",  label: "时间戳",  w: 90,  sortable: true },
    { key: null,         label: "缩略图",  w: 64,  sortable: false },
    { key: "isAnomaly",  label: "异常",    w: 60,  sortable: true },
    { key: "anomalyType",label: "异常类型",w: 100, sortable: true },
    { key: "severity",   label: "严重程度",w: 90,  sortable: true },
    { key: null,         label: "位置描述",w: 160, sortable: false },
    { key: null,         label: "现象描述",w: null, sortable: false },
    { key: "confidence", label: "置信度",  w: 80,  sortable: true },
  ];

  return (
    <div className={styles.root}>
      {/* ─── Header ─── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerLogo}>⬡</div>
          <span className={styles.headerTitle}>工业视觉智能识别平台</span>
          {scene && step > 0 && (
            <div className={styles.headerSceneBadge} style={{ background: scene.color + "18", border: `1px solid ${scene.color}33` }}>
              <span>{scene.icon}</span>
              <span className={styles.headerSceneName} style={{ color: scene.color }}>{scene.name}</span>
            </div>
          )}
        </div>
        <div className={styles.headerSteps}>
          {[["场景选择", 0], ["任务配置", 1], ["分析中", 2], ["分析结果", 3]].map(([label, i]) => (
            <div key={i} className={styles.stepItem}>
              <div
                className={styles.stepNum}
                style={{
                  background: step >= i ? "var(--primary-color)" : "var(--border-color-base)",
                  color: step >= i ? "#fff" : "var(--text-color-secondary)",
                }}
              >{i + 1}</div>
              {(i !== 2 || step === 2) && (
                <span className={styles.stepLabel} style={{ color: step >= i ? "var(--heading-color)" : "var(--text-color-secondary)", fontWeight: step === i ? 600 : 400 }}>
                  {label}
                </span>
              )}
              {i < 3 && <span className={styles.stepSep}>›</span>}
            </div>
          ))}
        </div>
      </header>

      <main className={styles.main}>

        {/* ═══════ STEP 0: Scene Selection ═══════ */}
        {step === 0 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div className={styles.sceneHeader}>
              <h1 className={styles.pageTitle}>选择识别场景</h1>
              <p className={styles.pageSubtitle}>请选择需要进行图像智能识别的工业场景，系统将加载对应的 AI 模型与分析模板。</p>
            </div>
            <div className={styles.sceneGrid}>
              {SCENES.map((s, i) => (
                <div
                  key={s.id}
                  className={styles.sceneCard}
                  style={{ '--scene-color': s.color + "66", animationDelay: `${i * 0.06}s`, animation: `slideUp 0.4s ease ${i * 0.06}s both` }}
                  onClick={() => { setScene(s); setStep(1); }}
                >
                  <div className={styles.sceneCardGlow} style={{ background: `radial-gradient(circle at top right, ${s.color}12, transparent 70%)` }} />
                  <div className={styles.sceneIcon} style={{ background: s.color + "18", border: `1px solid ${s.color}33` }}>{s.icon}</div>
                  <div className={styles.sceneName}>{s.name}</div>
                  <div className={styles.sceneTarget}>适用：{s.target}</div>
                  <div className={styles.sceneDesc}>{s.desc}</div>
                  <div className={styles.sceneAction} style={{ color: s.color }}>进入配置 <span>→</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ STEP 1: Config ═══════ */}
        {step === 1 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div className={styles.configHeader}>
              <button className={styles.btnGhost} onClick={() => setStep(0)}>← 返回</button>
              <h1 className={styles.configTitle}>任务配置</h1>
            </div>
            <div className={styles.configGrid}>
              {/* Left: Video */}
              <div>
                {!videoFile ? (
                  <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                    <div className={styles.uploadIcon}>📁</div>
                    <div className={styles.uploadTitle}>拖拽视频文件到此处，或点击上传</div>
                    <div className={styles.uploadHint}>支持 MP4 格式，最大 200MB</div>
                    <input ref={fileInputRef} type="file" accept="video/mp4" style={{ display: "none" }} onChange={handleFile} />
                  </div>
                ) : (
                  <div className={styles.videoPlayer}>
                    <div className={styles.videoPreview}>
                      <svg width="100%" height="100%" viewBox="0 0 640 320" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="sceneBg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#24282c" /><stop offset="100%" stopColor="#19191a" />
                          </linearGradient>
                        </defs>
                        <rect width="640" height="320" fill="url(#sceneBg)" />
                        <rect x="60" y="200" width="520" height="10" rx="3" fill="#1a2535" />
                        <rect x="180" y="100" width="16" height="110" rx="3" fill="#1e2d3d" />
                        <rect x="280" y="80" width="80" height="130" rx="3" fill="#15202d" stroke="#1e2d3d" />
                        <rect x="440" y="140" width="20" height="70" rx="3" fill="#1a2838" />
                        <circle cx="320" cy="160" r="30" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
                        <polygon points="312,148 312,172 332,160" fill="rgba(59,130,246,0.5)" />
                        <text x="320" y="290" textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="12" fontFamily="monospace">视频预览区域</text>
                      </svg>
                      <div className={styles.videoPlaybar}>
                        <button className={styles.playBtn}>▶</button>
                        <div className={styles.playbarTrack}><div className={styles.playbarFill} /></div>
                        <span className={styles.playbarTime}>01:36 / 05:20</span>
                      </div>
                    </div>
                    <div className={styles.videoMeta}>
                      {videoMeta && Object.entries({ "文件名": videoMeta.name, "时长": videoMeta.duration, "分辨率": videoMeta.resolution, "帧率": videoMeta.fps + " fps", "大小": videoMeta.size, "编码": videoMeta.codec }).map(([k, v]) => (
                        <div key={k} className={styles.videoMetaItem}>
                          <span className={styles.videoMetaKey}>{k}: </span>
                          <span className={styles.videoMetaVal}>{v}</span>
                        </div>
                      ))}
                      <button className={styles.removeVideoBtn} onClick={() => { setVideoFile(null); setVideoMeta(null); }}>移除视频</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Params */}
              <div className={styles.paramPanel}>
                <div className={styles.paramTitle}>分析参数</div>

                <div className={styles.paramGroup}>
                  <label className={styles.paramLabel}>分析区间</label>
                  <div className={styles.timeRange}>
                    <input className={styles.paramInput} type="text" value={params.startTime} onChange={e => setParams({ ...params, startTime: e.target.value })} />
                    <span className={styles.timeSep}>至</span>
                    <input className={styles.paramInput} type="text" value={params.endTime} onChange={e => setParams({ ...params, endTime: e.target.value })} />
                  </div>
                </div>

                <div className={styles.paramGroup}>
                  <label className={styles.paramLabel}>抽帧间隔（秒）</label>
                  <div className={styles.intervalBtns}>
                    {[1, 2, 5, 10].map(v => (
                      <button key={v} className={`${styles.intervalBtn} ${params.interval === v ? styles.active : ""}`} onClick={() => setParams({ ...params, interval: v })}>{v}s</button>
                    ))}
                  </div>
                </div>

                <div className={styles.paramGroup}>
                  <label className={styles.paramLabel}>抽帧模式</label>
                  <select className={styles.paramSelect} value={params.mode} onChange={e => setParams({ ...params, mode: e.target.value })}>
                    <option value="fixed">固定间隔</option>
                    <option value="keyframe">关键帧（I帧）</option>
                    <option value="change">变化检测</option>
                  </select>
                </div>

                <div className={styles.paramGroup}>
                  <label className={styles.paramLabel}>图像预处理</label>
                  <div className={styles.toggle} onClick={() => setParams({ ...params, preprocess: !params.preprocess })}>
                    <div className={styles.toggleTrack} style={{ background: params.preprocess ? "var(--primary-color)" : "var(--border-color-base)" }}>
                      <div className={styles.toggleThumb} style={{ transform: params.preprocess ? "translateX(18px)" : "translateX(0)" }} />
                    </div>
                    <span style={{ fontSize: 13, color: params.preprocess ? "var(--heading-color)" : "var(--text-color-secondary)" }}>
                      自动增强（亮度/对比度/去雾）
                    </span>
                  </div>
                </div>

                <details className={styles.advancedDetails}>
                  <summary className={styles.advancedSummary}>高级参数 ▾</summary>
                  <div className={styles.paramGroup}>
                    <label className={styles.paramLabel}>置信度阈值</label>
                    <input className={styles.paramInput} style={{ width: "100%" }} type="number" min="0" max="1" step="0.05"
                      value={params.threshold} onChange={e => setParams({ ...params, threshold: parseFloat(e.target.value) })} />
                  </div>
                </details>

                <div className={styles.estimateBox}>
                  <div className={styles.estimateLabel}>📊 预计抽帧数量</div>
                  <div className={styles.estimateVal}>约 {Math.round(320 / params.interval)} 帧</div>
                </div>

                <button
                  className={`${styles.submitBtn} ${videoFile ? styles.enabled : styles.disabled}`}
                  onClick={startAnalysis}
                  disabled={!videoFile}
                >
                  开始分析
                </button>
                {!videoFile && <div className={styles.submitHint}>请先上传视频</div>}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ STEP 2: Progress ═══════ */}
        {step === 2 && (
          <div className={styles.progressWrap}>
            <div className={styles.progressHero}>
              <div className={styles.progressGear}>⚙️</div>
              <h1 className={styles.progressTitle}>正在分析中...</h1>
              <p className={styles.progressSubtitle}>系统正在处理视频，请耐心等待</p>
            </div>
            <div className={styles.progressCard}>
              <div className={styles.overallRow}>
                <span className={styles.overallLabel}>总进度</span>
                <span className={styles.overallPct}>{Math.round(overallPct)}%</span>
              </div>
              <div className={styles.overallTrack}>
                <div className={styles.overallFill} style={{ width: `${overallPct}%` }} />
              </div>
              {phaseLabels.map((label, i) => (
                <ProgressBar key={i} label={`${i + 1}. ${label}`} value={progress.pct[i]}
                  color={progress.phase === i ? "var(--primary-color)" : progress.pct[i] >= 100 ? "#0fc38f" : "var(--border-color-base)"} />
              ))}
              <div className={styles.progressStats}>
                <span className={styles.progressStatItem}>
                  已处理 <span className={styles.progressStatVal}>{progress.current}</span> / {progress.total} 帧
                </span>
                <span className={styles.progressStatItem}>
                  预计剩余 <span className={styles.progressStatVal}>{Math.max(0, Math.round((100 - overallPct) * 0.08))}s</span>
                </span>
              </div>
            </div>
            <button className={styles.cancelBtn} onClick={() => { clearInterval(progressRef.current); setStep(1); }}>取消分析</button>
          </div>
        )}

        {/* ═══════ STEP 3: Results ═══════ */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsHeaderLeft}>
                <button className={styles.btnGhostMd} onClick={() => setStep(1)}>← 返回</button>
                <div>
                  <h1 className={styles.resultsTitle}>分析结果</h1>
                  <p className={styles.resultsMeta}>{scene?.name} · {videoMeta?.name}</p>
                </div>
              </div>
              <div className={styles.resultsActions}>
                <button className={styles.btnGhost} onClick={() => { setStep(0); setVideoFile(null); setVideoMeta(null); setResults([]); setScene(null); }}>新建任务</button>
                <button className={styles.btnPrimary}>导出报告 ↓</button>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              <StatCard label="总分析帧数" value={results.length} />
              <StatCard label="异常帧数" value={anomalyCount} accent="#ff5413" />
              <StatCard label="异常检出率" value={(anomalyCount / results.length * 100).toFixed(1) + "%"} accent="#ff954d" />
              <StatCard flex={2.2} label="严重程度分布"
                value={`严${sevDistribution["严重"] || 0} / 中${sevDistribution["中等"] || 0} / 轻${sevDistribution["轻微"] || 0}`}
                sub={
                  <div className={styles.sevDistBar}>
                    {["严重", "中等", "轻微"].map(sv => {
                      const cnt = sevDistribution[sv] || 0;
                      const pct = anomalyCount ? cnt / anomalyCount * 100 : 0;
                      return <div key={sv} className={styles.sevDistSegment} style={{ background: SEVERITY_MAP[sv].color, flex: pct || 0.5, opacity: cnt ? 1 : 0.2 }} />;
                    })}
                  </div>
                }
              />
            </div>

            <TimelineView results={results} onClickFrame={setLightboxItem} />

            {/* Filters */}
            <div className={styles.filterBar}>
              <button className={`${styles.filterBtn} ${filter.onlyAnomaly ? styles.active : ""}`}
                onClick={() => setFilter({ ...filter, onlyAnomaly: !filter.onlyAnomaly })}>
                {filter.onlyAnomaly ? "✓ " : ""}仅异常帧
              </button>
              <select className={styles.pageSelect} value={filter.severity} onChange={e => { setFilter({ ...filter, severity: e.target.value }); setPage(1); }}>
                <option value="all">全部严重程度</option>
                <option value="严重">严重</option>
                <option value="中等">中等</option>
                <option value="轻微">轻微</option>
              </select>
              <select className={styles.pageSelect} value={filter.type} onChange={e => { setFilter({ ...filter, type: e.target.value }); setPage(1); }}>
                <option value="all">全部异常类型</option>
                {ANOMALY_TYPES_LEAK.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className={styles.filterCount}>共 <b className={styles.filterCountVal}>{filteredResults.length}</b> 条结果</span>
            </div>

            {/* Table */}
            <div className={styles.tableWrap}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {TABLE_COLS.map((col, ci) => (
                        <th key={ci} className={`${styles.th} ${col.sortable ? styles.sortable : ""}`}
                          style={{ width: col.w || undefined }}
                          onClick={() => col.sortable && handleSort(col.key)}>
                          {col.label}{sortCol === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedResults.map((r) => (
                      <tr key={r.id} style={{ background: r.isAnomaly ? SEVERITY_MAP[r.severity].bg : "transparent" }}>
                        <td className={`${styles.td} ${styles.tdMono}`}>{r.frameNo}</td>
                        <td className={`${styles.td} ${styles.tdMonoText}`}>{r.timestamp}</td>
                        <td className={styles.td}><FrameThumbnail result={r} size={42} onClick={() => setLightboxItem(r)} /></td>
                        <td className={styles.td}>
                          <span className={styles.anomalyDot} style={{ background: r.isAnomaly ? "#ff5413" : "#0fc38f" }} />
                          <span className={styles.anomalyLabel}>{r.isAnomaly ? "是" : "否"}</span>
                        </td>
                        <td className={`${styles.td} ${styles.anomalyLabel}`}>{r.anomalyType}</td>
                        <td className={styles.td}><SeverityBadge severity={r.severity} /></td>
                        <td className={`${styles.td} ${styles.tdEllipsis}`} style={{ maxWidth: 160 }}>{r.position}</td>
                        <td className={`${styles.td} ${styles.tdEllipsis}`} style={{ maxWidth: 260 }} title={r.phenomenon}>{r.phenomenon}</td>
                        <td className={styles.td}>
                          <div className={styles.confidenceCell}>
                            <div className={styles.confidenceTrack}>
                              <div className={styles.confidenceFill} style={{
                                width: `${r.confidence * 100}%`,
                                background: r.confidence > 0.8 ? "#0fc38f" : r.confidence > 0.5 ? "#ff954d" : "#64748b",
                              }} />
                            </div>
                            <span className={styles.confidenceText}>{(r.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className={styles.pagination}>
                <div className={styles.pageSizeRow}>
                  每页
                  <select className={styles.pageSelect} value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1); }}>
                    {[20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  条
                </div>
                <div className={styles.pageBtns}>
                  <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ 上一页</button>
                  <span className={styles.pageInfo}>{page} / {totalPages || 1}</span>
                  <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>下一页 ›</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Lightbox result={lightboxItem} onClose={() => setLightboxItem(null)} results={filteredResults} onNavigate={setLightboxItem} />
    </div>
  );
};

export default IndustrialVisionPlatform;