import { describe, it, expect } from 'vitest'
import {
  getProfile,
  getEducation,
  getExperience,
  getCertifications,
  getSkills,
  getAwards,
  getCourses,
  getContact,
  getDownloads,
  getSiteConfig,
  getResearchEntries,
} from '@/data/content'

describe('getProfile', () => {
  it('returns profile with required fields', () => {
    const profile = getProfile()
    expect(profile.name).toBeTruthy()
    expect(profile.title).toBeTruthy()
    expect(profile.tagline).toBeTruthy()
    expect(profile.bio).toBeTruthy()
    expect(profile.brandStatement).toBeTruthy()
    expect(profile.avatar).toBeTruthy()
  })
})

describe('getEducation', () => {
  it('returns array of education entries', () => {
    const entries = getEducation()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].school).toBeTruthy()
    expect(entries[0].degree).toBeTruthy()
  })
})

describe('getExperience', () => {
  it('returns array of experience entries', () => {
    const entries = getExperience()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].company).toBeTruthy()
    expect(entries[0].role).toBeTruthy()
  })
})

describe('getCertifications', () => {
  it('returns array of certification entries with slugs', () => {
    const entries = getCertifications()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].slug).toBeTruthy()
    expect(entries[0].name).toBeTruthy()
  })
})

describe('getSkills', () => {
  it('returns array of skill categories', () => {
    const categories = getSkills()
    expect(Array.isArray(categories)).toBe(true)
    expect(categories.length).toBeGreaterThan(0)
    expect(categories[0].category).toBeTruthy()
    expect(Array.isArray(categories[0].items)).toBe(true)
  })
})

describe('getAwards', () => {
  it('returns array of awards', () => {
    const awards = getAwards()
    expect(Array.isArray(awards)).toBe(true)
    expect(awards.length).toBeGreaterThan(0)
    expect(awards[0].title).toBeTruthy()
  })
})

describe('getCourses', () => {
  it('returns array of courses', () => {
    const courses = getCourses()
    expect(Array.isArray(courses)).toBe(true)
    expect(courses.length).toBeGreaterThan(0)
    expect(courses[0].name).toBeTruthy()
  })
})

describe('getContact', () => {
  it('returns contact info with email and linkedin', () => {
    const contact = getContact()
    expect(contact.email).toBeTruthy()
    expect(contact.linkedin).toBeTruthy()
  })
})

describe('getDownloads', () => {
  it('returns download items array', () => {
    const downloads = getDownloads()
    expect(Array.isArray(downloads.items)).toBe(true)
    expect(downloads.items.length).toBeGreaterThan(0)
    expect(downloads.items[0].filePath).toBeTruthy()
  })
})

describe('getSiteConfig', () => {
  it('returns site config with title and url', () => {
    const config = getSiteConfig()
    expect(config.title).toBeTruthy()
    expect(config.url).toBeTruthy()
  })
})

describe('getResearchEntries', () => {
  it('returns array of research entries with slugs', () => {
    const entries = getResearchEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].slug).toBeTruthy()
    expect(entries[0].title).toBeTruthy()
  })
})