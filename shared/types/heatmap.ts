export interface ForgeBreakdown {
  [sourceName: string]: number;
}

export interface HeatmapDayData {
  total: number;
  breakdown: ForgeBreakdown;
}

export type HeatmapData = Record<string, HeatmapDayData>;
