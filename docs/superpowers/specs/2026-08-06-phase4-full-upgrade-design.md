# Phase 4 — Full Upgrade Design

**Date:** 2026-08-06
**Status:** Approved by Dzaki (2026-08-06)
**Scope:** 16 features across motion, substance, and quality — the complete "DO IT ALL" menu.

## Context

The portfolio (Next.js 15 static export → GitHub Pages) is healthy: 195/195 tests green, clean build, WCAG AA, full motion layer from Phase 3 (wave background, custom cursor, skills filter, scroll reveals). This phase adds ambition on top of a solid foundation. One pre-phase bug was already fixed: stale `gold` class assertions in `nav-links.test.tsx` (commit `0b7067a`).

## Goals

1. Push visual identity further with signature motion moments (hero, timeline, transitions).
2. Deepen academic/professional substance (journal-grade research reading, bilingual EN/ID, blog, testimonials).
3. Keep every existing guarantee: reduced-motion support, WCAG AA, static export + basePath, 100% green tests at every stage.

## Non-Goals

- No new runtime dependencies (everything builds on Framer Motion, Tailwind 4, existing MDX stack; command palette is hand-rolled).
- No full translation of MDX research articles (B2 covers UI + JSON content only; article translation is a future phase).
- No fabricated testimonial content — B5 ships structure only until real quotes are provided.
- No server-side features (site must remain a pure static export).

## Stage Plan (execution order)

Small → large; content-restructuring work last. One commit (or a few focused commits) per stage; full test suite green before each commit.

### Stage 1 — Baseline & docs (C2, C1-baseline)
- Update README: test count (195), changelog entry for the nav-links test fix.
- Record baseline Lighthouse scores (performance, a11y, best practices, SEO) for `/` in `docs/superpowers/specs/2026-08-06-phase4-lighthouse.md`; Stage 10 appends the final scores there for comparison.

### Stage 2 — Micro-interaction quick wins (A5, A8, A3)
- **A5 Link underline draw-on:** global utility class for in-content links and nav links — underline scales from left on hover (`transform-origin: left`, ~200ms). CSS-only; respects reduced motion trivially (color change still occurs).
- **A8 Magnetic buttons:** `Button` (primary/secondary, href and button forms) translates up to ~6px toward cursor within a small proximity radius, spring-returns on leave. Pointer-fine devices only; disabled under reduced motion and on touch.
- **A3 Stat count-up strip:** new `StatsStrip` component on the homepage (between Hero and Research). Data-driven from new `src/content/stats.json` (e.g., GPA, certifications count, years experience, research count). Numbers animate from 0 with `useInView` once; reduced motion renders final values statically.

### Stage 3 — Cinematic dark mode (A6)
- Theme toggle wraps the class flip in `document.startViewTransition` with a circular `clip-path` reveal expanding from the toggle button.
- Feature-detected: browsers without the View Transitions API get the current instant toggle. Reduced motion skips the transition.

### Stage 4 — Hero intro sequence (A1)
- Headline reveals word-by-word with a masked rise (overflow-hidden line wrappers, y-translate + opacity per word, ~40ms stagger).
- Eyebrow, positioning line, status ribbon, bio, CTAs follow in the existing stagger order but retimed to feel like one composed sequence (total ≤ 1.2s).
- Avatar keeps its scale-in, delayed to land with the headline's completion.
- Reduced motion: everything renders instantly (existing guard pattern).

### Stage 5 — Scroll-driven mid-page motion (A2, A7)
- **A2 Self-drawing timeline:** Experience & Education timelines get an SVG spine whose `pathLength` is driven by `useScroll`/`useTransform` progress through the section; each node + card reveals as the line passes it. Falls back to the current static line under reduced motion.
- **A7 Scroll-reactive waves:** wave background gains a scroll-velocity input — amplitude/turbulence eases up briefly during fast scrolling, settles when idle. Keeps existing throttling (16ms), DPR awareness, visibilitychange pause, and CPU budget (<1%).

### Stage 6 — Route transitions (A4)
- Upgrade `PageTransition`: outgoing page fades/slides subtly, incoming page enters with a short vertical rise — evoking a page turn without literal 3D flip (keeps opacity+transform-only rule, no blur).
- Applies globally to all route changes (existing routes now; `/notes` inherits it automatically when added in Stage 9).

### Stage 7 — Journal-grade research reading (B1, B6)
- **B1 Reading experience** on `/research/[slug]`:
  - Sticky table of contents (desktop sidebar; mobile collapsible) auto-built from MDX h2/h3 headings, with scroll-spy active state (reuse `use-scroll-spy`).
  - Top reading-progress bar (thin teal line under navbar).
  - Reading-time estimate in the article header (words ÷ 200 wpm).
  - **"Cite this"** block: APA and BibTeX generated from frontmatter (author, title, year, type), copy-to-clipboard buttons with success feedback.
