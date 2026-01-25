import { getForgeFetcher } from '../forges';

interface CachedContribution {
  timestamp: number;
  profile: string;
  contributions: ContributionFetcherResult[];
  totalContributions: number;
  range: HeatmapDateRange;
}

export default defineEventHandler(async (event) => {
  const { config } = useContribmapConfig();

  const query = getQuery(event);
  const profile = query.profile?.toString() || 'default';
  const from = query.from?.toString();
  const to = query.to?.toString();

  const range = getHeatmapRange(from, to, !from && !to).utc;

  const storage = useStorage('contributions');
  const cached = await storage.getItem(profile) as CachedContribution;
  const isStale = !cached || (Date.now() - cached.timestamp) >= 1000 * 60; // stale after a minute

  if (!isStale) {
    setHeader(event, 'Cache-Control', 'public, max-age=60');
    return {
      ...cached,
      range: {
        from: cached.range.from,
        to: cached.range.to,
      },
    };
  }

  if (!config) {
    throw createError({
      statusCode: 500,
      statusText: 'Config Not Found',
      message: 'Could not generate heatmap due to missing or invalid configuration',
    });
  }

  if (!config[profile]) {
    throw createError({
      statusCode: 404,
      statusText: 'Profile Not Found',
      message: 'Given profile is missing in the configuration',
    });
  }

  try {
    const sources = config[profile];
    const promises = sources.map((source) => {
      const fetcher = getForgeFetcher(source.forge);
      return fetcher(source, range);
    });

    const promiseResults = await Promise.allSettled(promises);
    const fetchResults = promiseResults.map<ContributionFetcherResult>((res, i) => ({
      name: sources[i].name,
      forge: sources[i].forge,
      username: sources[i].username,
      status: res.status,
      contributions: res.status === 'rejected' ? [] : res.value.filter((c) => c.count > 0),
    }));

    const total = fetchResults.reduce((acc, cur) => acc + cur.contributions.reduce((a, c) => a + c.count, 0), 0);

    const data: CachedContribution = {
      profile,
      range,
      timestamp: Date.now(),
      contributions: fetchResults,
      totalContributions: total,
    };

    await storage.setItem(profile, data);

    return {
      ...data,
      range: {
        from: range.from,
        to: range.to,
      },
    };
  } catch (error) {
    if (cached) {
      return cached;
    }

    throw error;
  }
});
