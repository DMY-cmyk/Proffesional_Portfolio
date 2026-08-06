import { describe, it, expect } from 'vitest'
import { slugifyHeading, extractHeadings, readingTimeMinutes } from '@/lib/article-utils'

describe('slugifyHeading', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyHeading('Research Question')).toBe('research-question')
  })
  it('collapses punctuation runs into single hyphens and trims', () => {
    expect(slugifyHeading("Tobin's Q — and M/B!")).toBe('tobin-s-q-and-m-b')
  })
})

describe('extractHeadings', () => {
  const md = [
    '# Title ignored',
    '## Research Question',
    'body text',
    '### Sub *point*',
    '#### h4 ignored',
    '## Key `Findings`',
  ].join('\n')

  it('extracts h2 and h3 with ids, skipping other levels', () => {
    expect(extractHeadings(md)).toEqual([
      { id: 'research-question', text: 'Research Question', level: 2 },
      { id: 'sub-point', text: 'Sub point', level: 3 },
      { id: 'key-findings', text: 'Key Findings', level: 2 },
    ])
  })

  it('strips link syntax from heading text', () => {
    expect(extractHeadings('## See [the paper](https://x.y)')).toEqual([
      { id: 'see-the-paper', text: 'See the paper', level: 2 },
    ])
  })
})

describe('readingTimeMinutes', () => {
  it('is at least 1 for short content', () => {
    expect(readingTimeMinutes('a few words only')).toBe(1)
  })
  it('divides by 200 wpm and ceils', () => {
    const words = Array.from({ length: 401 }, (_, i) => `w${i}`).join(' ')
    expect(readingTimeMinutes(words)).toBe(3)
  })
})
