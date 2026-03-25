import React, { useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { Select, Table } from 'antd';
const AntSelect = Select as React.ComponentType<any>;
const AntOption = Select.Option as React.ComponentType<any>;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
} from 'recharts';

import {
  OFM_C,
  CHART_C,
  ALARMS,
  BLADE_ROWS,
  TIME_CFG,
  AXIS_TICK,
  CHART_GRID,
  AlarmLevel,
  AlarmStatus,
  BladeRow,
  TimeRangeKey,
} from './constant';
import styles from './index.module.less';

/* ============================================================
   Local helpers (data generation)
   ============================================================ */
function genData(base: number, noise: number, trend: number, len: number): number[] {
  const r: number[] = [];
  for (let i = 0; i < len; i++) {
    const cyc = Math.sin((i / len) * Math.PI * 4) * noise * 0.3;
    const rn = (Math.random() - 0.5) * noise;
    r.push(Math.round(Math.max(0, base + cyc + rn + (trend * i) / len) * 10) / 10);
  }
  return r;
}

function genSparse(
  base: number,
  noise: number,
  trend: number,
  len: number,
  sparsity: number
): (number | null)[] {
  const r: (number | null)[] = [];
  for (let i = 0; i < len; i++) {
    if (Math.random() < sparsity) {
      r.push(null);
    } else {
      const cyc = Math.sin((i / len) * Math.PI * 3) * noise * 0.3;
      const rn = (Math.random() - 0.5) * noise;
      r.push(Math.round(Math.max(0, base + cyc + rn + (trend * i) / len) * 10) / 10);
    }
  }
  return r;
}

/* ============================================================
   Helper Components
   ============================================================ */
interface TooltipPayloadItem {
  name: string;
  value: number | null;
  stroke?: string;
  fill?: string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      {payload
        .filter((p) => p.value != null)
        .map((p, i) => (
          <div
            key={i}
            className={styles.tooltipRow}
            style={{ color: p.stroke || p.fill || p.color || OFM_C.textPrimary }}>
            <span
              className={styles.tooltipDot}
              style={{ background: p.stroke || p.fill || p.color || OFM_C.primary }}
            />
            <span className={styles.tooltipKey}>{p.name}:</span>
            <span className={styles.tooltipVal}>
              {typeof p.value === 'number' ? Math.round(p.value * 100) / 100 : p.value}
            </span>
          </div>
        ))}
    </div>
  );
}

interface LegendItem {
  color: string;
  label: string;
  type?: 'dash' | 'dot' | 'line';
}

interface ChartLegendProps {
  items: LegendItem[];
  layout?: 'horizontal' | 'vertical';
}

