import React from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import { scores, SPECIALTIES, SPECIALTY_COLORS } from '../mockData';
import styles from '../style/index.modules.less';
import { useChartColors } from './chartTheme';

const StackedBarLineChart: React.FC = () => {
  const c = useChartColors();
  const xLabels = scores.map(p => p.name.length > 4 ? p.name.slice(0, 4) : p.name);

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
    grid: { left: 40, right: 52, top: 10, bottom: 28, containLabel: false },
    xAxis: {
      type: 'category',
      data: xLabels,
      axisLine: { lineStyle: { color: c.axisLine } },
      axisTick: { show: false },
      axisLabel: { color: c.axisLabel, fontSize: 9 },
    },
    yAxis: [
      { type: 'value', ...axisBase },
      { type: 'value', max: 100, ...axisBase, splitLine: { show: false }, axisLabel: { color: c.axisLabel, fontSize: 9, formatter: '{value}%' } },
    ],
    series: [
      ...SPECIALTIES.map((sp, i) => ({
        type: 'bar' as const,
        name: sp,
        stack: 'models',
        data: scores.map(p => p.sm[i]),
        itemStyle: {
          color: SPECIALTY_COLORS[i],
          borderRadius: i === SPECIALTIES.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0],
        },
        barMaxWidth: 28,
      })),
      {
        type: 'line' as const,
        name: '上线率',
        yAxisIndex: 1,
        data: scores.map(p => p.onlineRate),
        lineStyle: { color: '#0FC38F', width: 2 },
        itemStyle: { color: '#FFFFFF', borderColor: '#0FC38F', borderWidth: 1.5 },
        symbolSize: 5,
        smooth: true,
        z: 10,
      },
    ],
  };

  return (
    <div className={clsx(styles.chart, styles.chartH120)}>
      <ReactECharts option={option} style={{ height: '100%' }} />
    </div>
  );
};

export default StackedBarLineChart;
