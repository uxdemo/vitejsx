import React from 'react';
import styles from '../style/index.modules.less';

interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

const Pager: React.FC<Props> = ({ page, total, onChange }) => {
  if (total <= 1) return null;
  return (
    <div className={styles.pager}>
      <button className={styles.pageBtn} onClick={() => onChange(page - 1)} disabled={page === 0}>上一页</button>
      <span className={styles.pagerInfo}>
        第 <span className={styles.pagerCur}>{page + 1}</span> / {total} 页
      </span>
      <button className={styles.pageBtn} onClick={() => onChange(page + 1)} disabled={page >= total - 1}>下一页</button>
    </div>
  );
};

export default Pager;
