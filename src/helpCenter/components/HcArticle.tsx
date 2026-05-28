import React, { useCallback, forwardRef } from 'react';
import clsx from 'clsx';
import { NavItem, NavGroup } from '../constant';
import { Icon } from '../shared';
import css from '../helpCenter.modules.less';

interface ActiveItemData {
  item: NavItem;
  group: NavGroup;
}

interface Props {
  activeItemData: ActiveItemData | null;
  renderedMd: string;
  onToast: (msg: string) => void;
  onNavigateToItem?: (itemId: string) => void;
}

export default forwardRef<HTMLDivElement, Props>(function HcArticle({ activeItemData, renderedMd, onToast, onNavigateToItem }, ref) {
  /** 拦截文章内 #链接 点击，匹配路由跳转 */
  const handleArticleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onNavigateToItem) return;
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      e.preventDefault();
      const fragment = decodeURIComponent(href.slice(1));
      onNavigateToItem(fragment);
    },
    [onNavigateToItem],
  );

  return (
    <main ref={ref} className={css.hcMain}>
      <div className={css.crumbs}>
        <span>操作指南</span>
        {activeItemData && (
          <>
            <span>{activeItemData.group.label}</span>
            <span>{activeItemData.item.title}</span>
          </>
        )}
      </div>
      <header className={css.articleHead}>
        <h1>{activeItemData?.item.title || '请选择文档'}</h1>
        {activeItemData?.item.videoTimestamp && (
          <div className={css.metaRow}>
            <span className={clsx(css.metaTag, css.video)}>
              <Icon type="caret-right" />含 {activeItemData.item.videoTimestamp} 视频片段
            </span>
          </div>
        )}
      </header>

      <div className={css.articleBody} onClick={handleArticleClick}>
        {renderedMd ? (
          <div dangerouslySetInnerHTML={{ __html: renderedMd }} />
        ) : (
          <p className={css.lede}>
            {activeItemData ? '该文档正在建设中,敬请期待。' : '请从左侧选择文档查看内容。'}
          </p>
        )}

        <div className={css.feedbackBar}>
          <div className={css.feedbackText}>
            <div className={css.feedbackQuestion}>这篇文档对您有帮助吗?</div>
            <div className={css.feedbackHint}>
              您的反馈将用于改进文档质量,我们会在 48 小时内回复(若您留下邮箱)。
            </div>
          </div>
          <button className={css.good} onClick={() => onToast('感谢您的反馈 👍')}>
            <Icon type="like" />
            有用
          </button>
          <button className={css.bad} onClick={() => onToast('感谢您的反馈,我们会优化此文档')}>
            <Icon type="dislike" />
            没用
          </button>
        </div>
      </div>
    </main>
  );
});
