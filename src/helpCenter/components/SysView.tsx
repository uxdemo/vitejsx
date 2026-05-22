import React from 'react';
import clsx from 'clsx';
import { Input } from 'antd';
import { Icon, SelectInput, Option } from '../shared';
import css from '../helpCenter.modules.less';

interface Props {
  whatsNewOpen: boolean;
  onToggleWhatsNew: (e: React.MouseEvent) => void;
  onOpenDrawer: (type: 'global' | 'page') => void;
  onToast: (msg: string) => void;
  onStartTour: () => void;
}

export default function SysView({ whatsNewOpen, onToggleWhatsNew, onOpenDrawer, onToast, onStartTour }: Props) {
  return (
    <div className={css.sysShell}>
      <header className={css.sysHeader}>
        <div className={css.sysLogo}>
          <div className={css.logoIcon}></div>
          <div className={css.name}>
            故障预警及诊断平台
            <small>西门子能源有限公司 · v3.2</small>
          </div>
        </div>
        <nav className={css.sysNav}>
          <a className={css.active}>建模平台</a>
          <a>趋势预警</a>
          <a>故障诊断</a>
          <a>知识库</a>
        </nav>
        <div className={css.sysRight}>
          <button className={css.iconBtn} title="帮助中心 (?)" onClick={() => onOpenDrawer('global')}>
            <Icon type="question-circle" style={{ fontSize: 18 }} />
          </button>
          <button
            className={css.iconBtn}
            title="What's New"
            onClick={onToggleWhatsNew}>
            <Icon type="bell" style={{ fontSize: 18 }} />
            <span className={css.dotRed}></span>
          </button>
          <div className={css.avatar}>王</div>
          <div id="whatsNew" className={clsx(css.whatsNew, whatsNewOpen && css.open)}>
            <div className={css.whatsNewHeader}>
              <h4>
                v3.2 新功能
                <span className={css.verTag}>NEW</span>
              </h4>
              <p>5 月 12 日更新 · 3 项新功能 · 2 项优化</p>
            </div>
            <div className={css.whatsNewList}>
              {[
                { title: '全局模式批量导入', desc: '多个模型可一键复用全局模式表达式,节省配置时间。' },
                { title: '高级规则脚本调试', desc: 'Python 编辑器新增智能提示与全屏模式,支持绘图代码可视化预览。' },
                { title: '告警单 → 案例库自动归档', desc: '关闭告警单时勾选「更新至案例库」,自动沉淀为可复用知识。' },
              ].map((item, i) => (
                <div key={i} className={css.whatsNewItem} onClick={() => onOpenDrawer('global')}>
                  <span className={css.whatsNewBullet}></span>
                  <div className={css.whatsNewText}>
                    <strong>{item.title}</strong> {item.desc}
                    <div className={css.whatsNewLink}>查看教程 →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={css.subNav}>
        <span className={css.subNavLabel}>配置中心 ›</span>
        <a className={css.subNavActive}>模型</a>
        <a className={css.subNavLink}>规则模型</a>
        <a className={css.subNavLink}>计算测点</a>
        <a className={css.subNavLink}>全局触发器</a>
        <span className={css.subNavSuffix}>
          左侧目录树:
          <span className={clsx(css.mono, css.subNavTreeText)}>
            西门子能源智能电厂 › 1号机组 › 燃机专业 › 燃烧系统
          </span>
        </span>
      </div>

      <div className={css.sysWork}>
        <div className={css.workCrumbs}>
          <span>建模平台</span>
          <span className={css.pathSeparator}>/</span>
          <span>配置中心</span>
          <span className={css.pathSeparator}>/</span>
          <span>模型</span>
          <span className={css.pathSeparator}>/</span>
          <span>西门子能源智能电厂</span>
          <span className={css.pathSeparator}>/</span>
          <span>1号机组</span>
          <span className={css.pathSeparator}>/</span>
          <span>燃烧系统</span>
          <span className={css.pathSeparator}>/</span>
          <span className={css.crumbsActive}>demo模型 · 修改模型</span>
          <span className={css.routeChip}>routeKey: /modeling/config/model/mode</span>
        </div>

        <div className={css.workHeader}>
          <div>
            <h1>demo模型 · 工况模式配置</h1>
            <div className={css.subtitle}>机理算法(MMLA)· 单工况 · 由 工程师·王 锁定编辑</div>
          </div>
          <div className={css.workActions}>
            <button className={css.helpBtn} onClick={() => onOpenDrawer('page')}>
              <span className={css.questionMark}>?</span>
              <span>本页帮助</span>
              <span className={css.count}>· 4 篇 / 1 视频</span>
            </button>
            <button className={clsx(css.btn, css.btnSecondary)}>取消</button>
            <button className={clsx(css.btn, css.btnPrimary)}>
              <Icon type="save" />
              保存模式
            </button>
          </div>
        </div>

        <div className={css.workGrid}>
          <aside className={css.workSide}>
            <h4>配置步骤</h4>
            <div className={css.stepNav}>
              <a className={css.done}><span className={css.num}>✓</span> 基本信息</a>
              <a className={css.done}><span className={css.num}>✓</span> 测点选取</a>
              <a className={css.active}><span className={css.num}>3</span> 工况模式</a>
              <a><span className={css.num}>4</span> 测点参数</a>
              <a><span className={css.num}>5</span> 样本选取</a>
              <a><span className={css.num}>6</span> 模型训练</a>
            </div>
          </aside>

          <section className={css.workCard}>
            <h2>新增模式</h2>
            <div className={css.sectionHint}>
              为模型添加一个工况判定模式。模式有两个核心作用:限定样本选取范围、控制 AI 计算的生效时段。
            </div>

            <div className={css.formRow}>
              <div className={css.formLabel}>
                模式名称 <span className={css.req}>*</span>
                <span className={css.infoI} tabIndex={0} title="建议使用简洁的状态描述">i</span>
              </div>
              <div className={css.formControl}>
                <Input defaultValue="运行" style={{ maxWidth: 400 }} />
                <div className={css.hint}>建议用简洁状态描述,如「运行」「并网」「停机」,便于一眼识别。</div>
              </div>
            </div>

            <div className={css.formRow}>
              <div className={css.formLabel}>
                优先级 <span className={css.req}>*</span>
                <span className={clsx(css.infoI, css.hasPopover)} tabIndex={0}>
                  i
                  <div className={css.popover}>
                    <div className={css.popTitle}>
                      <Icon type="clock-circle" />
                      优先级如何起作用?
                    </div>
                    <p>取值范围 1–5,<strong>数字越小优先级越高</strong>。当多个模式的判断规则出现重叠时,系统会选择优先级最高的模式生效。</p>
                    <div className={css.popImg}>
                      建议:精确严格的工况 → 高优先级<br />宽泛兜底的工况 → 低优先级
                    </div>
                    <span className={css.popLink} onClick={(e) => { e.stopPropagation(); onOpenDrawer('page'); }}>
                      查看完整教程 →
                    </span>
                  </div>
                </span>
              </div>
              <div className={css.formControl}>
                <SelectInput defaultValue="2" style={{ maxWidth: 400, width: '100%' }}>
                  <Option value="1">1 — 最高(最精确的工况)</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5 — 最低(兜底工况)</Option>
                </SelectInput>
                <div className={css.hint}>数字越小优先级越高。多模式条件重叠时,优先级高者生效。</div>
              </div>
            </div>

            <div className={css.formRow}>
              <div className={css.formLabel}>标识色</div>
              <div className={clsx(css.formControl, css.formControlFull)}>
                <div className={css.colorSwatchRow}>
                  {[
                    { bg: 'var(--steel-500)', selected: true },
                    { bg: 'var(--amber-500)' },
                    { bg: 'var(--emerald-500)' },
                    { bg: 'var(--rose-500)' },
                    { bg: '#7C3AED' },
                  ].map((c, i) => (
                    <span
                      key={i}
                      className={clsx(css.colorSwatch, c.selected && css.colorSwatchSelected)}
                      style={{ background: c.bg, boxShadow: c.selected ? `0 0 0 2px ${c.bg}` : undefined }}
                    />
                  ))}
                </div>
                <div className={css.hint}>用于在模型配置页中区分不同模式的矩形框颜色。</div>
              </div>
            </div>

            <div className={css.formRow}>
              <div className={css.formLabel}>
                模式表达式 <span className={css.req}>*</span>
                <span className={clsx(css.infoI, css.hasPopover)} tabIndex={0}>
                  i
                  <div className={css.popover}>
                    <div className={css.popTitle}>
                      <Icon type="table" />
                      AND / OR 的执行顺序
                    </div>
                    <p><strong>AND 和 OR 之间没有优先级</strong>,系统严格按从上到下顺序依次判断,因此要将关键条件放在前面。</p>
                    <div className={css.popImg}>
                      如 A AND B OR C<br />实际执行 = (A AND B) OR C
                    </div>
                    <span className={css.popLink} onClick={(e) => { e.stopPropagation(); onOpenDrawer('page'); }}>
                      查看完整教程 →
                    </span>
                  </div>
                </span>
              </div>
              <div className={clsx(css.formControl, css.formControlFull)}>
                <div className={css.exprCol}>
                  <div className={css.exprRow}>
                    <span className={css.kbdPill}>原始测点</span>
                    <span className={clsx(css.kbdPill, css.kbdPillWhite)}>主轴转速 SHAFT_SPEED</span>
                    <span className={clsx(css.kbdPill, css.kbdPillDark)}>≥</span>
                    <span className={clsx(css.kbdPill, css.kbdPillWhite)}>3000</span>
                    <span className={clsx(css.kbdPill, css.kbdPillUnit)}>rpm</span>
                  </div>
                  <div className={css.exprAndRow}>
                    <span className={clsx(css.kbdPill, css.kbdPillAnd)}>AND</span>
                    <span className={css.exprAndHint}>↓ 从上到下顺序执行</span>
                  </div>
                  <div className={css.exprRow}>
                    <span className={css.kbdPill}>原始测点</span>
                    <span className={clsx(css.kbdPill, css.kbdPillWhite)}>燃料流量 FUEL_FLOW</span>
                    <span className={clsx(css.kbdPill, css.kbdPillDark)}>{'>'}</span>
                    <span className={clsx(css.kbdPill, css.kbdPillWhite)}>10</span>
                    <span className={clsx(css.kbdPill, css.kbdPillUnit)}>t/h</span>
                  </div>
                  <button className={css.addExprBtn}>+ 添加表达式</button>
                </div>
                <div className={css.hint}>运算符共 6 种:≥ / ≤ / &gt; / &lt; / = / ≠。</div>
              </div>
            </div>

            <div className={css.formRow}>
              <div className={css.formLabel}>已有模式</div>
              <div className={clsx(css.formControl, css.formControlFull)}>
                <div className={css.modeTagRow}>
                  <span className={clsx(css.metaTag, css.modeTagSteel)}>
                    <span className={css.dot}></span>运行 · 优先级 2(本次编辑)
                  </span>
                  <span className={clsx(css.metaTag, css.modeTagAmber)}>
                    <span className={css.dot}></span>并网 · 优先级 1
                  </span>
                  <span className={clsx(css.metaTag, css.modeTagAdd)}>+ 新增模式</span>
                  <span className={clsx(css.metaTag, css.modeTagImport)}>⤵ 导入全局模式</span>
                </div>
                <div className={css.hint}>全局模式适用于多个模型共用相同工况的场景,导入后可快速完成配置。</div>
              </div>
            </div>

            <div className={css.emptyState}>
              <div className={css.emptyIcon}>
                <Icon type="table" style={{ fontSize: 22 }} />
              </div>
              <h3>下一步:为「运行」模式选取训练样本</h3>
              <p>模式定义了 AI 计算的生效时段。保存后请进入「样本选取」,选择该模式下的正常运行时段作为训练样本。</p>
              <div className={css.emptyCta}>
                <button className={clsx(css.btn, css.btnPrimary)} onClick={() => onOpenDrawer('page')}>
                  <Icon type="check-circle" />
                  查看「样本选取」教程
                </button>
                <button className={clsx(css.btn, css.btnSecondary)}>直接进入样本选取 →</button>
              </div>
            </div>
          </section>
        </div>

        <div className={css.sysTip}>
          💡 提示:点击页面右上角 <span className={css.kbdPill}>? 本页帮助</span>{' '}
          可在不离开本页的情况下查看相关教程;按 <span className={css.kbdPill}>Shift + /</span> 也可快速打开。
          <a className={css.sysTipLink} onClick={onStartTour}>▶ 重新观看新手引导</a>
        </div>
      </div>
    </div>
  );
}
