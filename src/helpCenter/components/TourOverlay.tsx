import React from 'react';
import clsx from 'clsx';
import { TourStep } from '../constant';
import css from '../helpCenter.modules.less';

interface Props {
  open: boolean;
  index: number;
  steps: TourStep[];
  onNext: () => void;
  onClose: () => void;
}

export default function TourOverlay({ open, index, steps, onNext, onClose }: Props) {
  return (
    <div className={clsx(css.tourOverlay, open && css.open)}>
      <div className={css.tourCard}>
        <div className={css.tourStep}>新手引导 · 步骤 {index + 1} / {steps.length}</div>
        <h4>{steps[index].title}</h4>
        <p>{steps[index].description}</p>
        <div className={css.tourActions}>
          <button className={clsx(css.btn, css.btnSecondary)} onClick={onClose}>跳过</button>
          <div className={css.tourSpacer}></div>
          <div className={css.tourDots}>
            {steps.map((_, i) => (
              <i key={i} className={i === index ? css.active : ''}></i>
            ))}
          </div>
          <button className={clsx(css.btn, css.btnPrimary)} onClick={onNext}>
            {index === steps.length - 1 ? '完成 ✓' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
