import { useState, useEffect, useRef, useCallback } from 'react'
import './helpCenter.css'

const tourSteps = [
  { title: '欢迎来到「工况模式配置」', text: '当前页是模型配置的第 3 步。左侧导航显示 6 步配置流程,完成后才能上线模型。模式有两个核心作用:限定样本选取范围、控制 AI 计算生效时段。' },
  { title: '点击 ? 获取本页教程', text: '右上角橙色"?"按钮打开侧抽屉,显示与本页强相关的 4 篇文档 + V1 视频(自动跳到 02:30「配置工况模式」章节)。' },
  { title: '专有术语有 ⓘ 提示', text: '看到字段旁的 ⓘ 图标时,悬停即可看到术语解释。例如「优先级」「AND/OR 顺序」这些都附带示意和"查看完整教程"链接。' },
]

const sbGroups = [
  { id: 'g1', label: '1 · 产品概览', count: 3, hasVideo: false },
  { id: 'g2', label: '2 · 快速入门', count: 2, hasVideo: false },
  { id: 'g3', label: '3 · 模型配置', count: 6, hasVideo: true },
  { id: 'g4', label: '4 · 规则配置', count: 4, hasVideo: true },
  { id: 'g5', label: '5 · 计算测点', count: 3, hasVideo: true },
  { id: 'g6', label: '6 · 全局触发器', count: 2, hasVideo: true },
  { id: 'g7', label: '7 · 趋势监测', count: 4, hasVideo: true },
  { id: 'g8', label: '8 · 告警管理', count: 5, hasVideo: true },
  { id: 'g9', label: '9 · 告警单管理', count: 3, hasVideo: true },
  { id: 'g10', label: '10 · 知识库', count: 4, hasVideo: true },
  { id: 'g11', label: '11 · 常见问题', count: 8, hasVideo: false },
]

const sbItems: Record<string, { text: string; videoPill?: string }[]> = {
  g1: [{ text: '产品介绍' }, { text: '核心概念' }, { text: '术语表' }],
  g2: [{ text: '5 分钟跑通完整流程' }, { text: '角色与权限' }],
  g3: [
    { text: '如何创建一个模型(基本信息与算法选择)', videoPill: 'V1·0:00' },
    { text: '如何为模型选取测点' },
    { text: '如何配置工况模式', videoPill: 'V1·2:30' },
    { text: '如何配置测点参数(IO 类型与告警策略)', videoPill: 'V1·5:00' },
    { text: '如何选取训练样本并训练模型', videoPill: 'V1·7:30' },
    { text: '多工况模型与单工况的差异', videoPill: 'V1·10:30' },
  ],
  g4: [
    { text: '规则类型介绍(普通规则 vs 高级规则)', videoPill: 'V2·0:00' },
    { text: '如何配置一条普通规则', videoPill: 'V2·1:00' },
    { text: '如何编写高级规则 Python 脚本', videoPill: 'V2·4:00' },
    { text: '规则的延迟预警与上线' },
  ],
  g5: [
    { text: '如何创建一个普通计算测点', videoPill: 'V3·0:00' },
    { text: '如何编写高级计算测点脚本', videoPill: 'V3·3:00' },
    { text: '计算测点的引用、编辑与删除规则' },
  ],
  g6: [
    { text: '如何创建一个全局触发器', videoPill: 'V4·0:00' },
    { text: '触发器的 6 级时间粒度与预览' },
  ],
  g7: [
    { text: '如何查看实时模型监测', videoPill: 'V5·0:00' },
    { text: '三色曲线解读(实际/预测/残差)' },
    { text: '如何回放历史告警(历史仿真)', videoPill: 'V5·2:00' },
    { text: '如何查看规则监测与指标监测', videoPill: 'V5·4:00' },
  ],
  g8: [
    { text: '告警四态(待办/处理中/挂起/归档)', videoPill: 'V6·0:00' },
    { text: '如何查看告警详情(故障诊断+告警分析)', videoPill: 'V6·1:30' },
    { text: '如何归档一条告警(误报/忽略/关闭)', videoPill: 'V6·3:00' },
    { text: '如何挂起一条告警' },
    { text: '如何对告警进行批量处理' },
  ],
  g9: [
    { text: '我的数据 vs 告警单中心', videoPill: 'V7·0:00' },
    { text: '告警单的处理流程(状态轴 + 流程图)', videoPill: 'V7·1:30' },
    { text: '如何关闭告警单并更新案例库', videoPill: 'V7·3:30' },
  ],
  g10: [
    { text: 'FMEA 库:案例查看与新建', videoPill: 'V7·5:00' },
    { text: 'FMEA 库:激活规则与模型联动' },
    { text: '案例库:案例查看与导入', videoPill: 'V7·6:30' },
    { text: '知识库与告警单的双向联动' },
  ],
  g11: [
    { text: '模型上线后多久能看到第一批告警?' },
    { text: '残差曲线一直贴着上限是怎么回事?' },
    { text: '为什么我的模式频繁切换?' },
    { text: '查看更多 →' },
  ],
}

