# Dark Mode Visibility Fix — Design Spec

## Problem

Several structural and text elements become invisible or nearly invisible in dark mode. The site's CSS custom property system is correctly configured for text colors, but border tokens, component-level opacity values, and one CTA button have insufficient contrast against the dark background (`#09090b`).

## Approach

Targeted fixes to 8 specific issues across 6 files. Minimal changes, low risk of side effects.

## Issues and Fixes

### 1. Dark Mode `--border` Token (globals.css)

**Problem:** `--border: #1e1e28` on `--background: #09090b` gives ~1.2:1 contrast — effectively invisible.

**Fix:** Change `--border` in dark mode from `#1e1e28` to `#27272a` (zinc-800), yielding ~2.2:1 contrast.

**Affected elements:** Section dividers (`section-divider.tsx`), timeline connecting line (`timeline-item.tsx`), mobile menu border (`mobile-menu.tsx`).

**File:** `src/styles/globals.css` (dark theme block, `--border` variable)

### 2. Hero CTA Button (hero-section.tsx)

**Problem:** `dark:text-white` on `bg-gold-500` gives white-on-gold contrast of ~1.8:1 (fails WCAG AA).

**Fix:** Remove `dark:text-white`. Keep `text-black` for both modes. Black on gold gives ~8.5:1 contrast.

**File:** `src/components/sections/hero-section.tsx` (line ~112, the "See my work" button)

### 3. Card Borders (card.tsx)

**Problem:** `dark:border-white/[0.06]` is nearly invisible glass-morphism border.

**Fix:** Replace the inline dark border with `border-border` token to use the theme's border color consistently.

**File:** `src/components/ui/card.tsx` (line ~30)

### 4. Navbar Border (navbar.tsx)

**Problem:** `dark:border-white/10` is very faint.

**Fix:** Replace `dark:border-white/10` with `border-border` token for consistency with other elements.

**File:** `src/components/layout/navbar.tsx` (line ~20)

### 5. Research Prose — `prose-invert` (research/[slug]/page.tsx)

**Problem:** `prose-invert` applied unconditionally. In light mode, non-overridden prose elements (li markers, code, blockquotes) get white text on light background.

**Fix:** Change `prose-invert` to `dark:prose-invert`.

**File:** `src/app/research/[slug]/page.tsx` (line ~67)

### 6. Research Prose Links (research/[slug]/page.tsx)

**Problem:** `prose-a:text-[#78600f]` may override `dark:prose-a:text-gold-500` due to Tailwind CSS 4's `:where()` specificity model for dark variants.

**Fix:** Use the custom `.text-gold-accent` class (which has `.dark .text-gold-accent` with 0,2,0 specificity) for prose links instead of Tailwind dark utility.

**File:** `src/app/research/[slug]/page.tsx` (line ~67)

## Files Changed

| File | Change |
|------|--------|
| `src/styles/globals.css` | `--border: #1e1e28` → `--border: #27272a` in dark theme |
| `src/components/sections/hero-section.tsx` | Remove `dark:text-white` from CTA button |
| `src/components/ui/card.tsx` | Replace `dark:border-white/[0.06]` with `border-border` |
| `src/components/layout/navbar.tsx` | Replace `dark:border-white/10` with `border-border` |
| `src/app/research/[slug]/page.tsx` | `prose-invert` → `dark:prose-invert`; fix prose link dark specificity |

## Verification

- Visual inspection of all 6 homepage sections in both light and dark mode
- Research article page inspection in both modes
- Contrast ratio spot-checks for changed elements
- Existing Vitest tests should continue to pass (no behavioral changes)
- Static export build (`npm run build`) should succeed

## Out of Scope

- Full WCAG AA audit of all elements
- New CSS tokens or design system changes
- Framer Motion animation changes
- Light mode changes (already fixed in prior commits)
