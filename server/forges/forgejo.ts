interface ForgejoResponse {
  timestamp: number;
  contributions: number;
}

export const fetchForgejo: ContributionFetcher = async (config, options) => {
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

  const from = +new Date(options.from);
  const to = +new Date(options.to);

  const contributions = response
    .filter((day) => {
      const ts = day.timestamp * 1000;
      return ts >= from && ts <= to;
    })
    .map<Contribution>((day) => ({
      date: getISODate(day.timestamp * 1000),
      count: day.contributions,
    }));

  return contributions;
};
