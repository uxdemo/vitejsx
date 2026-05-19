import { useState, useEffect } from 'react';

const isDark = () => localStorage.getItem('theme') !== 'default';

export interface ChartColors {
  axisLabel: string;
  splitLine: string;
  axisLine: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

const DARK: ChartColors = {
  axisLabel:    'rgba(255,255,255,0.45)',
  splitLine:    'rgba(255,255,255,0.1)',
  axisLine:     'rgba(255,255,255,0.15)',
  tooltipBg:    '#1e2630',
  tooltipBorder:'rgba(255,255,255,0.1)',
  tooltipText:  'rgba(255,255,255,0.85)',
};

const LIGHT: ChartColors = {
  axisLabel:    'rgba(16,23,29,0.45)',
  splitLine:    'rgba(16,23,29,0.1)',
  axisLine:     'rgba(16,23,29,0.15)',
  tooltipBg:    '#ffffff',
  tooltipBorder:'rgba(16,23,29,0.12)',
  tooltipText:  'rgba(16,23,29,0.85)',
};

export function useChartColors(): ChartColors {
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const handle = () => setDark(isDark());
    window.addEventListener('storage', handle);
    return () => window.removeEventListener('storage', handle);
  }, []);

  return dark ? DARK : LIGHT;
}
