import React, { useState } from 'react';
import { Steps } from 'antd';
import * as css from './styles/index.modules.less';
import clsx from 'clsx';
import { TPLS, ALGOS, getPts, PLANTS } from './constant';
import type { ModelItem, TplItem } from './constant';
import type { ModelStatus } from './constant';
import { Ic, Btn, Toggle } from './ui';

const AnySteps = Steps as any;
const AnyStep = Steps.Step as any;

interface TimeRange {
  id: string;
  startDate: string;
  endDate: string;
}

interface FaultPeriod {
  id: string;
  turbine: string;
  startTime: string;
  endTime: string;
  faultMode: string;
  description: string;
}

interface WizardCfg {
  turbine: string | null;
  turbines: string[];
  scenes: string[];
  points: Record<string, string[]>;
  sampleStrategy: string;
  sampleMonths: number;
  timeRanges: TimeRange[]; // 手动指定的时间段列表
  excludeFaults: boolean;
  optimizeTarget: string;
  maxIter: number;
  autoThreshold: boolean;
  autoSuppress: boolean;
  autoAlgoSwitch: boolean;
  algoCompetition: boolean; // 多算法竞赛开关
  [key: string]: unknown;
}

interface WizardProps {
  onBack: () => void;
  onComplete: (models: ModelItem[]) => void;
}

