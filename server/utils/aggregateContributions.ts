export default function aggregateContributions(results: ContributionFetcherResult | ContributionFetcherResult[]) {
  const fetchedResults = Array.isArray(results) ? results : [results];

  const aggregated: AggregatedContributions = {};
  let total = 0;

  for (const result of fetchedResults) {
    if (result.status === 'rejected') continue;

    const { forge, contributions } = result;

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
      aggregated[date].breakdown[forge] = (aggregated[date].breakdown[forge] ?? 0) + count;
    }
  }

  return {
    total,
    aggregated,
  };
}
