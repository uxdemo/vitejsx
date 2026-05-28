import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Input } from 'antd';
import { navGroups, navItems } from './constant';
import { marked } from 'marked';
import { Icon } from './shared';
import HcSidebar from './components/HcSidebar';
import HcArticle from './components/HcArticle';
import HcToc from './components/HcToc';
import css from './helpCenter.modules.less';

const mdModules = import.meta.glob('./md/**/*.md', { as: 'raw', eager: true }) as Record<string, string>;
const imgUrls = import.meta.glob('./md/**/*.{png,jpg,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** 构建所有 navItem 的 id → item 快速查找表 */
const allNavItems = Object.values(navItems).flat();
const navItemMap = new Map(allNavItems.map((item) => [item.id, item]));

/** kebab-case → camelCase（用于 URL） */
function toCamel(str: string) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
/** camelCase → kebab-case（从 URL 还原为 id） */
function toKebab(str: string) {
  return str.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

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

/** 找到某个 itemId 所属的 groupId */
function findGroupId(itemId: string): string | null {
  for (const g of navGroups) {
    if ((navItems[g.id] || []).find((i) => i.id === itemId)) return g.id;
  }
  return null;
}

export default function HelpCenter() {
  const navigate = useNavigate();
  const location = useLocation();

  // 从 URL 中解析 activeItemId（URL 为 camelCase，id 为 kebab-case）
  const resolveItemIdFromPath = useCallback(() => {
    const slug = location.pathname.replace(/^\/help\/?/, '').replace(/\/$/, '');
    if (!slug) return 'product-intro';
    const itemId = toKebab(slug);
    if (navItemMap.has(itemId)) return itemId;
    // 兼容直接使用 kebab-case 的旧 URL
    if (navItemMap.has(slug)) return slug;
    return 'product-intro';
  }, [location.pathname]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const slug = location.pathname.replace(/^\/help\/?/, '').replace(/\/$/, '') || '';
    const itemId = slug ? toKebab(slug) : 'product-intro';
    const resolvedId = navItemMap.has(itemId) ? itemId : 'product-intro';
    const gid = findGroupId(resolvedId);
    return new Set(gid ? [gid] : ['overview']);
  });

  const [activeItemId, setActiveItemId] = useState(() => resolveItemIdFromPath());
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hcMainRef = useRef<HTMLDivElement>(null);

  // URL 变化时（浏览器前进/后退）同步 activeItemId
  useEffect(() => {
    const itemId = resolveItemIdFromPath();
    if (itemId !== activeItemId) {
      setActiveItemId(itemId);
      // 同步展开对应 group
      const gid = findGroupId(itemId);
      if (gid) {
        setOpenGroups((prev) => {
          const next = new Set(prev);
          next.add(gid);
          return next;
        });
      }
    }
  }, [location.pathname, resolveItemIdFromPath]);

  // 切换文档时滚动到顶部
  useEffect(() => {
    if (hcMainRef.current) hcMainRef.current.scrollTop = 0;
  }, [activeItemId]);

  // 点击 navItem 时更新 state + URL
  const handleSelectItem = useCallback(
    (id: string) => {
      setActiveItemId(id);
      navigate(`/help/${toCamel(id)}`);
      // 自动展开该项所在的 group
      const gid = findGroupId(id);
      if (gid) {
        setOpenGroups((prev) => {
          const next = new Set(prev);
          next.add(gid);
          return next;
        });
      }
    },
    [navigate],
  );

  const showToast = useCallback((text: string) => {
    setToastMessage(text);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  /** 文章内链接(#xxx)点击 → 匹配路由跳转 */
  const navigateToFragment = useCallback(
    (fragment: string) => {
      // 1. 尝试按编号匹配同组文档（如 #3 → 当前组的第3项）
      const groupMatch = fragment.match(/^#?(\d+)$/);
      const currentGroupId = findGroupId(activeItemId);
      if (groupMatch && currentGroupId) {
        const idx = parseInt(groupMatch[1], 10) - 1;
        const siblings = navItems[currentGroupId] || [];
        if (idx >= 0 && idx < siblings.length) {
          handleSelectItem(siblings[idx].id);
          return;
        }
      }
      // 2. 尝试按标题精确匹配（如 #核心概念）
      const lower = fragment.toLowerCase().replace(/^#+\s*/, '');
      for (const item of allNavItems) {
        if (item.title.toLowerCase().includes(lower)) {
          handleSelectItem(item.id);
          return;
        }
      }
      // 3. 尝试按 title 中包含的关键词模糊匹配
      const keywords = lower.replace(/[的如何一个与及、在中对]/g, '').trim();
      if (keywords.length >= 2) {
        for (const item of allNavItems) {
          if (item.title.toLowerCase().includes(keywords)) {
            handleSelectItem(item.id);
            return;
          }
        }
      }
      // 4. 未匹配 → 尝试滚动到同页锚点
      const el = document.getElementById(fragment);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [activeItemId, handleSelectItem],
  );

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        document.getElementById('hcSearchInput')?.focus();
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const activeItemData = (() => {
    for (const g of navGroups) {
      const found = (navItems[g.id] || []).find((i) => i.id === activeItemId);
      if (found) return { item: found, group: g };
    }
    return null;
  })();

  const renderedMd = activeItemData?.item.mdPath
    ? String(
        marked.parse((mdModules[`./md/${activeItemData.item.mdPath}`] ?? '').replace(/^#[^#][^\n]*\n?/, ''), {
          renderer: makeImgRenderer(activeItemData.item.mdPath),
        }),
      )
    : '';

  const tocHeadings = activeItemData?.item.mdPath
    ? (mdModules[`./md/${activeItemData.item.mdPath}`] ?? '')
        .split('\n')
        .filter((line) => line.startsWith('## '))
        .map((line) => line.replace(/^## /, ''))
    : [];

  const HEADER_H = 64;
  const APP_MAIN_TOP = 90;

  return (
    <div className={css.hcShell}>
      <header className={css.hcHeader} style={{ height: HEADER_H, flexShrink: 0 }}>
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

      <div
        className={css.hcBody}
        style={{ height: `calc(100vh - ${APP_MAIN_TOP}px - ${HEADER_H}px)`, overflowY: 'auto' }}>
        <HcSidebar
          openGroups={openGroups}
          activeItemId={activeItemId}
          searchQuery={searchQuery}
          onToggleGroup={toggleGroup}
          onSelectItem={handleSelectItem}
        />
        <HcArticle ref={hcMainRef} activeItemData={activeItemData} renderedMd={renderedMd} onToast={showToast} onNavigateToItem={navigateToFragment} />
        <HcToc tocHeadings={tocHeadings} activeItemData={activeItemData} onToast={showToast} />
      </div>

      <div className={clsx(css.snack, toastVisible && css.show)}>
        <Icon type="check" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}