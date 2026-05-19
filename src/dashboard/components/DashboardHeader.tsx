import React, { useState, useEffect } from 'react';
import styles from '../style/index.modules.less';

function formatTime(d: Date): string {
  return d.getFullYear() + "/" +
    String(d.getMonth() + 1).padStart(2, "0") + "/" +
    String(d.getDate()).padStart(2, "0") + " " +
    String(d.getHours()).padStart(2, "0") + ":" +
    String(d.getMinutes()).padStart(2, "0") + ":" +
    String(d.getSeconds()).padStart(2, "0");
}

const DashboardHeader: React.FC = () => {
  const [time, setTime] = useState(formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.hd}>
      <div>
        <div className={styles.hdTitle}>清洁能源燃机预警诊断系统</div>
        <div className={styles.hdSub}>统计概览 · 平台运行全景监控</div>
      </div>
      <div className={styles.hdRight}>
        <div className={styles.hdTime}>{time}</div>
        <div className={styles.hdOrg}>平台公司 · 领导驾驶舱</div>
      </div>
    </div>
  );
};

export default DashboardHeader;
