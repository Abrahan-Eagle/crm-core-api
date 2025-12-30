export function getDateYearsAgo(years: number): Date {
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(currentDate.getFullYear() - years);
  return pastDate;
}
