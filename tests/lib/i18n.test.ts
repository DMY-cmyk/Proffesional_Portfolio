import { describe, it, expect } from 'vitest'
import { pickLang, pickLangArray } from '@/lib/i18n'

describe('pickLang', () => {
  it('passes plain strings through for any lang', () => {
    expect(pickLang('Hello', 'id')).toBe('Hello')
  })
  it('returns the requested language', () => {
    expect(pickLang({ en: 'Hello', id: 'Halo' }, 'id')).toBe('Halo')
  })
  it('falls back to en when id is missing', () => {
    expect(pickLang({ en: 'Hello' }, 'id')).toBe('Hello')
  })
})

describe('pickLangArray', () => {
  it('resolves each element', () => {
    expect(
      pickLangArray(['plain', { en: 'Two', id: 'Dua' }], 'id')
    ).toEqual(['plain', 'Dua'])
  })
})
