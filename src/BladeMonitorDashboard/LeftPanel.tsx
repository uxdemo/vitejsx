import React from 'react';
import clsx from 'clsx';
import turbineImg from './style/images/turbine.png';
import { BLADE_ROWS, BladeRow } from './constant';
import styles from './style/index.module.less';

export default function LeftPanel() {
  return (
    <div className={styles.leftPanel}>
      <div className={styles.sectionTitle}>
        <div className={styles.titleBar} />
        叶片实时状态
      </div>
      <div className={styles.panelContent}>
        <div className={styles.turbineWrap}>
          <img src={turbineImg} className={styles.turbineImg} alt="Turbine" />
          <div className={styles.speedBadge}>
            <span className={styles.speedVal}>13.8</span>
            <span className={styles.speedUnit}>RPM</span>
          </div>
          <div className={clsx(styles.bladeBadge, styles.bladeBadgeSuccess, styles.badgeB1)}>B1: 96</div>
          <div className={clsx(styles.bladeBadge, styles.bladeBadgeSuccess, styles.badgeB2)}>B2: 92</div>
          <div className={clsx(styles.bladeBadge, styles.bladeBadgeWarning, styles.badgeB3)}>B3: 74</div>
        </div>

        <div className={styles.dataGridHeader}>
          <div className={styles.colLeft}>指标</div>
          <div className={styles.colRight}>B1</div>
          <div className={styles.colRight}>B2</div>
          <div className={styles.colRight}>B3</div>
        </div>
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
  );
}
