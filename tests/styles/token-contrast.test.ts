import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

/**
 * WCAG AA regression guard for the theme colour tokens.
 *
 * Every text token must reach 4.5:1 against every background token it can sit
 * on, in BOTH themes. `--subtle` silently failed this in both themes until
 * 2026-08-07 (Lighthouse only audits the light theme, so dark went unnoticed).
 */

const CSS = fs.readFileSync(
  path.join(process.cwd(), 'src/styles/globals.css'),
  'utf-8'
)

function parseBlock(selector: string): Record<string, string> {
  // Matches `:root {` / `.dark {` and captures up to the first closing brace.
  const re = new RegExp(`${selector}\\s*\\{([^}]*)\\}`)
  const match = CSS.match(re)
  if (!match) throw new Error(`Could not find CSS block for "${selector}"`)
  const tokens: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/)
    if (m) tokens[m[1]] = m[2].toLowerCase()
  }
  return tokens
}

function relativeLuminance(hexColor: string): number {
  const h = hexColor.replace('#', '')
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  )
  return (lighter + 0.05) / (darker + 0.05)
}

const AA_NORMAL_TEXT = 4.5
const TEXT_TOKENS = ['--foreground', '--muted', '--subtle']
const BACKGROUND_TOKENS = ['--background', '--surface', '--surface-alt']

describe('theme token contrast (WCAG AA)', () => {
  it('sanity-checks the ratio maths against known values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
  })

  for (const [themeName, selector] of [
    ['light', ':root'],
    ['dark', '\\.dark'],
  ] as const) {
    describe(`${themeName} theme`, () => {
      const tokens = parseBlock(selector)

      for (const text of TEXT_TOKENS) {
        for (const bg of BACKGROUND_TOKENS) {
          it(`${text} on ${bg} meets ${AA_NORMAL_TEXT}:1`, () => {
            const fg = tokens[text]
            const background = tokens[bg]
            expect(fg, `${text} missing from ${selector}`).toBeDefined()
            expect(background, `${bg} missing from ${selector}`).toBeDefined()
            const ratio = contrastRatio(fg, background)
            expect(
              ratio,
              `${text} (${fg}) on ${bg} (${background}) is ${ratio.toFixed(2)}:1`
            ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
          })
        }
      }

      it('keeps the type hierarchy: foreground stronger than muted, muted stronger than subtle', () => {
        const bg = tokens['--background']
        const foreground = contrastRatio(tokens['--foreground'], bg)
        const muted = contrastRatio(tokens['--muted'], bg)
        const subtle = contrastRatio(tokens['--subtle'], bg)
        expect(foreground).toBeGreaterThan(muted)
        expect(muted).toBeGreaterThan(subtle)
      })
    })
  }
})
