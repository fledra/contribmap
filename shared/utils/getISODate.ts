export default function getISODate(date?: number | string | Date) {
  return new Date(date ?? Date.now()).toISOString().split('T')[0];
}
