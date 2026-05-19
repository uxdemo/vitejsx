import React from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import styles from '../style/index.modules.less';
import { useChartColors } from './chartTheme';

export interface DualChartItem {
  name: string;
  bar: number;
  color: string;
  [key: string]: number | string;
}

export interface LineConfig {
  key: string;
  label: string;
  color: string;
}

interface Props {
  items: DualChartItem[];
  lines: LineConfig[];
  barColor: string;
}

const DualChart: React.FC<Props> = ({ items, lines, barColor }) => {
  const c = useChartColors();

  const axisBase = {
    axisLine:  { show: false },
    axisTick:  { show: false },
    axisLabel: { color: c.axisLabel, fontSize: 9 },
    splitLine: { lineStyle: { color: c.splitLine, type: 'dashed' as const } },
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText, fontSize: 11 },
    },
    grid: { left: 38, right: 48, top: 10, bottom: 28, containLabel: false },
    xAxis: {
      type: 'category',
      data: items.map(d => d.name),
      axisLine: { lineStyle: { color: c.axisLine } },
      axisTick: { show: false },
      axisLabel: { color: c.axisLabel, fontSize: 9 },
    },
    yAxis: [
      { type: 'value', ...axisBase },
      { type: 'value', max: 100, ...axisBase, splitLine: { show: false }, axisLabel: { color: c.axisLabel, fontSize: 9, formatter: '{value}%' } },
    ],
    series: [
      {
        type: 'bar' as const,
        name: '总计',
        data: items.map(d => ({ value: d.bar, itemStyle: { color: barColor, borderRadius: [3, 3, 0, 0] } })),
        barMaxWidth: 28,
      },
      ...lines.map(line => ({
        type: 'line' as const,
        name: line.label,
        yAxisIndex: 1,
        data: items.map(d => Number(d[line.key])),
        lineStyle: { color: line.color, width: 1.5 },
        itemStyle: { color: '#FFFFFF', borderColor: line.color, borderWidth: 1.5 },
        symbolSize: 5,
        smooth: true,
        z: 10,
      })),
    ],
  };

  return (
    <div className={clsx(styles.chart, styles.chartH120)}>
      <ReactECharts option={option} style={{ height: '100%' }} />
    </div>
  );
};

export default DualChart;
