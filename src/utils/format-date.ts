const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function formatDate(dateStr: string): string {
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr
  }
  const [year, month] = dateStr.split('-')
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`
}

export function formatDateRange(start: string, end: string | null): string {
  const startFormatted = formatDate(start)
  const endFormatted = end ? formatDate(end) : 'Present'
  return `${startFormatted} — ${endFormatted}`
}