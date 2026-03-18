import { describe, it, expect } from 'vitest'
import { getResearchBySlug, getAllResearchSlugs } from '@/lib/mdx'

describe('getAllResearchSlugs', () => {
  it('returns an array of slug strings', () => {
    const slugs = getAllResearchSlugs()
    expect(Array.isArray(slugs)).toBe(true)
  })
})

describe('getResearchBySlug', () => {
  it('returns null for non-existent slug', () => {
    const result = getResearchBySlug('non-existent-slug')
    expect(result).toBeNull()
  })
})
