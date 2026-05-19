import React from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import styles from '../style/index.modules.less';
import { useChartColors } from './chartTheme';

export interface DonutItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  items: DonutItem[];
}

const DonutChart: React.FC<Props> = ({ items }) => {
  const c = useChartColors();
  const total = items.reduce((a, b) => a + b.value, 0);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: c.tooltipBg,
      borderColor: c.tooltipBorder,
      textStyle: { color: c.tooltipText, fontSize: 11 },
      formatter: (p: any) =>
        `<div style="font-weight:700;color:${p.color}">${p.name}</div>` +
        `<div>数量: <b>${p.value}</b></div>` +
        `<div>占比: <b>${p.percent}%</b></div>`,
    },
    legend: {
      orient: 'vertical',
      right: 8,
      top: 'center',
      icon: 'roundRect',
      itemWidth: 18,
      itemHeight: 8,
      textStyle: { color: c.axisLabel, fontSize: 11 },
      formatter: (name: string) => {
        const item = items.find(i => i.name === name);
        const pct = item && total > 0 ? (item.value / total * 100).toFixed(1) : '0';
        return `${name}   ${pct}%`;
      },
    },
    series: [{
      type: 'pie',
      radius: ['38%', '62%'],
      center: ['35%', '50%'],
      data: items.map(d => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: d.color },
        label: { show: false },
        labelLine: { show: false },
      })),
      emphasis: { scale: true, scaleSize: 4 },
    }],
  };

  return (
    <div className={styles.donutOuter}>
      <div className={clsx(styles.chart, styles.chartH140)}>
        <ReactECharts option={option} style={{ height: '100%' }} />
      </div>
      <div className={styles.donutCenter}>
        <div className={styles.donutNum}>{total}</div>
        <div className={styles.donutLabel}>总计</div>
      </div>
    </div>
  );
};

export default DonutChart;
