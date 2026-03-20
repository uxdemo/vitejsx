import { useState, useEffect, useRef, useCallback } from "react";

const STEPS = [
  { id: "input", label: "故障输入" },
  { id: "tools", label: "工具调用" },
  { id: "knowledge", label: "知识检索" },
  { id: "reasoning", label: "推理诊断" },
  { id: "result", label: "诊断结果" },
];

const PRESET_CASES = [
  {
    name: "燃机轴承温度异常",
    desc: "#2燃机前轴承温度近2天持续上升，伴随轻微振动增大，运行人员反馈滑油回油温度也有升高。",
    equipment: "京桥电厂 #2燃机 SGT-800",
    subsystem: "轴承润滑系统",
  },
  {
    name: "风机叶片不平衡预警",
    desc: "A03风机近一周振动值波动增大，主要体现在1X转频分量，功率曲线略低于理论值。",
    equipment: "清洲III海上风场 A03 MySE5.5",
    subsystem: "传动链-叶片系统",
  },
  {
    name: "燃机排气温度分散度增大",
    desc: "#1燃机DLN燃烧室排气温度分散度从15°C升至38°C，个别热电偶读数偏高，负荷未变化。",
    equipment: "京桥电厂 #1燃机 SGT-800",
    subsystem: "燃烧系统",
  },
];

// Tool call simulation data for case 0 (bearing)
const TOOL_CALLS_BEARING = [
  {
    tool: "MCP: time_series_analyzer",
    icon: "📊",
    purpose: "计算轴承相关测点统计指标与趋势",
    request: `analyze({
  points: ["BRG_TEMP_DE", "BRG_TEMP_NDE", "VIB_DE_X", "VIB_DE_Y", "OIL_RETURN_T"],
  window: "48h",
  baseline: "30d_rolling"
})`,
    response: {
      BRG_TEMP_DE: { mean: 85.2, max: 92.1, min: 78.5, std: 3.4, baseline_mean: 74.0, deviation: "+15.1%", trend: "rising", slope: "0.28°C/h" },
      VIB_DE_X: { mean: 4.2, max: 6.8, min: 2.1, std: 1.1, baseline_mean: 2.8, deviation: "+50.0%", trend: "rising", slope: "0.05mm/s/h" },
      OIL_RETURN_T: { mean: 62.3, max: 65.1, min: 58.7, std: 1.8, baseline_mean: 55.0, deviation: "+13.3%", trend: "rising_slow", slope: "0.08°C/h" },
    },
    narrative: "轴承驱动端温度均值85.2°C，较30天基线偏高15.1%（显著偏高），趋势持续上升（+0.28°C/h）；振动X方向均值4.2mm/s，较基线偏高50%（严重偏高），峰值6.8mm/s；滑油回油温度均值62.3°C，较基线偏高13.3%，趋势缓慢上升。",
    duration: 2800,
  },
  {
    tool: "MCP: threshold_engine",
    icon: "⚡",
    purpose: "规则引擎阈值比对与初步分类",
    request: `check_rules({
  indicators: metrics_result,
  ruleset: "gas_turbine_bearing_v3"
})`,
    response: {
      triggered_rules: [
        { rule: "R-BRG-01", desc: "轴承温度>80°C且趋势上升", level: "WARNING", action: "关注" },
        { rule: "R-VIB-03", desc: "振动偏离基线>30%", level: "ALARM", action: "排查" },
        { rule: "R-OIL-02", desc: "回油温度偏高+轴承温度偏高", level: "WARNING", action: "检查润滑" },
      ],
      pre_classification: "轴承系统异常（置信度: 高）",
    },
    duration: 1200,
  },
  {
    tool: "MCP: correlation_analyzer",
    icon: "🔗",
    purpose: "分析多测点关联性，识别异常传播路径",
    request: `correlate({
  primary: "BRG_TEMP_DE",
  secondary: ["VIB_DE_X", "OIL_RETURN_T", "LOAD_MW", "AMBIENT_T"],
  window: "48h"
})`,
    response: {
      correlations: [
        { pair: "轴承温度 ↔ 振动", r: 0.87, lag: "振动领先温度约2h", interpretation: "强正相关，振动可能是因" },
        { pair: "轴承温度 ↔ 回油温度", r: 0.92, lag: "几乎同步", interpretation: "强正相关，同源" },
        { pair: "轴承温度 ↔ 负荷", r: 0.15, lag: "无显著滞后", interpretation: "弱相关，排除负荷影响" },
        { pair: "轴承温度 ↔ 环境温度", r: 0.08, lag: "-", interpretation: "无相关，排除环境因素" },
      ],
    },
    duration: 2000,
  },
];

