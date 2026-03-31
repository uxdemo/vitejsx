import React, { useState, useEffect, useRef } from 'react';
import * as css from './styles/AiPanel.module.less';
import clsx from 'clsx';
import { PLANTS, AI_CATS } from './constant';
import type { ModelItem, ModelStatus, PtCfgItem } from './constant';
import { Ic, Btn, Badge } from './ui';

type AiIntent = 'create' | 'optimize' | 'status' | 'adjust';

interface CreateEntities {
  plant: string;
  scene: string;
  turbineType: string;
  turbineRange: string;
  count: number;
}

interface OptimizeEntities {
  plant: string;
  turbine: string;
  scene: string;
  modelName: string;
}

interface StatusEntities {
  plant: string;
  modelCount: number;
}

interface AdjustEntities {
  plant: string;
  turbine: string;
  scene: string;
  modelName: string;
  paramType: 'threshold' | 'suppress' | 'both';
  targetPoint?: string;
  newValue?: { hi?: number; lo?: number; sup?: string };
}

interface ParsedCreate {
  intent: 'create';
  original: string;
  entities: CreateEntities;
}

interface ParsedOptimize {
  intent: 'optimize';
  original: string;
  entities: OptimizeEntities;
  model: ModelItem | undefined;
}

interface ParsedStatus {
  intent: 'status';
  original: string;
  entities: StatusEntities;
}

interface ParsedAdjust {
  intent: 'adjust';
  original: string;
  entities: AdjustEntities;
  model: ModelItem | undefined;
}

type ParsedCmd = ParsedCreate | ParsedOptimize | ParsedStatus | ParsedAdjust;

interface AiCardData {
  type: 'parse';
  parsed: ParsedCmd;
}

interface AiPlanData {
  type: 'plan';
  data: CreateEntities;
}

interface AiOptData {
  type: 'opt';
  data: ParsedOptimize;
}

interface AiStatusData {
  type: 'status';
  data: { plant: string; list: ModelItem[] };
}

interface AiAdjustData {
  type: 'adjust';
  data: ParsedAdjust;
}

type AiCardPayload = AiCardData | AiPlanData | AiOptData | AiStatusData | AiAdjustData;

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
  card?: AiCardPayload;
}

type AiNavAction = 'dashboard' | 'wizard' | 'detail' | 'addModel' | 'updateModel';

interface AiPanelProps {
  expanded: boolean;
  onToggle: () => void;
  onNav: (act: AiNavAction, data?: ModelItem) => void;
  models: ModelItem[];
}

