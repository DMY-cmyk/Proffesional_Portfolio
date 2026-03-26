# P1 UX Polish — Design Spec

**Date:** 2026-03-26
**Status:** Approved (shimmer skeleton approach A)

## Problem

The portfolio has several P1 UX gaps:
1. Hero `<img>` tag missing `width`/`height` → layout shift (CLS)
2. No `loading.tsx` files for dynamic routes → blank page flash on navigation
3. Card glow effect is mouse-only → no feedback on touch devices
4. No smooth scroll for anchor navigation
5. No active/press state feedback on interactive cards

## Design

### 1. Image CLS Fix (hero-section.tsx)
Add explicit `width`/`height` attributes to the `<img>` tag in `AvatarWithGlow`:
```tsx
<img src={src} alt={alt} width={320} height={320} className="h-full w-full object-cover" />
```
The container is already sized (h-64/md:h-80 = 256px/320px), so CSS still controls visual size. The attributes prevent CLS before CSS loads.

### 2. Loading Skeletons (2 files)
Create shimmer skeleton `loading.tsx` for both dynamic routes:
- `src/app/research/[slug]/loading.tsx` — matches research detail layout (back link, title, meta, content lines)
- `src/app/certifications/[slug]/loading.tsx` — matches cert detail layout (back link, title, card, iframe placeholder)

Use a reusable `Skeleton` component in `src/components/ui/skeleton.tsx`:
```tsx
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-skeleton-shimmer rounded-md bg-muted', className)} />
}
```

Add `@keyframes skeleton-shimmer` to globals.css (separate from existing hero shimmer to avoid conflicts):
```css
@keyframes skeleton-shimmer {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
.animate-skeleton-shimmer {
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

### 3. Card Touch Feedback (card.tsx)
- Add `onTouchStart`/`onTouchEnd` handlers that toggle a `touched` state
- When touched, show a subtle full-card gold overlay (same rgba as glow but uniform)
- Add Tailwind `active:scale-[0.98]` for press feedback
- Keep existing mouse glow behavior unchanged

### 4. Smooth Scroll (globals.css)
Add to the existing `html` styles:
```css
html { scroll-behavior: smooth; }
```

### 5. Active States (globals.css)
Add tap highlight color for gold accent:
```css
a, button { -webkit-tap-highlight-color: rgba(212, 175, 55, 0.15); }
```

## Files Changed
| File | Change |
|------|--------|
| `src/components/sections/hero-section.tsx` | Add width/height to img |
| `src/components/ui/skeleton.tsx` | NEW — reusable skeleton component |
| `src/components/ui/card.tsx` | Add touch handlers + active state |
| `src/app/research/[slug]/loading.tsx` | NEW — research skeleton |
| `src/app/certifications/[slug]/loading.tsx` | NEW — cert skeleton |
| `src/styles/globals.css` | Add skeleton-shimmer, smooth scroll, tap highlight |

## Test Impact
- Existing card tests should still pass (touch is additive)
- No new test files needed (loading.tsx is a UI-only component)
- Build must succeed with new loading files
