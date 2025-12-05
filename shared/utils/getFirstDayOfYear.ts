export default function getFirstDayOfYear(year: number) {
  const date = new Date(year, 0, 1);
  return {
    day: date.getDay(),
    timestamp: date.getTime(),
  };
}