const KNOWLEDGE_RESULTS = [
  {
    source: "历史案例库",
    icon: "📁",
    items: [
      { id: "CASE-2023-041", title: "轴承磨损导致温度振动同升", similarity: 0.94, pattern: "温度↑ + 振动↑ + 油温↑", resolution: "更换轴承 + 换油" },
      { id: "CASE-2022-118", title: "润滑油劣化引起轴承过热", similarity: 0.88, pattern: "温度↑ + 油温↑ + 振动轻微↑", resolution: "更换润滑油" },
      { id: "CASE-2024-007", title: "轴承间隙超差", similarity: 0.81, pattern: "振动↑(1X为主) + 温度缓慢↑", resolution: "调整轴承间隙" },
    ],
  },
  {
    source: "维修手册 / SOP",
    icon: "📖",
    items: [
      { doc: "SGT-800 维护手册 §7.3", content: "轴承温度持续高于85°C应安排停机检查，确认轴承间隙、润滑油品质及油路畅通。" },
      { doc: "润滑系统检查SOP-LUB-04", content: "回油温度偏高>10°C时，检查油冷却器效率，采集油样送检分析磨损颗粒。" },
    ],
  },
  {
    source: "设备知识图谱",
    icon: "🔀",
    items: [
      { relation: "前轴承 → 润滑油系统 → 油冷却器 → 冷却水系统", note: "故障传播路径" },
      { relation: "前轴承 → 联轴器 → 压缩机转子", note: "机械耦合路径" },
    ],
  },
];

const REASONING_STEPS = [
  {
    phase: "异常识别",
    icon: "🔍",
    content: `**异常指标清单：**
• 轴承温度 85.2°C — 偏离基线 +15.1%（⚠️ 中等异常）
• 振动值 4.2mm/s — 偏离基线 +50.0%（🔴 严重异常）
• 回油温度 62.3°C — 偏离基线 +13.3%（⚠️ 中等异常）
• 负荷、环境温度 — 正常范围内（排除外部因素）`,
  },
  {
    phase: "假设生成",
    icon: "💡",
    content: `基于异常指标组合，提出以下故障假设：

**假设A：轴承磨损**
机理：轴承表面劣化 → 摩擦增大 → 温度上升 + 振动增大

**假设B：润滑油品质劣化**
机理：油品老化 → 润滑性能下降 → 摩擦增大 → 温度上升

**假设C：油冷却器效率下降**
机理：冷却不足 → 油温升高 → 轴承散热差 → 温度上升`,
  },
  {
    phase: "假设验证",
    icon: "✅",
    content: `逐一验证：

**假设A - 轴承磨损** ✅ 高度匹配
✓ 能解释振动显著增大（+50%）——磨损导致间隙变化
✓ 能解释温度上升——摩擦热增加
✓ 振动领先温度2小时——符合"磨损→振动→发热"因果链
✓ 历史案例 CASE-2023-041 匹配度 94%
△ 需确认：润滑油颗粒分析数据

**假设B - 润滑油劣化** ⚠️ 部分匹配
✓ 能解释温度和油温同步上升
✗ 难以解释振动偏高达50%（油品问题通常振动增幅<20%）
△ 不能排除：可能是并发因素

**假设C - 油冷却器效率下降** ❌ 不匹配
✗ 若冷却器问题，供油温度应首先升高，但数据显示回油温度升高更显著
✗ 无法解释振动显著增大
→ 排除此假设`,
  },
  {
    phase: "综合判定",
    icon: "🎯",
    content: `**最终诊断：轴承早期磨损（可能伴随油品劣化）**

推理链：
轴承表面开始劣化 → 摩擦系数增大 → 振动特征先行出现（领先~2h）
→ 持续摩擦产生热量 → 轴承温度上升 → 热量传导至回油 → 油温上升

置信度评估：
• 主诊断（轴承磨损）：88%
• 并发因素（油品劣化）：65%（需油样分析确认）

⚠️ 建议补充数据：
1. 润滑油颗粒度检测（铁谱分析）
2. 轴承间隙测量记录
3. 近6个月润滑油更换记录`,
  },
];

