import React from 'react';
import clsx from 'clsx';
import type { Alert } from '../types';
import styles from '../style/index.modules.less';
import Pager from './Pager';

interface Props {
  alerts: Alert[];
  page: number;
  onPageChange: (p: number) => void;
}

const PAGE_SIZE = 10;
const lcCls = (level: string) =>
  level === '一级' ? styles.levelHigh : level === '二级' ? styles.levelMid : styles.levelLow;

const AlertTable: React.FC<Props> = ({ alerts, page, onPageChange }) => {
  const pageData = alerts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(alerts.length / PAGE_SIZE);

  return (
    <div className={styles.sec}>
      <div className={styles.secHeader}>
        <span className={clsx(styles.dot, styles.dotAlert)} />
        <span className={styles.secTitle}>实时告警列表</span>
        <span className={styles.subLink}>›</span>
        <span className={clsx(styles.badge, styles.badgeMl)}>LIVE</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.nosort}>级别</th>
            <th className={styles.nosort}>电厂</th>
            <th className={styles.nosort}>专业</th>
            <th className={styles.nosort}>模型名称</th>
            <th className={styles.nosort}>数值变化</th>
            <th className={styles.nosort}>故障现象</th>
            <th className={styles.nosort}>最近预警时间</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((a) => (
            <tr key={a.id} className={a.isUnack ? styles.trUnack : ''}>
              <td><span className={lcCls(a.level)}>{a.level}</span></td>
              <td className={styles.cellPrimary}>{a.plant}</td>
              <td>{a.spec}</td>
              <td className={styles.cellPrimary}>{a.model}</td>
              <td className={a.valChange.charAt(0) === '+' ? styles.valUp : styles.valDown}>{a.valChange}</td>
              <td>
                <a className={clsx(styles.link, styles.linkSm)}>
                  {a.fault.length > 12 ? a.fault.slice(0, 12) + '...' : a.fault}
                </a>
              </td>
              <td className={styles.alertTime}>{a.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} total={totalPages} onChange={onPageChange} />
    </div>
  );
};

export default AlertTable;
