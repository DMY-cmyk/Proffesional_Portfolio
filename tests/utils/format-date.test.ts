import { describe, it, expect } from 'vitest'
import { formatDate, formatDateRange } from '@/utils/format-date'

describe('formatDate', () => {
  it('formats YYYY-MM to readable string', () => {
    expect(formatDate('2025-06')).toBe('Jun 2025')
  })

  it('formats YYYY to year only', () => {
    expect(formatDate('2024')).toBe('2024')
  })
})

describe('formatDateRange', () => {
  it('formats a date range', () => {
    expect(formatDateRange('2023-01', '2025-06')).toBe('Jan 2023 — Jun 2025')
  })

  it('handles present end date', () => {
    expect(formatDateRange('2023-01', null)).toBe('Jan 2023 — Present')
  })
})