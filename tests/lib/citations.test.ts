import { describe, it, expect } from 'vitest'
import { apaAuthor, buildApaCitation, buildBibtex } from '@/lib/article-utils'

const input = {
  authorName: 'Dzaki Muhammad Yusfian',
  title: 'The Effect of Sustainability Report Disclosure on Firm Value',
  year: '2026',
  institution: 'STIE YKPN',
  kind: 'thesis',
}

describe('apaAuthor', () => {
  it('formats Last, F. M.', () => {
    expect(apaAuthor('Dzaki Muhammad Yusfian')).toBe('Yusfian, D. M.')
  })
  it('handles single names', () => {
    expect(apaAuthor('Dzaki')).toBe('Dzaki')
  })
})

describe('buildApaCitation', () => {
  it('produces an APA-style undergraduate thesis citation', () => {
    expect(buildApaCitation(input)).toBe(
      'Yusfian, D. M. (2026). The Effect of Sustainability Report Disclosure on Firm Value [Undergraduate thesis, STIE YKPN].'
    )
  })
})

describe('buildBibtex', () => {
  it('produces a @thesis entry keyed by last name + year', () => {
    const bib = buildBibtex(input)
    expect(bib).toContain('@thesis{yusfian2026')
    expect(bib).toContain('author = {Dzaki Muhammad Yusfian}')
    expect(bib).toContain('title = {The Effect of Sustainability Report Disclosure on Firm Value}')
    expect(bib).toContain('year = {2026}')
    expect(bib).toContain('school = {STIE YKPN}')
  })
})
