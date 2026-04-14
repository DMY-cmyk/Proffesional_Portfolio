# Portfolio Redesign Spec — Direction C (Research Journal)

**Date:** 2026-04-14
**Direction chosen:** C — Research Journal
**Audience:** D (grad school admissions) + E (mixed professional network)
**Based on:** `docs/audits/current-design-audit.md` · `docs/critiques/hr-review-perspective.md` · `docs/visual-companion/options/direction-c.html`
**Status:** Draft (awaiting user review)

---

## 1. Goal

Reposition the portfolio from *"creative dark-themed premium site"* to *"credible early-career accounting researcher with modern polish."* The redesign must make three things unmistakable in the first 10 seconds:

1. Who this person is + where they are in their career.
2. That they do substantive research (thesis + working papers).
3. How to read the thesis, download the CV, and make contact.

## 2. Non-Goals

- Not migrating off Next.js / GitHub Pages. Framework, tooling, CI stay.
- Not rewriting the content-loader layer (`src/data/content.ts`). The facade works.
- Not removing a11y / SEO / test foundations. Those are kept and extended.
- Not adding backend features (no CMS, no dynamic data). Static content remains.
- Not designing for mobile-last or print-last. Both are first-class.

## 3. What Changes

### 3.1 Visual language

| Token | Before | After |
|-------|--------|-------|
| Default theme | Dark | **Light** (cool cream `#fbf9f4`) |
| Primary accent | Gold `#d4af37` (shimmer) | **Deep teal `#0d4f5c`** (primary) + **muted gold `#b8944a`** (single highlight for "featured" markers only) |
| Display font | Instrument Serif (italic only) | **Newsreader** (400/500/600, upright + italic for emphasis) |
| Body font | Inter | **Inter** (kept) |
| Mono font | JetBrains Mono | **JetBrains Mono** (kept) |
| Background noise overlay | Yes (0.025/0.04 opacity) | **Removed** |
| Aurora canvas | Yes | **Removed** |
| Custom cursor | Yes | **Removed** |
| Particles | Yes | **Removed** |
| Name shimmer gradient | Yes | **Removed** |
| Avatar glow pulse | Yes | **Removed** |
| Page transitions | Fade + scale | **Subtle fade only** (180ms) |
| Scroll reveal | Fade + Y translate | **Kept** — opacity only, 24px max translate, reduced-motion honoured |
| Hover states | Gold glow | **Border color shift + 1-2px translate** |

### 3.2 Information architecture

**Homepage section order changes from:**

`Hero → Profile → Timeline (experience+edu) → Certifications → Skills → Contact`

**To:**

`Hero → Research → Experience → Education → Credentials → Skills → Contact`

Rationale:
- Research is elevated to first section after hero (audience D imperative).
- Profile section removed — its content folds into the hero's status ribbon + bio paragraph.
- Timeline splits into Experience (roles) and Education (degree + thesis pointer) for clearer scanability.
- Certifications + Courses + Awards consolidate into one Credentials section, split into two columns (Certifications / Training).
- Skills remains but becomes tag-cloud style with context labels, not bars.

**Sub-pages preserved:** `/research/[slug]` (thesis + other papers) and `/certifications/[slug]` (individual cert detail) stay. Add `/research` listing page update to reflect new content structure.

### 3.3 Hero restructure

The hero becomes a two-column grid: left = text-dominant content, right = avatar.

**Left column contents (top to bottom):**
1. Eyebrow: owner name from `profile.json` (mono, small caps, teal)
2. H1: compositional headline pulled from `profile.json` — e.g., *"Accounting, tax, &amp; sustainability research."* (Newsreader 500, clamp 44–68px, letter-spacing -0.025em, with one word italicized and tinted in `--accent-highlight` for emphasis)
3. Italic sub-role line: single-sentence positioning statement (new `profile.positioning` field).
4. **Status ribbon** (horizontal bar, divider top+bottom): three inline stats read from the new `profile.statusLine` field — `Now · [current role]` / `Based in · [city]` / `Education · [degree · school · expected grad]`
5. Bio paragraph (17px, 2-3 lines) from `profile.bio`.
6. CTA row: `Read my research →` (primary, ink background, anchor to `#research`) + `Download CV` (secondary, bordered, href to `/files/cv/dzaki-cv.pdf`).

**Right column:** avatar image in a 4:5 aspect ratio rounded rectangle. No pulsing glow. Single soft box-shadow. Subtle border.

### 3.4 Research section (new)

The flagship section. Lives immediately after the hero.