export const parseAiCmd = (text: string, models: ModelItem[]): ParsedCmd | null => {
  const t = text.toLowerCase();
  const cm = t.match(
    /(?:创建|建立|新建|帮我.{0,8}(?:创建|建立|做|建)).*?(a厂|b厂|c厂).*?(?:所有|全部|每台|全场)?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)/,
  );
  if (cm) {
    const pl = cm[1].charAt(0).toUpperCase() + '厂';
    const pi = PLANTS[pl];
    return {
      intent: 'create',
      original: text,
      entities: {
        plant: pl,
        scene: cm[2],
        turbineType: pi ? pi.type : 'SG4.2-145',
        turbineRange: pi ? pi.turbines[0] + '~' + pi.turbines[pi.turbines.length - 1] : '',
        count: pi ? pi.turbines.length : 0,
      },
    };
  }
  // 参数调整指令 - 需要在优化指令之前匹配
  const am = t.match(
    /(?:调整|修改|设置|更改|变更).*?((?:阈值|抑制|参数|报警|上下限|油温|温度|压力|风速)).*?([abc]\d{0,3})?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)?/i,
  );
  if (am) {
    const paramText = am[1];
    const turb = am[2] ? am[2].toUpperCase() : '';
    const sc = am[3] || '齿轮箱';
    const pl = turb ? (turb.startsWith('A') ? 'A厂' : turb.startsWith('B') ? 'B厂' : 'C厂') : 'A厂';
    const m = models.find((x) => x.plant === pl && x.sc === sc);

    // 判断参数类型
    let paramType: 'threshold' | 'suppress' | 'both' = 'both';
    if (paramText.includes('抑制')) {
      paramType = 'suppress';
    } else if (paramText.includes('阈值') || paramText.includes('上限') || paramText.includes('下限')) {
      paramType = 'threshold';
    }

    // 提取数值
    const numMatch = t.match(/(\d{1,3})\s*(°?c?|bar?|%?)/i);
    let newValue: { hi?: number; lo?: number; sup?: string } | undefined;
    if (numMatch) {
      const val = parseInt(numMatch[1], 10);
      const unit = numMatch[2]?.toLowerCase();
      if (paramText.includes('上限') || paramText.includes('高')) {
        newValue = { hi: val };
      } else if (paramText.includes('下限') || paramText.includes('低')) {
        newValue = { lo: val };
      } else if (val > 50) {
        newValue = { hi: val };
      } else {
        newValue = { lo: val };
      }
    }

    return {
      intent: 'adjust',
      original: text,
      entities: {
        plant: pl,
        turbine: turb || 'A01',
        scene: sc,
        modelName: m ? m.name : sc + '预警模型',
        paramType,
        targetPoint: paramText.includes('油温') ? '齿轮箱油温' : undefined,
        newValue,
      },
      model: m,
    };
  }
  const om = t.match(/(?:优化|改进|提升|改善).*?([abc]\d{1,3})?.*?(齿轮箱|发电机|叶片|偏航|变桨|主轴承|变流器)?/i);
  if (om && (om[1] || om[2])) {
    const turb = om[1] ? om[1].toUpperCase() : '';
    const sc = om[2] || '齿轮箱';
    const pl = turb ? (turb.startsWith('A') ? 'A厂' : turb.startsWith('B') ? 'B厂' : 'C厂') : 'A厂';
    const m = models.find((x) => x.plant === pl && x.sc === sc);
    return {
      intent: 'optimize',
      original: text,
      entities: {
        plant: pl,
        turbine: turb || '全部',
        scene: sc,
        modelName: m ? m.name : sc + '预警模型',
      },
      model: m,
    };
  }
  const sm = t.match(/(?:状态|情况|概况|查看|汇报|报告|怎么样|运行)/);
  if (sm) {
    const pm = t.match(/(a厂|b厂|c厂)/);
    const pl = pm ? pm[1].charAt(0).toUpperCase() + '厂' : 'A厂';
    return {
      intent: 'status',
      original: text,
      entities: {
        plant: pl,
        modelCount: models.filter((x) => x.plant === pl).length,
      },
    };
  }
  return null;
};

