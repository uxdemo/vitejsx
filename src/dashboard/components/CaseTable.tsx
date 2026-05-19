import React from 'react';
import clsx from 'clsx';
import type { Case, SortDir } from '../types';
import styles from '../style/index.modules.less';
import Pager from './Pager';

interface Props {
  cases: Case[];
  page: number;
  sortDir: SortDir;
  onPageChange: (p: number) => void;
  onSort: () => void;
}

const PAGE_SIZE = 10;

const SI = () => (
  <span className={styles.sortIcon}>
    <span className={styles.up}>▲</span>
    <span className={styles.down}>▼</span>
  </span>
);

const CaseTable: React.FC<Props> = ({ cases, page, sortDir, onPageChange, onSort }) => {
  const pageData   = cases.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(cases.length / PAGE_SIZE);

  return (
    <div className={styles.sec}>
      <div className={styles.secHeader}>
        <span className={clsx(styles.dot, styles.dotCase)} />
        <span className={styles.secTitle}>本周案例列表</span>
        <span className={styles.subLink}>›</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.nosort}>电厂</th>
            <th className={styles.nosort}>专业</th>
            <th className={styles.nosort}>案例名称</th>
            <th className={styles.nosort}>案例类型</th>
            <th className={styles.nosort}>来源名称</th>
            <th className={styles.nosort}>故障现象</th>
            <th className={styles[sortDir]} onClick={onSort}>生成时间<SI /></th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(c => (
            <tr key={c.id} className={c.isUnack ? styles.trUnack : ''}>
              <td className={styles.cellPrimary}>{c.plant}</td>
              <td>{c.spec}</td>
              <td><a className={styles.link}>{c.caseName}</a></td>
              <td>
                <span className={c.caseType === '系统生成' ? styles.tagSystem : styles.tagManual}>
                  {c.caseType}
                </span>
              </td>
              <td><a className={clsx(styles.link, styles.linkSm)}>{c.source}</a></td>
              <td>
                <span className={styles.tooltip}>
                  <span className={styles.ellipsis}>{c.fault}</span>
                  <span className={styles.tipText}>{c.fault}</span>
                </span>
              </td>
              <td className={styles.caseTime}>{c.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} total={totalPages} onChange={onPageChange} />
    </div>
  );
};

export default CaseTable;
