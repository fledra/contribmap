import { fetchForgejo } from './forgejo';

export const fetchCodeberg: ContributionFetcher = (config, options) => fetchForgejo(
  {
    ...config,
    baseURL: 'https://codeberg.org',
  },
  options,
);
