export const DAYS_PER_WEEK = 7;
export const DAYS_PER_YEAR = 52 * DAYS_PER_WEEK;
export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDaysBetween(a: Date, b: Date) {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcA - utcB) / MS_PER_DAY);
}

export function getLastSunday(date: Date) {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

export function getISODate(date?: number | string | Date) {
  return new Date(date ?? Date.now()).toISOString().split('T').at(0);
}

export function getDayName(date: Date, locale: Intl.LocalesArgument = 'default') {
  return date.toLocaleString(locale, { weekday: 'short' });
}

export function getMonthName(date: Date, locale: Intl.LocalesArgument = 'default') {
  return date.toLocaleString(locale, { month: 'short' });
}
