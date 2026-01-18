export interface Contribution {
  date: string;
  count: number;
}

export type ContributionFetcher = (config: ForgeConfig) => Promise<Contribution[]>;

export interface ContributionFetchResult {
  forge: ForgeConfig['forge'];
  status: PromiseSettledResult<ReturnType<ContributionFetcher>>['status'];
  contributions: Contribution[];
}
