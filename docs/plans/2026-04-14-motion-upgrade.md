# Motion Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visible, professional motion (flowing-waves background, custom cursor with particle tail, animated skills filter, hover/transition polish) on top of the shipped Research Journal redesign.

**Architecture:** Two new canvas-rendered motion components mounted in `layout.tsx`, a new filter component inside SkillsSection, and tuning passes on Card/Button/Navbar/ScrollReveal. All motion respects `prefers-reduced-motion` and touch-device fallbacks.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind 4, Framer Motion, HTML Canvas 2D, Vitest + React Testing Library.

**Spec:** `docs/specs/2026-04-14-motion-upgrade-design.md`

**Baseline:** worktree `feature/motion-upgrade` at `.worktrees/motion-upgrade/`, 170/170 tests passing, build clean.

---

## Task 1 — Add `useIsTouch` hook

**Description:** Detect touch devices via `matchMedia('(pointer: coarse)')`. Used by CustomCursor to disable itself on touch.
**Files:** Create `src/hooks/use-is-touch.ts`, create `tests/hooks/use-is-touch.test.ts`
**Dependencies:** None
**Test (RED):**
```ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsTouch } from '@/hooks/use-is-touch'

describe('useIsTouch', () => {
  it('returns true when pointer is coarse', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({
      matches: q === '(pointer: coarse)',
      media: q, onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    } as any))
    const { result } = renderHook(() => useIsTouch())
    expect(result.current).toBe(true)
  })
  it('returns false when pointer is fine', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({
      matches: false, media: q, onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    } as any))
    const { result } = renderHook(() => useIsTouch())
    expect(result.current).toBe(false)
  })
})
```
**Implementation (GREEN):**
```ts
'use client'
import { useEffect, useState } from 'react'

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const onChange = () => setIsTouch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isTouch
}
```
**Verification:** `npm run test:run -- tests/hooks/use-is-touch.test.ts` → 2/2 pass.
**Commit:** `feat(hooks): add useIsTouch for pointer:coarse detection`

---

## Task 2 — Add `useViewportVisible` hook

**Description:** IntersectionObserver wrapper returning whether a ref is in viewport. Used by WaveBackground to pause rAF when hero is off-screen.
**Files:** Create `src/hooks/use-viewport-visible.ts`, create `tests/hooks/use-viewport-visible.test.ts`
**Dependencies:** None
**Test (RED):**
```ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import { useViewportVisible } from '@/hooks/use-viewport-visible'

describe('useViewportVisible', () => {
  it('returns false by default', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useViewportVisible(ref)
    })
    expect(result.current).toBe(false)
  })
  it('flips to true when observer reports isIntersecting', () => {
    let observerCb: IntersectionObserverCallback = () => {}
    ;(global as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) { observerCb = cb }
      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
    }
    const el = document.createElement('div')
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el)
      return useViewportVisible(ref)
    })
    act(() => {
      observerCb([{ isIntersecting: true } as any], {} as any)
    })
    expect(result.current).toBe(true)
  })
})
```
**Implementation (GREEN):**
```ts
'use client'
import { useEffect, useState, type RefObject } from 'react'

export function useViewportVisible(
  ref: RefObject<Element | null>,
  rootMargin = '0px'
): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? false),
      { rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, rootMargin])
  return visible
}
```
**Verification:** `npm run test:run -- tests/hooks/use-viewport-visible.test.ts` → 2/2 pass.
**Commit:** `feat(hooks): add useViewportVisible IntersectionObserver wrapper`

---

## Task 3 — Add `.custom-cursor-active` utility to globals.css

**Description:** When body has this class, hide the native cursor. Used by CustomCursor.
**Files:** Modify `src/styles/globals.css`
**Dependencies:** None
**Test (RED):** Visual only (CSS rule). No unit test. Smoke: after adding class to body, cursor disappears in dev server.
**Implementation (GREEN):** Append to `globals.css`:
```css
html.custom-cursor-active,
html.custom-cursor-active * {
  cursor: none !important;
}
```
**Verification:** `npm run build` remains clean; `npm run test:run` → 170/170.
**Commit:** `style: add .custom-cursor-active utility to hide native cursor`

