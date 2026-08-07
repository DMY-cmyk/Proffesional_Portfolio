# Navigation Header — Journal Masthead Redesign (Design Spec)

**Date:** 2026-08-07
**Status:** Approved by Dzaki (visual companion session — all states approved)
**Supersedes:** the *visual* layer of `2026-08-07-navbar-redesign-design.md`. That spec's
functional decisions (deduped links, `resolveNavHref`/active helpers, portal drawer,
focus trap, WCAG label-in-name) are kept; this spec replaces the header's structure,
visual language, and motion.
**Scope:** `Navbar`, `NavLinks`, `MobileMenu`, `navigation.ts` (ordering only),
`globals.css` (nav-specific utilities), UI strings, related tests.

## Purpose

The audit (all six findings confirmed by Dzaki) established that yesterday's redesign
fixed the header's *functional* problems but left its *identity* wrong: a glassy
floating pill (SaaS dialect) on a paper-and-ink academic-journal site, two competing
underline systems, a 9px tagline, seven equal-weight links, a crowded four-style
control cluster, and three typographic voices in one 56px bar.

The new header is a **full-width, two-tier journal masthead**: identity row over
navigation row, separated by a hairline, closed by a 2px ink rule that doubles as the
scroll-progress track. It condenses to a single compact row on scroll.

## Decisions from brainstorming

- Direction: **A — Journal Masthead** (chosen over refined-pill and single-row
  hairline-classic alternatives).
- Always visible in the bar: **CV button (single filled CTA), language toggle, theme
  toggle, scroll-progress rule**.
- **Search leaves the bar entirely.** Ctrl+K and the command palette keep working;
  no visible affordance in the header.
- One underline system: hover = 2px sand underline; active = same underline in accent.
- Link hierarchy: six section links in reading order; **Notes** pushed to the far end
  with a gold `↗` glyph (side-content rank).

## Design

### 1. Structure (desktop ≥ lg, top of page — "expanded")

