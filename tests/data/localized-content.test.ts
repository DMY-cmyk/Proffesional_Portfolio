import { describe, it, expect } from 'vitest'
import { getExperience, getEducation } from '@/data/content'

describe('getExperience (localized)', () => {
  it('defaults to English', () => {
    const en = getExperience()
    const explicitEn = getExperience('en')
    expect(en).toEqual(explicitEn)
  })

  it('translates roles and bullets into Indonesian where a translation exists', () => {
    const en = getExperience('en')
    const id = getExperience('id')
    // "Operations Officer" (index 0) is intentionally kept untranslated per
    // Dzaki's review decision (2026-08-06) — assert on the Tax Volunteer role,
    // which does carry a distinct Indonesian title.
    const enTaxRole = en.find((e) => e.role === 'Tax Volunteer')
    const idTaxRole = id[en.indexOf(enTaxRole!)]
    expect(idTaxRole.role).toBe('Relawan Pajak')
    expect(id[0].role).toBe('Operations Officer')
    expect(id[0].bullets[0]).not.toBe(en[0].bullets[0])
  })

  it('keeps company, location, and dates identical across languages', () => {
    const en = getExperience('en')
    const id = getExperience('id')
    en.forEach((entry, i) => {
      expect(id[i].company).toBe(entry.company)
      expect(id[i].location).toBe(entry.location)
      expect(id[i].startDate).toBe(entry.startDate)
      expect(id[i].endDate).toBe(entry.endDate)
    })
  })
})

describe('getEducation (localized)', () => {
  it('defaults to English', () => {
    const en = getEducation()
    const explicitEn = getEducation('en')
    expect(en).toEqual(explicitEn)
  })

  it('translates details into Indonesian', () => {
    const en = getEducation('en')
    const id = getEducation('id')
    expect(id[0].details[0]).not.toBe(en[0].details[0])
  })

  it('keeps school, degree, field, and dates identical across languages', () => {
    const en = getEducation('en')
    const id = getEducation('id')
    en.forEach((entry, i) => {
      expect(id[i].school).toBe(entry.school)
      expect(id[i].degree).toBe(entry.degree)
      expect(id[i].field).toBe(entry.field)
      expect(id[i].startDate).toBe(entry.startDate)
      expect(id[i].endDate).toBe(entry.endDate)
    })
  })
})
