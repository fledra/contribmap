import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Heatmap from '@/components/Heatmap';

import { getForgeFetcher } from '../forges';

export default defineEventHandler(async (event) => {
  const { config } = useContribmapConfig();

  const query = getQuery(event);
  const profile = query.profile?.toString() || 'default';
  const from = query.from?.toString();
  const to = query.to?.toString();

  const range = getHeatmapRange(from, to, !from && !to).utc;

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

  const sources = config[profile];
  const promises = sources.map((source) => {
    const fetcher = getForgeFetcher(source.forge);
    return fetcher(source, range);
  });

  const promiseResults = await Promise.allSettled(promises);
  const fetchResults = promiseResults.map<ContributionFetcherResult>((res, i) => ({
    forge: sources[i].forge,
    status: res.status,
    contributions: res.status === 'rejected' ? [] : res.value,
  }));

  const { aggregated, total } = aggregateContributions(fetchResults);

  const heatmap: HeatmapData = {
    profile,
    contributions: aggregated,
    totalContributions: total,
  };

  const theme = query.theme?.toString() || 'dark';
  const app = createSSRApp(Heatmap, {
    heatmap,
    theme,
  });

  setResponseHeader(event, 'Content-Type', 'image/svg+xml');

  return renderToString(app);
});