function ChartLegend({ items, layout = 'horizontal' }: ChartLegendProps) {
  return (
    <div className={clsx(styles.legend, layout === 'vertical' && styles.legendVertical)}>
      {items.map((it, i) => (
        <span key={i} className={styles.legendItem}>
          {it.type === 'dash' ? (
            <span className={styles.legendDash} style={{ borderTop: `2px dashed ${it.color}` }} />
          ) : it.type === 'dot' ? (
            <span className={styles.legendDot} style={{ background: it.color }} />
          ) : (
            <span className={styles.legendLine} style={{ background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   Alarm column helpers
   ============================================================ */
const LEVEL_LABEL: Record<AlarmLevel, string> = { critical: '严重', warning: '警告', info: '信息' };
const LEVEL_CLASS: Record<AlarmLevel, string> = {
  critical: styles.levelCritical,
  warning: styles.levelWarning,
  info: styles.levelInfo,
};

/* ============================================================
   Main Dashboard
   ============================================================ */
export default function BladeMonitorDashboard() {
  const [tab, setTab] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('近七天');
  const [fLevel, setFLevel] = useState('全部级别');
  const [fType, setFType] = useState('全部类型');

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 990;
      setScale(Math.min(scaleX, scaleY));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cfg = TIME_CFG[timeRange];
  const N = cfg.points;
  const tickInterval = timeRange === '近七天' ? 2 : timeRange === '近30天' ? 23 : 47;
  const activeCount = ALARMS.filter((a) => a.status === 'active').length;

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
      consistData: labels.map((t, i) => ({
        t,
        变桨角度: cPitch[i],
        变桨电流: cCurr[i],
        驱动扭矩: cTorq[i],
        超级电容: cCap[i],
        电机温度: cTemp[i],
      })),
      vibData: labels.map((t, i) => ({ t, SS_STD: vSsStd[i], SS_2P: vSs2p[i], FA_STD: vFaStd[i], FA_2P: vFa2p[i] })),
      imbData: labels.map((t, i) => ({ t, weight: iW[i], aero: iA[i], corner: iC[i], balance: iB[i] })),
      aeData: labels.map((t, i) => ({
        t,
        重构误差: Math.round(aeErr[i] * 1000) / 1000,
        异常: aeErr[i] > 0.2 ? Math.round(aeErr[i] * 1000) / 1000 : null,
      })),
    };
  }, [N, cfg]);

  const alarmColumns = [
    { title: '发生时间', dataIndex: 'time', key: 'time', width: 160 },
    { title: '对象', dataIndex: 'object', key: 'object', width: 80 },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      align: 'center' as const,
      render: (lv: AlarmLevel) => (
        <span className={clsx(styles.levelTag, LEVEL_CLASS[lv])}>
          {LEVEL_LABEL[lv]}
        </span>
      ),
    },
    { title: '报警类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '报警内容', dataIndex: 'content', key: 'content' },
    { title: '处置建议', dataIndex: 'desc', key: 'desc' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: AlarmStatus) => (
        <span className={s === 'active' ? styles.statusActive : styles.statusResolved}>
          {s === 'active' ? '● 未恢复' : '○ 已恢复'}
        </span>
      ),
    },
  ];

  const kpiData = [
    { label: '综合健康分', val: '87', valColor: '#FAAD14' },
    {
      label: '轮毂转速',
      val: (
        <>
          13.8 <span style={{ fontSize: 14, color: OFM_C.primary, fontWeight: 600 }}>RPM</span>
        </>
      ),
      valColor: OFM_C.primary,
    },
    {
      label: '风速',
      val: (
        <>
          8.2 <span style={{ fontSize: 14, color: OFM_C.primary, fontWeight: 600 }}>m/s</span>
        </>
      ),
      valColor: OFM_C.primary,
    },
    {
      label: '今日告警',
      val: (
        <>
          3 <span style={{ fontSize: 12, color: OFM_C.error, fontWeight: 'normal', marginLeft: 8 }}>↑ 1台</span>
        </>
      ),
      valColor: OFM_C.primary,
    },
  ];

  return (
    <div className={styles.root}>
      <div
        className={styles.canvas}
        style={{ transform: `scale(${scale})` }}>
        {/* =========================================================
            TOP KPI ROW (Centered, Blue Transparency)
        ========================================================= */}
        <div className={styles.kpiRow}>
          {kpiData.map((m, i) => (
            <div key={i} className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{m.label}</span>
              <span className={styles.kpiVal} style={{ color: m.valColor }}>
                {m.val}
              </span>
            </div>
          ))}
        </div>

        {/* =========================================================
            BOTTOM AREA (Left/Right Columns Alignment)
        ========================================================= */}
        <div className={styles.bottomArea}>
          {/* =========================================================
              LEFT PANEL: 叶片实时状态
          ========================================================= */}
          <div className={styles.leftPanel}>
            <div className={styles.sectionTitle}>
              <div className={styles.titleBar} />
              叶片实时状态
            </div>
            <div className={styles.panelContent}>
              {/* Turbine image with badge overlays */}
              <div className={styles.turbineWrap}>
                <img
                  src="/turbine.png"
                  className={styles.turbineImg}
                  alt="Turbine"
                />

                <div className={styles.speedBadge}>
                  <span className={styles.speedVal}>13.8</span>
                  <span className={styles.speedUnit}>RPM</span>
                </div>

                {/* B1 tag (top-left blade) */}
                <div className={clsx(styles.bladeBadge, styles.bladeBadgeSuccess, styles.badgeB1)}>
                  B1: 96
                </div>

                {/* B2 tag (top-right blade) */}
                <div className={clsx(styles.bladeBadge, styles.bladeBadgeSuccess, styles.badgeB2)}>
                  B2: 92
                </div>

                {/* B3 tag (bottom blade) */}
                <div className={clsx(styles.bladeBadge, styles.bladeBadgeWarning, styles.badgeB3)}>
                  B3: 74
                </div>
              </div>

              {/* Data grid header */}
              <div className={styles.dataGridHeader}>
                <div style={{ textAlign: 'left' }}>指标</div>
                <div style={{ textAlign: 'right' }}>B1</div>
                <div style={{ textAlign: 'right' }}>B2</div>
                <div style={{ textAlign: 'right' }}>B3</div>
              </div>

              {/* Data grid rows */}
              {BLADE_ROWS.map((r: BladeRow, i: number) => (
                <div key={i} className={styles.dataGridRow}>
                  <div className={styles.dataGridLabel}>{r.label}</div>
                  <div className={styles.dataGridVal}>{r.b1}</div>
                  <div className={styles.dataGridVal}>{r.b2}</div>
                  <div className={r.b3 > 5 ? styles.dataGridValWarn : styles.dataGridVal}>{r.b3}</div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              RIGHT PANEL (Adaptive rows, 10px gap)
          ========================================================= */}
          <div className={styles.rightPanel}>
            {/* Block 1 (flex: 1.5): Tabs + Trend/Alarm */}
            <div className={styles.chartCardLg}>
              <div className={styles.chartCardHeader}>
                <div className={styles.tabsRow}>
                  <span
                    className={clsx(styles.tab, tab === 0 && styles.tabActive)}
                    onClick={() => setTab(0)}>
                    趋势监测
                  </span>
                  <span
                    className={clsx(styles.tab, tab === 1 && styles.tabActive)}
                    onClick={() => setTab(1)}>
                    报警列表{' '}
                    <span className={styles.alarmBadge}>{activeCount}</span>
                  </span>
                </div>
                {tab === 0 && (
                  <div className={styles.timeRangeRow}>
                    <span className={styles.timeRangeHint}>1min刷新</span>
                    <div className={styles.timeRangeBtns}>
                      {(['近七天', '近30天', '近一年'] as TimeRangeKey[]).map((t) => (
                        <div
                          key={t}
                          className={clsx(styles.timeRangeBtn, timeRange === t && styles.timeRangeBtnActive)}
                          onClick={() => setTimeRange(t)}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {tab === 0 ? (
                <div className={styles.trendSection}>
                  <div className={styles.trendHeader}>
                    <div className={styles.chartTitleRow}>
                      <div className={styles.titleBarSm} />
                      不平衡量趋势
                    </div>
                    <div className={styles.chartHealthScore}>87</div>
                  </div>
                  <div className={styles.chartSubNote}>参考线80(关注) / 干预线60(干预)</div>
                  <div className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.healthData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                        <CartesianGrid {...CHART_GRID} />
                        <XAxis
                          dataKey="t"
                          tick={AXIS_TICK}
                          interval={tickInterval}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis domain={[40, 100]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={80} stroke={OFM_C.warning} strokeDasharray="5 3" strokeWidth={1} />
                        <ReferenceLine y={60} stroke={OFM_C.error} strokeDasharray="5 3" strokeWidth={1} />
                        <Line
                          type="monotone"
                          dataKey="健康分"
                          stroke={OFM_C.primary}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: OFM_C.primary, stroke: OFM_C.bgPage }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <ChartLegend
                    items={[
                      { color: OFM_C.primary, label: '健康分' },
                      { color: OFM_C.warning, label: '参考80', type: 'dash' },
                      { color: OFM_C.error, label: '干预60', type: 'dash' },
                    ]}
                  />
                </div>
              ) : (
                <div className={styles.alarmSection}>
                  <div className={styles.alarmFilterRow}>
                    <AntSelect
                      className="ofm-dark-select"
                      dropdownClassName="ofm-select-popup"
                      value={fLevel}
                      onChange={setFLevel}
                      style={{ width: 140 }}>
                      <AntOption value="全部级别">全部级别</AntOption>
                      <AntOption value="critical">严重</AntOption>
                      <AntOption value="warning">警告</AntOption>
                    </AntSelect>
                    <AntSelect
                      className="ofm-dark-select"
                      dropdownClassName="ofm-select-popup"
                      value={fType}
                      onChange={setFType}
                      style={{ width: 140 }}>
                      <AntOption value="全部类型">全部类型</AntOption>
                      <AntOption value="振动">振动</AntOption>
                      <AntOption value="过载">过载</AntOption>
                    </AntSelect>
                  </div>
                  <Table
                    className="ofm-table"
                    columns={alarmColumns}
                    dataSource={ALARMS}
                    pagination={false}
                    scroll={{ y: 'calc(100vh - 350px)' }}
                    rowKey="id"
                    size="middle"
                  />
                </div>
              )}
            </div>

            {/* Block 2 and 3 only visible in trend tab */}
            {tab === 0 && (
              <>
                {/* Block 2 (flex: 1): 传感器一致性偏差 */}
                <div className={styles.chartCardMd}>
                  <div className={styles.chartCardHeader}>
                    <div className={styles.chartTitleRow}>
                      <div className={styles.titleBarSm} />
                      传感器一致性偏差
                    </div>
                  </div>
                  <div className={styles.chartSubNote}>参考100% / 干预200%</div>
                  <div className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.consistData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                        <CartesianGrid {...CHART_GRID} />
                        <XAxis
                          dataKey="t"
                          tick={AXIS_TICK}
                          interval={tickInterval}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 220]}
                          tick={AXIS_TICK}
                          tickFormatter={(v) => v + '%'}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <ReferenceLine y={100} stroke={OFM_C.warning} strokeDasharray="5 3" strokeWidth={1} />
                        <ReferenceLine y={200} stroke={OFM_C.error} strokeDasharray="5 3" strokeWidth={1} />
                        <Line type="monotone" dataKey="变桨角度" stroke={CHART_C.c1} strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="变桨电流" stroke={CHART_C.c2} strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="驱动扭矩" stroke={CHART_C.c3} strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="超级电容" stroke={CHART_C.c4} strokeWidth={1.5} dot={false} />
                        <Line type="monotone" dataKey="电机温度" stroke={CHART_C.c5} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <ChartLegend
                    items={[
                      { color: CHART_C.c1, label: '变桨角度' },
                      { color: CHART_C.c2, label: '变桨电流' },
                      { color: CHART_C.c3, label: '驱动扭矩' },
                      { color: CHART_C.c4, label: '超级电容' },
                      { color: CHART_C.c5, label: '电机温度' },
                    ]}
                  />
                </div>

                {/* Block 3 (flex: 1): 振动指标, 不平衡指标, AE数据偏差 */}
                <div className={styles.block3}>
                  {/* 振动指标 */}
                  <div className={styles.subChartCard}>
                    <div className={styles.chartTitleRow} style={{ marginBottom: 8 }}>
                      <div className={styles.titleBarSm} />
                      振动指标
                    </div>
                    <div className={styles.chartLegendLayout}>
                      <div className={styles.chartLegendBody}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData.vibData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid {...CHART_GRID} />
                            <XAxis dataKey="t" tick={false} interval={tickInterval} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 100]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" dataKey="SS_STD" stroke={CHART_C.c1} strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="SS_2P" stroke={CHART_C.c2} strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="FA_STD" stroke={CHART_C.c3} strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="FA_2P" stroke={CHART_C.c4} strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={styles.chartLegendSide}>
                        <ChartLegend
                          items={[
                            { color: CHART_C.c1, label: 'SS_STD' },
                            { color: CHART_C.c2, label: 'SS_2P' },
                            { color: CHART_C.c3, label: 'FA_STD' },
                            { color: CHART_C.c4, label: 'FA_2P' },
                          ]}
                          layout="vertical"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 不平衡指标 */}
                  <div className={styles.subChartCard}>
                    <div className={styles.chartTitleRow} style={{ marginBottom: 8 }}>
                      <div className={styles.titleBarSm} />
                      不平衡指标
                    </div>
                    <div className={styles.chartLegendLayout}>
                      <div className={styles.chartLegendBody}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData.imbData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid {...CHART_GRID} />
                            <XAxis dataKey="t" tick={false} interval={tickInterval} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 250]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke={CHART_C.c1}
                              strokeWidth={1.5}
                              dot={false}
                              connectNulls={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="aero"
                              stroke={CHART_C.c2}
                              strokeWidth={1.5}
                              dot={false}
                              connectNulls={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="corner"
                              stroke={CHART_C.c4}
                              strokeWidth={1.5}
                              dot={false}
                              connectNulls={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="balance"
                              stroke={OFM_C.error}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={styles.chartLegendSide}>
                        <ChartLegend
                          items={[
                            { color: CHART_C.c1, label: 'weight' },
                            { color: CHART_C.c2, label: 'aero' },
                            { color: CHART_C.c4, label: 'corner' },
                            { color: OFM_C.error, label: 'balance' },
                          ]}
                          layout="vertical"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AE数据偏差 */}
                  <div className={styles.subChartCard}>
                    <div className={styles.chartTitleRow} style={{ marginBottom: 8 }}>
                      <div className={styles.titleBarSm} />
                      AE数据偏差
                    </div>
                    <div className={styles.chartLegendLayout}>
                      <div className={styles.chartLegendBody}>
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={chartData.aeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid {...CHART_GRID} />
                            <XAxis dataKey="t" tick={false} interval={tickInterval} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 0.35]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <ReferenceLine y={0.15} stroke={CHART_C.c7} strokeDasharray="5 3" strokeWidth={1} />
                            <ReferenceLine y={0.2} stroke={OFM_C.error} strokeDasharray="5 3" strokeWidth={1} />
                            <Line
                              type="monotone"
                              dataKey="重构误差"
                              stroke={CHART_C.c1}
                              strokeWidth={1.5}
                              dot={false}
                            />
                            <Scatter dataKey="异常" fill={OFM_C.error} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={styles.chartLegendSide}>
                        <ChartLegend
                          items={[
                            { color: CHART_C.c1, label: '重构误差' },
                            { color: OFM_C.error, label: '异常', type: 'dot' },
                          ]}
                          layout="vertical"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
