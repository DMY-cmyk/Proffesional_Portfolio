# Navigation Header Redesign — Design Spec

**Date:** 2026-08-07
**Status:** Approved for implementation (autonomous chain per workflow preferences)
**Scope:** `Navbar`, `NavLinks`, `MobileMenu`, `navigation.ts` config, small enabling change in `ResearchSection`, new UI strings.

## Purpose alignment

The portfolio is a research-journal-styled professional site whose job is to establish
academic credibility for an early-career accounting researcher and route readers to
Research → Experience → Credentials → Contact, with CV download as the standing CTA.
The header must read as a curated editorial masthead, work identically on every page,
and never show a confusing or broken affordance.

## Problems being fixed

1. **Duplicate "Research" label** — `allNavItems` merges the `#research` section anchor
   and the `/research` page, both labeled "Research"; the desktop nav and mobile menu
   show two identical labels with different destinations.
2. **Hash links break off the homepage** — `#experience` etc. do nothing on
   `/research/[slug]`, `/notes`, `/certifications/[slug]`, `/personal`.
3. **Tablet overflow** — at `md` (768–1100px) the full link row + 4 utility controls
   exceed available width.
4. **No active state on subpages** — highlight comes only from scroll-spy.
5. **Weak identity / cryptic affordances** — brand is "Dzaki."; command-palette button
   is a bare "Ctrl K"; mobile menu lacks the CV download CTA.

## Chosen approach

**Curated editorial refinement** of the existing floating-pill header (approach A).
Rejected: two-tier journal masthead (taller header, high churn on a freshly polished
component); radical 4-link minimalism (hides the deliberate 7-section IA).

## Design

### 1. Information architecture (`src/config/navigation.ts`)

- `sectionLinks` (unchanged hrefs): Research `#research`, Experience, Education,
  Credentials, Skills, Contact.
- `pageLinks` unchanged (`/research`, `/notes`) — still feeds the command palette via
  `allNavItems`.
- **New export `navbarItems`**: `[...sectionLinks, Notes (/notes)]`. The `/research`
  page link is removed from the header only; it stays in the command palette and gains
  a "View all research →" link inside the homepage research section (see §5), so the
  hub remains one click away.
- **New helper `resolveNavHref(href, pathname)`**: section anchors resolve to `#id` on
  the homepage (preserves smooth scroll + scroll-spy) and `withBasePath('/#id')`
  elsewhere; page hrefs resolve through `withBasePath` as today.
- **New helper `isPageLinkActive(href, pathname)`**: true when `pathname === href` or
  `pathname.startsWith(href + '/')` (covers `/notes/[slug]`).

### 2. Navbar (`src/components/layout/navbar.tsx`)

- **Brand (editorial masthead)**: two-line lockup —
  line 1: `Dzaki Yusfian` + accent period, `font-display` as today;
  line 2 (sm+): mono microline, uppercase, wide tracking, `text-subtle`, localized
  `brandTagline` ("Accounting · Research" / "Akuntansi · Riset").
  `aria-label` stays "Dzaki Muhammad Yusfian — Home". Brand stays a `next/link`
  `href="/"` (Link auto-prefixes basePath — no change needed).
- **Responsive tiers** (fixes overflow):
  - `lg+`: brand + full link row + search button + CV + language + theme.
  - `md–lg`: brand + CV + language + theme + hamburger (link row and search hidden).
  - `<md`: brand + theme + hamburger (CV and language live in the mobile menu).
  - `NavLinks`: `hidden lg:flex`; search button: `hidden lg:inline-flex`;
    CV: `hidden md:inline-flex` (unchanged); `LanguageToggle` in the bar:
    `hidden md:inline-flex` (below `md` it lives in the mobile menu, as it
    already does); `MobileMenu` wrapper: `lg:hidden`.
- **Search affordance**: magnifier icon + kbd-styled `Ctrl K` hint replacing the bare
  text button; `aria-label="Search and navigate (Ctrl+K)"`. Same
  `open-command-palette` event.