---

## Task 4 — Create WaveBackground component (render + static)

**Description:** The canvas wave-renderer per spec 3.1. First pass: render 4 static wave paths (no animation). Animation added in Task 5.
**Files:** Create `src/components/motion/wave-background.tsx`, create `tests/components/motion/wave-background.test.tsx`
**Dependencies:** None (uses existing `useReducedMotion`)
**Test (RED):**
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { WaveBackground } from '@/components/motion/wave-background'

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

describe('WaveBackground', () => {
  it('renders a canvas with data-testid', () => {
    const { container } = render(<WaveBackground />)
    const canvas = container.querySelector('[data-testid="wave-background"]')
    expect(canvas).toBeTruthy()
    expect(canvas?.tagName).toBe('CANVAS')
  })
  it('renders fixed-position canvas with pointer-events-none', () => {
    const { container } = render(<WaveBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas?.className).toMatch(/fixed/)
    expect(canvas?.className).toMatch(/pointer-events-none/)
  })
})
```
**Implementation (GREEN):**
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Static initial render (animation added in Task 5)
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      data-testid="wave-background"
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
```
**Verification:** `npm run test:run -- tests/components/motion/wave-background.test.tsx` → 2/2 pass.
**Commit:** `feat(motion): add WaveBackground canvas component (static scaffold)`

---

## Task 5 — Add wave animation loop to WaveBackground

**Description:** Implement the 5 motion behaviors from spec 3.1: drift, per-point sine, breathing, cursor attraction, drifting ticks. Pause rAF when reduced-motion or tab hidden.
**Files:** Modify `src/components/motion/wave-background.tsx`, extend `tests/components/motion/wave-background.test.tsx`
**Dependencies:** Task 4
**Test (RED):** Add to existing test file:
```tsx
it('does not start rAF when reduced-motion is true', async () => {
  vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }))
  const rafSpy = vi.spyOn(window, 'requestAnimationFrame')
  const { WaveBackground: WB } = await import('@/components/motion/wave-background')
  render(<WB />)
  expect(rafSpy).not.toHaveBeenCalled()
  vi.doUnmock('@/hooks/use-reduced-motion')
})
```
**Implementation (GREEN):** Replace the component body with the animation implementation matching the preview in `docs/visual-companion/motion/background-concepts-v3-waves.html` (4 wave layers, sin-based paths, cursor attraction via `mousemove` on window, 3 drifting ticks, cancel rAF on unmount, skip rAF when reduced-motion). Mobile reduces layers to 2 when `window.innerWidth < 768`.
**Verification:** `npm run test:run -- tests/components/motion/wave-background.test.tsx` → all pass. Manual: `npm run dev`, open `/`, see waves animate behind hero.
**Commit:** `feat(motion): add wave animation loop with drift, breathing, cursor attraction`

---

## Task 6 — Create CustomCursor component

**Description:** Canvas-rendered ring+dot+particle-tail cursor per spec 3.2. Disabled on touch and reduced-motion.
**Files:** Create `src/components/motion/custom-cursor.tsx`, create `tests/components/motion/custom-cursor.test.tsx`
**Dependencies:** Task 1 (useIsTouch), Task 3 (.custom-cursor-active class)
**Test (RED):**
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { CustomCursor } from '@/components/motion/custom-cursor'

vi.mock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => false }))
vi.mock('@/hooks/use-is-touch', () => ({ useIsTouch: () => false }))

