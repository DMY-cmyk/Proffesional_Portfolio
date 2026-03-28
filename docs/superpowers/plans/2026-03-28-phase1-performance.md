# Phase 1: Performance Foundation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce initial JS bundle ~30-40%, eliminate unnecessary GPU work, and improve LCP by adding lazy loading, event throttling, adaptive particles, blur removal, and resource preloading.

**Architecture:** Convert 5 below-fold homepage sections from static to dynamic imports with skeleton fallbacks. Optimize the Aurora canvas animation by throttling input handlers and scaling particle count to device capability. Remove expensive blur filter from page transitions. Add preconnect/preload hints for critical resources.

**Tech Stack:** Next.js 15 (dynamic imports), Framer Motion (animation props), Canvas 2D API, Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-03-28-phase1-performance-design.md`

**Worktree:** `D:\VsCode\Proffesional_Portfolio\.worktrees\phase1-performance`

**Baseline:** 38 test files, 152 tests — all passing.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/motion/page-transition.tsx` | Modify | Remove blur filter from animation variants |
| `tests/components/motion/page-transition.test.tsx` | Modify | Add test verifying no blur filter in animation |
| `src/app/layout.tsx` | Modify | Add preconnect and preload link elements |
| `src/components/layout/preload-links.tsx` | Create | Extracted preconnect/preload link component |
| `tests/app/layout.test.tsx` | Create | Test preconnect/preload links render in head |
| `src/components/motion/aurora-background.tsx` | Modify | Throttle handlers, cache scrollHeight, adaptive particle count, passive listeners |
| `tests/components/motion/aurora-background.test.tsx` | Modify | Add tests for throttleHandler and getParticleCount utilities |
| `src/app/page.tsx` | Modify | Replace static imports with next/dynamic + skeleton fallbacks |
| `tests/app/page.test.tsx` | Modify | Wrap section assertions in waitFor for async rendering |

---

## Chunk 1: All Tasks

### Task 1: Remove blur filter from PageTransition

**Files:**
- Modify: `src/components/motion/page-transition.tsx`
- Modify: `tests/components/motion/page-transition.test.tsx`

This is the simplest change — a direct prop removal. Good warm-up task.

- [ ] **Step 1: Write failing test — verify no blur filter props are passed**

Replace the existing mock at the top of `tests/components/motion/page-transition.test.tsx` with a `vi.fn()` mock that captures props, then add the blur assertion test:

```tsx
// Replace the existing framer-motion mock at the top of the file with:
const mockMotionDiv = vi.fn(({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>)

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => mockMotionDiv(props),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Add inside the describe block, after the existing test:
  it('does not apply blur filter to animation', () => {
    mockMotionDiv.mockClear()
    render(
      <PageTransition>
        <p>Content</p>
      </PageTransition>
    )
    const call = mockMotionDiv.mock.calls[0][0]
    // Verify initial, animate, exit do NOT contain filter property
    expect(call.initial).not.toHaveProperty('filter')
    expect(call.animate).not.toHaveProperty('filter')
    expect(call.exit).not.toHaveProperty('filter')
  })
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/motion/page-transition.test.tsx
```

Expected: FAIL — `call.initial` DOES have property `filter` (currently `filter: 'blur(4px)'`).

- [ ] **Step 3: Implement — remove blur from page-transition.tsx**

In `src/components/motion/page-transition.tsx`, change the motion.div props:

```tsx
// BEFORE:
initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}

// AFTER:
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
```

Keep the `transition` prop unchanged: `{{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}`

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/components/motion/page-transition.test.tsx
```

Expected: PASS — 2 tests (original "renders children" + new "does not apply blur filter").

- [ ] **Step 5: Run full test suite for regression**

```bash
npx vitest run
```

Expected: 38 files, 153 tests, all passing (152 original + 1 new).

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/page-transition.tsx tests/components/motion/page-transition.test.tsx
git commit -m "perf: remove blur filter from page transitions

Replace expensive filter: blur(4px) with opacity+transform only.
Blur creates a compositing layer per transition; opacity+transform
are already GPU-accelerated.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Add preconnect and preload hints to layout

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `tests/app/layout.test.tsx`

- [ ] **Step 1: Write failing test — verify preconnect and preload links**

Create `tests/app/layout.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'

