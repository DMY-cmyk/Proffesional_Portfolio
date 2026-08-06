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

  it('localizes labels to Indonesian while keeping values identical', () => {
    const en = getStats('en')
    const id = getStats('id')
    const byLabelId = Object.fromEntries(id.map((s) => [s.label, s]))
    expect(byLabelId['Tahun pengalaman']).toBeDefined()
    expect(byLabelId['Posisi dijalani']).toBeDefined()
    expect(byLabelId['Sertifikasi']).toBeDefined()
    expect(byLabelId['Karya riset']).toBeDefined()
    expect(id.map((s) => s.value)).toEqual(en.map((s) => s.value))
  })
})
