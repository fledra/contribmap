import { DAYS_IN_WEEK, MS_DAY } from './constants';

function getDateRange(from: number, to: number) {
  const daysBetween = (to - from) / MS_DAY;

  return {
    from,
    to,
    daysBetween,
    weeksBetween: Math.ceil(daysBetween / DAYS_IN_WEEK),
  };
}

export function getHeatmapRange(from: number | Date, to: number | Date) {
  let fromDate = new Date(from);
  let toDate = new Date(to);

  if (fromDate > toDate) {
    fromDate = new Date(to);
    toDate = new Date(from);
  }

  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(0, 0, 0, 0);

  const localRange = getDateRange(
    fromDate.getTime(),
    toDate.getTime() + MS_DAY, // current day inclusive
  );

  const utcRange = getDateRange(
    Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()),
    Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth(), toDate.getUTCDate()) + MS_DAY, // current day inclusive
  );

  return {
    localTime: localRange,
    utc: utcRange,
  };
}
