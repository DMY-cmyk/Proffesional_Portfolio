# Light Mode Contrast Fix — Design Spec

## Problem

The portfolio's light mode has severe text contrast failures. Text styled for dark mode readability becomes hard to read on the warm ivory (#faf9f7) background:

- **Gold text** (`#d4af37`) on ivory = **2.3:1 contrast** (WCAG AA requires 4.5:1) — affects 13+ locations: section numbers, dates, active nav links, badges, navbar logo, blockquote
- **Muted text** (`#64748b`) on ivory = **3.8:1 contrast** — affects 40+ locations: subtitles, labels, footer, nav links, timeline descriptions
- **Invisible borders** — navbar uses `border-white/15` which vanishes on ivory; section dividers and card borders use `#e8e4df` on `#faf9f7` (~2:1)
- **Badges nearly invisible** — gold text on gold/10 transparent background

Dark mode is well-balanced and stays **completely untouched**.

## Approach: Gold as Decoration

Gold (`#d4af37`) shifts from a text color to a **decorative-only** role in light mode — used for fills, borders, underlines, and backgrounds. All text uses darker, WCAG-compliant tones. This preserves the gold identity while ensuring readability.

## Color Token Changes

Only the `:root` (light mode) block in `globals.css` changes:

| Token | Before | After | Contrast on #faf9f7 |
|-------|--------|-------|---------------------|
| `--muted-foreground` | `#64748b` (3.8:1) | `#3f3a36` (8.2:1 ✅) | Warm dark stone |
| `--border` | `#e8e4df` (~2:1) | `#c8c2b8` (~3.5:1 ✅) | Visible warm tan |
| `--gold-accent-text` | _(new)_ | `#78600f` (7.3:1 ✅) | Dark amber for gold text |

Dark mode `.dark` block: **no changes**.

## Component Changes

### 1. globals.css — Token updates

Update `:root` block:
```css
:root {
  --muted-foreground: #3f3a36;  /* was #64748b */
  --border: #c8c2b8;            /* was #e8e4df */
}
```

Add a new CSS utility class for gold accent text that adapts per theme:
```css
.text-gold-accent {
  color: #78600f;  /* dark amber in light mode */
}
.dark .text-gold-accent {
  color: #d4af37;  /* original gold in dark mode */
}
```

### 2. Section Heading (`section-heading.tsx`)

- Section number `01`, `02`... : `text-gold-500` → `text-gold-accent` (or `text-gold-500 dark:text-gold-500` + light override)
- Label text: already uses `text-muted-foreground` → auto-fixed by token change

### 3. Navbar (`navbar.tsx`)

- Logo "DM": `text-gold-500` → gold accent text class
- Border: `border-white/15 dark:border-white/10` → `border-border dark:border-white/10` (uses `--border` token)
- Active link styling: gold accent text + gold underline decoration

### 4. Nav Links (`nav-links.tsx`, `mobile-menu.tsx`)

- Active link: `text-gold-500` → gold accent text class
- Inactive: `text-muted-foreground` → auto-fixed by token change
- Active indicator underline: keep `bg-gold-500` (decorative, not text)

### 5. Badge (`badge.tsx`)

Light mode: filled gold background with dark text instead of gold text on transparent:
```
Light: bg-gold-500 text-black/90 border-gold-500/30
Dark:  bg-gold-500/10 text-gold-500 border-gold-500/20  (unchanged)
```

### 6. Button (`button.tsx`)

- **Secondary variant**: `text-gold-500 border-gold-500` → gold accent text + `border-current` (auto-matches)
- **Ghost variant**: `text-muted-foreground` → auto-fixed by token change
- **Primary**: unchanged (black text on gold bg)

### 7. Hero Section (`hero-section.tsx`)

- Name label: `text-gold-500` → gold accent text class
- Tagline: `text-muted-foreground` → auto-fixed
- CTA buttons: use inline `<a>` tags (not Button component). "About me" uses `border-border` + `text-foreground` → auto-fixed by token change. "See my work" uses `bg-gold-500 text-white` → change to `text-black`
- Scroll hint: `text-muted-foreground` → auto-fixed

