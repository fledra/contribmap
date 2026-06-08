export default function aggregateContributions(results: ContributionFetcherResult | ContributionFetcherResult[]) {
  const fetchedResults = Array.isArray(results) ? results : [results];

  const aggregated: AggregatedContributions = {};
  let total = 0;

  for (const result of fetchedResults) {
    if (result.status === 'rejected') continue;

    const { name, forge, username, contributions } = result;
    const key = name ?? `${forge}:${username}`;

    for (const contribution of contributions) {
      const { date, count } = contribution;

      if (!aggregated[date]) {
        aggregated[date] = {
          count: 0,
          breakdown: {},
        };
      }

      total += count;
      aggregated[date].count += count;
      aggregated[date].breakdown[key] = (aggregated[date].breakdown[key] ?? 0) + count;
    }
  }

  return {
    total,
    aggregated,
  };
}
