export function getPeriodFromDate(date: Date): string {
  const currentMonth: number = date.getMonth() + 1; // getMonth() returns month index (0-11), so add 1
  const currentYear: number = date.getFullYear();
  const formattedMonth: string = currentMonth < 10 ? `0${currentMonth}` : currentMonth.toString();
  return `${currentYear}-${formattedMonth}`;
}
