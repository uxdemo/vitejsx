/* ============================================================
   Alarm types and data
   ============================================================ */
export type AlarmLevel = 'critical' | 'warning' | 'info';
export type AlarmStatus = 'active' | 'resolved';

export interface AlarmRecord {
  id: string;
  time: string;
  object: string;
  level: AlarmLevel;
  type: string;
  content: string;
  desc: string;
  status: AlarmStatus;
}

export const ALARMS: AlarmRecord[] = [
  {
    id: 'ALT-20240105-001',
    time: '2024-01-05 08:32:15',
    object: '1#',
    level: 'critical',
    type: '过载',
    content: '持续大风导致部件过载，超出阈值20%',
    desc: '需紧急降频',
    status: 'active',
  },
  {
    id: 'ALT-20240105-002',
    time: '2024-01-05 10:12:08',
    object: '1#',
    level: 'warning',
    type: '振动',
    content: 'FA方向STD与2P振动耦合值突变',
    desc: '关注并检查传感器',
    status: 'active',
  },
  {
    id: 'ALT-20240105-003',
    time: '2024-01-05 11:45:22',
    object: '1#',
    level: 'warning',
    type: '温度',
    content: '变桨电机温度持续上升，达到85℃',
    desc: '降低负荷，持续观察',
    status: 'active',
  },
  {
    id: 'ALT-20240104-001',
    time: '2024-01-04 15:20:10',
    object: '1#',
    level: 'info',
    type: '通讯',
    content: '与远端站心跳丢失一包',
    desc: '网络波动，已恢复',
    status: 'resolved',
  },
];

/* ============================================================
   Blade rows
   ============================================================ */
export interface BladeRow {
  label: string;
  b1: number;
  b2: number;
  b3: number;
}

export const BLADE_ROWS: BladeRow[] = [
  { label: '变桨角度 °', b1: 3.2, b2: 3.1, b3: 5.8 },
  { label: '变桨电流 A', b1: 12.3, b2: 11.8, b3: 18.5 },
  { label: '变桨功率 kW', b1: 2.1, b2: 2.0, b3: 3.4 },
  { label: '驱动扭矩 Nm', b1: 45.2, b2: 44.8, b3: 46.1 },
  { label: '电机温度 °C', b1: 42.3, b2: 41.8, b3: 44.1 },
  { label: '变频器温度 °C', b1: 38.5, b2: 38.2, b3: 39.1 },
  { label: '电池箱温度 °C', b1: 28.3, b2: 27.9, b3: 28.5 },
  { label: '超级电容 V', b1: 48.2, b2: 48.0, b3: 47.8 },
];

/* ============================================================
   Time range config
   ============================================================ */
export type TimeRangeKey = '近七天' | '近30天' | '近一年';

function makeLabels24H(): string[] {
  return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
}

function makeLabels7D(): string[] {
  return Array.from({ length: 168 }, (_, i) => `D${Math.floor(i / 24) + 1} ${String(i % 24).padStart(2, '0')}:00`);
}

function makeLabels30D(): string[] {
  return Array.from({ length: 720 }, (_, i) => `D${Math.floor(i / 24) + 1}`);
}

export const TIME_CFG: Record<TimeRangeKey, { points: number; labels: () => string[] }> = {
  近七天: { points: 24, labels: makeLabels24H },
  近30天: { points: 168, labels: makeLabels7D },
  近一年: { points: 720, labels: makeLabels30D },
};
