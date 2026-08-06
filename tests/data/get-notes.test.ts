import { describe, it, expect } from 'vitest'
import { getNoteEntries } from '@/data/content'
import { getAllNoteSlugs } from '@/lib/mdx'

describe('getNoteEntries', () => {
  it('index.json slugs match mdx files on disk', () => {
    const indexSlugs = getNoteEntries().map((n) => n.slug).sort()
    expect(indexSlugs).toEqual(getAllNoteSlugs().sort())
  })
})
