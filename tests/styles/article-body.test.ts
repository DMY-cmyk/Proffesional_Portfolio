import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Structural guard for the "Hybrid Journal" article typography layer.
 * Asserts the load-bearing rules exist in globals.css so a refactor can't
 * silently drop the reading experience (the way the dead `prose` classes did).
 */

const CSS = fs.readFileSync(
  path.join(process.cwd(), 'src/styles/globals.css'),
  'utf-8'
)

/** Returns the declaration body of the FIRST block matching `selector`. */
function block(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = CSS.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))
  if (!match) throw new Error(`Missing CSS block for "${selector}"`)
  return match[1]
}

describe('.article-body typography layer', () => {
  it('sets a serif reading base with a capped measure', () => {
    const base = block('.article-body')
    expect(base).toContain('font-family: var(--font-display)')
    expect(base).toContain('line-height: 1.85')
    expect(base).toContain('max-width: 65ch')
    expect(base).toContain('counter-reset: article-section')
    expect(base).toContain('overflow-wrap: break-word')
  })

  it('numbers h2 sections with gold mono counters', () => {
    expect(block('.article-body h2')).toContain('counter-increment: article-section')
    const numeral = block('.article-body h2::before')
    expect(numeral).toContain('counter(article-section, decimal-leading-zero)')
    expect(numeral).toContain('var(--font-mono)')
    expect(numeral).toContain('var(--accent-highlight)')
  })

  it('draws a gold rule under each h2', () => {
    const rule = block('.article-body h2::after')
    expect(rule).toContain('width: 36px')
    expect(rule).toContain('height: 2px')
    expect(rule).toContain('var(--accent-highlight)')
  })

  it('renders strong as the gold marker highlight', () => {
    const strong = block('.article-body strong')
    expect(strong).toContain('var(--accent-highlight-soft)')
    expect(strong).toContain('var(--foreground)')
    expect(strong).toContain('font-weight: 600')
  })

  it('gives ordered lists gold mono numerals', () => {
    expect(block('.article-body ol')).toContain('counter-reset: article-item')
    const marker = block('.article-body ol > li::before')
    expect(marker).toContain('counter(article-item, decimal-leading-zero)')
    expect(marker).toContain('var(--accent-highlight)')
  })

  it('styles blockquotes as gold-ruled italic pull-quotes', () => {
    const quote = block('.article-body blockquote')
    expect(quote).toContain('border-left: 2px solid var(--accent-highlight)')
    expect(quote).toContain('font-style: italic')
  })

  it('styles links with the site accent', () => {
    expect(block('.article-body a')).toContain('var(--accent-primary)')
    expect(block('.article-body a:hover')).toContain('var(--accent-primary-dark)')
  })

  it('contains no hard-coded hex colors (dark mode rides the tokens)', () => {
    const layerStart = CSS.indexOf('Article typography')
    expect(layerStart).toBeGreaterThan(-1)
    const layer = CSS.slice(layerStart, CSS.indexOf('Custom cursor', layerStart))
    expect(layer).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
  })
})
