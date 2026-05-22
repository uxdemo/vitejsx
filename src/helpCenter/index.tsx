import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { Input } from 'antd';
import { navGroups, navItems, tourSteps } from './constant';
import { marked } from 'marked';
import { Icon } from './shared';
import HcSidebar from './components/HcSidebar';
import HcArticle from './components/HcArticle';
import HcToc from './components/HcToc';
import SysView from './components/SysView';
import HelpDrawer from './components/HelpDrawer';
import TourOverlay from './components/TourOverlay';
import css from './helpCenter.modules.less';

const mdModules = import.meta.glob('./md/**/*.md', { as: 'raw', eager: true }) as Record<string, string>;
const imgUrls = import.meta.glob('./md/**/*.{png,jpg,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function makeImgRenderer(mdPath: string) {
  const dir = mdPath.replace(/[^/]+$/, '');
  const renderer = new marked.Renderer();
  renderer.image = (href: string, title: string | null, text: string) => {
    const decoded = decodeURIComponent(href);
    const key = `./md/${dir}${decoded.replace(/^\.\//, '')}`;
    const src = imgUrls[key] || href;
    const titleAttr = title ? ` title="${title}"` : '';
    const caption = title || text;
    return `<figure style="margin:20px 0"><img src="${src}" alt="${text}"${titleAttr} style="max-width:100%;display:block;border-radius:6px">${caption ? `<figcaption style="margin-top:6px;font-size:12px;color:var(--text-secondary, #888);text-align:center">${caption}</figcaption>` : ''}</figure>`;
  };
  return renderer;
}

