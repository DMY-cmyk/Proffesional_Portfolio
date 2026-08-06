import { describe, it, expect } from 'vitest'
import { getUiStrings } from '@/data/content'
import uiStrings from '@/content/ui-strings.json'

describe('ui strings', () => {
  it('en and id have identical key sets', () => {
    const enKeys = Object.keys(uiStrings.en).sort()
    const idKeys = Object.keys(uiStrings.id).sort()
    expect(idKeys).toEqual(enKeys)
  })

  it('resolves by language with the same keys', () => {
    const en = getUiStrings('en')
    const id = getUiStrings('id')
    expect(en.navResearch).toBe('Research')
    expect(id.navResearch.length).toBeGreaterThan(0)
  })

  it('no empty values in either language', () => {
    for (const langBlock of [uiStrings.en, uiStrings.id]) {
      for (const [key, value] of Object.entries(langBlock)) {
        expect(value, `empty value for ${key}`).not.toBe('')
      }
    }
  })
})
