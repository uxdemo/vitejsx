import { useState, useEffect, useRef } from "react";
import { Button, Switch, Progress, Steps, Tabs, Table, message } from "antd";
import "antd/dist/antd.css";
import css from "./index.module.css";
import clsx from "clsx";
import {
  TH,
  PLANTS,
  ALGOS,
  TPLS,
  getPts,
  STATUS_MAP,
  LV_COLORS,
  DEFAULT_PT_CFG,
  createInitModels,
  ITER_HISTORY,
  AI_CATS,
} from "./constant";

const { Step } = Steps;
const { TabPane } = Tabs;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Ic({ name, size = 16 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    chevR: <path d="m9 18 6-6-6-6" />,
    chevL: <path d="m15 18-6-6 6-6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    play: <polygon points="5 3 19 12 5 21 5 3" />,
    pause: (
      <>
        <rect width="4" x="6" y="4" height="16" />
        <rect width="4" x="14" y="4" height="16" />
      </>
    ),
    refresh: (
      <>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
      </>
    ),
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    target: (
      <>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
    layers: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    ),
    cpu: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
      </>
    ),
    wind: (
      <>
        <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
        <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
        <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      </>
    ),
    alert: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    unlock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </>
    ),
    file: (
      <>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
    mic: (
      <>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </>
    ),
    send: (
      <>
        <line x1="22" x2="11" y1="2" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
        <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
      </>
    ),
    gauge: (
      <>
        <path d="m12 14 4-4" />
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
      </>
    ),
    ext: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </>
    ),
    brain: (
      <>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
      </>
    ),
    search2: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    sliders: (
      <>
        <line x1="4" x2="4" y1="21" y2="14" />
        <line x1="4" x2="4" y1="10" y2="3" />
        <line x1="12" x2="12" y1="21" y2="12" />
        <line x1="12" x2="12" y1="8" y2="3" />
        <line x1="20" x2="20" y1="21" y2="16" />
        <line x1="20" x2="20" y1="12" y2="3" />
        <line x1="2" x2="6" y1="14" y2="14" />
        <line x1="10" x2="14" y1="8" y2="8" />
        <line x1="18" x2="22" y1="16" y2="16" />
      </>
    ),
    edit3: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    gear: (
      <>
        <path d="M12 20h9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || null}
    </svg>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Badge({ status }) {
  const s = STATUS_MAP[status] || { l: "未知" };
  const key = STATUS_MAP[status] ? status : "unknown";
  const isAnimated = status === "training" || status === "optimizing";
  return (
    <span
      className={clsx(
        css.statusBadge,
        css[`statusBadge${key.charAt(0).toUpperCase() + key.slice(1)}`],
      )}
    >
      <span
        className={clsx(
          css.badgeDot,
          css[`badgeDot${key.charAt(0).toUpperCase() + key.slice(1)}`],
          isAnimated && css.badgeDotPulse,
        )}
      />
      {s.l}
    </span>
  );
}

function Btn({
  children,
  primary,
  danger,
  ghost,
  disabled,
  onClick,
  icon,
}) {
  const type = primary
    ? "primary"
    : danger
      ? "danger"
      : ghost
        ? "ghost"
        : "default";
  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={css.samBtn}
    >
      {icon && <Ic name={icon} size={13} />}
      {children}
    </Button>
  );
}

function Prog({ value, color }) {
  return (
    <Progress
      percent={value}
      showInfo={false}
      strokeColor={color || TH.ac}
      strokeWidth={3}
      className={css.samProg}
    />
  );
}

