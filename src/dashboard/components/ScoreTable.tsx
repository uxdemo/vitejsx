import React from 'react';
import clsx from 'clsx';
import type { PlantScore, SortDir } from '../types';
import styles from '../style/index.modules.less';

interface Props {
  sorted: PlantScore[];
  sortKey: string;
  sortDir: SortDir;
  selPlant: string;
  onSort: (key: string) => void;
  onSelect: (name: string) => void;
}

const SI = () => (
  <span className={styles.sortIcon}>
    <span className={styles.up}>▲</span>
    <span className={styles.down}>▼</span>
  </span>
);

const COLS = [
  { k: 'name', l: '电厂',           sort: false },
  { k: 'lf',   l: '人均登录次数',   sort: true  },
  { k: 'lr',   l: '人员登录率',     sort: true  },
  { k: 'cr',   l: '告警日清率',     sort: true  },
  { k: 'amr',  l: '平均模型数量占比率', sort: true },
  { k: 'tr',   l: '调优模型占比率', sort: true  },
  { k: 'sc',   l: '考核得分',       sort: true  },
];

const ccScore = (v: number) =>
  v > 80 ? styles.colorGood : v > 60 ? styles.colorWarn : styles.colorBad;

const ScoreTable: React.FC<Props> = ({ sorted, sortKey, sortDir, selPlant, onSort, onSelect }) => (
  <div className={styles.scoreWrap}>
    <table className={styles.table}>
      <thead>
        <tr>
          {COLS.map(c => (
            <th
              key={c.k}
              className={c.sort ? (sortKey === c.k ? styles[sortDir] : '') : styles.nosort}
              onClick={c.sort ? () => onSort(c.k) : undefined}
            >
              {c.l}{c.sort && <SI />}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((p, i) => {
          const rk = i + 1;
          const rkCls = rk <= 3 ? [styles.rank1, styles.rank2, styles.rank3][rk - 1] : styles.rankN;
          const isSel = p.name === selPlant;
          return (
            <tr
              key={p.name}
              className={clsx(styles.scoreRow, isSel && styles.scoreRowSel)}
              style={isSel ? { '--pc': p.color } as React.CSSProperties : undefined}
              onClick={() => onSelect(p.name)}
            >
              <td>
                <span className={clsx(styles.rank, rkCls)}>{rk}</span>
                <span className={isSel ? styles.plantNameSel : styles.plantName}>{p.name}</span>
              </td>
              <td>{p.lf}</td>
              <td>{p.lr}%</td>
              <td className={ccScore(+p.cr)}>{p.cr}%</td>
              <td>{p.amr}%</td>
              <td>{p.tr}%</td>
              <td className={styles.plantNameSel} style={{ '--pc': p.color } as React.CSSProperties}>
                {p.sc}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ScoreTable;
