import { describe, it, expect } from 'vitest'
import { getStats, getCertifications, getExperience, getResearchEntries } from '@/data/content'

describe('getStats', () => {
  it('returns four stats derived from real content', () => {
    const stats = getStats()
    expect(stats).toHaveLength(4)
    const byLabel = Object.fromEntries(stats.map((s) => [s.label, s]))
    expect(byLabel['Certifications'].value).toBe(getCertifications().length)
    expect(byLabel['Positions held'].value).toBe(getExperience().length)
    expect(byLabel['Research works'].value).toBe(getResearchEntries().length)
    expect(byLabel['Years of experience'].value).toBeGreaterThanOrEqual(1)
  })
})
