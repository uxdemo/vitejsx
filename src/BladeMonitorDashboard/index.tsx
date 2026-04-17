import { useState, useEffect } from 'react';
import KpiRow from './KpiRow';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import styles from './style/index.modules.less';

export default function BladeMonitorDashboard() {
  return (
    <div className={styles.root}>
      <div className={styles.canvas}>
        <KpiRow />
        <div className={styles.bottomArea}>
          <LeftPanel />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
