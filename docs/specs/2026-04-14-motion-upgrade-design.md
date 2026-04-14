# Motion Upgrade — Design Spec

**Date:** 2026-04-14
**Builds on:** Research Journal redesign (shipped 2026-04-14, commits `711f9a0` through `88b131a`)
**Audience:** Same as parent spec — D (grad school admissions) + E (mixed professional network)
**Status:** Draft (awaiting user review)

---

## 1. Goal

Add **visible, professional, intentional motion** to the portfolio — specifically an animated background, an interactive cursor, an animated filter, and polished hover/transition states — without compromising the scholarly credibility gains from the last cycle.

The shipped design is currently perceived as static: no motion on the hero, no interactive feedback. This spec addresses that gap with four motion layers that read as "premium modern" while keeping the scholarly typography and palette intact.

## 2. Non-Goals

- Not changing the paper + teal + gold palette, Newsreader/Inter/JetBrains Mono typography, or the 7-section IA
- Not rewriting content, schemas, or loaders
- Not adding new sections or routes
- Not restoring the deleted aurora canvas, shimmer text, or avatar glow components
- Not adding full-text search (filter is sufficient; search on 18 skill tags is overkill)

## 3. What Changes

### 3.1 Animated background — flowing data lines (Option 5 + 5 improvements)

A canvas-rendered ambient background, fixed behind all content on the homepage hero area. Four wave layers at different depths; each wave is a strokes-only path (not a color wash), so it's clearly visible on cream paper.

**Layer configuration** (back → front):

| Layer | Color | Opacity | Width | Drift speed | Amplitude | Frequency |
|-------|-------|---------|-------|-------------|-----------|-----------|
| Back ink | `rgba(15,20,25,0.22)` | — | 1.2px | 8 px/s | 22 | 0.011 |
| Mid teal | `rgba(13,79,92,0.35)` | — | 1.5px | 12 px/s | 26 | 0.010 |
| Mid gold | `rgba(184,148,74,0.60)` | — | 1.8px | 17 px/s | 20 | 0.013 |
| Front teal | `rgba(13,79,92,0.60)` | — | 2.0px | 22 px/s | 28 | 0.009 |

**Motion behavior:**

1. **Horizontal drift** — each wave has a continuous `offsetX` that increases at its own speed (parallax depth).
2. **Per-point sine phase** — wave y-position at each x computed as `y = yOffset + A · sin(k·(x + drift·20) + phase)`. Peaks and troughs move independently along the wave.
3. **Amplitude breathing** — amplitude modulated by a slow second sine: `A · (1 + 0.25 · sin(t · 0.0001 + phase))`. Wave heights swell and relax.
4. **Cursor attraction** — for points within 180px of the cursor, add a soft gaussian bulge toward the cursor's y: `y += (mouseY - y) · 0.35 · exp(-r² / (180 · 60))`.
5. **Drifting accent ticks** — 3 small pulsing circles (teal, gold, teal) ride along layers 4, 3, 2 respectively. x advances with wave drift; y snaps to wave shape; opacity pulses at 0.002 Hz.

**Rendering:** HTML `<canvas>` at `z-index: -1`, `position: fixed`, `pointer-events: none`. Single `requestAnimationFrame` loop draws ~320 line segments + 3 circles per frame. CPU cost under 0.5% on a modest laptop.

**Scope limit — decided:** the canvas is **fixed to the viewport** (`position: fixed; inset: 0`) and spans the full visible area. Its rAF loop is gated by an `IntersectionObserver` on the `#hero` section — when the hero leaves the viewport, the loop pauses (no draws while scrolling through lower sections). This gives smooth motion when viewing the hero without burning CPU on the rest of the page.

### 3.2 Cursor — teal ring + center dot with particle-fade tail (Option B + Tail A)

A custom cursor that replaces the OS cursor on non-touch devices. Rendered on a dedicated canvas at `z-index: 9999`, `position: fixed`, `pointer-events: none`.

**Head:**
- Outer ring: 1.5px stroke, 48px diameter, color `rgba(13,79,92,0.85)`
- Center dot: 6px diameter, solid `#0d4f5c`

