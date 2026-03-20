import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, ComposedChart, Scatter,
} from "recharts";

/* ============================================================
   Mock Data Generators
   ============================================================ */
function genData(base, noise, trend, len) {
  const r = [];
  for (let i = 0; i < len; i++) {
    const cyc = Math.sin((i / len) * Math.PI * 4) * noise * 0.3;
    const rn = (Math.random() - 0.5) * noise;
    r.push(Math.round(Math.max(0, base + cyc + rn + (trend * i) / len) * 10) / 10);
  }
  return r;
}

function genSparse(base, noise, trend, len, sparsity) {
  const r = [];
  for (let i = 0; i < len; i++) {
    if (Math.random() < sparsity) r.push(null);
    else {
      const cyc = Math.sin((i / len) * Math.PI * 3) * noise * 0.3;
      const rn = (Math.random() - 0.5) * noise;
      r.push(Math.round(Math.max(0, base + cyc + rn + (trend * i) / len) * 10) / 10);
    }
  }
  return r;
}

function makeLabels24H() {
  return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
}
function makeLabels7D() {
  const days = ["6/12", "6/13", "6/14", "6/15", "6/16", "6/17", "6/18"];
  const l = [];
  for (let d = 0; d < 7; d++) for (let h = 0; h < 24; h++) l.push(h === 0 ? days[d] : "");
  return l;
}
function makeLabels30D() {
  const l = [];
  for (let d = 1; d <= 30; d++) for (let h = 0; h < 24; h++) l.push(h === 0 ? `6/${d}` : "");
  return l;
}

const TIME_CFG = {
  "24H": { points: 24, labels: makeLabels24H },
  "7天": { points: 168, labels: makeLabels7D },
  "30天": { points: 720, labels: makeLabels30D },
};

const C = {
  blue: "#1890ff", teal: "#13c2c2", purple: "#722ed1", pink: "#eb2f96",
  green: "#52c41a", amber: "#faad14", red: "#ff4d4f", orange: "#fa8c16",
};

/* ============================================================
   Alarm Data
   ============================================================ */
const ALARMS = [
  { time: "06-18 14:20", level: "预警", type: "不平衡", desc: "拐点区综合 127% 超参考线", blade: "—", value: "127%", status: "active" },
  { time: "06-18 14:10", level: "预警", type: "一致性", desc: "变桨电流偏差超限 叶片3偏高6.2A", blade: "3", value: "6.2A", status: "active" },
  { time: "06-18 13:50", level: "关注", type: "趋势", desc: "振动上升趋势 slope=0.0032", blade: "—", value: "—", status: "active" },
  { time: "06-18 12:40", level: "关注", type: "不平衡", desc: "振动水平 112% 短暂超参考线", blade: "—", value: "112%", status: "ok" },
  { time: "06-17 22:10", level: "预警", type: "AE异常", desc: "自编码器异常 健康分62 主因pitch_diff", blade: "3", value: "62分", status: "ok" },
  { time: "06-17 18:30", level: "关注", type: "一致性", desc: "叶片3变桨电流偏差 持续10min", blade: "3", value: "5.8A", status: "ok" },
  { time: "06-16 09:20", level: "告警", type: "不平衡", desc: "[升级] 拐点区综合168% 持续超限", blade: "—", value: "168%", status: "ok" },
  { time: "06-16 08:50", level: "预警", type: "CUSUM", desc: "振动上偏漂移 cusum+=4.82", blade: "—", value: "4.82", status: "ok" },
  { time: "06-15 03:10", level: "关注", type: "结冰", desc: "环境结冰风险 温度2.1°C", blade: "—", value: "风险1", status: "ok" },
  { time: "06-13 16:40", level: "预警", type: "一致性", desc: "超级电容电压叶片2偏低3.2V", blade: "2", value: "3.2V", status: "ok" },
  { time: "06-12 20:15", level: "关注", type: "振动", desc: "FA_STD 108% 轻微超参考线", blade: "—", value: "108%", status: "ok" },
  { time: "06-12 14:30", level: "预警", type: "不平衡", desc: "rotor_corner 142% 拐点区", blade: "—", value: "142%", status: "ok" },
];

