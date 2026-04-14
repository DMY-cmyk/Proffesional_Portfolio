# Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from a dark creative-style aurora/cursor site into a scholarly-modern research portfolio (Direction C — Research Journal) with Research as the homepage flagship, credible hero proof, tag-cloud skills, and pruned socials.

**Architecture:** Same Next.js 15 static export stack. Content stays JSON+MDX. Visual layer replaced: new CSS tokens (cool cream paper, deep teal primary, muted gold highlight), new typography (Newsreader serif + Inter + JetBrains Mono), remove aurora/cursor/shimmer/glow. New Research section component, new `/personal` route, contact shape restructure, skill-bars → tag pills with context labels.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion (restrained), Vitest + React Testing Library, GitHub Pages static export.

**Spec:** `docs/specs/redesign-spec.md`

**Decisions log:** `docs/decisions/design-decisions.md`

**Audit / critique:** `docs/audits/current-design-audit.md` · `docs/critiques/hr-review-perspective.md`

**Branch strategy:** work on `main` with frequent commits. Each task = 1 commit. If a task introduces a breaking intermediate state, pair that commit with the follow-up fix in the next task.

**Baseline before starting:** commit `24ffa99`, 39 test files, all tests passing on main.

---

## File Structure Overview

### Create

| File | Responsibility |
|------|----------------|
| `src/components/sections/research-section.tsx` | Flagship research section with Featured Thesis card + conditional grid |
| `src/components/sections/experience-section.tsx` | Experience timeline (work roles only) |
| `src/components/sections/education-section.tsx` | Dedicated education block with thesis pointer |
| `src/components/sections/credentials-section.tsx` | Consolidated certs + training + awards |
| `src/components/ui/status-ribbon.tsx` | Hero status line component (Now · Based · Education) |
| `src/components/ui/skill-pill.tsx` | Skill tag with optional context label (no % bars) |
| `src/components/ui/featured-research-card.tsx` | Thesis feature card |
| `src/components/ui/research-card.tsx` | Secondary research entry card |
| `src/app/personal/page.tsx` | Personal page with IG + TikTok, linked from footer only |
| `src/styles/print.css` | Print stylesheet for CV-quality output |
| `tests/components/sections/research-section.test.tsx` | Test |
| `tests/components/sections/experience-section.test.tsx` | Test |
| `tests/components/sections/education-section.test.tsx` | Test |
| `tests/components/sections/credentials-section.test.tsx` | Test |
| `tests/components/ui/status-ribbon.test.tsx` | Test |
| `tests/components/ui/skill-pill.test.tsx` | Test |
| `tests/components/ui/featured-research-card.test.tsx` | Test |
| `tests/components/ui/research-card.test.tsx` | Test |
| `tests/app/personal-page.test.tsx` | Test |

### Modify

| File | What changes |
|------|--------------|
| `src/types/content.ts` | Add new fields; restructure `ContactInfo` |
| `src/data/content.ts` | Update getter return types; `getContact()` returns new shape |
| `src/content/site.json` | New title + description |
| `src/content/profile.json` | Add `positioning`, `headline`, `statusLine` |
| `src/content/contact.json` | Restructure into `{ professional, personal }` |
| `src/content/research/index.json` | Remove placeholder; expand thesis entry with real metadata |
| `src/content/courses.json` | Remove UGM Brevet duplicate |
| `src/content/education.json` | Shrink thesis bullet to pointer |
| `src/content/research/sustainability-reporting-firm-value.mdx` | Replace placeholder frontmatter + body with real abstract |
| `src/styles/globals.css` | New tokens (paper/ink/teal/gold-muted); remove shimmer/glow/noise |
| `src/app/layout.tsx` | Swap Instrument Serif → Newsreader; remove aurora + custom-cursor imports |
| `src/app/page.tsx` | New section order |
| `src/components/layout/navbar.tsx` | New look + persistent CV download button |
| `src/components/layout/footer.tsx` | Remove IG/TikTok; add `personal →` link |
| `src/components/sections/hero-section.tsx` | Rewrite per spec 3.3 |
| `src/components/sections/skills-section.tsx` | Tag cloud instead of bars |
| `src/components/sections/contact-section.tsx` | Rewrite — only professional contacts |
| `src/components/ui/card.tsx` | Simplify — remove gold glow, use teal border hover |
| `src/components/ui/button.tsx` | New variants using teal primary |
| `src/components/ui/badge.tsx` | Remove gold shimmer |
| `src/components/ui/section-heading.tsx` | Teal section number; remove gold |
| `src/components/motion/page-transition.tsx` | Fade only, no scale/blur |
| `src/app/research/page.tsx` | Update to new tokens |
| `src/app/research/[slug]/page.tsx` | Update to new tokens; hide PDF button if no `pdfPath` |
| `src/app/metadata.ts` | Update JSON-LD `knowsAbout` |
| `src/components/layout/json-ld.tsx` | Expand schema |
| Various existing tests | Update DOM assertions for new structure |

### Delete

| File | Reason |
|------|--------|
| `src/components/motion/aurora-background.tsx` | Aesthetic mismatch (spec 3.1) |
| `src/components/motion/custom-cursor.tsx` | Aesthetic mismatch |
| `src/components/sections/profile-section.tsx` | Folded into hero |
| `src/components/sections/timeline-section.tsx` | Split into experience + education |
| `src/components/sections/certifications-section.tsx` | Replaced by credentials-section |
| `src/components/ui/timeline-item.tsx` | Replaced by inline timeline layout |
| `tests/components/motion/aurora-background.test.tsx` | Component deleted |
| `tests/components/motion/custom-cursor.test.tsx` | Component deleted |
| `tests/components/sections/profile-section.test.tsx` | Component deleted |
| `tests/components/sections/timeline-section.test.tsx` | Component deleted |
| `tests/components/sections/certifications-section.test.tsx` | Component deleted |
| `tests/components/ui/timeline-item.test.tsx` | Component deleted |

---

## Chunk 1 — Content Surgery (no UI work)

Pure JSON/content edits. Zero visual change. Tests should still pass because components still use old JSON shapes (restructures happen later).

### Task 1.1: Remove placeholder research entry

**Files:**
- Modify: `src/content/research/index.json`

- [ ] **Step 1: Rewrite the file with only the thesis entry, populated with real metadata**

Replace contents with:

```json
[
  {
    "title": "The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector",
    "slug": "sustainability-reporting-firm-value",
    "abstract": "This study examines whether the quality of sustainability disclosure — not merely its presence — affects firm value among publicly listed Indonesian manufacturers. Using panel data across a five-year window and GRI Standards as the disclosure reference, the research tests the relationship between disclosure quality and firm value (Tobin's Q and market-to-book), controlling for leverage, size, and profitability. Findings inform how Indonesian regulators, standard-setters, and investors should read the growing corpus of sustainability reports.",
    "tags": ["sustainability reporting", "firm value", "panel data", "GRI Standards", "IDX manufacturers"],
    "date": "2026-04",
    "type": "thesis",
    "featured": true
  }
]
```

- [ ] **Step 2: Run existing tests**

Run: `npm run test:run -- tests/data/content.test.ts`
Expected: PASS (content.test.ts iterates through entries; shape still matches `ResearchEntry`).

- [ ] **Step 3: Commit**

```bash
git add src/content/research/index.json
git commit -m "content: remove placeholder research entry, expand thesis metadata"
```

### Task 1.2: Remove UGM Brevet duplicate from courses

**Files:**
- Modify: `src/content/courses.json`

- [ ] **Step 1: Edit courses.json to remove the UGM Brevet entry**

Replace contents with:

```json
[
  {
    "name": "English for Professional Development",
    "provider": "Duta Wacana Christian University",
    "date": "2023-06",
    "certificateUrl": ""
  }
]
```

- [ ] **Step 2: Run tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/content/courses.json
git commit -m "content: remove UGM Brevet duplicate (same credential as IAI entry)"
```

### Task 1.3: Shrink thesis bullet in education

**Files:**
- Modify: `src/content/education.json`

- [ ] **Step 1: Replace the `details` array**

Replace contents with:

```json
[
  {
    "school": "STIE YKPN Business School Yogyakarta",
    "degree": "Bachelor of Accounting",
    "field": "Accounting",
    "startDate": "2022-09",
    "endDate": "2026-04",
    "details": [
      "Focus on taxation, auditing, and financial reporting.",
      "Active in academic research and student organizations.",
      "Thesis: see the Research section."
    ]
  }
]
```

- [ ] **Step 2: Run tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/content/education.json
git commit -m "content: promote thesis to research section, shrink edu bullet"
```

### Task 1.4: Update site.json title + description

**Files:**
- Modify: `src/content/site.json`

- [ ] **Step 1: Replace contents**

```json
{
  "title": "Dzaki Muhammad Yusfian — Accounting · Finance · Tax · Audit Enthusiast",
  "description": "Dzaki Muhammad Yusfian is an accounting, finance, tax, and audit enthusiast. Operations Officer at Kolosal AI, Jakarta. Undergraduate research on sustainability reporting and firm value in Indonesian manufacturing.",
  "url": "https://DMY-cmyk.github.io/Proffesional_Portfolio",
  "ogImage": "/Proffesional_Portfolio/images/og-image.jpg",
  "locale": "en"
}
```

- [ ] **Step 2: Run tests**

