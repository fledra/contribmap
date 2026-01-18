import type { ContributionFetcher } from '../types/contribution';

import { fetchCodeberg } from './codeberg';
import { fetchForgejo } from './forgejo';
import { fetchGithub } from './github';

type Forge = ForgeConfig['forge'];

const fetchers: Record<Forge, ContributionFetcher> = {
  'github': fetchGithub,
  'gitlab': async () => [],
  'gitlab-self': async () => [],
  'codeberg': fetchCodeberg,
  'forgejo': fetchForgejo,
  'gitea': fetchForgejo,
};

export function getForgeFetcher(forge: Forge) {
  const fetcher = fetchers[forge];
  return fetcher;
}
