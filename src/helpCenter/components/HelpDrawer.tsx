import React from 'react';
import clsx from 'clsx';
import { Icon } from '../shared';
import css from '../helpCenter.modules.less';

interface Props {
  open: boolean;
  type: 'global' | 'page';
  pinned: boolean;
  activeTab: 'doc' | 'video' | 'faq';
  onClose: () => void;
  onSwitchToHc: () => void;
  onSetPinned: (v: boolean) => void;
  onSetOpen: (v: boolean) => void;
  onSetTab: (tab: 'doc' | 'video' | 'faq') => void;
  onToast: (msg: string) => void;
}

export default function HelpDrawer({
  open, type, pinned, activeTab,
  onClose, onSwitchToHc, onSetPinned, onSetOpen, onSetTab, onToast,
}: Props) {
  return (
    <>
      <div className={clsx(css.drawerOverlay, open && css.open)} onClick={onClose}></div>
      <aside className={clsx(css.drawer, open && css.open)}>
        <div className={css.drawerHead}>
          <div className={css.drawerHeaderRow}>
            <h3>
              <span className={css.helpIcon}>?</span>
              <span>{type === 'global' ? '帮助中心 · 全局' : '本页帮助'}</span>
            </h3>
            <span className={css.drawerRoute}>
              {type === 'global' ? '全平台 (M1 模式)' : 'routeKey: /modeling/config/model/mode'}
            </span>
            <div className={css.drawerHeaderActions}>
              <button
                className={clsx(css.drawerIconBtn, pinned && css.pinned)}
                title="钉住"
                onClick={() => onSetPinned(!pinned)}>
                <Icon type="pushpin" />
              </button>
              <button className={css.drawerIconBtn} title="在新页打开完整帮助中心" onClick={onSwitchToHc}>
                <Icon type="export" />
              </button>
              <button
                className={css.drawerIconBtn}
                title="关闭"
                onClick={() => { onSetPinned(false); onSetOpen(false); }}>
                <Icon type="close" />
              </button>
            </div>
          </div>
          <div className={css.drawerTabs}>
            {(['doc', 'video', 'faq'] as const).map((tab) => (
              <button
                key={tab}
                className={clsx(css.drawerTab, activeTab === tab && css.active)}
                onClick={() => onSetTab(tab)}>
                {tab === 'doc' && <>📄 文档 <span className={css.tabCount}>4</span></>}
                {tab === 'video' && <>🎬 视频 <span className={css.tabCount}>1</span></>}
                {tab === 'faq' && <>❓ FAQ <span className={css.tabCount}>3</span></>}
              </button>
            ))}
          </div>
        </div>

        <div className={css.drawerBody}>
          {/* DOC tab */}
          <div className={activeTab === 'doc' ? css.drawerTabPanelVisible : css.drawerTabPanel}>
            <div className={css.recommendedLabel}>
              <span>⚡ 与本页最相关</span>
              <span className={css.aiChip}>AUTO-MATCHED</span>
            </div>
            <div className={css.helpDocList}>
              {[
                { role: '工程师', cat: '模型配置', time: '4 min', title: '如何配置工况模式', sub: '优先级 1–5、6 种运算符、AND/OR 从上到下顺序、导入全局模式', msg: '已打开《如何配置工况模式》' },
                { role: '工程师', cat: '模型配置', time: '3 min', title: '如何创建一个模型(基本信息与算法选择)', sub: '三种算法对比:MMLA 机理 / NRDA 时序关联 / PBA 非时序', msg: '已打开《如何创建一个模型》' },
                { role: '工程师', cat: '模型配置', time: '5 min', title: '如何配置测点参数', sub: 'IO 类型(输入/输出/输入输出/不使用)、残差告警阈值、3 种延迟策略', msg: '已打开《如何配置测点参数》' },
                { role: '工程师', cat: '模型配置', time: '4 min', title: '如何选取训练样本并训练模型', sub: '样本须代表正常工况,单模型有效点 ≤ 5 万,三色曲线解读', msg: '已打开《如何选取训练样本并训练模型》' },
              ].map((doc, i) => (
                <div key={i} className={css.helpDocItem} onClick={() => onToast(doc.msg)}>
                  <div className={css.docMeta}>
                    <span className={clsx(css.pill, css.engineer)}>{doc.role}</span>
                    <span>{doc.cat}</span>
                    <span>· {doc.time}</span>
                  </div>
                  <div className={css.docTitle}>{doc.title}</div>
                  <div className={css.docSub}>{doc.sub}</div>
                </div>
              ))}
            </div>
            <div className={clsx(css.recommendedLabel, css.recommendedLabelSpacing)}>📺 推荐视频</div>
            <div className={css.helpVideoCard} onClick={() => onToast('▶ 自动跳到 V1 · 02:30 单元二 — 配置工况模式')}>
              <div className={css.videoThumbnail}>
                <div className={clsx(css.playBtn, css.playBtnSmall)}>
                  <Icon type="caret-right" style={{ fontSize: 20 }} />
                </div>
              </div>
              <div className={css.videoInfo}>
                <div className={css.videoTitle}>V1 · 模型配置(全流程)</div>
                <div className={css.videoSubtitle}>12:00 · 5 个单元章节 · 自动跳到 02:30「配置工况模式」</div>
              </div>
            </div>
          </div>

          {/* VIDEO tab */}
          <div className={activeTab === 'video' ? css.drawerTabPanelVisible : css.drawerTabPanel}>
            <div className={css.recommendedLabel}>🎬 本页相关视频</div>
            <div className={css.helpVideoCard} onClick={() => onToast('▶ 跳到 02:30 · 单元二 配置工况模式')}>
              <div className={css.videoThumbnail}>
                <div className={clsx(css.playBtn, css.playBtnSmall)}>
                  <Icon type="caret-right" style={{ fontSize: 20 }} />
                </div>
              </div>
              <div className={css.videoInfo}>
                <div className={css.videoTitle}>V1 · 模型配置</div>
                <div className={css.videoSubtitle}>12:00 · 自动跳到 02:30「单元二 · 配置工况模式」</div>
              </div>
            </div>
            <div className={css.drawerVideoBg}>
              <div className={css.drawerChLabel}>单元章节(点击跳转)</div>
              <div className={css.chapterList}>
                {[
                  ['00:00', '单元一 · 创建模型与基础配置'],
                  ['02:30', '单元二 · 配置工况模式 ◀ 本页', true],
                  ['05:00', '单元三 · 测点参数配置'],
                  ['07:30', '单元四 · 样本选取与模型训练'],
                  ['10:30', '单元五 · 多工况模型'],
                ].map(([ts, label, active], i) => (
                  <div key={i} className={clsx(css.chapter, active && css.active)}>
                    <span className={css.timestamp}>{ts}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div className={css.drawerChLabelSpacing}>单元二 子章节(6 画面)</div>
              <div className={css.chapterList}>
                {[
                  ['02:30', '画面 1 · 进入模式配置区域'],
                  ['03:00', '画面 2 · 填写模式基本信息'],
                  ['03:30', '画面 3 · 定义模式表达式 ◀', true],
                  ['04:00', '画面 4 · 多条件组合与 AND/OR'],
                  ['04:30', '画面 5 · 保存与查看模式'],
                  ['05:00', '画面 6 · 模式的两个核心作用'],
                ].map(([ts, label, active], i) => (
                  <div key={i} className={clsx(css.chapter, active && css.active)}>
                    <span className={css.timestamp}>{ts}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ tab */}
          <div className={activeTab === 'faq' ? css.drawerTabPanelVisible : css.drawerTabPanel}>
            <div className={css.recommendedLabel}>高频问题</div>
            <div className={css.helpDocList}>
              {[
                { title: '为什么我的模式频繁切换?', sub: '检查表达式中是否需要加入滞回(hysteresis)缓冲,建议留 3–5% 死区' },
                { title: 'AND 在 OR 之后是不是优先级更高?', sub: '不是。AND/OR 没有优先级之分,系统严格按从上到下顺序判断,把关键条件放最前' },
                { title: '我没创建任何模式,模型能上线吗?', sub: '不能。模式控制 AI 计算的生效时段,缺失模式会导致模型上线后不执行任何计算' },
              ].map((faq, i) => (
                <div key={i} className={css.helpDocItem}>
                  <div className={css.docMeta}>
                    <span className={css.pill}>FAQ</span>
                    <span>模型配置</span>
                  </div>
                  <div className={css.docTitle}>{faq.title}</div>
                  <div className={css.docSub}>{faq.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={css.drawerFoot}>
          <span>没找到想要的?</span>
          <span className={css.drawerFooterAction} onClick={() => onToast('已记录,运营会在 24 小时内回复')}>
            提交反馈
            <Icon type="arrow-right" />
          </span>
        </div>
      </aside>
    </>
  );
}