describe('CustomCursor', () => {
  it('renders a canvas on non-touch non-reduced devices', () => {
    const { container } = render(<CustomCursor />)
    const canvas = container.querySelector('[data-testid="custom-cursor"]')
    expect(canvas).toBeTruthy()
  })
  it('renders nothing on touch devices', async () => {
    vi.doMock('@/hooks/use-is-touch', () => ({ useIsTouch: () => true }))
    const { CustomCursor: CC } = await import('@/components/motion/custom-cursor')
    const { container } = render(<CC />)
    expect(container.querySelector('[data-testid="custom-cursor"]')).toBeNull()
    vi.doUnmock('@/hooks/use-is-touch')
  })
  it('renders nothing when reduced-motion is set', async () => {
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }))
    const { CustomCursor: CC } = await import('@/components/motion/custom-cursor')
    const { container } = render(<CC />)
    expect(container.querySelector('[data-testid="custom-cursor"]')).toBeNull()
    vi.doUnmock('@/hooks/use-reduced-motion')
  })
})
```
**Implementation (GREEN):** Component returns `null` when `useIsTouch()` or `useReducedMotion()` is true. Otherwise renders a full-screen fixed canvas with z-index 9999, pointer-events-none. On mount: track mouse position via `mousemove`, record particles, draw on rAF. Draw ring (48px, 1.5px teal stroke) + center dot (6px teal fill) + up to ~15 fading particles (400ms lifespan). On interactive-element hover (detect via `document.elementFromPoint` or event delegation), swap to gold ring 72px + no center dot. Add `.custom-cursor-active` class to `<html>` on mount; remove on unmount. DPR-aware resize handler.
**Verification:** 3/3 tests pass. Manual: `npm run dev`, move mouse across hero, see ring+dot+trail; hover a button, see gold ring.
**Commit:** `feat(motion): add CustomCursor with particle-fade tail`

---

## Task 7 — Mount WaveBackground + CustomCursor in layout.tsx

**Description:** Import both components into the root layout so they render on every page.
**Files:** Modify `src/app/layout.tsx`
**Dependencies:** Tasks 4, 5, 6
**Test (RED):** Existing `tests/app/page.test.tsx` should still pass. No new test needed — the components mount at layout level and their own tests cover rendering.
**Implementation (GREEN):** Add imports and JSX inside `<ThemeProvider>`:
```tsx
import dynamic from 'next/dynamic'
const WaveBackground = dynamic(
  () => import('@/components/motion/wave-background').then((m) => ({ default: m.WaveBackground })),
  { ssr: false }
)
const CustomCursor = dynamic(
  () => import('@/components/motion/custom-cursor').then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
)
// inside <ThemeProvider>:
<WaveBackground />
<CustomCursor />
```
Place before `<Navbar />`.
**Verification:** `npm run test:run` → still 170+ passing. `npm run build` → clean. Manual: `npm run dev`, see waves and custom cursor on homepage.
**Commit:** `feat(layout): mount WaveBackground and CustomCursor client-side`

---

## Task 8 — Add filter state to SkillsSection + SkillPill filterContext prop

**Description:** SkillPill accepts `filterContext` prop. When set to something other than `'all'` or undefined, each pill computes its match state and applies dim or highlight styles.
**Files:** Modify `src/components/ui/skill-pill.tsx`, modify `tests/components/ui/skill-pill.test.tsx`, modify `src/components/sections/skills-section.tsx`, modify `tests/components/sections/skills-section.test.tsx`
**Dependencies:** None
**Test (RED):** Append to `skill-pill.test.tsx`:
```tsx
it('applies dim class when filterContext is set and does not match', () => {
  const { container } = render(<SkillPill name="Excel" context="daily" filterContext="applied" />)
  expect(container.firstChild).toHaveClass('opacity-[0.22]')
})
it('applies match class when filterContext matches', () => {
  const { container } = render(<SkillPill name="SAP" context="project" filterContext="project" />)
  expect(container.firstChild).toHaveClass('border-accent')
})
it('treats filterContext="none" as matching undefined context', () => {
  const { container } = render(<SkillPill name="Communication" filterContext="none" />)
  expect(container.firstChild).toHaveClass('border-accent')
})
it('default when filterContext="all"', () => {
  const { container } = render(<SkillPill name="Excel" context="daily" filterContext="all" />)
  expect(container.firstChild).not.toHaveClass('opacity-[0.22]')
  expect(container.firstChild).not.toHaveClass('border-accent')
})
```
**Implementation (GREEN):** Add `filterContext?: string` to props. Compute `matchState`:
- `filterContext === undefined || filterContext === 'all'` → `'default'`
- `filterContext === 'none'` → `context === undefined ? 'match' : 'dim'`
- else → `filterContext === context ? 'match' : 'dim'`

Apply classes via `cn()`:
- `'dim'` → `opacity-[0.22] scale-[0.96]`
- `'match'` → `border-accent bg-[#edf6f7]` (and `ctx` child gets `text-accent`)
- default no extra classes

Transition: add `transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]` always.

In SkillsSection: add `const [filter, setFilter] = useState<string>('all')` and pass `filterContext={filter}` to each `<SkillPill>`.

**Verification:** Pill tests pass. Full suite still green.
**Commit:** `feat(ui): add filterContext prop to SkillPill with dim/match states`

---

## Task 9 — Create SkillsFilter pill-row component

**Description:** Renders the filter pills above Skills columns. Derives counts from data. Controlled by parent state.
**Files:** Create `src/components/sections/skills-filter.tsx`, create `tests/components/sections/skills-filter.test.tsx`
**Dependencies:** None (but used by SkillsSection in Task 10)
**Test (RED):**
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsFilter } from '@/components/sections/skills-filter'

