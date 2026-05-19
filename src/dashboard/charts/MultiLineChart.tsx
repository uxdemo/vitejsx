import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { DailyRecord } from '../types';
import { PLANTS, PLANT_COLORS } from '../mockData';
import styles from '../style/index.modules.less';
import { useChartColors } from './chartTheme';

interface Props {
  data: DailyRecord[];
  selectedPlants: number[];
  field: string;
  height?: number;
}

const MultiLineChart: React.FC<Props> = ({ data, selectedPlants, field, height = 180 }) => {
  const c = useChartColors();

  if (selectedPlants.length === 0 || data.length === 0) {
    return <div className={styles.chartEmpty} style={{ height }}>请选择电厂</div>;
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText, fontSize: 11 },
    },
    grid: { left: 36, right: 8, top: 10, bottom: 24, containLabel: false },
    xAxis: {
      type: 'category',
      data: data.map(d => String(d.dl)),
      axisLine: { lineStyle: { color: c.axisLine } },
      axisTick: { show: false },
      axisLabel: {
        color: c.axisLabel,
        fontSize: 8,
        interval: Math.max(0, Math.floor(data.length / 7) - 1),
      },
    },
    yAxis: {
      type: 'value',
      axisLine:  { show: false },
      axisTick:  { show: false },
      axisLabel: { color: c.axisLabel, fontSize: 8 },
      splitLine: { lineStyle: { color: c.splitLine, type: 'dashed' as const } },
    },
    series: selectedPlants.map(pi => ({
      type: 'line' as const,
      name: PLANTS[pi],
      data: data.map(d => {
        const v = d[`${field}_${pi}`];
        return v != null ? Number(v) : null;
      }),
      lineStyle: { color: PLANT_COLORS[pi], width: 1.5 },
      itemStyle: { color: PLANT_COLORS[pi] },
      symbolSize: 3,
      smooth: true,
      connectNulls: true,
    })),
  };

  return (
    <div className={styles.chart} style={{ height }}>
      <ReactECharts option={option} style={{ height: '100%' }} />
    </div>
  );
};

export default MultiLineChart;
