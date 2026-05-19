import type { PlantScore, Alert, Case, DailyRecord, TfsField } from './types';

export const PLANTS = ["京西热电","京阳热电","京桥热电","高安屯热电","京丰燃气","未来热电","上庄热电","深圳钰湖","钰海电力","京宜热电"];
export const PLANT_COLORS = ["#0FC38F","#FF6B6B","#00C5F9","#FFD93D","#4D96FF","#CC5DE8","#FF954D","#20C997","#F06595","#74C0FC"];
export const SPECIALTIES = ["燃气","锅炉","汽机","电气","公用"];
export const SPECIALTY_COLORS = ["#00C5F9","#FF6B6B","#FFD93D","#20C997","#4D96FF"];
export const TIME_CUTS = [
  { l: "近一周", d: 7 },
  { l: "近一个月", d: 30 },
  { l: "近六个月", d: 180 },
  { l: "近一年", d: 365 },
  { l: "上线至今", d: 189 },
];
export const TFS: TfsField[] = [
  { key: "lf", label: "人均登录次数" },
  { key: "lr", label: "人员登录率" },
  { key: "cr", label: "告警日清率" },
  { key: "am", label: "平均模型占比率得分" },
  { key: "tr", label: "调优模型占比率" },
  { key: "sc", label: "考核得分" },
];
export const BASE_DATE = new Date(2026, 3, 15);

export function fd(d: Date): string {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function makeRng(seed: number) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}

export const scores: PlantScore[] = (() => {
  const r = makeRng(42);
  return PLANTS.map((n, i) => {
    const lf = +(0.2 + r() * 0.8).toFixed(2);
    const lr = +(35 + r() * 60).toFixed(1);
    const cr = +(45 + r() * 50).toFixed(1);
    const nf = +(55 + r() * 40).toFixed(1);
    const aa = +(50 + r() * 45).toFixed(1);
    const ar = +(25 + r() * 70).toFixed(1);
    const acr = +(20 + r() * 70).toFixed(1);
    const tr = +(40 + r() * 50).toFixed(1);
    const amr = +(30 + r() * 60).toFixed(1);
    const sc = +(
      Math.min(lf, 1) * 20 + (lr / 100) * 20 + (cr / 100) * 20 +
      (nf / 100) * 10 + (aa / 100) * 10 + Math.min(ar / 100, 1) * 10 + Math.min(acr / 100, 1) * 10
    ).toFixed(1);
    return {
      name: n, color: PLANT_COLORS[i], lf, lr, cr, nf, aa, ar, acr, tr, amr, sc: +sc,
      sm: SPECIALTIES.map(() => Math.floor(30 + r() * 60)),
      onlineRate: Number((60 + r() * 35).toFixed(0)),
      sa: SPECIALTIES.map(() => Math.floor(15 + r() * 50)),
      saP: +(30 + r() * 60).toFixed(1),
      saH: +(40 + r() * 50).toFixed(1),
      saA: +(50 + r() * 40).toFixed(1),
      ss: SPECIALTIES.map(() => Math.floor(5 + r() * 25)),
      ssC: +(20 + r() * 60).toFixed(1),
      ssU: +(10 + r() * 50).toFixed(1),
      sca: SPECIALTIES.map(() => Math.floor(3 + r() * 18)),
      scaC: +(15 + r() * 60).toFixed(1),
      scaU: +(5 + r() * 30).toFixed(1),
    };
  });
})();

const MODEL_NAMES = ["轴温预警","振动预警","压力预警","效率预警","油温预警","排温预警","火检预警","进气预警","泄漏预警","转速预警","温差预警","负荷预警"];
const FAULT_DESCS = [
  "轴承温度持续升高，已超过一级预警阈值，建议检查润滑油系统",
  "振动幅值突增，频谱分析显示1X分量异常偏高",
  "排气温度离散度增大，个别热电偶读数偏差超限",
  "压气机效率下降明显，可能存在叶片结垢或损伤",
  "润滑油温度偏高，冷却系统可能存在异常",
  "火焰检测信号波动，燃烧不稳定风险增加",
  "进气压损增大，滤网可能需要清洗或更换",
  "负荷波动异常，调节系统响应偏慢",
];

export const alerts: Alert[] = (() => {
  const r = makeRng(77);
  const BD = new Date(2026, 3, 15, 14, 0);
  const now = BD.getTime();
  const arr: Alert[] = [];
  for (let i = 0; i < 40; i++) {
    const d = new Date(now - Math.floor(r() * 1440) * 60000);
    const isUnack = (now - d.getTime() <= 2 * 3600 * 1000) && (r() > 0.3);
    arr.push({
      id: i,
      plant: PLANTS[Math.floor(r() * 10)],
      spec: SPECIALTIES[Math.floor(r() * 5)],
      model: MODEL_NAMES[Math.floor(r() * 12)],
      valChange: (r() > 0.5 ? "+" : "-") + (r() * 20).toFixed(1) + "℃",
      time: String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0") + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"),
      timeSort: d.getTime(),
      fault: FAULT_DESCS[Math.floor(r() * 8)],
      level: r() > 0.65 ? "一级" : r() > 0.35 ? "二级" : "三级",
      isUnack,
    });
  }
  arr.sort((a, b) => b.timeSort - a.timeSort);
  return arr;
})();

