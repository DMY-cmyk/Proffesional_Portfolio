# Journal Masthead Navigation Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the floating glass-pill navbar with a full-width, two-tier editorial journal masthead that condenses to one row on scroll, per the approved spec `docs/superpowers/specs/2026-08-07-nav-header-journal-masthead-design.md`.

**Architecture:** The header becomes a fixed full-width `<header>` with an identity tier (brand lockup + language/theme/CV) over a navigation tier (mono small-caps links), closed by a 2px ink rule that hosts the scroll-progress fill. A new `useCondensedNav` hook (scrollY > 88 / < 72 hysteresis) drives a condensed single-row state; framer-motion `layout`/`layoutId` animates the merge. The mobile drawer is re-skinned (paper panel, ink leading edge, numbered group labels, serif links) with its behavior untouched.

**Tech Stack:** Next.js 15 (static export, basePath), Tailwind CSS v4 (`@theme` tokens), framer-motion, vitest + @testing-library/react (jsdom).

## Global Constraints

- All colors come from existing CSS tokens (`--background`, `--foreground`, `--muted`, `--subtle`, `--border`, `--accent-primary`, `--accent-highlight`) plus ONE new token `--nav-underline-hover` (light `#c9bda9`, dark `#3f4c5e`). No new hardcoded hex in components.
- Gold (`--accent-highlight`) may color glyphs and rules only — never text below 18px.
- One underline system: hover/focus = 2px `--nav-underline-hover`; active = 2px accent via framer `layoutId="nav-underline"`. The `link-underline` CSS class must no longer be used by nav links (class itself stays in `globals.css` for other links).
- No visible search affordance in the header. Ctrl+K / command palette untouched.
- Reduced motion: every new animation must degrade to instant (use existing `useReducedMotion` hook from `@/hooks/use-reduced-motion`).
- Preserve exactly: `aria-current` tokens (`page`/`location`), brand `aria-label` "Dzaki Yusfian — Home", dialog focus trap/Escape/body-scroll-lock, `data-testid="scroll-progress"`, href resolution helpers (`resolveNavHref`, `isPageLinkActive`, `isSectionLinkActive`).
- UI strings: EN/ID parity enforced by `tests/data/ui-strings.test.ts` (picks up new keys automatically). Aria-labels stay English (site convention).
- Test commands: `npx vitest run <file>` for a single file, `npm run test:run` for the suite, `npm run build` for the production build.
- Commit after every task. Never use `--no-verify`.

---

### Task 1: Foundations — token, strings, config flag

**Files:**
- Modify: `src/styles/globals.css` (add token to `@theme`, `:root`, `.dark`)
- Modify: `src/content/ui-strings.json` (add `navMenuLabel` to both langs)
- Modify: `src/config/navigation.ts` (add `isSecondary` to `NavItem`, set on Notes)
- Test: `tests/config/navigation.test.ts` (extend)

**Interfaces:**
- Consumes: existing `NavItem` interface, `pageLinks`, `navbarItems`.
- Produces: `NavItem.isSecondary?: boolean` (set `true` on the `/notes` item inside `navbarItems` only), Tailwind utility `bg-nav-underline`, UI string key `navMenuLabel` (EN "Menu" / ID "Menu").

- [ ] **Step 1: Write the failing test**

Append to `tests/config/navigation.test.ts` inside the existing top-level `describe`:

```ts
describe('navbarItems secondary flag', () => {
  it('marks the Notes item as secondary', () => {
    const notes = navbarItems.find((item) => item.href === '/notes')
    expect(notes?.isSecondary).toBe(true)
  })

  it('does not mark section links as secondary', () => {
    for (const item of navbarItems.filter((i) => i.href.startsWith('#'))) {
      expect(item.isSecondary).toBeUndefined()
    }
  })
})
```