const FINAL_RESULT = {
  diagnosis: "前轴承早期磨损",
  confidence: 88,
  severity: "中高",
  rootCause: "轴承工作面劣化导致摩擦增大，振动与温度同步恶化",
  actions: [
    { priority: "紧急", action: "安排润滑油取样送检（铁谱分析），确认磨损颗粒含量", deadline: "24h内" },
    { priority: "高", action: "安排下次停机窗口检查轴承间隙与表面状态", deadline: "7天内" },
    { priority: "中", action: "加密振动与温度监测频率（从10min改为1min采样）", deadline: "立即" },
    { priority: "预防", action: "评估润滑油更换周期是否需要缩短", deadline: "本月内" },
  ],
  risk: "若不处理，预计2-3周内轴承温度将触发高高报警（>95°C），可能导致非计划停机。按当前劣化速率（+0.28°C/h × 间歇运行），预估剩余安全运行窗口约 300-400 等效运行小时。",
  evidence: [
    "轴承温度85.2°C，较基线+15.1%，持续上升趋势",
    "振动4.2mm/s，较基线+50%，领先温度变化约2h",
    "回油温度62.3°C，较基线+13.3%，与轴承温度强相关(r=0.92)",
    "与负荷(r=0.15)和环境温度(r=0.08)无关联，排除外部因素",
    "历史案例CASE-2023-041匹配度94%，确诊为轴承磨损",
  ],
};

// ---- Animated typing for narrative text ----
function useTypingEffect(text, speed = 18, active = false) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, active, speed]);
  return displayed;
}

// ---- Components ----
function ProgressBar({ steps, current }) {
  return (
    <div style={{ display: "flex", gap: 0, margin: "0 0 28px", position: "relative" }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600,
              background: done ? "#1d9e75" : active ? "#d85a30" : "rgba(128,128,120,0.12)",
              color: done || active ? "#fff" : "rgba(128,128,120,0.6)",
              transition: "all 0.4s",
              boxShadow: active ? "0 0 0 4px rgba(216,90,48,0.18)" : "none",
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span style={{
              marginTop: 6, fontSize: 11, fontWeight: active ? 600 : 400, letterSpacing: "0.02em",
              color: active ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
              transition: "all 0.3s",
            }}>{s.label}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 15, left: "10%", right: "10%", height: 2, background: "var(--color-border-tertiary)", zIndex: 0 }} />
    </div>
  );
}

