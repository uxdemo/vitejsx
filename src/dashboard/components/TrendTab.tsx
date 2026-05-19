import React from 'react';
import clsx from 'clsx';
import type { DailyRecord } from '../types';
import { PLANTS, PLANT_COLORS, TFS } from '../mockData';
import styles from '../style/index.modules.less';
import MultiLineChart from '../charts/MultiLineChart';

interface Props {
  data: DailyRecord[];
  selectedPlants: number[];
  isMonthly: boolean;
  onTogglePlant: (i: number) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

const COUNT_CHARTS = [
  { field: 'nm', label: '新增模型趋势', dotCls: 'dotInfo'    as const },
  { field: 'na', label: '新增告警趋势', dotCls: 'dotAlert'   as const },
  { field: 'nc', label: '新增案例趋势', dotCls: 'dotWarning' as const },
];

const TrendTab: React.FC<Props> = ({ data, selectedPlants, isMonthly, onTogglePlant, onSelectAll, onSelectNone }) => {
  const tpLabel = isMonthly ? '按月统计' : '按日统计';

  return (
    <div className={styles.trendBody}>
      {/* Plant selector */}
      <div className={styles.plantSelector}>
        <span className={styles.plantSelLabel}>统计电厂</span>
        <span className={styles.plantSelDivider} />
        {PLANTS.map((p, i) => {
          const on = selectedPlants.includes(i);
          return (
            <span
              key={p}
              className={clsx(styles.plantTag, on && styles.plantTagOn)}
              style={{ '--pc': PLANT_COLORS[i] } as React.CSSProperties}
              onClick={() => onTogglePlant(i)}
            >
              <span className={styles.plantTagDot} />
              {p}
            </span>
          );
        })}
        <span className={styles.plantSelDivider} />
        <button className={clsx(styles.cutBtn, styles.cutBtnOn)} onClick={onSelectAll}>全选</button>
        <button className={styles.cutBtn} onClick={onSelectNone}>清空</button>
        <span className={styles.trendInfo}>{tpLabel} · 共 {data.length} 个数据点</span>
      </div>

      {/* TFS trend charts */}
      <div className={styles.grid3}>
        {TFS.map((f, fi) => (
          <div key={f.key} className={styles.sec}>
            <div className={styles.secHeader}>
              <span
                className={clsx(styles.dot, styles.dotDyn)}
                style={{ '--dc': PLANT_COLORS[fi % 10] } as React.CSSProperties}
              />
              <span className={styles.secTitle}>{f.label} 趋势</span>
            </div>
            <MultiLineChart data={data} selectedPlants={selectedPlants} field={f.key} height={180} />
          </div>
        ))}
      </div>

      {/* Count trend charts */}
      <div className={styles.grid3}>
        {COUNT_CHARTS.map(c => (
          <div key={c.field} className={styles.sec}>
            <div className={styles.secHeader}>
              <span className={clsx(styles.dot, styles[c.dotCls])} />
              <span className={styles.secTitle}>{c.label}</span>
            </div>
            <MultiLineChart data={data} selectedPlants={selectedPlants} field={c.field} height={180} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendTab;