(`navbarItems` is already imported in this file; if not, add it to the existing import from `@/config/navigation`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/config/navigation.test.ts`
Expected: FAIL — `expected undefined to be true` (isSecondary missing).

- [ ] **Step 3: Implement**

In `src/config/navigation.ts`:

```ts
export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
  isSecondary?: boolean
  key?: keyof UiStrings
}
```

and change the `navbarItems` export to:

```ts
export const navbarItems: NavItem[] = [
  ...sectionLinks,
  ...pageLinks
    .filter((item) => item.href === '/notes')
    .map((item) => ({ ...item, isSecondary: true })),
]
```

In `src/content/ui-strings.json`, add to the `en` object (after `navGroupSections`-area keys): `"navMenuLabel": "Menu",` and to the `id` object: `"navMenuLabel": "Menu",`.

In `src/styles/globals.css`:
1. Inside `@theme`, after the accent tokens: `--color-nav-underline: var(--nav-underline-hover);`
2. Inside `:root`, after `--border`: `--nav-underline-hover: #c9bda9;`
3. Inside `.dark`, after `--border`: `--nav-underline-hover: #3f4c5e;`

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/config/navigation.test.ts tests/data/ui-strings.test.ts`
Expected: PASS (parity test confirms the new key exists in both langs).

- [ ] **Step 5: Commit**

```bash
git add src/config/navigation.ts src/content/ui-strings.json src/styles/globals.css tests/config/navigation.test.ts
git commit -m "feat(nav): isSecondary flag, navMenuLabel string, nav-underline token"
```

---

### Task 2: `useCondensedNav` hook

**Files:**
- Create: `src/hooks/use-condensed-nav.ts`
- Test: `tests/hooks/use-condensed-nav.test.ts`

**Interfaces:**
- Consumes: nothing project-specific (window scroll only).
- Produces: `useCondensedNav(): boolean` — `true` once `window.scrollY > 88`, back to `false` only below `72` (hysteresis prevents flutter), initial value from `scrollY` at mount, passive listener, cleaned up on unmount.

- [ ] **Step 1: Write the failing test**

Create `tests/hooks/use-condensed-nav.test.ts`:

```ts
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useCondensedNav } from '@/hooks/use-condensed-nav'

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('useCondensedNav', () => {
  afterEach(() => {
    cleanup()
    scrollTo(0)
  })

  it('starts expanded at the top of the page', () => {
    scrollTo(0)
    const { result } = renderHook(() => useCondensedNav())
    expect(result.current).toBe(false)
  })

  it('condenses after scrolling past 88px', () => {
    const { result } = renderHook(() => useCondensedNav())
    act(() => scrollTo(120))
    expect(result.current).toBe(true)
  })

  it('stays condensed inside the hysteresis band (72-88px)', () => {
    const { result } = renderHook(() => useCondensedNav())
    act(() => scrollTo(120))
    act(() => scrollTo(80))
    expect(result.current).toBe(true)
  })

  it('expands again below 72px', () => {
    const { result } = renderHook(() => useCondensedNav())
    act(() => scrollTo(120))
    act(() => scrollTo(40))
    expect(result.current).toBe(false)
  })

  it('is condensed immediately when mounted mid-page', () => {
    scrollTo(300)
    const { result } = renderHook(() => useCondensedNav())
    expect(result.current).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/hooks/use-condensed-nav.test.ts`
Expected: FAIL — cannot resolve `@/hooks/use-condensed-nav`.

- [ ] **Step 3: Implement**

Create `src/hooks/use-condensed-nav.ts`:

```ts
'use client'

import { useEffect, useState } from 'react'

const CONDENSE_AT = 88
const EXPAND_AT = 72

export function useCondensedNav(): boolean {
  const [condensed, setCondensed] = useState(
    () => typeof window !== 'undefined' && window.scrollY > CONDENSE_AT
  )

  useEffect(() => {
    const onScroll = () => {
      setCondensed((prev) => {
        if (!prev && window.scrollY > CONDENSE_AT) return true
        if (prev && window.scrollY < EXPAND_AT) return false
        return prev
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return condensed
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/hooks/use-condensed-nav.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-condensed-nav.ts tests/hooks/use-condensed-nav.test.ts
git commit -m "feat(nav): useCondensedNav hook with scroll hysteresis"
```

---

### Task 3: LanguageToggle — quiet editorial restyle

**Files:**
- Modify: `src/components/ui/language-toggle.tsx`
- Test: `tests/components/ui/language-toggle.test.tsx` (extend/update)

**Interfaces:**
- Consumes: `useLanguage()` (unchanged).
- Produces: same component API (no props). Visual contract: no bordered box; active language `text-accent font-semibold underline underline-offset-4`; inactive `text-subtle hover:text-foreground`; a literal `/` separator span with `aria-hidden="true"`; buttons keep `min-h-11` targets, `aria-pressed`, and existing aria-labels.

- [ ] **Step 1: Write the failing test**

Append to the existing describe in `tests/components/ui/language-toggle.test.tsx` (reuse its render helper/providers as the file already does):

```tsx
it('renders as quiet text without a bordered box', () => {
  const { container } = renderToggle() // use the file's existing render pattern
  const group = container.querySelector('[role="group"]')
  expect(group?.className).not.toContain('border')
})

it('underlines the active language', () => {
  renderToggle()
  const active = screen.getByRole('button', { name: /switch to english/i })
  expect(active.className).toContain('underline')
})

it('separates languages with a decorative slash', () => {
  const { container } = renderToggle()
  const slash = container.querySelector('[aria-hidden="true"]')
  expect(slash?.textContent).toBe('/')
})
```

If the file has no shared `renderToggle` helper, render `<LanguageProvider><LanguageToggle /></LanguageProvider>` directly, matching the file's existing style.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/ui/language-toggle.test.tsx`
Expected: FAIL — group has `border border-border`; no underline; no slash element.

- [ ] **Step 3: Implement**

Replace the returned JSX in `src/components/ui/language-toggle.tsx`:

```tsx
return (
  <div
    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider"
    role="group"
    aria-label="Language"
  >
    {OPTIONS.map((opt, i) => (
      <span key={opt.value} className="inline-flex items-center gap-1">
        {i > 0 && (
          <span aria-hidden="true" className="text-subtle">
            /
          </span>
        )}
        <button
          onClick={() => setLang(opt.value)}
          aria-pressed={lang === opt.value}
          aria-label={opt.aria}
          className={cn(
            'inline-flex min-h-11 min-w-9 items-center justify-center px-1.5 transition-colors',
            lang === opt.value
              ? 'text-accent font-semibold underline underline-offset-4'
              : 'text-subtle hover:text-foreground'
          )}
        >
          {opt.label}
        </button>
      </span>
    ))}
  </div>
)
```

- [ ] **Step 4: Run test and fix any existing assertions**

Run: `npx vitest run tests/components/ui/language-toggle.test.tsx`
Expected: new tests PASS. If pre-existing tests assert the old bordered classes, update those assertions to the new contract (quiet text, underline active). Behavior tests (switching language, aria-pressed) must pass unmodified.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/language-toggle.tsx tests/components/ui/language-toggle.test.tsx
git commit -m "feat(nav): restyle language toggle as quiet editorial text"
```

---

### Task 4: NavLinks — mono small-caps + one underline system + secondary slot

**Files:**
- Modify: `src/components/navigation/nav-links.tsx`
- Test: `tests/components/navigation/nav-links.test.tsx`

**Interfaces:**
- Consumes: `NavItem` (now with `isSecondary`), `resolveNavHref`, `isPageLinkActive`, `isSectionLinkActive`, framer-motion.
- Produces: `NavLinks({ items, activeSection, pathname, condensed })` — new optional `condensed?: boolean` prop (default `false`) that only tightens gap/type. Rendering contract used by Navbar (Task 5): root element is a `<nav aria-label="Primary">` with NO responsive visibility classes (the parent decides visibility); items with `isSecondary` get `ml-auto` and a gold `↗` glyph `<span aria-hidden="true" className="text-highlight">↗</span>`; hover underline span has `data-testid="hover-underline"`; active indicator keeps `data-testid="active-indicator"`.

- [ ] **Step 1: Rewrite the test file**

Replace the styling-related tests in `tests/components/navigation/nav-links.test.tsx`. Keep the existing framer-motion mock and href/aria tests exactly as they are (they must keep passing), and swap the two underline styling tests (`renders an underline indicator…`, `applies the underline draw-on class…`) plus add new ones:

```tsx
const editorialItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Notes', href: '/notes', isSecondary: true },
]

it('renders an underline indicator for the active link', () => {
  const { container } = render(<NavLinks items={mockItems} activeSection="about" />)
  const indicator = container.querySelector('[data-testid="active-indicator"]')
  expect(indicator).toBeInTheDocument()
  expect(indicator?.className).toContain('inset-x-0')
})

it('no longer uses the legacy link-underline class', () => {
  render(<NavLinks items={mockItems} />)
  const aboutLink = screen.getByText('About').closest('a')
  expect(aboutLink?.className).not.toContain('link-underline')
})

it('renders a hover underline element on every link', () => {
  const { container } = render(<NavLinks items={mockItems} />)
  const hovers = container.querySelectorAll('[data-testid="hover-underline"]')
  expect(hovers).toHaveLength(mockItems.length)
})

it('uses mono small-caps typography', () => {
  const { container } = render(<NavLinks items={mockItems} />)
  const nav = container.querySelector('nav')
  expect(nav?.className).toContain('font-mono')
  expect(nav?.className).toContain('uppercase')
})

it('pushes secondary items to the end with a gold glyph', () => {
  render(<NavLinks items={editorialItems} />)
  const notesLink = screen.getByText('Notes').closest('a')
  expect(notesLink?.className).toContain('ml-auto')
  const glyph = notesLink?.querySelector('[aria-hidden="true"]')
  expect(glyph?.textContent).toBe('↗')
})
```

Note: existing tests that call `screen.getByText('About')` and assert on `.className` of the text node's element — the link classes now live on the `<a>`; where an old assertion checked `aboutLink.className` from `getByText`, update it to `screen.getByText('About').closest('a')`. Active color assertions (`text-accent`) stay valid.

- [ ] **Step 2: Run test to verify new assertions fail**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: FAIL on the new/updated styling tests; href/aria tests still pass.

- [ ] **Step 3: Implement**

Replace `src/components/navigation/nav-links.tsx` content:

```tsx
'use client'

import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import {
  resolveNavHref,
  isPageLinkActive,
  isSectionLinkActive,
} from '@/config/navigation'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
  pathname?: string
  condensed?: boolean
}

export function NavLinks({
  items,
  activeSection,
  pathname = '/',
  condensed = false,
}: NavLinksProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex w-full items-center font-mono uppercase',
        condensed
          ? 'gap-4 text-[10.5px] tracking-[0.13em]'
          : 'gap-6 text-[11px] tracking-[0.14em]'
      )}
    >
      {items.map((item) => {
        const isSectionActive = isSectionLinkActive(item.href, pathname, activeSection)
        const isPageActive = isPageLinkActive(item.href, pathname)
        const isActive = isSectionActive || isPageActive
        return (
          <a
            key={item.href}
            href={resolveNavHref(item.href, pathname)}
            aria-current={isPageActive ? 'page' : isSectionActive ? 'location' : undefined}
            className={cn(
              'group relative inline-flex h-full min-h-[42px] items-center gap-1 transition-colors',
              'text-muted hover:text-foreground',
              isActive && 'text-accent font-medium',
              item.isSecondary && 'ml-auto'
            )}
          >
            {item.label}
            {item.isSecondary && (
              <span aria-hidden="true" className="text-highlight">
                ↗
              </span>
            )}
            <span
              data-testid="hover-underline"
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-nav-underline',
                'transition-transform duration-200 motion-reduce:transition-none',
                !isActive && 'group-hover:scale-x-100 group-focus-visible:scale-x-100'
              )}
            />
            <AnimatePresence>
              {isActive && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="nav-underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
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

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/nav-links.tsx tests/components/navigation/nav-links.test.tsx
git commit -m "feat(nav): editorial nav links — one underline system, secondary slot"
```

---

### Task 5: Navbar — two-tier masthead with condensed state

**Files:**
- Modify: `src/components/layout/navbar.tsx`
- Modify: `src/components/navigation/mobile-menu.tsx` (hamburger glyph only)
- Test: `tests/components/layout/navbar.test.tsx`
- Test: `tests/components/layout/navbar-scrolled.test.tsx` (repurpose as condensed-state test)

**Interfaces:**
- Consumes: `useCondensedNav` (Task 2), `NavLinks` with `condensed` prop (Task 4), restyled `LanguageToggle` (Task 3), `useScrollSpy`, `useScrollProgress`, `useReducedMotion`, `navbarItems`, `getUiStrings`, `ThemeToggle`, `MobileMenu`, `withBasePath`.
- Produces: `<header data-condensed={condensed}>` full-width masthead. DOM contract relied on by tests: no `rounded` classes on the header; no search button; `data-testid="scroll-progress"` inside a `h-0.5` foreground rule at the header's bottom edge; CV link accessible name contains "Download CV".

- [ ] **Step 1: Update navbar.test.tsx**

In `tests/components/layout/navbar.test.tsx`: delete the `has floating pill styling with rounded corners` and `renders a search button for the command palette` tests; add:

```tsx
it('is a full-width masthead, not a floating pill', () => {
  const { container } = render(
    <LanguageProvider>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </LanguageProvider>
  )
  const header = container.querySelector('header')
  expect(header?.className).not.toMatch(/rounded/)
  expect(header?.className).toContain('inset-x-0')
})

it('does not render a search button in the header', () => {
  render(
    <LanguageProvider>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </LanguageProvider>
  )
  expect(screen.queryByRole('button', { name: /search and navigate/i })).toBeNull()
})

it('renders the ink rule with the scroll progress fill at the bottom edge', () => {
  const { container } = render(
    <LanguageProvider>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </LanguageProvider>
  )
  const progress = container.querySelector('[data-testid="scroll-progress"]')
  expect(progress?.parentElement?.className).toContain('bg-foreground')
})
```

Add `vi.mock('@/hooks/use-condensed-nav', () => ({ useCondensedNav: () => false }))` next to the other hook mocks. All other existing tests (brand, tagline, localized labels, single Research, Notes, CV, theme toggle, progress testid) stay as-is and must pass.

- [ ] **Step 2: Repurpose navbar-scrolled.test.tsx as the condensed-state test**

Replace the file's describe block (keep the framer/scroll-spy/pathname mocks; change the scroll-progress mock value to `0.2` as it is):

```tsx
vi.mock('@/hooks/use-condensed-nav', () => ({
  useCondensedNav: () => true,
}))

describe('Navbar (condensed state)', () => {
  afterEach(() => {
    cleanup()
  })

  it('marks the header as condensed', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(document.querySelector('header')?.dataset.condensed).toBe('true')
  })

  it('shortens the CV label to CV', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    const cv = document.querySelector('a[download]')
    expect(cv?.textContent?.trim()).toBe('CV')
  })

  it('hides the brand tagline when condensed', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    const { queryByText } = render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(queryByText('Accounting · Research')).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/components/layout/navbar.test.tsx tests/components/layout/navbar-scrolled.test.tsx`
Expected: FAIL — old markup still rendered.

- [ ] **Step 4: Implement the masthead**

Replace `src/components/layout/navbar.tsx` content:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, LayoutGroup } from 'framer-motion'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { useCondensedNav } from '@/hooks/use-condensed-nav'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useLanguage } from '@/hooks/use-language'
import { getUiStrings } from '@/data/content'
import { navbarItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { withBasePath } from '@/lib/base-path'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

function DownloadIcon() {
  return (
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
  )
}

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const condensed = useCondensedNav()
  const reducedMotion = useReducedMotion()
  const pathname = usePathname() ?? '/'
  const { lang } = useLanguage()
  const ui = getUiStrings(lang)
  const localizedItems = navbarItems.map((item) => ({
    ...item,
    label: item.key ? ui[item.key] : item.label,
  }))

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 32 }

  const navRow = (
    <NavLinks
      items={localizedItems}
      activeSection={activeSection}
      pathname={pathname}
      condensed={condensed}
    />
  )

  return (
    <header
      data-condensed={condensed}
      className="fixed inset-x-0 top-0 z-50 bg-background"
    >
      <LayoutGroup>
        <div className="mx-auto max-w-[1120px] px-5 md:px-7">
          {/* Tier 1 — identity row */}
          <div
            className={`flex items-center justify-between transition-[padding] duration-300 ${
              condensed ? 'py-1.5' : 'py-2.5 lg:py-3.5'
            }`}
          >
            <Link
              href="/"
              className="flex flex-col justify-center"
              aria-label="Dzaki Yusfian — Home"
            >
              <motion.span
                layout
                transition={spring}
                className={`font-display font-medium leading-tight text-foreground ${
                  condensed ? 'text-lg' : 'text-lg md:text-[23px]'
                }`}
              >
                Dzaki Yusfian<span className="text-accent">.</span>
              </motion.span>
              {!condensed && (
                <span
                  aria-hidden="true"
                  className="mt-0.5 hidden min-[360px]:block font-mono text-[10px] md:text-[10.5px] leading-none uppercase tracking-[0.18em] text-subtle"
                >
                  {ui.brandTagline}
                </span>
              )}
            </Link>

            {/* Condensed: links move inline between brand and utilities (lg+) */}
            {condensed && (
              <motion.div
                layoutId="masthead-nav"
                transition={spring}
                className="hidden lg:flex mx-8 flex-1"
              >
                {navRow}
              </motion.div>
            )}

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
              <div className="hidden md:block border-l border-border pl-3">
                <ThemeToggle />
              </div>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <a
                href={withBasePath('/files/cv/dzaki-cv.pdf')}
                download
                className="hidden md:inline-flex items-center gap-1.5 bg-foreground text-background px-3.5 py-2 rounded-[4px] text-[11px] font-mono uppercase tracking-[0.1em] font-medium hover:bg-accent transition-colors"
                aria-label="Download CV"
              >
                <DownloadIcon />
                {condensed ? 'CV' : ui.downloadCv}
              </a>
              <MobileMenu
                items={localizedItems}
                activeSection={activeSection}
                pathname={pathname}
              />
            </div>
          </div>

          {/* Hairline + Tier 2 — navigation row (expanded, lg+) */}
          {!condensed && (
            <>
              <div className="hidden lg:block border-b border-border" />
              <motion.div
                layoutId="masthead-nav"
                transition={spring}
                className="hidden lg:flex h-[42px] items-stretch"
              >
                {navRow}
              </motion.div>
            </>
          )}
        </div>

        {/* Bottom ink rule + scroll progress */}
        <div className="relative h-0.5 bg-foreground">
          <div
            data-testid="scroll-progress"
            className="absolute left-0 top-0 h-full bg-accent"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </LayoutGroup>
    </header>
  )
}
```

Also update `src/components/navigation/mobile-menu.tsx` hamburger wrapper: change `<div className="lg:hidden">` to stay as-is (drawer trigger hidden on lg+ — unchanged), and change the hamburger SVG paths to the asymmetric editorial glyph:

```tsx
<path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
```

(closed state only; the open-state X path stays).

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run tests/components/layout/navbar.test.tsx tests/components/layout/navbar-scrolled.test.tsx tests/components/navigation/nav-links.test.tsx`
Expected: PASS. Note: `renders navigation links` uses `getAllByText` patterns that tolerate the single `navRow` instance; the localized-labels test must still pass (labels flow through unchanged).

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/navbar.tsx src/components/navigation/mobile-menu.tsx tests/components/layout/navbar.test.tsx tests/components/layout/navbar-scrolled.test.tsx
git commit -m "feat(nav): two-tier journal masthead with condensed scroll state"
```

---

### Task 6: MobileMenu — editorial drawer re-skin

**Files:**
- Modify: `src/components/navigation/mobile-menu.tsx`
- Test: `tests/components/navigation/mobile-menu.test.tsx`

**Interfaces:**
- Consumes: `ui.navMenuLabel` (Task 1), existing group strings, `useReducedMotion`, portal/focus-trap machinery (all unchanged).
- Produces: same `MobileMenu` API. Visual contract: panel `bg-background border-l-2 border-foreground`; header row inside panel with mono `navMenuLabel` text and a close button (`aria-label="Close menu"`); group labels rendered as `01 — {ui.navGroupSections}` / `02 — {ui.navGroupPages}` in `text-subtle` mono with a hairline underneath (gold is NOT used for label text — a11y override of the spec mockup, gold appears only on the Notes `↗` glyph); links `font-display text-[22px]`; CV button and language toggle unchanged in place.

- [ ] **Step 1: Update the test file**

In `tests/components/navigation/mobile-menu.test.tsx`, update the grouping test and add new ones (LanguageProvider wrapper as the file already uses):

```tsx
it('groups links under numbered Sections and Pages labels', async () => {
  const user = userEvent.setup()
  render(
    <LanguageProvider>
      <MobileMenu items={mockItemsWithPage} />
    </LanguageProvider>
  )
  await user.click(screen.getByRole('button', { name: /open menu/i }))
  expect(screen.getByText(/01 — Sections/)).toBeInTheDocument()
  expect(screen.getByText(/02 — Pages/)).toBeInTheDocument()
})

it('shows the Menu microlabel and a close button inside the panel', async () => {
  const user = userEvent.setup()
  render(
    <LanguageProvider>
      <MobileMenu items={mockItems} />
    </LanguageProvider>
  )
  await user.click(screen.getByRole('button', { name: /open menu/i }))
  expect(screen.getByText('Menu')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
})

it('renders drawer links in the display serif at editorial size', async () => {
  const user = userEvent.setup()
  render(
    <LanguageProvider>
      <MobileMenu items={mockItems} />
    </LanguageProvider>
  )
  await user.click(screen.getByRole('button', { name: /open menu/i }))
  const about = screen.getByText('About')
  expect(about.className).toContain('font-display')
})

it('marks secondary items with the gold glyph', async () => {
  const user = userEvent.setup()
  render(
    <LanguageProvider>
      <MobileMenu items={[...mockItems, { label: 'Notes', href: '/notes', isSecondary: true }]} />
    </LanguageProvider>
  )
  await user.click(screen.getByRole('button', { name: /open menu/i }))
  const notes = screen.getByText('Notes').closest('a')
  expect(notes?.querySelector('[aria-hidden="true"]')?.textContent).toBe('↗')
})
```

The old `groups links under Sections and Pages labels` test is replaced by the numbered version above (exact-text `getByText('Sections')` would fail).

- [ ] **Step 2: Run test to verify new assertions fail**

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx`
Expected: FAIL on the four new/updated tests; behavior tests still pass.

- [ ] **Step 3: Implement the re-skin**

In `src/components/navigation/mobile-menu.tsx`:

1. `renderGroup` signature gains a number prefix: `renderGroup(number: string, label: string, labelId: string, groupItems: NavItem[], baseIndex: number)`. Label markup becomes:

```tsx
<p
  id={labelId}
  className="mb-2 border-b border-border pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle"
>
  {number} — {label}
</p>
```

2. Link markup inside `renderGroup` becomes serif editorial (behavior identical):

```tsx
<a
  href={resolveNavHref(item.href, pathname)}
  onClick={close}
  aria-current={isPage ? 'page' : isSection ? 'location' : undefined}
  className={cn(
    'flex min-h-11 items-center gap-2 py-1.5 font-display text-[22px] transition-colors',
    'text-muted hover:text-foreground',
    (isSection || isPage) && 'text-accent'
  )}
>
  {item.label}
  {item.isSecondary && (
    <span aria-hidden="true" className="text-highlight text-base">
      ↗
    </span>
  )}
</a>
```

3. Panel: change the `motion.div` panel className to
   `"fixed inset-y-0 right-0 w-72 sm:w-80 overflow-y-auto bg-background border-l-2 border-foreground z-50 p-6 focus:outline-none"`.

4. Panel header (replaces the bare `mt-12` spacing): first child inside the panel:

```tsx
<div className="flex items-center justify-between">
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
    {ui.navMenuLabel}
  </p>
  <button
    onClick={close}
    className="p-2.5 -mr-2.5 text-muted hover:text-foreground transition-colors"
    aria-label="Close menu"
  >
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>
```

   and the groups container becomes `className="flex flex-col gap-8 mt-8"`.

5. Group calls: `renderGroup('01', ui.navGroupSections, 'mobile-nav-sections', sections, 0)` and `renderGroup('02', ui.navGroupPages, 'mobile-nav-pages', pages, sections.length)`.

6. CV button: change `rounded-md` to `rounded-[4px]` (matches bar CTA).

Focus note: the panel-open focus target stays `panelRef.current?.focus()` — the new close button is simply the first focusable, which the existing Tab trap already handles.

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx`
Expected: PASS (all, including pre-existing focus-trap/Escape/CV tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/mobile-menu.tsx tests/components/navigation/mobile-menu.test.tsx
git commit -m "feat(nav): editorial drawer — ink edge, numbered labels, serif links"
```

---

### Task 7: Layout offsets for the taller masthead

**Files:**
- Modify: `src/app/layout.tsx:61` (main padding)
- Modify: `src/components/layout/section-wrapper.tsx` (scroll margin)
- Test: `tests/components/layout/section-wrapper.test.tsx` (extend)

**Interfaces:**
- Consumes: nothing new.
- Produces: `<main className="pt-24 lg:pt-36">` (expanded masthead ≈109px on lg; 96px still clears the ~58px mobile bar); sections get `scroll-mt-20` (80px — clears the 54px condensed header that is active during any mid-page anchor jump).

- [ ] **Step 1: Write the failing test**

Append to `tests/components/layout/section-wrapper.test.tsx` (match the file's existing render style):

```tsx
it('offsets anchor scroll below the fixed masthead', () => {
  const { container } = render(
    <SectionWrapper id="research">
      <p>content</p>
    </SectionWrapper>
  )
  const section = container.querySelector('section')
  expect(section?.className).toContain('scroll-mt-20')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/layout/section-wrapper.test.tsx`
Expected: FAIL — class absent.

- [ ] **Step 3: Implement**

`src/components/layout/section-wrapper.tsx`: change the section className to
`cn('py-20 px-4 scroll-mt-20', className)`.

`src/app/layout.tsx`: change `<main id="main-content" className="pt-24">` to
`<main id="main-content" className="pt-24 lg:pt-36">`.

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/components/layout/section-wrapper.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/layout/section-wrapper.tsx tests/components/layout/section-wrapper.test.tsx
git commit -m "feat(nav): layout offsets for the taller masthead"
```

---

### Task 8: Full verification

**Files:**
- No new files; fixes only if the suite or build surfaces regressions.

**Interfaces:**
- Consumes: everything above.
- Produces: green suite + production build.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test:run`
Expected: PASS. Likely touch-points if anything fails: `tests/app/page.test.tsx` or section tests that render inside providers and incidentally assert nav markup; fix assertions to the new contract (never weaken behavior tests).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: clean static export build, no type errors.

- [ ] **Step 3: Visual smoke check (dev server)**

Run: `npm run dev` and verify at 1440px, 1024px, 768px, 375px: expanded masthead, condensed state after scrolling, one underline system on hover vs active, drawer skin, dark theme (toggle), reduced motion (OS setting or devtools emulation), anchor click from mid-page lands below the condensed header.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "test(nav): align remaining suites with journal masthead"
```

(Skip if nothing changed.)
