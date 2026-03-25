import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import ReactECharts from 'echarts-for-react';
import { ALARMS, TimeRangeKey } from './constant';
import { C } from './colors';
import { ecXAxis, ecYAxis, ecTooltip, ecLine, ecMarkLine, ecLegend } from './ecOptions';
import { useChartData } from './useChartData';
import AlarmPanel from './AlarmPanel';
import styles from './style/index.module.less';

const chartStyle = { height: '100%', width: '100%' };

/* grid presets — kept compact so plot area is maximised */
const gridBottom = { top: 4, right: 8,  bottom: 22, left: 20 }; // legend at bottom
const gridRight  = { top: 4, right: 60, bottom: 2,  left: 22 }; // legend at right

const RightPanel = () => {
  const [tab, setTab] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('近七天');
  const activeCount = ALARMS.filter((a) => a.status === 'active').length;
  const { chartData, tickInterval } = useChartData(timeRange);

  const healthOption = useMemo(
    () => ({
      dataset: { source: chartData.healthData },
      grid: gridBottom,
      xAxis: ecXAxis(true, tickInterval),
      yAxis: ecYAxis(40, 100),
      tooltip: ecTooltip,
      legend: ecLegend('horizontal', { bottom: 0 }),
      series: [
        {
          ...ecLine('健康分', C.blue, 2),
          markLine: ecMarkLine([
            { y: 80, color: C.warning, name: '参考80' },
            { y: 60, color: C.error,   name: '干预60' },
          ]),
        },
      ],
    }),
    [chartData.healthData, tickInterval],
  );

  const consistOption = useMemo(
    () => ({
      dataset: { source: chartData.consistData },
      grid: gridBottom,
      xAxis: ecXAxis(true, tickInterval),
      yAxis: ecYAxis(0, 220, (v) => v + '%'),
      tooltip: ecTooltip,
      legend: ecLegend('horizontal', { bottom: 0 }),
      series: [
        {
          ...ecLine('变桨角度', C.blue),
          markLine: ecMarkLine([
            { y: 100, color: C.warning, name: '参考100%' },
            { y: 200, color: C.error,   name: '干预200%' },
          ]),
        },
        ecLine('变桨电流', C.success),
        ecLine('驱动扭矩', C.purple),
        ecLine('超级电容', C.warning),
        ecLine('电机温度', C.pink),
      ],
    }),
    [chartData.consistData, tickInterval],
  );

  const vibOption = useMemo(
    () => ({
      dataset: { source: chartData.vibData },
      grid: gridRight,
      xAxis: ecXAxis(false, tickInterval),
      yAxis: ecYAxis(0, 100),
      tooltip: ecTooltip,
      legend: ecLegend('vertical', { right: 4, top: 'middle' }),
      series: [
        ecLine('SS_STD', C.blue),
        ecLine('SS_2P',  C.success),
        ecLine('FA_STD', C.purple),
        ecLine('FA_2P',  C.warning),
      ],
    }),
    [chartData.vibData, tickInterval],
  );

  const imbOption = useMemo(
    () => ({
      dataset: { source: chartData.imbData },
      grid: gridRight,
      xAxis: ecXAxis(false, tickInterval),
      yAxis: ecYAxis(0, 250),
      tooltip: ecTooltip,
      legend: ecLegend('vertical', { right: 4, top: 'middle' }),
      series: [
        ecLine('weight',  C.blue),
        ecLine('aero',    C.success),
        ecLine('corner',  C.warning),
        ecLine('balance', C.error),
      ],
    }),
    [chartData.imbData, tickInterval],
  );

  const aeOption = useMemo(
    () => ({
      dataset: { source: chartData.aeData },
      grid: gridRight,
      xAxis: ecXAxis(false, tickInterval),
      yAxis: ecYAxis(0, 0.35),
      tooltip: ecTooltip,
      legend: ecLegend('vertical', { right: 4, top: 'middle' }),
      series: [
        {
          ...ecLine('重构误差', C.blue),
          markLine: ecMarkLine([
            { y: 0.15, color: C.ecBlue, name: '参考0.15' },
            { y: 0.2,  color: C.error,  name: '干预0.20' },
          ]),
        },
        {
          name: '异常',
          type: 'scatter' as const,
          encode: { x: 't', y: '异常' },
          symbolSize: 6,
          itemStyle: { color: C.error },
        },
      ],
    }),
    [chartData.aeData, tickInterval],
  );

  return (
    <div className={styles.rightPanel}>
      {/* Block 1: Tabs + Trend/Alarm */}
      <div className={clsx(styles.chartCard, styles.chartCardLg)}>
        <div className={styles.chartCardHeader}>
          <div className={styles.tabsRow}>
            <span className={clsx(styles.tab, tab === 0 && styles.tabActive)} onClick={() => setTab(0)}>
              趋势监测
            </span>
            <span className={clsx(styles.tab, tab === 1 && styles.tabActive)} onClick={() => setTab(1)}>
              报警列表 <span className={styles.alarmBadge}>{activeCount}</span>
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
              <ReactECharts option={healthOption} style={chartStyle} notMerge />
            </div>
          </div>
        ) : (
          <AlarmPanel />
        )}
      </div>

      {tab === 0 && (
        <>
          {/* Block 2: 传感器一致性偏差 */}
          <div className={clsx(styles.chartCard, styles.chartCardMd)}>
            <div className={styles.chartCardHeader}>
              <div className={styles.chartTitleRow}>
                <div className={styles.titleBarSm} />
                传感器一致性偏差
              </div>
            </div>
            <div className={styles.chartSubNote}>参考100% / 干预200%</div>
            <div className={styles.chartBody}>
              <ReactECharts option={consistOption} style={chartStyle} notMerge />
            </div>
          </div>

          {/* Block 3: 振动 / 不平衡 / AE */}
          <div className={styles.block3}>
            <div className={clsx(styles.chartCard, styles.subChartCard)}>
              <div className={clsx(styles.chartTitleRow, styles.chartTitleRowMb)}>
                <div className={styles.titleBarSm} />
                振动指标
              </div>
              <div className={styles.chartBody}>
                <ReactECharts option={vibOption} style={chartStyle} notMerge />
              </div>
            </div>

            <div className={clsx(styles.chartCard, styles.subChartCard)}>
              <div className={clsx(styles.chartTitleRow, styles.chartTitleRowMb)}>
                <div className={styles.titleBarSm} />
                不平衡指标
              </div>
              <div className={styles.chartBody}>
                <ReactECharts option={imbOption} style={chartStyle} notMerge />
              </div>
            </div>

            <div className={clsx(styles.chartCard, styles.subChartCard)}>
              <div className={clsx(styles.chartTitleRow, styles.chartTitleRowMb)}>
                <div className={styles.titleBarSm} />
                AE数据偏差
              </div>
              <div className={styles.chartBody}>
                <ReactECharts option={aeOption} style={chartStyle} notMerge />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RightPanel;
