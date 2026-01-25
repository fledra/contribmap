import { DAYS_PER_WEEK, DAYS_PER_YEAR, MS_PER_DAY } from './date';

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
  let fromDate = new Date(from ?? new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate() - DAYS_PER_YEAR));

  if (fromDate > toDate) {
    [fromDate, toDate] = [toDate, fromDate];
  }

  if (alignSunday) {
    fromDate.setDate(fromDate.getDate() - fromDate.getDay());
  }

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);

  const localRange = getDateRange(
    fromDate.getTime(),
    toDate.getTime() + MS_PER_DAY, // current day inclusive
  );

  const utcRange = getDateRange(
    Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()),
    Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate()) + MS_PER_DAY, // current day inclusive
  );

  return {
    localTime: localRange,
    utc: utcRange,
  };
}

export type HeatmapDateRange = ReturnType<typeof getDateRange>;
export type HeatmapRange = ReturnType<typeof getHeatmapRange>;
