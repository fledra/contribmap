import { DAYS_PER_WEEK, MS_PER_DAY } from './constants';

function getDateRange(from: number, to: number) {
  const daysBetween = Math.round((to - from) / MS_PER_DAY);

  return {
    from,
    to,
    daysBetween,
    weeksBetween: Math.ceil(daysBetween / DAYS_PER_WEEK),
  };
}

export function getHeatmapRange(from: number | Date, to: number | Date, alignSunday = true) {
  let fromDate = new Date(from);
  let toDate = new Date(to);

  if (fromDate > toDate) {
    fromDate = new Date(to);
    toDate = new Date(from);
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
