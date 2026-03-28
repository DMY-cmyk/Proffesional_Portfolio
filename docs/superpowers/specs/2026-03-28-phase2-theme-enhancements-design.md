# Theme & Visual Enhancements — Design Spec

**Date:** 2026-03-28
**Status:** Draft
**Phase:** 2 of 5

## Problem

Theme switching is instant (jarring flash). No CSS fallback exists for initial theme before JS hydrates — users with `prefers-color-scheme: dark` see a light flash. The portfolio has only one accent color (gold). Users should be able to personalize their experience with alternative accent colors (blue, purple).

## Design

### 1. Smooth theme transition (globals.css)

Add CSS transitions to theme-affected properties on the root element. Disable transitions for users who prefer reduced motion.

```css
/* src/styles/globals.css — add to existing root styles */

:root,
.dark {
  transition: background-color 0.3s ease, color 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  :root,
  .dark {
    transition: none;
  }
}
```

Also add transition to `--card`, `--muted`, `--border` token consumers. The Card, Navbar, and Footer components use these tokens — their backgrounds will smoothly interpolate.

```css
body,
main,
nav,
footer {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### 2. CSS prefers-color-scheme fallback (globals.css)

Add a media query fallback so the correct theme loads before JS hydrates. This eliminates the "flash of wrong theme" for first-time visitors.

```css
/* src/styles/globals.css — add AFTER :root and .dark blocks */

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --background: #09090b;
    --foreground: #e4e4e7;
    --card: #14141b;
    --card-foreground: #e4e4e7;
    --muted: #1a1a22;
    --muted-foreground: #a1a1aa;
    --border: #27272a;
    --ring: #d4af37;
  }
}
```

The `:root:not(.light)` selector ensures that once JS sets an explicit theme class, it takes priority. The media query only applies when no explicit class is set (first paint before hydration).

Update `use-theme.tsx` to add `light` class (not just removing `dark`) so the selector chain works:

```tsx
// In toggleTheme or setTheme:
if (newTheme === 'dark') {
  document.documentElement.classList.add('dark')
  document.documentElement.classList.remove('light')
} else {
  document.documentElement.classList.add('light')
  document.documentElement.classList.remove('dark')
}
```

### 3. Theme accent variants — gold / blue / purple

#### 3a. CSS accent token system

Define accent color scales as CSS custom properties. The active accent is set via a `data-accent` attribute on `<html>`.

```css
/* src/styles/globals.css — accent system */

/* Gold (default) */
:root, [data-accent="gold"] {
  --accent-50: #fefce8;
  --accent-100: #fef9c3;
  --accent-200: #fef08a;
  --accent-300: #fde047;
  --accent-400: #d4af37;
  --accent-500: #b8960c;
  --accent-600: #854d0e;
  --accent-700: #713f12;
  --accent-800: #422006;
  --accent-900: #1c0f00;
  --accent-glow: rgba(212, 175, 55, 0.15);
  --accent-gradient-from: #d4af37;
  --accent-gradient-to: #b8960c;
}

/* Blue */
[data-accent="blue"] {
  --accent-50: #eff6ff;
  --accent-100: #dbeafe;
  --accent-200: #bfdbfe;
  --accent-300: #93c5fd;
  --accent-400: #3b82f6;
  --accent-500: #2563eb;
  --accent-600: #1d4ed8;
  --accent-700: #1e40af;
  --accent-800: #1e3a8a;
  --accent-900: #172554;
  --accent-glow: rgba(59, 130, 246, 0.15);
  --accent-gradient-from: #3b82f6;
  --accent-gradient-to: #2563eb;
}

/* Purple */
[data-accent="purple"] {
  --accent-50: #faf5ff;
  --accent-100: #f3e8ff;
  --accent-200: #e9d5ff;
  --accent-300: #d8b4fe;
  --accent-400: #8b5cf6;
  --accent-500: #7c3aed;
  --accent-600: #6d28d9;
  --accent-700: #5b21b6;
  --accent-800: #4c1d95;
  --accent-900: #2e1065;
  --accent-glow: rgba(139, 92, 246, 0.15);
  --accent-gradient-from: #8b5cf6;
  --accent-gradient-to: #7c3aed;
}
```

#### 3b. Migrate existing gold references

Replace all hardcoded gold color values with accent tokens throughout the codebase:

| Pattern | Replace with |
|---------|-------------|
| `text-gold-500`, `text-gold-400` | `text-[var(--accent-400)]` |
| `bg-gold-500/10` | `bg-[var(--accent-glow)]` |
| `from-gold-500 to-gold-400` | `from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)]` |
| `border-gold-500` | `border-[var(--accent-400)]` |
| `rgba(212, 175, 55, ...)` (in JS) | Read from CSS variable via `getComputedStyle` |
| `#d4af37` in aurora-background.tsx | Read `--accent-400` from computed style |

