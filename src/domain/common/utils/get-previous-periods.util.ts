export function getPreviousPeriods(startDate: Date, periodsBack: number): string[] {
  const periods: string[] = [];

  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth() + 1;

  for (let i = 0; i < periodsBack; i++) {
    currentMonth--;
    if (currentMonth === 0) {
      currentMonth = 12;
      currentYear--;
    }

    const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;
    periods.push(`${currentYear}-${formattedMonth}`);
  }

  return periods;
}
