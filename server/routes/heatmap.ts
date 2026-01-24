import type { ContributionFetchResult } from '../types/contribution';

import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Heatmap from '@/components/Heatmap';

import { getForgeFetcher } from '../forges';

export default defineEventHandler(async (event) => {
  const { config } = useContribmapConfig();

  const query = getQuery(event);
  const profile = query.profile?.toString() || 'default';

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
    return fetcher(source);
  });

  const promiseResults = await Promise.allSettled(promises);
  const fetchResults = promiseResults.map<ContributionFetchResult>((res, i) => ({
    forge: sources[i].forge,
    status: res.status,
    contributions: res.status === 'rejected' ? [] : res.value,
  }));

  const aggregated = aggregateContributions(fetchResults);

  const app = createSSRApp(Heatmap, {
    heatmap: aggregated,
    labelColor: 'oklch(20.5% 0 0)',
  });

  setResponseHeader(event, 'Content-Type', 'image/svg+xml');

  return renderToString(app);
});