export default function HelpCenter() {
  const [activeView, setActiveView] = useState<'hc' | 'sys'>('hc')
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['g1', 'g3']))
  const [activeSbItem, setActiveSbItem] = useState('如何配置工况模式')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<'global' | 'page'>('page')
  const [activeDrawerTab, setActiveDrawerTab] = useState<'doc' | 'video' | 'faq'>('doc')
  const [pinned, setPinned] = useState(false)
  const [whatsNewOpen, setWhatsNewOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourIndex, setTourIndex] = useState(0)
  const [snackText, setSnackText] = useState('')
  const [snackVisible, setSnackVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [firstSysVisit, setFirstSysVisit] = useState(true)
  const snackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showSnack = useCallback((text: string) => {
    setSnackText(text)
    setSnackVisible(true)
    if (snackTimer.current) clearTimeout(snackTimer.current)
    snackTimer.current = setTimeout(() => setSnackVisible(false), 2400)
  }, [])

  const openDrawer = useCallback((type: 'global' | 'page') => {
    setDrawerType(type)
    setDrawerOpen(true)
    setWhatsNewOpen(false)
  }, [])

  const closeDrawer = useCallback(() => {
    if (pinned) return
    setDrawerOpen(false)
  }, [pinned])

  const switchView = useCallback((v: 'hc' | 'sys') => {
    setActiveView(v)
    setDrawerOpen(false)
    window.scrollTo(0, 0)
    if (v === 'sys' && firstSysVisit) {
      setFirstSysVisit(false)
      setTimeout(() => { setTourIndex(0); setTourOpen(true) }, 600)
    }
  }, [firstSysVisit])

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(groupId) ? next.delete(groupId) : next.add(groupId)
      return next
    })
  }

  const nextTour = () => {
    if (tourIndex === tourSteps.length - 1) {
      setTourOpen(false)
      showSnack('引导已完成,可随时通过页面底部链接重新查看')
    } else {
      setTourIndex(i => i + 1)
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        if (activeView === 'sys') { openDrawer('page'); e.preventDefault() }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        if (activeView === 'hc') { document.getElementById('hcSearchInput')?.focus(); e.preventDefault() }
      }
      if (e.key === 'Escape') { closeDrawer(); setTourOpen(false); setWhatsNewOpen(false) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [activeView, openDrawer, closeDrawer])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const wn = document.getElementById('whatsNew')
      if (wn && !wn.contains(e.target as Node)) setWhatsNewOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div>
      {/* ============ Demo Bar ============ */}
      <div className="demo-bar">
        <div className="demo-brand">
          <span className="dot"></span>
          <span>原型演示 · Online Manual Integration</span>
        </div>
        <span className="demo-meta">PROTOTYPE · V2.0 · 基于 7 份真实模块手册</span>
        <div className="demo-tabs">
          <button className={`demo-tab${activeView === 'hc' ? ' active' : ''}`} onClick={() => switchView('hc')}>📖 帮助中心(独立)</button>
          <button className={`demo-tab${activeView === 'sys' ? ' active' : ''}`} onClick={() => switchView('sys')}>🖥 系统内集成 ?抽屉</button>
        </div>
        <span className="demo-tip">点击切换两种集成模式</span>
      </div>

      {/* ============ View 1: Help Center ============ */}
      <div className={`view${activeView === 'hc' ? ' active' : ''}`}>
        <div className="hc-shell">
          <header className="hc-header">
            <div className="hc-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12 M5 5 L8 8 M16 16 L19 19 M19 5 L16 8 M8 16 L5 19"/>
                </svg>
              </div>
              <div className="logo-text">
                <div>西门子能源 · 故障预警及诊断平台</div>
                <small>HELP CENTER · v3.2</small>
              </div>
            </div>
            <div className="hc-search">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
              </svg>
              <input
                id="hcSearchInput"
                placeholder="搜索文档、视频、术语... 试试「多工况」「计算测点」"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <span className="kbd">Ctrl K</span>
            </div>
            <nav className="hc-nav-top">
              <a className="active">操作指南</a>
              <a>视频专区</a>
              <a>FAQ</a>
              <a>What's New</a>
            </nav>
            <div className="hc-actions">
              <span className="badge">v3.2</span>
            </div>
          </header>

          <div className="hc-body">
            {/* Left Sidebar */}
            <aside className="hc-sidebar">
              {sbGroups.map(g => (
                <div className="sb-section" key={g.id}>
                  <div
                    className={`sb-group${openGroups.has(g.id) ? ' open' : ''}${g.hasVideo ? ' has-video' : ''}`}
                    onClick={() => toggleGroup(g.id)}
                  >
                    <svg className="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 5 7 7-7 7"/></svg>
                    <span>{g.label}</span><span className="count">{g.count}</span>
                  </div>
                  <div className={`sb-items${openGroups.has(g.id) ? ' open' : ''}`}>
                    {sbItems[g.id].map((item, idx) => (
                      <div
                        key={idx}
                        className={`sb-item${activeSbItem === item.text ? ' active' : ''}`}
                        style={{ opacity: searchQuery.length > 1 && !item.text.toLowerCase().includes(searchQuery.toLowerCase()) ? 0.3 : 1 }}
                        onClick={() => setActiveSbItem(item.text)}
                      >
                        {item.text}
                        {item.videoPill && <span className="video-pill">{item.videoPill}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main Article */}
            <main className="hc-main">
              <div className="crumbs">
                <span>操作指南</span>
                <span>模型配置</span>
                <span>如何配置工况模式</span>
              </div>
              <header className="article-head">
                <h1>如何配置工况模式</h1>
                <div className="meta-row">
                  <span className="meta-tag role"><span className="dot"></span>专业工程师</span>
                  <span className="meta-tag">阅读 · 4 分钟</span>
                  <span className="meta-tag video">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    含 V1 · 2:30–5:00 视频片段
                  </span>
                  <span className="meta-time">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    更新于 2026-05-12
                  </span>
                </div>
              </header>

              <div className="article-body">
                <p className="lede">读完本文,您将能为同一台设备配置「运行」「并网」「停机」等多个工况模式,并理解模式的两个核心作用 —— 限定样本选取范围、控制 AI 计算的生效时段。</p>

                <h2 id="s1">什么是「模式」</h2>
                <p>模式(Mode)是平台中用于<strong>判定当前是否属于某种运行工况</strong>的一组表达式。不同模式以不同颜色的矩形框区分,在模型配置页中部展示。模式有两个核心作用:</p>
                <ul>
                  <li><strong>限定样本选取范围</strong> —— 选取训练样本时,只有落在模式条件成立的时段内的数据才会被使用;</li>
                  <li><strong>控制 AI 计算的生效时段</strong> —— 模型上线后,只有在模式条件满足时,系统才会执行 AI 计算和预测。设备停机后模式不再满足,AI 计算会自动停止,<strong>无需手动下线模型</strong>。</li>
                </ul>

                <h2 id="s2">操作步骤</h2>
                <ol className="steps">
                  <li>进入 <code>建模平台 → 配置中心 → 模型</code>,选择目标模型,在中部模式配置区点击「<strong>新增模式</strong>」。</li>
                  <li>填写<strong>模式名称</strong>(建议简洁状态描述,如「运行」「并网」),设置<strong>优先级</strong>(1–5,数字越小优先级越高),选择<strong>标识色</strong>。</li>
                  <li>点击加号定义模式表达式:选择测点类型 → 选择具体测点 → 选择运算符(≥/≤/&gt;/&lt;/=/≠ 共 6 种)→ 填入阈值。</li>
                  <li>需要多条件时继续添加,并选择<strong>逻辑关系 AND / OR</strong>;系统严格按从上到下顺序判断,关键条件放前面。</li>
                  <li>点击保存。也可以选择<strong>导入全局模式</strong>(多个模型共用相同工况时,可一键导入)。</li>
                </ol>

                <div className="callout callout-warn">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                  <div>
                    <strong>注意</strong>
                    <strong>AND 和 OR 之间没有优先级</strong>,系统严格按从上到下顺序依次判断。如果配置 <code>A AND B OR C</code>,实际执行的是 <code>(A AND B) OR C</code>,而不是 <code>A AND (B OR C)</code>。请把关键条件放在最前。
                  </div>
                </div>

                {/* Video Card */}
                <div className="video-card">
                  <div className="video-poster" onClick={() => showSnack('▶ 视频已在演示中(原型不带真实视频源)')}>
                    <div className="play-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div className="video-meta">
                      <div className="title">V1 · 模型配置 — 单元二:配置工况模式</div>
                      <div className="sub">章节 2/5 · 02:30 · 共 12min</div>
                    </div>
                  </div>
                  <div className="video-chapters">
                    <div className="ch-label">章节(根据「画面X」自动切分)</div>
                    <div className="chapter-list">
                      <div className="chapter"><span className="ts">00:00</span><span>单元一 · 创建模型与基础配置</span></div>
                      <div className="chapter active"><span className="ts">02:30</span><span>单元二 · 配置工况模式 ◀ 当前</span></div>
                      <div className="chapter"><span className="ts">05:00</span><span>单元三 · 测点参数配置</span></div>
                      <div className="chapter"><span className="ts">07:30</span><span>单元四 · 样本选取与模型训练</span></div>
                      <div className="chapter"><span className="ts">10:30</span><span>单元五 · 多工况模型</span></div>
                    </div>
                  </div>
                </div>

                <h2 id="s3">优先级的含义</h2>
                <p>当<strong>多个模式条件同时满足</strong>(也就是判断规则出现重叠)时,系统会选择<strong>优先级最高的模式</strong>生效。建议:</p>
                <ul>
                  <li>把最精确、最严格的工况设置为<strong>高优先级(数字小)</strong>;</li>
                  <li>把宽泛、兜底的工况设置为低优先级。</li>
                </ul>

                <div className="callout callout-info">
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <div>
                    <strong>建议</strong>
                    如果您正在为<strong>多工况模型</strong>配置模式,请注意:每个工况下都需要单独训练,只有<strong>所有工况都通过训练</strong>之后,多工况模型的【上线】按钮才会变为可用。
                  </div>
                </div>

                <h2 id="s4">在主系统中打开此功能</h2>
                <p>点击下方按钮可在新页签中直接跳到「模型配置 → 工况模式」页:</p>
                <div style={{ margin: '12px 0' }}>
                  <a className="btn btn-secondary" onClick={() => showSnack('已跳转到 /modeling/config/model/mode(原型演示)')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                    打开模型配置页面
                  </a>
                </div>

                <div className="related-block">
                  <h3>相关文档</h3>
                  <div className="related-grid">
                    {[
                      { meta: '模型配置 · 文档', title: '如何选取训练样本并训练模型', sub: '样本必须代表正常工况,单模型总有效点 ≤ 5 万' },
                      { meta: '模型配置 · 文档', title: '如何配置测点参数', sub: 'IO 类型(输入/输出/输入输出)、残差阈值、延迟策略' },
                      { meta: '规则配置 · 文档', title: '规则模型中如何导入全局模式', sub: '规则模型与诊断模型可共用全局模式' },
                      { meta: 'FAQ · 常见', title: '为什么我的模式频繁切换?', sub: '检查判别条件中是否需要加入滞回缓冲' },
                    ].map((c, i) => (
                      <div key={i} className="related-card">
                        <div className="rc-meta">{c.meta}</div>
                        <div className="rc-title">{c.title}</div>
                        <div className="rc-sub">{c.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="feedback-bar">
                  <div className="fb-text">
                    <div className="fb-q">这篇文档对您有帮助吗?</div>
                    <div className="fb-hint">您的反馈将用于改进文档质量,我们会在 48 小时内回复(若您留下邮箱)。</div>
                  </div>
                  <button className="good" onClick={() => showSnack('感谢您的反馈 👍')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7"/></svg>
                    有用
                  </button>
                  <button className="bad" onClick={() => showSnack('感谢您的反馈,我们会优化此文档')}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17"/></svg>
                    没用
                  </button>
                </div>

                <div className="pager">
                  <div className="pg">
                    <div className="pg-dir">← 上一篇</div>
                    <div className="pg-title">如何为模型选取测点</div>
                  </div>
                  <div className="pg next">
                    <div className="pg-dir">下一篇 →</div>
                    <div className="pg-title">如何配置测点参数(IO 类型与告警策略)</div>
                  </div>
                </div>
              </div>
            </main>

            {/* Right TOC */}
            <aside className="hc-toc">
              <div className="toc-label">本文目录</div>
              <ul className="toc-list">
                <li>什么是「模式」</li>
                <li className="active">操作步骤</li>
                <li>优先级的含义</li>
                <li>在主系统中打开此功能</li>
              </ul>
              <div className="toc-side-card">
                <h4>本页相关</h4>
                <a>▶ V1 · 模型配置 — 单元二(2:30)</a>
                <a>📄 如何选取训练样本并训练模型</a>
                <a>📄 如何配置测点参数</a>
                <a>📋 FAQ:模式频繁切换</a>
                <a>🔗 跳到主系统对应页</a>
              </div>
              <div className="toc-side-card">
                <h4>本文路由(Route Keys)</h4>
                <div className="mono" style={{ fontSize: '11px', color: 'var(--ink-500)', lineHeight: '1.7' }}>
                  /modeling/config<br/>
                  /modeling/config/model<br/>
                  /modeling/config/model/mode
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ============ View 2: System Integration ============ */}
      <div className={`view${activeView === 'sys' ? ' active' : ''}`}>
        <div className="sys-shell">
          <header className="sys-header">
            <div className="sys-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12 M5 5 L8 8 M16 16 L19 19 M19 5 L16 8 M8 16 L5 19"/>
                </svg>
              </div>
              <div className="name">
                故障预警及诊断平台
                <small>西门子能源有限公司 · v3.2</small>
              </div>
            </div>
            <nav className="sys-nav">
              <a className="active">建模平台</a>
              <a>趋势预警</a>
              <a>故障诊断</a>
              <a>知识库</a>
            </nav>
            <div className="sys-right" style={{ position: 'relative' }}>
              <button className="icon-btn" title="帮助中心 (?)" onClick={() => openDrawer('global')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
              </button>
              <button className="icon-btn" title="What's New" onClick={e => { e.stopPropagation(); setWhatsNewOpen(v => !v) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                <span className="dot-red"></span>
              </button>
              <div className="avatar">王</div>
              <div id="whatsNew" className={`whats-new${whatsNewOpen ? ' open' : ''}`}>
                <div className="wn-head">
                  <h4>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    v3.2 新功能
                    <span className="ver-tag">NEW</span>
                  </h4>
                  <p>5 月 12 日更新 · 3 项新功能 · 2 项优化</p>
                </div>
                <div className="wn-list">
                  {[
                    { title: '全局模式批量导入', desc: '多个模型可一键复用全局模式表达式,节省配置时间。' },
                    { title: '高级规则脚本调试', desc: 'Python 编辑器新增智能提示与全屏模式,支持绘图代码可视化预览。' },
                    { title: '告警单 → 案例库自动归档', desc: '关闭告警单时勾选「更新至案例库」,自动沉淀为可复用知识。' },
                  ].map((item, i) => (
                    <div key={i} className="wn-item" onClick={() => openDrawer('global')}>
                      <span className="wn-bullet"></span>
                      <div className="wn-text">
                        <strong>{item.title}</strong> {item.desc}
                        <div className="wn-link">查看教程 →</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Sub navigation */}
          <div style={{ background: 'white', borderBottom: '1px solid var(--ink-100)', padding: '0 24px', height: '42px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
            <span style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '12px' }}>配置中心 ›</span>
            <a style={{ padding: '6px 12px', borderRadius: '5px', color: 'var(--navy-900)', fontWeight: 700, background: 'var(--navy-50)', cursor: 'pointer' }}>模型</a>
            <a style={{ padding: '6px 12px', borderRadius: '5px', color: 'var(--ink-700)', cursor: 'pointer' }}>规则模型</a>
            <a style={{ padding: '6px 12px', borderRadius: '5px', color: 'var(--ink-700)', cursor: 'pointer' }}>计算测点</a>
            <a style={{ padding: '6px 12px', borderRadius: '5px', color: 'var(--ink-700)', cursor: 'pointer' }}>全局触发器</a>
            <span style={{ marginLeft: 'auto', color: 'var(--ink-500)', fontSize: '11px' }}>
              左侧目录树:<span className="mono" style={{ color: 'var(--ink-700)' }}>西门子能源智能电厂 › 1号机组 › 燃机专业 › 燃烧系统</span>
            </span>
          </div>

          <div className="sys-work">
            <div className="work-crumbs">
              <span>建模平台</span><span className="sep">/</span>
              <span>配置中心</span><span className="sep">/</span>
              <span>模型</span><span className="sep">/</span>
              <span>西门子能源智能电厂</span><span className="sep">/</span>
              <span>1号机组</span><span className="sep">/</span>
              <span>燃烧系统</span><span className="sep">/</span>
              <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>demo模型 · 修改模型</span>
              <span className="route-chip">routeKey: /modeling/config/model/mode</span>
            </div>

            <div className="work-header">
              <div>
                <h1>demo模型 · 工况模式配置</h1>
                <div className="subtitle">机理算法(MMLA)· 单工况 · 由 工程师·王 锁定编辑</div>
              </div>
              <div className="work-actions">
                <button className="help-btn" onClick={() => openDrawer('page')}>
                  <span className="q">?</span>
                  <span>本页帮助</span>
                  <span className="count">· 4 篇 / 1 视频</span>
                </button>
                <button className="btn btn-secondary">取消</button>
                <button className="btn btn-primary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
                  保存模式
                </button>
              </div>
            </div>

            <div className="work-grid">
              <aside className="work-side">
                <h4>配置步骤</h4>
                <div className="step-nav">
                  <a className="done"><span className="num">✓</span> 基本信息</a>
                  <a className="done"><span className="num">✓</span> 测点选取</a>
                  <a className="active"><span className="num">3</span> 工况模式</a>
                  <a><span className="num">4</span> 测点参数</a>
                  <a><span className="num">5</span> 样本选取</a>
                  <a><span className="num">6</span> 模型训练</a>
                </div>
              </aside>

              <section className="work-card">
                <h2>新增模式</h2>
                <div className="section-hint">为模型添加一个工况判定模式。模式有两个核心作用:限定样本选取范围、控制 AI 计算的生效时段。</div>

                <div className="form-row">
                  <div className="form-label">
                    模式名称 <span className="req">*</span>
                    <span className="info-i" tabIndex={0} title="建议使用简洁的状态描述">i</span>
                  </div>
                  <div className="form-control">
                    <input type="text" defaultValue="运行" />
                    <div className="hint">建议用简洁状态描述,如「运行」「并网」「停机」,便于一眼识别。</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-label">
                    优先级 <span className="req">*</span>
                    <span className="info-i has-popover" tabIndex={0}>
                      i
                      <div className="popover">
                        <div className="pop-title">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>
                          优先级如何起作用?
                        </div>
                        <p>取值范围 1–5,<strong>数字越小优先级越高</strong>。当多个模式的判断规则出现重叠(条件同时满足)时,系统会选择优先级最高的模式生效。</p>
                        <div className="pop-img">建议:精确严格的工况 → 高优先级<br/>宽泛兜底的工况 → 低优先级</div>
                        <span className="pop-link" onClick={e => { e.stopPropagation(); openDrawer('page') }}>查看完整教程 →</span>
                      </div>
                    </span>
                  </div>
                  <div className="form-control">
                    <select defaultValue="2">
                      <option value="1">1 — 最高(最精确的工况)</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5 — 最低(兜底工况)</option>
                    </select>
                    <div className="hint">数字越小优先级越高。多模式条件重叠时,优先级高者生效。</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-label">标识色</div>
                  <div className="form-control" style={{ maxWidth: 'none' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {[
                        { bg: 'var(--steel-500)', selected: true },
                        { bg: 'var(--amber-500)' },
                        { bg: 'var(--emerald-500)' },
                        { bg: 'var(--rose-500)' },
                        { bg: '#7C3AED' },
                      ].map((c, i) => (
                        <span key={i} style={{
                          width: '24px', height: '24px', background: c.bg, borderRadius: '5px', cursor: 'pointer',
                          ...(c.selected ? { border: '2px solid white', boxShadow: `0 0 0 2px ${c.bg}` } : {})
                        }}></span>
                      ))}
                    </div>
                    <div className="hint">用于在模型配置页中区分不同模式的矩形框颜色。</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-label">
                    模式表达式 <span className="req">*</span>
                    <span className="info-i has-popover" tabIndex={0}>
                      i
                      <div className="popover">
                        <div className="pop-title">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z M3 9h18 M9 21V9"/></svg>
                          AND / OR 的执行顺序
                        </div>
                        <p><strong>AND 和 OR 之间没有优先级</strong>,系统严格按从上到下顺序依次判断,因此要将关键条件放在前面。</p>
                        <div className="pop-img">如 A AND B OR C<br/>实际执行 = (A AND B) OR C</div>
                        <span className="pop-link" onClick={e => { e.stopPropagation(); openDrawer('page') }}>查看完整教程 →</span>
                      </div>
                    </span>
                  </div>
                  <div className="form-control" style={{ maxWidth: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', flexWrap: 'wrap' }}>
                        <span className="kbd-pill">原始测点</span>
                        <span className="kbd-pill" style={{ background: 'white', color: 'var(--navy-800)', borderColor: 'var(--navy-100)' }}>主轴转速 SHAFT_SPEED</span>
                        <span className="kbd-pill" style={{ background: 'var(--navy-900)', color: 'white', borderColor: 'var(--navy-900)' }}>≥</span>
                        <span className="kbd-pill" style={{ background: 'white', color: 'var(--navy-800)', borderColor: 'var(--navy-100)' }}>3000</span>
                        <span className="kbd-pill" style={{ background: 'white', fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>rpm</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="kbd-pill" style={{ background: 'var(--amber-100)', color: '#8B5A11', borderColor: 'var(--amber-400)', fontWeight: 700 }}>AND</span>
                        <span style={{ fontSize: '11px', color: 'var(--ink-500)' }}>↓ 从上到下顺序执行</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', flexWrap: 'wrap' }}>
                        <span className="kbd-pill">原始测点</span>
                        <span className="kbd-pill" style={{ background: 'white', color: 'var(--navy-800)', borderColor: 'var(--navy-100)' }}>燃料流量 FUEL_FLOW</span>
                        <span className="kbd-pill" style={{ background: 'var(--navy-900)', color: 'white', borderColor: 'var(--navy-900)' }}>&gt;</span>
                        <span className="kbd-pill" style={{ background: 'white', color: 'var(--navy-800)', borderColor: 'var(--navy-100)' }}>10</span>
                        <span className="kbd-pill" style={{ background: 'white', fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>t/h</span>
                      </div>
                      <button style={{ marginTop: '6px', alignSelf: 'flex-start', fontSize: '12px', padding: '5px 10px', border: '1px dashed var(--ink-300)', borderRadius: '5px', color: 'var(--ink-500)', background: 'white', cursor: 'pointer' }}>+ 添加表达式</button>
                    </div>
                    <div className="hint">运算符共 6 种:≥ / ≤ / &gt; / &lt; / = / ≠。</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-label">已有模式</div>
                  <div className="form-control" style={{ maxWidth: 'none' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="meta-tag" style={{ background: 'var(--steel-100)', color: 'var(--navy-800)', border: '1px solid var(--steel-400)' }}><span className="dot"></span>运行 · 优先级 2(本次编辑)</span>
                      <span className="meta-tag" style={{ background: 'var(--amber-100)', color: '#8B5A11' }}><span className="dot"></span>并网 · 优先级 1</span>
                      <span className="meta-tag" style={{ background: 'var(--ink-50)', color: 'var(--ink-700)', cursor: 'pointer' }}>+ 新增模式</span>
                      <span className="meta-tag" style={{ background: 'white', color: 'var(--ink-700)', border: '1px dashed var(--ink-300)', cursor: 'pointer' }}>⤵ 导入全局模式</span>
                    </div>
                    <div className="hint">全局模式适用于多个模型共用相同工况的场景,导入后可快速完成配置。</div>
                  </div>
                </div>

                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  </div>
                  <h3>下一步:为「运行」模式选取训练样本</h3>
                  <p>模式定义了 AI 计算的生效时段。保存后请进入「样本选取」,选择该模式下的正常运行时段作为训练样本。</p>
                  <div className="empty-cta">
                    <button className="btn btn-primary" onClick={() => openDrawer('page')}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
                      查看「样本选取」教程
                    </button>
                    <button className="btn btn-secondary">直接进入样本选取 →</button>
                  </div>
                </div>
              </section>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', color: 'var(--ink-500)', fontSize: '12px' }}>
              💡 提示:点击页面右上角 <span className="kbd-pill">? 本页帮助</span> 可在不离开本页的情况下查看相关教程;按 <span className="kbd-pill">Shift + /</span> 也可快速打开。
              <a style={{ color: 'var(--steel-500)', fontWeight: 600, cursor: 'pointer', marginLeft: '6px' }} onClick={() => { setTourIndex(0); setTourOpen(true) }}>▶ 重新观看新手引导</a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Drawer ============ */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={closeDrawer}></div>
      <aside className={`drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-head">
          <div className="dh-top">
            <h3>
              <span className="help-icon">?</span>
              <span>{drawerType === 'global' ? '帮助中心 · 全局' : '本页帮助'}</span>
            </h3>
            <span className="dh-route">{drawerType === 'global' ? '全平台 (M1 模式)' : 'routeKey: /modeling/config/model/mode'}</span>
            <div className="dh-actions">
              <button className={`dh-icon-btn${pinned ? ' pinned' : ''}`} title="钉住" onClick={() => setPinned(v => !v)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17.5V22M9 4h6l-1 7 4 3v2H6v-2l4-3-1-7z"/></svg>
              </button>
              <button className="dh-icon-btn" title="在新页打开完整帮助中心" onClick={() => switchView('hc')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              </button>
              <button className="dh-icon-btn" title="关闭" onClick={() => { setPinned(false); setDrawerOpen(false) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <div className="drawer-tabs">
            {(['doc', 'video', 'faq'] as const).map(tab => (
              <button key={tab} className={`drawer-tab${activeDrawerTab === tab ? ' active' : ''}`} onClick={() => setActiveDrawerTab(tab)}>
                {tab === 'doc' && <>📄 文档 <span className="cnt">4</span></>}
                {tab === 'video' && <>🎬 视频 <span className="cnt">1</span></>}
                {tab === 'faq' && <>❓ FAQ <span className="cnt">3</span></>}
              </button>
            ))}
          </div>
        </div>

        <div className="drawer-body">
          {/* DOC tab */}
          <div style={{ display: activeDrawerTab === 'doc' ? 'block' : 'none' }}>
            <div className="recommended-label">
              <span>⚡ 与本页最相关</span>
              <span className="ai-chip">AUTO-MATCHED</span>
            </div>
            <div className="help-doc-list">
              {[
                { role: '工程师', cat: '模型配置', time: '4 min', title: '如何配置工况模式', sub: '优先级 1–5、6 种运算符、AND/OR 从上到下顺序、导入全局模式', msg: '已打开《如何配置工况模式》' },
                { role: '工程师', cat: '模型配置', time: '3 min', title: '如何创建一个模型(基本信息与算法选择)', sub: '三种算法对比:MMLA 机理 / NRDA 时序关联 / PBA 非时序', msg: '已打开《如何创建一个模型》' },
                { role: '工程师', cat: '模型配置', time: '5 min', title: '如何配置测点参数', sub: 'IO 类型(输入/输出/输入输出/不使用)、残差告警阈值、3 种延迟策略', msg: '已打开《如何配置测点参数》' },
                { role: '工程师', cat: '模型配置', time: '4 min', title: '如何选取训练样本并训练模型', sub: '样本须代表正常工况,单模型有效点 ≤ 5 万,三色曲线解读', msg: '已打开《如何选取训练样本并训练模型》' },
              ].map((doc, i) => (
                <div key={i} className="help-doc-item" onClick={() => showSnack(doc.msg)}>
                  <div className="hd-meta">
                    <span className="pill engineer">{doc.role}</span>
                    <span>{doc.cat}</span>
                    <span>· {doc.time}</span>
                  </div>
                  <div className="hd-title">{doc.title}</div>
                  <div className="hd-sub">{doc.sub}</div>
                </div>
              ))}
            </div>
            <div className="recommended-label" style={{ marginTop: '4px' }}>📺 推荐视频</div>
            <div className="help-video-card" onClick={() => showSnack('▶ 自动跳到 V1 · 02:30 单元二 — 配置工况模式')}>
              <div className="hv-poster">
                <div className="play-btn" style={{ width: '48px', height: '48px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div className="hv-info">
                <div className="t">V1 · 模型配置(全流程)</div>
                <div className="s">12:00 · 5 个单元章节 · 自动跳到 02:30「配置工况模式」</div>
              </div>
            </div>
          </div>

          {/* VIDEO tab */}
          <div style={{ display: activeDrawerTab === 'video' ? 'block' : 'none' }}>
            <div className="recommended-label">🎬 本页相关视频</div>
            <div className="help-video-card" onClick={() => showSnack('▶ 跳到 02:30 · 单元二 配置工况模式')}>
              <div className="hv-poster">
                <div className="play-btn" style={{ width: '48px', height: '48px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div className="hv-info">
                <div className="t">V1 · 模型配置</div>
                <div className="s">12:00 · 自动跳到 02:30「单元二 · 配置工况模式」</div>
              </div>
            </div>
            <div style={{ background: 'var(--navy-800)', borderRadius: '8px', padding: '12px' }}>
              <div className="ch-label" style={{ fontSize: '10px', color: 'var(--ink-400)', letterSpacing: '0.08em', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>单元章节(点击跳转)</div>
              <div className="chapter-list">
                {[['00:00', '单元一 · 创建模型与基础配置'], ['02:30', '单元二 · 配置工况模式 ◀ 本页', true], ['05:00', '单元三 · 测点参数配置'], ['07:30', '单元四 · 样本选取与模型训练'], ['10:30', '单元五 · 多工况模型']].map(([ts, label, active], i) => (
                  <div key={i} className={`chapter${active ? ' active' : ''}`}><span className="ts">{ts}</span><span>{label}</span></div>
                ))}
              </div>
              <div className="ch-label" style={{ fontSize: '10px', color: 'var(--ink-400)', letterSpacing: '0.08em', margin: '14px 0 8px', textTransform: 'uppercase', fontWeight: 700 }}>单元二 子章节(6 画面)</div>
              <div className="chapter-list">
                {[['02:30', '画面 1 · 进入模式配置区域'], ['03:00', '画面 2 · 填写模式基本信息'], ['03:30', '画面 3 · 定义模式表达式 ◀', true], ['04:00', '画面 4 · 多条件组合与 AND/OR'], ['04:30', '画面 5 · 保存与查看模式'], ['05:00', '画面 6 · 模式的两个核心作用']].map(([ts, label, active], i) => (
                  <div key={i} className={`chapter${active ? ' active' : ''}`}><span className="ts">{ts}</span><span>{label}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ tab */}
          <div style={{ display: activeDrawerTab === 'faq' ? 'block' : 'none' }}>
            <div className="recommended-label">❓ 高频问题</div>
            <div className="help-doc-list">
              {[
                { title: '为什么我的模式频繁切换?', sub: '检查表达式中是否需要加入滞回(hysteresis)缓冲,建议留 3–5% 死区' },
                { title: 'AND 在 OR 之后是不是优先级更高?', sub: '不是。AND/OR 没有优先级之分,系统严格按从上到下顺序判断,把关键条件放最前' },
                { title: '我没创建任何模式,模型能上线吗?', sub: '不能。模式控制 AI 计算的生效时段,缺失模式会导致模型上线后不执行任何计算' },
              ].map((faq, i) => (
                <div key={i} className="help-doc-item">
                  <div className="hd-meta"><span className="pill">FAQ</span><span>模型配置</span></div>
                  <div className="hd-title">{faq.title}</div>
                  <div className="hd-sub">{faq.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          <span>没找到想要的?</span>
          <span className="ff-action" onClick={() => showSnack('已记录,运营会在 24 小时内回复')}>
            💬 提交反馈
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </aside>

      {/* ============ Tour overlay ============ */}
      <div className={`tour-overlay${tourOpen ? ' open' : ''}`}>
        <div className="tour-card">
          <div className="tour-step">新手引导 · 步骤 {tourIndex + 1} / 3</div>
          <h4>{tourSteps[tourIndex].title}</h4>
          <p>{tourSteps[tourIndex].text}</p>
          <div className="tour-actions">
            <button className="btn btn-secondary" onClick={() => setTourOpen(false)}>跳过</button>
            <div className="tour-spacer"></div>
            <div className="tour-dots">
              {tourSteps.map((_, i) => <i key={i} className={i === tourIndex ? 'active' : ''}></i>)}
            </div>
            <button className="btn btn-primary" onClick={nextTour}>
              {tourIndex === tourSteps.length - 1 ? '完成 ✓' : '下一步 →'}
            </button>
          </div>
        </div>
      </div>

      {/* ============ Snackbar ============ */}
      <div className={`snack${snackVisible ? ' show' : ''}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
        <span>{snackText}</span>
      </div>
    </div>
  )
}
