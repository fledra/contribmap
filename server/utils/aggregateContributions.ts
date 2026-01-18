import type { ContributionFetchResult } from '../types/contribution';

export default function aggregateContributions(
  results: ContributionFetchResult | ContributionFetchResult[],
  from?: string | number | Date,
  to: string | number | Date = new Date(),
) {
  const fetchedResults = Array.isArray(results) ? results : [results];

  const toDate = new Date(to);
  const toISO = getISODate(toDate);

  const fromDate = from ? new Date(from) : new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() - DAYS_PER_YEAR);
  const fromISO = getISODate(fromDate);

  const heatmap: HeatmapData = {};

  for (const result of fetchedResults) {
    if (result.status === 'rejected') continue;

    const { forge, contributions } = result;

    for (const contribution of contributions) {
      const { date, count } = contribution;

      if (date < fromISO || date > toISO) continue;

      if (!heatmap[date]) {
        heatmap[date] = {
          total: 0,
          breakdown: {},
        };
      }

      heatmap[date].total += count;
      heatmap[date].breakdown[forge] = (heatmap[date].breakdown[forge] ?? 0) + count;
    }
  }

  return heatmap;
}
