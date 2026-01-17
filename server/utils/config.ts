export type ContribmapConfigSource = 'env' | 'file';

let _config: ContribmapConfig | undefined;

export function setContribmapConfig(config?: ContribmapConfig) {
  _config = config;
}

export function useContribmapConfig() {
  return {
    config: _config,
  };
}
