import React, { useState } from 'react';
import { Table, message } from 'antd';
import * as css from './styles/index.module.less';
import clsx from 'clsx';
import { createInitModels, STATUS_MAP } from './constant';
import type { ModelItem } from './constant';
import { Ic, Btn, Prog, Badge } from './ui';
import { Wizard } from './Wizard';
import { Detail } from './Detail';
import { AiPanel } from './AiPanel';

type AiNavAction = 'dashboard' | 'wizard' | 'detail' | 'addModel' | 'updateModel';

type PageName = 'dashboard' | 'wizard' | 'detail';

type CountsRecord = Record<string, number>;

const App = (): React.ReactElement => {
  const [page, setPage] = useState<PageName>('dashboard');
  const [selModel, setSelModel] = useState<ModelItem | null>(null);
  const [aiOpen, setAiOpen] = useState<boolean>(false);
  const [models, setModels] = useState<ModelItem[]>(createInitModels);
  const [filter, setFilter] = useState<string>('all');

  const showToast = (msg: string): void => {
    message.success(msg);
  };

  const handleAiNav = (act: AiNavAction, data?: ModelItem): void => {
    if (act === 'dashboard') {
      setPage('dashboard');
      setAiOpen(false);
    } else if (act === 'wizard') {
      setPage('wizard');
      setAiOpen(false);
    } else if (act === 'detail' && data) {
      setSelModel(data);
      setPage('detail');
      setAiOpen(false);
    } else if (act === 'addModel' && data) {
      setModels((p) => [data, ...p]);
      showToast('模型「' + data.name + '」已创建');
    } else if (act === 'updateModel' && data) {
      setModels((p) => p.map((m) => (m.id === data.id ? data : m)));
      showToast('模型已更新');
    }
  };

  const handleUpdate = (u: ModelItem): void => {
    setModels((p) => p.map((m) => (m.id === u.id ? u : m)));
    setSelModel(u);
    showToast('参数已更新');
  };

  const filtered: ModelItem[] = filter === 'all' ? models : models.filter((m) => m.status === filter);
  const counts: CountsRecord = { all: models.length };
  Object.keys(STATUS_MAP).forEach((s) => {
    counts[s] = models.filter((m) => m.status === s).length;
  });

  const runningCount: number = models.filter((m) => m.status === 'training' || m.status === 'optimizing').length;

  const metricClass = (v: number | null | undefined, good: number, bad: number): string => {
    if (v === null || v === undefined) return 'metricGray';
    return v >= good ? 'metricGreen' : v >= bad ? 'metricYellow' : 'metricRed';
  };

  return (
    <div className={css.appRoot}>
      <div className={css.appNav}>
        <div className={css.navBrand}>
          <div className={css.navLogo}>
            <Ic name="cpu" size={13} />
          </div>
          <span className={css.navTitle}>智能预警建模平台</span>
          <span className={css.navTag}>AI AUTO</span>
        </div>
        <div className={css.navActions}>
          <div className={css.navStatus}>
            <div className={css.navStatusDot} />
            <span className={css.navStatusText}>{runningCount + ' 运行中'}</span>
          </div>
          <div className={clsx(css.navAiBtn, aiOpen && css.navAiBtnActive)} onClick={() => setAiOpen(!aiOpen)}>
            <Ic name="sparkle" size={11} />
            <span className={css.navAiBtnText}>AI 助手</span>
          </div>
        </div>
      </div>

      <div className={clsx(css.appContent, aiOpen && css.appContentAiOpen)}>
        {/* Dashboard */}
        {page === 'dashboard' && (
          <div className={css.dashboardWrapper}>
            <div className={css.dashboardStats}>
              {(
                [
                  ['模型总数', counts.all, 'layers', 'var(--primary-color)', 'rgba(0,159,218,.08)'],
                  ['已完成', counts.completed || 0, 'check', 'var(--success-color)', 'rgba(15,195,143,.07)'],
                  [
                    '运行中',
                    (counts.training || 0) + (counts.optimizing || 0),
                    'activity',
                    'var(--blue-color)',
                    'rgba(0,197,249,.07)',
                  ],
                  ['待审核', counts.review || 0, 'eye', 'var(--th-pr)', 'rgba(167,139,250,.07)'],
                  ['未达标', counts.failed || 0, 'alert', 'var(--error-color)', 'rgba(255,84,19,.07)'],
                ] as [string, number, string, string, string][]
              ).map(([l, v, ic, c, bg]) => (
                <div key={String(l)} className={css.statCard}>
                  <div className={css.statCardBg} style={{ background: bg }} />
                  <div className={css.statCardLabel} style={{ color: c }}>
                    <Ic name={String(ic)} size={10} />
                    {l}
                  </div>
                  <div className={css.statCardValue}>{v}</div>
                </div>
              ))}
            </div>

            <div className={css.toolbar}>
              <div className={css.toolbarFilters}>
                {[
                  { k: 'all', l: '全部' },
                  { k: 'training', l: '训练中' },
                  { k: 'optimizing', l: '优化中' },
                  { k: 'review', l: '待审核' },
                  { k: 'completed', l: '已完成' },
                  { k: 'failed', l: '未达标' },
                ].map((f) => (
                  <button
                    key={f.k}
                    className={clsx(css.filterBtn, filter === f.k && css.filterBtnActive)}
                    onClick={() => setFilter(f.k)}>
                    {f.l}
                    {(counts[f.k] || 0) > 0 ? ' ' + (counts[f.k] || 0) : ''}
                  </button>
                ))}
              </div>
              <div className={css.toolbarActions}>
                <Btn icon="sparkle" small onClick={() => setAiOpen(true)}>
                  AI 语音建模
                </Btn>
                <Btn primary small icon="zap" onClick={() => setPage('wizard')}>
                  自动建模向导
                </Btn>
              </div>
            </div>

            <Table
              className={css.modelTable}
              dataSource={filtered}
              rowKey="id"
              pagination={false}
              {...({ tableLayout: 'fixed' } as any)}
              onRow={(m) => ({
                onClick: () => {
                  setSelModel(m);
                  setPage('detail');
                },
              })}
              columns={[
                {
                  title: '模型',
                  dataIndex: 'name',
                  width: '26%',
                  render: (_: unknown, m: ModelItem) => (
                    <div>
                      <div className={css.modelTableName}>{m.name}</div>
                      <div className={css.modelTableSub}>{m.sc + '·' + m.turb + '·' + m.pts + '点'}</div>
                    </div>
                  ),
                },
                {
                  title: '风场',
                  dataIndex: 'plant',
                  width: '9%',
                  render: (v: string) => <span className={css.modelTablePlant}>{v}</span>,
                },
                {
                  title: '准确率',
                  dataIndex: 'p',
                  width: '10%',
                  align: 'center',
                  render: (v: number | null) => (
                    <span className={clsx(css.modelTableMetric, css[metricClass(v, 90, 80)])}>{v ? v + '%' : '—'}</span>
                  ),
                },
                {
                  title: '召回率',
                  dataIndex: 'r',
                  width: '10%',
                  align: 'center',
                  render: (v: number | null) => (
                    <span className={clsx(css.modelTableMetric, css[metricClass(v, 90, 80)])}>{v ? v + '%' : '—'}</span>
                  ),
                },
                {
                  title: '误报率',
                  dataIndex: 'fa',
                  width: '10%',
                  align: 'center',
                  render: (v: number | null) => (
                    <span
                      className={clsx(
                        css.modelTableMetric,
                        v !== null ? (v <= 5 ? css.metricGreen : css.metricRed) : css.metricGray,
                      )}>
                      {v !== null ? v + '%' : '—'}
                    </span>
                  ),
                },
                {
                  title: '迭代',
                  dataIndex: 'iter',
                  width: '8%',
                  align: 'center',
                  render: (v: number) => <span className={css.modelTableIter}>{v}</span>,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  width: '21%',
                  render: (_: unknown, m: ModelItem) => (
                    <div>
                      <Badge status={m.status} />
                      {m.progress && (
                        <div className={css.modelTableProg}>
                          <Prog value={m.progress} />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  title: '',
                  key: 'arrow',
                  width: 36,
                  render: () => (
                    <div className={css.modelTableArrow}>
                      <Ic name="chevR" size={12} />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* Wizard */}
        {page === 'wizard' && (
          <Wizard
            onBack={() => setPage('dashboard')}
            onComplete={(ms: ModelItem[]) => {
              setModels((p) => [...ms, ...p]);
              showToast('已创建' + ms.length + '个模型');
              setPage('dashboard');
            }}
          />
        )}

        {/* Detail */}
        {page === 'detail' && selModel && (
          <Detail
            model={models.find((m) => m.id === selModel.id) || selModel}
            onBack={() => setPage('dashboard')}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      <AiPanel expanded={aiOpen} onToggle={() => setAiOpen(!aiOpen)} onNav={handleAiNav} models={models} />
    </div>
  );
};

export default App;
