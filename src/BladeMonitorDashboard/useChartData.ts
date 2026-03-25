import { useMemo } from 'react';
import { TIME_CFG, TimeRangeKey } from './constant';

function genData(base: number, noise: number, trend: number, len: number): number[] {
  const r: number[] = [];
  for (let i = 0; i < len; i++) {
    const cyc = Math.sin((i / len) * Math.PI * 4) * noise * 0.3;
    const rn = (Math.random() - 0.5) * noise;
    r.push(Math.round(Math.max(0, base + cyc + rn + (trend * i) / len) * 10) / 10);
  }
  return r;
}

function genSparse(base: number, noise: number, trend: number, len: number, sparsity: number): (number | null)[] {
  const r: (number | null)[] = [];
  for (let i = 0; i < len; i++) {
    if (Math.random() < sparsity) {
      r.push(null);
    } else {
      const cyc = Math.sin((i / len) * Math.PI * 3) * noise * 0.3;
      const rn = (Math.random() - 0.5) * noise;
      r.push(Math.round(Math.max(0, base + cyc + rn + (trend * i) / len) * 10) / 10);
    }
  }
  return r;
}

export function useChartData(timeRange: TimeRangeKey) {
  const cfg = TIME_CFG[timeRange];
  const N = cfg.points;
  const tickInterval = timeRange === '近七天' ? 2 : timeRange === '近30天' ? 23 : 47;

  const chartData = useMemo(() => {
    const labels = cfg.labels();
    const health = genData(88, 8, -2, N);
    const cPitch = genData(15, 12, 5, N);
    const cCurr = genData(30, 20, 15, N);
    const cTorq = genData(8, 8, 2, N);
    const cCap = genData(10, 8, 3, N);
    const cTemp = genData(22, 14, 5, N);
    const vSsStd = genData(60, 25, 10, N);
    const vSs2p = genData(45, 20, 8, N);
    const vFaStd = genData(55, 22, 12, N);
    const vFa2p = genData(40, 18, 6, N);
    const iW = genSparse(40, 20, 12, N, 0.5);
    const iA = genSparse(55, 25, 18, N, 0.5);
    const iC = genSparse(80, 35, 45, N, 0.3);
    const iB = genData(65, 20, 20, N);
    const aeErr = genData(0.08, 0.06, 0.04, N);

    return {
      healthData: labels.map((t, i) => ({ t, 健康分: health[i] })),
      consistData: labels.map((t, i) => ({
        t,
        变桨角度: cPitch[i],
        变桨电流: cCurr[i],
        驱动扭矩: cTorq[i],
        超级电容: cCap[i],
        电机温度: cTemp[i],
      })),
      vibData: labels.map((t, i) => ({ t, SS_STD: vSsStd[i], SS_2P: vSs2p[i], FA_STD: vFaStd[i], FA_2P: vFa2p[i] })),
      imbData: labels.map((t, i) => ({ t, weight: iW[i], aero: iA[i], corner: iC[i], balance: iB[i] })),
      aeData: labels.map((t, i) => ({
        t,
        重构误差: Math.round(aeErr[i] * 1000) / 1000,
        异常: aeErr[i] > 0.2 ? Math.round(aeErr[i] * 1000) / 1000 : null,
      })),
    };
  }, [N, cfg]);

  return { chartData, tickInterval };
}