export default function HelpCenter() {
  const [activeView, setActiveView] = useState<'hc' | 'sys'>('hc');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['overview', 'modelConfig']));
  const [activeItemId, setActiveItemId] = useState('create-model');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'global' | 'page'>('page');
  const [activeDrawerTab, setActiveDrawerTab] = useState<'doc' | 'video' | 'faq'>('doc');
  const [pinned, setPinned] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFirstSysVisit, setIsFirstSysVisit] = useState(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string) => {
    setToastMessage(text);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  const openDrawer = useCallback((type: 'global' | 'page') => {
    setDrawerType(type);
    setDrawerOpen(true);
    setWhatsNewOpen(false);
  }, []);

  const closeDrawer = useCallback(() => {
    if (pinned) return;
    setDrawerOpen(false);
  }, [pinned]);

  const switchView = useCallback(
    (v: 'hc' | 'sys') => {
      setActiveView(v);
      setDrawerOpen(false);
      window.scrollTo(0, 0);
      if (v === 'sys' && isFirstSysVisit) {
        setIsFirstSysVisit(false);
        setTimeout(() => { setTourIndex(0); setTourOpen(true); }, 600);
      }
    },
    [isFirstSysVisit],
  );

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  };

  const nextTour = () => {
    if (tourIndex === tourSteps.length - 1) {
      setTourOpen(false);
      showToast('引导已完成,可随时通过页面底部链接重新查看');
    } else {
      setTourIndex((i) => i + 1);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') { if (activeView === 'sys') { openDrawer('page'); e.preventDefault(); } }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { if (activeView === 'hc') { document.getElementById('hcSearchInput')?.focus(); e.preventDefault(); } }
      if (e.key === 'Escape') { closeDrawer(); setTourOpen(false); setWhatsNewOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [activeView, openDrawer, closeDrawer]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const wn = document.getElementById('whatsNew');
      if (wn && !wn.contains(e.target as Node)) setWhatsNewOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const activeItemData = (() => {
    for (const g of navGroups) {
      const found = (navItems[g.id] || []).find((i) => i.id === activeItemId);
      if (found) return { item: found, group: g };
    }
    return null;
  })();

  const renderedMd = activeItemData?.item.mdPath
    ? String(marked.parse(
        (mdModules[`./md/${activeItemData.item.mdPath}`] ?? '').replace(/^#[^#][^\n]*\n?/, ''),
        { renderer: makeImgRenderer(activeItemData.item.mdPath) },
      ))
    : '';

  const tocHeadings = activeItemData?.item.mdPath
    ? (mdModules[`./md/${activeItemData.item.mdPath}`] ?? '')
        .split('\n')
        .filter((line) => line.startsWith('## '))
        .map((line) => line.replace(/^## /, ''))
    : [];

  return (
    <div>
      {/* Demo Bar */}
      <div className={css.demoBar}>
        <div className={css.demoBrand}>
          <span className={css.dot}></span>
          <span>原型演示 · Online Manual Integration</span>
        </div>
        <span className={css.demoMeta}>PROTOTYPE · V2.0 · 基于 7 份真实模块手册</span>
        <div className={css.demoTabs}>
          <button className={clsx(css.demoTab, activeView === 'hc' && css.active)} onClick={() => switchView('hc')}>
            📖 帮助中心(独立)
          </button>
          <button className={clsx(css.demoTab, activeView === 'sys' && css.active)} onClick={() => switchView('sys')}>
            🖥 系统内集成 ?抽屉
          </button>
        </div>
        <span className={css.demoTip}>点击切换两种集成模式</span>
      </div>

      {/* View 1: Help Center */}
      <div className={clsx(css.view, activeView === 'hc' && css.active)}>
        <div className={css.hcShell}>
          <header className={css.hcHeader}>
            <div className={css.hcLogo}>
              <div className={css.logoIcon}>
                <Icon type="smile" theme="outlined" />
              </div>
              <div className={css.logoText}>
                <div>西门子能源 · 故障预警及诊断平台</div>
                <small>HELP CENTER · v3.2</small>
              </div>
            </div>
            <div className={css.hcSearch}>
              <Input
                id="hcSearchInput"
                prefix={<Icon type="search" />}
                suffix={<span className={css.kbd}>Ctrl K</span>}
                placeholder="搜索文档、视频、术语... 试试「多工况」「计算测点」"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className={css.hcNavTop}>
              <a className={css.active}>操作指南</a>
              <a>视频专区</a>
              <a>FAQ</a>
              <a>What's New</a>
            </nav>
            <div className={css.hcActions}>
              <span className={css.badge}>v3.2</span>
            </div>
          </header>

          <div className={css.hcBody}>
            <HcSidebar
              openGroups={openGroups}
              activeItemId={activeItemId}
              searchQuery={searchQuery}
              onToggleGroup={toggleGroup}
              onSelectItem={setActiveItemId}
            />
            <HcArticle
              activeItemData={activeItemData}
              renderedMd={renderedMd}
              onToast={showToast}
            />
            <HcToc
              tocHeadings={tocHeadings}
              activeItemData={activeItemData}
              onToast={showToast}
            />
          </div>
        </div>
      </div>

      {/* View 2: System Integration */}
      <div className={clsx(css.view, activeView === 'sys' && css.active)}>
        <SysView
          whatsNewOpen={whatsNewOpen}
          onToggleWhatsNew={(e) => { e.stopPropagation(); setWhatsNewOpen((v) => !v); }}
          onOpenDrawer={openDrawer}
          onToast={showToast}
          onStartTour={() => { setTourIndex(0); setTourOpen(true); }}
        />
      </div>

      {/* Drawer */}
      <HelpDrawer
        open={drawerOpen}
        type={drawerType}
        pinned={pinned}
        activeTab={activeDrawerTab}
        onClose={closeDrawer}
        onSwitchToHc={() => switchView('hc')}
        onSetPinned={setPinned}
        onSetOpen={setDrawerOpen}
        onSetTab={setActiveDrawerTab}
        onToast={showToast}
      />

      {/* Tour */}
      <TourOverlay
        open={tourOpen}
        index={tourIndex}
        steps={tourSteps}
        onNext={nextTour}
        onClose={() => setTourOpen(false)}
      />

      {/* Snackbar */}
      <div className={clsx(css.snack, toastVisible && css.show)}>
        <Icon type="check" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