// We can't easily render the full RootLayout (it includes <html>/<body> which jsdom doesn't support well).
// Instead, test that the layout module exports the expected metadata, and verify the preload links
// by testing a PreloadLinks helper component that we'll extract.

// Better approach: create a small extracted component for the links and test that.
// But per YAGNI, let's test the links exist in the rendered layout by checking the source.
// Actually, the simplest reliable approach: extract the preload links into a component and test it.

import { render } from '@testing-library/react'

// We'll create a PreloadLinks component to be testable
// For now, write the test expecting it:
vi.mock('@/lib/base-path', () => ({
  withBasePath: (p: string) => p,
}))

describe('PreloadLinks', () => {
  it('renders preconnect link for Google Fonts', async () => {
    const { PreloadLinks } = await import('@/components/layout/preload-links')
    const { container } = render(<PreloadLinks />)
    const links = container.querySelectorAll('link')
    const preconnect = Array.from(links).find(
      l => l.rel === 'preconnect' && l.href.includes('fonts.googleapis.com')
    )
    expect(preconnect).toBeTruthy()
  })

  it('renders preconnect link for Google Fonts static', async () => {
    const { PreloadLinks } = await import('@/components/layout/preload-links')
    const { container } = render(<PreloadLinks />)
    const links = container.querySelectorAll('link')
    const preconnect = Array.from(links).find(
      l => l.rel === 'preconnect' && l.href.includes('fonts.gstatic.com')
    )
    expect(preconnect).toBeTruthy()
  })

  it('renders preload link for avatar image', async () => {
    const { PreloadLinks } = await import('@/components/layout/preload-links')
    const { container } = render(<PreloadLinks />)
    const links = container.querySelectorAll('link')
    const preload = Array.from(links).find(
      l => l.rel === 'preload' && l.getAttribute('as') === 'image'
    )
    expect(preload).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/app/layout.test.tsx
```

Expected: FAIL — module `@/components/layout/preload-links` does not exist.

- [ ] **Step 3: Create PreloadLinks component**

Create `src/components/layout/preload-links.tsx`:

```tsx
import { withBasePath } from '@/lib/base-path'

export function PreloadLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="image" href={withBasePath('/images/profile/avatar.jpg')} />
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/app/layout.test.tsx
```

Expected: PASS — 3 tests.

- [ ] **Step 5: Wire PreloadLinks into layout.tsx**

In `src/app/layout.tsx`, add the import and render inside `<head>`:

```tsx
// Add import:
import { PreloadLinks } from '@/components/layout/preload-links'

// In the <head> tag, after the theme script:
<head>
  <script dangerouslySetInnerHTML={{ __html: `(function(){...})()` }} />
  <PreloadLinks />
</head>
```

- [ ] **Step 6: Run full test suite for regression**

```bash
npx vitest run
```

Expected: 39 files (38 original + 1 new), 156 tests (152 + 1 from Task 1 + 3 new), all passing.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/preload-links.tsx tests/app/layout.test.tsx src/app/layout.tsx
git commit -m "perf: add preconnect and preload hints for critical resources

Add preconnect for Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
and preload for hero avatar image (LCP element). Expected 50-200ms LCP
improvement.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Throttle Aurora canvas event handlers

**Files:**
- Modify: `src/components/motion/aurora-background.tsx`
- Modify: `tests/components/motion/aurora-background.test.tsx`

- [ ] **Step 1: Write failing test — verify throttled handler behavior**

Add tests to `tests/components/motion/aurora-background.test.tsx`. We can't easily test throttling in jsdom (no real rAF), but we can test the exported `throttle` utility. We'll extract a small throttle helper and test it.

Add to `tests/components/motion/aurora-background.test.tsx`:

```tsx
// Add at top:
import { throttleHandler } from '@/components/motion/aurora-background'

// Add new describe block:
describe('throttleHandler', () => {
  it('calls the callback on first invocation', () => {
    const cb = vi.fn()
    const throttled = throttleHandler(cb, 16)
    throttled()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('suppresses calls within the interval', () => {
    const cb = vi.fn()
    const throttled = throttleHandler(cb, 16)
    // Mock performance.now to return controlled values
    const originalNow = performance.now
    let mockTime = 0
    vi.spyOn(performance, 'now').mockImplementation(() => mockTime)

    throttled() // t=0, fires
    mockTime = 5
    throttled() // t=5, suppressed
    mockTime = 10
    throttled() // t=10, suppressed

    expect(cb).toHaveBeenCalledTimes(1)

    mockTime = 20
    throttled() // t=20, fires (>16ms elapsed)
    expect(cb).toHaveBeenCalledTimes(2)

    vi.spyOn(performance, 'now').mockRestore()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/motion/aurora-background.test.tsx
```

Expected: FAIL — `throttleHandler` is not exported from aurora-background.

- [ ] **Step 3: Implement throttle utility and apply to handlers**

In `src/components/motion/aurora-background.tsx`:

**Add exported throttle utility** (before the component, after imports):

```tsx
export function throttleHandler(callback: () => void, intervalMs: number): () => void {
  let lastTime = 0
  return () => {
    const now = performance.now()
    if (now - lastTime < intervalMs) return
    lastTime = now
    callback()
  }
}
```

**Replace the event handlers inside useEffect** — change:

```tsx
const handleMouseMove = (e: MouseEvent) => {
  mouseRef.current = { x: e.clientX, y: e.clientY }
}

const handleScroll = () => {
  scrollRef.current = window.scrollY
}
```

To:

```tsx
let cachedScrollHeight = document.body.scrollHeight

const handleMouseMove = throttleHandler((e: MouseEvent) => {
  mouseRef.current = { x: e.clientX, y: e.clientY }
}, 16)

const handleScroll = throttleHandler(() => {
  cachedScrollHeight = document.body.scrollHeight
  scrollRef.current = window.scrollY
}, 16)
```

**Update the `throttleHandler` signature** to accept event-handler callbacks (modify the utility to forward arguments):

```tsx
export function throttleHandler<T extends (...args: any[]) => void>(callback: T, intervalMs: number): T {
  let lastTime = 0
  return ((...args: any[]) => {
    const now = performance.now()
    if (now - lastTime < intervalMs) return
    lastTime = now
    callback(...args)
  }) as T
}
```

**Replace the scrollHeight read in the draw function** — change:

```tsx
const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
```

To:

```tsx
const maxScroll = Math.max(cachedScrollHeight - window.innerHeight, 1)
```

Note: `cachedScrollHeight` is the closure variable initialized above and updated by the throttled scroll handler.

**Verify `{ passive: true }` on mousemove listener** — The existing event listener setup should already include `{ passive: true }` for scroll. Ensure mousemove also has it. In the addEventListener calls, change:

```tsx
// If mousemove does NOT have passive: true, add it:
window.addEventListener('mousemove', handleMouseMove, { passive: true })
window.addEventListener('scroll', handleScroll, { passive: true })
```

Both listeners must use `{ passive: true }` per the spec.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/components/motion/aurora-background.test.tsx
```

Expected: PASS — 5 tests (3 original + 2 new throttle tests).

- [ ] **Step 5: Run full test suite for regression**

```bash
npx vitest run
```

Expected: All tests passing (158 total: 156 + 2 new).

- [ ] **Step 6: Commit**

```bash
git add src/components/motion/aurora-background.tsx tests/components/motion/aurora-background.test.tsx
git commit -m "perf: throttle Aurora canvas mouse/scroll handlers

Add 16ms (~60fps) throttle to mousemove and scroll event handlers.
Cache document.body.scrollHeight in scroll handler instead of reading
it every animation frame. Reduces unnecessary DOM reads and CPU usage.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Adaptive particle count based on device capability

**Files:**
- Modify: `src/components/motion/aurora-background.tsx`
- Modify: `tests/components/motion/aurora-background.test.tsx`

- [ ] **Step 1: Write failing test — verify getParticleCount utility**

Add to `tests/components/motion/aurora-background.test.tsx`:

```tsx
// Add at top import:
import { getParticleCount } from '@/components/motion/aurora-background'

// Add new describe block:
describe('getParticleCount', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    // Restore hardwareConcurrency to default
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: undefined, configurable: true })
  })

  it('returns 20 for small screens (mobile)', () => {
    vi.stubGlobal('innerWidth', 375)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: true })
    expect(getParticleCount()).toBe(20)
  })

  it('returns 40 for medium screens (tablet)', () => {
    vi.stubGlobal('innerWidth', 1024)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: true })
    expect(getParticleCount()).toBe(40)
  })

  it('returns 80 for large screens with many cores (desktop)', () => {
    vi.stubGlobal('innerWidth', 1920)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true })
    expect(getParticleCount()).toBe(80)
  })

  it('returns 20 for low-core devices regardless of screen size', () => {
    vi.stubGlobal('innerWidth', 1920)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, configurable: true })
    expect(getParticleCount()).toBe(20)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/motion/aurora-background.test.tsx
```

Expected: FAIL — `getParticleCount` is not exported from aurora-background.

- [ ] **Step 3: Implement getParticleCount and wire it up**

In `src/components/motion/aurora-background.tsx`:

**Add the exported utility** (after the `throttleHandler` function, before `createWaves`):

```tsx
export function getParticleCount(): number {
  if (typeof window === 'undefined') return 40
  const cores = navigator.hardwareConcurrency || 2
  const width = window.innerWidth

  if (width < 768 || cores <= 2) return 20
  if (width < 1280 || cores <= 4) return 40
  return 80
}
```

**Replace the hardcoded PARTICLE_COUNT constant** — change:

```tsx
const PARTICLE_COUNT = 80
```

To:

```tsx
// PARTICLE_COUNT removed — now computed dynamically via getParticleCount()
```

**In `createParticles`, replace the hardcoded count** — change:

```tsx
return Array.from({ length: PARTICLE_COUNT }, () => {
```

To:

```tsx
const count = getParticleCount()
return Array.from({ length: count }, () => {
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/components/motion/aurora-background.test.tsx
```

Expected: PASS — 9 tests (5 existing + 4 new getParticleCount tests).

- [ ] **Step 5: Add debounced resize recalculation**

The spec requires particle count recalculation on window resize. Add a debounced resize listener in the component's useEffect that calls `createParticles()` with the new count. In `src/components/motion/aurora-background.tsx`, inside the main useEffect, after the existing event listeners:

```tsx
// Add debounced resize handler to recalculate particle count
let resizeTimeout: ReturnType<typeof setTimeout>
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    cachedScrollHeight = document.body.scrollHeight
    particles = createParticles(canvas.width, canvas.height)
  }, 250)
}
window.addEventListener('resize', handleResize)
```

In the cleanup return, add: `window.removeEventListener('resize', handleResize)` and `clearTimeout(resizeTimeout)`.

- [ ] **Step 6: Run full test suite for regression**

```bash
npx vitest run
```

Expected: All tests passing (162 total: 158 + 4 new).

- [ ] **Step 7: Commit**

```bash
git add src/components/motion/aurora-background.tsx tests/components/motion/aurora-background.test.tsx
git commit -m "perf: adaptive particle count based on device capability

Replace hardcoded 80 particles with dynamic count based on
navigator.hardwareConcurrency and window.innerWidth:
- Mobile/low-end (< 768px or ≤ 2 cores): 20 particles
- Tablet/mid-range (< 1280px or ≤ 4 cores): 40 particles
- Desktop/high-end: 80 particles

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Lazy-load below-fold homepage sections

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/app/page.test.tsx`

This is the highest-impact change. All below-fold sections become dynamic imports with skeleton fallbacks.

- [ ] **Step 1: Update tests to handle async rendering**

The current tests render `<Home />` and check for section IDs synchronously. With `next/dynamic`, sections render asynchronously. We need to add `waitFor` wrappers. Mock `next/dynamic` to behave synchronously in tests:

Update `tests/app/page.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock next/dynamic to resolve imports synchronously in tests
vi.mock('next/dynamic', () => ({
  default: (importFn: () => Promise<any>, opts?: any) => {
    let Component: any = null
    importFn().then((mod: any) => {
      Component = mod.default || mod
    })
    return function DynamicWrapper(props: any) {
      if (Component) return <Component {...props} />
      if (opts?.loading) return opts.loading()
      return null
    }
  },
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

import Home from '@/app/page'

describe('Home page', () => {
  it('renders the hero section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('hero')).toBeInTheDocument()
    })
  })

  it('renders the about section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('about')).toBeInTheDocument()
    })
  })

  it('renders the experience section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('experience')).toBeInTheDocument()
    })
  })

  it('renders the certifications section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('certifications')).toBeInTheDocument()
    })
  })

  it('renders the skills section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('skills')).toBeInTheDocument()
    })
  })

  it('renders the contact section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('contact')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run updated tests to verify they still pass with current code**

```bash
npx vitest run tests/app/page.test.tsx
```

Expected: PASS — 6 tests. The `waitFor` wrappers work with synchronous rendering too, so existing code still passes.

- [ ] **Step 3: Implement lazy loading in page.tsx**

Replace `src/app/page.tsx` contents with:

```tsx
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/hero-section'
import { SectionDivider } from '@/components/ui/section-divider'
import { Skeleton } from '@/components/ui/skeleton'

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <Skeleton className="mb-8 h-8 w-48" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

const ProfileSection = dynamic(
  () => import('@/components/sections/profile-section').then(m => ({ default: m.ProfileSection })),
  { loading: () => <SectionSkeleton /> }
)
const TimelineSection = dynamic(
  () => import('@/components/sections/timeline-section').then(m => ({ default: m.TimelineSection })),
  { loading: () => <SectionSkeleton /> }
)
const CertificationsSection = dynamic(
  () => import('@/components/sections/certifications-section').then(m => ({ default: m.CertificationsSection })),
  { loading: () => <SectionSkeleton /> }
)
const SkillsSection = dynamic(
  () => import('@/components/sections/skills-section').then(m => ({ default: m.SkillsSection })),
  { loading: () => <SectionSkeleton /> }
)
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then(m => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton /> }
)

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionDivider />
      <ProfileSection />
      <SectionDivider />
      <TimelineSection />
      <SectionDivider />
      <CertificationsSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/app/page.test.tsx
```

Expected: PASS — 6 tests. Dynamic imports resolve in the test environment, and `waitFor` handles the async rendering.

- [ ] **Step 5: Run full test suite for regression**

```bash
npx vitest run
```

Expected: All tests passing (162 total).

- [ ] **Step 6: Run build to verify static export works**

```bash
npx next build
```

Expected: Build succeeds. The `out/` directory is generated. Dynamic imports work with static export.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx tests/app/page.test.tsx
git commit -m "perf: lazy-load below-fold homepage sections

Replace static imports with next/dynamic for ProfileSection,
TimelineSection, CertificationsSection, SkillsSection, and
ContactSection. Each gets a skeleton loading fallback. HeroSection
remains static (above-the-fold). Expected ~30-40% initial JS
bundle reduction.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Final Verification

After all 5 tasks are complete:

- [ ] **Run full test suite**

```bash
cd D:\VsCode\Proffesional_Portfolio\.worktrees\phase1-performance
npx vitest run
```

Expected: 39+ test files, 162+ tests, all passing.

- [ ] **Run production build**

```bash
npx next build
```

Expected: Build succeeds with static export.

- [ ] **Verify git log**

```bash
git --no-pager log --oneline -5
```

Expected: 5 commits (one per task) on `feature/phase1-performance` branch.
