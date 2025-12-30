export function normalizeFileName(fileName: string): string {
  const parts = fileName.split('.');
  const ext = parts.at(-1);
  const name = parts.slice(0, -1).join('.');
  return `${normalizeName(name)}.${ext}`;
}

export function normalizeName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
