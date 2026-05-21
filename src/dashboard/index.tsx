import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './style/index.modules.less';
import { scores, alerts, cases, makeDaily, aggMonth, BASE_DATE, TIME_CUTS, TFS, fd } from './mockData';
import type { SortDir } from './types';
import DashboardHeader from './components/DashboardHeader';
import KpiBar from './components/KpiBar';
import StatusTab from './components/StatusTab';
import TrendTab from './components/TrendTab';

const initStart = fd(new Date(BASE_DATE.getTime() - 7 * 86400000));
const initEnd = fd(BASE_DATE);

const Dashboard: React.FC = () => {
  const [tab, setTab] = useState<'status' | 'trend'>('status');

  const [sortKey, setSortKey] = useState('sc');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selPlant, setSelPlant] = useState(scores[0]?.name || '');
  const [alertPage, setAlertPage] = useState(0);
  const [casePage, setCasePage] = useState(0);
  const [caseSortDir, setCaseSortDir] = useState<SortDir>('desc');

  const [qStart, setQStart] = useState(initStart);
  const [qEnd, setQEnd] = useState(initEnd);
  const [activePreset, setActivePreset] = useState('近一周');

  const [trendSel, setTrendSel] = useState<number[]>([0,1,2,3,4,5,6,7,8,9]);
  const [qtStart, setQtStart] = useState(initStart);
  const [qtEnd, setQtEnd] = useState(initEnd);
  const [trendPreset, setTrendPreset] = useState('近一周');
  const [appliedTStart, setAppliedTStart] = useState(initStart);
  const [appliedTEnd, setAppliedTEnd] = useState(initEnd);

  const trendData = useMemo(() => {
    const nd = Math.max(1, Math.round((new Date(appliedTEnd).getTime() - new Date(appliedTStart).getTime()) / 86400000));
    const raw = makeDaily(nd);
    if (nd > 31) {
      const avgFields: string[] = [];
      TFS.forEach(f => { for (let i = 0; i < 10; i++) avgFields.push(`${f.key}_${i}`); });
      return aggMonth(raw, avgFields);
    }
    return raw;
  }, [appliedTStart, appliedTEnd]);

  const isMonthly = useMemo(() => {
    const nd = Math.max(1, Math.round((new Date(appliedTEnd).getTime() - new Date(appliedTStart).getTime()) / 86400000));
    return nd > 31;
  }, [appliedTStart, appliedTEnd]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleCaseSort = () => setCaseSortDir(d => d === 'desc' ? 'asc' : 'desc');

  const handlePreset = (label: string, days: number) => {
    setActivePreset(label);
    setQStart(fd(new Date(BASE_DATE.getTime() - days * 86400000)));
    setQEnd(initEnd);
  };

  const handleTrendPreset = (label: string, days: number) => {
    setTrendPreset(label);
    const start = fd(new Date(BASE_DATE.getTime() - days * 86400000));
    setQtStart(start); setQtEnd(initEnd);
    setAppliedTStart(start); setAppliedTEnd(initEnd);
  };

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        {/* <DashboardHeader /> */}
        <KpiBar />

        <div className={styles.tabBar}>
          <div className={styles.tabBtns}>
            <button className={clsx(styles.tabBtn, tab === 'status' && styles.tabBtnActive)} onClick={() => setTab('status')}>
              状态统计
            </button>
            <button className={clsx(styles.tabBtn, tab === 'trend' && styles.tabBtnActive)} onClick={() => setTab('trend')}>
              趋势统计
            </button>
          </div>

          {tab === 'status' && (
            <div className={styles.tabControls}>
              <span className={styles.tabDateLabel}>统计时间段</span>
              <input type="date" className={styles.dateInput} value={qStart} onChange={e => { setQStart(e.target.value); setActivePreset(''); }} />
              <span className={styles.tabDateSep}>—</span>
              <input type="date" className={styles.dateInput} value={qEnd} onChange={e => { setQEnd(e.target.value); setActivePreset(''); }} />
              {TIME_CUTS.map(c => (
                <button key={c.l} className={clsx(styles.cutBtn, activePreset === c.l && styles.cutBtnOn)} onClick={() => handlePreset(c.l, c.d)}>
                  {c.l}
                </button>
              ))}
              <button className={clsx(styles.toggle, styles.toggleOn, styles.toggleQuery)}>查询</button>
            </div>
          )}

          {tab === 'trend' && (
            <div className={styles.tabControls}>
              <span className={styles.tabDateLabel}>统计时间段</span>
              <input type="date" className={styles.dateInput} value={qtStart} onChange={e => { setQtStart(e.target.value); setTrendPreset(''); }} />
              <span className={styles.tabDateSep}>—</span>
              <input type="date" className={styles.dateInput} value={qtEnd} onChange={e => { setQtEnd(e.target.value); setTrendPreset(''); }} />
              {TIME_CUTS.map(c => (
                <button key={c.l} className={clsx(styles.cutBtn, trendPreset === c.l && styles.cutBtnOn)} onClick={() => handleTrendPreset(c.l, c.d)}>
                  {c.l}
                </button>
              ))}
              <button className={clsx(styles.toggle, styles.toggleOn, styles.toggleQuery)} onClick={() => { setAppliedTStart(qtStart); setAppliedTEnd(qtEnd); }}>
                查询
              </button>
            </div>
          )}
        </div>

        <div className={styles.tabContent}>
          {tab === 'status' ? (
            <StatusTab
              scores={scores}
              sortKey={sortKey}
              sortDir={sortDir}
              selPlant={selPlant}
              alertPage={alertPage}
              casePage={casePage}
              caseSortDir={caseSortDir}
              alerts={alerts}
              cases={cases}
              onSort={handleSort}
              onSelPlant={setSelPlant}
              onAlertPage={setAlertPage}
              onCasePage={setCasePage}
              onCaseSort={handleCaseSort}
            />
          ) : (
            <TrendTab
              data={trendData}
              selectedPlants={trendSel}
              isMonthly={isMonthly}
              onTogglePlant={i => setTrendSel(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
              onSelectAll={() => setTrendSel([0,1,2,3,4,5,6,7,8,9])}
              onSelectNone={() => setTrendSel([])}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
