# Phase 4 / Plan 1 — Motion & Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement spec stages 1–6 (C2, C1-baseline, A5, A8, A3, A6, A1, A2, A7, A4): docs/baseline, micro-interactions, cinematic dark mode, hero intro sequence, scroll-driven timeline + waves, and route transitions.

**Architecture:** All motion builds on the existing Framer Motion + hooks stack (`useReducedMotion`, `useIsTouch`). New primitives are one hook (`useCountUp`, `useMagnetic`) or one component (`StatsStrip`, `TimelineWithSpine`) per file. No new dependencies. Content stays data-driven through `src/data/content.ts`.

**Tech Stack:** Next.js 15 (App Router, `output: 'export'`), React 19, TypeScript 5, Tailwind CSS 4 (CSS-first tokens in `src/styles/globals.css`), Framer Motion 12, Vitest 4 + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-06-phase4-full-upgrade-design.md`

## Global Constraints

- **No new runtime dependencies.** Everything uses framer-motion, existing hooks, and hand-written code.
- **Every animated feature MUST respect reduced motion** via the existing `useReducedMotion()` hook (`src/hooks/use-reduced-motion.ts`, returns `boolean`) or the `(prefers-reduced-motion: reduce)` media query in CSS.
- **Shared easing:** `cubic-bezier(0.22, 1, 0.36, 1)` — in Framer Motion written as `[0.22, 1, 0.36, 1]`.
- **Opacity + transform only** for transitions — never `filter: blur()` (project performance rule).
- **Pointer-only effects** (magnetic) must disable on touch via `useIsTouch()` (`src/hooks/use-is-touch.ts`, returns `boolean`).
- **Static export must keep working:** `npm run build` green after every task; never hardcode `/Proffesional_Portfolio` (use `withBasePath()` from `src/lib/base-path.ts` for internal URLs).
- **Full test suite green before every commit:** `npm run test:run` (48 files / 195 tests at start; grows with this plan).
- **Test mocking convention:** component tests mock framer-motion exactly like `tests/components/navigation/nav-links.test.tsx` does (strip motion props, render plain elements).
- Windows environment: run commands in PowerShell; paths in commands use forward slashes (git bash-style works in both).

---

### Task 1: README correction + changelog entry (C2)

**Files:**
- Modify: `README.md` (test-count lines and Testing section)

**Interfaces:**
- Consumes: nothing
- Produces: nothing (docs only)

- [ ] **Step 1: Fix test counts and add changelog entry**

In `README.md`:
1. Replace the line `tests/                # 170 tests across 39+ test files (mirrors src/ structure)` with `tests/                # 195+ tests across 48+ test files (mirrors src/ structure)`
2. In the `## 🧪 Testing` section replace `- **170 tests** across **39+ test files**` with `- **195+ tests** across **48+ test files**`
3. Under `## 📋 Changelog`, directly below the `## 📋 Changelog` heading, insert:

```markdown
### Maintenance (2026-08-06)

- Fixed stale test assertions in `nav-links.test.tsx` that still expected the removed `gold` class (commit `a04215e` mapped it to `text-accent` but missed the test); suite restored to green so CI deploys are unblocked
```

- [ ] **Step 2: Verify tests still pass (sanity)**

Run: `npm run test:run`
Expected: all files pass.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: correct test counts, add maintenance changelog entry"
```

---

### Task 2: Lighthouse baseline (C1)

**Files:**
- Create: `docs/superpowers/specs/2026-08-06-phase4-lighthouse.md`

**Interfaces:**
- Consumes: production build in `out/`
- Produces: baseline scores document that Plan 3 (Stage 10) appends final scores to.

- [ ] **Step 1: Build and serve the static export under its basePath**

The prod build prefixes everything with `/Proffesional_Portfolio`, so serve a directory that contains `out` under that name:

```powershell
npm run build
New-Item -ItemType Directory -Force scratch-lh | Out-Null
Copy-Item -Recurse -Force out scratch-lh/Proffesional_Portfolio
npx serve scratch-lh -l 3999
```

(leave the server running in background)

- [ ] **Step 2: Run Lighthouse against the homepage**

```powershell
npx lighthouse http://localhost:3999/Proffesional_Portfolio/ --quiet --chrome-flags="--headless" --output=json --output-path=scratch-lh/baseline.json
```

If `npx lighthouse` cannot run (no Chrome available), record that in the doc and use Chrome DevTools manually later — do not block the plan on this.

- [ ] **Step 3: Record scores**

Create `docs/superpowers/specs/2026-08-06-phase4-lighthouse.md`:

```markdown
# Phase 4 Lighthouse Comparison