Fixed full-width `<header>` at `top-0`, opaque `bg-background` (no blur, no border
radius, no floating gap). Content constrained to `max-w-[1120px] px-7` (aligns with
the site's `max-w-6xl` sections).

- **Tier 1 — identity row** (~64px):
  - Brand (Link → `/`): `Dzaki Yusfian` + accent period, Newsreader, `text-[23px]
    font-medium leading-tight`; tagline below at `text-[10.5px]` mono uppercase
    `tracking-[0.18em] text-subtle mt-0.5` — localized `brandTagline`. `aria-label`
    "Dzaki Yusfian — Home" (unchanged, WCAG 2.5.3).
  - Right cluster, hairline-separated (`border-l border-border` between groups):
    1. Language toggle restyled as quiet mono text: active lang in accent with
       underline, e.g. `EN / ID` (min 44px touch target via padding).
    2. Theme toggle (existing component, icon-only, quiet).
    3. CV button — **the only filled control**: `bg-foreground text-background
       rounded-[4px] px-3.5 py-2` mono 11px uppercase, download icon + localized
       label "Download CV" (`downloadCv`), `hover:bg-accent`.
- **Hairline** between tiers: `border-b border-border`, inset to the container.
- **Tier 2 — navigation row** (42px): links from `navbarItems`, JetBrains Mono
  `text-[11px] uppercase tracking-[0.14em]`, full-height flex items (≥42px targets).
  Section links left, in order Research → Contact; **Notes** at `ml-auto` with gold
  `↗` glyph (`text-highlight`, glyph only — gold never colors text at this size).
- **Bottom rule**: `h-0.5 bg-foreground` full-width; the scroll-progress fill
  (`bg-accent`, `data-testid="scroll-progress"`) overlays it from the left.

### 2. Underline system (NavLinks)

One system, two intensities, replacing both the `link-underline` hover effect and the
4px active dot on nav links:

- Hover/focus-visible: 2px underline in sand (light `#c9bda9` ≈ `border` darkened;
  token `--nav-underline-hover`, dark-theme value `#3f4c5e`), drawn with a scaleX
  transition (200ms, existing easing).
- Active: same 2px underline in `accent`, animated between links with the existing
  framer-motion `layoutId="nav-underline"` spring. Underlines sit flush on the
  tier-2 baseline (touching the hairline/bottom rule zone).
- `aria-current` rules unchanged (`page` / `location`).

### 3. Condensed state (desktop, after scroll)

Trigger: `scrollY > 80` (hysteresis ±8px to avoid flutter), via the existing
`useScrollProgress`/scroll listener.

- Tiers merge into a single 54px row: brand shrinks to 18px, tagline and hairline
  fade/collapse, tier-2 link row slides up inline between brand and utilities
  (type drops to 10.5px, gaps tighten), CV label shortens to "CV".
- Motion: spring ≈300ms on transform/opacity (no width/height keyframe animation;
  use scale/translate + collapsing grid rows). Instant swap under
  `prefers-reduced-motion` (existing `use-reduced-motion` hook).
- Bottom rule + progress fill persist in both states.

### 4. Responsive tiers

- **≥1024px (lg):** full two-tier masthead as above.
- **768–1023px (md):** single row — brand (two-line lockup) + CV + language +
  theme + hamburger. No tier 2; links live in the drawer.
- **<768px:** brand + theme + hamburger only (CV and language in the drawer).
  Tagline remains visible ≥360px at 9.5–10px (off the cramped pill it stays
  legible; hidden below 360px).
- Hamburger: asymmetric three-line editorial glyph (top/middle full, bottom ~60%).

### 5. Mobile drawer restyle (MobileMenu)

Behavior unchanged (portal to body, `role="dialog"` + `aria-modal`, focus trap,
Escape, body scroll lock, spring slide-in, staggered items, reduced-motion
degrade). Visual re-skin:

- Panel: `bg-background` (paper), leading edge `border-l-2` in `foreground` ink
  (replaces the 1px `border-border`), width `w-72 sm:w-80` unchanged.
- Header row inside panel: mono "Menu" microlabel + close affordance.
- Group labels: numbered journal front-matter style — `01 — Sections`,
  `02 — Pages` — mono 10px uppercase `tracking-[0.2em] text-highlight`, with a
  hairline under each label. Localized: `navGroupSections`/`navGroupPages` values
  prefixed by the numbers in the component (numbers are not translated).
- Links: **Newsreader serif, 22px**, section links then pages; active = accent;
  Notes gets the gold `↗` glyph.
- Footer: full-width CV button (same filled style, localized `downloadCv`), then
  language toggle behind a hairline.

### 6. Config & content changes

- `navigation.ts`: no href changes; `navbarItems` order stays
  `[...sectionLinks, Notes]`. Add an `isSecondary?: boolean` flag to `NavItem`,
  set on the Notes item; `NavLinks` renders secondary items with `ml-auto` and the
  gold `↗` glyph, and the drawer keeps using the section/page grouping.
- UI strings: reuse `brandTagline`, `downloadCv`, `navGroupSections`,
  `navGroupPages`. New: `navMenuLabel` (EN "Menu" / ID "Menu") for the drawer's
  header microlabel.
- `globals.css`: add `--nav-underline-hover` token (light/dark values above);
  retire `.link-underline` usage on nav links (class remains for other links).

### 7. Layout & anchor offsets

Header height is now variable (expanded ~106–110px desktop, condensed 54px,
mobile 56–58px). Sections need `scroll-margin-top` ≈ 72px (safe under the
condensed header, which is the state active when a user clicks an anchor mid-page).
Verify hero top padding clears the expanded masthead on desktop and mobile.

### 8. Accessibility

- All prior a11y behavior preserved: `aria-current` tokens, dialog focus trap,
  label-in-name, Escape/focus-return.
- Contrast: mono 11px links `muted` on `background` ≥4.5:1 both themes; tagline
  `subtle` meets the raised token from commit 7bf7137; gold `highlight` is used
  only for glyphs/rules, never sub-18px text.
- Touch targets: tier-2 links are full-height (42px) flex items; toggles padded
  to ≥44px; drawer links 22px serif with ≥44px row height.
- Focus-visible rings on all controls (existing ring styles).

### 9. Dark theme

Token-driven; no new hardcoded colors in components. Bottom rule `bg-foreground`
(warm cream in dark), progress `bg-accent` (bright teal), hairlines `border`,
hover underline `--nav-underline-hover` dark value `#3f4c5e`.

### 10. Testing

- `navbar.test.tsx`: masthead renders two tiers at top; condenses past threshold
  (mock scroll); no search button in the header; single filled CV button with
  localized label; progress bar testid preserved; brand aria-label.
- `nav-links.test.tsx`: underline present on hover/active with shared system (class
  assertions); active rules and href resolution unchanged from prior spec's tests.
- `mobile-menu.test.tsx`: numbered group labels; serif link classes; CV + language
  in drawer; focus trap/Escape tests keep passing.
- Anchor offset: section `scroll-margin-top` present.
- Full suite + `next build` must pass; Lighthouse a11y ≥ current scores.

## Error handling / edge cases

- Scroll threshold hysteresis prevents expand/condense flutter at scrollY ≈ 80.
- Reduced motion: condense becomes an instant swap; drawer stagger/spring degrade
  as today.
- Static export (`basePath`) untouched — href resolution helpers unchanged.
- Keyboard-only users: Ctrl+K still opens the palette (no visible affordance —
  accepted trade-off, chosen explicitly by Dzaki).

## Out of scope

Command palette internals, footer, section content, i18n plumbing, theme system,
`/research` page internals.