const categories = [
  { category: 'Technical', items: [{ name: 'X', context: 'applied' }, { name: 'Y', context: 'applied' }] },
  { category: 'Soft', items: [{ name: 'Z' }] },
]

describe('SkillsFilter', () => {
  it('renders All pill with total count', () => {
    render(<SkillsFilter categories={categories} active="all" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /all.*3/i })).toBeInTheDocument()
  })
  it('renders a pill for each distinct context + (no context)', () => {
    render(<SkillsFilter categories={categories} active="all" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /applied.*2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /no context.*1/i })).toBeInTheDocument()
  })
  it('sets aria-pressed="true" on the active pill', () => {
    render(<SkillsFilter categories={categories} active="applied" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /applied.*2/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /all.*3/i })).toHaveAttribute('aria-pressed', 'false')
  })
  it('calls onChange with the pill context when clicked', () => {
    const onChange = vi.fn()
    render(<SkillsFilter categories={categories} active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /applied.*2/i }))
    expect(onChange).toHaveBeenCalledWith('applied')
  })
})
```
**Implementation (GREEN):**
```tsx
'use client'
import type { SkillCategory } from '@/types/content'
import { cn } from '@/utils/cn'

interface Props {
  categories: SkillCategory[]
  active: string
  onChange: (ctx: string) => void
}