## Baseline (before Phase 4, 2026-08-06)

| Category | Score |
|---|---|
| Performance | <score from baseline.json> |
| Accessibility | <score> |
| Best Practices | <score> |
| SEO | <score> |

Measured on `/` (static export served locally under basePath), headless Chrome, default Lighthouse desktop config.

## Final (after Phase 4)

_To be filled in Plan 3, Stage 10._
```

Fill in the real numbers from `scratch-lh/baseline.json` (`categories.*.score * 100`). Then stop the serve process and delete `scratch-lh/`.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-08-06-phase4-lighthouse.md
git commit -m "docs: record Lighthouse baseline before Phase 4"
```

---

### Task 3: Link underline draw-on (A5)

**Files:**
- Modify: `src/styles/globals.css` (append utility)
- Modify: `src/components/navigation/nav-links.tsx:22-26`
- Test: `tests/components/navigation/nav-links.test.tsx`

**Interfaces:**
- Consumes: existing `cn()` from `src/utils/cn.ts`
- Produces: global CSS class `link-underline` usable on any inline link.

- [ ] **Step 1: Write the failing test**

Add to `tests/components/navigation/nav-links.test.tsx` inside the existing `describe('NavLinks')`:

```tsx
it('applies the underline draw-on class to links', () => {
  render(<NavLinks items={mockItems} />)
  const aboutLink = screen.getByText('About')
  expect(aboutLink.className).toContain('link-underline')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: FAIL — className does not contain 'link-underline'.

- [ ] **Step 3: Add the CSS utility**

Append to `src/styles/globals.css`:

```css
/* A5 — link underline draw-on */
.link-underline {
  position: relative;
}
.link-underline::after {
  content: '';
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 4px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.link-underline:hover::after,
.link-underline:focus-visible::after {
  transform: scaleX(1);
}
@media (prefers-reduced-motion: reduce) {
  .link-underline::after {
    transition: none;
  }
}
```

(The `0.75rem` insets match the nav links' `px-3` padding so the line spans the label, not the padding.)

- [ ] **Step 4: Apply the class in NavLinks**

In `src/components/navigation/nav-links.tsx`, change the `cn(...)` call:

```tsx
className={cn(
  'relative px-3 py-2 text-sm font-medium rounded-md transition-colors link-underline',
  'text-muted hover:text-foreground',
  isActive && 'text-accent'
)}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 6: Full suite + commit**

```bash
npm run test:run
git add src/styles/globals.css src/components/navigation/nav-links.tsx tests/components/navigation/nav-links.test.tsx
git commit -m "feat(motion): add underline draw-on hover to nav links"
```

---

### Task 4: Stats count-up strip (A3)

**Files:**
- Create: `src/hooks/use-count-up.ts`
- Create: `src/components/sections/stats-strip.tsx`
- Modify: `src/data/content.ts` (add `getStats()`)
- Modify: `src/types/content.ts` (add `StatEntry`)
- Modify: `src/app/page.tsx` (render strip after Hero)
- Test: `tests/hooks/use-count-up.test.ts`, `tests/data/get-stats.test.ts`, `tests/components/sections/stats-strip.test.tsx`

**Interfaces:**
- Consumes: `getExperience()`, `getCertifications()`, `getResearchEntries()` from `src/data/content.ts`
- Produces:
  - `interface StatEntry { label: string; value: number; suffix?: string }` in `src/types/content.ts`
  - `getStats(): StatEntry[]` in `src/data/content.ts` (4 entries, values computed from real content — nothing invented)
  - `useCountUp(target: number, durationMs?: number): { value: number; ref: React.RefObject<HTMLSpanElement | null>; attach: (el: HTMLSpanElement | null) => void }` — consumers pass `attach` as the element `ref` callback
  - `<StatsStrip />` client component.

**Spec deviation (intentional):** the spec suggested a `stats.json` file with values like GPA; this plan instead computes all four values from existing content files (`experience.json`, `certifications.json`, `research/index.json`) so no number is ever invented or goes stale. A `stats.json` can be added later if Dzaki wants custom figures.

- [ ] **Step 1: Write failing test for getStats**

Create `tests/data/get-stats.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getStats, getCertifications, getExperience, getResearchEntries } from '@/data/content'

describe('getStats', () => {
  it('returns four stats derived from real content', () => {
    const stats = getStats()
    expect(stats).toHaveLength(4)
    const byLabel = Object.fromEntries(stats.map((s) => [s.label, s]))
    expect(byLabel['Certifications'].value).toBe(getCertifications().length)
    expect(byLabel['Positions held'].value).toBe(getExperience().length)
    expect(byLabel['Research works'].value).toBe(getResearchEntries().length)
    expect(byLabel['Years of experience'].value).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/data/get-stats.test.ts`
Expected: FAIL — `getStats` is not exported.

- [ ] **Step 3: Implement StatEntry + getStats**

Add to `src/types/content.ts`:

```ts
export interface StatEntry {
  label: string
  value: number
  suffix?: string
}
```

Add to `src/data/content.ts` (import `StatEntry` in the existing type import block):

```ts
export function getStats(): StatEntry[] {
  const experience = getExperience()
  const earliestYear = Math.min(
    ...experience.map((e) => new Date(e.startDate).getFullYear())
  )
  const years = Math.max(1, new Date().getFullYear() - earliestYear)
  return [
    { label: 'Years of experience', value: years, suffix: '+' },
    { label: 'Positions held', value: experience.length },
    { label: 'Certifications', value: getCertifications().length },
    { label: 'Research works', value: getResearchEntries().length },
  ]
}
```

Run: `npx vitest run tests/data/get-stats.test.ts` → PASS.

- [ ] **Step 4: Write failing test for useCountUp**

Create `tests/hooks/use-count-up.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// IntersectionObserver stub that fires "visible" immediately on observe
class IOStub {
  cb: IntersectionObserverCallback
  constructor(cb: IntersectionObserverCallback) { this.cb = cb }
  observe = () => this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  unobserve = vi.fn()
  disconnect = vi.fn()
}

describe('useCountUp', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IOStub as unknown as typeof IntersectionObserver)
  })

  it('starts at 0 before the element is attached', async () => {
    const { useCountUp } = await import('@/hooks/use-count-up')
    const { result } = renderHook(() => useCountUp(42))
    expect(result.current.value).toBe(0)
  })

  it('jumps straight to target under reduced motion once visible', async () => {
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }))
    vi.resetModules()
    const { useCountUp } = await import('@/hooks/use-count-up')
    const { result } = renderHook(() => useCountUp(42))
    const el = document.createElement('span')
    act(() => { result.current.ref.current = el; result.current.attach(el) })
    expect(result.current.value).toBe(42)
    vi.doUnmock('@/hooks/use-reduced-motion')
    vi.resetModules()
  })
})
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run tests/hooks/use-count-up.test.ts`
Expected: FAIL — module `@/hooks/use-count-up` does not exist.

- [ ] **Step 6: Implement useCountUp**

Create `src/hooks/use-count-up.ts`:

```ts
'use client'

import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3)

export function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const startedRef = useRef(false)
  const reduced = useReducedMotion()

  const attach = useCallback(
    (el: HTMLSpanElement | null) => {
      ref.current = el
      if (!el || startedRef.current) return
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting) || startedRef.current) return
        startedRef.current = true
        io.disconnect()
        if (reduced) {
          setValue(target)
          return
        }
        const t0 = performance.now()
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / durationMs)
          setValue(Math.round(EASE_OUT(p) * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, { threshold: 0.4 })
      io.observe(el)
    },
    [target, durationMs, reduced]
  )

  return { value, ref, attach }
}
```

Run: `npx vitest run tests/hooks/use-count-up.test.ts` → PASS.

- [ ] **Step 7: Write failing test for StatsStrip**

Create `tests/components/sections/stats-strip.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/hooks/use-count-up', () => ({
  useCountUp: (target: number) => ({ value: target, ref: { current: null }, attach: () => {} }),
}))

import { StatsStrip } from '@/components/sections/stats-strip'
import { getStats } from '@/data/content'

describe('StatsStrip', () => {
  afterEach(() => cleanup())

  it('renders one figure per stat with its label', () => {
    render(<StatsStrip />)
    for (const stat of getStats()) {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    }
  })

  it('renders numeric values (mocked to final)', () => {
    render(<StatsStrip />)
    const certs = getStats().find((s) => s.label === 'Certifications')!
    const matches = screen.getAllByText(new RegExp(`^${certs.value}`))
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] **Step 8: Run test to verify it fails**

Run: `npx vitest run tests/components/sections/stats-strip.test.tsx`
Expected: FAIL — module `@/components/sections/stats-strip` does not exist.

- [ ] **Step 9: Implement StatsStrip**

Create `src/components/sections/stats-strip.tsx`:

```tsx
'use client'

import { getStats } from '@/data/content'
import { useCountUp } from '@/hooks/use-count-up'

function StatFigure({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const { value: shown, attach } = useCountUp(value)
  return (
    <div className="flex flex-col items-center gap-1 py-2 text-center">
      <span ref={attach} className="font-display text-3xl font-medium text-accent md:text-4xl">
        {shown}
        {suffix ?? ''}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-widest text-subtle">{label}</span>
    </div>
  )
}

export function StatsStrip() {
  const stats = getStats()
  return (
    <section aria-label="Key figures" className="border-y border-border bg-surface-alt/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-6 py-6 md:grid-cols-4">
        {stats.map((s) => (
          <StatFigure key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 10: Mount on the homepage**

In `src/app/page.tsx` add the import and render between `HeroSection` and `ResearchSection`:

```tsx
import { StatsStrip } from '@/components/sections/stats-strip'
```

```tsx
<HeroSection />
<StatsStrip />
<ResearchSection />
```

(Static import, not `dynamic` — it is near the fold and tiny.)

- [ ] **Step 11: Verify all green + visual check + commit**

```bash
npx vitest run tests/components/sections/stats-strip.test.tsx tests/hooks/use-count-up.test.ts tests/data/get-stats.test.ts
npm run test:run
npm run build
git add src/hooks/use-count-up.ts src/components/sections/stats-strip.tsx src/data/content.ts src/types/content.ts src/app/page.tsx tests/hooks/use-count-up.test.ts tests/data/get-stats.test.ts tests/components/sections/stats-strip.test.tsx
git commit -m "feat(motion): add count-up stats strip below hero"
```

---

### Task 5: Magnetic buttons (A8)

**Files:**
- Create: `src/hooks/use-magnetic.ts`
- Modify: `src/components/ui/button.tsx`
- Test: `tests/hooks/use-magnetic.test.ts`

**Interfaces:**
- Consumes: `useReducedMotion()`, `useIsTouch()`
- Produces: `useMagnetic(maxOffset?: number): { x: MotionValue<number>; y: MotionValue<number>; onPointerMove: (e: React.PointerEvent<HTMLElement>) => void; onPointerLeave: () => void; enabled: boolean }`

- [ ] **Step 1: Write the failing test**

Create `tests/hooks/use-magnetic.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

describe('useMagnetic', () => {
  it('is enabled on fine pointers without reduced motion', async () => {
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => false }))
    vi.doMock('@/hooks/use-is-touch', () => ({ useIsTouch: () => false }))
    vi.resetModules()
    const { useMagnetic } = await import('@/hooks/use-magnetic')
    const { result } = renderHook(() => useMagnetic())
    expect(result.current.enabled).toBe(true)
    vi.doUnmock('@/hooks/use-reduced-motion')
    vi.doUnmock('@/hooks/use-is-touch')
    vi.resetModules()
  })

  it('is disabled on touch devices and offsets stay 0', async () => {
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => false }))
    vi.doMock('@/hooks/use-is-touch', () => ({ useIsTouch: () => true }))
    vi.resetModules()
    const { useMagnetic } = await import('@/hooks/use-magnetic')
    const { result } = renderHook(() => useMagnetic())
    expect(result.current.enabled).toBe(false)
    act(() => {
      result.current.onPointerMove({
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 40 }),
        },
        clientX: 90,
        clientY: 35,
      } as unknown as React.PointerEvent<HTMLElement>)
    })
    expect(result.current.x.get()).toBe(0)
    expect(result.current.y.get()).toBe(0)
    vi.doUnmock('@/hooks/use-reduced-motion')
    vi.doUnmock('@/hooks/use-is-touch')
    vi.resetModules()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/hooks/use-magnetic.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement useMagnetic**

Create `src/hooks/use-magnetic.ts`:

```ts
'use client'

import { useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useIsTouch } from '@/hooks/use-is-touch'

export function useMagnetic(maxOffset = 6) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 300, damping: 22 })
  const y = useSpring(rawY, { stiffness: 300, damping: 22 })
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()
  const enabled = !reduced && !isTouch

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width - 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5
      rawX.set(relX * 2 * maxOffset)
      rawY.set(relY * 2 * maxOffset)
    },
    [enabled, maxOffset, rawX, rawY]
  )

  const onPointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { x, y, onPointerMove, onPointerLeave, enabled }
}
```

Run: `npx vitest run tests/hooks/use-magnetic.test.ts` → PASS.

- [ ] **Step 4: Wire into Button**

In `src/components/ui/button.tsx`:

1. Add import: `import { useMagnetic } from '@/hooks/use-magnetic'`
2. Inside `Button`, before the `if (href)` branch, add:

```tsx
const { x, y, onPointerMove, onPointerLeave } = useMagnetic()
```

3. On **both** `motion.a` and `motion.button`, add these props:

```tsx
style={{ x, y }}
onPointerMove={onPointerMove}
onPointerLeave={onPointerLeave}
```

(The hook self-disables on touch/reduced motion, so no conditional wiring is needed. The existing `whileTap` and hover classes stay.)

- [ ] **Step 5: Verify button tests still pass**

Run: `npx vitest run tests/components/ui/button.test.tsx`
Expected: PASS. If the existing framer-motion mock in that test file does not mock `useMotionValue`/`useSpring`, extend the mock with:

```ts
useMotionValue: (v: number) => ({ get: () => v, set: () => {} }),
useSpring: (v: unknown) => v,
```

- [ ] **Step 6: Full suite + commit**

```bash
npm run test:run
git add src/hooks/use-magnetic.ts src/components/ui/button.tsx tests/hooks/use-magnetic.test.ts tests/components/ui/button.test.tsx
git commit -m "feat(motion): magnetic pull on buttons for fine pointers"
```

---

### Task 6: Cinematic dark-mode reveal (A6)

**Files:**
- Modify: `src/hooks/use-theme.tsx`
- Modify: `src/components/ui/theme-toggle.tsx`
- Modify: `src/styles/globals.css`
- Test: `tests/hooks/use-theme.test.tsx` (extend existing; if the file does not exist, create it with exactly the cases below)

**Interfaces:**
- Consumes: View Transitions API (feature-detected), `useReducedMotion()`
- Produces: `toggleTheme(origin?: { x: number; y: number }): void` — backward compatible (argument optional; all existing call sites keep working).

- [ ] **Step 1: Write the failing test**

In `tests/hooks/use-theme.test.tsx` add (or create the file with the standard provider-wrapper pattern used by other hook tests):

```tsx
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/hooks/use-theme'

const wrapper = ({ children }: React.PropsWithChildren) => <ThemeProvider>{children}</ThemeProvider>

describe('toggleTheme with view transitions', () => {
  it('falls back to a plain toggle when startViewTransition is unavailable', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    const before = result.current.theme
    act(() => result.current.toggleTheme({ x: 10, y: 10 }))
    expect(result.current.theme).not.toBe(before)
  })

  it('uses startViewTransition when available and origin given', () => {
    const ready = Promise.resolve()
    const svt = vi.fn((cb: () => void) => { cb(); return { ready } })
    ;(document as unknown as { startViewTransition: typeof svt }).startViewTransition = svt
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.toggleTheme({ x: 10, y: 10 }))
    expect(svt).toHaveBeenCalledOnce()
    delete (document as unknown as { startViewTransition?: typeof svt }).startViewTransition
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/hooks/use-theme.test.tsx`
Expected: second case FAILS (`startViewTransition` never called) — the first may pass already.

- [ ] **Step 3: Implement in use-theme.tsx**

Replace `toggleTheme` in `src/hooks/use-theme.tsx`:

```tsx
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// inside ThemeProvider:
const reduced = useReducedMotion()

const applyTheme = useCallback((next: Theme) => {
  setTheme(next)
  localStorage.setItem('theme', next)
  document.documentElement.classList.toggle('dark', next === 'dark')
}, [])

const toggleTheme = useCallback(
  (origin?: { x: number; y: number }) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> }
    }
    if (!doc.startViewTransition || reduced || !origin) {
      applyTheme(next)
      return
    }
    const transition = doc.startViewTransition(() => applyTheme(next))
    transition.ready
      .then(() => {
        const maxR = Math.hypot(
          Math.max(origin.x, window.innerWidth - origin.x),
          Math.max(origin.y, window.innerHeight - origin.y)
        )
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${origin.x}px ${origin.y}px)`,
              `circle(${maxR}px at ${origin.x}px ${origin.y}px)`,
            ],
          },
          {
            duration: 450,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
      .catch(() => {})
  },
  [theme, reduced, applyTheme]
)
```

Update `ThemeContextValue`:

```ts
interface ThemeContextValue {
  theme: Theme
  toggleTheme: (origin?: { x: number; y: number }) => void
}
```

- [ ] **Step 4: Pass the click origin from ThemeToggle**

In `src/components/ui/theme-toggle.tsx` change the `onClick`:

```tsx
onClick={(e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
}}
```

- [ ] **Step 5: Add view-transition CSS**

Append to `src/styles/globals.css`:

```css
/* A6 — circular theme reveal via View Transitions API */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

- [ ] **Step 6: Verify + commit**

```bash
npx vitest run tests/hooks/use-theme.test.tsx tests/components/ui/theme-toggle.test.tsx
npm run test:run
git add src/hooks/use-theme.tsx src/components/ui/theme-toggle.tsx src/styles/globals.css tests/hooks/use-theme.test.tsx
git commit -m "feat(motion): circular view-transition reveal on theme toggle"
```

---

### Task 7: Hero intro sequence (A1)

**Files:**
- Create: `src/components/motion/word-reveal.tsx`
- Modify: `src/components/sections/hero-section.tsx`
- Test: `tests/components/motion/word-reveal.test.tsx`; update `tests/components/sections/hero-section.test.tsx` if headline assertions use exact-string `getByText`

**Interfaces:**
- Consumes: `useReducedMotion()`, framer-motion
- Produces: `<WordReveal text={string} className?={string} baseDelay?={number} />` — renders each word in an overflow-hidden inline wrapper, rising in with a 0.04s per-word stagger.

- [ ] **Step 1: Write the failing test**

Create `tests/components/motion/word-reveal.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, initial, animate, transition, variants, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
}))

import { WordReveal } from '@/components/motion/word-reveal'

describe('WordReveal', () => {
  afterEach(() => cleanup())

  it('renders every word of the text', () => {
    render(<WordReveal text="Sustainability creates firm value" />)
    for (const word of ['Sustainability', 'creates', 'firm', 'value']) {
      expect(screen.getByText(word)).toBeInTheDocument()
    }
  })

  it('keeps the full text readable by assistive tech', () => {
    render(<WordReveal text="firm value" />)
    expect(screen.getByLabelText('firm value')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/motion/word-reveal.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement WordReveal**

Create `src/components/motion/word-reveal.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/utils/cn'

interface WordRevealProps {
  text: string
  className?: string
  baseDelay?: number
}

export function WordReveal({ text, className, baseDelay = 0 }: WordRevealProps) {
  const reduced = useReducedMotion()
  const words = text.split(/\s+/).filter(Boolean)

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={cn('inline', className)} aria-label={text} role="text">
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: baseDelay + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
```

Run: `npx vitest run tests/components/motion/word-reveal.test.tsx` → PASS.

- [ ] **Step 4: Use it in the hero headline**

In `src/components/sections/hero-section.tsx`, add `import { WordReveal } from '@/components/motion/word-reveal'` and replace the `<motion.h1>` content:

```tsx
<motion.h1
  variants={fadeUp}
  className="mt-3 font-display text-[clamp(44px,5vw,68px)] font-medium leading-[1.05] tracking-tight"
>
  {headline ? (
    <>
      <WordReveal text={headline.plain} baseDelay={0.15} />{' '}
      <em className="italic text-highlight font-medium">
        <WordReveal text={headline.emphasis} baseDelay={0.15 + headline.plain.split(/\s+/).length * 0.04} />
      </em>
      {headline.suffix}
    </>
  ) : (
    profile.title
  )}
</motion.h1>
```

Also retime the container stagger so the rest of the column follows the headline (total sequence ≤ 1.2s): in the `stagger` variant change `staggerChildren: 0.1` to `staggerChildren: 0.09, delayChildren: 0.1`, and in the avatar `motion.div` change `transition={{ duration: 0.6, ease: easeOut }}` to `transition={{ duration: 0.6, delay: 0.45, ease: easeOut }}`.

- [ ] **Step 5: Fix hero tests if they assert the full headline string**

Run: `npx vitest run tests/components/sections/hero-section.test.tsx`
If a test uses `getByText('<full headline>')` and now fails because words are split into spans, replace that assertion with a textContent check:

```tsx
const h1 = container.querySelector('h1')!
expect(h1.textContent?.replace(/ /g, ' ')).toContain('<expected headline text>')
```

(Use the actual expected string already present in the test file.)

- [ ] **Step 6: Full suite + build + commit**

```bash
npm run test:run
npm run build
git add src/components/motion/word-reveal.tsx src/components/sections/hero-section.tsx tests/components/motion/word-reveal.test.tsx tests/components/sections/hero-section.test.tsx
git commit -m "feat(motion): word-by-word masked hero headline reveal"
```

---

### Task 8: Self-drawing timelines (A2)

**Files:**
- Create: `src/components/motion/timeline-with-spine.tsx`
- Modify: `src/components/sections/experience-section.tsx`
- Modify: `src/components/sections/education-section.tsx`
- Test: `tests/components/motion/timeline-with-spine.test.tsx`

**Interfaces:**
- Consumes: framer-motion `useScroll`, `useTransform`, `useReducedMotion()`
- Produces: `<TimelineWithSpine>{rows}</TimelineWithSpine>` — client wrapper that renders a vertical spine line (desktop only, `md:` up) which scale-draws from top as the section scrolls through the viewport. Children render unchanged.

**Spec deviation (intentional):** the spec said "SVG `pathLength`"; for a straight vertical line a `scaleY` transform on a 1px div is visually identical, cheaper, and simpler than an SVG path, so this plan uses `scaleY`. Reduced motion still gets the full static line.

- [ ] **Step 1: Write the failing test**

Create `tests/components/motion/timeline-with-spine.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, initial, animate, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
  useTransform: () => 0,
}))

import { TimelineWithSpine } from '@/components/motion/timeline-with-spine'

describe('TimelineWithSpine', () => {
  afterEach(() => cleanup())

  it('renders its children', () => {
    render(
      <TimelineWithSpine>
        <div>row-1</div>
        <div>row-2</div>
      </TimelineWithSpine>
    )
    expect(screen.getByText('row-1')).toBeInTheDocument()
    expect(screen.getByText('row-2')).toBeInTheDocument()
  })

  it('renders the spine element', () => {
    render(<TimelineWithSpine><div /></TimelineWithSpine>)
    expect(screen.getByTestId('timeline-spine')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/motion/timeline-with-spine.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement TimelineWithSpine**

Create `src/components/motion/timeline-with-spine.tsx`:

```tsx
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function TimelineWithSpine({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.45'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[212px] hidden w-px bg-border md:block"
      />
      <motion.div
        data-testid="timeline-spine"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[212px] hidden w-px origin-top bg-accent md:block"
        style={reduced ? { scaleY: 1 } : { scaleY }}
      />
      {children}
    </div>
  )
}
```

(The faint `bg-border` track sits underneath; the teal line draws over it. `left-[212px]` = 200px date column + half the 24px grid gap.)

Run: `npx vitest run tests/components/motion/timeline-with-spine.test.tsx` → PASS.

- [ ] **Step 4: Wrap the two timeline sections**

In `src/components/sections/experience-section.tsx`, add `import { TimelineWithSpine } from '@/components/motion/timeline-with-spine'` and wrap the rows:

```tsx
<TimelineWithSpine>
  {experience.map((exp) => (
    <ExperienceRow ... />
  ))}
</TimelineWithSpine>
```

(replacing the current bare `<div>` wrapper). In `src/components/sections/education-section.tsx`, wrap the `education.map(...)` output the same way.

- [ ] **Step 5: Verify + build + commit**

```bash
npx vitest run tests/components/sections/experience-section.test.tsx tests/components/sections/education-section.test.tsx tests/components/motion/timeline-with-spine.test.tsx
npm run test:run
npm run build
git add src/components/motion/timeline-with-spine.tsx src/components/sections/experience-section.tsx src/components/sections/education-section.tsx tests/components/motion/timeline-with-spine.test.tsx
git commit -m "feat(motion): scroll-drawn timeline spine on experience and education"
```

(If the two section test files mock child components, add a passthrough mock for `TimelineWithSpine` that renders children.)

---

### Task 9: Scroll-reactive waves (A7)

**Files:**
- Modify: `src/components/motion/wave-background.tsx`
- Test: existing `tests/components/motion/wave-background.test.tsx` must stay green (no new assertions — behavior is canvas-visual)

**Interfaces:**
- Consumes: existing wave internals
- Produces: no API change; waves gain a smoothed `turbulence` multiplier fed by scroll velocity.

- [ ] **Step 1: Implement turbulence tracking**

In `src/components/motion/wave-background.tsx`, inside the `useEffect` (after the `mouse` declaration), add:

```ts
// Scroll velocity → turbulence (0..1), smoothed each frame
let lastScrollY = window.scrollY
let lastScrollT = performance.now()
let velocity = 0 // px per ms, decays
let turbulence = 0

function onScroll() {
  const now = performance.now()
  const dt = Math.max(1, now - lastScrollT)
  velocity = Math.abs(window.scrollY - lastScrollY) / dt
  lastScrollY = window.scrollY
  lastScrollT = now
}
```

In `drawFrame`, as the first lines of the function body, add:

```ts
// Ease turbulence toward current velocity, then decay velocity
const target = Math.min(1, velocity / 2.5)
turbulence += (target - turbulence) * 0.06
velocity *= 0.92
```

In `sampleWave`, change the `breathe` line to include turbulence:

```ts
const breathe = (1 + 0.25 * Math.sin(t * 0.0001 + wave.phase)) * (1 + 0.35 * turbulence)
```

(`sampleWave` closes over `turbulence` from the effect scope — keep both in the same closure.)

Register/cleanup the listener alongside the existing ones:

```ts
window.addEventListener('scroll', onScroll, { passive: true })
// and in the cleanup:
window.removeEventListener('scroll', onScroll)
```

Reduced-motion behavior is unchanged: the static single frame draws with `turbulence = 0`.

- [ ] **Step 2: Verify wave tests + full suite**

Run: `npx vitest run tests/components/motion/wave-background.test.tsx`
Expected: PASS unchanged.

- [ ] **Step 3: Manual smoke check**

Run: `npm run dev` — scroll fast on `/`: waves visibly swell then settle within ~1s of stopping. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
npm run test:run
git add src/components/motion/wave-background.tsx
git commit -m "feat(motion): waves react to scroll velocity with smoothed turbulence"
```

---

### Task 10: Route transitions (A4)

**Files:**
- Modify: `src/components/motion/page-transition.tsx`
- Test: `tests/components/motion/page-transition.test.tsx` (extend or keep green)

**Interfaces:**
- Consumes: `useReducedMotion()`
- Produces: unchanged component API (`<PageTransition>{children}</PageTransition>`).

- [ ] **Step 1: Upgrade the variants**

Replace the body of `src/components/motion/page-transition.tsx`:

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const full = {
  hidden: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' as const } },
}

const reducedVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: 'easeIn' as const } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const variants = reduced ? reducedVariants : full

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} variants={variants} initial="hidden" animate="enter" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

(Opacity + transform only — no blur, per the global constraint.)

- [ ] **Step 2: Verify + full suite + build + commit**

```bash
npx vitest run tests/components/motion/page-transition.test.tsx
npm run test:run
npm run build
git add src/components/motion/page-transition.tsx
git commit -m "feat(motion): page-turn style route transitions (rise-in, drift-out)"
```

---

### Task 11: Plan 1 wrap-up verification

**Files:** none created — verification only.

- [ ] **Step 1: Full verification battery**

```bash
npm run test:run
npm run lint
npm run build
```

Expected: all tests pass; lint shows only the two known `<img>` warnings; build exports 9 pages.

- [ ] **Step 2: Manual visual pass (dev server)**

`npm run dev` and check on `/`:
1. Hero headline reveals word-by-word, sequence completes ≤ 1.2s.
2. Stats strip counts up when scrolled into view.
3. Nav links draw underline on hover; buttons pull slightly toward the cursor.
4. Theme toggle sweeps a circle (Chromium) or switches instantly (fallback).
5. Experience/Education spine draws while scrolling; waves swell on fast scroll.
6. Navigate `/` → `/research` → back: pages rise in / drift out.
7. Emulate `prefers-reduced-motion: reduce` in DevTools → all of the above render statically/instantly.

- [ ] **Step 3: Report to user with evidence before claiming done** (superpowers:verification-before-completion)
