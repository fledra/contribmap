import type { Forge, ForgeConfig } from '../utils/schema';

export interface Contribution {
  date: string;
  count: number;
}

export interface ContributionFetcherOptions {
  from: string | number | Date;
  to: string | number | Date;
}

export type ContributionFetcher = (config: ForgeConfig, options: ContributionFetcherOptions) => Promise<Contribution[]>;

export interface ContributionFetcherResult {
  forge: Forge;
  status: PromiseSettledResult<ReturnType<ContributionFetcher>>['status'];
  contributions: Contribution[];
}

export interface HeatmapDay {
  count: number;
  breakdown: Partial<{ [key in Forge]: number }>;
}

export type AggregatedContributions = Record<string, HeatmapDay>;

export interface HeatmapData {
  profile: string;
  contributions: AggregatedContributions;
  totalContributions: number;
}
