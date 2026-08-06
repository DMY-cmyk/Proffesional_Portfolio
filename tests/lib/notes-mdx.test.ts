import { describe, it, expect } from 'vitest'
import { getAllNoteSlugs, getNoteBySlug } from '@/lib/mdx'

describe('notes mdx collection', () => {
  it('lists the starter note slug', () => {
    expect(getAllNoteSlugs()).toContain('reading-sustainability-reports')
  })
  it('loads a note with frontmatter', () => {
    const note = getNoteBySlug('reading-sustainability-reports')
    expect(note).not.toBeNull()
    expect(note!.frontmatter.title.length).toBeGreaterThan(0)
    expect(note!.frontmatter.summary.length).toBeGreaterThan(0)
    expect(note!.content).toContain('##')
  })
  it('returns null for unknown slug', () => {
    expect(getNoteBySlug('nope')).toBeNull()
  })
})
