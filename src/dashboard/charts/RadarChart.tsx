import React from 'react';
import ReactECharts from 'echarts-for-react';
import clsx from 'clsx';
import type { PlantScore } from '../types';
import styles from '../style/index.modules.less';
import { useChartColors } from './chartTheme';

interface Props {
  plant: PlantScore;
  maxLf: number;
}

const RadarChart: React.FC<Props> = ({ plant: p, maxLf }) => {
  const c = useChartColors();
  const lfNorm = Math.min((p.lf / Math.max(maxLf, 0.01)) * 100, 100);

  const option = {
    backgroundColor: 'transparent',
    radar: {
      shape: 'polygon',
      indicator: [
        { name: '人员登录率', max: 100 },
        { name: '告警日清率', max: 100 },
        { name: '平均模型占比', max: 100 },
        { name: '调优模型占比', max: 100 },
        { name: '活跃度', max: 100 },
      ],
      splitNumber: 4,
      center: ['50%', '52%'],
      radius: '58%',
      splitArea: {
        areaStyle: {
          color: [
            'rgba(128,128,128,0.04)',
            'rgba(128,128,128,0.02)',
            'rgba(128,128,128,0.04)',
            'rgba(128,128,128,0.02)',
          ],
        },
      },
      splitLine: { lineStyle: { color: c.splitLine } },
      axisLine: { lineStyle: { color: c.axisLine } },
      axisName: { color: c.axisLabel, fontSize: 11, padding: [0, 4] },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [p.lr, p.cr, p.amr, p.tr, lfNorm],
            areaStyle: { color: p.color, opacity: 0.2 },
            lineStyle: { color: p.color, width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: { color: '#FFFFFF', borderColor: p.color, borderWidth: 1.5 },
          },
        ],
      },
    ],
  };

  return (
    <div className={styles.radarOuter}>
      <div className={clsx(styles.chart, styles.chartH260)}>
        <ReactECharts option={option} style={{ height: '100%' }} />
      </div>
      <div className={styles.radarCenter}>
        <div className={styles.radarScore}>{p.sc}</div>
        <div className={styles.radarLabel}>总得分</div>
      </div>
    </div>
  );
};

export default RadarChart;
