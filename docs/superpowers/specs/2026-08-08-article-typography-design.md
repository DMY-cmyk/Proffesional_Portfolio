# Article Typography — "Hybrid Journal" Reading Experience

**Date:** 2026-08-08
**Status:** Approved by Dzaki (brainstorming session with visual companion)
**Scope:** Research & Notes article bodies, listing-card polish, reusable long-form typography system

## Problem

The article pages `/research/[slug]` and `/notes/[slug]` style their MDX bodies with
Tailwind `prose prose-neutral dark:prose-invert …` classes, but `@tailwindcss/typography`
is not installed and not loaded via `@plugin`. The classes silently do nothing, and
Tailwind preflight strips all default element styling. Result: headings render at body
size, paragraphs have no spacing, ordered lists lose their numbers — a flat wall of
left-aligned text.

The rest of the site speaks a journal/editorial design language (Newsreader serif
display, JetBrains Mono labels, paper-and-ink palette, gold-numbered drawer nav,
journal masthead shipped 2026-08-07). The article body is the one surface that does
not match it.

## Decisions made during brainstorming

1. **Scope** — all three selected: article bodies (core), listing-page polish, and
   building it as one reusable typography system.
2. **Direction** — "Hybrid Journal" (option C): serif body wearing the masthead's
   jewelry — gold numbered sections, gold rules, editorial details. Chosen over
   "Classic Academic" (quiet serif) and "Modern Editorial" (sans body).
3. **Flourishes** — gold highlighter on bold phrases and editorial lists/pull-quotes
   are IN. Drop cap and italic lede are OUT (restrained article opening).
4. **Implementation** — hand-rolled `.article-body` CSS layer in `globals.css`
   (option B). No `@tailwindcss/typography` dependency, no per-element MDX components.

## Design specification

### The `.article-body` CSS layer (single source of truth)

Added to `src/styles/globals.css`, driven entirely by existing theme tokens so dark
mode works with zero additional rules.

**Body text**
- Font: `var(--font-display)` (Newsreader serif stack)
- Size 1.0625rem (17px), line-height 1.85
- Color `var(--muted)`; reading measure capped ~65ch (max-width on the content)
- Paragraph spacing: ~1em bottom margin

**Headings**
- `h2`: serif, ~1.375rem, `var(--foreground)`, letter-spacing -0.01em.
  Auto-numbered via CSS counters — a JetBrains Mono numeral (`01`, `02`, …,
  `decimal-leading-zero`) in `var(--accent-highlight)` before the heading text,
  baseline-aligned with a gap. A 36px × 2px rule in `var(--accent-highlight)`
  below each h2 (via `::after` or border treatment).
  Existing `scroll-mt-28` and id generation (TOC anchors) unchanged.
- `h3`: serif, ~1.125rem, no number, no rule — quiet sub-heading.
- Generous heading top margins (~2.25em) to paragraph rhythm.

**Inline elements**
- `strong` → gold marker highlight: background `var(--accent-highlight-soft)`,
  color `var(--foreground)`, font-weight 600, small horizontal padding,
  2px border-radius. (Replaces plain bold everywhere in article bodies.)
- `a` → `var(--accent-primary)`, underline with 3px offset, 1px thickness;
  hover moves to `var(--accent-primary-dark)`. Consistent with site links.
- `em` stays italic serif, no color change.

**Lists**
- `ol` → custom counters: JetBrains Mono numerals (`01`, `02`, …) in
  `var(--accent-highlight)`, hanging in the left gutter; item spacing ~0.5em.
- `ul` → gold dash/marker in `var(--accent-highlight)`, same hanging layout.
- Nested lists inherit the treatment without double-numbering surprises.

**Blockquotes**
- Italic serif pull-quote: ~1.0625–1.15em size, `var(--foreground)`,
  2px left rule in `var(--accent-highlight)`, ~18px left padding,
  vertical margins ~1.5em. No quotation-mark ornaments.

**Explicitly excluded** (user decision): drop caps, italic lede/first-paragraph
treatment, justified text, text animations. Accepted deviation (final review
2026-08-08): links keep the site-wide `transition: color 150ms ease` hover
fade — a color fade, not motion; reduced-motion is unaffected.

**Elements we own now** (styled minimally for future-proofing): `hr` (thin
`var(--border)` rule), `code` (mono, `var(--surface-alt)` chip), `img`
(max-width 100%, radius 2px), `table` (mono header labels, border tokens).
These may not appear in current content but must not render broken if added.

### Page integration

- `src/app/research/[slug]/page.tsx` — replace the dead
  `prose prose-neutral dark:prose-invert max-w-none prose-headings:…` class list
  with `article-body`. Title block, badges, PDF button, TOC (mobile + sidebar),
  ReadingProgress, CiteThis all unchanged.
- `src/app/notes/[slug]/page.tsx` — same swap.
- Reuse contract: any future long-form surface opts in by adding the
  `article-body` class to its content wrapper.

### Listing-card polish (deliberately minimal)

The only post-redesign inconsistency: card summaries are sans-serif while article
bodies become serif. Fix: set summary/abstract paragraphs in the serif voice.

- `src/components/ui/research-card.tsx` — abstract paragraph → `font-display`,
  ~0.9375rem, line-height 1.7 (keeps `text-muted`).
- `src/components/ui/featured-research-card.tsx` — abstract paragraph → same
  serif treatment (keeps its existing size/opacity intent).
- `src/app/notes/page.tsx` — note summary paragraph → same serif treatment.

Card layouts, hover states, badges, mono labels, and spacing are untouched.

## Error handling / edge cases

- **MDX content without h2s** (or fewer than 2): counters simply don't render
  numbers that don't exist; no layout dependency on heading count.
- **Long unbroken strings/URLs**: `overflow-wrap: break-word` on the body.
- **Dark mode**: all colors are theme tokens; `.dark` swap covers everything.
  Gold highlight uses `--accent-highlight-soft` (#3f2e1a in dark) with
  `--foreground` text — same pairing already used by the theme.
- **Print**: existing `print.css` continues to apply; no new rules required.

## Testing & verification

1. New Vitest component tests asserting the serif summary classes on
   `ResearchCard`, `FeaturedResearchCard`, and the notes listing.
2. Entire existing suite stays green (`npm run test:run`).
3. `npm run build` passes (static export, both article routes).
4. Manual visual pass in the running app before claiming completion:
   both articles, light + dark theme, mobile width (~375px) and desktop.
5. Accessibility: colors are existing WCAG-audited tokens; no new motion;
   reading measure capped; heading hierarchy (h1 → h2 → h3) preserved for
   screen readers and the TOC.

## Out of scope

- No changes to navigation, home page sections, or the Cite This component.
- No `@tailwindcss/typography` dependency.
- No content (MDX) edits.
- No animation additions to article bodies.
