import type { Contribution, ContributionFetcher } from '../types/contribution';

interface ForgejoResponse {
  timestamp: number;
  contributions: number;
}

export const fetchForgejo: ContributionFetcher = async (config) => {
  if (!config.baseURL) {
    throw new Error(`Could not find baseURL for ${config.forge}.${config.username}`);
  }

  const url = new URL(config.baseURL);
  const endpoint = `${url.origin}/api/v1/users/${config.username}/heatmap`;
  let token: string | undefined;

  if (config.token) {
    token = getToken(config.token);
  }

  const response = await $fetch<ForgejoResponse[]>(endpoint, {
    method: 'GET',
    responseType: 'json',
    headers: {
      ...(token && { Authorization: `token ${token}` }),
    },
  });

  const contributions = response.map<Contribution>((day) => ({
    date: getISODate(day.timestamp * 1000),
    count: day.contributions,
  }));

  return contributions;
};
