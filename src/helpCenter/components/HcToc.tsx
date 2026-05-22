import React from 'react';
import { NavItem, NavGroup } from '../constant';
import css from '../helpCenter.modules.less';

interface ActiveItemData {
  item: NavItem;
  group: NavGroup;
}

interface Props {
  tocHeadings: string[];
  activeItemData: ActiveItemData | null;
  onToast: (msg: string) => void;
}

export default function HcToc({ tocHeadings, activeItemData, onToast }: Props) {
  return (
    <aside className={css.hcToc}>
      <div className={css.tocLabel}>本文目录</div>
      {tocHeadings.length > 0 ? (
        <ul className={css.tocList}>
          {tocHeadings.map((heading, i) => (
            <li key={i}>{heading}</li>
          ))}
        </ul>
      ) : (
        <ul className={css.tocList}>
          <li className={css.active}>文档内容</li>
        </ul>
      )}
      {activeItemData?.item.videoTimestamp && (
        <div className={css.tocSideCard}>
          <h4>本页相关</h4>
          <a onClick={() => onToast(`▶ 跳转到 ${activeItemData.item.videoTimestamp} 视频片段`)}>
            ▶ {activeItemData.item.videoTimestamp} 视频片段
          </a>
        </div>
      )}
    </aside>
  );
}