function ToolCallCard({ tool, expanded, onToggle, animPhase }) {
  const isLoading = animPhase === "loading";
  const isDone = animPhase === "done";
  return (
    <div style={{
      border: "1px solid var(--color-border-tertiary)", borderRadius: 10,
      marginBottom: 10, overflow: "hidden",
      opacity: animPhase === "hidden" ? 0.3 : 1,
      transition: "all 0.4s",
      background: isDone ? "rgba(29,158,117,0.04)" : "var(--color-background-secondary)",
    }}>
      <div onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer",
        borderBottom: expanded ? "1px solid var(--color-border-tertiary)" : "none",
      }}>
        <span style={{ fontSize: 18 }}>{tool.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{tool.tool}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 1 }}>{tool.purpose}</div>
        </div>
        {isLoading && <Spinner />}
        {isDone && <span style={{ fontSize: 11, color: "#1d9e75", fontWeight: 600, padding: "2px 8px", background: "rgba(29,158,117,0.1)", borderRadius: 4 }}>完成</span>}
      </div>
      {expanded && isDone && (
        <div style={{ padding: "10px 14px", fontSize: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Request</div>
            <pre style={{ margin: 0, padding: 10, borderRadius: 6, background: "rgba(0,0,0,0.06)", color: "var(--color-text-secondary)", fontSize: 11, lineHeight: 1.5, overflowX: "auto", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap" }}>{tool.request}</pre>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Response</div>
            <pre style={{ margin: 0, padding: 10, borderRadius: 6, background: "rgba(0,0,0,0.06)", color: "var(--color-text-secondary)", fontSize: 11, lineHeight: 1.5, overflowX: "auto", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap" }}>{JSON.stringify(tool.response, null, 2)}</pre>
          </div>
          {tool.narrative && (
            <div style={{ padding: 10, borderRadius: 6, background: "rgba(216,90,48,0.06)", border: "1px solid rgba(216,90,48,0.15)" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#d85a30", marginBottom: 4 }}>语义化摘要 → 输入LLM</div>
              <div style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{tool.narrative}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 16, height: 16, border: "2px solid rgba(128,128,120,0.15)",
      borderTopColor: "#d85a30", borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  );
}

function KnowledgeSection({ data, visible }) {
  if (!visible) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((section, si) => (
        <div key={si} style={{ border: "1px solid var(--color-border-tertiary)", borderRadius: 10, overflow: "hidden", background: "var(--color-background-secondary)" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{section.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{section.source}</span>
          </div>
          <div style={{ padding: "8px 14px" }}>
            {section.items.map((item, ii) => (
              <div key={ii} style={{ padding: "8px 0", borderBottom: ii < section.items.length - 1 ? "1px solid var(--color-border-tertiary)" : "none", fontSize: 12 }}>
                {item.similarity !== undefined ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{item.id}</span>
                      <span style={{ marginLeft: 6, color: "var(--color-text-secondary)" }}>{item.title}</span>
                      <div style={{ marginTop: 3, color: "var(--color-text-tertiary)", fontSize: 11 }}>特征: {item.pattern} | 处置: {item.resolution}</div>
                    </div>
                    <span style={{
                      flexShrink: 0, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                      background: item.similarity > 0.9 ? "rgba(29,158,117,0.12)" : "rgba(216,90,48,0.1)",
                      color: item.similarity > 0.9 ? "#1d9e75" : "#d85a30",
                    }}>{(item.similarity * 100).toFixed(0)}%</span>
                  </div>
                ) : item.doc ? (
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--color-text-primary)", fontSize: 11 }}>{item.doc}</span>
                    <div style={{ marginTop: 3, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{item.content}</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{item.relation}</div>
                    <div style={{ marginTop: 2, color: "var(--color-text-tertiary)", fontSize: 11 }}>{item.note}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReasoningPanel({ steps, currentStep }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {steps.map((step, i) => {
        const visible = i <= currentStep;
        const active = i === currentStep;
        if (!visible) return null;
        return (
          <div key={i} style={{
            border: active ? "1px solid rgba(216,90,48,0.3)" : "1px solid var(--color-border-tertiary)",
            borderRadius: 10, overflow: "hidden",
            background: active ? "rgba(216,90,48,0.03)" : "var(--color-background-secondary)",
            transition: "all 0.3s",
          }}>
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--color-border-tertiary)" }}>
              <span style={{ fontSize: 16 }}>{step.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>Step {i + 1}: {step.phase}</span>
              {active && <Spinner />}
            </div>
            <div style={{
              padding: "12px 14px", fontSize: 12, lineHeight: 1.7,
              color: "var(--color-text-primary)", whiteSpace: "pre-wrap",
            }}>
              {step.content.split(/(\*\*[^*]+\*\*)/).map((seg, si) => {
                if (seg.startsWith("**") && seg.endsWith("**")) {
                  return <strong key={si} style={{ fontWeight: 600 }}>{seg.slice(2, -2)}</strong>;
                }
                return <span key={si}>{seg}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DiagnosisResult({ data, visible }) {
  if (!visible) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header card */}
      <div style={{
        borderRadius: 12, padding: "18px 20px",
        background: "linear-gradient(135deg, rgba(29,158,117,0.08), rgba(29,158,117,0.02))",
        border: "1px solid rgba(29,158,117,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#1d9e75", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>诊断结论</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>{data.diagnosis}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>{data.rootCause}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: data.confidence >= 80 ? "rgba(29,158,117,0.12)" : "rgba(216,90,48,0.12)",
              border: `2px solid ${data.confidence >= 80 ? "#1d9e75" : "#d85a30"}`,
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: data.confidence >= 80 ? "#1d9e75" : "#d85a30" }}>{data.confidence}%</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>置信度</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ border: "1px solid var(--color-border-tertiary)", borderRadius: 10, overflow: "hidden", background: "var(--color-background-secondary)" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border-tertiary)", fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
          处置建议（按优先级）
        </div>
        {data.actions.map((a, i) => (
          <div key={i} style={{ padding: "10px 14px", borderBottom: i < data.actions.length - 1 ? "1px solid var(--color-border-tertiary)" : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{
              flexShrink: 0, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
              background: a.priority === "紧急" ? "rgba(226,75,74,0.1)" : a.priority === "高" ? "rgba(216,90,48,0.1)" : a.priority === "中" ? "rgba(186,117,23,0.1)" : "rgba(29,158,117,0.1)",
              color: a.priority === "紧急" ? "#e24b4a" : a.priority === "高" ? "#d85a30" : a.priority === "中" ? "#ba7517" : "#1d9e75",
            }}>{a.priority}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{a.action}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>期限: {a.deadline}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk */}
      <div style={{ border: "1px solid rgba(226,75,74,0.2)", borderRadius: 10, padding: "12px 14px", background: "rgba(226,75,74,0.03)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#e24b4a", marginBottom: 6 }}>风险评估</div>
        <div style={{ fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{data.risk}</div>
      </div>

      {/* Evidence chain */}
      <div style={{ border: "1px solid var(--color-border-tertiary)", borderRadius: 10, overflow: "hidden", background: "var(--color-background-secondary)" }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border-tertiary)", fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>
          证据链（可溯源）
        </div>
        {data.evidence.map((e, i) => (
          <div key={i} style={{ padding: "8px 14px", borderBottom: i < data.evidence.length - 1 ? "1px solid var(--color-border-tertiary)" : "none", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: "#1d9e75", fontWeight: 700, fontSize: 11, marginTop: 1 }}>#{i + 1}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{e}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Main App ----
export default function DiagnosticDemo() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [toolPhases, setToolPhases] = useState(["hidden", "hidden", "hidden"]);
  const [expandedTool, setExpandedTool] = useState(null);
  const [knowledgeVisible, setKnowledgeVisible] = useState(false);
  const [reasoningStep, setReasoningStep] = useState(-1);
  const [resultVisible, setResultVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const containerRef = useRef(null);

  const scrollBottom = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 100);
  }, []);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const runDiagnosis = useCallback(async (caseIdx) => {
    setSelectedCase(caseIdx);
    setIsRunning(true);
    setCurrentStepIndex(0);
    setToolPhases(["hidden", "hidden", "hidden"]);
    setExpandedTool(null);
    setKnowledgeVisible(false);
    setReasoningStep(-1);
    setResultVisible(false);
    await sleep(600);

    // Step 1: Tools
    setCurrentStepIndex(1);
    scrollBottom();
    for (let t = 0; t < 3; t++) {
      setToolPhases((prev) => { const n = [...prev]; n[t] = "loading"; return n; });
      scrollBottom();
      await sleep(TOOL_CALLS_BEARING[t].duration);
      setToolPhases((prev) => { const n = [...prev]; n[t] = "done"; return n; });
      setExpandedTool(t);
      scrollBottom();
      await sleep(500);
    }
    await sleep(400);

    // Step 2: Knowledge
    setCurrentStepIndex(2);
    scrollBottom();
    await sleep(800);
    setKnowledgeVisible(true);
    scrollBottom();
    await sleep(1500);

    // Step 3: Reasoning
    setCurrentStepIndex(3);
    scrollBottom();
    for (let r = 0; r < REASONING_STEPS.length; r++) {
      setReasoningStep(r);
      scrollBottom();
      await sleep(2200);
    }
    await sleep(600);

    // Step 4: Result
    setCurrentStepIndex(4);
    scrollBottom();
    await sleep(600);
    setResultVisible(true);
    scrollBottom();
    setIsRunning(false);
  }, [scrollBottom]);

  const activeCase = selectedCase !== null ? PRESET_CASES[selectedCase] : null;

  return (
    <div style={{ fontFamily: '"Anthropic Sans", system-ui, sans-serif', maxWidth: 640, margin: "0 auto", color: "var(--color-text-primary)" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease-out; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--color-border-tertiary)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Interactive demo</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>工业故障精确诊断系统</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>Dify Workflow + MCP Tools + Multi-stage LLM Reasoning</div>
      </div>

      {/* Case selection */}
      {!isRunning && selectedCase === null && (
        <div className="fade-up">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>选择一个故障场景开始诊断：</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PRESET_CASES.map((c, i) => (
              <div key={i} onClick={() => runDiagnosis(i)} style={{
                padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                border: "1px solid var(--color-border-tertiary)",
                background: "var(--color-background-secondary)",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(216,90,48,0.4)"; e.currentTarget.style.background = "rgba(216,90,48,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; e.currentTarget.style.background = "var(--color-background-secondary)"; }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4, lineHeight: 1.5 }}>{c.desc}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>{c.equipment} · {c.subsystem}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Running / Complete */}
      {selectedCase !== null && (
        <div ref={containerRef} style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
          <ProgressBar steps={STEPS} current={currentStepIndex} />

          {/* Input display */}
          <div className="fade-up" style={{
            padding: "14px 16px", borderRadius: 10, marginBottom: 20,
            border: "1px solid var(--color-border-tertiary)",
            background: "var(--color-background-secondary)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)", letterSpacing: "0.06em", marginBottom: 4 }}>故障描述</div>
                <div style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{activeCase.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>设备: <strong style={{ color: "var(--color-text-secondary)" }}>{activeCase.equipment}</strong></span>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>子系统: <strong style={{ color: "var(--color-text-secondary)" }}>{activeCase.subsystem}</strong></span>
            </div>
          </div>

          {/* Tools */}
          {currentStepIndex >= 1 && (
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#d85a30" }}>▸</span> MCP 工具调用链
              </div>
              {TOOL_CALLS_BEARING.map((t, i) => (
                <ToolCallCard
                  key={i}
                  tool={t}
                  expanded={expandedTool === i}
                  onToggle={() => setExpandedTool(expandedTool === i ? null : i)}
                  animPhase={toolPhases[i]}
                />
              ))}
            </div>
          )}

          {/* Knowledge */}
          {currentStepIndex >= 2 && (
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#534ab7" }}>▸</span> 知识库检索结果
              </div>
              <KnowledgeSection data={KNOWLEDGE_RESULTS} visible={knowledgeVisible} />
            </div>
          )}

          {/* Reasoning */}
          {currentStepIndex >= 3 && (
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#d85a30" }}>▸</span> LLM 推理链 (Chain-of-Thought)
              </div>
              <ReasoningPanel steps={REASONING_STEPS} currentStep={reasoningStep} />
            </div>
          )}

          {/* Result */}
          {currentStepIndex >= 4 && (
            <div className="fade-up" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#1d9e75" }}>▸</span> 诊断结果
              </div>
              <DiagnosisResult data={FINAL_RESULT} visible={resultVisible} />
            </div>
          )}

          {/* Restart */}
          {!isRunning && resultVisible && (
            <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
              <button onClick={() => { setSelectedCase(null); setCurrentStepIndex(0); }}
                style={{
                  padding: "8px 24px", borderRadius: 8, border: "1px solid var(--color-border-tertiary)",
                  background: "var(--color-background-secondary)", color: "var(--color-text-primary)",
                  fontSize: 13, cursor: "pointer", fontWeight: 500,
                }}>
                ← 选择其他故障场景
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
