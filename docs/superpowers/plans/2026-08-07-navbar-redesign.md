# Navigation Header Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio header as a curated editorial masthead: deduped links that work on every page, responsive tiers that never overflow, route-aware active states, a two-line brand lockup, a proper search affordance, and a mobile menu with CV CTA and grouped links.

**Architecture:** Pure refinement of the existing floating-pill `Navbar`. Navigation config (`src/config/navigation.ts`) gains a curated `navbarItems` list plus two pure helpers (`resolveNavHref`, `isPageLinkActive`) that `NavLinks` and `MobileMenu` consume; `Navbar` supplies `pathname` from `usePathname`. A "View all research →" link in the homepage research section keeps `/research` one click away after the navbar dedupe.

**Tech Stack:** Next.js 15 (App Router, static export, basePath `/Proffesional_Portfolio`), React 19, Tailwind CSS 4, Framer Motion, Vitest + React Testing Library.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-07-navbar-redesign-design.md`.
- EN/ID parity: every new UI string exists in both `en` and `id` blocks of `src/content/ui-strings.json`; visible text localized, aria-labels stay English (site convention).
- Reduced motion: all new motion disabled under `prefers-reduced-motion` via `@/hooks/use-reduced-motion`.
- Section anchors on the homepage remain pure `#id` (no reload under static export); off-home they become `withBasePath('/#id')`.
- Command palette keeps consuming `allNavItems` — do not change it.
- Run tests with `npx vitest run <file>`; full suite `npx vitest run`; build `npm run build`.
- Commit after every task; never push to origin.

---

### Task 1: New UI strings (EN/ID)

**Files:**
- Modify: `src/content/ui-strings.json`
- Test: `tests/data/ui-strings.test.ts` (existing parity tests cover new keys automatically; add value assertions)

**Interfaces:**
- Produces: `UiStrings` keys `brandTagline`, `navGroupSections`, `navGroupPages`, `viewAllResearch` (auto-derived from JSON via `export type UiStrings = typeof uiStringsData.en` in `src/data/content.ts` — no type edits needed).

- [ ] **Step 1: Write the failing test** — append to the `describe('ui strings', ...)` block in `tests/data/ui-strings.test.ts`:

```ts
  it('has navbar redesign strings in both languages', () => {
    const en = getUiStrings('en')
    const id = getUiStrings('id')
    expect(en.brandTagline).toBe('Accounting · Research')
    expect(id.brandTagline).toBe('Akuntansi · Riset')
    expect(en.navGroupSections).toBe('Sections')
    expect(id.navGroupSections).toBe('Bagian')
    expect(en.navGroupPages).toBe('Pages')
    expect(id.navGroupPages).toBe('Halaman')
    expect(en.viewAllResearch).toBe('View all research →')
    expect(id.viewAllResearch).toBe('Lihat semua riset →')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/data/ui-strings.test.ts`
Expected: FAIL — `brandTagline` is undefined (TS may also error; that counts as the failing state).

- [ ] **Step 3: Add the strings** — in `src/content/ui-strings.json`, add to the `en` block (after `"minRead": "min read"`, keeping the object valid):

```json
    "brandTagline": "Accounting · Research",
    "navGroupSections": "Sections",
    "navGroupPages": "Pages",
    "viewAllResearch": "View all research →"
```

and to the `id` block (after `"minRead": "menit baca"`):

```json
    "brandTagline": "Akuntansi · Riset",
    "navGroupSections": "Bagian",
    "navGroupPages": "Halaman",
    "viewAllResearch": "Lihat semua riset →"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/data/ui-strings.test.ts`
Expected: PASS (including the pre-existing parity test).

- [ ] **Step 5: Commit**

```bash
git add src/content/ui-strings.json tests/data/ui-strings.test.ts
git commit -m "feat(i18n): add navbar redesign UI strings (brand tagline, nav groups, view-all)"
```

---

### Task 2: Navigation config — `navbarItems`, `resolveNavHref`, `isPageLinkActive`

**Files:**
- Modify: `src/config/navigation.ts`
- Create: `tests/config/navigation.test.ts`

