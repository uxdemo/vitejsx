/* ============================================================
   ECharts color constants — mirrors the CSS variables in
   theme/index.less and index.module.less so canvas-rendered
   charts get real hex/rgba values without DOM lookups.
   ============================================================ */
export const C = {
  primary: '#009fda',
  blue: '#00c5f9',
  success: '#0fc38f',
  warning: '#ff954d',
  error: '#ff5413',
  purple: '#b37feb',
  pink: '#ff85c0',
  ecBlue: '#1890ff',

  /* axis / grid */
  axisLabel: 'rgba(255,255,255,0.45)',
  splitLine: 'rgba(255,255,255,0.10)',

  /* tooltip */
  tooltipBg: '#0a1b2f',
  tooltipText: '#ffffff',
} as const;