#### 3c. AccentPicker component

Create a small picker UI near the ThemeToggle in the navbar:

```tsx
// src/components/ui/accent-picker.tsx
'use client'

import { useAccent } from '@/hooks/use-accent'

const accents = [
  { id: 'gold', color: '#d4af37', label: 'Gold' },
  { id: 'blue', color: '#3b82f6', label: 'Blue' },
  { id: 'purple', color: '#8b5cf6', label: 'Purple' },
] as const

export function AccentPicker() {
  const { accent, setAccent } = useAccent()

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Accent color">
      {accents.map((a) => (
        <button
          key={a.id}
          onClick={() => setAccent(a.id)}
          aria-checked={accent === a.id}
          aria-label={a.label}
          role="radio"
          className="h-4 w-4 rounded-full border-2 transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: a.color,
            borderColor: accent === a.id ? a.color : 'transparent',
            boxShadow: accent === a.id ? `0 0 8px ${a.color}40` : 'none',
          }}
        />
      ))}
    </div>
  )
}
```

#### 3d. useAccent hook

```tsx
// src/hooks/use-accent.tsx
'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type AccentColor = 'gold' | 'blue' | 'purple'

const AccentContext = createContext<{
  accent: AccentColor
  setAccent: (accent: AccentColor) => void
} | null>(null)

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentColor>('gold')

  useEffect(() => {
    const stored = localStorage.getItem('accent-color') as AccentColor | null
    if (stored && ['gold', 'blue', 'purple'].includes(stored)) {
      setAccentState(stored)
      document.documentElement.setAttribute('data-accent', stored)
    }
  }, [])

  const setAccent = useCallback((newAccent: AccentColor) => {
    setAccentState(newAccent)
    document.documentElement.setAttribute('data-accent', newAccent)
    localStorage.setItem('accent-color', newAccent)
  }, [])

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  )
}

export function useAccent() {
  const ctx = useContext(AccentContext)
  if (!ctx) throw new Error('useAccent must be used within AccentProvider')
  return ctx
}
```

Wrap `AccentProvider` around `ThemeProvider` in `layout.tsx`.

#### 3e. Aurora background accent integration

Update aurora-background.tsx to read accent colors from CSS variables instead of hardcoded gold:

```tsx
// In the animation setup:
const style = getComputedStyle(document.documentElement)
const accentColor = style.getPropertyValue('--accent-400').trim() || '#d4af37'
const accentGlow = style.getPropertyValue('--accent-glow').trim() || 'rgba(212,175,55,0.15)'

// Use accentColor for wave/particle rendering
// Re-read on data-accent attribute change via MutationObserver
const observer = new MutationObserver(() => {
  const newStyle = getComputedStyle(document.documentElement)
  accentColorRef.current = newStyle.getPropertyValue('--accent-400').trim()
})
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-accent'] })
```

## Files Changed

| File | Change |
|------|--------|
| `src/styles/globals.css` | Theme transition, prefers-color-scheme fallback, accent token system |
| `src/hooks/use-theme.tsx` | Add `light` class management |
| `src/hooks/use-accent.tsx` | NEW — accent color context + hook |
| `src/components/ui/accent-picker.tsx` | NEW — accent color picker UI |
| `src/app/layout.tsx` | Wrap with AccentProvider |
| `src/components/layout/navbar.tsx` | Add AccentPicker next to ThemeToggle |
| `src/components/motion/aurora-background.tsx` | Read accent from CSS variables |
| `src/components/ui/card.tsx` | Replace hardcoded gold with accent tokens |
| `src/components/sections/hero-section.tsx` | Replace gold references with accent tokens |
| `src/components/sections/skills-section.tsx` | Replace gold gradient with accent tokens |
| `src/components/sections/contact-section.tsx` | Replace gold references |
| `src/components/ui/button.tsx` | Replace gold with accent tokens |
| `src/components/ui/section-heading.tsx` | Replace gold with accent tokens |

## Test Impact

- `tests/hooks/use-theme.test.tsx` — Update to verify `light` class is added/removed.
- `tests/components/ui/accent-picker.test.tsx` — NEW test file for AccentPicker component.
- `tests/hooks/use-accent.test.tsx` — NEW test file for useAccent hook.
- All existing component tests — should still pass since accent tokens default to gold.
- Aurora background test — may need mock for `getComputedStyle`.

## Verification

```bash
npm run test:run
npm run build
```

Visual verification: toggle between gold/blue/purple accents — all UI elements (buttons, progress bars, glow effects, aurora particles, borders) should update in real-time. Theme transitions should animate smoothly over 0.3s.