**Interfaces:**
- Consumes: `withBasePath(path: string): string` from `@/lib/base-path` (identity outside production builds).
- Produces:
  - `navbarItems: NavItem[]` — six section links + Notes (`/notes`); **no `/research` page link**.
  - `resolveNavHref(href: string, pathname: string): string` — `#id` stays `#id` on `/`; becomes `withBasePath('/#id')` elsewhere; page hrefs pass through `withBasePath`.
  - `isPageLinkActive(href: string, pathname: string): boolean` — false for anchors; true for exact match or `href + '/'` prefix.
  - `sectionLinks`, `pageLinks`, `allNavItems` unchanged (command palette contract).

- [ ] **Step 1: Write the failing test** — create `tests/config/navigation.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  navbarItems,
  sectionLinks,
  allNavItems,
  resolveNavHref,
  isPageLinkActive,
} from '@/config/navigation'

describe('navbarItems', () => {
  it('contains the six section links plus Notes, with no /research duplicate', () => {
    expect(navbarItems.map((i) => i.href)).toEqual([
      '#research',
      '#experience',
      '#education',
      '#credentials',
      '#skills',
      '#contact',
      '/notes',
    ])
  })

  it('has no duplicate labels', () => {
    const labels = navbarItems.map((i) => i.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('leaves the command palette item list untouched', () => {
    expect(allNavItems.map((i) => i.href)).toContain('/research')
    expect(sectionLinks).toHaveLength(6)
  })
})

describe('resolveNavHref', () => {
  it('keeps section anchors as pure hashes on the homepage', () => {
    expect(resolveNavHref('#research', '/')).toBe('#research')
  })

  it('routes section anchors through the homepage when off-home', () => {
    expect(resolveNavHref('#research', '/notes')).toBe('/#research')
    expect(resolveNavHref('#contact', '/research/thesis')).toBe('/#contact')
  })

  it('resolves page links through withBasePath', () => {
    expect(resolveNavHref('/notes', '/')).toBe('/notes')
  })
})

describe('isPageLinkActive', () => {
  it('is false for section anchors', () => {
    expect(isPageLinkActive('#research', '/')).toBe(false)
  })

  it('matches exact page path and nested paths', () => {
    expect(isPageLinkActive('/notes', '/notes')).toBe(true)
    expect(isPageLinkActive('/notes', '/notes/some-slug')).toBe(true)
  })

  it('does not match unrelated paths', () => {
    expect(isPageLinkActive('/notes', '/')).toBe(false)
    expect(isPageLinkActive('/notes', '/notesarchive')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/config/navigation.test.ts`
Expected: FAIL — `navbarItems`, `resolveNavHref`, `isPageLinkActive` are not exported.

- [ ] **Step 3: Implement** — in `src/config/navigation.ts`, add `import { withBasePath } from '@/lib/base-path'` at the top and append after `allNavItems`:

```ts
// Header link list: sections + Notes. The /research page link is intentionally
// omitted (deduped) — it stays reachable via the command palette (allNavItems)
// and the homepage research section's "View all research →" link.
export const navbarItems: NavItem[] = [
  ...sectionLinks,
  { label: 'Notes', href: '/notes', key: 'navNotes' },
]

export function resolveNavHref(href: string, pathname: string): string {
  if (href.startsWith('#')) {
    return pathname === '/' ? href : withBasePath(`/${href}`)
  }
  return withBasePath(href)
}

export function isPageLinkActive(href: string, pathname: string): boolean {
  if (href.startsWith('#')) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/config/navigation.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/config/navigation.ts tests/config/navigation.test.ts
git commit -m "feat(nav): curated navbarItems and path-aware href/active helpers"
```

---

### Task 3: NavLinks — path-aware hrefs, page active states

**Files:**
- Modify: `src/components/navigation/nav-links.tsx`
- Test: `tests/components/navigation/nav-links.test.tsx`

**Interfaces:**
- Consumes: `resolveNavHref`, `isPageLinkActive` from `@/config/navigation` (Task 2).
- Produces: `NavLinks({ items, activeSection, pathname = '/' })` — new optional `pathname` prop; `Navbar` (Task 5) passes it from `usePathname()`.

- [ ] **Step 1: Write the failing tests** — append inside `describe('NavLinks', ...)` in `tests/components/navigation/nav-links.test.tsx`:

```tsx
  it('rewrites section anchors through the homepage when off-home', () => {
    render(<NavLinks items={mockItems} pathname="/notes" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.getAttribute('href')).toBe('/#about')
  })

  it('keeps pure hash anchors on the homepage', () => {
    render(<NavLinks items={mockItems} pathname="/" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.getAttribute('href')).toBe('#about')
  })

  it('highlights an active page link by pathname', () => {
    render(<NavLinks items={mockItems} pathname="/research" />)
    const researchLink = screen.getByText('Research')
    expect(researchLink.className).toContain('text-accent')
  })

  it('does not apply scroll-spy highlight when off the homepage', () => {
    render(<NavLinks items={mockItems} activeSection="about" pathname="/research" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.className).not.toContain('text-accent')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: FAIL — `pathname` prop unknown, hrefs unmodified, no page-active class.

- [ ] **Step 3: Implement** — replace `src/components/navigation/nav-links.tsx` with:

```tsx
'use client'

import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { resolveNavHref, isPageLinkActive } from '@/config/navigation'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
  pathname?: string
}

export function NavLinks({ items, activeSection, pathname = '/' }: NavLinksProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {items.map((item) => {
        const isSectionActive =
          pathname === '/' && !!activeSection && item.href === `#${activeSection}`
        const isActive = isSectionActive || isPageLinkActive(item.href, pathname)
        return (
          <a
            key={item.href}
            href={resolveNavHref(item.href, pathname)}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'relative px-3 py-2 text-sm font-medium rounded-md transition-colors link-underline',
              'text-muted hover:text-foreground',
              isActive && 'text-accent'
            )}
          >
            {item.label}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-accent"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </a>
        )
      })}
    </nav>
  )
}
```

Notes: `hidden md:flex` becomes `hidden lg:flex` (responsive tier change); the `withBasePath` import is dropped (now inside `resolveNavHref`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: PASS (all pre-existing tests still green — default `pathname='/'` preserves old behavior).

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/nav-links.tsx tests/components/navigation/nav-links.test.tsx
git commit -m "feat(nav): path-aware NavLinks with page active states, links collapse below lg"
```

---

### Task 4: MobileMenu — grouped links, CV CTA, staggered reveal, focus management

**Files:**
- Modify: `src/components/navigation/mobile-menu.tsx`
- Test: `tests/components/navigation/mobile-menu.test.tsx`

**Interfaces:**
- Consumes: `resolveNavHref`, `isPageLinkActive` (Task 2); `navGroupSections`/`navGroupPages`/`downloadCv` UI strings (Task 1); `useReducedMotion()` from `@/hooks/use-reduced-motion`; `useLanguage()` + `getUiStrings(lang)`.
- Produces: `MobileMenu({ items, activeSection, pathname = '/' })` — new optional `pathname` prop, consumed by `Navbar` (Task 5). Wrapper div class changes `md:hidden` → `lg:hidden`.

- [ ] **Step 1: Write the failing tests** — in `tests/components/navigation/mobile-menu.test.tsx`, first extend `mockItems` and add tests:

```tsx
const mockItemsWithPage = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Notes', href: '/notes' },
]
```

```tsx
  it('groups links under Sections and Pages labels', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('Sections')).toBeInTheDocument()
    expect(screen.getByText('Pages')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('renders a CV download link inside the menu', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    const cv = screen.getByRole('link', { name: /download cv/i })
    expect(cv.getAttribute('href')).toMatch(/\/files\/cv\//)
  })

  it('rewrites section anchors when off the homepage', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} pathname="/notes" />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('About').getAttribute('href')).toBe('/#about')
  })

  it('hides on large screens instead of medium', () => {
    const { container } = render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    expect(container.firstElementChild?.className).toContain('lg:hidden')
  })

  it('moves focus into the dialog when opened', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog')).toHaveFocus()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx`
Expected: FAIL — no group labels, no CV link, no pathname prop, `md:hidden` wrapper, no focus move.

- [ ] **Step 3: Implement** — replace `src/components/navigation/mobile-menu.tsx` with:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { withBasePath } from '@/lib/base-path'
import { resolveNavHref, isPageLinkActive } from '@/config/navigation'
import { useLanguage } from '@/hooks/use-language'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { getUiStrings } from '@/data/content'
import { LanguageToggle } from '@/components/ui/language-toggle'
import type { NavItem } from '@/config/navigation'

interface MobileMenuProps {
  items: NavItem[]
  activeSection?: string
  pathname?: string
}

