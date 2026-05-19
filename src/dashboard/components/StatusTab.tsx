import React, { useMemo } from 'react';
import clsx from 'clsx';
import type { PlantScore, Alert, Case, SortDir } from '../types';
import { SPECIALTIES, SPECIALTY_COLORS } from '../mockData';
import styles from '../style/index.modules.less';
import RadarChart from '../charts/RadarChart';
import StackedBarLineChart from '../charts/StackedBarLineChart';
import DualChart from '../charts/DualChart';
import DonutChart from '../charts/DonutChart';
import ScoreTable from './ScoreTable';
import AlertTable from './AlertTable';
import CaseTable from './CaseTable';

interface Props {
  scores: PlantScore[];
  sortKey: string;
  sortDir: SortDir;
  selPlant: string;
  alertPage: number;
  casePage: number;
  caseSortDir: SortDir;
  alerts: Alert[];
  cases: Case[];
  onSort: (key: string) => void;
  onSelPlant: (name: string) => void;
  onAlertPage: (p: number) => void;
  onCasePage: (p: number) => void;
  onCaseSort: () => void;
}

const LegendDot: React.FC<{ color: string; label: string; isLine?: boolean }> = ({ color, label, isLine }) => (
  <span className={styles.legendItem} style={{ '--lc': color } as React.CSSProperties}>
    {isLine ? <i className={styles.legendLine} /> : <i className={styles.legendDot} />}
    {label}
  </span>
);

