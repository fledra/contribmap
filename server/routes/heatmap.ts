import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

import Heatmap from '@/components/Heatmap';

export default defineEventHandler(async (event) => {
  const app = createSSRApp(Heatmap, {
    labelColor: 'oklch(20.5% 0 0)',
  });

  setResponseHeader(event, 'Content-Type', 'image/svg+xml');

  return renderToString(app);
});