export const AiPanel = ({ expanded, onToggle, onNav, models }: AiPanelProps): React.ReactElement => {
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: '你好！我是 AI 建模助手。\n\n输入自然语言指令，我会先理解你的意图并确认后再执行。\n\n试试描述你想做什么。',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [rec, setRec] = useState<boolean>(false);
  const [phase, setPhase] = useState<'thinking' | 'parsing' | null>(null);
  const [voiceTxt, setVoiceTxt] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, phase]);

  const addMsg = (msg: ChatMessage): void => setMsgs((p) => [...p, msg]);

  const processInput = (text: string): void => {
    if (!text.trim()) return;
    addMsg({ role: 'user', text: text.trim() });
    setInput('');
    setPhase('thinking');
    setTimeout(() => {
      setPhase('parsing');
      const parsed = parseAiCmd(text, models);
      setTimeout(() => {
        setPhase(null);
        if (!parsed) {
          addMsg({
            role: 'ai',
            text: '抱歉，未能完全理解你的意图。可以换一种方式描述吗？\n\n例如：\n• "帮我创建A厂全部风机的齿轮箱模型"\n• "优化B03的叶片检测模型"\n• "查看B厂的模型运行状态"',
          });
          return;
        }
        addMsg({
          role: 'ai',
          text: '我对你的指令进行了语义分析：',
          card: { type: 'parse', parsed },
        });
      }, 600);
    }, 800);
  };

  const confirmParse = (parsed: ParsedCmd): void => {
    addMsg({ role: 'user', text: '✓ 确认，请继续' });
    setPhase('thinking');
    setTimeout(() => {
      setPhase(null);
      if (parsed.intent === 'create') {
        addMsg({
          role: 'ai',
          text: '已生成建模计划：',
          card: { type: 'plan', data: parsed.entities },
        });
      } else if (parsed.intent === 'optimize') {
        addMsg({
          role: 'ai',
          text: '已定位模型，优化方案如下：',
          card: { type: 'opt', data: parsed },
        });
      } else if (parsed.intent === 'status') {
        const list = models.filter((x) => x.plant === parsed.entities.plant);
        addMsg({
          role: 'ai',
          text: parsed.entities.plant + '模型概况：',
          card: {
            type: 'status',
            data: { plant: parsed.entities.plant, list },
          },
        });
      } else if (parsed.intent === 'adjust') {
        addMsg({
          role: 'ai',
          text: '参数调整方案：',
          card: { type: 'adjust', data: parsed },
        });
      }
    }, 600);
  };

  const rejectParse = (): void => {
    addMsg({ role: 'user', text: '理解有误，我重新描述' });
    addMsg({ role: 'ai', text: '好的，请重新描述你的需求。' });
  };

  const simVoice = (): void => {
    setRec(true);
    setVoiceTxt('');
    const phrases: string[] = [
      '请帮我',
      '请帮我创建',
      '请帮我创建A厂',
      '请帮我创建A厂所有风机的',
      '请帮我创建A厂所有风机的齿轮箱模型',
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
          setVoiceTxt('');
          processInput(phrases[phrases.length - 1]);
        }, 500);
      }
    }, 450);
  };

  // ── Sub-cards ──
  interface ParseCardProps {
    parsed: ParsedCmd;
  }

  const ParseCard = ({ parsed }: ParseCardProps): React.ReactElement => {
    const intentLabels: Record<AiIntent, { l: string; c: string; ic: string }> = {
      create: { l: '批量创建模型', c: 'var(--success-color)', ic: 'zap' },
      optimize: { l: '模型优化', c: 'var(--warning-color)', ic: 'gear' },
      status: { l: '状态查询', c: 'var(--blue-color)', ic: 'gauge' },
      adjust: { l: '参数调整', c: 'var(--th-pr)', ic: 'sliders' },
    };
    const info = intentLabels[parsed.intent] || {
      l: '未知',
      c: 'var(--disabled-color)',
      ic: 'info',
    };
    const entLabels: Record<string, string> = {
      plant: '目标风场',
      scene: '故障场景',
      turbineType: '机型',
      turbineRange: '风机范围',
      count: '风机数量',
      turbine: '目标风机',
      modelName: '目标模型',
      modelCount: '模型数量',
    };
    return (
      <div className={css.aiCard}>
        <div className={css.aiCardHead} style={{ background: info.c + '06' }}>
          <div className={css.aiCardHeadTitleRow}>
            <div className={css.aiCardHeadIcon} style={{ background: info.c + '15', color: info.c }}>
              <Ic name="brain" size={12} />
            </div>
            <span className={css.aiCardHeadTitle}>语义理解结果</span>
          </div>
          <div>
            <span className={css.intentLabel}>识别意图：</span>
            <span className={css.intentBadge} style={{ color: info.c, background: info.c + '12' }}>
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
            <span className={css.entityQuote}>{'"' + parsed.original + '"'}</span>
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
  };

  interface PlanCardProps {
    data: CreateEntities;
  }

  const PlanCard = ({ data }: PlanCardProps): React.ReactElement => {
    const [st, setSt] = useState<'ready' | 'launching' | 'done'>('ready');
    return (
      <div className={css.aiCard}>
        <div className={css.planCardHead}>
          <span className={css.planCardTitle}>{data.plant + ' ' + data.scene + ' 建模计划'}</span>
        </div>
        <div className={css.planRows}>
          {(
            [
              ['风场', data.plant],
              ['机型', data.turbineType],
              ['场景', data.scene],
              ['风机', data.turbineRange + '（' + data.count + '台）'],
              ['测点', '知识图谱推荐'],
              ['算法', 'AutoML竞赛'],
            ] as [string, string][]
          ).map(([l, v]) => (
            <div key={l} className={css.planRow}>
              <span className={css.planRowKey}>{l}</span>
              <span className={css.planRowVal}>{v}</span>
            </div>
          ))}
        </div>
        <div className={css.planFoot}>
          {st === 'done' ? (
            <div className={css.planLaunchedWrap}>
              <span className={css.planLaunchedTxt}>{'✓ 已启动'}</span>
              <Btn small ghost icon="ext" onClick={() => onNav('dashboard')}>
                查看列表
              </Btn>
            </div>
          ) : (
            <>
              <Btn small onClick={() => onNav('wizard')}>
                手动调整
              </Btn>
              <Btn
                small
                primary
                icon="zap"
                disabled={st === 'launching'}
                onClick={() => {
                  setSt('launching');
                  setTimeout(() => {
                    const m: ModelItem = {
                      id: Date.now(),
                      name: data.scene + '预警模型',
                      plant: data.plant,
                      turb: data.turbineRange,
                      type: data.turbineType,
                      status: 'training' as ModelStatus,
                      algo: 'AutoML',
                      p: null,
                      r: null,
                      f1: null,
                      fa: null,
                      iter: 0,
                      pts: 8,
                      sc: data.scene,
                      progress: 8,
                      ptCfg: [],
                      iterHistory: [],
                    };
                    onNav('addModel', m);
                    setSt('done');
                  }, 1000);
                }}>
                {st === 'launching' ? '启动中...' : '确认启动'}
              </Btn>
            </>
          )}
        </div>
      </div>
    );
  };

  interface OptCardProps {
    data: ParsedOptimize;
  }

  interface OptSuggestion {
    id: number;
    act: string;
    imp: string;
    tp: string;
    auto: boolean;
  }

  const OptCard = ({ data }: OptCardProps): React.ReactElement => {
    const sugs: OptSuggestion[] = [
      {
        id: 1,
        act: '增加低风速训练样本',
        imp: '召回率+3~5%',
        tp: 'sample',
        auto: true,
      },
      {
        id: 2,
        act: '开启报警抑制优化',
        imp: '误报率-2~4%',
        tp: 'threshold',
        auto: true,
      },
      {
        id: 3,
        act: '切换Autoencoder算法',
        imp: '关联分析更优',
        tp: 'algorithm',
        auto: false,
      },
      {
        id: 4,
        act: '增加环境温补测点',
        imp: '季节误报改善',
        tp: 'point',
        auto: true,
      },
    ];
    const [sel, setSel] = useState<number[]>(sugs.filter((s) => s.auto).map((s) => s.id));
    const [st, setSt] = useState<'ready' | 'launching' | 'done'>('ready');
    const m = data.model;
    const mc = {
      p: m ? m.p || 87.5 : 87.5,
      r: m ? m.r || 78.3 : 78.3,
      f1: m ? m.f1 || 82.6 : 82.6,
      fa: m ? m.fa || 8.2 : 8.2,
    };
    const tpC: Record<string, string> = {
      sample: 'var(--blue-color)',
      threshold: 'var(--warning-color)',
      algorithm: 'var(--th-pr)',
      point: 'var(--primary-color)',
    };
    const tpL: Record<string, string> = {
      sample: '样本',
      threshold: '阈值',
      algorithm: '算法',
      point: '测点',
    };
    return (
      <div className={css.aiCard}>
        <div className={css.optCardHead}>
          <div style={{ fontWeight: 600, fontSize: 11.5, color: 'var(--text-color)' }}>
            {data.entities.plant + ' ' + data.entities.turbine + ' ' + data.entities.scene}
          </div>
          <div className={css.optMetrics}>
            {(
              [
                ['准确率', mc.p, 'var(--primary-color)'],
                ['召回率', mc.r, 'var(--blue-color)'],
                ['F1', mc.f1, 'var(--success-color)'],
                ['误报率', mc.fa, mc.fa > 5 ? 'var(--error-color)' : 'var(--success-color)'],
              ] as [string, number, string][]
            ).map(([l, v, c]) => (
              <div key={String(l)} className={css.optMetric}>
                <div className={css.optMetricLbl}>{l}</div>
                <div className={css.optMetricVal} style={{ color: c }}>
                  {v + '%'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={css.optSuggestions}>
          {sugs.map((s) => {
            const on = sel.includes(s.id);
            const tc = tpC[s.tp] || 'var(--disabled-color)';
            return (
              <div
                key={s.id}
                className={css.optSug}
                style={{
                  borderColor: on ? tc + '30' : undefined,
                  background: on ? tc + '06' : undefined,
                }}
                onClick={() =>
                  st === 'ready' && setSel((v) => (v.includes(s.id) ? v.filter((x) => x !== s.id) : [...v, s.id]))
                }>
                <div
                  className={css.optCheck}
                  style={{
                    borderColor: on ? tc : undefined,
                    background: on ? tc : undefined,
                  }}>
                  {on && <Ic name="check" size={7} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div className={css.optAct}>{s.act}</div>
                  <div className={css.optImp} style={{ color: tc }}>
                    {s.imp}
                  </div>
                </div>
                <span className={css.optTp} style={{ background: tc + '10', color: tc }}>
                  {tpL[s.tp]}
                </span>
              </div>
            );
          })}
        </div>
        <div className={css.optFoot}>
          <span className={css.optSelCount}>{'已选' + sel.length + '项'}</span>
          {st === 'done' ? (
            <div className={css.optLaunchedWrap}>
              <span style={{ fontSize: 10, color: 'var(--success-color)' }}>{'✓ 已提交'}</span>
              {m && (
                <Btn small ghost icon="ext" onClick={() => onNav('detail', m)}>
                  查看详情
                </Btn>
              )}
            </div>
          ) : (
            <Btn
              small
              primary
              icon="play"
              disabled={sel.length === 0 || st === 'launching'}
              onClick={() => {
                setSt('launching');
                setTimeout(() => {
                  if (m)
                    onNav('updateModel', {
                      ...m,
                      status: 'optimizing',
                      iter: (m.iter || 3) + 1,
                    });
                  setSt('done');
                }, 1000);
              }}>
              {st === 'launching' ? '提交中...' : '执行优化'}
            </Btn>
          )}
        </div>
      </div>
    );
  };

  interface AdjustCardProps {
    data: ParsedAdjust;
  }

  const AdjustCard = ({ data }: AdjustCardProps): React.ReactElement => {
    const m = data.model;
    // 默认测点配置（如果没有模型数据）
    const defaultPoints: PtCfgItem[] = [
      { nm: '齿轮箱油温', tag: 'GBX_OIL_T', hi: 72, lo: 15, lv: '严重', sup: '连续3次/5min', lock: true },
      { nm: '驱动端轴承温度', tag: 'GBX_DE_T', hi: 85, lo: 20, lv: '警告', sup: '连续2次/3min', lock: false },
      { nm: '齿轮箱油压', tag: 'GBX_OIL_P', hi: 4.5, lo: 1.2, lv: '注意', sup: '连续5次/10min', lock: false },
    ];

    const points: PtCfgItem[] = m?.ptCfg?.length ? m.ptCfg : defaultPoints;

    const [selPoint, setSelPoint] = useState<number>(0);
    const [editHi, setEditHi] = useState<string>(String(points[0]?.hi || 72));
    const [editLo, setEditLo] = useState<string>(String(points[0]?.lo || 15));
    const [editSup, setEditSup] = useState<string>(points[0]?.sup || '连续3次/5min');
    const [st, setSt] = useState<'ready' | 'saving' | 'done'>('ready');

    const currentPoint = points[selPoint] || points[0];

    const handleSave = (): void => {
      setSt('saving');
      setTimeout(() => {
        if (m) {
          const updatedPtCfg = [...points];
          updatedPtCfg[selPoint] = {
            ...updatedPtCfg[selPoint],
            hi: parseFloat(editHi),
            lo: parseFloat(editLo),
            sup: editSup,
          };
          onNav('updateModel', { ...m, ptCfg: updatedPtCfg });
        }
        setSt('done');
      }, 800);
    };

    const entLabels: Record<string, string> = {
      plant: '目标风场',
      turbine: '目标风机',
      scene: '故障场景',
      modelName: '目标模型',
      paramType: '调整类型',
      targetPoint: '测点名称',
    };

    const paramTypeLabels: Record<string, string> = {
      threshold: '阈值调整',
      suppress: '抑制规则',
      both: '阈值+抑制',
    };

    return (
      <div className={css.aiCard}>
        <div className={css.aiCardHead} style={{ background: 'var(--th-pr)' + '06' }}>
          <div className={css.aiCardHeadTitleRow}>
            <div className={css.aiCardHeadIcon} style={{ background: 'var(--th-pr)' + '15', color: 'var(--th-pr)' }}>
              <Ic name="sliders" size={12} />
            </div>
            <span className={css.aiCardHeadTitle}>参数调整</span>
          </div>
        </div>
        <div className={css.aiCardBody}>
          {/* 提取的实体信息 */}
          <div className={css.adjustEntitySection}>
            <div className={css.entityLabel}>识别信息</div>
            {Object.entries(data.entities).map(([k, v]) => {
              if (k === 'newValue') return null;
              const label = entLabels[k] || k;
              let value = String(v);
              if (k === 'paramType') value = paramTypeLabels[v] || v;
              return (
                <div key={k} className={css.entityRow}>
                  <span className={css.entityKey}>{label}</span>
                  <span className={css.entityVal}>{value}</span>
                </div>
              );
            })}
          </div>

          {/* AI 建议的新值 */}
          {data.entities.newValue && (
            <div className={css.adjustSuggestion}>
              <div className={css.adjustSuggestionTitle}>
                <Ic name="sparkle" size={11} />
                <span>AI 建议调整值</span>
              </div>
              {data.entities.newValue.hi !== undefined && (
                <div className={css.adjustSuggestionRow}>
                  <span className={css.adjustSuggestionLabel}>上限阈值</span>
                  <span className={css.adjustSuggestionValue}>{data.entities.newValue.hi}°C</span>
                </div>
              )}
              {data.entities.newValue.lo !== undefined && (
                <div className={css.adjustSuggestionRow}>
                  <span className={css.adjustSuggestionLabel}>下限阈值</span>
                  <span className={css.adjustSuggestionValue}>{data.entities.newValue.lo}°C</span>
                </div>
              )}
            </div>
          )}

          {/* 测点选择器 */}
          <div className={css.adjustPointSelector}>
            <div className={css.adjustPointSelectorLabel}>选择测点</div>
            <div className={css.adjustPointTabs}>
              {points.map((pt, idx) => (
                <button
                  key={idx}
                  className={clsx(css.adjustPointTab, selPoint === idx && css.adjustPointTabActive)}
                  onClick={() => {
                    setSelPoint(idx);
                    setEditHi(String(pt.hi));
                    setEditLo(String(pt.lo));
                    setEditSup(pt.sup);
                  }}>
                  {pt.nm}
                </button>
              ))}
            </div>
          </div>

          {/* 参数编辑表单 */}
          <div className={css.adjustEditForm}>
            <div className={css.adjustEditSection}>
              <div className={css.adjustEditLabel}>上限阈值</div>
              <input
                className={clsx(css.samInput, 'ant-input')}
                type="number"
                value={editHi}
                onChange={(e) => setEditHi(e.target.value)}
                disabled={st !== 'ready'}
              />
            </div>
            <div className={css.adjustEditSection}>
              <div className={css.adjustEditLabel}>下限阈值</div>
              <input
                className={clsx(css.samInput, 'ant-input')}
                type="number"
                value={editLo}
                onChange={(e) => setEditLo(e.target.value)}
                disabled={st !== 'ready'}
              />
            </div>
            <div className={css.adjustEditSection}>
              <div className={css.adjustEditLabel}>抑制规则</div>
              <input
                className={clsx(css.samInput, 'ant-input')}
                value={editSup}
                onChange={(e) => setEditSup(e.target.value)}
                disabled={st !== 'ready'}
                placeholder="如：连续3次/5min"
              />
            </div>
            <div className={css.adjustEditSection}>
              <div className={css.adjustEditLabel}>报警级别</div>
              <div className={css.adjustLevelSelect}>
                {['严重', '警告', '注意', '参考'].map((lv) => (
                  <button
                    key={lv}
                    className={clsx(css.adjustLevelBtn, currentPoint?.lv === lv && css.adjustLevelBtnActive)}>
                    {lv}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 当前值对比 */}
          <div className={css.adjustCompare}>
            <div className={css.adjustCompareTitle}>
              <span>当前值 vs 调整后</span>
            </div>
            <div className={css.adjustCompareGrid}>
              <div className={css.adjustCompareItem}>
                <span className={css.adjustCompareLabel}>上限</span>
                <span className={css.adjustCompareOld}>{currentPoint?.hi}°C</span>
                <Ic name="arrowR" size={10} />
                <span className={css.adjustCompareNew}>{editHi}°C</span>
              </div>
              <div className={css.adjustCompareItem}>
                <span className={css.adjustCompareLabel}>下限</span>
                <span className={css.adjustCompareOld}>{currentPoint?.lo}°C</span>
                <Ic name="arrowR" size={10} />
                <span className={css.adjustCompareNew}>{editLo}°C</span>
              </div>
            </div>
          </div>
        </div>
        <div className={css.aiCardFoot}>
          <Btn small icon="x" onClick={() => onNav('detail', m)}>
            取消
          </Btn>
          {st === 'done' ? (
            <Btn small primary icon="check" onClick={() => onNav('detail', m)}>
              已保存
            </Btn>
          ) : (
            <Btn small primary icon="save" disabled={st === 'saving'} onClick={handleSave}>
              {st === 'saving' ? '保存中...' : '应用调整'}
            </Btn>
          )}
        </div>
      </div>
    );
  };

  interface StatusCardProps {
    data: { plant: string; list: ModelItem[] };
  }

  const StatusCard = ({ data }: StatusCardProps): React.ReactElement => {
    const list = data.list || [];
    const st = {
      total: list.length,
      done: list.filter((x) => x.status === 'completed').length,
      run: list.filter((x) => x.status === 'training' || x.status === 'optimizing').length,
      rev: list.filter((x) => x.status === 'review').length,
      fail: list.filter((x) => x.status === 'failed').length,
    };
    return (
      <div className={css.aiCard}>
        <div className={css.statusStats}>
          {(
            [
              ['总数', st.total, 'var(--text-color)'],
              ['完成', st.done, 'var(--success-color)'],
              ['运行', st.run, 'var(--blue-color)'],
              ['审核', st.rev, 'var(--th-pr)'],
              ['未达标', st.fail, 'var(--error-color)'],
            ] as [string, number, string][]
          ).map(([l, v, c]) => (
            <div key={String(l)} className={css.statusStat}>
              <div className={css.statusStatLbl}>{l}</div>
              <div className={css.statusStatVal} style={{ color: c }}>
                {v}
              </div>
            </div>
          ))}
        </div>
        {list.map((m) => (
          <div key={m.id} className={css.statusModelRow} onClick={() => onNav('detail', m)}>
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
  };

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
          <div key={i} className={clsx(css.chatMsg, css[`chatMsg${m.role.charAt(0).toUpperCase() + m.role.slice(1)}`])}>
            {m.role === 'ai' && (
              <div className={css.chatAiLabel}>
                <div className={css.chatAiIcon}>
                  <Ic name="sparkle" size={8} />
                </div>
                <span className={css.chatAiName}>AI</span>
              </div>
            )}
            <div className={clsx(css.chatBubble, css[`chatBubble${m.role.charAt(0).toUpperCase() + m.role.slice(1)}`])}>
              {m.text}
            </div>
            {m.card && m.card.type === 'parse' && <ParseCard parsed={(m.card as AiCardData).parsed} />}
            {m.card && m.card.type === 'plan' && <PlanCard data={(m.card as AiPlanData).data} />}
            {m.card && m.card.type === 'opt' && <OptCard data={(m.card as AiOptData).data} />}
            {m.card && m.card.type === 'status' && <StatusCard data={(m.card as AiStatusData).data} />}
            {m.card && m.card.type === 'adjust' && <AdjustCard data={(m.card as AiAdjustData).data} />}
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
              <Ic name={phase === 'thinking' ? 'brain' : 'search2'} size={13} />
              <span
                className={css.thinkingText}
                style={{ color: phase === 'parsing' ? 'var(--primary-color)' : 'var(--text-color-secondary)' }}>
                {phase === 'thinking' ? '正在理解你的意图' : '语义解析中，提取实体...'}
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
              <div key={i} className={css.waveBarItem} style={{ animationDelay: `${i * 0.03}s` }} />
            ))}
          </div>
          <div className={css.voiceText}>{voiceTxt || '聆听中...'}</div>
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
                const hints: Record<string, string> = {
                  批量建模: '帮我创建',
                  模型优化: '优化',
                  状态查询: '查看模型状态',
                  参数调整: '调整参数',
                };
                setInput(hints[cat.l] || '');
              }}>
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
          <button className={clsx(css.aiMicBtn, rec && css.aiMicBtnRecording)} onClick={simVoice}>
            <Ic name={rec ? 'pause' : 'mic'} size={15} />
          </button>
          <div className={css.aiInputWrap}>
            <input
              className={css.aiTextInput}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') processInput(input);
              }}
              placeholder="用自然语言描述你想做什么..."
            />
            <button
              className={clsx(css.aiSendBtn, input.trim() && css.aiSendBtnActive)}
              onClick={() => processInput(input)}>
              <Ic name="send" size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;