**Tail — particle fade:**
- Every `mousemove`, push a particle `{x, y, born: now}` into an array
- Each frame: remove particles where `age > 400ms`
- Render: each particle as a circle with radius `1.2 + (1 - age/400) · 4.5`, alpha `(1 - age/400) · 0.7`, fill `#0d4f5c`
- Maximum simultaneous particles at steady movement: ~15

**Hover-over-interactive-element state:**
- Ring scales to 72px diameter, border color shifts to gold (`rgba(184,148,74,1)`), border width 2px
- Center dot hides
- Triggered on `mouseenter` of any `<a>`, `<button>`, `[role="button"]`; reverts on `mouseleave`

**Accessibility gates:**
- Disabled when `prefers-reduced-motion: reduce` — native OS cursor is shown instead
- Disabled when `pointer: coarse` (touch devices) — native cursor preserved
- Disabled when body has `data-cursor-disabled="true"` (escape hatch for debugging or specific sections)
- The native cursor is hidden only when our custom cursor is active (via `html.custom-cursor-active { cursor: none }`)

### 3.3 Animated Skills filter

Adds a **filter pill row** to the Skills section (`src/components/sections/skills-section.tsx`) positioned above the 3 category columns.

**Pills rendered** (derived from the current `skills.json` data):

- `All` *(default active)*, `applied`, `coursework`, `daily`, `research`, `DJP`, `project`, `(no context)`
- Count badges — e.g. `applied (5)` — computed at render time from the data
- `(no context)` represents skills without a `context` field (currently the Research & Soft column)

**Pill styling:**
- Inactive: surface bg, border, 12.5px body text, 10px mono count suffix
- Hover: border shifts to teal (no bg change)
- Active: ink bg, white text, border ink
- Transition: 180ms cubic-bezier(0.22, 1, 0.36, 1)

**Tag transitions on filter change:**
- Non-matching `SkillPill`s: `opacity → 0.22`, `transform: scale(0.96)`
- Matching `SkillPill`s: border color shifts to teal, background shifts to `#edf6f7` (soft teal tint), context-label color shifts to teal
- Transition: 350ms cubic-bezier(0.22, 1, 0.36, 1) for opacity + transform + border + background

**ARIA / keyboard:**
- Each pill is a `<button>` with `aria-pressed="true|false"`
- Tab lands on pills in order; Enter/Space activates
- "All" is always reachable first
- Screen reader announces e.g. "filter by applied, 5 of 18 skills"

**State management:** local component state, no URL query sync (not worth routing for a single-section filter).

### 3.4 Hover & transition polish

Tuning adjustments to existing behavior. No new components.

**Card hover** *(ResearchCard, FeaturedResearchCard, CredItem if hover-active)*
- Current: 2px lift + teal border color shift
- Add: `box-shadow: 0 8px 24px -12px rgba(13,79,92,0.12)` on hover
- Transition: 200ms ease

**Button hover** *(`src/components/ui/button.tsx`)*
- Add: `scale(1.02)` on hover (in addition to the existing `scale(0.98)` on tap)
- Slight bg darkening (3%) on hover for `primary` variant
- Transition: 150ms ease
- Arrow indicators (`→`) on primary CTAs translate `2px` right on hover

**Scroll reveals** *(`src/components/motion/scroll-reveal.tsx`)*
- Current: opacity 0→1, y 24→0, 400ms
- Tune to: opacity 0→1, y 16→0, 500ms cubic-bezier(0.22, 1, 0.36, 1)
- `StaggerChildren` adds `staggerChildren: 0.06` between direct children

**Page transitions** *(`src/components/motion/page-transition.tsx`)*
- No changes. Already tuned at 180ms / 120ms opacity-only.

**Navbar scroll shadow** *(`src/components/layout/navbar.tsx`)*
- Currently: bg opacity 70% → 85% above scroll threshold
- Add: when `hasScrolled`, also apply `box-shadow: 0 4px 16px -8px rgba(15,20,25,0.15)` for depth
- Transition: 300ms ease (same as existing bg transition)

---

## 4. What Stays

