import { C } from './colors';

export const ecGrid = (left = 20) => ({ top: 5, right: 8, bottom: 0, left });

export const ecXAxis = (showLabel = true, interval = 2) => ({
  type: 'category' as const,
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: showLabel ? { fontSize: 10, color: C.axisLabel, interval } : { show: false },
  splitLine: { show: false },
});

export const ecYAxis = (min: number, max: number, fmtFn?: (v: number) => string) => ({
  type: 'value' as const,
  min,
  max,
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { fontSize: 10, color: C.axisLabel, formatter: fmtFn },
  splitLine: { lineStyle: { type: 'dashed' as const, color: C.splitLine } },
});

export const ecTooltip = {
  trigger: 'axis' as const,
  backgroundColor: C.tooltipBg,
  borderColor: 'rgba(255,255,255,0.3)',
  textStyle: { color: C.tooltipText, fontSize: 12 },
  confine: true,
};

export const ecLine = (name: string, color: string, width = 1.5) => ({
  name,
  type: 'line' as const,
  encode: { x: 't', y: name },
  smooth: false,
  symbol: 'none',
  lineStyle: { color, width },
  itemStyle: { color },
  connectNulls: false,
});

export const ecMarkLine = (marks: Array<{ y: number; color: string; name?: string }>) => ({
  silent: true,
  symbol: 'none',
  data: marks.map((m) => ({
    yAxis: m.y,
    lineStyle: { color: m.color, type: 'dashed' as const, width: 1 },
    label: m.name
      ? { show: true, formatter: m.name, position: 'end' as const, color: m.color, fontSize: 10 }
      : { show: false },
  })),
});

export const ecLegend = (orient: 'horizontal' | 'vertical' = 'horizontal', pos: object = {}) => ({
  orient,
  ...pos,
  textStyle: { color: C.axisLabel, fontSize: 11 },
  itemWidth: 12,
  itemHeight: 4,
});
