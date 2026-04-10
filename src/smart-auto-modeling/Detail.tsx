import React, { useState } from 'react';
import { Tabs } from 'antd';
import * as css from './styles/index.module.less';
import clsx from 'clsx';
import { DEFAULT_PT_CFG, LV_COLORS } from './constant';
import type { ModelItem, PtCfgItem, DiagInfo } from './constant';
import { Ic, Btn, Badge } from './ui';

const AnyTabs = Tabs as any;
const AnyTabPane = Tabs.TabPane as any;

interface DetailProps {
  model: ModelItem;
  onBack: () => void;
  onUpdate?: (updated: ModelItem) => void;
}

interface EditVals {
  hi: number | string;
  lo: number | string;
  lv: string;
  sup: string;
}

export const Detail = ({ model, onBack, onUpdate }: DetailProps): React.ReactElement => {
  const [tab, setTab] = useState<string>('iter');
  const [editPt, setEditPt] = useState<number | null>(null);
  const [editVals, setEditVals] = useState<EditVals>({
    hi: 0,
    lo: 0,
    lv: '',
    sup: '',
  });

  const ptCfg: PtCfgItem[] = model.ptCfg && model.ptCfg.length > 0 ? model.ptCfg : DEFAULT_PT_CFG;

  const startEdit = (i: number): void => {
    setEditPt(i);
    setEditVals({
      hi: ptCfg[i].hi,
      lo: ptCfg[i].lo,
      lv: ptCfg[i].lv,
      sup: ptCfg[i].sup,
    });
  };
  const saveEdit = (): void => {
    const u = [...ptCfg];
    u[editPt!] = { ...u[editPt!], ...editVals } as PtCfgItem;
    if (onUpdate) onUpdate({ ...model, ptCfg: u });
    setEditPt(null);
  };

  const toggleLock = (i: number): void => {
    const u = [...ptCfg];
    u[i] = { ...u[i], lock: !u[i].lock };
    if (onUpdate) onUpdate({ ...model, ptCfg: u });
  };

  const metricColor = (v: number | null, good: number, bad: number): string =>
    v === null
      ? 'var(--disabled-color)'
      : v >= good
        ? 'var(--success-color)'
        : v >= bad
          ? 'var(--warning-color)'
          : 'var(--error-color)';

  return (
    <div className={css.detailWrap}>
      <div className={css.detailBack} onClick={onBack}>
        <Ic name="chevL" size={15} />
        <span>返回</span>
      </div>

      <div className={css.detailHeader}>
        <div>
          <div className={css.detailTitleRow}>
            <span className={css.detailTitle}>{model.name}</span>
            <Badge status={model.status} />
          </div>
          <div className={css.detailMeta}>
            <span>{model.plant}</span>
            <span>{model.type}</span>
            <span>{model.algo}</span>
            <span>{'迭代' + model.iter + '轮'}</span>
          </div>
        </div>
        <div className={css.detailActions}>
          {model.status === 'review' && (
            <Btn small primary icon="check" onClick={() => onUpdate && onUpdate({ ...model, status: 'completed' })}>
              审核通过
            </Btn>
          )}
          {model.status === 'failed' && (
            <Btn
              small
              primary
              icon="refresh"
              onClick={() => onUpdate && onUpdate({ ...model, status: 'training', progress: 10 })}>
              重新优化
            </Btn>
          )}
          <Btn small icon="file">
            导出
          </Btn>
        </div>
      </div>

      <div className={css.metricsGrid}>
        {(
          [
            ['准确率', model.p, '%', metricColor(model.p, 90, 80)],
            ['召回率', model.r, '%', metricColor(model.r, 90, 80)],
            ['F1', model.f1, '%', metricColor(model.f1, 90, 80)],
            [
              '误报率',
              model.fa,
              '%',
              model.fa !== null
                ? model.fa <= 5
                  ? 'var(--success-color)'
                  : 'var(--error-color)'
                : 'var(--disabled-color)',
            ],
            ['迭代', model.iter, '轮', 'var(--text-color)'],
          ] as [string, number | null, string, string][]
        ).map(([l, v, u, c]) => (
          <div key={String(l)} className={css.metricCard}>
            <div className={css.metricCardLabel}>{l}</div>
            <span className={css.metricCardValue} style={{ color: v !== null ? c : 'var(--disabled-color)' }}>
              {v !== null ? v : '—'}
            </span>
            <span className={css.metricCardUnit}>{u}</span>
          </div>
        ))}
      </div>

      <AnyTabs activeKey={tab} onChange={setTab} className={css.samTabs}>
        <AnyTabPane key="iter" tab="迭代记录">
          <div className={css.iterGrid}>
            <div className={css.panelCard}>
              <div className={css.panelCardTitle}>指标趋势</div>
              <div className={css.barChart}>
                {model.iterHistory.map((h, i) => (
                  <div key={i} className={css.barGroup}>
                    <div className={css.barCols}>
                      {(
                        [
                          [h.p, 'var(--primary-color)'],
                          [h.rc, 'var(--blue-color)'],
                          [h.f, 'var(--success-color)'],
                        ] as [number, string][]
                      ).map(([v, c], bi) => (
                        <div key={bi} className={css.barCol}>
                          <div className={css.barVal}>{v}</div>
                          <div
                            className={css.barFill}
                            style={{
                              height: `${(v / 100) * 110}px`,
                              background: c,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className={css.barLabel}>{'R' + h.r}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={css.panelCard}>
              <div className={css.panelCardTitle}>操作日志</div>
              {model.iterHistory.map((h, i) => (
                <div key={i} className={css.logItem}>
                  <div className={css.logTimeline}>
                    <div className={clsx(css.logDot, i === model.iterHistory.length - 1 && css.logDotCurrent)}>{h.r}</div>
                    {i < model.iterHistory.length - 1 && <div className={css.logLine} />}
                  </div>
                  <div>
                    <div className={css.logAct}>{h.act}</div>
                    <div className={css.logMetrics}>
                      {(
                        [
                          ['P', h.p, 'var(--primary-color)'],
                          ['R', h.rc, 'var(--blue-color)'],
                          ['FA', h.fa, h.fa <= 5 ? 'var(--success-color)' : 'var(--error-color)'],
                        ] as [string, number, string][]
                      ).map(([l2, v2, c2]) => (
                        <span key={l2} className={css.logMetric} style={{ color: c2 }}>
                          {l2 + ':' + v2 + '%'}
                        </span>
                      ))}
                    </div>
                    {i > 0 && (
                      <div className={css.logImprove}>{'F1 +' + (h.f - model.iterHistory[i - 1].f).toFixed(1) + '%'}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnyTabPane>

        <AnyTabPane key="pts" tab="测点参数">
          <div className={css.ptsTable}>
            <div className={css.ptsHeader}>
              <span>测点</span>
              <span>TAG</span>
              <span className={css.center}>上限</span>
              <span className={css.center}>下限</span>
              <span className={css.center}>级别</span>
              <span>抑制规则</span>
              <span className={css.center}>锁定</span>
              <span></span>
            </div>
            {ptCfg.map((p, i) => (
              <div key={i}>
                <div className={clsx(css.ptsRow, editPt === i && css.ptsRowEditing)}>
                  <span className={css.ptsName}>{p.nm}</span>
                  <span className={css.ptsTag}>{p.tag}</span>
                  <span className={css.ptsNum}>{p.hi}</span>
                  <span className={css.ptsNum}>{p.lo}</span>
                  <span className={css.ptsLv}>
                    <span
                      className={css.lvTag}
                      style={{
                        color: LV_COLORS[p.lv as keyof typeof LV_COLORS] || 'var(--disabled-color)',
                        background: (LV_COLORS[p.lv as keyof typeof LV_COLORS] || 'var(--disabled-color)') + '12',
                      }}>
                      {p.lv}
                    </span>
                  </span>
                  <span className={css.ptsSup}>{p.sup}</span>
                  <div
                    className={clsx(css.ptsLock, p.lock ? css.ptsLockLocked : css.ptsLockUnlocked)}
                    onClick={() => toggleLock(i)}>
                    <Ic name={p.lock ? 'lock' : 'unlock'} size={12} />
                  </div>
                  <div className={css.ptsEdit}>
                    <Btn
                      small
                      ghost
                      onClick={() => (editPt === i ? setEditPt(null) : startEdit(i))}
                      icon={editPt === i ? 'x' : 'edit3'}>
                      {editPt === i ? '收起' : '编辑'}
                    </Btn>
                  </div>
                </div>
                {editPt === i && (
                  <div className={css.ptsEditForm}>
                    <div className={css.editGrid}>
                      <div>
                        <label className={css.editLabel}>上限阈值</label>
                        <input
                          className={clsx(css.samInput, 'ant-input')}
                          value={editVals.hi as string | number}
                          onChange={(e) => setEditVals((v) => ({ ...v, hi: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className={css.editLabel}>下限阈值</label>
                        <input
                          className={clsx(css.samInput, 'ant-input')}
                          value={editVals.lo as string | number}
                          onChange={(e) => setEditVals((v) => ({ ...v, lo: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className={css.editLabel}>报警级别</label>
                        <div className={css.lvBtns}>
                          {['严重', '警告', '注意', '参考'].map((lv) => (
                            <button
                              key={lv}
                              className={css.lvBtn}
                              style={
                                editVals.lv === lv
                                  ? {
                                      borderColor: LV_COLORS[lv as keyof typeof LV_COLORS] || 'var(--disabled-color)',
                                      background:
                                        (LV_COLORS[lv as keyof typeof LV_COLORS] || 'var(--disabled-color)') + '12',
                                      color: LV_COLORS[lv as keyof typeof LV_COLORS] || 'var(--disabled-color)',
                                    }
                                  : {}
                              }
                              onClick={() => setEditVals((v) => ({ ...v, lv }))}>
                              {lv}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={css.editLabel}>抑制规则</label>
                        <input
                          className={clsx(css.samInput, 'ant-input')}
                          value={editVals.sup}
                          onChange={(e) => setEditVals((v) => ({ ...v, sup: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className={css.editActions}>
                      <Btn small onClick={() => setEditPt(null)}>
                        取消
                      </Btn>
                      <Btn small primary icon="check" onClick={saveEdit}>
                        保存
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnyTabPane>

        <AnyTabPane key="diag" tab="自动诊断">
          <div className={css.diagGrid}>
            <div className={css.panelCard}>
              {model.diag.passed ? (
                <div className={css.diagSuccess}>
                  <div className={css.diagSuccessTitle}>{'✓ 模型已达标'}</div>
                  <div className={css.diagSuccessDesc}>{model.diag.summary}</div>
                </div>
              ) : (
                <div className={css.diagFail}>
                  <div className={css.diagFailTitle}>{'✗ 模型未达标'}</div>
                  <div className={css.diagFailDesc}>{model.diag.summary}</div>
                </div>
              )}
              <div className={css.diagNotes}>
                <div className={css.diagNotesTitle}>{'本轮诊断要点：'}</div>
                {model.diag.notes.map((n, i) => (
                  <div key={i} className={css.diagNoteItem}>{'• ' + n}</div>
                ))}
              </div>
              {model.diag.suggestions && model.diag.suggestions.length > 0 && (
                <div className={css.diagSuggestions}>
                  <div className={css.diagSuggestionsTitle}>{'优化建议：'}</div>
                  {model.diag.suggestions.map((s, i) => (
                    <div key={i} className={css.diagSuggestionItem}>{'→ ' + s}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnyTabPane>
      </AnyTabs>
    </div>
  );
};

export default Detail;
