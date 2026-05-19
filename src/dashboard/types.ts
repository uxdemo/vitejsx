export interface PlantScore {
  name: string;
  color: string;
  lf: number;
  lr: number;
  cr: number;
  nf: number;
  aa: number;
  ar: number;
  acr: number;
  tr: number;
  amr: number;
  sc: number;
  sm: number[];
  onlineRate: number;
  sa: number[];
  saP: number;
  saH: number;
  saA: number;
  ss: number[];
  ssC: number;
  ssU: number;
  sca: number[];
  scaC: number;
  scaU: number;
}

export interface Alert {
  id: number;
  plant: string;
  spec: string;
  model: string;
  valChange: string;
  time: string;
  timeSort: number;
  fault: string;
  level: string;
  isUnack: boolean;
}

export interface Case {
  id: number;
  plant: string;
  spec: string;
  caseName: string;
  caseType: string;
  source: string;
  fault: string;
  time: string;
  timeSort: number;
  status: string;
  isUnack: boolean;
}

export interface DailyRecord {
  date: string;
  dl: string;
  nm: number;
  na: number;
  nc: number;
  [key: string]: number | string;
}

export type SortDir = 'asc' | 'desc';

export interface TfsField {
  key: string;
  label: string;
}