export function SkillsFilter({ categories, active, onChange }: Props) {
  const items = categories.flatMap((c) => c.items)
  const total = items.length
  const contextCounts = new Map<string, number>()
  let noContextCount = 0
  for (const it of items) {
    if (it.context) contextCounts.set(it.context, (contextCounts.get(it.context) ?? 0) + 1)
    else noContextCount += 1
  }
  const pills: Array<{ key: string; label: string; count: number }> = [
    { key: 'all', label: 'All', count: total },
    ...Array.from(contextCounts.entries()).map(([k, n]) => ({ key: k, label: k, count: n })),
  ]
  if (noContextCount > 0) pills.push({ key: 'none', label: '(no context)', count: noContextCount })

  return (
    <div className="flex flex-wrap gap-2 mb-6 pb-5 border-b border-border" role="group" aria-label="Filter skills by context">
      {pills.map((p) => {
        const isActive = p.key === active
        return (
          <button
            key={p.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(p.key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[12.5px] font-medium transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'bg-surface text-foreground border-border hover:border-accent'
            )}
          >
            {p.label}
            <span className={cn('font-mono text-[10px] font-normal', isActive ? 'text-background opacity-60' : 'text-subtle')}>
              {p.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```
**Verification:** 4/4 pass.
**Commit:** `feat(sections): add SkillsFilter pill-row component`

---

## Task 10 — Wire SkillsFilter into SkillsSection

**Description:** Mount `<SkillsFilter />` above the 3 category columns. Pass down the selected filter via `filterContext` prop on each `<SkillPill>` (already accepted per Task 8).
**Files:** Modify `src/components/sections/skills-section.tsx`, update `tests/components/sections/skills-section.test.tsx`
**Dependencies:** Tasks 8, 9
**Test (RED):** Append to skills-section test file:
```tsx
it('renders the filter pill row', () => {
  render(<SkillsSection />)
  expect(screen.getByRole('group', { name: /filter skills/i })).toBeInTheDocument()
})
it('dims non-matching skills when a filter pill is clicked', () => {
  render(<SkillsSection />)
  const applied = screen.getByRole('button', { name: /^applied/i })
  fireEvent.click(applied)
  const excel = screen.getByText('Microsoft Excel').closest('span')
  expect(excel).toHaveClass('opacity-[0.22]')
})
```
**Implementation (GREEN):** Convert SkillsSection to a client component if not already. Add state:
```tsx
'use client'
import { useState } from 'react'
import { SkillsFilter } from './skills-filter'
// ...
const [filter, setFilter] = useState('all')
```
Before the 3-column grid, render `<SkillsFilter categories={skills} active={filter} onChange={setFilter} />`. On each `<SkillPill>` spread: `filterContext={filter}`.
**Verification:** Tests pass. Manual: visit /, scroll to Skills, click "applied" — finance tags highlight, others dim.
**Commit:** `feat(sections): wire SkillsFilter into SkillsSection with state`

---

## Task 11 — Polish Card hover: add shadow lift

**Description:** Add soft teal shadow on card hover per spec 3.4.
**Files:** Modify `src/components/ui/card.tsx`, update `tests/components/ui/card.test.tsx`
**Dependencies:** None
**Test (RED):** Append:
```tsx
it('applies hover shadow class', () => {
  const { container } = render(<Card>x</Card>)
  expect(container.firstChild?.className).toMatch(/hover:shadow-\[0_8px_24px/)
})
```
**Implementation (GREEN):** Change the card `classes` string to include:
```
'hover:shadow-[0_8px_24px_-12px_rgba(13,79,92,0.12)]'
```
Append to the existing `cn(...)` args.
**Verification:** Card test passes. Full suite green.
**Commit:** `style(ui): add soft teal shadow on Card hover`

---

## Task 12 — Polish Button hover: scale 1.02 + primary bg darken

**Description:** Add hover scale and subtle bg darken on primary buttons per spec 3.4.
**Files:** Modify `src/components/ui/button.tsx`, update `tests/components/ui/button.test.tsx`
**Dependencies:** None
**Test (RED):** Append:
```tsx
it('applies hover scale class', () => {
  const { container } = render(<Button>go</Button>)
  expect(container.firstChild?.className).toMatch(/hover:scale-\[1\.02\]/)
})
```
**Implementation (GREEN):** In the button classes string, add `hover:scale-[1.02]` and for primary variant swap `hover:bg-accent` with `hover:bg-[#0a3d47]` (darker teal for primary bg).
**Verification:** Test passes. Full suite green.
**Commit:** `style(ui): add Button hover scale and primary bg darken`

---

## Task 13 — Polish Navbar: add shadow on scroll

**Description:** Per spec 3.4, add box-shadow when `hasScrolled`.
**Files:** Modify `src/components/layout/navbar.tsx`, update `tests/components/layout/navbar.test.tsx`
**Dependencies:** None
**Test (RED):** Navbar currently has `shadow-sm` always. Test that confirms a *larger* shadow class is present when scrolled is tricky because the test doesn't simulate scroll progress. Simpler: test that class `shadow-[0_4px_16px_-8px_rgba(15,20,25,0.15)]` is *conditionally* applied. We'll just assert the enhanced class is present in the JSX string via component rendering when hasScrolled=true. Given the test uses `useScrollProgress()` internally, inject a mock:
```tsx
vi.mock('@/hooks/use-scroll-progress', () => ({ useScrollProgress: () => 0.2 }))
```
Then assert the header element has the enhanced shadow class.
**Implementation (GREEN):** Change the conditional className in navbar from `'bg-background/85 shadow-md'` to `'bg-background/85 shadow-[0_4px_16px_-8px_rgba(15,20,25,0.15)]'`.
**Verification:** Navbar test passes. Full suite green.
**Commit:** `style(nav): add scroll-depth shadow on Navbar`

---

## Task 14 — Tune ScrollReveal timing

**Description:** Per spec 3.4: duration 400→500ms, y 24→16, ease tuned.
**Files:** Modify `src/components/motion/scroll-reveal.tsx`, update `tests/components/motion/scroll-reveal.test.tsx`
**Dependencies:** None
**Test (RED):** Existing tests check variants exist; add:
```tsx
it('uses 16px translate and 500ms duration', async () => {
  // Read source to confirm
  const src = await (await fetch('/src/components/motion/scroll-reveal.tsx')).text().catch(() => '')
  // fallback: just assert behavior via rendered DOM — opacity initial 0
})
```
This is tricky to test via DOM since motion values are internal to framer. **Pragmatic approach:** keep the existing component tests as-is (they test rendering/reveal behavior), and adjust only the tuning values. Tests remain green; no new test — the tuning is a refinement of behavior already covered.
**Implementation (GREEN):** Update the variants in scroll-reveal:
```ts
const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
```
If a `direction` prop exists, keep its logic but apply the new duration.
**Verification:** `npm run test:run -- tests/components/motion/scroll-reveal.test.tsx` → passes.
**Commit:** `style(motion): tune ScrollReveal to 500ms/16px with cubic-bezier ease`

---

## Task 15 — Tune StaggerChildren default delay

**Description:** Per spec 3.4: default `staggerChildren: 0.06s`.
**Files:** Modify `src/components/motion/stagger-children.tsx`, update tests if needed
**Dependencies:** None
**Test (RED):** Skip RED — this is a default-value tune. Existing tests pass.
**Implementation (GREEN):** In the component, change the `staggerDelay` default from whatever it is to `0.06`. Also apply in the variants.
**Verification:** `npm run test:run` → green.
**Commit:** `style(motion): set StaggerChildren default delay to 0.06s`

---

## Task 16 — Final QA: full suite + build + lint + live smoke

**Description:** Verify the whole motion upgrade locally before merging.
**Files:** None (verification only)
**Dependencies:** Tasks 1-15
**Test (RED):** N/A
**Implementation (GREEN):**
```bash
cd .worktrees/motion-upgrade
npm run test:run    # expect all pass
npm run build       # expect clean
npm run lint        # expect only pre-existing warnings
```
Manual smoke (note for human reviewer): open `npm run dev` → verify waves animate, cursor ring+dot+trail works, filter pills work, card hover has shadow, button hover has scale, navbar shadow grows on scroll.
**Verification:** all three commands exit 0.
**Commit:** N/A (no code change)

---

## Parallel Execution Map

**Parallel Group 1** (all independent — no shared file deps): Tasks 1, 2, 3, 4, 9, 11, 12, 14, 15
**Sequential after Group 1:**
- Task 5 depends on Task 4 (same file)
- Task 6 depends on Tasks 1 and 3
- Task 8 modifies skill-pill.tsx and skills-section.tsx — can go in Group 1 or later, but Task 10 depends on it

**Parallel Group 2** (after Group 1): Tasks 5, 6, 8
**Sequential after Group 2:**
- Task 7 depends on Tasks 4/5/6 (mounts WB+CC)
- Task 10 depends on Tasks 8/9 (wires filter)
- Task 13 depends on nothing conflicting

**Parallel Group 3** (after Group 2): Tasks 7, 10, 13
**Sequential terminal:** Task 16 (QA) depends on all prior tasks.

Reality check: because subagents running in parallel can't share a checkout, and because we're one git worktree, all tasks execute **serially** regardless of independence. The parallel map above is informational only — the actual dispatch is sequential.

---

## Done-definition check (covered by spec section 13)

All 13 spec criteria map to tasks above. Final confirmation in Task 16.