export function MobileMenu({ items, activeSection, pathname = '/' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)

  const sections = items.filter((item) => item.href.startsWith('#'))
  const pages = items.filter((item) => !item.href.startsWith('#'))

  useEffect(() => {
    if (!isOpen) return
    panelRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const close = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const renderGroup = (label: string, groupItems: NavItem[], baseIndex: number) => (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle mb-2">
        {label}
      </p>
      <nav className="flex flex-col gap-1">
        {groupItems.map((item, i) => {
          const isActive =
            (pathname === '/' && !!activeSection && item.href === `#${activeSection}`) ||
            isPageLinkActive(item.href, pathname)
          return (
            <motion.div
              key={item.href}
              initial={reducedMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reducedMotion ? 0 : 0.05 + (baseIndex + i) * 0.04 }}
            >
              <a
                href={resolveNavHref(item.href, pathname)}
                onClick={close}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'block py-2 text-lg font-medium transition-colors',
                  'text-muted hover:text-foreground',
                  isActive && 'text-accent'
                )}
              >
                {item.label}
              </a>
            </motion.div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-muted hover:text-foreground transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 320, damping: 32 }
              }
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-y-0 right-0 w-72 sm:w-80 overflow-y-auto bg-surface border-l border-border z-50 p-6 focus:outline-none"
            >
              <div className="flex flex-col gap-8 mt-12">
                {renderGroup(ui.navGroupSections, sections, 0)}
                {pages.length > 0 && renderGroup(ui.navGroupPages, pages, sections.length)}
              </div>
              <a
                href={withBasePath('/files/cv/dzaki-cv.pdf')}
                download
                onClick={close}
                className="mt-10 flex w-full items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-md text-xs font-mono uppercase tracking-wider font-medium hover:bg-accent transition-colors"
                aria-label="Download CV"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
                </svg>
                {ui.downloadCv}
              </a>
              <div className="mt-6 pt-6 border-t border-border flex justify-center">
                <LanguageToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
```

Note: the framer-motion mock in this test file already reduces `motion.div` to a plain `div` and passes props through, so `ref`/`tabIndex` land on a focusable div and `toHaveFocus()` works.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx`
Expected: PASS (including the three pre-existing tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/mobile-menu.tsx tests/components/navigation/mobile-menu.test.tsx
git commit -m "feat(nav): mobile menu with grouped links, CV CTA, staggered reveal, focus management"
```

---

### Task 5: Navbar — brand lockup, search affordance, responsive tiers, curated items

**Files:**
- Modify: `src/components/layout/navbar.tsx`
- Test: `tests/components/layout/navbar.test.tsx`
- Check/Modify: `tests/components/layout/navbar-scrolled.test.tsx` (add the same `next/navigation` mock if it renders `Navbar`)

**Interfaces:**
- Consumes: `navbarItems` (Task 2), `NavLinks` + `MobileMenu` `pathname` props (Tasks 3–4), `brandTagline` string (Task 1), `usePathname` from `next/navigation`.
- Produces: no API change — `Navbar` still takes no props.

- [ ] **Step 1: Write the failing tests** — in `tests/components/layout/navbar.test.tsx`, add a `next/navigation` mock next to the existing mocks:

```tsx
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))
```

Then append these tests inside `describe('Navbar', ...)`:

```tsx
  it('shows exactly one Research link (deduped)', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getAllByText('Research')).toHaveLength(1)
  })

  it('renders the editorial brand tagline', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByText('Accounting · Research')).toBeInTheDocument()
  })

  it('renders a search button for the command palette', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(
      screen.getByRole('button', { name: /search and navigate/i })
    ).toBeInTheDocument()
  })

  it('renders the Notes page link', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/layout/navbar.test.tsx`
Expected: FAIL — two Research links, no tagline, no search-labeled button.

- [ ] **Step 3: Implement** — replace `src/components/layout/navbar.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useLanguage } from '@/hooks/use-language'
import { getUiStrings } from '@/data/content'
import { navbarItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { withBasePath } from '@/lib/base-path'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const pathname = usePathname() ?? '/'
  const hasScrolled = scrollProgress > 0.01
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)
  const localizedItems = navbarItems.map((item) => ({
    ...item,
    label: item.key ? ui[item.key] : item.label,
  }))

  return (
    <header
      className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] rounded-xl md:top-3.5 md:w-[min(1200px,calc(100vw-40px))] md:rounded-2xl bg-background/70 backdrop-blur-2xl backdrop-saturate-150 border border-border shadow-sm transition-all duration-300 ${
        hasScrolled ? 'bg-background/85 shadow-[0_4px_16px_-8px_rgba(15,20,25,0.15)]' : ''
      }`}
    >
      <div className="flex items-center justify-between px-5 h-14">
        <Link
          href="/"
          className="flex flex-col justify-center"
          aria-label="Dzaki Muhammad Yusfian — Home"
        >
          <span className="text-lg leading-tight font-display font-medium text-foreground">
            Dzaki Yusfian<span className="text-accent">.</span>
          </span>
          <span
            aria-hidden="true"
            className="hidden sm:block font-mono text-[9px] leading-none uppercase tracking-[0.22em] text-subtle"
          >
            {ui.brandTagline}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <NavLinks
            items={localizedItems}
            activeSection={activeSection}
            pathname={pathname}
          />
          <button
            onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
            className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-subtle hover:text-accent hover:border-accent transition-colors"
            aria-label="Search and navigate (Ctrl+K)"
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
            <kbd className="font-mono text-[10px] uppercase tracking-wider">Ctrl K</kbd>
          </button>
          <a
            href={withBasePath('/files/cv/dzaki-cv.pdf')}
            download
            className="hidden md:inline-flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider font-medium hover:bg-accent transition-colors"
            aria-label="Download CV"
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
            </svg>
            CV
          </a>
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <ThemeToggle />
          <MobileMenu
            items={localizedItems}
            activeSection={activeSection}
            pathname={pathname}
          />
        </div>
      </div>
      <div
        data-testid="scroll-progress"
        className="absolute bottom-0 left-0 h-0.5 rounded-full bg-accent transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  )
}
```

