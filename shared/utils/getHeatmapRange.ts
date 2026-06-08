function getDateRange(from: number, to: number) {
  const daysBetween = Math.round((to - from) / MS_PER_DAY);

  return {
    from,
    to,
    daysBetween,
    weeksBetween: Math.ceil(daysBetween / DAYS_PER_WEEK),
  };
}

export function getHeatmapRange(from?: string | number | Date, to?: string | number | Date, alignSunday = true) {
  let toDate = new Date(to ?? Date.now());
  let fromDate = new Date(from ?? Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate() - DAYS_PER_YEAR));

  toDate = new Date(Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate()));
  fromDate = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()));

  if (fromDate > toDate) {
    [fromDate, toDate] = [toDate, fromDate];
  }

  if (alignSunday) {
    fromDate.setUTCDate(fromDate.getUTCDate() - fromDate.getUTCDay());
  }

  fromDate.setUTCHours(0, 0, 0, 0);
  toDate.setUTCHours(23, 59, 59, 999);

  return getDateRange(fromDate.getTime(), toDate.getTime());
}

export type HeatmapDateRange = ReturnType<typeof getDateRange>;
export type HeatmapRange = ReturnType<typeof getHeatmapRange>;