Run: `npm run test:run`
Expected: PASS (metadata tests read the fields, don't compare strings).

- [ ] **Step 3: Commit**

```bash
git add src/content/site.json
git commit -m "content: update site title and description per redesign spec"
```

### Task 1.5: Expand profile.json with hero fields

**Files:**
- Modify: `src/content/profile.json`

- [ ] **Step 1: Replace contents**

```json
{
  "name": "Dzaki Muhammad Yusfian",
  "title": "Accounting, tax & sustainability research",
  "tagline": "Early-career accounting professional researching sustainability reporting and firm value.",
  "bio": "Specializing in tax compliance, auditing, and financial analysis — with ongoing research on how sustainability reporting affects firm value in Indonesian manufacturing. Previously a Tax Volunteer at DJP, serving 90+ taxpayers and running community outreach across Bantul Regency.",
  "brandStatement": "Transforming financial complexity into clarity.",
  "avatar": "/images/profile/avatar.jpg",
  "headline": {
    "plain": "Accounting, tax, &",
    "emphasis": "sustainability research",
    "suffix": "."
  },
  "positioning": "Early-career professional working at the intersection of financial reporting and sustainability disclosure.",
  "statusLine": {
    "now": "Operations Officer @ Kolosal AI",
    "basedIn": "Jakarta, Indonesia",
    "education": "B.Acc. · STIE YKPN · Apr 2026"
  }
}
```

- [ ] **Step 2: Run tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/content/profile.json
git commit -m "content: expand profile with headline, positioning, statusLine"
```

### Task 1.6: Restructure contact.json

**Files:**
- Modify: `src/content/contact.json`

- [ ] **Step 1: Replace contents**

```json
{
  "professional": {
    "email": "dmy.23022004@gmail.com",
    "linkedin": "https://www.linkedin.com/in/dzakimyusfian/",
    "github": "https://github.com/DMY-cmyk",
    "location": "Jakarta, Indonesia"
  },
  "personal": {
    "instagram": "https://instagram.com/dzaki_yusfian",
    "tiktok": "https://tiktok.com/@dmy_0223",
    "note": "A few corners of the internet where I share tax-literacy content and personal updates."
  }
}
```

- [ ] **Step 2: Do NOT run tests yet**

Tests currently read `contact.email` as a top-level property. They will fail until we update the type + loader + components. Task 2.1 fixes this.

- [ ] **Step 3: Commit**

```bash
git add src/content/contact.json
git commit -m "content: split contact into professional + personal groups"
```

### Task 1.7: Update MDX thesis abstract placeholder

**Files:**
- Modify: `src/content/research/sustainability-reporting-firm-value.mdx`

- [ ] **Step 1: Read current content**

```bash
cat src/content/research/sustainability-reporting-firm-value.mdx
```

- [ ] **Step 2: Rewrite the frontmatter + body with real thesis content**

Replace contents with:

```mdx
---
title: "The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector"
slug: "sustainability-reporting-firm-value"
abstract: "This study examines whether the quality of sustainability disclosure — not merely its presence — affects firm value among publicly listed Indonesian manufacturers. Using panel data and GRI Standards as the disclosure reference, the research tests the relationship between disclosure quality and firm value (Tobin's Q and market-to-book), controlling for leverage, size, and profitability."
tags: ["sustainability reporting", "firm value", "panel data", "GRI Standards", "IDX manufacturers"]
date: "2026-04"
---

## Research Question

Does the **quality** of sustainability disclosure — not merely its presence — affect firm value among publicly listed Indonesian manufacturers?

## Motivation

Sustainability reporting has moved from voluntary disclosure toward institutional expectation, yet the question of whether investors actually price sustainability information remains contested in emerging markets. This thesis seeks to clarify that relationship for Indonesian manufacturing firms listed on IDX.

## Method

- **Sample:** publicly listed Indonesian manufacturers (IDX), five-year panel window.
- **Disclosure reference:** GRI Standards.
- **Firm-value proxies:** Tobin's Q and market-to-book ratio.
- **Controls:** leverage, firm size, profitability.
- **Analysis:** panel data regression with appropriate fixed-effects.

## Key Findings

Findings and their implications are discussed in the full paper. If you are a researcher, recruiter, or admissions reviewer interested in the complete methodology and results, please [reach out by email](mailto:dmy.23022004@gmail.com).

## Implications

The study informs how Indonesian regulators, standard-setters, and investors should read the growing corpus of sustainability reports — and where the gap between form and substance is most costly.
```

- [ ] **Step 3: Run tests**

Run: `npm run test:run -- tests/lib/mdx.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/content/research/sustainability-reporting-firm-value.mdx
git commit -m "content: populate thesis MDX with real research structure"
```

---

## Chunk 2 — Schema + Loader Updates

Updates types and the content loader to match the new content shapes. Components still use old contact shape temporarily; next chunk updates them.

### Task 2.1: Update types/content.ts

**Files:**
- Modify: `src/types/content.ts`

- [ ] **Step 1: Write failing test for new shape**

**File:** `tests/data/content.test.ts`

Open the current test file and add near the bottom of the existing test suite:

```typescript
import { getContact, getProfile, getResearchEntries } from '@/data/content'

describe('content shape — redesign additions', () => {
  it('contact exposes professional + personal groups', () => {
    const contact = getContact()
    expect(contact.professional.email).toMatch(/@/)
    expect(contact.professional.linkedin).toMatch(/linkedin/)
    expect(contact.professional.github).toMatch(/github/)
    expect(contact.professional.location).toBeTruthy()
    expect(contact.personal?.instagram).toMatch(/instagram/)
    expect(contact.personal?.tiktok).toMatch(/tiktok/)
  })

  it('profile exposes headline + positioning + statusLine', () => {
    const profile = getProfile()
    expect(profile.headline?.plain).toBeTruthy()
    expect(profile.headline?.emphasis).toBeTruthy()
    expect(profile.positioning).toBeTruthy()
    expect(profile.statusLine?.now).toBeTruthy()
    expect(profile.statusLine?.basedIn).toBeTruthy()
    expect(profile.statusLine?.education).toBeTruthy()
  })

  it('thesis research entry is marked featured with type thesis', () => {
    const [thesis] = getResearchEntries()
    expect(thesis.type).toBe('thesis')
    expect(thesis.featured).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test:run -- tests/data/content.test.ts`
Expected: FAIL on `contact.professional.email` — TypeScript compile error / runtime undefined.

- [ ] **Step 3: Update `src/types/content.ts`**

Replace contents with:

```typescript
export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  brandStatement: string
  avatar: string
  /** Tokenized headline so we can italicize/tint one phrase without embedding HTML in JSON. */
  headline?: {
    plain: string
    emphasis: string
    suffix: string
  }
  /** Single-sentence positioning line under the H1. */
  positioning?: string
  /** Three-part status ribbon in the hero. */
  statusLine?: {
    now: string
    basedIn: string
    education: string
  }
}

export interface EducationEntry {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  details: string[]
  logo?: string
}

export interface ExperienceEntry {
  company: string
  role: string
  startDate: string
  endDate: string | null
  location: string
  bullets: string[]
  logo?: string
}

export interface CertificationEntry {
  name: string
  issuer: string
  date: string
  documentPath: string
  slug: string
  description?: string
}

export interface SkillItem {
  name: string
  /** @deprecated Use `context` instead. Still present on disk for one release; not rendered. */
  level?: number
  /** E.g. "applied", "coursework", "daily", "research", "DJP". */
  context?: string
}

export interface SkillCategory {
  category: string
  items: SkillItem[]
}

export interface AwardEntry {
  title: string
  issuer: string
  date: string
  description?: string
}

export interface CourseEntry {
  name: string
  provider: string
  date: string
  certificateUrl?: string
  credentialId?: string
}

export interface ProfessionalContact {
  email: string
  linkedin: string
  github: string
  location: string
}

export interface PersonalContact {
  instagram?: string
  tiktok?: string
  note?: string
}

export interface ContactInfo {
  professional: ProfessionalContact
  personal?: PersonalContact
}

export interface DownloadItem {
  label: string
  filePath: string
  icon: string
  format: string
}

export interface Downloads {
  items: DownloadItem[]
}

export interface SiteConfig {
  title: string
  description: string
  url: string
  ogImage: string
  locale: string
}

export type ResearchType =
  | 'thesis'
  | 'working-paper'
  | 'in-progress'
  | 'presentation'
  | 'published'

export interface ResearchEntry {
  title: string
  slug: string
  abstract: string
  tags: string[]
  date: string
  pdfPath?: string
  type?: ResearchType
  featured?: boolean
  venue?: string
  advisor?: string
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/data/content.test.ts`
Expected: PASS for the new assertions. Existing tests that reference `contact.email` as a top-level property may fail — those are fixed in Chunk 5.

- [ ] **Step 5: Commit**

```bash
git add src/types/content.ts tests/data/content.test.ts
git commit -m "types: restructure contact + add profile headline/statusLine + research type"
```

### Task 2.2: Add a `getProfessionalContact()` helper to data/content.ts

**Files:**
- Modify: `src/data/content.ts`

- [ ] **Step 1: Write failing test**

Add to `tests/data/content.test.ts` inside the `describe('content shape — redesign additions')` block:

```typescript
  it('exposes getProfessionalContact helper', async () => {
    const { getProfessionalContact } = await import('@/data/content')
    const p = getProfessionalContact()
    expect(p.email).toMatch(/@/)
    expect(p.linkedin).toMatch(/linkedin/)
  })

  it('exposes getPersonalContact helper', async () => {
    const { getPersonalContact } = await import('@/data/content')
    const p = getPersonalContact()
    expect(p?.instagram).toMatch(/instagram/)
  })
```

- [ ] **Step 2: Run tests**

Run: `npm run test:run -- tests/data/content.test.ts`
Expected: FAIL — helpers not exported.

- [ ] **Step 3: Append helpers to `src/data/content.ts`**

At the end of the file, after `getResearchEntries`, add:

```typescript
import type { ProfessionalContact, PersonalContact } from '@/types/content'

export function getProfessionalContact(): ProfessionalContact {
  return getContact().professional
}

export function getPersonalContact(): PersonalContact | undefined {
  return getContact().personal
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- tests/data/content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/content.ts tests/data/content.test.ts
git commit -m "data: add getProfessionalContact + getPersonalContact helpers"
```

---

## Chunk 3 — Design tokens + CSS reset

Replaces the entire visual token system. Some visual tests may need adjustment later, but component tests should remain passing because they assert DOM structure, not computed styles.

### Task 3.1: Rewrite globals.css with new tokens

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Replace contents**

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  /* Accent tokens — exposed to Tailwind as color-* utilities */
  --color-accent: var(--accent-primary);
  --color-accent-dark: var(--accent-primary-dark);
  --color-highlight: var(--accent-highlight);
  --color-highlight-soft: var(--accent-highlight-soft);

  /* Semantic tokens — reference CSS variables that switch with theme */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-alt: var(--surface-alt);
  --color-muted: var(--muted);
  --color-subtle: var(--subtle);
  --color-border: var(--border);

  /* Font families */
  --font-display: 'Newsreader', 'Georgia', serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
}

/* Light theme (default) — paper + ink */
:root {
  --background: #fbf9f4;
  --surface: #ffffff;
  --surface-alt: #fefcf6;
  --foreground: #0f1419;
  --muted: #4a5568;
  --subtle: #718096;
  --border: #e6ddd0;

  --accent-primary: #0d4f5c;
  --accent-primary-dark: #0a3d47;
  --accent-highlight: #b8944a;
  --accent-highlight-soft: #fef7e0;
}

/* Dark theme — ink + warm type */
.dark {
  --background: #0f1419;
  --surface: #1a2028;
  --surface-alt: #141a22;
  --foreground: #f1e9d8;
  --muted: #a1a1aa;
  --subtle: #71717a;
  --border: #2d3748;

  --accent-primary: #2dd4bf;
  --accent-primary-dark: #14b8a6;
  --accent-highlight: #d4b574;
  --accent-highlight-soft: #3f2e1a;
}

body {
  font-family: var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'ss01', 'cv11';
}

html {
  scroll-behavior: smooth;
}

::selection {
  background-color: var(--accent-primary);
  color: white;
}

/* Font utility classes */
.font-display {
  font-family: var(--font-display);
}

.font-mono {
  font-family: var(--font-mono);
}

/* Animated link underline */
.link-underline {
  position: relative;
  display: inline-block;
}
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}
.link-underline:hover::after {
  width: 100%;
}

/* Accent text helpers */
.text-accent {
  color: var(--accent-primary);
}
.text-highlight {
  color: var(--accent-highlight);
}

/* Touch tap highlight */
a, button {
  -webkit-tap-highlight-color: rgba(13, 79, 92, 0.15);
}

/* Global focus-visible styles */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 9999;
  padding: 0.75rem 1.5rem;
  background: var(--accent-primary);
  color: white;
  font-weight: 600;
  border-radius: 0 0 0.5rem 0;
}
.skip-to-content:focus {
  left: 0;
}

/* Skeleton shimmer for loading states (kept) */
@keyframes skeleton-shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
.animate-skeleton-shimmer {
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

/* Scroll hint animation (kept, subtler) */
@keyframes scroll-hint {
  0%, 100% { opacity: 0.7; transform: translateY(0); }
  50% { opacity: 0.3; transform: translateY(4px); }
}
.animate-scroll-hint { animation: scroll-hint 2.4s ease-in-out infinite; }

@import './print.css';
```

- [ ] **Step 2: Create print stylesheet at `src/styles/print.css`**

```css
/* Print styles — clean CV-like output when a reviewer prints the site. */
@media print {
  body {
    background: white !important;
    color: black !important;
    font-size: 11pt;
  }
  header, footer, .navbar, .skip-to-content, nav, .mobile-only {
    display: none !important;
  }
  a {
    color: black !important;
    text-decoration: none !important;
  }
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    color: #444;
  }
  section {
    page-break-inside: avoid;
    padding: 0.5rem 0 !important;
    border: none !important;
  }
  .dark {
    color-scheme: light !important;
  }
  .print-hide {
    display: none !important;
  }
}
```

- [ ] **Step 3: Run all tests**

Run: `npm run test:run`
Expected: Most tests PASS. Some tests that assert specific class names like `.hero-gradient-text`, `.animate-avatar-glow`, or `.text-gold-accent` may FAIL. Those are fixed in Chunk 5 as each section is rewritten. Don't fix them here.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/styles/print.css
git commit -m "style: replace design tokens with teal + muted gold, add print CSS"
```

### Task 3.2: Swap Instrument Serif → Newsreader in layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the font import**

Change the import line:

```typescript
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
```

to:

```typescript
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google'
```

And replace the font-loading block:

```typescript
const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})
```

with:

```typescript
const newsreader = Newsreader({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})
```

And update the `<html>` className:

```tsx
<html lang="en" className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
```

- [ ] **Step 2: Run dev server to check font loads**

Run: `npm run dev`
Visit: `http://localhost:3000`
Expected: no console errors; page renders with new serif.

Stop the server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "style: swap Instrument Serif for Newsreader display font"
```

---

## Chunk 4 — Remove obsolete motion + wire new layout baseline

Delete aurora + custom cursor + update page-transition. The layout.tsx stops importing aurora and custom cursor.

### Task 4.1: Simplify page-transition

**Files:**
- Modify: `src/components/motion/page-transition.tsx`
- Test: `tests/components/motion/page-transition.test.tsx` (will update)

- [ ] **Step 1: Update test to reflect opacity-only transition**

Read the current test first:

```bash
cat tests/components/motion/page-transition.test.tsx
```

Update the test expectations so it asserts that variants contain only `opacity` (no `scale` or `filter`). Replace any assertion on `filter: 'blur(...)'` or `scale: ...` with an assertion that those properties are NOT present.

Concretely, in the test file, replace existing variant-shape assertions with:

```typescript
it('uses opacity-only variants (no scale, no blur)', async () => {
  const mod = await import('@/components/motion/page-transition')
  // Internal variants are not exported; assert via DOM output instead:
  const { render } = await import('@testing-library/react')
  const React = await import('react')
  const { PageTransition } = mod
  const { container } = render(React.createElement(PageTransition, null, React.createElement('div', null, 'kid')))
  const root = container.firstChild as HTMLElement
  // inline style (applied by mocked framer) should only have opacity
  if (root && 'style' in root) {
    expect(root.style.filter ?? '').not.toMatch(/blur/)
  }
})
```

- [ ] **Step 2: Run test to verify it either passes or fails cleanly**

Run: `npm run test:run -- tests/components/motion/page-transition.test.tsx`
Expected: FAIL (until implementation simplified).

- [ ] **Step 3: Rewrite `src/components/motion/page-transition.tsx`**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: 'easeIn' as const } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} variants={variants} initial="hidden" animate="enter" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/motion/page-transition.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/page-transition.tsx tests/components/motion/page-transition.test.tsx
git commit -m "motion: simplify page-transition to opacity-only fade"
```

### Task 4.2: Delete aurora-background

**Files:**
- Delete: `src/components/motion/aurora-background.tsx`
- Delete: `tests/components/motion/aurora-background.test.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Remove aurora import from `src/app/layout.tsx`**

Delete these lines:

```typescript
import dynamic from 'next/dynamic'
...
const AuroraBackground = dynamic(
  () => import('@/components/motion/aurora-background').then((m) => ({ default: m.AuroraBackground })),
  { loading: () => null }
)
```

And remove `<AuroraBackground />` from the JSX inside `<ThemeProvider>`.

- [ ] **Step 2: Delete the component and test files**

```bash
git rm src/components/motion/aurora-background.tsx tests/components/motion/aurora-background.test.tsx
```

- [ ] **Step 3: Run tests**

Run: `npm run test:run`
Expected: PASS (aurora tests gone, no other tests reference aurora).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "motion: remove aurora-background component and integration"
```

### Task 4.3: Delete custom-cursor

**Files:**
- Delete: `src/components/motion/custom-cursor.tsx`
- Delete: `tests/components/motion/custom-cursor.test.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Remove cursor import + usage from layout.tsx**

Delete the line:

```typescript
import { CustomCursor } from '@/components/motion/custom-cursor'
```

And remove `<CustomCursor />` from the JSX.

- [ ] **Step 2: Delete the component and test files**

```bash
git rm src/components/motion/custom-cursor.tsx tests/components/motion/custom-cursor.test.tsx
```

- [ ] **Step 3: Run tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "motion: remove custom-cursor component"
```

### Task 4.4: Flip default theme from dark to light

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update the inline theme-loader script**

Replace:

```typescript
__html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark')})()`,
```

with:

```typescript
__html: `(function(){var t=localStorage.getItem('theme')||'light';if(t==='dark')document.documentElement.classList.add('dark')})()`,
```

- [ ] **Step 2: Run theme hook tests**

Run: `npm run test:run -- tests/hooks/use-theme.test.tsx`
Expected: PASS (hook reads `localStorage` or defaults; assertions tolerant).

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "theme: flip default from dark to light per redesign spec"
```

---

## Chunk 5 — Shared UI primitives

Build the four new primitives with tests. Do these before rewriting sections so sections can import them.

### Task 5.1: SkillPill primitive

**Files:**
- Create: `src/components/ui/skill-pill.tsx`
- Create: `tests/components/ui/skill-pill.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/ui/skill-pill.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillPill } from '@/components/ui/skill-pill'

describe('SkillPill', () => {
  it('renders the skill name', () => {
    render(<SkillPill name="Financial Reporting" />)
    expect(screen.getByText('Financial Reporting')).toBeInTheDocument()
  })

  it('renders the context label when provided', () => {
    render(<SkillPill name="SAP" context="project" />)
    expect(screen.getByText(/project/i)).toBeInTheDocument()
  })

  it('omits the context label when not provided', () => {
    render(<SkillPill name="Excel" />)
    expect(screen.queryByText(/·/)).not.toBeInTheDocument()
  })

  it('never renders a percentage', () => {
    render(<SkillPill name="SPSS" context="research" />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/ui/skill-pill.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/ui/skill-pill.tsx`**

```tsx
import { cn } from '@/utils/cn'

interface SkillPillProps {
  name: string
  context?: string
  className?: string
}

export function SkillPill({ name, context, className }: SkillPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5',
        'text-sm font-medium text-foreground',
        'transition-colors hover:border-accent',
        className
      )}
    >
      {name}
      {context && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-subtle font-normal">
          · {context}
        </span>
      )}
    </span>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/ui/skill-pill.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/skill-pill.tsx tests/components/ui/skill-pill.test.tsx
git commit -m "ui: add SkillPill primitive (tag with optional context label)"
```

### Task 5.2: StatusRibbon primitive

**Files:**
- Create: `src/components/ui/status-ribbon.tsx`
- Create: `tests/components/ui/status-ribbon.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/ui/status-ribbon.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusRibbon } from '@/components/ui/status-ribbon'

describe('StatusRibbon', () => {
  const props = {
    now: 'Operations Officer @ Kolosal AI',
    basedIn: 'Jakarta, Indonesia',
    education: 'B.Acc. · STIE YKPN · Apr 2026',
  }

  it('renders all three values', () => {
    render(<StatusRibbon {...props} />)
    expect(screen.getByText(/Operations Officer/)).toBeInTheDocument()
    expect(screen.getByText(/Jakarta/)).toBeInTheDocument()
    expect(screen.getByText(/STIE YKPN/)).toBeInTheDocument()
  })

  it('renders the three labels as mono caps', () => {
    render(<StatusRibbon {...props} />)
    expect(screen.getByText(/^Now$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Based in$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Education$/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/ui/status-ribbon.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/ui/status-ribbon.tsx`**

```tsx
interface StatusRibbonProps {
  now: string
  basedIn: string
  education: string
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <div className="font-mono text-[10px] uppercase tracking-wider text-subtle font-medium mb-1">
        {label}
      </div>
      <div className="text-foreground font-medium">{value}</div>
    </div>
  )
}

export function StatusRibbon({ now, basedIn, education }: StatusRibbonProps) {
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-4 py-4 border-t border-b border-border my-6">
      <Cell label="Now" value={now} />
      <Cell label="Based in" value={basedIn} />
      <Cell label="Education" value={education} />
    </div>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/ui/status-ribbon.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/status-ribbon.tsx tests/components/ui/status-ribbon.test.tsx
git commit -m "ui: add StatusRibbon for hero status line"
```

### Task 5.3: FeaturedResearchCard primitive

**Files:**
- Create: `src/components/ui/featured-research-card.tsx`
- Create: `tests/components/ui/featured-research-card.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/ui/featured-research-card.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedResearchCard } from '@/components/ui/featured-research-card'

const entry = {
  title: 'The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector',
  slug: 'sustainability-reporting-firm-value',
  abstract: 'Examines whether disclosure quality affects firm value among Indonesian manufacturers.',
  tags: ['sustainability reporting', 'firm value'],
  date: '2026-04',
  type: 'thesis' as const,
  featured: true,
}

describe('FeaturedResearchCard', () => {
  it('renders the featured thesis badge', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.getByText(/featured/i)).toBeInTheDocument()
    expect(screen.getByText(/thesis/i)).toBeInTheDocument()
  })

  it('renders the title as an h3', () => {
    render(<FeaturedResearchCard entry={entry} />)
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3.textContent).toContain('Sustainability Report Disclosure')
  })

  it('renders the abstract', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.getByText(/disclosure quality/i)).toBeInTheDocument()
  })

  it('renders each tag', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.getByText('sustainability reporting')).toBeInTheDocument()
    expect(screen.getByText('firm value')).toBeInTheDocument()
  })

  it('renders the Read abstract link pointing to the detail page', () => {
    render(<FeaturedResearchCard entry={entry} />)
    const link = screen.getByRole('link', { name: /read abstract/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('/research/sustainability-reporting-firm-value'))
  })

  it('does not render a PDF download button when pdfPath is missing', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.queryByRole('link', { name: /download pdf/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/ui/featured-research-card.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create `src/components/ui/featured-research-card.tsx`**

```tsx
import Link from 'next/link'
import type { ResearchEntry } from '@/types/content'
import { formatDate } from '@/utils/format-date'

interface Props {
  entry: ResearchEntry
}

const typeLabel: Record<string, string> = {
  thesis: 'Undergraduate Thesis',
  'working-paper': 'Working Paper',
  'in-progress': 'In Progress',
  presentation: 'Presentation',
  published: 'Published',
}

export function FeaturedResearchCard({ entry }: Props) {
  const label = entry.type ? typeLabel[entry.type] ?? 'Research' : 'Research'
  return (
    <article className="relative bg-surface border border-border border-l-[3px] border-l-[color:var(--accent-highlight)] rounded-sm p-10">
      <span className="absolute -top-3 left-8 bg-[color:var(--accent-highlight)] text-white font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-medium">
        Featured · Thesis
      </span>
      <div className="flex flex-wrap gap-4 mb-4 font-mono text-[11px] uppercase tracking-widest text-subtle">
        <span>{label}</span>
        <span>{formatDate(entry.date)}</span>
      </div>
      <h3 className="font-display text-3xl font-medium leading-tight tracking-tight mb-4 max-w-3xl">
        {entry.title}
      </h3>
      <p className="text-[color:var(--foreground)] opacity-90 text-base leading-relaxed mb-5 max-w-3xl">
        {entry.abstract}
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-background border border-border rounded-sm font-mono text-xs text-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/research/${entry.slug}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent font-medium hover:text-[color:var(--accent-primary-dark)]"
      >
        Read abstract →
      </Link>
    </article>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/ui/featured-research-card.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/featured-research-card.tsx tests/components/ui/featured-research-card.test.tsx
git commit -m "ui: add FeaturedResearchCard for thesis hero"
```

### Task 5.4: ResearchCard primitive (secondary)

**Files:**
- Create: `src/components/ui/research-card.tsx`
- Create: `tests/components/ui/research-card.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/ui/research-card.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResearchCard } from '@/components/ui/research-card'

const entry = {
  title: 'Tax Literacy & Compliance Outcomes',
  slug: 'tax-literacy',
  abstract: 'Analysis of 90+ taxpayers.',
  tags: ['tax'],
  date: '2025-12',
  type: 'working-paper' as const,
}

describe('ResearchCard', () => {
  it('renders title as h4', () => {
    render(<ResearchCard entry={entry} />)
    expect(screen.getByRole('heading', { level: 4 }).textContent).toContain('Tax Literacy')
  })
  it('renders short meta with type + year', () => {
    render(<ResearchCard entry={entry} />)
    expect(screen.getByText(/Working Paper/i)).toBeInTheDocument()
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })
  it('renders as a link to the detail page', () => {
    render(<ResearchCard entry={entry} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('/research/tax-literacy'))
  })
})
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/ui/research-card.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create `src/components/ui/research-card.tsx`**

```tsx
import Link from 'next/link'
import type { ResearchEntry } from '@/types/content'

interface Props {
  entry: ResearchEntry
}

const typeLabel: Record<string, string> = {
  thesis: 'Thesis',
  'working-paper': 'Working Paper',
  'in-progress': 'In Progress',
  presentation: 'Presentation',
  published: 'Published',
}

export function ResearchCard({ entry }: Props) {
  const year = entry.date.slice(0, 4)
  const label = entry.type ? typeLabel[entry.type] ?? 'Research' : 'Research'
  return (
    <Link
      href={`/research/${entry.slug}`}
      className="block bg-surface border border-border rounded-sm p-6 transition-all hover:border-accent hover:-translate-y-0.5"
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-subtle mb-2.5">
        {label} · {year}
      </div>
      <h4 className="font-display text-xl font-medium leading-snug mb-2.5">
        {entry.title}
      </h4>
      <p className="text-sm text-muted leading-relaxed">{entry.abstract}</p>
    </Link>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/ui/research-card.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/research-card.tsx tests/components/ui/research-card.test.tsx
git commit -m "ui: add ResearchCard for secondary research entries"
```

### Task 5.5: Update Badge to remove shimmer

**Files:**
- Modify: `src/components/ui/badge.tsx`
- Modify: `tests/components/ui/badge.test.tsx` (existing)

- [ ] **Step 1: Read the existing badge test file**

```bash
cat tests/components/ui/badge.test.tsx
```

Update any assertion that checks for gold-specific classes. Since we're only changing styles (not structure), most tests should still pass. If a test asserts class contains `gold-500`, change to not asserting specific class.

- [ ] **Step 2: Replace badge.tsx**

```tsx
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium',
        'bg-background border border-border text-foreground font-mono',
        'transition-colors',
        className
      )}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Run tests**

Run: `npm run test:run -- tests/components/ui/badge.test.tsx`
Expected: PASS (content still renders).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/badge.tsx tests/components/ui/badge.test.tsx
git commit -m "ui: update Badge to muted tag style (no shimmer)"
```

### Task 5.6: Update Button variants

**Files:**
- Modify: `src/components/ui/button.tsx`
- Modify: `tests/components/ui/button.test.tsx` (may need loosening)

- [ ] **Step 1: Replace `src/components/ui/button.tsx`**

```tsx
'use client'

import { cn } from '@/utils/cn'
import { withBasePath } from '@/lib/base-path'
import { motion } from 'framer-motion'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
}

const variantStyles: Record<string, string> = {
  primary: 'bg-foreground text-background hover:bg-accent font-medium',
  secondary: 'border border-foreground text-foreground hover:bg-foreground hover:text-background font-medium',
  ghost: 'text-muted hover:text-foreground hover:bg-muted/20',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  className,
  children,
  onClick,
  type = 'button',
  disabled,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  if (href) {
    const resolvedHref = href.startsWith('/') ? withBasePath(href) : href
    return (
      <motion.a
        href={resolvedHref}
        className={classes}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 18 }}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 18 }}
    >
      {children}
    </motion.button>
  )
}
```

- [ ] **Step 2: Run button tests**

Run: `npm run test:run -- tests/components/ui/button.test.tsx`
Expected: mostly PASS. If any test asserts a gold-specific class, update it to assert variant-agnostic behavior (renders children, correct tag when href given, etc.).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/button.tsx tests/components/ui/button.test.tsx
git commit -m "ui: repaint Button variants around foreground/accent tokens"
```

### Task 5.7: Update SectionHeading

**Files:**
- Modify: `src/components/ui/section-heading.tsx`
- Modify: `tests/components/ui/section-heading.test.tsx`

- [ ] **Step 1: Replace section-heading.tsx**

```tsx
interface SectionHeadingProps {
  title: string
  subtitle?: string
  sectionNumber?: string
  label?: string
}

export function SectionHeading({ title, subtitle, sectionNumber, label }: SectionHeadingProps) {
  return (
    <div className="mb-12 pb-3 border-b border-border flex items-baseline justify-between gap-6 flex-wrap">
      <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground tracking-tight">
        {title}
      </h2>
      <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-widest text-subtle">
        {label && <span>{label}</span>}
        {sectionNumber && <span>Section {sectionNumber}</span>}
      </div>
      {subtitle && <p className="w-full mt-3 text-base text-muted">{subtitle}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/ui/section-heading.test.tsx`
Expected: PASS (title and labels still render).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/section-heading.tsx tests/components/ui/section-heading.test.tsx
git commit -m "ui: update SectionHeading to journal-style baseline row"
```

### Task 5.8: Update Card

**Files:**
- Modify: `src/components/ui/card.tsx`
- Modify: `tests/components/ui/card.test.tsx`

- [ ] **Step 1: Replace card.tsx with simplified version**

```tsx
'use client'

import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  href?: string
}

export function Card({ children, className, href }: CardProps) {
  const classes = cn(
    'block bg-surface border border-border rounded-md p-6',
    'transition-all hover:border-accent hover:-translate-y-0.5',
    className
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return <div className={classes}>{children}</div>
}
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/ui/card.test.tsx`
Expected: mostly PASS. If tests assert gold-glow presence, update those to instead assert `border` classes.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/card.tsx tests/components/ui/card.test.tsx
git commit -m "ui: simplify Card — remove gold glow, add teal border hover"
```

---

## Chunk 6 — Section rewrites

Rewrite each section component to use new tokens and new structure. Update corresponding tests.

### Task 6.1: Rewrite HeroSection

**Files:**
- Modify: `src/components/sections/hero-section.tsx`
- Modify: `tests/components/sections/hero-section.test.tsx`

- [ ] **Step 1: Replace the existing test with updated expectations**

**File:** `tests/components/sections/hero-section.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/sections/hero-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('HeroSection (redesigned)', () => {
  it('renders owner name as the eyebrow', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Dzaki Muhammad Yusfian/i)).toBeInTheDocument()
  })

  it('renders the headline as an h1', () => {
    render(<HeroSection />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    expect(h1.textContent).toMatch(/sustainability research/i)
  })

  it('renders the status ribbon with three labels', () => {
    render(<HeroSection />)
    expect(screen.getByText(/^Now$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Based in$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Education$/i)).toBeInTheDocument()
  })

  it('renders the Read my research CTA anchoring to #research', () => {
    render(<HeroSection />)
    const link = screen.getByRole('link', { name: /read my research/i })
    expect(link).toHaveAttribute('href', '#research')
  })

  it('renders Download CV as the secondary CTA', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: /download cv/i })).toBeInTheDocument()
  })

  it('renders the avatar image', () => {
    render(<HeroSection />)
    const img = screen.getByAltText(/dzaki/i)
    expect(img.tagName).toBe('IMG')
  })

  it('has the hero section id', () => {
    render(<HeroSection />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })

  it('does NOT render the old shimmer gradient text', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('.hero-gradient-text')).toBeNull()
  })

  it('does NOT render the old avatar glow', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('.animate-avatar-glow')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/components/sections/hero-section.test.tsx`
Expected: FAIL — existing component still uses old structure.

- [ ] **Step 3: Replace `src/components/sections/hero-section.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { getProfile } from '@/data/content'
import { withBasePath } from '@/lib/base-path'
import { StatusRibbon } from '@/components/ui/status-ribbon'
import { Button } from '@/components/ui/button'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

export function HeroSection() {
  const profile = getProfile()
  const { headline, positioning, statusLine } = profile

  return (
    <section id="hero" className="relative flex min-h-[90vh] items-center px-6 pt-24 pb-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.span
            variants={fadeUp}
            className="font-mono text-[11px] uppercase tracking-widest text-accent font-medium"
          >
            {profile.name}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-3 font-display text-[clamp(44px,5vw,68px)] font-medium leading-[1.05] tracking-tight"
          >
            {headline ? (
              <>
                {headline.plain} <em className="italic text-highlight font-medium">{headline.emphasis}</em>{headline.suffix}
              </>
            ) : (
              profile.title
            )}
          </motion.h1>

          {positioning && (
            <motion.p
              variants={fadeUp}
              className="mt-3 font-display italic text-xl text-muted leading-snug max-w-xl"
            >
              {positioning}
            </motion.p>
          )}

          {statusLine && (
            <motion.div variants={fadeUp}>
              <StatusRibbon {...statusLine} />
            </motion.div>
          )}

          <motion.p
            variants={fadeUp}
            className="mt-2 text-[17px] text-[color:var(--foreground)] opacity-90 leading-relaxed max-w-xl"
          >
            {profile.bio}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
            <Button href="#research" variant="primary" size="lg">
              Read my research →
            </Button>
            <Button href="/files/cv/dzaki-cv.pdf" variant="secondary" size="lg" external>
              Download CV
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          {profile.avatar && (
            <div className="relative w-[min(360px,100%)] aspect-[4/5] overflow-hidden rounded-md border border-border bg-muted shadow-lg shadow-black/5">
              <img
                src={withBasePath(profile.avatar)}
                alt={profile.name}
                width={360}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/sections/hero-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/hero-section.tsx tests/components/sections/hero-section.test.tsx
git commit -m "sections: rewrite HeroSection with status ribbon + CV CTA"
```

### Task 6.2: ResearchSection (new)

**Files:**
- Create: `src/components/sections/research-section.tsx`
- Create: `tests/components/sections/research-section.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/sections/research-section.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResearchSection } from '@/components/sections/research-section'

describe('ResearchSection', () => {
  it('renders the section heading Research', () => {
    render(<ResearchSection />)
    expect(screen.getByRole('heading', { level: 2, name: /research/i })).toBeInTheDocument()
  })

  it('renders the Featured Thesis card when entries include a thesis', () => {
    render(<ResearchSection />)
    expect(screen.getByText(/featured · thesis/i)).toBeInTheDocument()
    expect(screen.getByText(/sustainability report disclosure/i)).toBeInTheDocument()
  })

  it('renders the #research anchor id', () => {
    render(<ResearchSection />)
    expect(document.getElementById('research')).toBeInTheDocument()
  })

  it('does not render the secondary grid when research has <= 1 entry', () => {
    render(<ResearchSection />)
    expect(screen.queryByTestId('research-secondary-grid')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/sections/research-section.tsx`**

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { FeaturedResearchCard } from '@/components/ui/featured-research-card'
import { ResearchCard } from '@/components/ui/research-card'
import { getResearchEntries } from '@/data/content'

export function ResearchSection() {
  const entries = getResearchEntries()
  const featured = entries.find((e) => e.featured) ?? entries[0]
  const others = entries.filter((e) => e !== featured)

  if (!featured) return null

  return (
    <SectionWrapper id="research" className="bg-surface-alt">
      <SectionHeading title="Research" sectionNumber="01" label="Research" />
      <FeaturedResearchCard entry={featured} />
      {others.length > 0 && (
        <div
          data-testid="research-secondary-grid"
          className="grid gap-4 md:grid-cols-2 mt-6"
        >
          {others.map((entry) => (
            <ResearchCard key={entry.slug} entry={entry} />
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/sections/research-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/research-section.tsx tests/components/sections/research-section.test.tsx
git commit -m "sections: add ResearchSection — featured thesis + conditional grid"
```

### Task 6.3: ExperienceSection (renamed from timeline, experience-only)

**Files:**
- Create: `src/components/sections/experience-section.tsx`
- Create: `tests/components/sections/experience-section.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/sections/experience-section.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExperienceSection } from '@/components/sections/experience-section'

describe('ExperienceSection', () => {
  it('renders the Experience heading', () => {
    render(<ExperienceSection />)
    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument()
  })

  it('renders current role marked as now', () => {
    render(<ExperienceSection />)
    expect(screen.getByText(/Operations Officer/i)).toBeInTheDocument()
    expect(screen.getByText(/present/i)).toBeInTheDocument()
  })

  it('renders the Tax Volunteer DJP role', () => {
    render(<ExperienceSection />)
    expect(screen.getByText(/Tax Volunteer/i)).toBeInTheDocument()
    expect(screen.getByText(/Direktorat Jenderal Pajak/i)).toBeInTheDocument()
  })

  it('does not render education entries (those are in EducationSection)', () => {
    render(<ExperienceSection />)
    expect(screen.queryByText(/Bachelor of Accounting/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL.

- [ ] **Step 3: Create `src/components/sections/experience-section.tsx`**

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getExperience } from '@/data/content'
import { formatDateRange } from '@/utils/format-date'

function ExperienceRow({
  role,
  company,
  location,
  startDate,
  endDate,
  bullets,
}: {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  bullets: string[]
}) {
  const isNow = endDate === null
  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr] py-7 border-b border-border last:border-b-0">
      <div
        className={`font-mono text-xs uppercase tracking-wider pt-1 ${
          isNow ? 'text-highlight font-semibold' : 'text-subtle'
        }`}
      >
        {formatDateRange(startDate, endDate)}
      </div>
      <div>
        <div className="font-display text-xl font-medium leading-snug">{role}</div>
        <div className="text-[15px] text-muted mb-3">
          <span className="text-foreground font-medium">{company}</span> · {location}
        </div>
        <ul className="space-y-2">
          {bullets.map((bullet, i) => (
            <li
              key={i}
              className="relative pl-5 text-[15px] leading-relaxed text-[color:var(--foreground)] opacity-90"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-[10px] h-[1.5px] w-2.5 bg-accent"
              />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ExperienceSection() {
  const experience = getExperience()

  return (
    <SectionWrapper id="experience">
      <SectionHeading title="Experience" sectionNumber="02" label="Work" />
      <div>
        {experience.map((exp) => (
          <ExperienceRow
            key={`${exp.company}-${exp.startDate}`}
            role={exp.role}
            company={exp.company}
            location={exp.location}
            startDate={exp.startDate}
            endDate={exp.endDate}
            bullets={exp.bullets}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/sections/experience-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/experience-section.tsx tests/components/sections/experience-section.test.tsx
git commit -m "sections: add ExperienceSection (work roles only, date-column timeline)"
```

### Task 6.4: EducationSection (new)

**Files:**
- Create: `src/components/sections/education-section.tsx`
- Create: `tests/components/sections/education-section.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/sections/education-section.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EducationSection } from '@/components/sections/education-section'

describe('EducationSection', () => {
  it('renders Education heading', () => {
    render(<EducationSection />)
    expect(screen.getByRole('heading', { level: 2, name: /education/i })).toBeInTheDocument()
  })
  it('renders the Bachelor of Accounting degree', () => {
    render(<EducationSection />)
    expect(screen.getByText(/Bachelor of Accounting/i)).toBeInTheDocument()
  })
  it('renders the school STIE YKPN', () => {
    render(<EducationSection />)
    expect(screen.getByText(/STIE YKPN/i)).toBeInTheDocument()
  })
  it('renders each education bullet including the thesis pointer', () => {
    render(<EducationSection />)
    expect(screen.getByText(/Thesis:/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL.

- [ ] **Step 3: Create `src/components/sections/education-section.tsx`**

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getEducation } from '@/data/content'
import { formatDateRange } from '@/utils/format-date'

export function EducationSection() {
  const education = getEducation()

  return (
    <SectionWrapper id="education" className="bg-surface-alt">
      <SectionHeading title="Education" sectionNumber="03" label="Academic" />
      {education.map((entry) => (
        <div
          key={`${entry.school}-${entry.startDate}`}
          className="grid gap-6 md:grid-cols-[200px_1fr] py-4"
        >
          <div className="font-mono text-xs uppercase tracking-wider pt-1 text-subtle">
            {formatDateRange(entry.startDate, entry.endDate)}
          </div>
          <div>
            <h3 className="font-display text-xl font-medium leading-snug">
              {entry.degree} — {entry.field}
            </h3>
            <div className="text-[15px] text-muted mb-3">
              <span className="text-foreground font-medium">{entry.school}</span>
            </div>
            <ul className="space-y-2">
              {entry.details.map((d, i) => (
                <li
                  key={i}
                  className="relative pl-5 text-[15px] leading-relaxed text-[color:var(--foreground)] opacity-90"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[10px] h-[1.5px] w-2.5 bg-accent"
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/sections/education-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/education-section.tsx tests/components/sections/education-section.test.tsx
git commit -m "sections: add EducationSection (dedicated degree block)"
```

### Task 6.5: CredentialsSection (consolidated)

**Files:**
- Create: `src/components/sections/credentials-section.tsx`
- Create: `tests/components/sections/credentials-section.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/components/sections/credentials-section.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CredentialsSection } from '@/components/sections/credentials-section'

describe('CredentialsSection', () => {
  it('renders the Credentials heading', () => {
    render(<CredentialsSection />)
    expect(screen.getByRole('heading', { level: 2, name: /credentials/i })).toBeInTheDocument()
  })

  it('renders the IAI Brevet certification', () => {
    render(<CredentialsSection />)
    expect(screen.getByText(/Brevet A & B Taxation/i)).toBeInTheDocument()
    expect(screen.getByText(/Ikatan Akuntan Indonesia/i)).toBeInTheDocument()
  })

  it('renders the English Professional Development course', () => {
    render(<CredentialsSection />)
    expect(screen.getByText(/English for Professional Development/i)).toBeInTheDocument()
  })

  it('does not render an empty Awards subsection when awards are empty', () => {
    render(<CredentialsSection />)
    expect(screen.queryByText(/^Awards$/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL.

- [ ] **Step 3: Create `src/components/sections/credentials-section.tsx`**

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getCertifications, getCourses, getAwards } from '@/data/content'
import { formatDate } from '@/utils/format-date'

function CredItem({
  name,
  by,
  date,
  id,
}: {
  name: string
  by: string
  date: string
  id?: string
}) {
  return (
    <div className="py-4 border-b border-border last:border-b-0">
      <div className="font-medium text-[15px] text-foreground">{name}</div>
      <div className="text-sm text-muted">
        {by} · {formatDate(date)}
      </div>
      {id && (
        <div className="font-mono text-[11px] text-subtle mt-1">{id}</div>
      )}
    </div>
  )
}

export function CredentialsSection() {
  const certs = getCertifications()
  const courses = getCourses()
  const awards = getAwards()

  return (
    <SectionWrapper id="credentials">
      <SectionHeading title="Credentials" sectionNumber="04" label="Credentials" />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
            Certifications
          </h3>
          {certs.map((c) => (
            <CredItem
              key={c.slug}
              name={c.name}
              by={c.issuer}
              date={c.date}
              id={c.description}
            />
          ))}
        </div>
        <div>
          <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
            Training &amp; Courses
          </h3>
          {courses.map((c) => (
            <CredItem
              key={c.name}
              name={c.name}
              by={c.provider}
              date={c.date}
              id={c.credentialId}
            />
          ))}
        </div>
      </div>
      {awards.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
            Awards
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {awards.map((a) => (
              <CredItem
                key={a.title}
                name={a.title}
                by={a.issuer}
                date={a.date}
                id={a.description}
              />
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/sections/credentials-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/credentials-section.tsx tests/components/sections/credentials-section.test.tsx
git commit -m "sections: add CredentialsSection (certs + courses + optional awards)"
```

### Task 6.6: Rewrite SkillsSection as tag cloud

**Files:**
- Modify: `src/components/sections/skills-section.tsx`
- Modify: `tests/components/sections/skills-section.test.tsx`
- Modify: `src/content/skills.json`

- [ ] **Step 1: Update skills.json to add `context` fields**

Replace contents with:

```json
[
  {
    "category": "Technical",
    "items": [
      { "name": "Financial Reporting", "context": "applied" },
      { "name": "Tax Compliance", "context": "applied" },
      { "name": "Auditing", "context": "coursework" },
      { "name": "Budgeting & Forecasting", "context": "applied" },
      { "name": "Financial Analysis", "context": "applied" },
      { "name": "Account Reconciliation", "context": "applied" }
    ]
  },
  {
    "category": "Tools & Software",
    "items": [
      { "name": "Microsoft Excel", "context": "daily" },
      { "name": "SAP", "context": "project" },
      { "name": "MYOB", "context": "coursework" },
      { "name": "e-SPT", "context": "DJP" },
      { "name": "SPSS", "context": "research" },
      { "name": "Core Tax", "context": "DJP" }
    ]
  },
  {
    "category": "Research & Soft",
    "items": [
      { "name": "Panel data regression" },
      { "name": "Analytical thinking" },
      { "name": "Attention to detail" },
      { "name": "Team collaboration" },
      { "name": "Communication" },
      { "name": "Time management" }
    ]
  }
]
```

- [ ] **Step 2: Replace the skills section test**

**File:** `tests/components/sections/skills-section.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillsSection } from '@/components/sections/skills-section'

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('SkillsSection (redesigned)', () => {
  it('renders the Skills heading', () => {
    render(<SkillsSection />)
    expect(screen.getByRole('heading', { level: 2, name: /skills/i })).toBeInTheDocument()
  })

  it('renders the three category labels', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/^Technical$/i)).toBeInTheDocument()
    expect(screen.getByText(/Tools & Software/i)).toBeInTheDocument()
    expect(screen.getByText(/Research & Soft/i)).toBeInTheDocument()
  })

  it('renders some skills', () => {
    render(<SkillsSection />)
    expect(screen.getByText('Financial Reporting')).toBeInTheDocument()
    expect(screen.getByText('Microsoft Excel')).toBeInTheDocument()
  })

  it('does NOT render any percentage text', () => {
    const { container } = render(<SkillsSection />)
    expect(container.textContent).not.toMatch(/\d{2,3}%/)
  })

  it('does NOT render any progress bar elements', () => {
    const { container } = render(<SkillsSection />)
    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(0)
  })

  it('renders context labels where provided', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/· daily/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test**

Expected: FAIL.

- [ ] **Step 4: Replace `src/components/sections/skills-section.tsx`**

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { SkillPill } from '@/components/ui/skill-pill'
import { getSkills } from '@/data/content'

export function SkillsSection() {
  const skills = getSkills()

  return (
    <SectionWrapper id="skills">
      <SectionHeading title="Skills" sectionNumber="05" label="Practice" />
      <div className="grid gap-10 md:grid-cols-3">
        {skills.map((category) => (
          <div key={category.category}>
            <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((s) => (
                <SkillPill key={s.name} name={s.name} context={s.context} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Run test**

Run: `npm run test:run -- tests/components/sections/skills-section.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/skills.json src/components/sections/skills-section.tsx tests/components/sections/skills-section.test.tsx
git commit -m "sections: rewrite SkillsSection as tag cloud with context labels"
```

### Task 6.7: Rewrite ContactSection

**Files:**
- Modify: `src/components/sections/contact-section.tsx`
- Modify: `tests/components/sections/contact-section.test.tsx`

- [ ] **Step 1: Replace contact section test**

**File:** `tests/components/sections/contact-section.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactSection } from '@/components/sections/contact-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</p>,
    p: ({ children, ...p }: any) => <p {...p}>{children}</p>,
    a: ({ children, ...p }: any) => <a {...p}>{children}</a>,
    button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
    span: ({ children, ...p }: any) => <span {...p}>{children}</span>,
    h2: ({ children, ...p }: any) => <h2 {...p}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ContactSection (redesigned)', () => {
  it('renders the Contact heading', () => {
    render(<ContactSection />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders the professional email as a mailto', () => {
    render(<ContactSection />)
    const emailLink = screen.getByRole('link', { name: /email me/i })
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('renders the LinkedIn link', () => {
    render(<ContactSection />)
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('renders a structured contact list with email / linkedin / github / location', () => {
    render(<ContactSection />)
    expect(screen.getByText(/^Email$/i)).toBeInTheDocument()
    expect(screen.getByText(/^LinkedIn$/i)).toBeInTheDocument()
    expect(screen.getByText(/^GitHub$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Location$/i)).toBeInTheDocument()
  })

  it('does NOT render Instagram in the professional contact section', () => {
    render(<ContactSection />)
    expect(screen.queryByRole('link', { name: /instagram/i })).not.toBeInTheDocument()
  })

  it('does NOT render TikTok in the professional contact section', () => {
    render(<ContactSection />)
    expect(screen.queryByRole('link', { name: /tiktok/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL.

- [ ] **Step 3: Replace `src/components/sections/contact-section.tsx`**

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { Button } from '@/components/ui/button'
import { getProfessionalContact } from '@/data/content'

export function ContactSection() {
  const c = getProfessionalContact()
  const linkedinHandle = c.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com/, '')
  const githubHandle = c.github.replace(/https?:\/\/(www\.)?github\.com/, '@')

  return (
    <SectionWrapper id="contact" className="bg-surface-alt">
      <div className="grid gap-12 md:grid-cols-[1.3fr_1fr] items-start">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-medium">
            Get in touch
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight mt-4 mb-4">
            Open to research collaboration, internships, and conversation.
          </h2>
          <p className="text-[color:var(--foreground)] opacity-90 text-[17px] leading-relaxed max-w-xl mb-7">
            I&apos;m currently open to discussions around tax, audit, and sustainability-reporting research — including graduate program opportunities. The fastest way to reach me is email or LinkedIn.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href={`mailto:${c.email}`} variant="primary" size="lg">
              Email me
            </Button>
            <Button href={c.linkedin} variant="secondary" size="lg" external>
              LinkedIn →
            </Button>
          </div>
        </div>

        <ul className="list-none p-0">
          <li className="flex items-center gap-4 py-3.5 border-b border-border">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">Email</span>
            <span className="text-foreground font-medium text-[15px]">{c.email}</span>
          </li>
          <li className="flex items-center gap-4 py-3.5 border-b border-border">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">LinkedIn</span>
            <span className="text-foreground font-medium text-[15px]">{linkedinHandle}</span>
          </li>
          <li className="flex items-center gap-4 py-3.5 border-b border-border">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">GitHub</span>
            <span className="text-foreground font-medium text-[15px]">{githubHandle}</span>
          </li>
          <li className="flex items-center gap-4 py-3.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-subtle w-20 shrink-0">Location</span>
            <span className="text-foreground font-medium text-[15px]">{c.location}</span>
          </li>
        </ul>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/sections/contact-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/contact-section.tsx tests/components/sections/contact-section.test.tsx
git commit -m "sections: rewrite ContactSection — professional contacts only, no form"
```

---

## Chunk 7 — Layout + Navigation

### Task 7.1: Update page.tsx with new section order

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `tests/app/page.test.tsx`

- [ ] **Step 1: Replace the test file**

**File:** `tests/app/page.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Home from '@/app/page'

describe('Home page', () => {
  it('renders hero, research, experience, education, credentials, skills, contact sections in order', async () => {
    const { container } = render(<Home />)
    // Sections load dynamically — check render tree
    const ids = Array.from(container.querySelectorAll('[id]'))
      .map((el) => el.id)
      .filter((id) => ['hero', 'research', 'experience', 'education', 'credentials', 'skills', 'contact'].includes(id))
    expect(ids[0]).toBe('hero')
    expect(ids).toContain('research')
  })
})
```

- [ ] **Step 2: Rewrite `src/app/page.tsx`**

```tsx
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/hero-section'
import { Skeleton } from '@/components/ui/skeleton'

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Skeleton className="mb-6 h-8 w-48" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}

const ResearchSection = dynamic(
  () => import('@/components/sections/research-section').then((m) => ({ default: m.ResearchSection })),
  { loading: () => <SectionSkeleton /> }
)
const ExperienceSection = dynamic(
  () => import('@/components/sections/experience-section').then((m) => ({ default: m.ExperienceSection })),
  { loading: () => <SectionSkeleton /> }
)
const EducationSection = dynamic(
  () => import('@/components/sections/education-section').then((m) => ({ default: m.EducationSection })),
  { loading: () => <SectionSkeleton /> }
)
const CredentialsSection = dynamic(
  () => import('@/components/sections/credentials-section').then((m) => ({ default: m.CredentialsSection })),
  { loading: () => <SectionSkeleton /> }
)
const SkillsSection = dynamic(
  () => import('@/components/sections/skills-section').then((m) => ({ default: m.SkillsSection })),
  { loading: () => <SectionSkeleton /> }
)
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then((m) => ({ default: m.ContactSection })),
  { loading: () => <SectionSkeleton /> }
)

export default function Home() {
  return (
    <>
      <HeroSection />
      <ResearchSection />
      <ExperienceSection />
      <EducationSection />
      <CredentialsSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 3: Run test**

Run: `npm run test:run -- tests/app/page.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx tests/app/page.test.tsx
git commit -m "app: new homepage section order — Research after Hero"
```

### Task 7.2: Update navigation config

**Files:**
- Modify: `src/config/navigation.ts`

- [ ] **Step 1: Read current file**

```bash
cat src/config/navigation.ts
```

- [ ] **Step 2: Replace section links with new order**

Keep exports matching the current shape but replace the list of sections. Example content (adapt to match the file's shape):

```typescript
export const sectionLinks = [
  { label: 'Research', href: '#research' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const allNavItems = sectionLinks
```

(If the original file exports more variables, preserve them — only change the `sectionLinks` array.)

- [ ] **Step 3: Run tests**

Run: `npm run test:run -- tests/components/navigation/nav-links.test.tsx tests/components/navigation/mobile-menu.test.tsx`
Expected: mostly PASS; if tests check for specific labels like "About" or "Certifications", update them to match the new list.

- [ ] **Step 4: Commit**

```bash
git add src/config/navigation.ts tests/components/navigation/
git commit -m "nav: update section links for new IA"
```

### Task 7.3: Rewrite Navbar

**Files:**
- Modify: `src/components/layout/navbar.tsx`
- Modify: `tests/components/layout/navbar.test.tsx`

- [ ] **Step 1: Update navbar test to assert CV button present**

Open `tests/components/layout/navbar.test.tsx` and add:

```tsx
it('renders a persistent Download CV link', () => {
  render(<Navbar />)
  const cv = screen.getByRole('link', { name: /cv/i })
  expect(cv).toHaveAttribute('href', expect.stringContaining('/files/cv/'))
})
```

- [ ] **Step 2: Run test**

Expected: FAIL until navbar adds the link.

- [ ] **Step 3: Replace `src/components/layout/navbar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { allNavItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { withBasePath } from '@/lib/base-path'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const hasScrolled = scrollProgress > 0.01

  return (
    <header
      className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] rounded-xl md:top-3.5 md:w-[min(1200px,calc(100vw-40px))] md:rounded-2xl bg-background/70 backdrop-blur-2xl backdrop-saturate-150 border border-border shadow-sm transition-all duration-300 ${
        hasScrolled ? 'bg-background/85 shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between px-5 h-14">
        <Link
          href="/"
          className="text-lg font-display font-medium text-foreground"
          aria-label="Dzaki Muhammad Yusfian — Home"
        >
          Dzaki<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <NavLinks items={allNavItems} activeSection={activeSection} />
          <a
            href={withBasePath('/files/cv/dzaki-cv.pdf')}
            className="hidden md:inline-flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider font-medium hover:bg-accent transition-colors"
          >
            ↓ CV
          </a>
          <ThemeToggle />
          <MobileMenu items={allNavItems} activeSection={activeSection} />
        </div>
      </div>
      <div
        data-testid="scroll-progress"
        className="absolute bottom-0 left-0 h-0.5 rounded-full bg-accent transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/layout/navbar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/navbar.tsx tests/components/layout/navbar.test.tsx
git commit -m "nav: rewrite Navbar with wordmark + persistent CV button + teal accent"
```

### Task 7.4: Rewrite Footer with `personal →` link

**Files:**
- Modify: `src/components/layout/footer.tsx`
- Modify: `tests/components/layout/footer.test.tsx`

- [ ] **Step 1: Replace footer test**

**File:** `tests/components/layout/footer.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
  },
}))

describe('Footer (redesigned)', () => {
  it('renders copyright year', () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()}`))).toBeInTheDocument()
  })
  it('renders the personal link to /personal', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /personal/i })
    expect(link.getAttribute('href')).toMatch(/\/personal$/)
  })
  it('does NOT render Instagram in the footer', () => {
    render(<Footer />)
    expect(screen.queryByRole('link', { name: /instagram/i })).not.toBeInTheDocument()
  })
  it('does NOT render TikTok in the footer', () => {
    render(<Footer />)
    expect(screen.queryByRole('link', { name: /tiktok/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL.

- [ ] **Step 3: Replace `src/components/layout/footer.tsx`**

```tsx
import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-16 py-8 px-6">
      <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-3 font-mono text-xs text-subtle">
        <span>© {year} Dzaki Muhammad Yusfian</span>
        <div className="flex items-center gap-4">
          <span>Built with Next.js · GitHub Pages</span>
          <Link
            href="/personal"
            className="text-muted hover:text-accent transition-colors"
          >
            personal →
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/components/layout/footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/footer.tsx tests/components/layout/footer.test.tsx
git commit -m "footer: minimal footer with personal link; remove professional socials"
```

### Task 7.5: Remove obsolete section components

**Files:**
- Delete: `src/components/sections/profile-section.tsx`
- Delete: `src/components/sections/timeline-section.tsx`
- Delete: `src/components/sections/certifications-section.tsx`
- Delete: `src/components/ui/timeline-item.tsx`
- Delete: `tests/components/sections/profile-section.test.tsx`
- Delete: `tests/components/sections/timeline-section.test.tsx`
- Delete: `tests/components/sections/certifications-section.test.tsx`
- Delete: `tests/components/ui/timeline-item.test.tsx`

- [ ] **Step 1: Verify nothing imports these files**

Run: `grep -r "profile-section\|timeline-section\|certifications-section\|timeline-item" src/ tests/ --include="*.tsx" --include="*.ts"`
Expected: **ONLY** hits inside the files themselves (self-references) and their test files. No other source file should still import them. If other imports exist, fix them first.

- [ ] **Step 2: Delete files**

```bash
git rm src/components/sections/profile-section.tsx
git rm src/components/sections/timeline-section.tsx
git rm src/components/sections/certifications-section.tsx
git rm src/components/ui/timeline-item.tsx
git rm tests/components/sections/profile-section.test.tsx
git rm tests/components/sections/timeline-section.test.tsx
git rm tests/components/sections/certifications-section.test.tsx
git rm tests/components/ui/timeline-item.test.tsx
```

- [ ] **Step 3: Run full test suite**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "sections: remove obsolete profile/timeline/certifications/timeline-item components"
```

---

## Chunk 8 — New `/personal` page + detail-page polish

### Task 8.1: Create `/personal` page

**Files:**
- Create: `src/app/personal/page.tsx`
- Create: `tests/app/personal-page.test.tsx`

- [ ] **Step 1: Write failing test**

**File:** `tests/app/personal-page.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PersonalPage from '@/app/personal/page'

describe('/personal page', () => {
  it('renders the owner name as a heading', () => {
    render(<PersonalPage />)
    expect(screen.getByRole('heading', { name: /dzaki/i })).toBeInTheDocument()
  })
  it('renders Instagram link', () => {
    render(<PersonalPage />)
    const ig = screen.getByRole('link', { name: /instagram/i })
    expect(ig).toHaveAttribute('href', expect.stringContaining('instagram'))
  })
  it('renders TikTok link', () => {
    render(<PersonalPage />)
    const tt = screen.getByRole('link', { name: /tiktok/i })
    expect(tt).toHaveAttribute('href', expect.stringContaining('tiktok'))
  })
})
```

- [ ] **Step 2: Run test**

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/app/personal/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getProfile, getPersonalContact } from '@/data/content'
import { withBasePath } from '@/lib/base-path'

export const metadata: Metadata = {
  title: 'Personal — Dzaki Muhammad Yusfian',
  description: 'A few corners of the internet where Dzaki shares tax-literacy content and personal updates.',
}

export default function PersonalPage() {
  const profile = getProfile()
  const personal = getPersonalContact()

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>

        {profile.avatar && (
          <div className="mt-8 w-28 h-28 rounded-full overflow-hidden border border-border">
            <img
              src={withBasePath(profile.avatar)}
              alt={profile.name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-6 font-display text-3xl font-medium leading-tight">
          {profile.name}
        </h1>

        {personal?.note && (
          <p className="mt-4 text-[17px] text-[color:var(--foreground)] opacity-90 leading-relaxed">
            {personal.note}
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {personal?.instagram && (
            <li>
              <a
                href={personal.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent"
              >
                Instagram →
              </a>
            </li>
          )}
          {personal?.tiktok && (
            <li>
              <a
                href={personal.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent"
              >
                TikTok →
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test**

Run: `npm run test:run -- tests/app/personal-page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/personal/page.tsx tests/app/personal-page.test.tsx
git commit -m "app: add /personal page with Instagram + TikTok"
```

### Task 8.2: Update Research detail page styling

**Files:**
- Modify: `src/app/research/[slug]/page.tsx`

- [ ] **Step 1: Replace the page contents**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getResearchBySlug, getAllResearchSlugs } from '@/lib/mdx'
import { formatDate } from '@/utils/format-date'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllResearchSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const research = getResearchBySlug(slug)
  if (!research) return {}
  return {
    title: research.frontmatter.title,
    description: research.frontmatter.abstract,
  }
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params
  const research = getResearchBySlug(slug)

  if (!research) {
    notFound()
  }

  return (
    <article className="py-16 px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
          {research.frontmatter.title}
        </h1>

        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-subtle">
          {formatDate(research.frontmatter.date)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {research.frontmatter.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {research.frontmatter.pdfPath && (
          <div className="mt-6">
            <Button href={research.frontmatter.pdfPath} variant="secondary" external>
              Download PDF
            </Button>
          </div>
        )}

        <div className="mt-10 border-t border-border pt-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-accent prose-strong:text-foreground">
          <MDXRemote source={research.content} />
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Run detail page test**

Run: `npm run test:run -- tests/app/research-detail.test.tsx`
Expected: PASS (most assertions should still work).

- [ ] **Step 3: Commit**

```bash
git add src/app/research/[slug]/page.tsx
git commit -m "app: update research detail page — new tokens, hide PDF if absent"
```

### Task 8.3: Update Research listing page

**Files:**
- Modify: `src/app/research/page.tsx`

- [ ] **Step 1: Replace contents**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { FeaturedResearchCard } from '@/components/ui/featured-research-card'
import { ResearchCard } from '@/components/ui/research-card'
import { getResearchEntries } from '@/data/content'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Academic and professional research work.',
}

export default function ResearchPage() {
  const entries = getResearchEntries()
  const featured = entries.find((e) => e.featured) ?? entries[0]
  const others = entries.filter((e) => e !== featured)

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
          Research
        </h1>
        <p className="mt-2 text-muted text-base">Academic and professional research work.</p>

        {featured && (
          <div className="mt-12">
            <FeaturedResearchCard entry={featured} />
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((entry) => (
              <ResearchCard key={entry.slug} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run test**

Run: `npm run test:run -- tests/app/research-page.test.tsx`
Expected: some test assertions may need updating. Check assertions around the listing shape and update any test that relied on the old layout.

- [ ] **Step 3: Commit**

```bash
git add src/app/research/page.tsx tests/app/research-page.test.tsx
git commit -m "app: redesign research listing page with new cards"
```

---

## Chunk 9 — SEO + JSON-LD polish

### Task 9.1: Expand JSON-LD Person schema

**Files:**
- Modify: `src/components/layout/json-ld.tsx`

- [ ] **Step 1: Read current JSON-LD file**

```bash
cat src/components/layout/json-ld.tsx
```

- [ ] **Step 2: Update the component**

Replace the Person object construction so it emits:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dzaki Muhammad Yusfian",
  "jobTitle": "Operations Officer",
  "worksFor": { "@type": "Organization", "name": "PT. Kolosal Kecerdasan Artifisial" },
  "alumniOf": { "@type": "CollegeOrUniversity", "name": "STIE YKPN Business School Yogyakarta" },
  "address": { "@type": "PostalAddress", "addressLocality": "Jakarta", "addressCountry": "ID" },
  "email": "...",
  "url": "...",
  "sameAs": ["linkedin", "github"],
  "knowsAbout": ["Taxation", "Auditing", "Financial Reporting", "Financial Analysis", "Sustainability Reporting", "Firm Value"]
}
```

Concretely, update the component by extending the existing schema object to include `worksFor`, `alumniOf`, `address`, and `knowsAbout`. Keep the existing image guard logic so missing avatar still degrades gracefully.

- [ ] **Step 3: Update JSON-LD test**

Add to `tests/components/layout/json-ld.test.tsx`:

```tsx
it('includes knowsAbout array with sustainability reporting', () => {
  const { container } = render(<JsonLd />)
  const script = container.querySelector('script[type="application/ld+json"]')
  expect(script?.textContent).toContain('Sustainability Reporting')
})

it('includes alumniOf STIE YKPN', () => {
  const { container } = render(<JsonLd />)
  const script = container.querySelector('script[type="application/ld+json"]')
  expect(script?.textContent).toContain('STIE YKPN')
})
```

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- tests/components/layout/json-ld.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/json-ld.tsx tests/components/layout/json-ld.test.tsx
git commit -m "seo: expand JSON-LD Person schema (worksFor, alumniOf, knowsAbout)"
```

### Task 9.2: Update sitemap for /personal

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Read current sitemap**

```bash
cat src/app/sitemap.ts
```

- [ ] **Step 2: Add `/personal` to the static routes list**

Add `/personal` (and ensure `/research` already there) to the exported sitemap URLs.

- [ ] **Step 3: Run existing tests**

Run: `npm run test:run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "seo: include /personal in sitemap"
```

---

## Chunk 10 — QA + ship

### Task 10.1: Visual smoke test via dev server

**Files:**
- None (manual verification)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify in browser — `http://localhost:3000`**

Checklist:
- [ ] Hero renders with status ribbon, both CTAs work, avatar visible.
- [ ] Research section renders Featured Thesis card; secondary grid hidden.
- [ ] Experience section lists all 3 roles in order; "Mar 2026 — Present" shown on first.
- [ ] Education section shows the degree with 3 bullets including "Thesis: see the Research section."
- [ ] Credentials shows IAI Brevet + English course; no UGM entry; no Awards block.
- [ ] Skills section shows 3 category columns with tag pills; no percentages anywhere.
- [ ] Contact section shows email + LinkedIn + GitHub + Location list; no Instagram/TikTok.
- [ ] Navbar shows wordmark `Dzaki.` with teal period, section links, persistent `↓ CV` button.
- [ ] Footer shows copyright + `personal →` link; no social icons.
- [ ] `/personal` page loads and shows Instagram + TikTok.
- [ ] `/research/sustainability-reporting-firm-value` loads the MDX detail page.
- [ ] Theme toggle switches light ↔ dark; default is light.
- [ ] No aurora, no custom cursor, no shimmer on the name, no avatar glow.
- [ ] Reduced-motion preference disables scroll reveals.

- [ ] **Step 3: Verify mobile (375px viewport in devtools)**

- [ ] Hero grid stacks; status ribbon wraps cleanly.
- [ ] All sections remain readable; no horizontal scroll.
- [ ] Mobile menu opens and closes; navigation works.

- [ ] **Step 4: Print preview**

Cmd+P / Ctrl+P on the homepage.
- [ ] Navbar and footer hidden.
- [ ] Content readable in black-on-white.
- [ ] Each section on a clear page break.

Stop dev server with Ctrl+C.

### Task 10.2: Run full test suite + build

- [ ] **Step 1: Run tests**

```bash
npm run test:run
```

Expected: all tests PASS. Any remaining failures must be fixed before proceeding.

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: build succeeds; check output for warnings and resolve any that matter.

- [ ] **Step 4: If any failures occur, fix the root cause and re-run**

Do not proceed until all three checks above pass.

### Task 10.3: Lighthouse audit

- [ ] **Step 1: Run Lighthouse on the built output**

```bash
npx http-server out -p 4000 &
# Open http://localhost:4000/ in Chrome, run Lighthouse (mobile + desktop)
```

Targets:
- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO ≥ 95

- [ ] **Step 2: Fix any category below 95 and re-run**

Common fixes:
- Missing alt attributes → add to any `<img>` without one.
- Contrast failures → tighten token contrast in `globals.css`.
- Layout shift → set explicit `width`/`height` on images.

- [ ] **Step 3: Kill the http-server process**

### Task 10.4: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update the README's feature / stack overview**

Reflect the new section order, new design tokens, removed components, and the new `/personal` page. Keep the installation + deploy instructions.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README for redesigned portfolio"
```

### Task 10.5: Ship

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Wait for the GitHub Actions deploy workflow to succeed**

```bash
gh run list --limit 1
```

Expected: latest run status `completed · success`.

- [ ] **Step 3: Verify live site**

Visit: `https://DMY-cmyk.github.io/Proffesional_Portfolio/`
Repeat the smoke-test checklist from Task 10.1 against the live URL.

- [ ] **Step 4: Celebrate**

The redesign is done.

---

## Known intentional omissions

These are deliberately *not* in the plan; don't add them without approval:

- **Contact form rebuild.** The original `ContactForm` component remains in the codebase but is no longer mounted by `ContactSection`. A future task may remove it. For now, email + LinkedIn is the intended contact path.
- **Dark-mode illustration pass.** The new token set includes dark values, but dark mode was not a primary audience consideration. If dark-mode QA reveals issues, address in a follow-up commit, not this plan.
- **Additional research entries.** The section is built to accommodate them but none are added in this plan (per decision 3 in the spec).
- **PDF generation for thesis.** Decision 1 in the spec: abstract only for now. No PDF hosting.
- **Analytics.** Out of scope.
