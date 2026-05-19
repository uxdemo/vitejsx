import React from 'react';
import clsx from 'clsx';
import styles from '../style/index.modules.less';

const KpiBar: React.FC = () => (
  <div className={styles.kpiBar}>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>10<span className={styles.kpiUnit}>家</span></div>
      <div className={styles.kpiLabel}>接入电厂</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>18/10<span className={styles.kpiUnit}>台</span></div>
      <div className={styles.kpiLabel}>燃机台数/运行台数</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>16.8<span className={styles.kpiValSuffix}>万+</span></div>
      <div className={styles.kpiLabel}>接入测点</div>
    </div>
    <div className={clsx(styles.kpiItem, styles.kpiItemWide)}>
      <div className={styles.kpiVal}>
        <span className={styles.kpiOnline}>2432</span>/2100
        <span className={styles.kpiUnit}>个</span>
      </div>
      <div className={styles.kpiLabel}>预警模型总数/在线模型数</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>2319<span className={styles.kpiUnit}>个</span></div>
      <div className={styles.kpiLabel}>累计告警</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>981<span className={styles.kpiUnit}>个</span></div>
      <div className={styles.kpiLabel}>累计案例</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>23<span className={styles.kpiUnit}>个</span></div>
      <div className={styles.kpiLabel}>今日新增告警</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>6<span className={styles.kpiUnit}>个</span></div>
      <div className={styles.kpiLabel}>本周新增案例</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>37<span className={styles.kpiUnit}>人</span></div>
      <div className={styles.kpiLabel}>当前登录人数</div>
    </div>
    <div className={styles.kpiItem}>
      <div className={styles.kpiVal}>189<span className={styles.kpiUnit}>天</span></div>
      <div className={styles.kpiLabel}>累计监测天数</div>
    </div>
  </div>
);

export default KpiBar;