- All content JSON schemas, `src/data/content.ts` loaders, `src/types/content.ts` shapes
- All routes (`/`, `/research`, `/research/[slug]`, `/certifications/[slug]`, `/personal`, `/sitemap.xml`)
- Typography: Newsreader / Inter / JetBrains Mono
- Palette: paper, ink, muted, subtle, border, accent-primary (teal), accent-highlight (gold)
- 7-section homepage IA: Hero → Research → Experience → Education → Credentials → Skills → Contact
- Dark mode toggle
- All existing tests (some will need updates for new DOM structure from filter pills)
- Skip-to-content link, print stylesheet, JSON-LD, sitemap, OG metadata

---

## 5. New Components

| File | Responsibility |
|------|----------------|
| `src/components/motion/wave-background.tsx` | Canvas-rendered flowing data lines (Section 3.1). Renders nothing on SSR; hydrates on client. Pauses its rAF loop when tab is hidden (via `document.visibilitychange`). |
| `src/components/motion/custom-cursor.tsx` | Canvas-rendered ring + dot + particle tail (Section 3.2). The filename was previously used by the deleted cursor component — fresh implementation, completely different design. |
| `src/components/sections/skills-filter.tsx` | Pill row above the 3 skill columns (Section 3.3). Renders the filter UI only; filter state and tag-dim logic live in the parent `SkillsSection`. |

## 6. Modified Components

| File | What changes |
|------|--------------|
| `src/app/layout.tsx` | Import + mount `<WaveBackground />` and `<CustomCursor />` client-side. Add `<html>` class toggling for cursor enable/disable based on media queries. |
| `src/components/sections/skills-section.tsx` | Import `<SkillsFilter />`. Manage filter state with `useState<string>('all')`. Compute pill counts from data. Pass filter state down to `SkillPill` via a new optional prop `filterContext?: string`. |
| `src/components/ui/skill-pill.tsx` | Accept new optional `filterContext?: string`. Logic: `filterContext === undefined` → default appearance. `filterContext === 'all'` → default. `filterContext === 'none'` → match if this pill's `context` is undefined, dim otherwise. Otherwise → match if `filterContext === this.context`, dim otherwise. Dim = opacity 0.22 + scale 0.96. Match = teal border + soft tint background `#edf6f7` + context label teal. |
| `src/components/ui/card.tsx` | Add hover shadow. |
| `src/components/ui/button.tsx` | Add hover `scale(1.02)` + primary bg darken. Arrow-text translation handled via a new utility class or inline. |
| `src/components/layout/navbar.tsx` | Add conditional shadow on scroll. |
| `src/components/motion/scroll-reveal.tsx` | Tune duration/Y. |
| `src/components/motion/stagger-children.tsx` | Adjust default `staggerDelay`. |
| `src/styles/globals.css` | Add new utility classes: `.custom-cursor-active { cursor: none }`, hover-polish utilities if not covered by Tailwind. |

## 7. New Hooks / Utilities

| File | Purpose |
|------|---------|
| `src/hooks/use-is-touch.ts` | Returns `true` when `window.matchMedia('(pointer: coarse)')` matches. Updates on orientation change. |
| `src/hooks/use-viewport-visible.ts` | IntersectionObserver wrapper returning `boolean` for whether an element is in viewport. Used by `WaveBackground` to pause rAF loop when hero is off-screen. Takes a ref and an optional root margin. |

`useReducedMotion` already exists at `src/hooks/use-reduced-motion.ts` — both new motion components use it.

## 8. Tests

Every new component gets a test:

| Test file | Assertions |
|-----------|------------|
| `tests/components/motion/wave-background.test.tsx` | Renders canvas; `data-testid` present; does not render when `prefers-reduced-motion`; pauses on `visibilitychange` |
| `tests/components/motion/custom-cursor.test.tsx` | Renders canvas; respects `prefers-reduced-motion`; respects `pointer:coarse` (touch) — no cursor element rendered |
| `tests/components/sections/skills-filter.test.tsx` | Renders all 8 pills with correct counts; clicking a pill applies aria-pressed; clicking "All" resets |
| `tests/components/sections/skills-section.test.tsx` | Existing tests preserved; add: dim class applied to non-matching pills when filter set; match class applied to matching pills |
| `tests/components/ui/skill-pill.test.tsx` | Existing tests preserved; add: dim/match classes applied when filterContext provided |
| `tests/components/ui/card.test.tsx` | Existing tests preserved; add: hover shadow class present |
| `tests/components/ui/button.test.tsx` | Existing tests preserved; add: hover-scale classes present |

