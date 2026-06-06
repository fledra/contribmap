import type { H3Event } from '#imports';

import process from 'node:process';

export default function loadConfigFromEnv(event?: H3Event) {
  let config = process.env.CONTRIBMAP_CONFIG;

  if (event) {
    const runtimeCOnfig = useRuntimeConfig();
    config = runtimeCOnfig.CONTRIBMAP_CONFIG;
  }

  if (!config) return;

  const parsed = JSON.parse(config);
  return validateConfig(parsed);
}
