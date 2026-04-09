/* ============================================================
   ECharts color — 运行时从 CSS 变量读取，随主题切换自动更新
   ============================================================ */

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function getC() {
  return {
    primary:  cssVar('--primary-color'),
    blue:     cssVar('--blue-color'),
    success:  cssVar('--success-color'),
    warning:  cssVar('--warning-color'),
    error:    cssVar('--error-color'),
    purple:   '#b37feb',
    pink:     '#ff85c0',
    ecBlue:   '#1890ff',

    axisLabel:   cssVar('--text-color-secondary'),
    splitLine:   cssVar('--border-color-split'),
    tooltipBg:   cssVar('--component-background'),
    tooltipText: cssVar('--heading-color'),
  } as const;
}
