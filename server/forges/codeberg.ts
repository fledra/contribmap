import type { ContributionFetcher } from '../types/contribution';

import { fetchForgejo } from './forgejo';

export const fetchCodeberg: ContributionFetcher = (config) => fetchForgejo({
  ...config,
  baseURL: 'https://codeberg.org',
});
