import { useState, useEffect } from 'react';
import KpiRow from './KpiRow';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import styles from './style/index.module.less';

export default function BladeMonitorDashboard() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setScale(Math.min(window.innerWidth / 1920, (window.innerHeight - 108) / 990));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.canvas} style={{ transform: `scale(${scale})` }}>
        <KpiRow />
        <div className={styles.bottomArea}>
          <LeftPanel />
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