- Scroll-progress bar and scrolled-elevation behavior unchanged.
- Navbar passes `pathname` (from `usePathname`) down; items come from `navbarItems`
  localized as today.

### 3. NavLinks (`src/components/navigation/nav-links.tsx`)

- Uses `resolveNavHref` for hrefs.
- Active =
  - section link: `href === '#' + activeSection` **and** on homepage;
  - page link: `isPageLinkActive`.
- Keeps the framer `layoutId` spring underline (visible-motion preference); underline
  also renders for an active page link.

### 4. MobileMenu (`src/components/navigation/mobile-menu.tsx`)

- Shown below `lg` now (tablets included): panel width bumps to `w-72 sm:w-80`.
- **Grouped nav** with mono group labels: `navGroupSections` ("Sections"/"Bagian") over
  the six section links, `navGroupPages` ("Pages"/"Halaman") over Notes.
- Links use `resolveNavHref` + the same active rules.
- **CV download button** added (full-width, `bg-foreground text-background`, download
  icon, localized `downloadCv`) above the language toggle row.
- **Motion**: panel slides in with a spring; links stagger-reveal (~40ms increments,
  slight x offset) — confident, visible motion per design preferences; fully disabled
  under `prefers-reduced-motion` (use the existing `use-reduced-motion` hook).
- **Focus management**: on open, focus moves into the dialog (close button); on close,
  focus returns to the hamburger. Escape handling unchanged.

### 5. ResearchSection (enabling change)

- Add a "View all research →" `Link` (`viewAllResearch` string) after the card grid,
  styled like the existing mono uppercase accent links (matches "Read abstract →").

### 6. New UI strings (`src/content/ui-strings.json`, EN/ID parity)

| key | en | id |
|---|---|---|
| `brandTagline` | Accounting · Research | Akuntansi · Riset |
| `navGroupSections` | Sections | Bagian |
| `navGroupPages` | Pages | Halaman |
| `viewAllResearch` | View all research → | Lihat semua riset → |

Aria-labels remain English (existing site convention).

## Error handling / edge cases

- `usePathname` returns basePath-stripped paths in Next; comparisons use `/`,
  `/notes`, etc. `withBasePath` applied only at render time, matching current code.
- On homepage, section links stay pure `#id` anchors — no full-page reload under
  static export, scroll-spy untouched.
- Command palette behavior unchanged (still consumes `allNavItems`).
- Reduced motion: stagger and spring degrade to instant/opacity-only.

## Testing

- `navbar.test.tsx`: exactly one "Research" link in the header; brand tagline renders;
  search button accessible name; existing brand/CV/theme/progress tests keep passing.
- `nav-links.test.tsx`: href resolution on `/` vs `/notes` (mock `usePathname`);
  page-link active state; existing underline test updated for new active rules.
- `mobile-menu.test.tsx`: CV link present when open; group labels; Notes present;
  single Research entry; focus lands in dialog on open.
- `research-section.test.tsx` (or new): "View all research" link points to `/research`.
- `ui-strings.test.ts` parity test picks up the four new keys automatically.
- Full suite + `next build` must pass.

## Post-review amendments (2026-08-07)

Code review of the implementation branch amended the spec on four points:

1. **Drawer portals to `document.body`** — the header's `-translate-x-1/2` and
   `backdrop-blur` create a containing block for `position: fixed` descendants, so
   the mobile overlay/panel must render via `createPortal` to span the viewport.
2. **Brand `aria-label` is "Dzaki Yusfian — Home"** (not the full name) — WCAG 2.5.3
   Label in Name requires the visible text to appear in the accessible name.
3. **Modal integrity** — `aria-modal="true"` is backed by a Tab focus trap and a body
   scroll lock while open; Escape restores focus to the hamburger.
4. **`aria-current` uses `"page"` / `"location"` tokens**; the mobile CV link drops
   its English `aria-label` in favor of its localized visible text.

## Out of scope

Footer links, command palette internals, section content, theme system, i18n plumbing.