### 8. Profile Section (`profile-section.tsx`)

- Bio text: `text-muted-foreground` → auto-fixed
- Blockquote: `text-gold-500` → gold accent text class
- Blockquote border: keep `border-gold-500` (decorative)

### 9. Contact Section (`contact-section.tsx`)

- Labels, subtitle, description: `text-muted-foreground` → auto-fixed
- Status indicator ("Open to opportunities"): uses `text-muted-foreground` → auto-fixed (no Badge component here)

### 10. Footer (`footer.tsx`)

- All text: `text-muted-foreground` → auto-fixed
- Hover states: `hover:text-gold-500` → `hover:text-gold-accent`
- Top border gradient: uses `via-border` → auto-fixed by token change

### 11. Timeline, Skills, Certifications sections

- Dates: `text-gold-500` → gold accent text class
- Descriptions: `text-muted-foreground` → auto-fixed

### 12. Section Divider (`section-divider.tsx`)

- Gradient: `via-border` → auto-fixed by border token change (#c8c2b8)

### 13. Card (`card.tsx`)

- Border: `border-border` → auto-fixed by token change
- Card glow hover: keep gold-500 (decorative radial gradient)

### 14. Theme Toggle (`theme-toggle.tsx`)

- Hover: `hover:text-gold-500` → `hover:text-gold-accent`

### 15. Research Pages (`research/page.tsx`, `research/[slug]/page.tsx`)

- Date text: `text-gold-500` → gold accent text class
- Back link hover: `hover:text-gold-500` → `hover:text-gold-accent`
- Prose link colors: `prose-a:text-gold-500` → `prose-a:text-[#78600f] dark:prose-a:text-gold-500`

## Implementation Strategy

The fix is primarily a **CSS token change** (2 lines in globals.css) that auto-fixes ~30 of the 40+ affected locations. The remaining ~13 locations require replacing `text-gold-500` with theme-aware gold accent text.

**Two-layer approach:**
1. **Token layer** (globals.css) — change `--muted-foreground` and `--border` values → auto-fixes everything using these tokens
2. **Component layer** — add `text-gold-accent` class or use `text-[#78600f] dark:text-gold-500` pattern for gold text instances

## Files Modified

| File | Change Type |
|------|------------|
| `src/styles/globals.css` | Token values + new utility class |
| `src/components/ui/section-heading.tsx` | Gold text class |
| `src/components/ui/badge.tsx` | Light mode filled variant |
| `src/components/ui/button.tsx` | Secondary variant text |
| `src/components/layout/navbar.tsx` | Logo, border |
| `src/components/layout/footer.tsx` | Hover states |
| `src/components/navigation/nav-links.tsx` | Active link |
| `src/components/navigation/mobile-menu.tsx` | Active link |
| `src/components/sections/hero-section.tsx` | Label |
| `src/components/sections/profile-section.tsx` | Blockquote |
| `src/components/sections/contact-section.tsx` | Status badge inherits |
| `src/components/sections/skills-section.tsx` | Dates |
| `src/components/sections/certifications-section.tsx` | Dates |
| `src/components/ui/timeline-item.tsx` | Dates |
| `src/components/ui/theme-toggle.tsx` | Hover state |
| `src/app/research/page.tsx` | Date text |
| `src/app/research/[slug]/page.tsx` | Date, back link, prose links |

## Testing

- All existing 148 tests must continue to pass
- Update any tests that assert specific color classes (e.g., `text-gold-500` → new class)
- No new tests needed — this is a visual styling change covered by existing render tests

## Constraints

- Dark mode stays **completely untouched**
- Gold `#d4af37` remains the primary accent — only its text usage changes in light mode
- Static export must still work
- All WCAG AA contrast ratios must be ≥ 4.5:1 for normal text
