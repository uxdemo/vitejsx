import React from 'react';
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
}

export default function HcArticle({ activeItemData, renderedMd, onToast }: Props) {
  return (
    <main className={css.hcMain}>
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

      <div className={css.articleBody}>
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
}