function Toggle({ on, onToggle }) {
  return <Switch checked={on} onChange={onToggle} size="small" />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WIZARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Wizard({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState({
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

  const selTpl = TPLS.find((t) => t.id === cfg.turbine);
  const steps = [
    "设备与场景",
    "配置测点",
    "采样与算法",
    "优化策略",
    "确认启动",
  ];

  const canNext =
    step === 0
      ? cfg.turbine && cfg.scenes.length > 0
      : step === 1
        ? cfg.scenes.every((sc) => (cfg.points[sc] || []).length >= 2)
        : true;

  const togScene = (sc) =>
    setCfg((c) => ({
      ...c,
      scenes: c.scenes.includes(sc)
        ? c.scenes.filter((s) => s !== sc)
        : [...c.scenes, sc],
    }));

  const togPt = (sc, pid) =>
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

  const selRec = (sc) => {
    const pts = getPts(sc)
      .filter((p) => p.rec)
      .map((p) => p.id);
    setCfg((c) => ({ ...c, points: { ...c.points, [sc]: pts } }));
  };

  const doComplete = () => {
    const ms = cfg.scenes.map((sc, i) => ({
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
      status: "training",
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
        <Steps current={step} size="small" className={css.samSteps}>
          {steps.map((s, i) => (
            <Step key={i} title={s} />
          ))}
        </Steps>
      </div>

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
                      pt.imp > 0.85 ? TH.ac : pt.imp > 0.7 ? TH.bl : TH.t3;
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
                  onClick={() => setCfg((c) => ({ ...c, sampleStrategy: s.k }))}
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
              { k: "recall", l: "召回优先", d: "宁可多报不漏报", ic: "alert" },
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
                    on={cfg[o.k]}
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
                  { auto: "全自动", semi: "半自动", manual: "手动" }[
                    cfg.sampleStrategy
                  ],
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
                  {
                    recall: "召回优先",
                    precision: "精确优先",
                    balanced: "均衡",
                  }[cfg.optimizeTarget],
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
              <strong className={css.confirmCount}>{cfg.scenes.length}</strong>
              {" 个模型"}
            </span>
          </div>
        </div>
      )}

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
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DETAIL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Detail({ model, onBack, onUpdate }) {
  const [tab, setTab] = useState("iter");
  const [editPt, setEditPt] = useState(null);
  const [editVals, setEditVals] = useState({});

  const ptCfg =
    model.ptCfg && model.ptCfg.length > 0 ? model.ptCfg : DEFAULT_PT_CFG;

  const startEdit = (i) => {
    setEditPt(i);
    setEditVals({
      hi: ptCfg[i].hi,
      lo: ptCfg[i].lo,
      lv: ptCfg[i].lv,
      sup: ptCfg[i].sup,
    });
  };
  const saveEdit = () => {
    const u = [...ptCfg];
    u[editPt] = { ...u[editPt], ...editVals };
    if (onUpdate) onUpdate({ ...model, ptCfg: u });
    setEditPt(null);
  };
  const toggleLock = (i) => {
    const u = [...ptCfg];
    u[i] = { ...u[i], lock: !u[i].lock };
    if (onUpdate) onUpdate({ ...model, ptCfg: u });
  };

  const metricColor = (v, good, bad) =>
    v === null ? TH.t3 : v >= good ? TH.gn : v >= bad ? TH.yl : TH.rd;

  return (
    <div>
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
            <span>{"迭代" + model.iter + "轮"}</span>
          </div>
        </div>
        <div className={css.detailActions}>
          {model.status === "review" && (
            <Btn
              small
              primary
              icon="check"
              onClick={() =>
                onUpdate && onUpdate({ ...model, status: "completed" })
              }
            >
              审核通过
            </Btn>
          )}
          {model.status === "failed" && (
            <Btn
              small
              primary
              icon="refresh"
              onClick={() =>
                onUpdate &&
                onUpdate({ ...model, status: "training", progress: 10 })
              }
            >
              重新优化
            </Btn>
          )}
          <Btn small icon="file">
            导出
          </Btn>
        </div>
      </div>

      <div className={css.metricsGrid}>
        {[
          ["准确率", model.p, "%", metricColor(model.p, 90, 80)],
          ["召回率", model.r, "%", metricColor(model.r, 90, 80)],
          ["F1", model.f1, "%", metricColor(model.f1, 90, 80)],
          [
            "误报率",
            model.fa,
            "%",
            model.fa !== null ? (model.fa <= 5 ? TH.gn : TH.rd) : TH.t3,
          ],
          ["迭代", model.iter, "轮", TH.tx],
        ].map(([l, v, u, c]) => (
          <div key={String(l)} className={css.metricCard}>
            <div className={css.metricCardLabel}>{l}</div>
            <span
              className={css.metricCardValue}
              style={{ color: v !== null ? c : TH.t3 }}
            >
              {v !== null ? v : "—"}
            </span>
            <span className={css.metricCardUnit}>{u}</span>
          </div>
        ))}
      </div>

      <Tabs activeKey={tab} onChange={setTab} className={css.samTabs}>
        <TabPane key="iter" tab="迭代记录">
          <div className={css.iterGrid}>
            <div className={css.panelCard}>
              <div className={css.panelCardTitle}>指标趋势</div>
              <div className={css.barChart}>
                {ITER_HISTORY.map((h, i) => (
                  <div key={i} className={css.barGroup}>
                    <div className={css.barCols}>
                      {[
                        [h.p, TH.ac],
                        [h.rc, TH.bl],
                        [h.f, TH.gn],
                      ].map(([v, c], bi) => (
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
                    <div className={css.barLabel}>{"R" + h.r}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={css.panelCard}>
              <div className={css.panelCardTitle}>操作日志</div>
              {ITER_HISTORY.map((h, i) => (
                <div key={i} className={css.logItem}>
                  <div className={css.logTimeline}>
                    <div
                      className={clsx(
                        css.logDot,
                        i === ITER_HISTORY.length - 1 && css.logDotCurrent,
                      )}
                    >
                      {h.r}
                    </div>
                    {i < ITER_HISTORY.length - 1 && (
                      <div className={css.logLine} />
                    )}
                  </div>
                  <div>
                    <div className={css.logAct}>{h.act}</div>
                    <div className={css.logMetrics}>
                      {[
                        ["P", h.p, TH.ac],
                        ["R", h.rc, TH.bl],
                        ["FA", h.fa, h.fa <= 5 ? TH.gn : TH.rd],
                      ].map(([l2, v2, c2]) => (
                        <span
                          key={l2}
                          className={css.logMetric}
                          style={{ color: c2 }}
                        >
                          {l2 + ":" + v2 + "%"}
                        </span>
                      ))}
                    </div>
                    {i > 0 && (
                      <div className={css.logImprove}>
                        {"F1 +" +
                          (h.f - ITER_HISTORY[i - 1].f).toFixed(1) +
                          "%"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPane>

        <TabPane key="pts" tab="测点参数">
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
                <div
                  className={clsx(
                    css.ptsRow,
                    editPt === i && css.ptsRowEditing,
                  )}
                >
                  <span className={css.ptsName}>{p.nm}</span>
                  <span className={css.ptsTag}>{p.tag}</span>
                  <span className={css.ptsNum}>{p.hi}</span>
                  <span className={css.ptsNum}>{p.lo}</span>
                  <span className={css.ptsLv}>
                    <span
                      className={css.lvTag}
                      style={{
                        color: LV_COLORS[p.lv] || TH.t3,
                        background: (LV_COLORS[p.lv] || TH.t3) + "12",
                      }}
                    >
                      {p.lv}
                    </span>
                  </span>
                  <span className={css.ptsSup}>{p.sup}</span>
                  <div
                    className={clsx(
                      css.ptsLock,
                      p.lock ? css.ptsLockLocked : css.ptsLockUnlocked,
                    )}
                    onClick={() => toggleLock(i)}
                  >
                    <Ic name={p.lock ? "lock" : "unlock"} size={12} />
                  </div>
                  <div className={css.ptsEdit}>
                    <Btn
                      small
                      ghost
                      onClick={() =>
                        editPt === i ? setEditPt(null) : startEdit(i)
                      }
                      icon={editPt === i ? "x" : "edit3"}
                    >
                      {editPt === i ? "收起" : "编辑"}
                    </Btn>
                  </div>
                </div>
                {editPt === i && (
                  <div className={css.ptsEditForm}>
                    <div className={css.editGrid}>
                      <div>
                        <label className={css.editLabel}>上限阈值</label>
                        <input
                          className={clsx(css.samInput, "ant-input")}
                          value={editVals.hi}
                          onChange={(e) =>
                            setEditVals((v) => ({ ...v, hi: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className={css.editLabel}>下限阈值</label>
                        <input
                          className={clsx(css.samInput, "ant-input")}
                          value={editVals.lo}
                          onChange={(e) =>
                            setEditVals((v) => ({ ...v, lo: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <label className={css.editLabel}>报警级别</label>
                        <div className={css.lvBtns}>
                          {["严重", "警告", "注意", "参考"].map((lv) => (
                            <button
                              key={lv}
                              className={css.lvBtn}
                              style={
                                editVals.lv === lv
                                  ? {
                                      borderColor: LV_COLORS[lv] || TH.t3,
                                      background:
                                        (LV_COLORS[lv] || TH.t3) + "12",
                                      color: LV_COLORS[lv] || TH.t3,
                                    }
                                  : {}
                              }
                              onClick={() => setEditVals((v) => ({ ...v, lv }))}
                            >
                              {lv}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={css.editLabel}>抑制规则</label>
                        <input
                          className={clsx(css.samInput, "ant-input")}
                          value={editVals.sup}
                          onChange={(e) =>
                            setEditVals((v) => ({ ...v, sup: e.target.value }))
                          }
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
        </TabPane>

        <TabPane key="diag" tab="自动诊断">
          <div className={css.diagGrid}>
            <div className={css.panelCard}>
              <div className={css.diagSuccess}>
                <div className={css.diagSuccessTitle}>{"✓ 模型已达标"}</div>
                <div className={css.diagSuccessDesc}>
                  {"F1 93.0%≥90% | 误报率 3.1%≤5%"}
                </div>
              </div>
              <div className={css.diagNotes}>
                {"本轮优化："}
                <br />
                {"• 贝叶斯优化油温阈值 70→72°C"}
                <br />
                {"• 抑制规则：连续3次/5min窗口"}
                <br />
                {"• 85%误报来自启停机，已增补样本"}
                <br />
                {"• 剔除低重要性测点 GBX_FLT_DP"}
              </div>
            </div>
            <div className={css.panelCard}>
              <div className={css.panelCardTitle}>误报分布</div>
              {[
                ["启停机", 85, TH.rd],
                ["极端风速", 10, TH.yl],
                ["传感器异常", 5, TH.bl],
              ].map(([l, v, c]) => (
                <div key={String(l)} className={css.faItem}>
                  <div className={css.faItemHeader}>
                    <span className={css.faItemLabel}>{l}</span>
                    <span className={css.faItemVal}>{v + "%"}</span>
                  </div>
                  <Prog value={Number(v)} color={String(c)} />
                </div>
              ))}
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI ASSISTANT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function parseAiCmd(text, models) {
  const t = text.toLowerCase();
  const cm = t.match(
    /(?:创建|建立|新建|帮我.{0,8}(?:创建|建立|做|建)).*?(a厂|b厂|c厂).*?(?:所有|全部|每台|全场)?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)/,
  );
  if (cm) {
    const pl = cm[1].charAt(0).toUpperCase() + "厂";
    const pi = PLANTS[pl];
    return {
      intent: "create",
      original: text,
      entities: {
        plant: pl,
        scene: cm[2],
        turbineType: pi ? pi.type : "SG4.2-145",
        turbineRange: pi
          ? pi.turbines[0] + "~" + pi.turbines[pi.turbines.length - 1]
          : "",
        count: pi ? pi.turbines.length : 0,
      },
    };
  }
  const om = t.match(
    /(?:优化|改进|调整|提升|改善).*?([abc]\d{1,3})?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)?/i,
  );
  if (om && (om[1] || om[2])) {
    const turb = om[1] ? om[1].toUpperCase() : "";
    const sc = om[2] || "齿轮箱";
    const pl = turb
      ? turb.startsWith("A")
        ? "A厂"
        : turb.startsWith("B")
          ? "B厂"
          : "C厂"
      : "A厂";
    const m = models.find((x) => x.plant === pl && x.sc === sc);
    return {
      intent: "optimize",
      original: text,
      entities: {
        plant: pl,
        turbine: turb || "全部",
        scene: sc,
        modelName: m ? m.name : sc + "预警模型",
      },
      model: m,
    };
  }
  const sm = t.match(/(?:状态|情况|概况|查看|汇报|报告|怎么样|运行)/);
  if (sm) {
    const pm = t.match(/(a厂|b厂|c厂)/);
    const pl = pm ? pm[1].charAt(0).toUpperCase() + "厂" : "A厂";
    return {
      intent: "status",
      original: text,
      entities: {
        plant: pl,
        modelCount: models.filter((x) => x.plant === pl).length,
      },
    };
  }
  return null;
}

function AiPanel({ expanded, onToggle, onNav, models }) {
  const [msgs, setMsgs] = useState([
    {
      role: "ai",
      text: "你好！我是 AI 建模助手。\n\n输入自然语言指令，我会先理解你的意图并确认后再执行。\n\n试试描述你想做什么。",
    },
  ]);
  const [input, setInput] = useState("");
  const [rec, setRec] = useState(false);
  const [phase, setPhase] = useState(null);
  const [voiceTxt, setVoiceTxt] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, phase]);

  const addMsg = (msg) => setMsgs((p) => [...p, msg]);

  const processInput = (text) => {
    if (!text.trim()) return;
    addMsg({ role: "user", text: text.trim() });
    setInput("");
    setPhase("thinking");
    setTimeout(() => {
      setPhase("parsing");
      const parsed = parseAiCmd(text, models);
      setTimeout(() => {
        setPhase(null);
        if (!parsed) {
          addMsg({
            role: "ai",
            text: '抱歉，未能完全理解你的意图。可以换一种方式描述吗？\n\n例如：\n• "帮我创建A厂全部风机的齿轮箱模型"\n• "优化B03的叶片检测模型"\n• "查看B厂的模型运行状态"',
          });
          return;
        }
        addMsg({
          role: "ai",
          text: "我对你的指令进行了语义分析：",
          card: { type: "parse", parsed },
        });
      }, 600);
    }, 800);
  };

  const confirmParse = (parsed) => {
    addMsg({ role: "user", text: "✓ 确认，请继续" });
    setPhase("thinking");
    setTimeout(() => {
      setPhase(null);
      if (parsed.intent === "create") {
        addMsg({
          role: "ai",
          text: "已生成建模计划：",
          card: { type: "plan", data: parsed.entities },
        });
      } else if (parsed.intent === "optimize") {
        addMsg({
          role: "ai",
          text: "已定位模型，优化方案如下：",
          card: { type: "opt", data: parsed },
        });
      } else if (parsed.intent === "status") {
        const list = models.filter((x) => x.plant === parsed.entities.plant);
        addMsg({
          role: "ai",
          text: parsed.entities.plant + "模型概况：",
          card: {
            type: "status",
            data: { plant: parsed.entities.plant, list },
          },
        });
      }
    }, 600);
  };

  const rejectParse = () => {
    addMsg({ role: "user", text: "理解有误，我重新描述" });
    addMsg({ role: "ai", text: "好的，请重新描述你的需求。" });
  };

  const simVoice = () => {
    setRec(true);
    setVoiceTxt("");
    const phrases = [
      "请帮我",
      "请帮我创建",
      "请帮我创建A厂",
      "请帮我创建A厂所有风机的",
      "请帮我创建A厂所有风机的齿轮箱模型",
    ];
    let i = 0;
    const iv = setInterval(() => {
      if (i < phrases.length) {
        setVoiceTxt(phrases[i]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => {
          setRec(false);
          setVoiceTxt("");
          processInput(phrases[phrases.length - 1]);
        }, 500);
      }
    }, 450);
  };

  // ── Sub-cards ──
  function ParseCard({ parsed }) {
    const intentLabels = {
      create: { l: "批量创建模型", c: TH.gn, ic: "zap" },
      optimize: { l: "模型优化", c: TH.yl, ic: "gear" },
      status: { l: "状态查询", c: TH.bl, ic: "gauge" },
    };
    const info = intentLabels[parsed.intent] || {
      l: "未知",
      c: TH.t3,
      ic: "info",
    };
    const entLabels = {
      plant: "目标风场",
      scene: "故障场景",
      turbineType: "机型",
      turbineRange: "风机范围",
      count: "风机数量",
      turbine: "目标风机",
      modelName: "目标模型",
      modelCount: "模型数量",
    };
    return (
      <div className={css.aiCard}>
        <div className={css.aiCardHead} style={{ background: info.c + "06" }}>
          <div className={css.aiCardHeadTitleRow}>
            <div
              className={css.aiCardHeadIcon}
              style={{ background: info.c + "15", color: info.c }}
            >
              <Ic name="brain" size={12} />
            </div>
            <span className={css.aiCardHeadTitle}>语义理解结果</span>
          </div>
          <div>
            <span className={css.intentLabel}>识别意图：</span>
            <span
              className={css.intentBadge}
              style={{ color: info.c, background: info.c + "12" }}
            >
              <Ic name={info.ic} size={10} />
              {info.l}
            </span>
          </div>
        </div>
        <div className={css.aiCardBody}>
          <div className={css.entityLabel}>提取实体</div>
          {Object.entries(parsed.entities).map(([k, v]) => (
            <div key={k} className={css.entityRow}>
              <span className={css.entityKey}>{entLabels[k] || k}</span>
              <span className={css.entityVal}>{String(v)}</span>
            </div>
          ))}
          <div className={css.entityOriginal}>
            <span className={css.entityKey}>原始输入</span>
            <span className={css.entityQuote}>
              {'"' + parsed.original + '"'}
            </span>
          </div>
        </div>
        <div className={css.aiCardFoot}>
          <Btn small icon="x" onClick={rejectParse}>
            重新描述
          </Btn>
          <Btn small primary icon="check" onClick={() => confirmParse(parsed)}>
            确认无误，继续
          </Btn>
        </div>
      </div>
    );
  }

  function PlanCard({ data }) {
    const [st, setSt] = useState("ready");
    const pi = PLANTS[data.plant];
    return (
      <div className={css.aiCard}>
        <div className={css.planCardHead}>
          <span className={css.planCardTitle}>
            {data.plant + " " + data.scene + " 建模计划"}
          </span>
        </div>
        <div className={css.planRows}>
          {[
            ["风场", data.plant],
            ["机型", data.turbineType],
            ["场景", data.scene],
            ["风机", data.turbineRange + "（" + data.count + "台）"],
            ["测点", "知识图谱推荐"],
            ["算法", "AutoML竞赛"],
          ].map(([l, v]) => (
            <div key={l} className={css.planRow}>
              <span className={css.planRowKey}>{l}</span>
              <span className={css.planRowVal}>{v}</span>
            </div>
          ))}
        </div>
        <div className={css.planFoot}>
          {st === "done" ? (
            <div className={css.planLaunchedWrap}>
              <span className={css.planLaunchedTxt}>{"✓ 已启动"}</span>
              <Btn small ghost icon="ext" onClick={() => onNav("dashboard")}>
                查看列表
              </Btn>
            </div>
          ) : (
            <>
              <Btn small onClick={() => onNav("wizard")}>
                手动调整
              </Btn>
              <Btn
                small
                primary
                icon="zap"
                disabled={st === "launching"}
                onClick={() => {
                  setSt("launching");
                  setTimeout(() => {
                    const m = {
                      id: Date.now(),
                      name: data.scene + "预警模型",
                      plant: data.plant,
                      turb: data.turbineRange,
                      type: data.turbineType,
                      status: "training",
                      algo: "AutoML",
                      p: null,
                      r: null,
                      f1: null,
                      fa: null,
                      iter: 0,
                      pts: 8,
                      sc: data.scene,
                      progress: 8,
                      ptCfg: [],
                    };
                    onNav("addModel", m);
                    setSt("done");
                  }, 1000);
                }}
              >
                {st === "launching" ? "启动中..." : "确认启动"}
              </Btn>
            </>
          )}
        </div>
      </div>
    );
  }

  function OptCard({ data }) {
    const sugs = [
      {
        id: 1,
        act: "增加低风速训练样本",
        imp: "召回率+3~5%",
        tp: "sample",
        auto: true,
      },
      {
        id: 2,
        act: "开启报警抑制优化",
        imp: "误报率-2~4%",
        tp: "threshold",
        auto: true,
      },
      {
        id: 3,
        act: "切换Autoencoder算法",
        imp: "关联分析更优",
        tp: "algorithm",
        auto: false,
      },
      {
        id: 4,
        act: "增加环境温补测点",
        imp: "季节误报改善",
        tp: "point",
        auto: true,
      },
    ];
    const [sel, setSel] = useState(sugs.filter((s) => s.auto).map((s) => s.id));
    const [st, setSt] = useState("ready");
    const m = data.model;
    const mc = {
      p: m ? m.p || 87.5 : 87.5,
      r: m ? m.r || 78.3 : 78.3,
      f1: m ? m.f1 || 82.6 : 82.6,
      fa: m ? m.fa || 8.2 : 8.2,
    };
    const tpC = {
      sample: TH.bl,
      threshold: TH.yl,
      algorithm: TH.pr,
      point: TH.ac,
    };
    const tpL = {
      sample: "样本",
      threshold: "阈值",
      algorithm: "算法",
      point: "测点",
    };
    return (
      <div className={css.aiCard}>
        <div className={css.optCardHead}>
          <div style={{ fontWeight: 600, fontSize: 11.5, color: TH.tx }}>
            {data.entities.plant +
              " " +
              data.entities.turbine +
              " " +
              data.entities.scene}
          </div>
          <div className={css.optMetrics}>
            {[
              ["准确率", mc.p, TH.ac],
              ["召回率", mc.r, TH.bl],
              ["F1", mc.f1, TH.gn],
              ["误报率", mc.fa, mc.fa > 5 ? TH.rd : TH.gn],
            ].map(([l, v, c]) => (
              <div key={String(l)} className={css.optMetric}>
                <div className={css.optMetricLbl}>{l}</div>
                <div className={css.optMetricVal} style={{ color: c }}>
                  {v + "%"}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={css.optSuggestions}>
          {sugs.map((s) => {
            const on = sel.includes(s.id);
            const tc = tpC[s.tp] || TH.t3;
            return (
              <div
                key={s.id}
                className={css.optSug}
                style={{
                  borderColor: on ? tc + "30" : undefined,
                  background: on ? tc + "06" : undefined,
                }}
                onClick={() =>
                  st === "ready" &&
                  setSel((v) =>
                    v.includes(s.id)
                      ? v.filter((x) => x !== s.id)
                      : [...v, s.id],
                  )
                }
              >
                <div
                  className={css.optCheck}
                  style={{
                    borderColor: on ? tc : undefined,
                    background: on ? tc : undefined,
                  }}
                >
                  {on && <Ic name="check" size={7} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={css.optAct}>{s.act}</div>
                  <div className={css.optImp} style={{ color: tc }}>
                    {s.imp}
                  </div>
                </div>
                <span
                  className={css.optTp}
                  style={{ background: tc + "10", color: tc }}
                >
                  {tpL[s.tp]}
                </span>
              </div>
            );
          })}
        </div>
        <div className={css.optFoot}>
          <span className={css.optSelCount}>{"已选" + sel.length + "项"}</span>
          {st === "done" ? (
            <div className={css.optLaunchedWrap}>
              <span style={{ fontSize: 10, color: TH.gn }}>{"✓ 已提交"}</span>
              {m && (
                <Btn small ghost icon="ext" onClick={() => onNav("detail", m)}>
                  查看详情
                </Btn>
              )}
            </div>
          ) : (
            <Btn
              small
              primary
              icon="play"
              disabled={sel.length === 0 || st === "launching"}
              onClick={() => {
                setSt("launching");
                setTimeout(() => {
                  if (m)
                    onNav("updateModel", {
                      ...m,
                      status: "optimizing",
                      iter: (m.iter || 3) + 1,
                    });
                  setSt("done");
                }, 1000);
              }}
            >
              {st === "launching" ? "提交中..." : "执行优化"}
            </Btn>
          )}
        </div>
      </div>
    );
  }

  function StatusCard({ data }) {
    const list = data.list || [];
    const st = {
      total: list.length,
      done: list.filter((x) => x.status === "completed").length,
      run: list.filter(
        (x) => x.status === "training" || x.status === "optimizing",
      ).length,
      rev: list.filter((x) => x.status === "review").length,
      fail: list.filter((x) => x.status === "failed").length,
    };
    return (
      <div className={css.aiCard}>
        <div className={css.statusStats}>
          {[
            ["总数", st.total, TH.tx],
            ["完成", st.done, TH.gn],
            ["运行", st.run, TH.bl],
            ["审核", st.rev, TH.pr],
            ["未达标", st.fail, TH.rd],
          ].map(([l, v, c]) => (
            <div key={String(l)} className={css.statusStat}>
              <div className={css.statusStatLbl}>{l}</div>
              <div className={css.statusStatVal} style={{ color: c }}>
                {v}
              </div>
            </div>
          ))}
        </div>
        {list.map((m) => (
          <div
            key={m.id}
            className={css.statusModelRow}
            onClick={() => onNav("detail", m)}
          >
            <div>
              <span className={css.statusModelName}>{m.name}</span>
              <span className={css.statusModelTurb}>{m.turb}</span>
            </div>
            <div className={css.statusModelRight}>
              <Badge status={m.status} />
              <Ic name="ext" size={11} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Render ──
  if (!expanded) {
    return (
      <div className={css.aiFab} onClick={onToggle}>
        <Ic name="sparkle" size={22} />
      </div>
    );
  }

  return (
    <div className={css.aiPanel}>
      <div className={css.aiPanelHeader}>
        <div className={css.aiPanelBrand}>
          <div className={css.aiPanelLogo}>
            <Ic name="sparkle" size={14} />
          </div>
          <div>
            <div className={css.aiPanelTitle}>AI 建模助手</div>
            <div className={css.aiPanelSub}>语音 / 文字 · 语义理解</div>
          </div>
        </div>
        <div className={css.aiPanelClose} onClick={onToggle}>
          <Ic name="x" size={15} />
        </div>
      </div>

      <div ref={chatRef} className={css.aiChat}>
        {msgs.map((m, i) => (
          <div
            key={i}
            className={clsx(
              css.chatMsg,
              css[`chatMsg${m.role.charAt(0).toUpperCase() + m.role.slice(1)}`],
            )}
          >
            {m.role === "ai" && (
              <div className={css.chatAiLabel}>
                <div className={css.chatAiIcon}>
                  <Ic name="sparkle" size={8} />
                </div>
                <span className={css.chatAiName}>AI</span>
              </div>
            )}
            <div
              className={clsx(
                css.chatBubble,
                css[
                  `chatBubble${m.role.charAt(0).toUpperCase() + m.role.slice(1)}`
                ],
              )}
            >
              {m.text}
            </div>
            {m.card && m.card.type === "parse" && (
              <ParseCard parsed={m.card.parsed} />
            )}
            {m.card && m.card.type === "plan" && (
              <PlanCard data={m.card.data} />
            )}
            {m.card && m.card.type === "opt" && <OptCard data={m.card.data} />}
            {m.card && m.card.type === "status" && (
              <StatusCard data={m.card.data} />
            )}
          </div>
        ))}
        {phase && (
          <div className={css.chatThinking}>
            <div className={css.chatAiLabel}>
              <div className={css.chatAiIcon}>
                <Ic name="sparkle" size={8} />
              </div>
              <span className={css.chatAiName}>AI</span>
            </div>
            <div className={css.thinkingBubble}>
              <Ic name={phase === "thinking" ? "brain" : "search2"} size={13} />
              <span
                className={css.thinkingText}
                style={{ color: phase === "parsing" ? TH.ac : TH.t2 }}
              >
                {phase === "thinking"
                  ? "正在理解你的意图"
                  : "语义解析中，提取实体..."}
              </span>
              <div className={css.dotSpinner}>
                <div className={css.dot} />
                <div className={css.dot} />
                <div className={css.dot} />
              </div>
            </div>
          </div>
        )}
      </div>

      {rec && (
        <div className={css.voiceOverlay}>
          <div className={css.voiceWaves}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={css.waveBarItem}
                style={{ animationDelay: `${i * 0.03}s` }}
              />
            ))}
          </div>
          <div className={css.voiceText}>{voiceTxt || "聆听中..."}</div>
        </div>
      )}

      <div className={css.aiCats}>
        <div className={css.aiCatsLabel}>指令分类</div>
        <div className={css.aiCatsGrid}>
          {AI_CATS.map((cat, i) => (
            <button
              key={i}
              className={css.aiCatBtn}
              onClick={() => {
                const hints = {
                  批量建模: "帮我创建",
                  模型优化: "优化",
                  状态查询: "查看模型状态",
                  参数调整: "调整参数",
                };
                setInput(hints[cat.l] || "");
              }}
            >
              <div style={{ color: cat.c, opacity: 0.7 }}>
                <Ic name={cat.ic} size={14} />
              </div>
              <span className={css.aiCatName}>{cat.l}</span>
              <span className={css.aiCatDesc}>{cat.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={css.aiInputArea}>
        <div className={css.aiInputRow}>
          <button
            className={clsx(css.aiMicBtn, rec && css.aiMicBtnRecording)}
            onClick={simVoice}
          >
            <Ic name={rec ? "pause" : "mic"} size={15} />
          </button>
          <div className={css.aiInputWrap}>
            <input
              className={css.aiTextInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") processInput(input);
              }}
              placeholder="用自然语言描述你想做什么..."
            />
            <button
              className={clsx(
                css.aiSendBtn,
                input.trim() && css.aiSendBtnActive,
              )}
              onClick={() => processInput(input)}
            >
              <Ic name="send" size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selModel, setSelModel] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [models, setModels] = useState(createInitModels);
  const [filter, setFilter] = useState("all");

  const showToast = (msg) => {
    message.success(msg);
  };

  const handleAiNav = (act, data) => {
    if (act === "dashboard") {
      setPage("dashboard");
      setAiOpen(false);
    } else if (act === "wizard") {
      setPage("wizard");
      setAiOpen(false);
    } else if (act === "detail" && data) {
      setSelModel(data);
      setPage("detail");
      setAiOpen(false);
    } else if (act === "addModel" && data) {
      setModels((p) => [data, ...p]);
      showToast("模型「" + data.name + "」已创建");
    } else if (act === "updateModel" && data) {
      setModels((p) => p.map((m) => (m.id === data.id ? data : m)));
      showToast("模型已更新");
    }
  };

  const handleUpdate = (u) => {
    setModels((p) => p.map((m) => (m.id === u.id ? u : m)));
    setSelModel(u);
    showToast("参数已更新");
  };

  const filtered =
    filter === "all" ? models : models.filter((m) => m.status === filter);
  const counts = { all: models.length };
  Object.keys(STATUS_MAP).forEach((s) => {
    counts[s] = models.filter((m) => m.status === s).length;
  });

  const runningCount = models.filter(
    (m) => m.status === "training" || m.status === "optimizing",
  ).length;

  const metricClass = (v, good, bad) => {
    if (v === null || v === undefined) return "metricGray";
    return v >= good ? "metricGreen" : v >= bad ? "metricYellow" : "metricRed";
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
            <span className={css.navStatusText}>
              {runningCount + " 运行中"}
            </span>
          </div>
          <div
            className={clsx(css.navAiBtn, aiOpen && css.navAiBtnActive)}
            onClick={() => setAiOpen(!aiOpen)}
          >
            <Ic name="sparkle" size={11} />
            <span className={css.navAiBtnText}>AI 助手</span>
          </div>
        </div>
      </div>

      <div className={clsx(css.appContent, aiOpen && css.appContentAiOpen)}>
        {/* Dashboard */}
        {page === "dashboard" && (
          <div className={css.dashboardWrapper}>
            <div className={css.dashboardStats}>
              {[
                [
                  "模型总数",
                  counts.all,
                  "layers",
                  TH.ac,
                  "rgba(0,212,255,.08)",
                ],
                [
                  "已完成",
                  counts.completed || 0,
                  "check",
                  TH.gn,
                  "rgba(0,230,138,.07)",
                ],
                [
                  "运行中",
                  (counts.training || 0) + (counts.optimizing || 0),
                  "activity",
                  TH.bl,
                  "rgba(96,165,250,.07)",
                ],
                [
                  "待审核",
                  counts.review || 0,
                  "eye",
                  TH.pr,
                  "rgba(167,139,250,.07)",
                ],
                [
                  "未达标",
                  counts.failed || 0,
                  "alert",
                  TH.rd,
                  "rgba(255,77,106,.07)",
                ],
              ].map(([l, v, ic, c, bg]) => (
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
                  { k: "all", l: "全部" },
                  { k: "training", l: "训练中" },
                  { k: "optimizing", l: "优化中" },
                  { k: "review", l: "待审核" },
                  { k: "completed", l: "已完成" },
                  { k: "failed", l: "未达标" },
                ].map((f) => (
                  <button
                    key={f.k}
                    className={clsx(
                      css.filterBtn,
                      filter === f.k && css.filterBtnActive,
                    )}
                    onClick={() => setFilter(f.k)}
                  >
                    {f.l}
                    {(counts[f.k] || 0) > 0 ? " " + (counts[f.k] || 0) : ""}
                  </button>
                ))}
              </div>
              <div className={css.toolbarActions}>
                <Btn icon="sparkle" small onClick={() => setAiOpen(true)}>
                  AI 语音建模
                </Btn>
                <Btn primary small icon="zap" onClick={() => setPage("wizard")}>
                  自动建模向导
                </Btn>
              </div>
            </div>

            <Table
              className={css.modelTable}
              dataSource={filtered}
              rowKey="id"
              size="small"
              pagination={false}
              tableLayout="fixed"
              onRow={(m) => ({
                onClick: () => {
                  setSelModel(m);
                  setPage("detail");
                },
              })}
              columns={[
                {
                  title: "模型",
                  dataIndex: "name",
                  width: "22%",
                  render: (_, m) => (
                    <div>
                      <div className={css.modelTableName}>{m.name}</div>
                      <div className={css.modelTableSub}>
                        {m.sc + "·" + m.turb + "·" + m.pts + "点"}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "风场",
                  dataIndex: "plant",
                  width: "8%",
                  render: (v) => (
                    <span className={css.modelTablePlant}>{v}</span>
                  ),
                },
                {
                  title: "算法",
                  dataIndex: "algo",
                  width: "14%",
                  render: (v) => (
                    <span className={css.modelTableAlgo}>{v}</span>
                  ),
                },
                {
                  title: "准确率",
                  dataIndex: "p",
                  width: "9%",
                  align: "center",
                  render: (v) => (
                    <span
                      className={clsx(
                        css.modelTableMetric,
                        css[metricClass(v, 90, 80)],
                      )}
                    >
                      {v ? v + "%" : "—"}
                    </span>
                  ),
                },
                {
                  title: "召回率",
                  dataIndex: "r",
                  width: "9%",
                  align: "center",
                  render: (v) => (
                    <span
                      className={clsx(
                        css.modelTableMetric,
                        css[metricClass(v, 90, 80)],
                      )}
                    >
                      {v ? v + "%" : "—"}
                    </span>
                  ),
                },
                {
                  title: "误报率",
                  dataIndex: "fa",
                  width: "9%",
                  align: "center",
                  render: (v) => (
                    <span
                      className={clsx(
                        css.modelTableMetric,
                        v !== null
                          ? v <= 5
                            ? css.metricGreen
                            : css.metricRed
                          : css.metricGray,
                      )}
                    >
                      {v !== null ? v + "%" : "—"}
                    </span>
                  ),
                },
                {
                  title: "迭代",
                  dataIndex: "iter",
                  width: "7%",
                  align: "center",
                  render: (v) => (
                    <span className={css.modelTableIter}>{v}</span>
                  ),
                },
                {
                  title: "状态",
                  dataIndex: "status",
                  width: "18%",
                  render: (_, m) => (
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
                  title: "",
                  key: "arrow",
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
        {page === "wizard" && (
          <Wizard
            onBack={() => setPage("dashboard")}
            onComplete={(ms) => {
              setModels((p) => [...ms, ...p]);
              showToast("已创建" + ms.length + "个模型");
              setPage("dashboard");
            }}
          />
        )}

        {/* Detail */}
        {page === "detail" && selModel && (
          <Detail
            model={models.find((m) => m.id === selModel.id) || selModel}
            onBack={() => setPage("dashboard")}
            onUpdate={handleUpdate}
          />
        )}
      </div>

      <AiPanel
        expanded={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
        onNav={handleAiNav}
        models={models}
      />
    </div>
  );
}