- **B6 Per-article OG images:** build-time Sharp script (extends existing OG generation) renders a branded 1200×630 card per research article (title + author + site mark); wired into each article's `generateMetadata`.

### Stage 8 — Command palette (B4)
- Hand-rolled `CommandPalette` (no library): Ctrl+K / Cmd+K opens a centered modal with fuzzy-ish substring filtering over navigation items, section anchors, research articles, and actions (toggle theme, download CV, copy email). The command source list is data-driven; Stage 9 registers notes entries when that surface exists.
- Full keyboard support (↑↓ navigate, Enter select, Esc close), focus trap, `role="dialog"` + `aria` wiring, background scroll lock. A subtle "Ctrl K" hint chip in the navbar (hidden on mobile).

### Stage 9 — New content surfaces (B3, B5)
- **B3 Blog/Notes:** mirror the research pattern — `src/content/notes/*.mdx` + index JSON, routes `/notes` and `/notes/[slug]` (static params), card list styled like research cards but lighter. Navbar gains "Notes". Ships with one real starter note (a plain-language summary of the thesis) that Dzaki can replace/extend.
- **B5 Testimonials:** `src/content/testimonials.json` (quote, name, role, relationship). New `TestimonialsSection` renders on the homepage (between Credentials and Skills) **only when the array is non-empty** — ships empty, so nothing changes visually until real quotes are added. No fabricated content ever.

### Stage 10 — Bilingual EN/ID (B2) + final audit
- **Language system:** `LanguageProvider` (mirrors `ThemeProvider` pattern) with `en`/`id`, persisted to localStorage, defaulting to `en`; pre-hydration script prevents language flash (same technique as theme).
- **Content restructure:** localizable string fields in content JSON become `{ "en": ..., "id": ... }`; typed accessor in `data/content.ts` resolves by active language with EN fallback. UI strings (nav labels, buttons, form labels, section headings) move to a `src/content/ui-strings.json` dictionary.
- **Toggle:** compact EN/ID switch in navbar beside theme toggle (and in mobile menu).
- **Translations:** Indonesian drafts written from existing English content; **Dzaki reviews all ID copy before push/deploy.**
- MDX research articles remain single-language (see Non-Goals).
- **Final audit:** full test suite, lint, production build, basePath spot-check of exported HTML, Lighthouse re-run compared against Stage 1 baseline, README/changelog updated with Phase 4 notes.

## Architecture Notes

- **New components:** `StatsStrip`, `TimelineSpine` (SVG scroll-drawn line), `TableOfContents`, `ReadingProgress`, `CiteThis`, `CommandPalette`, `TestimonialsSection`, `LanguageToggle`, `MagneticWrapper` (or built into `Button`).
- **New hooks:** `useCountUp`, `useMagnetic` (pointer proximity), `useLanguage`; reuse `useReducedMotion`, `useScrollSpy`, `useIsTouch`, `useViewportVisible`.
- **New content files:** `stats.json`, `testimonials.json`, `ui-strings.json`, `notes/*.mdx` (+ index).
- **Data flow unchanged:** JSON/MDX → typed loaders in `src/data/content.ts` → components. B2 adds a language parameter to loaders for localized fields.
- **Every motion feature** gates on `useReducedMotion` (and touch where relevant) and uses the shared easing `cubic-bezier(0.22, 1, 0.36, 1)` + existing duration conventions.

## Error Handling & Fallbacks

- View Transitions API: feature-detect; fall back to instant theme change.
- Canvas/scroll velocity: guarded by existing capability checks; no new work on hidden tabs.
- Clipboard (Cite this / copy email): `navigator.clipboard` with fallback message if unavailable.
- Empty-state rules: testimonials section hidden when empty; notes index handles zero articles.
- Missing translation: ID falls back to EN string (never blank UI).

## Testing Strategy

- Unit tests per new component/hook following existing Vitest + RTL patterns (mock framer-motion as in current tests).
- Key cases: count-up renders final value under reduced motion; palette opens on Ctrl+K, filters, navigates, traps focus; TOC builds from headings and marks active; citation strings formatted correctly (APA & BibTeX); language toggle persists and falls back to EN; testimonials section absent when JSON empty; magnetic disabled on touch/reduced-motion.
- Gate: full suite green + clean `next build` before every stage commit.

## Risks & Mitigations

- **Scope size** → strict stage order, separate commits, each stage independently shippable; can pause after any stage.
- **B2 touches everything** → done last; typed accessors make missed fields a compile-time error where possible.
- **Motion accumulation hurting performance** → Lighthouse baseline (Stage 1) vs final (Stage 10) comparison; existing CPU budget rules apply.
- **Testimonial/translation content depends on Dzaki** → B5 ships empty-safe; B2 has an explicit review gate before deploy.
