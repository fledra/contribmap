import type { H3Event } from '#imports';

export type ContribmapConfigSource = 'env' | 'file';

let _config: ContribmapConfig | undefined;

export function setContribmapConfig(config?: ContribmapConfig) {
  _config = config;
}

export function useContribmapConfig(event?: H3Event) {
  if (event && !_config) {
    setContribmapConfig(loadConfigFromEnv(event));
  }

  return {
    config: _config,
  };
}