export const Wizard = ({ onBack, onComplete }: WizardProps): React.ReactElement => {
  const [step, setStep] = useState<number>(0);
  const [cfg, setCfg] = useState<WizardCfg>({
    turbine: null,
    turbineType: '',
    scenes: [],
    turbines: [],
    points: {},
    sampleStrategy: 'auto',
    sampleMonths: 6,
    timeRanges: [],
    excludeFaults: true,
    optimizeTarget: 'balanced',
    maxIter: 10,
    autoThreshold: true,
    autoSuppress: true,
    autoAlgoSwitch: true,
    algoCompetition: true, // 默认打开
  });

  // 故障时段相关状态
  const [showFaultModal, setShowFaultModal] = useState<boolean>(false);
  const [faultPeriods, setFaultPeriods] = useState<FaultPeriod[]>([
    {
      id: '1',
      turbine: 'A01',
      startTime: '2024-01-15T08:00',
      endTime: '2024-01-18T16:00',
      faultMode: '齿轮箱油温过高',
      description: '齿轮箱冷却系统故障，导致油温持续偏高',
    },
    {
      id: '2',
      turbine: 'A01',
      startTime: '2024-02-20T10:00',
      endTime: '2024-02-22T14:00',
      faultMode: '发电机轴承异常',
      description: '发电机驱动端轴承温度异常波动',
    },
    {
      id: '3',
      turbine: 'A02',
      startTime: '2024-03-05T09:00',
      endTime: '2024-03-08T17:00',
      faultMode: '叶片桨距角偏差',
      description: '2号叶片桨距角响应延迟，需排查变桨系统',
    },
    {
      id: '4',
      turbine: 'A03',
      startTime: '2024-03-12T14:00',
      endTime: '2024-03-15T11:00',
      faultMode: '偏航系统故障',
      description: '偏航电机故障，导致对风精度下降',
    },
    {
      id: '5',
      turbine: 'A01',
      startTime: '2024-04-01T08:00',
      endTime: '2024-04-03T18:00',
      faultMode: '主轴承温度异常',
      description: '主轴承润滑不足，温度持续上升',
    },
  ]);
  const [editingFault, setEditingFault] = useState<FaultPeriod | null>(null);

  const selTpl: TplItem | undefined = TPLS.find((t) => t.id === cfg.turbine);
  const steps: string[] = ['设备与场景', '配置测点', '采样与算法', '优化策略', '确认启动'];

  // 辅助函数：根据机型ID获取对应的风场和风机列表
  const getPlantByTplId = (tplId: string | null): { plantName: string; turbines: string[] } => {
    if (tplId === 'sg42') return { plantName: 'A厂', turbines: PLANTS['A厂'].turbines };
    if (tplId === 'my166') return { plantName: 'B厂', turbines: PLANTS['B厂'].turbines };
    if (tplId === 'gw155') return { plantName: 'C厂', turbines: PLANTS['C厂'].turbines };
    return { plantName: 'A厂', turbines: [] };
  };

  // 计算当前选择的风机列表
  const currentPlantTurbines = selTpl ? getPlantByTplId(selTpl.id).turbines : [];
  const allTurbinesSelected = cfg.turbines.length === currentPlantTurbines.length && currentPlantTurbines.length > 0;

  const canNext: boolean =
    step === 0
      ? !!(cfg.turbine && cfg.scenes.length > 0 && cfg.turbines.length > 0)
      : step === 1
        ? cfg.scenes.every((sc) => (cfg.points[sc] || []).length >= 2)
        : true;

  const togScene = (sc: string): void =>
    setCfg((c) => ({
      ...c,
      scenes: c.scenes.includes(sc) ? c.scenes.filter((s) => s !== sc) : [...c.scenes, sc],
    }));

  const togPt = (sc: string, pid: string): void =>
    setCfg((c) => {
      const cur = c.points[sc] || [];
      return {
        ...c,
        points: {
          ...c.points,
          [sc]: cur.includes(pid) ? cur.filter((p) => p !== pid) : [...cur, pid],
        },
      };
    });

  const selRec = (sc: string): void => {
    const pts = getPts(sc)
      .filter((p) => p.rec)
      .map((p) => p.id);
    setCfg((c) => ({ ...c, points: { ...c.points, [sc]: pts } }));
  };

  // 添加时间段
  const addTimeRange = (): void => {
    const newRange: TimeRange = {
      id: Date.now().toString(),
      startDate: '',
      endDate: '',
    };
    setCfg((c) => ({ ...c, timeRanges: [...c.timeRanges, newRange] }));
  };

  // 删除时间段
  const removeTimeRange = (id: string): void => {
    setCfg((c) => ({ ...c, timeRanges: c.timeRanges.filter((r) => r.id !== id) }));
  };

  // 更新时间段
  const updateTimeRange = (id: string, field: 'startDate' | 'endDate', value: string): void => {
    setCfg((c) => ({
      ...c,
      timeRanges: c.timeRanges.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const doComplete = (): void => {
    // 为每个选中的风机和场景创建模型
    const ms: ModelItem[] = [];
    let modelId = Date.now();

    cfg.scenes.forEach((sc) => {
      cfg.turbines.forEach((turb) => {
        const { plantName } = getPlantByTplId(cfg.turbine);
        ms.push({
          id: modelId++,
          name: `${sc}预警模型`,
          plant: plantName,
          turb: turb,
          type: selTpl ? selTpl.name : 'SG4.2-145',
          status: 'training' as ModelStatus,
          algo: 'AutoML',
          p: null,
          r: null,
          f1: null,
          fa: null,
          iter: 0,
          pts: (cfg.points[sc] || []).length,
          sc,
          progress: 5,
          ptCfg: [],
          iterHistory: [],
        });
      });
    });

    onComplete(ms);
  };

  return (
    <div className={css.wizardWrap}>
      <div className={css.wizardBack} onClick={onBack}>
        <Ic name="chevL" size={15} />
        <span>返回模型列表</span>
      </div>

      <div className={css.wizardSteps}>
        <AnySteps current={step} size="small">
          {steps.map((s, i) => (
            <AnyStep key={i} title={s} />
          ))}
        </AnySteps>
      </div>

      <div className={css.wizardBody}>
        {/* Step 0 */}
        {step === 0 && (
          <div>
            <div className={css.sectionTitle}>选择机型</div>
            <div className={css.turbineGrid}>
              {TPLS.map((t) => (
                <div
                  key={t.id}
                  className={clsx(css.turbineCard, cfg.turbine === t.id && css.turbineCardSelected)}
                  onClick={() =>
                    setCfg((c) => ({
                      ...c,
                      turbine: t.id,
                      turbineType: t.id,
                      scenes: [],
                      points: {},
                      turbines: [],
                    }))
                  }>
                  <div className={css.turbineCardHeader}>
                    <Ic name="wind" size={14} />
                    <span className={css.turbineCardName}>{t.name}</span>
                  </div>
                  <div className={css.turbineCardSub}>{t.scenes.length} 故障场景</div>
                </div>
              ))}
            </div>
            {selTpl && (
              <>
                <div className={css.sectionTitle}>选择监测场景</div>
                <div className={css.sceneGrid}>
                  {selTpl.scenes.map((sc) => {
                    const sel = cfg.scenes.includes(sc);
                    return (
                      <div
                        key={sc}
                        className={clsx(css.sceneItem, sel && css.sceneItemSelected)}
                        onClick={() => togScene(sc)}>
                        <span className={css.sceneItemName}>{sc}</span>
                        {sel && <Ic name="check" size={13} />}
                      </div>
                    );
                  })}
                </div>

                {currentPlantTurbines.length > 0 && (
                  <>
                    <div className={css.sectionTitle} style={{ marginTop: 18 }}>
                      选择风机
                      <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 8 }}>
                        (已选 {cfg.turbines.length} 台)
                      </span>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <button
                        type="button"
                        className={css.sceneItem}
                        onClick={() => {
                          setCfg((c) => ({
                            ...c,
                            turbines: allTurbinesSelected ? [] : currentPlantTurbines,
                          }));
                        }}
                        style={{
                          padding: '8px 14px',
                          marginBottom: 10,
                          border: allTurbinesSelected
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-color)',
                        }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-color)' }}>
                          {allTurbinesSelected ? '✓ ' : ''}
                          全选 ({currentPlantTurbines.length}台)
                        </span>
                      </button>
                    </div>
                    <div className={css.sceneGrid}>
                      {currentPlantTurbines.map((turb) => {
                        const sel = cfg.turbines.includes(turb);
                        return (
                          <div
                            key={turb}
                            className={clsx(css.sceneItem, sel && css.sceneItemSelected)}
                            onClick={() => {
                              setCfg((c) => ({
                                ...c,
                                turbines: c.turbines.includes(turb) ? c.turbines.filter((t) => t !== turb) : [...c.turbines, turb],
                              }));
                            }}
                            style={{ cursor: 'pointer' }}>
                            <span className={css.sceneItemName}>{turb}</span>
                            {sel && <Ic name="check" size={13} />}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div>
            {cfg.scenes.map((sc) => {
              const pts = getPts(sc);
              const sel = cfg.points[sc] || [];
              return (
                <div key={sc} className={css.pointSection}>
                  <div className={css.pointSectionHeader}>
                    <span className={css.pointSectionTitle}>
                      {sc}{' '}
                      <span className={css.pointSectionCount}>
                        ({sel.length}/{pts.length})
                      </span>
                    </span>
                    <Btn small icon="zap" onClick={() => selRec(sc)}>
                      一键推荐
                    </Btn>
                  </div>
                  <div className={css.pointList}>
                    {pts.map((pt) => {
                      const isOn = sel.includes(pt.id);
                      const impColor =
                        pt.imp > 0.85
                          ? 'var(--primary-color)'
                          : pt.imp > 0.7
                            ? 'var(--blue-color)'
                            : 'var(--disabled-color)';
                      return (
                        <div
                          key={pt.id}
                          className={clsx(css.pointRow, isOn && css.pointRowSelected)}
                          onClick={() => togPt(sc, pt.id)}>
                          <div className={clsx(css.pointCheckbox, isOn && css.pointCheckboxChecked)}>
                            {isOn && <Ic name="check" size={8} />}
                          </div>
                          <div>
                            <span className={css.pointName}>{pt.nm}</span>
                            {pt.rec && <span className={css.pointRec}>★</span>}
                            <div className={css.pointTag}>{pt.tag}</div>
                          </div>
                          <span className={css.pointUnit}>{pt.u}</span>
                          <span className={css.pointImpVal}>{Math.round(pt.imp * 100)}</span>
                          <div className={css.pointImpBar}>
                            <div
                              className={css.pointImpFill}
                              style={{
                                width: `${pt.imp * 100}%`,
                                background: impColor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className={css.step2Grid}>
            <div>
              <div className={css.sectionTitle}>训练样本</div>
              <div className={css.configCard}>
                {[
                  { k: 'auto', l: '全自动选样', d: '自动识别正常工况段' },
                  { k: 'manual', l: '手动指定', d: '手动设定时间范围' },
                ].map((s) => (
                  <div
                    key={s.k}
                    className={clsx(css.sampleOption, cfg.sampleStrategy === s.k && css.sampleOptionSelected)}
                    onClick={() => setCfg((c) => ({ ...c, sampleStrategy: s.k }))}>
                    <div className={css.sampleOptionHeader}>
                      <div className={clsx(css.radioCircle, cfg.sampleStrategy === s.k && css.radioCircleSelected)}>
                        {cfg.sampleStrategy === s.k && <div className={css.radioDot} />}
                      </div>
                      <span className={css.sampleOptionLabel}>{s.l}</span>
                    </div>
                    <div className={css.sampleOptionDesc}>{s.d}</div>
                  </div>
                ))}

                {cfg.sampleStrategy === 'auto' ? (
                  <>
                    <div className={css.rangeLabel}>回溯范围</div>
                    <div className={css.rangeBtns}>
                      {[3, 6, 12, 24].map((m) => (
                        <button
                          key={m}
                          className={clsx(css.rangeBtn, cfg.sampleMonths === m && css.rangeBtnSelected)}
                          onClick={() => setCfg((c) => ({ ...c, sampleMonths: m }))}>
                          {m}月
                        </button>
                      ))}
                    </div>
                    <div className={css.switchRow}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <Toggle
                            on={cfg.excludeFaults}
                            onToggle={() => setCfg((c) => ({ ...c, excludeFaults: !c.excludeFaults }))}
                          />
                          <span className={css.switchLabel}>排除故障工单时段</span>
                        </div>
                        {cfg.excludeFaults && (
                          <Btn small ghost onClick={() => setShowFaultModal(true)} icon="edit3">
                            配置时段 ({faultPeriods.length})
                          </Btn>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={css.timeRangesSection}>
                    <div className={css.timeRangesHeader}>
                      <span className={css.rangeLabel}>训练时间段</span>
                      <Btn small icon="plus" onClick={addTimeRange}>
                        添加时间段
                      </Btn>
                    </div>
                    {cfg.timeRanges.length === 0 ? (
                      <div className={css.timeRangesEmpty}>
                        <span className={css.timeRangesEmptyText}>点击"添加时间段"选择训练数据范围</span>
                      </div>
                    ) : (
                      <div className={css.timeRangesList}>
                        {cfg.timeRanges.map((range, idx) => (
                          <div key={range.id} className={css.timeRangeRow}>
                            <span className={css.timeRangeIndex}>时段 {idx + 1}</span>
                            <input
                              type="date"
                              className={clsx(css.samInput, 'ant-input')}
                              value={range.startDate}
                              onChange={(e) => updateTimeRange(range.id, 'startDate', e.target.value)}
                              placeholder="开始日期"
                            />
                            <span className={css.timeRangeSeparator}>至</span>
                            <input
                              type="date"
                              className={clsx(css.samInput, 'ant-input')}
                              value={range.endDate}
                              onChange={(e) => updateTimeRange(range.id, 'endDate', e.target.value)}
                              placeholder="结束日期"
                            />
                            {cfg.timeRanges.length > 1 && (
                              <button
                                className={css.timeRangeRemove}
                                onClick={() => removeTimeRange(range.id)}
                                title="删除此时间段">
                                <Ic name="x" size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={css.switchRow}>
                      <Toggle
                        on={cfg.excludeFaults}
                        onToggle={() => setCfg((c) => ({ ...c, excludeFaults: !c.excludeFaults }))}
                      />
                      <span className={css.switchLabel}>排除故障工单时段</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className={css.sectionTitle}>算法池</div>
              <div className={css.configCard}>
                <div className={css.algoToggleRow}>
                  <Toggle
                    on={cfg.algoCompetition}
                    onToggle={() => setCfg((c) => ({ ...c, algoCompetition: !c.algoCompetition }))}
                  />
                  <span className={css.switchLabel}>AutoML 多算法竞赛</span>
                  {cfg.algoCompetition && (
                    <span className={css.algoCompBadge}>开启</span>
                  )}
                </div>
                <div style={cfg.algoCompetition ? {} : { opacity: 0.5, pointerEvents: 'none' as const }}>
                  {ALGOS.map((a) => (
                    <div key={a.id} className={css.algoRow}>
                      <div>
                        <span className={css.algoName}>{a.name}</span>
                        <span className={css.algoType}>{a.type}</span>
                        <div className={css.algoDesc}>{a.desc}</div>
                      </div>
                      {a.best.length > 0 && (
                        <div className={css.algoTags}>
                          {a.best.map((b) => (
                            <span key={b} className={css.algoTag}>
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className={css.step2Grid}>
            <div>
              <div className={css.sectionTitle}>优化目标</div>
              {[
                {
                  k: 'recall',
                  l: '召回优先',
                  d: '宁可多报不漏报',
                  ic: 'alert',
                },
                { k: 'precision', l: '精确优先', d: '减少误报', ic: 'target' },
                { k: 'balanced', l: '均衡模式', d: 'F1最大化', ic: 'activity' },
              ].map((o) => (
                <div
                  key={o.k}
                  className={clsx(css.optTarget, cfg.optimizeTarget === o.k && css.optTargetSelected)}
                  onClick={() => setCfg((c) => ({ ...c, optimizeTarget: o.k }))}>
                  <div className={css.optTargetIcon}>
                    <Ic name={o.ic} size={16} />
                  </div>
                  <div>
                    <div className={css.optTargetTitle}>{o.l}</div>
                    <div className={css.optTargetDesc}>{o.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className={css.sectionTitle}>迭代与自动化</div>
              <div className={css.configCard}>
                <div className={css.rangeLabel}>最大迭代</div>
                <div className={css.rangeBtns} style={{ marginBottom: 14 }}>
                  {[5, 10, 20, 50].map((n) => (
                    <button
                      key={n}
                      className={clsx(css.rangeBtn, cfg.maxIter === n && css.rangeBtnSelected)}
                      onClick={() => setCfg((c) => ({ ...c, maxIter: n }))}>
                      {n}
                    </button>
                  ))}
                </div>
                {[
                  { k: 'autoThreshold', l: '自动设置阈值(P1/P99)' },
                  { k: 'autoSuppress', l: '自动配置抑制规则' },
                  { k: 'autoAlgoSwitch', l: '不达标自动切换算法' },
                ].map((o) => (
                  <div key={o.k} className={css.autoRow}>
                    <Toggle on={cfg[o.k] as boolean} onToggle={() => setCfg((c) => ({ ...c, [o.k]: !c[o.k] }))} />
                    <span className={css.autoRowLabel}>{o.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <div className={css.sectionTitle}>确认配置</div>
            <div className={css.confirmGrid}>
              <div className={css.confirmCard}>
                {[
                  ['机型', selTpl ? selTpl.name : ''],
                  ['风机', `${cfg.turbines.length}台 (${cfg.turbines.slice(0, 3).join('、')}${cfg.turbines.length > 3 ? '...' : ''})`],
                  ['场景', cfg.scenes.join('、')],
                  [
                    '选样',
                    (
                      {
                        auto: '全自动',
                        manual: '手动',
                      } as Record<string, string>
                    )[cfg.sampleStrategy],
                  ],
                  [
                    '回溯',
                    cfg.sampleStrategy === 'auto'
                      ? cfg.sampleMonths + '月'
                      : cfg.timeRanges.length > 0
                        ? `${cfg.timeRanges.length} 个时间段`
                        : '未选择',
                  ],
                ].map(([k, v]) => (
                  <div key={k} className={css.confirmRow}>
                    <span className={css.confirmRowKey}>{k}</span>
                    <span className={css.confirmRowVal}>{v}</span>
                  </div>
                ))}
                {cfg.turbines.length > 3 && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--section-bg)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>完整风机列表：</div>
                    <div style={{ fontSize: 10, color: 'var(--text-color)', fontFamily: 'monospace' }}>
                      {cfg.turbines.join('、')}
                    </div>
                  </div>
                )}
                {cfg.sampleStrategy === 'manual' && cfg.timeRanges.length > 0 && (
                  <div className={css.confirmTimeRanges}>
                    {cfg.timeRanges.map((r, i) => (
                      <div key={r.id} className={css.confirmTimeRange}>
                        <span className={css.confirmTimeRangeIdx}>时段{i + 1}</span>
                        <span className={css.confirmTimeRangeDate}>
                          {r.startDate} ~ {r.endDate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={css.confirmCard}>
                {[
                  [
                    '目标',
                    (
                      {
                        recall: '召回优先',
                        precision: '精确优先',
                        balanced: '均衡',
                      } as Record<string, string>
                    )[cfg.optimizeTarget],
                  ],
                  ['迭代', cfg.maxIter + '轮'],
                  ['算法', cfg.algoCompetition ? '多算法竞赛' : '单一算法'],
                  ['阈值', '自动(P1/P99)'],
                ].map(([k, v]) => (
                  <div key={k} className={css.confirmRow}>
                    <span className={css.confirmRowKey}>{k}</span>
                    <span className={css.confirmRowVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={css.confirmInfo}>
              <Ic name="info" size={14} />
              <span className={css.confirmInfoText}>
                {'将为 '}
                <strong className={css.confirmCount}>{cfg.turbines.length}</strong>
                {' 台风机创建 '}
                <strong className={css.confirmCount}>{cfg.scenes.length}</strong>
                {' 个场景，共 '}
                <strong className={css.confirmCount}>{cfg.turbines.length * cfg.scenes.length}</strong>
                {' 个模型'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={css.wizardNav}>
        <Btn onClick={() => (step > 0 ? setStep(step - 1) : onBack())} icon="chevL">
          {step > 0 ? '上一步' : '取消'}
        </Btn>
        <Btn
          primary
          disabled={!canNext}
          onClick={() => (step < 4 ? setStep(step + 1) : doComplete())}
          icon={step === 4 ? 'zap' : 'chevR'}>
          {step === 4 ? '启动自动建模' : '下一步'}
        </Btn>
      </div>

      {/* 故障时段管理模态框 */}
      {showFaultModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}>
          <div
            style={{
              background: 'var(--bg-color)',
              borderRadius: 16,
              border: '1px solid var(--border-color)',
              width: 900,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
            {/* Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(255,77,106,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ic name="alert" size={16} style={{ color: 'var(--danger-color)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-color)' }}>故障时段配置</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>
                    配置需要排除的故障时间段和故障模式
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowFaultModal(false);
                  setEditingFault(null);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
                <Ic name="x" size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: 18, overflowY: 'auto', flex: 1 }}>
              {/* 工具栏 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  共 <strong style={{ color: 'var(--primary-color)' }}>{faultPeriods.length}</strong> 条故障记录
                </div>
                <Btn small primary icon="plus" onClick={() => setEditingFault({ id: '', turbine: '', startTime: '', endTime: '', faultMode: '', description: '' })}>
                  新增故障时段
                </Btn>
              </div>

              {/* 故障列表 */}
              <div
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 140px 140px 150px 1fr 90px',
                    padding: '10px 14px',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: 9,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    background: 'var(--section-bg)',
                  }}>
                  <span>设备</span>
                  <span>故障模式</span>
                  <span>开始时间</span>
                  <span>结束时间</span>
                  <span>时长</span>
                  <span>说明</span>
                  <span style={{ textAlign: 'center' }}>操作</span>
                </div>

                {/* 新增/编辑表单 */}
                {editingFault !== null && (
                  <div
                    style={{
                      padding: '16px 14px',
                      borderBottom: '1px solid var(--border-color)',
                      background: 'rgba(0,212,255,0.08)',
                    }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary-color)', marginBottom: 12 }}>
                      {editingFault.id ? '编辑故障时段' : '新增故障时段'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>设备编号</label>
                        <select
                          value={editingFault.turbine}
                          onChange={(e) => setEditingFault({ ...editingFault, turbine: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            color: 'var(--text-color)',
                            fontSize: 11,
                            outline: 'none',
                            cursor: 'pointer',
                          }}>
                          <option value="">请选择设备</option>
                          {selTpl &&
                            getPlantByTplId(selTpl.id).turbines.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>故障模式</label>
                        <input
                          type="text"
                          value={editingFault.faultMode}
                          onChange={(e) => setEditingFault({ ...editingFault, faultMode: e.target.value })}
                          placeholder="例如：齿轮箱油温过高"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            color: 'var(--text-color)',
                            fontSize: 11,
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>开始时间</label>
                        <input
                          type="datetime-local"
                          value={editingFault.startTime}
                          onChange={(e) => setEditingFault({ ...editingFault, startTime: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            color: 'var(--text-color)',
                            fontSize: 11,
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>结束时间</label>
                        <input
                          type="datetime-local"
                          value={editingFault.endTime}
                          onChange={(e) => setEditingFault({ ...editingFault, endTime: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            color: 'var(--text-color)',
                            fontSize: 11,
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>故障说明</label>
                        <input
                          type="text"
                          value={editingFault.description}
                          onChange={(e) => setEditingFault({ ...editingFault, description: e.target.value })}
                          placeholder="描述故障原因和影响"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            color: 'var(--text-color)',
                            fontSize: 11,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      <Btn small onClick={() => setEditingFault(null)}>
                        取消
                      </Btn>
                      <Btn
                        small
                        primary
                        icon="check"
                        onClick={() => {
                          if (editingFault.id) {
                            setFaultPeriods(faultPeriods.map((f) => (f.id === editingFault.id ? editingFault : f)));
                          } else {
                            setFaultPeriods([...faultPeriods, { ...editingFault, id: Date.now().toString() }]);
                          }
                          setEditingFault(null);
                        }}>
                        {editingFault.id ? '保存修改' : '确认添加'}
                      </Btn>
                    </div>
                  </div>
                )}

                {/* 列表项 */}
                {faultPeriods.map((fault) => {
                  const duration = new Date(fault.endTime).getTime() - new Date(fault.startTime).getTime();
                  const hours = Math.floor(duration / (1000 * 60 * 60));
                  const days = Math.floor(hours / 24);
                  const displayDuration = days > 0 ? `${days}天${hours % 24}小时` : `${hours}小时`;

                  return (
                    <div
                      key={fault.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr 140px 140px 150px 1fr 90px',
                        padding: '11px 14px',
                        borderBottom: '1px solid var(--border-color)',
                        alignItems: 'center',
                        fontSize: 11,
                        background: editingFault?.id === fault.id ? 'rgba(0,212,255,0.08)' : 'transparent',
                      }}>
                      <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>{fault.turbine}</span>
                      <span style={{ color: 'var(--text-color)', fontWeight: 500 }}>{fault.faultMode}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{fault.startTime.replace('T', ' ')}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{fault.endTime.replace('T', ' ')}</span>
                      <span style={{ fontSize: 10, color: 'var(--danger-color)' }}>{displayDuration}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{fault.description}</span>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button
                          onClick={() => setEditingFault(fault)}
                          style={{
                            padding: '3px 6px',
                            background: 'rgba(96,165,250,0.07)',
                            border: 'none',
                            borderRadius: 4,
                            color: 'var(--blue-color)',
                            fontSize: 9,
                            cursor: 'pointer',
                          }}>
                          编辑
                        </button>
                        <button
                          onClick={() => {
                            setFaultPeriods(faultPeriods.filter((f) => f.id !== fault.id));
                          }}
                          style={{
                            padding: '3px 6px',
                            background: 'rgba(255,77,106,0.07)',
                            border: 'none',
                            borderRadius: 4,
                            color: 'var(--danger-color)',
                            fontSize: 9,
                            cursor: 'pointer',
                          }}>
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}

                {faultPeriods.length === 0 && (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 11 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Ic name="alert" size={32} style={{ color: 'var(--border-color)' }} />
                    </div>
                    <div>暂无故障时段配置</div>
                    <div style={{ fontSize: 10, marginTop: 4 }}>点击上方"新增故障时段"按钮添加</div>
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              {faultPeriods.length > 0 && (
                <div
                  style={{
                    marginTop: 14,
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    fontSize: 10,
                  }}>
                  <div style={{ display: 'flex', gap: 18, color: 'var(--text-secondary)' }}>
                    <span>
                      总故障时长：
                      <strong style={{ color: 'var(--text-color)' }}>
                        {Math.round(
                          faultPeriods.reduce(
                            (acc, f) => acc + (new Date(f.endTime).getTime() - new Date(f.startTime).getTime()),
                            0,
                          ) / (1000 * 60 * 60),
                        )}{' '}
                        小时
                      </strong>
                    </span>
                    <span>
                      涉及设备：<strong style={{ color: 'var(--text-color)' }}>{[...new Set(faultPeriods.map((f) => f.turbine))].length}台</strong>
                    </span>
                    <span>
                      故障类型：<strong style={{ color: 'var(--text-color)' }}>{[...new Set(faultPeriods.map((f) => f.faultMode))].length}种</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Btn
                onClick={() => {
                  setShowFaultModal(false);
                  setEditingFault(null);
                }}>
                关闭
              </Btn>
              <Btn
                primary
                icon="check"
                onClick={() => {
                  setShowFaultModal(false);
                  setEditingFault(null);
                }}>
                确认配置
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wizard;