**Structure:**
1. Section heading: `Research` + mono section number `Section 01`.
2. **Featured thesis card** — bordered on 3 sides + 3px teal left border + "Featured · Thesis" gold badge. Contains:
   - Meta row (mono): `Undergraduate Thesis · [completion month] · Advisor · [name if public]`
   - H3: thesis title (Newsreader 500, 28px, italicize one key phrase)
   - Abstract paragraph (16px, max-width 720px)
   - Tag row (5 tags max): subject area keywords
   - Read link: `Read full abstract &amp; download PDF →`
3. **Secondary research grid** (2 cols on desktop, 1 on mobile) for other papers — working papers, in-progress work, presentations. Each card:
   - Meta (mono): `[Paper Type] · [Year]`
   - H4: title
   - One-sentence description

### 3.5 Experience section

Timeline format with dates column left (200px), content column right.

**Each row:**
- Dates (mono, uppercase tracking) — active role marked in gold with `now` indicator
- Role (Newsreader 500, 22px)
- Org + location (muted, smaller)
- Bullet list with short teal dash markers (not standard bullets)
- Quantified bullets get a subtle warm-gold highlight pill — e.g. `↑ 30% on-time submissions` — used sparingly to draw the eye to numbers

### 3.6 Education section

Single compact block. Degree title as H3. School + dates. 3–4 bullets. Thesis title links to the research section anchor.

### 3.7 Credentials section

Two-column grid: Certifications / Training &amp; Courses.

Each item: name (bold 15px), issuer + date (muted), optional credential ID in mono small text. No card background — vertical list divided by hairline rules.

(Awards are promoted inline here if the user adds them. For now, Awards subsection is rendered only when non-empty — no more "hidden empty section" unfortunate rendering.)

### 3.8 Skills section

Three columns: Technical / Tools &amp; Software / Research &amp; Soft.

Each skill rendered as a pill with:
- Name (primary, 13px, weight 500)
- Optional **context label** in mono small caps (e.g., `· applied`, `· coursework`, `· daily`, `· research`, `· DJP`)

**No percentages. No bars. No progress rings.** The context label does the work a percentage was pretending to do, but honestly — it tells a reviewer *where* the skill was used, which is what they actually want to know.

### 3.9 Contact section

Two-column grid: narrative block + contact list.

