import React from 'react';
import clsx from 'clsx';
import styles from './style/index.module.less';

const kpiData = [
  { label: '综合健康分', val: '87', valClass: styles.kpiValHealth },
  {
    label: '轮毂转速',
    val: (
      <>
        {' '}
        13.8 <span className={styles.kpiUnit}>RPM</span>{' '}
      </>
    ),
    valClass: styles.kpiValPrimary,
  },
  {
    label: '风速',
    val: (
      <>
        {' '}
        8.2 <span className={styles.kpiUnit}>m/s</span>{' '}
      </>
    ),
    valClass: styles.kpiValPrimary,
  },
  {
    label: '今日告警',
    val: (
      <>
        {' '}
        3 <span className={styles.kpiAlertText}>↑ 1台</span>{' '}
      </>
    ),
    valClass: styles.kpiValPrimary,
  },
];

export default function KpiRow() {
  return (
    <div className={styles.kpiRow}>
      {kpiData.map((m, i) => (
        <div key={i} className={styles.kpiCard}>
          <span className={styles.kpiLabel}>{m.label}</span>
          <span className={clsx(styles.kpiVal, m.valClass)}>{m.val}</span>
        </div>
      ))}
    </div>
  );
}
