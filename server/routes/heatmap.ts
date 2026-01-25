import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Heatmap from '@/components/Heatmap';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const profile = query.profile?.toString() || 'default';
  const theme = query.theme?.toString() || 'dark';

  const { contributions } = await $fetch('/api/contributions', { query });
  const { aggregated, total } = aggregateContributions(contributions);

  const heatmap: HeatmapData = {
    profile,
    contributions: aggregated,
    totalContributions: total,
  };

  const app = createSSRApp(Heatmap, {
    heatmap,
    theme,
  });

  setResponseHeader(event, 'Content-Type', 'image/svg+xml');

  return renderToString(app);
});
