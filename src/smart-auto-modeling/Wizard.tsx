import React, { useState } from "react";
import { Steps } from "antd";
import css from "./styles/index.module.less";
import clsx from "clsx";
import { TPLS, ALGOS, getPts } from "./constant";
import type { ModelItem, TplItem } from "./constant";
import type { ModelStatus } from "./constant";
import { Ic, Btn, Toggle } from "./ui";

const AnySteps = Steps as any;
const AnyStep = Steps.Step as any;

interface WizardCfg {
  turbine: string | null;
  scenes: string[];
  points: Record<string, string[]>;
  sampleStrategy: string;
  sampleMonths: number;
  excludeFaults: boolean;
  optimizeTarget: string;
  maxIter: number;
  autoThreshold: boolean;
  autoSuppress: boolean;
  autoAlgoSwitch: boolean;
  [key: string]: unknown;
}

interface WizardProps {
  onBack: () => void;
  onComplete: (models: ModelItem[]) => void;
}

export const Wizard = ({
  onBack,
  onComplete,
}: WizardProps): React.ReactElement => {
  const [step, setStep] = useState<number>(0);
  const [cfg, setCfg] = useState<WizardCfg>({
    turbine: null,
    scenes: [],
    points: {},
    sampleStrategy: "auto",
    sampleMonths: 6,
    excludeFaults: true,
    optimizeTarget: "balanced",
    maxIter: 10,
    autoThreshold: true,
    autoSuppress: true,
    autoAlgoSwitch: true,
  });

  const selTpl: TplItem | undefined = TPLS.find((t) => t.id === cfg.turbine);
  const steps: string[] = [
    "设备与场景",
    "配置测点",
    "采样与算法",
    "优化策略",
    "确认启动",
  ];

  const canNext: boolean =
    step === 0
      ? !!(cfg.turbine && cfg.scenes.length > 0)
      : step === 1
        ? cfg.scenes.every((sc) => (cfg.points[sc] || []).length >= 2)
        : true;

  const togScene = (sc: string): void =>
    setCfg((c) => ({
      ...c,
      scenes: c.scenes.includes(sc)
        ? c.scenes.filter((s) => s !== sc)
        : [...c.scenes, sc],
    }));

  const togPt = (sc: string, pid: string): void =>
    setCfg((c) => {
      const cur = c.points[sc] || [];
      return {
        ...c,
        points: {
          ...c.points,
          [sc]: cur.includes(pid)
            ? cur.filter((p) => p !== pid)
            : [...cur, pid],
        },
      };
    });

  const selRec = (sc: string): void => {
    const pts = getPts(sc)
      .filter((p) => p.rec)
      .map((p) => p.id);
    setCfg((c) => ({ ...c, points: { ...c.points, [sc]: pts } }));
  };

  const doComplete = (): void => {
    const ms: ModelItem[] = cfg.scenes.map((sc, i) => ({
      id: Date.now() + i,
      name: `${sc}预警模型`,
      plant: "A厂",
      turb: selTpl
        ? selTpl.id === "sg42"
          ? "A01~A12"
          : selTpl.id === "my166"
            ? "B01~B08"
            : "C01~C06"
        : "A01~A12",
      type: selTpl ? selTpl.name : "SG4.2-145",
      status: "training" as ModelStatus,
      algo: "AutoML",
      p: null,
      r: null,
      f1: null,
      fa: null,
      iter: 0,
      pts: (cfg.points[sc] || []).length,
      sc,
      progress: 5,
      ptCfg: [],
    }));
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
                  className={clsx(
                    css.turbineCard,
                    cfg.turbine === t.id && css.turbineCardSelected,
                  )}
                  onClick={() =>
                    setCfg((c) => ({
                      ...c,
                      turbine: t.id,
                      scenes: [],
                      points: {},
                    }))
                  }
                >
                  <div className={css.turbineCardHeader}>
                    <Ic name="wind" size={14} />
                    <span className={css.turbineCardName}>{t.name}</span>
                  </div>
                  <div className={css.turbineCardSub}>
                    {t.scenes.length} 故障场景
                  </div>
                </div>
              ))}
            </div>
            {selTpl && (
              <div>
                <div className={css.sectionTitle}>选择监测场景</div>
                <div className={css.sceneGrid}>
                  {selTpl.scenes.map((sc) => {
                    const sel = cfg.scenes.includes(sc);
                    return (
                      <div
                        key={sc}
                        className={clsx(
                          css.sceneItem,
                          sel && css.sceneItemSelected,
                        )}
                        onClick={() => togScene(sc)}
                      >
                        <span className={css.sceneItemName}>{sc}</span>
                        {sel && <Ic name="check" size={13} />}
                      </div>
                    );
                  })}
                </div>
              </div>
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
                      {sc}{" "}
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
                          ? "var(--primary-color)"
                          : pt.imp > 0.7
                            ? "var(--blue-color)"
                            : "var(--disabled-color)";
                      return (
                        <div
                          key={pt.id}
                          className={clsx(
                            css.pointRow,
                            isOn && css.pointRowSelected,
                          )}
                          onClick={() => togPt(sc, pt.id)}
                        >
                          <div
                            className={clsx(
                              css.pointCheckbox,
                              isOn && css.pointCheckboxChecked,
                            )}
                          >
                            {isOn && <Ic name="check" size={8} />}
                          </div>
                          <div>
                            <span className={css.pointName}>{pt.nm}</span>
                            {pt.rec && <span className={css.pointRec}>★</span>}
                            <div className={css.pointTag}>{pt.tag}</div>
                          </div>
                          <span className={css.pointUnit}>{pt.u}</span>
                          <span className={css.pointImpVal}>
                            {Math.round(pt.imp * 100)}
                          </span>
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
                  { k: "auto", l: "全自动选样", d: "自动识别正常工况段" },
                  { k: "semi", l: "半自动选样", d: "系统推荐+人工确认" },
                  { k: "manual", l: "手动指定", d: "手动设定时间范围" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className={clsx(
                      css.sampleOption,
                      cfg.sampleStrategy === s.k && css.sampleOptionSelected,
                    )}
                    onClick={() =>
                      setCfg((c) => ({ ...c, sampleStrategy: s.k }))
                    }
                  >
                    <div className={css.sampleOptionHeader}>
                      <div
                        className={clsx(
                          css.radioCircle,
                          cfg.sampleStrategy === s.k && css.radioCircleSelected,
                        )}
                      >
                        {cfg.sampleStrategy === s.k && (
                          <div className={css.radioDot} />
                        )}
                      </div>
                      <span className={css.sampleOptionLabel}>{s.l}</span>
                    </div>
                    <div className={css.sampleOptionDesc}>{s.d}</div>
                  </div>
                ))}
                <div className={css.rangeLabel}>回溯范围</div>
                <div className={css.rangeBtns}>
                  {[3, 6, 12, 24].map((m) => (
                    <button
                      key={m}
                      className={clsx(
                        css.rangeBtn,
                        cfg.sampleMonths === m && css.rangeBtnSelected,
                      )}
                      onClick={() => setCfg((c) => ({ ...c, sampleMonths: m }))}
                    >
                      {m}月
                    </button>
                  ))}
                </div>
                <div className={css.switchRow}>
                  <Toggle
                    on={cfg.excludeFaults}
                    onToggle={() =>
                      setCfg((c) => ({ ...c, excludeFaults: !c.excludeFaults }))
                    }
                  />
                  <span className={css.switchLabel}>排除故障工单时段</span>
                </div>
              </div>
            </div>
            <div>
              <div className={css.sectionTitle}>算法池</div>
              <div className={css.configCard}>
                <div className={css.algoToggleRow}>
                  <Toggle on={true} onToggle={() => {}} />
                  <span className={css.switchLabel}>AutoML 多算法竞赛</span>
                </div>
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
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className={css.step2Grid}>
            <div>
              <div className={css.sectionTitle}>优化目标</div>
              {[
                {
                  k: "recall",
                  l: "召回优先",
                  d: "宁可多报不漏报",
                  ic: "alert",
                },
                { k: "precision", l: "精确优先", d: "减少误报", ic: "target" },
                { k: "balanced", l: "均衡模式", d: "F1最大化", ic: "activity" },
              ].map((o) => (
                <div
                  key={o.k}
                  className={clsx(
                    css.optTarget,
                    cfg.optimizeTarget === o.k && css.optTargetSelected,
                  )}
                  onClick={() => setCfg((c) => ({ ...c, optimizeTarget: o.k }))}
                >
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
                      className={clsx(
                        css.rangeBtn,
                        cfg.maxIter === n && css.rangeBtnSelected,
                      )}
                      onClick={() => setCfg((c) => ({ ...c, maxIter: n }))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {[
                  { k: "autoThreshold", l: "自动设置阈值(P1/P99)" },
                  { k: "autoSuppress", l: "自动配置抑制规则" },
                  { k: "autoAlgoSwitch", l: "不达标自动切换算法" },
                ].map((o) => (
                  <div key={o.k} className={css.autoRow}>
                    <Toggle
                      on={cfg[o.k] as boolean}
                      onToggle={() => setCfg((c) => ({ ...c, [o.k]: !c[o.k] }))}
                    />
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
                  ["机型", selTpl ? selTpl.name : ""],
                  ["场景", cfg.scenes.join("、")],
                  [
                    "选样",
                    (
                      {
                        auto: "全自动",
                        semi: "半自动",
                        manual: "手动",
                      } as Record<string, string>
                    )[cfg.sampleStrategy],
                  ],
                  ["回溯", cfg.sampleMonths + "月"],
                ].map(([k, v]) => (
                  <div key={k} className={css.confirmRow}>
                    <span className={css.confirmRowKey}>{k}</span>
                    <span className={css.confirmRowVal}>{v}</span>
                  </div>
                ))}
              </div>
              <div className={css.confirmCard}>
                {[
                  [
                    "目标",
                    (
                      {
                        recall: "召回优先",
                        precision: "精确优先",
                        balanced: "均衡",
                      } as Record<string, string>
                    )[cfg.optimizeTarget],
                  ],
                  ["迭代", cfg.maxIter + "轮"],
                  ["算法", "AutoML"],
                  ["阈值", "自动(P1/P99)"],
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
                {"将创建 "}
                <strong className={css.confirmCount}>
                  {cfg.scenes.length}
                </strong>
                {" 个模型"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={css.wizardNav}>
        <Btn
          onClick={() => (step > 0 ? setStep(step - 1) : onBack())}
          icon="chevL"
        >
          {step > 0 ? "上一步" : "取消"}
        </Btn>
        <Btn
          primary
          disabled={!canNext}
          onClick={() => (step < 4 ? setStep(step + 1) : doComplete())}
          icon={step === 4 ? "zap" : "chevR"}
        >
          {step === 4 ? "启动自动建模" : "下一步"}
        </Btn>
      </div>
    </div>
  );
};

export default Wizard;
