import React from 'react';
import clsx from 'clsx';
import { navGroups, navItems } from '../constant';
import { Icon } from '../shared';
import css from '../helpCenter.modules.less';

interface Props {
  openGroups: Set<string>;
  activeItemId: string;
  searchQuery: string;
  onToggleGroup: (id: string) => void;
  onSelectItem: (id: string) => void;
}

export default function HcSidebar({ openGroups, activeItemId, searchQuery, onToggleGroup, onSelectItem }: Props) {
  return (
    <aside className={css.hcSidebar}>
      {navGroups.map((g) => (
        <div className={css.navSection} key={g.id}>
          <div
            className={clsx(css.navGroup, openGroups.has(g.id) && css.open, g.hasVideo && css.hasVideo)}
            onClick={() => onToggleGroup(g.id)}>
            <Icon
              type="right"
              className={css.caret}
              style={{
                transform: openGroups.has(g.id) ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
            <span>{g.label}</span>
            <span className={css.count}>{g.itemCount}</span>
          </div>
          {openGroups.has(g.id) && (
            <div className={css.navSubItems}>
              {navItems[g.id].map((item) => (
                <div
                  key={item.id}
                  className={clsx(css.navItem, activeItemId === item.id && css.active)}
                  style={{
                    opacity:
                      searchQuery.length > 1 && !item.title.toLowerCase().includes(searchQuery.toLowerCase())
                        ? 0.3
                        : 1,
                  }}
                  onClick={() => onSelectItem(item.id)}>
                  {item.title}
                  {item.videoTimestamp && <span className={css.videoTimestamp}>{item.videoTimestamp}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
