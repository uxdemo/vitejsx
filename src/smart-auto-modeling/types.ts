export type { ModelItem, PtCfgItem } from "./constant";

// ── UI component props ──────────────────────────────────────────────────────
export interface IcProps {
  name: string;
  size?: number;
}

export interface BadgeProps {
  status: string;
}

export interface BtnProps {
  children?: React.ReactNode;
  primary?: boolean;
  danger?: boolean;
  ghost?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: string;
  small?: boolean;
}

export interface ProgProps {
  value?: number;
  color?: string;
}

export interface ToggleProps {
  on: boolean;
  onToggle: (checked: boolean) => void;
}

// ── Wizard ──────────────────────────────────────────────────────────────────
export interface WizardCfg {
  turbine: string | null;
  turbineType: string; // 机型ID
  scenes: string[];
  turbines: string[]; // 选择的风机列表，如 ['A01', 'A02', 'A05']
  points: Record<string, string[]>;
  sampleStrategy: string;
  sampleMonths: number;
  excludeFaults: boolean;
  optimizeTarget: string;
  maxIter: number;
  autoThreshold: boolean;
  autoSuppress: boolean;
  autoAlgoSwitch: boolean;
  algoCompetition: boolean;
  [key: string]: unknown;
}

import type { ModelItem } from "./constant";

export interface WizardProps {
  onBack: () => void;
  onComplete: (models: ModelItem[]) => void;
}

// ── Detail ──────────────────────────────────────────────────────────────────
export interface DetailProps {
  model: ModelItem;
  onBack: () => void;
  onUpdate?: (updated: ModelItem) => void;
}

export interface EditVals {
  hi: number | string;
  lo: number | string;
  lv: string;
  sup: string;
}

// ── AI types ────────────────────────────────────────────────────────────────
export type AiIntent = "create" | "optimize" | "status";

export interface CreateEntities {
  plant: string;
  scene: string;
  turbineType: string;
  turbineRange: string;
  count: number;
}

export interface OptimizeEntities {
  plant: string;
  turbine: string;
  scene: string;
  modelName: string;
}

export interface StatusEntities {
  plant: string;
  modelCount: number;
}

export interface ParsedCreate {
  intent: "create";
  original: string;
  entities: CreateEntities;
}

export interface ParsedOptimize {
  intent: "optimize";
  original: string;
  entities: OptimizeEntities;
  model: ModelItem | undefined;
}

export interface ParsedStatus {
  intent: "status";
  original: string;
  entities: StatusEntities;
}

export type ParsedCmd = ParsedCreate | ParsedOptimize | ParsedStatus;

export interface AiCardData {
  type: "parse";
  parsed: ParsedCmd;
}

export interface AiPlanData {
  type: "plan";
  data: CreateEntities;
}

export interface AiOptData {
  type: "opt";
  data: ParsedOptimize;
}

export interface AiStatusData {
  type: "status";
  data: { plant: string; list: ModelItem[] };
}

export type AiCardPayload = AiCardData | AiPlanData | AiOptData | AiStatusData;

export interface ChatMessage {
  role: "ai" | "user";
  text: string;
  card?: AiCardPayload;
}

export type AiNavAction =
  | "dashboard"
  | "wizard"
  | "detail"
  | "addModel"
  | "updateModel";

export interface AiPanelProps {
  expanded: boolean;
  onToggle: () => void;
  onNav: (act: AiNavAction, data?: ModelItem) => void;
  models: ModelItem[];
}

export interface ParseCardProps {
  parsed: ParsedCmd;
}

export interface PlanCardProps {
  data: CreateEntities;
}

export interface OptCardProps {
  data: ParsedOptimize;
}

export interface StatusCardProps {
  data: { plant: string; list: ModelItem[] };
}

// ── App ─────────────────────────────────────────────────────────────────────
export type PageName = "dashboard" | "wizard" | "detail";

export type CountsRecord = Record<string, number>;