const CASE_NAMES = ["轴承磨损分析报告","燃烧室高温诊断","压气机失速分析","润滑油劣化评估","振动频谱异常报告","排气温度偏差分析","启停异常分析报告","效率衰减诊断报告","叶片损伤评估","密封泄漏分析"];
const SOURCE_NAMES = ["M1023-轴温预警","M2045-振动预警","M3012-压力预警","M4078-效率预警","M5034-油温预警","M6021-排温预警","告警单-20260412-003","告警单-20260413-007","告警单-20260414-001","告警单-20260415-005"];

export const cases: Case[] = (() => {
  const r = makeRng(55);
  const BD = new Date(2026, 3, 15, 14, 0);
  const now = BD.getTime();
  const arr: Case[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now - Math.floor(r() * 10080) * 60000);
    const isUnack = (now - d.getTime() <= 2 * 3600 * 1000) && (r() > 0.3);
    arr.push({
      id: i,
      plant: PLANTS[Math.floor(r() * 10)],
      spec: SPECIALTIES[Math.floor(r() * 5)],
      caseName: CASE_NAMES[Math.floor(r() * 10)],
      caseType: r() > 0.5 ? "系统生成" : "用户导入",
      source: SOURCE_NAMES[Math.floor(r() * 10)],
      fault: FAULT_DESCS[Math.floor(r() * 8)],
      time: (d.getMonth() + 1) + "/" + d.getDate() + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"),
      timeSort: d.getTime(),
      status: r() > 0.3 ? "已完成" : "进行中",
      isUnack,
    });
  }
  arr.sort((a, b) => b.timeSort - a.timeSort);
  return arr;
})();

export function makeDaily(nd: number): DailyRecord[] {
  const r = makeRng(99);
  const BD = new Date(2026, 3, 15);
  const arr: DailyRecord[] = [];
  for (let i = nd - 1; i >= 0; i--) {
    const d = new Date(BD);
    d.setDate(d.getDate() - i);
    const e: DailyRecord = {
      date: fd(d),
      dl: (d.getMonth() + 1) + "/" + d.getDate(),
      nm: 0, na: 0, nc: 0,
    };
    for (let j = 0; j < 10; j++) {
      e[`lf_${j}`] = +(0.2 + r() * 0.8).toFixed(2);
      e[`lr_${j}`] = +(30 + r() * 65).toFixed(1);
      e[`tr_${j}`] = +(35 + r() * 55).toFixed(1);
      e[`am_${j}`] = +(45 + r() * 45).toFixed(1);
      e[`cr_${j}`] = +(40 + r() * 55).toFixed(1);
      e[`sc_${j}`] = +(45 + r() * 45).toFixed(1);
      e[`nm_${j}`] = Math.floor(r() * 5);
      e[`na_${j}`] = Math.floor(r() * 12);
      e[`nc_${j}`] = Math.floor(r() * 8);
    }
    e.nm = Math.floor(r() * 9);
    e.na = Math.floor(r() * 25);
    e.nc = Math.floor(r() * 14);
    arr.push(e);
  }
  return arr;
}

export function aggMonth(data: DailyRecord[], avgFields: string[]): DailyRecord[] {
  const mp: Record<string, DailyRecord[]> = {};
  data.forEach(d => {
    const k = String(d.date).slice(0, 7);
    if (!mp[k]) mp[k] = [];
    mp[k].push(d);
  });
  const res: DailyRecord[] = [];
  Object.keys(mp).sort().forEach(k => {
    const ents = mp[k];
    const o: DailyRecord = { date: k, dl: k.slice(5), nm: 0, na: 0, nc: 0 };
    avgFields.forEach(f => {
      const s = ents.reduce((acc, e) => acc + (Number(e[f]) || 0), 0);
      o[f] = +(s / ents.length).toFixed(2);
    });
    (["nm", "na", "nc"] as const).forEach(f => {
      o[f] = ents.reduce((acc, e) => acc + (Number(e[f]) || 0), 0);
      for (let i = 0; i < 10; i++) {
        const key = `${f}_${i}`;
        o[key] = ents.reduce((acc, e) => acc + (Number(e[key]) || 0), 0);
      }
    });
    res.push(o);
  });
  return res;
}