const StatusTab: React.FC<Props> = ({
  scores, sortKey, sortDir, selPlant, alertPage, casePage, caseSortDir,
  alerts, cases, onSort, onSelPlant, onAlertPage, onCasePage, onCaseSort,
}) => {
  const sorted = useMemo(() => {
    return scores.slice().sort((a, b) => {
      const av = (a as any)[sortKey], bv = (b as any)[sortKey];
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [scores, sortKey, sortDir]);

  const selPObj = useMemo(
    () => scores.find(x => x.name === selPlant) || sorted[0],
    [scores, selPlant, sorted]
  );
  const maxLf = useMemo(() => Math.max(...scores.map(s => s.lf)), [scores]);

  const sortedCases = useMemo(
    () => cases.slice().sort((a, b) => caseSortDir === 'asc' ? a.timeSort - b.timeSort : b.timeSort - a.timeSort),
    [cases, caseSortDir]
  );

  const alertItems = scores.map(p => ({
    name: p.name.length > 4 ? p.name.slice(0, 4) : p.name,
    bar: p.sa.reduce((a, b) => a + b, 0),
    color: p.color, saP: +p.saP, saH: +p.saH, saA: +p.saA,
  }));

  const ticketItems = scores.map(p => ({
    name: p.name.length > 4 ? p.name.slice(0, 4) : p.name,
    bar: p.ss.reduce((a, b) => a + b, 0),
    color: p.color, ssC: +p.ssC, ssU: +p.ssU,
  }));

  const caseItems = scores.map(p => ({
    name: p.name.length > 4 ? p.name.slice(0, 4) : p.name,
    bar: p.sca.reduce((a, b) => a + b, 0),
    color: p.color, scaC: +p.scaC, scaU: +p.scaU,
  }));

  const spModels = SPECIALTIES.map((sp, i) => ({
    name: sp, value: scores.reduce((a, p) => a + p.sm[i], 0), color: SPECIALTY_COLORS[i],
  }));
  const spCases = SPECIALTIES.map((sp, i) => ({
    name: sp, value: scores.reduce((a, p) => a + p.sca[i], 0), color: SPECIALTY_COLORS[i],
  }));

  if (!selPObj) return null;

  return (
    <div className={styles.statusBody}>
      {/* ROW 1: Radar + Score table */}
      <div className={styles.sec}>
        <div className={styles.secHeader}>
          <span className={clsx(styles.dot, styles.dotPrimary)} />
          <span className={styles.secTitle}>考核指标与能力画像</span>
          <span className={styles.secNote}>点击右侧排名查看对应电厂画像</span>
        </div>
        <div className={styles.radarLayout}>
          <div className={styles.radarCol} style={{ '--pc': selPObj.color } as React.CSSProperties}>
            <div className={styles.radarPlant}>{selPObj.name}</div>
            <RadarChart plant={selPObj} maxLf={maxLf} />
          </div>
          <ScoreTable sorted={sorted} sortKey={sortKey} sortDir={sortDir} selPlant={selPlant} onSort={onSort} onSelect={onSelPlant} />
        </div>
      </div>

      {/* ROW 2: 模型统计 + 告警统计 */}
      <div className={styles.grid2}>
        <div className={clsx(styles.sec, styles.secFlex)}>
          <div className={styles.secHeader}>
            <span className={clsx(styles.dot, styles.dotPrimary)} />
            <span className={styles.secTitle}>模型统计</span>
            <div className={styles.secHeaderEnd}>
              {SPECIALTIES.map((sp, i) => <LegendDot key={sp} color={SPECIALTY_COLORS[i]} label={sp} />)}
              <LegendDot color="#0FC38F" label="上线率" isLine />
            </div>
          </div>
          <div className={styles.secFlexBody}><StackedBarLineChart /></div>
        </div>

        <div className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={clsx(styles.dot, styles.dotAlert)} />
            <span className={styles.secTitle}>告警统计</span>
            <div className={styles.secHeaderEnd}>
              {[{c:'#00C5F9',l:'告警总数'},{c:'#00E5FF',l:'平均告警数占比率'},{c:'#E020A1',l:'告警处理率'},{c:'#FFD93D',l:'告警准确率'}].map(x => (
                <LegendDot key={x.l} color={x.c} label={x.l} isLine />
              ))}
            </div>
          </div>
          <DualChart items={alertItems} lines={[{key:'saP',label:'平均告警数占比率',color:'#00E5FF'},{key:'saH',label:'告警处理率',color:'#E020A1'},{key:'saA',label:'告警准确率',color:'#FFD93D'}]} barColor="#00C5F9" />
        </div>
      </div>

      {/* ROW 3: 告警单统计 + 案例统计 */}
      <div className={styles.grid2}>
        <div className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={clsx(styles.dot, styles.dotWarning)} />
            <span className={styles.secTitle}>告警单统计</span>
            <div className={styles.secHeaderEnd}>
              {[{c:'#FF954D',l:'告警单数'},{c:'#0FC38F',l:'转换率'},{c:'#CC5DE8',l:'机组平均占比'}].map(x => (
                <LegendDot key={x.l} color={x.c} label={x.l} isLine />
              ))}
            </div>
          </div>
          <DualChart items={ticketItems} lines={[{key:'ssC',label:'转换率',color:'#0FC38F'},{key:'ssU',label:'机组平均占比',color:'#CC5DE8'}]} barColor="#4D96FF" />
        </div>

        <div className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={clsx(styles.dot, styles.dotCase)} />
            <span className={styles.secTitle}>案例统计</span>
            <div className={styles.secHeaderEnd}>
              {[{c:'#FF954D',l:'案例数量'},{c:'#0FC38F',l:'转化率'},{c:'#CC5DE8',l:'机组平均占比'}].map(x => (
                <LegendDot key={x.l} color={x.c} label={x.l} isLine />
              ))}
            </div>
          </div>
          <DualChart items={caseItems} lines={[{key:'scaC',label:'转化率',color:'#0FC38F'},{key:'scaU',label:'机组平均占比',color:'#CC5DE8'}]} barColor="#FF954D" />
        </div>
      </div>

      {/* ROW 4: Donut charts */}
      <div className={styles.grid2}>
        <div className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={clsx(styles.dot, styles.dotSuccess)} />
            <span className={styles.secTitle}>各专业模型数量统计</span>
          </div>
          <DonutChart items={spModels} />
        </div>
        <div className={styles.sec}>
          <div className={styles.secHeader}>
            <span className={clsx(styles.dot, styles.dotAccent)} />
            <span className={styles.secTitle}>各专业案例数量统计</span>
          </div>
          <DonutChart items={spCases} />
        </div>
      </div>

      {/* ROW 5: Alert list + Case list */}
      <div className={styles.grid2}>
        <AlertTable alerts={alerts} page={alertPage} onPageChange={onAlertPage} />
        <CaseTable cases={sortedCases} page={casePage} sortDir={caseSortDir} onPageChange={onCasePage} onSort={onCaseSort} />
      </div>
    </div>
  );
};

export default StatusTab;