## 9. Accessibility

- **All motion respects `prefers-reduced-motion: reduce`:**
  - WaveBackground: renders a single static snapshot of the wave paths (initial frame), no rAF loop
  - CustomCursor: not rendered at all, native cursor preserved
  - Filter: transitions disabled, filter still works
  - ScrollReveal: renders content immediately (no fade-in)
  - Card/button hover scale + shadow: still apply (user-initiated motion is fine)
- **Touch devices** (`pointer: coarse`): CustomCursor disabled
- **Keyboard:** filter pills tab-reachable, Enter/Space activates, `aria-pressed` state
- **Focus:** teal outline on pills; unaffected by motion layer
- **Color contrast:** no contrast changes; all existing WCAG AA compliance preserved
- **Screen readers:** skill filter announces state via `aria-pressed`; WaveBackground + CustomCursor have no announceable content (they're decorative)

## 10. Performance

**Budget:** the motion upgrade must not push Lighthouse performance below 90 on mobile.

- **WaveBackground cost:** 4 waves × ~100 segments + 3 circles per frame = ~400 canvas ops/frame. At 60fps this is ~24k ops/sec — trivial.
- **CustomCursor cost:** ~15 particles max + 1 ring + 1 dot per frame = ~17 ops/frame. Negligible.
- **SkillsFilter cost:** CSS transitions on ~18 elements; handled by compositor, no JS cost during animation.
- **Visibility pause:** both canvases must pause their rAF loops when the tab is hidden (`document.visibilitychange`) and when the user scrolls past the hero (for WaveBackground, via IntersectionObserver if measurement shows need).
- **Canvas DPR handling:** both canvases must honor `devicePixelRatio` for crisp rendering on Retina displays (already in the preview code).
- **Mobile:** CustomCursor auto-disabled via `pointer:coarse`. WaveBackground renders on mobile but with reduced wave count (2 layers instead of 4) to protect battery.

## 11. Implementation order

Rough order for the implementation plan to follow:

1. **Chunk 1 — Foundations** — add `useIsTouch` hook; extend `globals.css` with `custom-cursor-active` utility.
2. **Chunk 2 — WaveBackground** — component + tests + integration into `layout.tsx`. Verify live.
3. **Chunk 3 — CustomCursor** — component + tests + integration. Verify live on mouse and touch devices.
4. **Chunk 4 — Skills filter** — new `SkillsFilter` component + modified `SkillsSection` + `SkillPill` updates + tests.
5. **Chunk 5 — Hover/transition polish** — Card shadow, Button scale, Navbar shadow, scroll-reveal tuning, stagger default.
6. **Chunk 6 — QA + ship** — full suite + Lighthouse + manual smoke + push to main.

Each chunk should leave the site in a runnable, green-test state. No intentional red intermediate states are needed (unlike the previous cycle — contact shape is already stable).

## 12. Open questions for user (if any)

None. All four sections were explicitly approved during brainstorming. The implementation plan can proceed to full detail without blocking on content or design decisions.

## 13. Done-definition

The motion upgrade is "done" when:

- [ ] WaveBackground visibly animates on the homepage hero in both light and dark themes
- [ ] CustomCursor renders a teal ring + dot + particle tail when the user moves the mouse on a non-touch device with motion enabled
- [ ] CustomCursor is hidden (native cursor preserved) on touch devices and under `prefers-reduced-motion: reduce`
- [ ] Skills section renders the filter pill row; clicking a pill dims non-matching tags and tints matching tags
- [ ] Filter survives keyboard-only interaction (Tab through pills, Enter to activate, screen reader announces)
- [ ] Hover states on cards and buttons show the new shadow and scale polish
- [ ] Scroll reveals use the new 500ms / 16px tune
- [ ] Navbar gains the scroll shadow above threshold
- [ ] All 170+ existing tests pass
- [ ] New test files for each new component exist and pass
- [ ] `npm run build` completes cleanly
- [ ] Lighthouse Performance ≥ 90 on mobile, Accessibility ≥ 95
- [ ] Deployed to GitHub Pages, live URL verified
- [ ] README updated with a short "Motion upgrade" changelog entry