- Left: H2 "Open to research collaboration, internships, and conversation." + paragraph + primary/secondary CTAs.
- Right: bordered list — `Email / LinkedIn / GitHub / Location` with mono labels.
- **Instagram and TikTok removed** from the professional portfolio. (Content json retains them; components don't render them.)

### 3.10 Navbar

Transparent-with-blur sticky top bar. Left: wordmark `Dzaki.` with teal accent on the period. Right: section links (mono caps small, 11.5px) + a persistent inline `↓ Download CV` button that stays visible on scroll.

### 3.11 Footer

Minimal. Mono. Two items: copyright left / stack attribution right.

---

## 4. What Stays

- **Next.js 15 + React 19** framework and all tooling.
- **Content JSON schema** in `src/content/` — add optional fields, don't break existing.
- **Content loader facade** (`src/data/content.ts`).
- **Vitest test suite** — tests get updated, not removed.
- **SEO foundation** — metadata, JSON-LD, sitemap, robots.txt.
- **Accessibility foundation** — skip link, focus styles, aria labels, reduced-motion support.
- **Performance foundation** — lazy loading, preconnect, route-level code splitting.
- **GitHub Pages deploy** and basePath logic.
- **Theme toggle** — but default changes from dark to light. Dark remains available as an option.
- **`/research` and `/certifications/[slug]` sub-page routes.**

---

## 5. Content changes required

These are **content**, not code, but block the redesign from shipping credibly.

### 5.1 Must-delete-or-replace

- [ ] Remove `placeholder-research` entry from `src/content/research/index.json` — replace with real entries or hide the research section until real content exists.

### 5.2 Must-expand

- [ ] Expand thesis representation in `education.json` + add a research index entry pointing at the existing `sustainability-reporting-firm-value.mdx` with:
  - Real abstract
  - Advisor name (optional, if public)
  - Completion date
  - Tags
  - Optional PDF path
- [ ] Add at least 1–2 additional research entries (working papers, in-progress, presentations) to the research index — user said audience E applies, meaning real pieces exist.
- [ ] Clarify whether `Brevet A &amp; B Taxation` (IAI) and `Brevet Pajak AB` (UGM) are the same credential, related, or different. Update JSON accordingly.

### 5.3 Must-prune

- [ ] Remove `instagram` and `tiktok` from `contact.json` **or** add a `professional: boolean` flag and only render `professional: true` links in components.

### 5.4 Schema additions

- Add optional fields to `src/types/content.ts`:
  - `ProfileData.positioning?: string` — single-sentence hero sub-role line
  - `ProfileData.statusLine?: { role: string; basedIn: string; education: string }`
  - `ProfileData.headline?: { plain: string; emphasis: string; suffix: string }` — tokenized H1 so we can italicize/tint one phrase without embedding HTML in JSON
  - `ResearchEntry.type?: 'thesis' | 'working-paper' | 'in-progress' | 'presentation' | 'published'`
  - `ResearchEntry.featured?: boolean`
  - `ResearchEntry.advisor?: string`
  - `ResearchEntry.venue?: string`
  - `SkillItem.context?: string` (replaces `level`)
- Mark `SkillItem.level` as deprecated (keep for one release so JSON doesn't break; stop reading it in components).

---

## 6. Component changes

### 6.1 To remove

| Component | Why |
|-----------|-----|
| `src/components/motion/aurora-background.tsx` | Aesthetic mismatch for audience D+E |
| `src/components/motion/custom-cursor.tsx` | Aesthetic mismatch |
| CSS: `.hero-gradient-text` shimmer keyframes | Aesthetic mismatch |
| CSS: `.animate-avatar-glow` | Aesthetic mismatch |
| Avatar glow wrapper in `hero-section.tsx` | Aesthetic mismatch |

Keep `hover-glow.tsx`, `scroll-reveal.tsx`, `stagger-children.tsx`, `page-transition.tsx` — but simplify page-transition to opacity-only.

### 6.2 To add / rewrite

| Component | Action | Purpose |
|-----------|--------|---------|
| `src/components/sections/research-section.tsx` | **New** | The flagship featured section (thesis card + grid). |
| `src/components/sections/education-section.tsx` | **New** | Dedicated education block. |
| `src/components/sections/profile-section.tsx` | **Delete** | Folded into hero status ribbon + bio. |
| `src/components/sections/timeline-section.tsx` | **Rename &amp; refocus** → `experience-section.tsx` — experience only. |
| `src/components/sections/certifications-section.tsx` | **Rewrite** → `credentials-section.tsx` — combines certs + courses + awards. |
| `src/components/sections/skills-section.tsx` | **Rewrite** — tag cloud with context labels, no bars. |
| `src/components/sections/hero-section.tsx` | **Rewrite** per spec 3.3. |
| `src/components/ui/featured-research-card.tsx` | **New** | Thesis feature card. |
| `src/components/ui/research-card.tsx` | **New** | Secondary research item. |
| `src/components/ui/skill-pill.tsx` | **New** | Replaces SkillBar. |
| `src/components/ui/status-ribbon.tsx` | **New** | Hero status line component. |
| `src/components/layout/navbar.tsx` | **Update** | Add persistent CV download button; adjust typography. |

### 6.3 Tests

- Every new component gets a test file (RED → GREEN cycle).
- Existing tests for removed components deleted.
- Existing tests for rewritten components updated to match new DOM.
- Critical-path DOM assertions for the hero + research-section (e.g., thesis title renders, "Featured · Thesis" badge present, CV download link renders). No visual regression tooling.

---

## 7. Design tokens

Replace `src/styles/globals.css` theme section with:

```css
:root {
  /* Paper (light default) */
  --background: #fbf9f4;
  --surface: #ffffff;
  --surface-alt: #fefcf6;
  --foreground: #0f1419;
  --muted: #4a5568;
  --subtle: #718096;
  --border: #e6ddd0;

  /* Accents */
  --accent-primary: #0d4f5c;   /* deep teal — CTAs, links, active states */
  --accent-primary-dark: #0a3d47;
  --accent-highlight: #b8944a; /* muted gold — ONLY for "featured" ribbons and key number pills */
  --accent-highlight-soft: #fef7e0;
}

.dark {
  /* Dark retained but repositioned as secondary */
  --background: #0f1419;
  --surface: #1a2028;
  --surface-alt: #141a22;
  --foreground: #f1e9d8;
  --muted: #9ca3af;
  --subtle: #6b7280;
  --border: #2d3748;
  --accent-primary: #2dd4bf;
  --accent-primary-dark: #14b8a6;
  --accent-highlight: #d4b574;
  --accent-highlight-soft: #3f2e1a;
}
```

Typography stays on Inter / Newsreader (new) / JetBrains Mono. **Instrument Serif is removed.**

Spacing scale and container widths follow Tailwind defaults; `max-w-6xl` (1152px) stays as the main container width, tightened to `max-w-5xl` (1024px) for research long-form.

---

## 8. Motion

**Restrained.** Allowed:
- Opacity fade on section entry (`viewport once: true`, duration 400ms).
- Up to 24px Y-translate on entry — only on hero block, not on every section.
- Hover: 1–2px Y-lift + border color shift on cards.
- Focus: 2px teal outline (WCAG compliant).

**Forbidden:**
- Shimmer / gradient animations on text.
- Parallax scrolling.
- Cursor-tracking effects.
- Canvas-based ambient animations.
- Avatar glow pulses.
- Page transitions that scale/blur.

All motion wrapped in `useReducedMotion` check — when `true`, motion components render static.

---

## 9. Accessibility

- **Semantic landmarks:** `<header>`, `<main>`, `<section>` per area, `<footer>`.
- **Headings:** single H1 (hero), H2 per section, H3/H4 within.
- **Color contrast:** WCAG AA for all body / link / button text — validated against both light and dark tokens. Spot-check with tooling as last step.
- **Focus order:** matches visual order; no tab traps.
- **Skip link:** retained, styled to new palette.
- **Reduced motion:** full support — motion components render static content.
- **Image alt:** avatar + all images have descriptive alt.
- **Language:** `lang="en"` on html.
- **Print styles:** new stylesheet ensures a reviewer can print to PDF and get a clean CV-like document (navbar/footer hidden; section numbers retained; dark mode disabled for print).

---

## 10. Performance

- Keep existing lazy imports for below-fold sections.
- Remove aurora/cursor modules entirely — bundle shrinks further.
- Avatar image stays at current size; serve as WebP if not already.
- Research thesis PDF link: use `<a>` with `rel="noopener"` and appropriate Content-Disposition when hosted.
- Lighthouse targets: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95.

---

## 11. SEO

- `site.json` title stays as-is.
- `description` updated to lead with research: *"Dzaki Muhammad Yusfian — accounting &amp; finance professional researching sustainability reporting and firm value, based in Jakarta, Indonesia."*
- OG image updated to reflect new branding (regenerated if needed).
- JSON-LD Person schema expanded: add `alumniOf` (STIE YKPN), `worksFor`, `knowsAbout` array (taxation, auditing, sustainability reporting, financial analysis).
- New `<meta>` for academic: `citation_author`, `citation_title` on research detail pages (helps Google Scholar).

---

## 12. Implementation order (chunks)

To be expanded by writing-plans into a full plan. Rough order:

**Chunk 1 — Content surgery (no UI work):**
- Remove placeholder research entry.
- Expand thesis metadata in research index.
- Prune Instagram / TikTok from professional rendering.
- Clarify Brevet duplication.

**Chunk 2 — Design tokens + base CSS:**
- Replace globals.css theme section.
- Add Newsreader, remove Instrument Serif import.
- Default theme → light; dark remains via toggle.
- Remove noise overlay, shimmer, glow animations.

**Chunk 3 — Remove obsolete motion components:**
- Delete aurora-background, custom-cursor.
- Simplify page-transition.

**Chunk 4 — Shared UI primitives:**
- Build `status-ribbon`, `skill-pill`, `featured-research-card`, `research-card`.
- Tests for each.

**Chunk 5 — Section rewrites (one per commit):**
- Hero → new status ribbon + CTAs + avatar.
- Research (new).
- Experience (renamed from timeline).
- Education (new).
- Credentials (consolidated).
- Skills (tag cloud).
- Contact (pruned).

**Chunk 6 — Navbar + footer:**
- Persistent CV button.
- Reduced social list.

**Chunk 7 — Research detail page update.**

**Chunk 8 — Print stylesheet + SEO updates.**

**Chunk 9 — QA + Lighthouse + accessibility sweep + visual check.**

**Chunk 10 — Ship.**

---

## 13. Open questions for the user

Flagged here so writing-plans can address them before implementation begins:

1. **Thesis PDF publishing:** is the thesis PDF shareable publicly? If yes, we host it under `public/files/research/`. If not, the "Download PDF" CTA becomes "Request PDF (email)".
2. **Thesis advisor name:** publish or not?
3. **Other research pieces:** user said they have more than the thesis (audience E). Please provide titles, brief descriptions, dates, and any PDFs so chunks 1 and 5 can be populated with real content.
4. **Brevet duplication:** IAI Brevet vs UGM Brevet — same credential, related, or different? Content change needed.
5. **Instagram / TikTok fate:** strip entirely, or move to a separate "Personal" page linked in footer only? (Default: strip entirely from professional rendering; content JSON retains them behind a `professional:true` flag.)
6. **Currency of site.json description:** am I clear to update the description and title to include "sustainability reporting research"?

(Dark mode retained as a toggle with light as the default — this is a decided point, not an open question; see Design Decisions log.)

---

## 14. Done-definition

The redesign is "done" when:

- [ ] No placeholder entries remain anywhere in content JSON.
- [ ] All seven homepage sections render per this spec in both light and dark mode.
- [ ] Lighthouse scores hit the targets in section 10.
- [ ] All new component tests pass; obsolete tests removed.
- [ ] A keyboard-only user can navigate every interactive element.
- [ ] Printing to PDF produces a clean CV-like document.
- [ ] The aurora / custom-cursor / shimmer / glow code and CSS is gone.
- [ ] Deployed to GitHub Pages, live URL verified.
- [ ] README updated with new section overview.
