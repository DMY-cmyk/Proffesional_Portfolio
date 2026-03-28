# Performance Foundation — Design Spec

**Date:** 2026-03-28
**Status:** Draft
**Phase:** 1 of 5

## Problem

The portfolio loads all 6 homepage sections synchronously, resulting in ~100KB+ initial JS. The Aurora canvas animation runs mouse/scroll handlers on every pixel without throttling. PageTransition uses an expensive `filter: blur(4px)`. No preload hints exist for the LCP image (avatar) or Google Fonts. The particle count is fixed at 80 regardless of device capability.

## Design

### 1. Lazy-load below-fold sections (page.tsx)

Replace static imports with `next/dynamic` for all sections except HeroSection (above-the-fold). Each lazy-loaded section gets a skeleton fallback.

```tsx
// src/app/page.tsx
import { HeroSection } from '@/components/sections/hero-section'
import { SectionDivider } from '@/components/ui/section-divider'
import dynamic from 'next/dynamic'
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
```

The JSX in the return statement remains unchanged — same section order, same SectionDivider usage. Only the import mechanism changes.

**Expected impact:** ~30-40% reduction in initial JS bundle.

### 2. Throttle Aurora canvas events (aurora-background.tsx)

Add a 16ms throttle to `mousemove` and `scroll` handlers. Cache `scrollHeight` outside the animation loop to avoid expensive DOM reads per frame.

```tsx
// Inside useEffect, before event listeners:
let lastMouseTime = 0
let lastScrollTime = 0
let cachedScrollHeight = document.body.scrollHeight

const handleMouseMove = (e: MouseEvent) => {
  const now = performance.now()
  if (now - lastMouseTime < 16) return // ~60fps cap
  lastMouseTime = now
  mouseRef.current = { x: e.clientX, y: e.clientY }
}

const handleScroll = () => {
  const now = performance.now()
  if (now - lastScrollTime < 16) return
  lastScrollTime = now
  cachedScrollHeight = document.body.scrollHeight
  scrollRef.current = window.scrollY / Math.max(cachedScrollHeight - window.innerHeight, 1)
}

// Use cachedScrollHeight in the animation loop instead of reading document.body.scrollHeight
```

Also ensure both listeners use `{ passive: true }` (scroll already does, verify mousemove).

### 3. Adaptive particle count (aurora-background.tsx)

Detect device capability and scale particle count dynamically:

```tsx
function getParticleCount(): number {
  if (typeof window === 'undefined') return 40
  const cores = navigator.hardwareConcurrency || 2
  const width = window.innerWidth

  if (width < 768 || cores <= 2) return 20   // mobile / low-end
  if (width < 1280 || cores <= 4) return 40  // tablet / mid-range
  return 80                                   // desktop / high-end
}

// Replace the hardcoded 80:
const particleCount = getParticleCount()
const particles: Particle[] = Array.from({ length: particleCount }, () => createParticle(canvas))
```

Also recalculate on window resize (debounced) — if the user resizes from desktop to mobile view, reduce particles.

### 4. Optimize PageTransition — remove blur (page-transition.tsx)

Replace the expensive `filter: blur()` with opacity + transform only:

```tsx
// BEFORE (expensive):
initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}

// AFTER (GPU-friendly):
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
```

The blur was creating a compositing layer per transition. Opacity + transform are already GPU-accelerated and sufficient for a smooth page transition feel.

### 5. Preload critical resources (layout.tsx)

Add resource hints to the `<head>` via the layout:

```tsx
// In src/app/layout.tsx, inside the <head> or via metadata:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  rel="preload"
  as="image"
  href={withBasePath('/images/profile/avatar.jpg')}
/>
```

Since Next.js App Router manages `<head>` via metadata exports, add these as raw `<link>` elements inside the `<head>` of the root layout's `<html>` tag, or use the `metadata.other` field.

## Files Changed

| File | Change |
|------|--------|
| `src/app/page.tsx` | Replace static imports with `next/dynamic` + skeleton fallbacks |
| `src/components/motion/aurora-background.tsx` | Throttle mouse/scroll, cache scrollHeight, adaptive particles |
| `src/components/motion/page-transition.tsx` | Remove `filter: blur()` from animation variants |
| `src/app/layout.tsx` | Add preconnect, preload hints |

## Test Impact

- `tests/app/page.test.tsx` — May need updates if it asserts on static imports. Dynamic imports render asynchronously, so tests may need `waitFor` wrappers.
- `tests/components/motion/page-transition.test.tsx` — Update expected animation props (remove blur assertions if any).
- `tests/components/motion/aurora-background.test.tsx` — Existing tests should pass; canvas mocking unchanged. Add test for `getParticleCount()` utility.
- All other tests unaffected.

## Verification

```bash
npm run test:run    # All 152 tests pass
npm run build       # Static export succeeds
```

Lighthouse check: LCP should improve by 50-200ms from preload hints. Initial JS payload visible in build output should be ~30% smaller.