- [ ] **Step 4: Check `navbar-scrolled.test.tsx`** — open `tests/components/layout/navbar-scrolled.test.tsx`; if it renders `Navbar` and does not already mock `next/navigation`, add the same mock as Step 1 (`vi.mock('next/navigation', () => ({ usePathname: () => '/' }))`).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tests/components/layout/navbar.test.tsx tests/components/layout/navbar-scrolled.test.tsx`
Expected: PASS — note the pre-existing test `renders localized nav labels when switching to Indonesian` still passes (`Pendidikan` appears once now instead of ≥1).

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/navbar.tsx tests/components/layout/navbar.test.tsx tests/components/layout/navbar-scrolled.test.tsx
git commit -m "feat(nav): editorial brand lockup, search affordance, responsive tiers, deduped links"
```

---

### Task 6: ResearchSection — "View all research →" link

**Files:**
- Modify: `src/components/sections/research-section.tsx`
- Test: `tests/components/sections/research-section.test.tsx`

**Interfaces:**
- Consumes: `viewAllResearch` UI string (Task 1); `next/link` (auto-prefixes basePath, same as the research cards).
- Produces: homepage path to `/research` that replaces the deleted navbar page link.

- [ ] **Step 1: Write the failing test** — append inside `describe('ResearchSection', ...)` in `tests/components/sections/research-section.test.tsx`:

```tsx
  it('links to the full research index', () => {
    render(<ResearchSection />)
    const link = screen.getByRole('link', { name: /view all research/i })
    expect(link.getAttribute('href')).toBe('/research')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/sections/research-section.test.tsx`
Expected: FAIL — no such link.

- [ ] **Step 3: Implement** — in `src/components/sections/research-section.tsx`:

Add imports:

```tsx
import Link from 'next/link'
```

Then insert after the secondary-grid block (after the `{others.length > 0 && (...)}` closing paren, before `</SectionWrapper>`):

```tsx
      <div className="mt-8">
        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent font-medium hover:text-[color:var(--accent-primary-dark)]"
        >
          {ui.viewAllResearch}
        </Link>
      </div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/sections/research-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/research-section.tsx tests/components/sections/research-section.test.tsx
git commit -m "feat(research): view-all-research link keeps /research one click from home"
```

---

### Task 7: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: all tests pass. If any unrelated test consumes `allNavItems`/nav labels (e.g., command palette or page tests), fix forward while preserving the spec's contracts.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: static export succeeds with no type errors.

- [ ] **Step 3: Commit any verification fixes**

```bash
git add -A
git commit -m "test(nav): align remaining suites with navbar redesign"
```

Only commit if Step 1/2 required changes.
