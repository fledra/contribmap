interface DateRange {
  start: number;
  end: number;
  daysBetween: number;
  weeksBetween: number;
}

export interface HeatmapRange {
  local: DateRange;
  utc: DateRange;
}

const MS_DAY = 24 * 60 * 60 * 1000;

function getLastSunday(fromDate: Date, useUTC = false): Date {
  const date = new Date(fromDate);

  if (useUTC) {
    date.setUTCDate(date.getUTCDate() - date.getUTCDay());
    date.setUTCHours(0, 0, 0, 0);
  } else {
    date.setDate(date.getDate() - date.getDay());
    date.setHours(0, 0, 0, 0);
  }

  return date;
}

function getDateRange(start: number, end: number): DateRange {
  const daysBetween = (end - start) / MS_DAY;

  return {
    start,
    end,
    daysBetween,
    weeksBetween: daysBetween / 7,
  };
}

export function getHeatmapRange(rangeStart = new Date()): HeatmapRange {
  const localNow = new Date(rangeStart);
  localNow.setHours(0, 0, 0, 0);

  const [localYear, localMonth, localDate] = [localNow.getFullYear(), localNow.getMonth(), localNow.getDate()];
  const [utcYear, utcMonth, utcDate] = [localNow.getUTCFullYear(), localNow.getUTCMonth(), localNow.getUTCDate()];

  const localStart = getLastSunday(new Date(localYear - 1, localMonth, localDate));
  const utcStart = getLastSunday(new Date(Date.UTC(utcYear - 1, utcMonth, utcDate)), true);

  const utcNow = new Date(Date.UTC(utcYear, utcMonth, utcDate));

  return {
    local: getDateRange(
      localStart.getTime(),
      localNow.getTime() + MS_DAY, // current day inclusive
    ),
    utc: getDateRange(
      utcStart.getTime(),
      utcNow.getTime() + MS_DAY, // current day inclusive
    ),
  };
}