const BADGE_S = {
  "关注": { background: "#e6f7ff", color: "#0050b3" },
  "预警": { background: "#fffbe6", color: "#ad6800" },
  "告警": { background: "#fff1f0", color: "#cf1322" },
  "紧急": { background: "#ff4d4f", color: "#fff" },
};

/* ============================================================
   Blade Table
   ============================================================ */
const BLADE_ROWS = [
  { label: "变桨角度 °", v: [3.2, 3.1, 5.8], warn: 2 },
  { label: "变桨电流 A", v: [12.3, 11.8, 18.5], warn: 2 },
  { label: "变桨功率 kW", v: [2.1, 2.0, 3.4], warn: 2 },
  { label: "驱动扭矩 Nm", v: [45.2, 44.8, 46.1], warn: -1 },
  { label: "电机温度 °C", v: [42.3, 41.8, 44.1], warn: -1 },
  { label: "变频器温度 °C", v: [38.5, 38.2, 39.1], warn: -1 },
  { label: "电池箱温度 °C", v: [28.3, 27.9, 28.5], warn: -1 },
  { label: "超级电容 V", v: [48.2, 48.0, 47.8], warn: -1 },
];

/* ============================================================
   Custom Tooltip
   ============================================================ */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e4e6ea", borderRadius: 6, padding: "6px 10px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ fontWeight: 600, marginBottom: 3 }}>{label}</div>
      {payload.filter(p => p.value != null).map((p, i) => (
        <div key={i} style={{ color: p.stroke || p.fill || p.color, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 8, height: 3, borderRadius: 1, background: p.stroke || p.fill || p.color, display: "inline-block" }} />
          {p.name}: {typeof p.value === "number" ? Math.round(p.value * 100) / 100 : p.value}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Legend
   ============================================================ */
function ChartLegend({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 9, color: "#8c919a", marginTop: 4 }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {it.type === "dash" ? (
            <span style={{ width: 8, borderTop: `1.5px dashed ${it.color}` }} />
          ) : it.type === "dot" ? (
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: it.color }} />
          ) : (
            <span style={{ width: 8, height: 2.5, borderRadius: 1, background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   Main
   ============================================================ */
export default function BladeMonitorDashboard() {
  const [tab, setTab] = useState(0);
  const [timeRange, setTimeRange] = useState("24H");
  const [fLevel, setFLevel] = useState("全部级别");
  const [fType, setFType] = useState("全部类型");

  const cfg = TIME_CFG[timeRange];
  const N = cfg.points;

  const chartData = useMemo(() => {
    const labels = cfg.labels();
    const health = genData(88, 8, -2, N);
    const cPitch = genData(15, 12, 5, N);
    const cCurr = genData(30, 20, 15, N);
    const cTorq = genData(8, 8, 2, N);
    const cCap = genData(10, 8, 3, N);
    const cTemp = genData(22, 14, 5, N);
    const vSsStd = genData(60, 25, 10, N);
    const vSs2p = genData(45, 20, 8, N);
    const vFaStd = genData(55, 22, 12, N);
    const vFa2p = genData(40, 18, 6, N);
    const iW = genSparse(40, 20, 12, N, 0.5);
    const iA = genSparse(55, 25, 18, N, 0.5);
    const iC = genSparse(80, 35, 45, N, 0.3);
    const iB = genData(65, 20, 20, N);
    const aeErr = genData(0.08, 0.06, 0.04, N);

    return {
      healthData: labels.map((t, i) => ({ t, 健康分: health[i] })),
      consistData: labels.map((t, i) => ({ t, 变桨角度: cPitch[i], 变桨电流: cCurr[i], 驱动扭矩: cTorq[i], 超级电容: cCap[i], 电机温度: cTemp[i] })),
      vibData: labels.map((t, i) => ({ t, SS_STD: vSsStd[i], SS_2P: vSs2p[i], FA_STD: vFaStd[i], FA_2P: vFa2p[i] })),
      imbData: labels.map((t, i) => ({ t, weight: iW[i], aero: iA[i], corner: iC[i], balance: iB[i] })),
      aeData: labels.map((t, i) => ({ t, 重构误差: Math.round(aeErr[i] * 1000) / 1000, 异常: aeErr[i] > 0.2 ? Math.round(aeErr[i] * 1000) / 1000 : null })),
    };
  }, [N, cfg]);

  const filteredAlarms = ALARMS.filter((a) => {
    if (fLevel !== "全部级别" && a.level !== fLevel) return false;
    if (fType !== "全部类型" && a.type !== fType) return false;
    return true;
  });
  const activeCount = ALARMS.filter((a) => a.status === "active").length;
  const tickInterval = timeRange === "24H" ? 2 : timeRange === "7天" ? 23 : 47;

  const warnStyle = { color: "#ad6800", fontWeight: 600, background: "#fffbe6", borderRadius: 3, padding: "2px 4px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "10px 14px", gap: 10, fontFamily: '-apple-system,"PingFang SC","Microsoft YaHei",sans-serif', fontSize: 13, color: "#1a1a1a", background: "#f0f2f5", overflow: "hidden" }}>

      {/* ===== TOP ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, flexShrink: 0 }}>
        {[
          { label: "综合健康分", val: "87", color: C.green, sub: <><span style={{ color: C.green, fontSize: 10 }}>&#9650;</span> 较昨日 +2</> },
          { label: "当前风速", val: <>9.2 <span style={{ fontSize: 12, fontWeight: 400 }}>m/s</span></>, sub: <span style={{ color: "#ad6800" }}>拐点区 (7-12)</span> },
          { label: "轮毂转速", val: <>13.8 <span style={{ fontSize: 12, fontWeight: 400 }}>RPM</span></>, sub: "额定 15 RPM" },
          { label: "今日告警", val: "3", color: C.amber, sub: "预警2 · 关注1" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e4e6ea", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#8c919a" }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, margin: "2px 0", color: m.color }}>{m.val}</div>
            <div style={{ fontSize: 11, color: "#8c919a", display: "flex", alignItems: "center", gap: 3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ===== BODY ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 10, flex: 1, minHeight: 0 }}>

        {/* ---- LEFT ---- */}
        <div style={{ background: "#fff", border: "1px solid #e4e6ea", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>叶片实时状态</div>
          <svg width="100%" viewBox="0 0 220 200" style={{ display: "block", margin: "0 auto 6px" }}>
            <circle cx="110" cy="100" r="85" fill="none" stroke="#e4e6ea" strokeWidth="0.8" strokeDasharray="4 4" />
            <line x1="110" y1="100" x2="110" y2="22" stroke={C.green} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="100" x2="38" y2="142" stroke={C.green} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="100" x2="182" y2="142" stroke={C.amber} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="110" cy="100" r="17" fill="#f5f6f8" stroke="#d9d9d9" strokeWidth="1" />
            <text x="110" y="97" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#606770">13.8</text>
            <text x="110" y="109" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#8c919a">RPM</text>
            <rect x="77" y="4" width="66" height="17" rx="8" fill="#f6ffed" stroke="#b7eb8f" strokeWidth="0.6" />
            <text x="110" y="14" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#237804">B1: 96</text>
            <rect x="4" y="148" width="66" height="17" rx="8" fill="#f6ffed" stroke="#b7eb8f" strokeWidth="0.6" />
            <text x="37" y="158" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#237804">B2: 92</text>
            <rect x="150" y="148" width="66" height="17" rx="8" fill="#fffbe6" stroke="#ffe58f" strokeWidth="0.6" />
            <text x="183" y="158" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="600" fill="#ad6800">B3: 74</text>
          </svg>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr>{["指标", "B1", "B2", "B3"].map((h, i) => <th key={i} style={{ textAlign: "left", fontWeight: 600, padding: "4px 3px", borderBottom: "1px solid #e4e6ea", color: "#8c919a", fontSize: 10 }}>{h}</th>)}</tr></thead>
            <tbody>
              {BLADE_ROWS.map((row, ri) => (
                <tr key={ri}>
                  <td style={{ padding: "3px 4px", borderBottom: "1px solid #f0f0f0" }}>{row.label}</td>
                  {row.v.map((v, ci) => (
                    <td key={ci} style={{ padding: "3px 4px", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={ci === row.warn ? warnStyle : undefined}>{v}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "auto", padding: "8px 10px", fontSize: 11, lineHeight: 1.5, borderLeft: "3px solid #faad14", background: "#fffbe6", borderRadius: "0 6px 6px 0" }}>
            <strong style={{ color: "#ad6800" }}>叶片3 变桨系统异常</strong><br />
            角度偏差2.7° · 电流偏高6.2A<br />
            建议检查变桨电机及传动机构
          </div>
        </div>

        {/* ---- RIGHT ---- */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* Tab Header */}
          <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #e4e6ea", background: "#fff", borderRadius: "8px 8px 0 0", flexShrink: 0 }}>
            {["趋势监测", "报警列表"].map((t, i) => (
              <div key={i} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, color: tab === i ? "#1890ff" : "#8c919a", cursor: "pointer", borderBottom: `2px solid ${tab === i ? "#1890ff" : "transparent"}`, userSelect: "none" }} onClick={() => setTab(i)}>
                {t}
                {i === 1 && <span style={{ display: "inline-block", background: "#ff4d4f", color: "#fff", fontSize: 10, padding: "0 5px", borderRadius: 10, marginLeft: 4, fontWeight: 600 }}>{activeCount}</span>}
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
              <span style={{ fontSize: 10, color: "#8c919a" }}>1min刷新</span>
              <div style={{ display: "flex", background: "#f5f6f8", borderRadius: 6, overflow: "hidden", border: "1px solid #e4e6ea" }}>
                {["24H", "7天", "30天"].map((t) => (
                  <div key={t} style={{ padding: "3px 10px", fontSize: 11, color: timeRange === t ? "#1a1a1a" : "#8c919a", fontWeight: timeRange === t ? 600 : 400, background: timeRange === t ? "#fff" : "transparent", cursor: "pointer", boxShadow: timeRange === t ? "0 0 0 1px #e4e6ea" : "none", userSelect: "none" }} onClick={() => setTimeRange(t)}>{t}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Body */}
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "#fff", borderRadius: "0 0 8px 8px", border: "1px solid #e4e6ea", borderTop: "none", padding: 10 }}>
            {tab === 0 && (
              <>
                {/* Row 1: Health + Consistency */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div style={{ background: "#f5f6f8", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>综合健康度</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>87</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#8c919a", marginBottom: 6 }}>参考线80(关注) / 干预线60(干预)</div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={chartData.healthData} margin={{ top: 5, right: 8, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#8c919a" }} interval={tickInterval} />
                        <YAxis domain={[40, 100]} tick={{ fontSize: 9, fill: "#8c919a" }} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={80} stroke={C.blue} strokeDasharray="5 3" strokeWidth={0.8} label={{ value: "参考80", position: "insideTopRight", fontSize: 9, fill: "#0050b3" }} />
                        <ReferenceLine y={60} stroke={C.red} strokeDasharray="5 3" strokeWidth={0.8} label={{ value: "干预60", position: "insideTopRight", fontSize: 9, fill: C.red }} />
                        <Line type="monotone" dataKey="健康分" stroke={C.blue} strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <ChartLegend items={[{ color: C.blue, label: "健康分" }, { color: C.blue, label: "参考80", type: "dash" }, { color: C.red, label: "干预60", type: "dash" }]} />
                  </div>

                  <div style={{ background: "#f5f6f8", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>传感器一致性偏差</span>
                      <div style={{ display: "flex", background: "#fff", borderRadius: 4, overflow: "hidden", border: "1px solid #e4e6ea" }}>
                        <span style={{ padding: "1px 6px", fontSize: 9, fontWeight: 600, background: "#f5f6f8" }}>归一化%</span>
                        <span style={{ padding: "1px 6px", fontSize: 9, color: "#8c919a" }}>原始值</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#8c919a", marginBottom: 6 }}>参考100% / 干预200%</div>
                    <ResponsiveContainer width="100%" height={120}>
                      <LineChart data={chartData.consistData} margin={{ top: 5, right: 8, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#8c919a" }} interval={tickInterval} />
                        <YAxis domain={[0, 220]} tick={{ fontSize: 9, fill: "#8c919a" }} tickFormatter={(v) => v + "%"} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={100} stroke={C.blue} strokeDasharray="5 3" strokeWidth={0.8} />
                        <ReferenceLine y={200} stroke={C.red} strokeDasharray="5 3" strokeWidth={0.8} />
                        <Line type="monotone" dataKey="变桨角度" stroke={C.blue} strokeWidth={1.2} dot={false} />
                        <Line type="monotone" dataKey="变桨电流" stroke={C.green} strokeWidth={1.2} dot={false} />
                        <Line type="monotone" dataKey="驱动扭矩" stroke={C.purple} strokeWidth={1.2} dot={false} />
                        <Line type="monotone" dataKey="超级电容" stroke={C.amber} strokeWidth={1.2} dot={false} />
                        <Line type="monotone" dataKey="电机温度" stroke={C.pink} strokeWidth={1.2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    <ChartLegend items={[{ color: C.blue, label: "变桨角度" }, { color: C.green, label: "变桨电流" }, { color: C.purple, label: "驱动扭矩" }, { color: C.amber, label: "超级电容" }, { color: C.pink, label: "电机温度" }]} />
                  </div>
                </div>

                {/* Row 2: Vibration + Imbalance + AE */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                  <div style={{ background: "#f5f6f8", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>振动指标</div>
                    <div style={{ fontSize: 10, color: "#8c919a", marginBottom: 6 }}>SS/FA方向 STD与2P</div>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={chartData.vibData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="t" tick={{ fontSize: 8, fill: "#8c919a" }} interval={tickInterval} />
                        <YAxis domain={[0, 220]} tick={{ fontSize: 8, fill: "#8c919a" }} tickFormatter={(v) => v + "%"} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={100} stroke={C.blue} strokeDasharray="5 3" strokeWidth={0.8} />
                        <ReferenceLine y={200} stroke={C.red} strokeDasharray="5 3" strokeWidth={0.8} />
                        <Line type="monotone" dataKey="SS_STD" stroke={C.blue} strokeWidth={1} dot={false} />
                        <Line type="monotone" dataKey="SS_2P" stroke={C.teal} strokeWidth={1} dot={false} />
                        <Line type="monotone" dataKey="FA_STD" stroke={C.purple} strokeWidth={1} dot={false} />
                        <Line type="monotone" dataKey="FA_2P" stroke={C.pink} strokeWidth={1} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    <ChartLegend items={[{ color: C.blue, label: "SS_STD" }, { color: C.teal, label: "SS_2P" }, { color: C.purple, label: "FA_STD" }, { color: C.pink, label: "FA_2P" }]} />
                  </div>

                  <div style={{ background: "#f5f6f8", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>不平衡指标</div>
                    <div style={{ fontSize: 10, color: "#8c919a", marginBottom: 6 }}>不同风速区断线显示</div>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={chartData.imbData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="t" tick={{ fontSize: 8, fill: "#8c919a" }} interval={tickInterval} />
                        <YAxis domain={[0, 250]} tick={{ fontSize: 8, fill: "#8c919a" }} tickFormatter={(v) => v + "%"} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={100} stroke={C.blue} strokeDasharray="5 3" strokeWidth={0.8} />
                        <ReferenceLine y={200} stroke={C.red} strokeDasharray="5 3" strokeWidth={0.8} />
                        <Line type="monotone" dataKey="weight" stroke={C.blue} strokeWidth={1} dot={false} connectNulls={false} />
                        <Line type="monotone" dataKey="aero" stroke={C.green} strokeWidth={1} dot={false} connectNulls={false} />
                        <Line type="monotone" dataKey="corner" stroke={C.amber} strokeWidth={1.5} dot={false} connectNulls={false} />
                        <Line type="monotone" dataKey="balance" stroke={C.red} strokeWidth={1.2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                    <ChartLegend items={[{ color: C.blue, label: "weight" }, { color: C.green, label: "aero" }, { color: C.amber, label: "corner" }, { color: C.red, label: "balance" }]} />
                  </div>

                  <div style={{ background: "#f5f6f8", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>AE数据偏差</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>健康 85</span>
                    </div>
                    <div style={{ fontSize: 10, color: "#8c919a", marginBottom: 6 }}>红点=异常时刻</div>
                    <ResponsiveContainer width="100%" height={100}>
                      <ComposedChart data={chartData.aeData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="t" tick={{ fontSize: 8, fill: "#8c919a" }} interval={tickInterval} />
                        <YAxis domain={[0, 0.35]} tick={{ fontSize: 8, fill: "#8c919a" }} tickFormatter={(v) => v.toFixed(2)} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={0.15} stroke="#91caff" strokeDasharray="5 3" strokeWidth={0.8} />
                        <ReferenceLine y={0.2} stroke={C.red} strokeDasharray="5 3" strokeWidth={0.8} />
                        <Line type="monotone" dataKey="重构误差" stroke={C.blue} strokeWidth={1.2} dot={false} />
                        <Scatter dataKey="异常" fill={C.red} />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <ChartLegend items={[{ color: C.blue, label: "重构误差" }, { color: "#91caff", label: "P95", type: "dash" }, { color: C.red, label: "P99", type: "dash" }, { color: C.red, label: "异常", type: "dot" }]} />
                  </div>
                </div>
              </>
            )}

            {/* ===== TAB 1: ALARMS ===== */}
            {tab === 1 && (
              <div style={{ background: "#f5f6f8", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>报警记录</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <select style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, border: "1px solid #e4e6ea", background: "#fff" }} value={fLevel} onChange={(e) => setFLevel(e.target.value)}>
                      {["全部级别", "紧急", "告警", "预警", "关注"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <select style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, border: "1px solid #e4e6ea", background: "#fff" }} value={fType} onChange={(e) => setFType(e.target.value)}>
                      {["全部类型", "不平衡", "振动", "一致性", "AE异常", "CUSUM", "结冰", "趋势"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr>
                        {[{ l: "时间", w: 100 }, { l: "级别", w: 48 }, { l: "类型", w: 56 }, { l: "描述" }, { l: "叶片", w: 36 }, { l: "数值", w: 48 }, { l: "状态", w: 42 }].map((h, i) => (
                          <th key={i} style={{ textAlign: "left", fontWeight: 600, padding: "5px 4px", borderBottom: "1px solid #e4e6ea", color: "#8c919a", fontSize: 10, position: "sticky", top: 0, background: "#f5f6f8", width: h.w }}>{h.l}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlarms.map((a, i) => (
                        <tr key={i} style={a.status === "active" ? { background: "rgba(250,173,20,0.06)" } : undefined}>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0" }}>{a.time}</td>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0" }}>
                            <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, display: "inline-block", fontWeight: 500, ...(BADGE_S[a.level] || {}) }}>{a.level}</span>
                          </td>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0" }}>{a.type}</td>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0" }}>{a.desc}</td>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0", textAlign: "center" }}>{a.blade}</td>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0" }}>{a.value}</td>
                          <td style={{ padding: "4px", borderBottom: "1px solid #f0f0f0", color: a.status === "active" ? "#ad6800" : "#237804", fontWeight: a.status === "active" ? 500 : 400 }}>
                            {a.status === "active" ? "活跃" : "已恢复"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 10, color: "#8c919a" }}>
                  <span>共 {filteredAlarms.length} 条</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ fontSize: 10, padding: "2px 10px", border: "1px solid #e4e6ea", background: "#fff", borderRadius: 4, opacity: 0.4 }} disabled>上一页</button>
                    <button style={{ fontSize: 10, padding: "2px 10px", border: "1px solid #e4e6ea", background: "#fff", borderRadius: 4, cursor: "pointer" }}>下一页</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
