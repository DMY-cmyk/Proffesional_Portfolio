# Professional Portfolio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, dark-themed personal portfolio website for an accounting/finance professional, deployed as a static site on GitHub Pages.

**Architecture:** Single-page scrolling homepage with dedicated sub-pages for research and certification details. All content lives in typed JSON/MDX files loaded at build time — zero runtime API calls. Animation layer (Canvas aurora, custom cursor, scroll reveals) hydrates client-side. Dark mode is default with light mode toggle.

**Tech Stack:** Next.js 15 (static export), React 19, TypeScript, Tailwind CSS 4, Framer Motion, HTML Canvas 2D, Vitest + React Testing Library, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-03-17-portfolio-design.md`

---

## File Structure Overview

```
src/
├── app/
│   ├── layout.tsx                 # Root layout (theme provider, fonts, metadata)
│   ├── page.tsx                   # Home (single-page scroll, all sections)
│   ├── not-found.tsx              # Custom 404 page
│   ├── research/
│   │   ├── page.tsx               # Research listing
│   │   └── [slug]/page.tsx        # Research detail (MDX)
│   └── certifications/
│       └── [slug]/page.tsx        # Certification detail (doc viewer)
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── section-wrapper.tsx
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── profile-section.tsx
│   │   ├── timeline-section.tsx
│   │   ├── certifications-section.tsx
│   │   ├── skills-section.tsx
│   │   └── contact-section.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── timeline-item.tsx
│   │   ├── section-heading.tsx
│   │   └── theme-toggle.tsx
│   ├── navigation/
│   │   ├── nav-links.tsx
│   │   ├── mobile-menu.tsx
│   │   └── scroll-spy.tsx
│   └── motion/
│       ├── aurora-background.tsx
│       ├── custom-cursor.tsx
│       ├── scroll-reveal.tsx
│       ├── hover-glow.tsx
│       └── page-transition.tsx
├── content/
│   ├── profile.json
│   ├── education.json
│   ├── experience.json
│   ├── certifications.json
│   ├── skills.json
│   ├── awards.json
│   ├── courses.json
│   ├── contact.json
│   ├── downloads.json
│   ├── site.json
│   └── research/
│       ├── index.json
│       └── *.mdx
├── data/
│   └── content.ts                 # All content loaders
├── hooks/
│   ├── use-scroll-spy.ts
│   ├── use-theme.ts
│   └── use-reduced-motion.ts
├── lib/
│   └── mdx.ts                    # MDX renderer utilities
├── styles/
│   └── globals.css                # Tailwind v4 theme + global styles
├── types/
│   └── content.ts                 # TypeScript content interfaces
├── utils/
│   ├── cn.ts                      # className merge utility
│   └── format-date.ts             # Date formatting
└── config/
    └── navigation.ts              # Nav items config
```

---

## Chunk 1: Project Foundation & Content Model

### Task 1: Initialize Project & Install Dependencies

**Files:**
- Create: `package.json` (via npm init)
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize package.json**

```bash
npm init -y
```

- [ ] **Step 2: Install production dependencies**

```bash
npm install next@latest react@latest react-dom@latest framer-motion clsx tailwind-merge
```

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss @eslint/eslintrc eslint eslint-config-next
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create next.config.ts**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

- [ ] **Step 6: Create postcss.config.mjs**

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

- [ ] **Step 7: Update .gitignore**

Append to existing `.gitignore` (or create if missing):

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Build
*.tsbuildinfo
next-env.d.ts

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*

# Env
.env*.local

# Superpowers
.superpowers/
```

- [ ] **Step 8: Add scripts to package.json**

Update `"scripts"` in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

- [ ] **Step 9: Create ESLint config**

Create `eslint.config.mjs`:

```js
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [...compat.extends('next/core-web-vitals')]

export default eslintConfig
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 project with dependencies"
```

---

### Task 2: Configure Tailwind CSS 4 Theme

**Files:**
- Create: `src/styles/globals.css`

- [ ] **Step 1: Create globals.css with Tailwind v4 theme tokens**

Uses semantic token pattern (similar to shadcn/ui): CSS variables switch between dark/light, Tailwind utilities reference them via `@theme`. Components use `bg-background`, `text-foreground`, `text-muted-foreground` — no `dark:` variant needed for most colors.

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  /* Gold accents (same in both themes) */
  --color-gold-400: #e5c158;
  --color-gold-500: #d4af37;
  --color-gold-600: #b8941f;
  --color-gold-700: #9a7518;

  /* Semantic tokens — reference CSS variables that switch with theme */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}

/* Light theme values (default for :root) */
:root {
  --background: #f8f8fa;
  --foreground: #0f172a;
  --surface: #ffffff;
  --card: #f0f0f4;
  --card-foreground: #0f172a;
  --muted: #f0f0f4;
  --muted-foreground: #64748b;
  --border: #e2e2e8;
}

/* Dark theme values */
.dark {
  --background: #0a0a0f;
  --foreground: #e4e4e7;
  --surface: #111118;
  --card: #1a1a24;
  --card-foreground: #e4e4e7;
  --muted: #1a1a24;
  --muted-foreground: #a1a1aa;
  --border: #2a2a36;
}

/* Base styles */
body {
  font-family: var(--font-inter), ui-sans-serif, system-ui, -apple-system, sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

::selection {
  background-color: var(--color-gold-500);
  color: #000;
}
```

**Usage in components:**
- `bg-background` / `text-foreground` — auto-switches with theme
- `text-muted-foreground` / `bg-card` — auto-switches with theme
- `text-gold-500` / `border-gold-600` — same in both themes
- `dark:` variant only needed for gold accent hover overrides or special cases

- [ ] **Step 2: Commit**

```bash
git add src/styles/globals.css
git commit -m "style: configure Tailwind CSS 4 theme with dark/light tokens"
```

---

### Task 3: Set Up Testing Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Install testing dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 3: Create tests/setup.ts**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Verify test runner works**

Create a temporary test file `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('smoke test', () => {
  it('passes', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npx vitest run`
Expected: 1 test passed

- [ ] **Step 5: Delete smoke test and commit**

```bash
rm tests/smoke.test.ts
git add vitest.config.ts tests/setup.ts package.json package-lock.json
git commit -m "test: set up Vitest with React Testing Library"
```

---

### Task 4: Create Utility Functions

**Files:**
- Create: `src/utils/cn.ts`
- Create: `src/utils/format-date.ts`
- Test: `tests/utils/cn.test.ts`
- Test: `tests/utils/format-date.test.ts`

- [ ] **Step 1: Write failing test for cn()**

Create `tests/utils/cn.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cn } from '@/utils/cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('deduplicates Tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })
})
```

Run: `npx vitest run tests/utils/cn.test.ts`
Expected: FAIL — module not found

- [ ] **Step 2: Implement cn()**

Create `src/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Run: `npx vitest run tests/utils/cn.test.ts`
Expected: 3 tests passed

- [ ] **Step 3: Write failing test for formatDate()**

Create `tests/utils/format-date.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { formatDate, formatDateRange } from '@/utils/format-date'

describe('formatDate', () => {
  it('formats YYYY-MM to readable string', () => {
    expect(formatDate('2025-06')).toBe('Jun 2025')
  })

  it('formats YYYY to year only', () => {
    expect(formatDate('2024')).toBe('2024')
  })
})

describe('formatDateRange', () => {
  it('formats a date range', () => {
    expect(formatDateRange('2023-01', '2025-06')).toBe('Jan 2023 — Jun 2025')
  })

  it('handles present end date', () => {
    expect(formatDateRange('2023-01', null)).toBe('Jan 2023 — Present')
  })
})
```

Run: `npx vitest run tests/utils/format-date.test.ts`
Expected: FAIL — module not found

- [ ] **Step 4: Implement formatDate()**

Create `src/utils/format-date.ts`:

```ts
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function formatDate(dateStr: string): string {
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr
  }
  const [year, month] = dateStr.split('-')
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`
}

export function formatDateRange(start: string, end: string | null): string {
  const startFormatted = formatDate(start)
  const endFormatted = end ? formatDate(end) : 'Present'
  return `${startFormatted} — ${endFormatted}`
}
```

Run: `npx vitest run tests/utils/format-date.test.ts`
Expected: 4 tests passed

- [ ] **Step 5: Commit**

```bash
git add src/utils/ tests/utils/
git commit -m "feat: add cn() and formatDate() utility functions with tests"
```

---

### Task 5: Define TypeScript Content Interfaces

**Files:**
- Create: `src/types/content.ts`

- [ ] **Step 1: Create all content type definitions**

Create `src/types/content.ts`:

```ts
export interface Profile {
  name: string
  title: string
  tagline: string
  bio: string
  brandStatement: string
  avatar: string
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

export interface SkillCategory {
  category: string
  items: string[]
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
}

export interface ContactInfo {
  email: string
  linkedin: string
  github: string
  instagram?: string
  tiktok?: string
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

export interface ResearchEntry {
  title: string
  slug: string
  abstract: string
  tags: string[]
  date: string
  pdfPath?: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/content.ts
git commit -m "feat: define TypeScript content interfaces"
```

---

### Task 6: Create Content JSON Files

**Files:**
- Create: `src/content/profile.json`
- Create: `src/content/education.json`
- Create: `src/content/experience.json`
- Create: `src/content/certifications.json`
- Create: `src/content/skills.json`
- Create: `src/content/awards.json`
- Create: `src/content/courses.json`
- Create: `src/content/contact.json`
- Create: `src/content/downloads.json`
- Create: `src/content/site.json`
- Create: `src/content/research/index.json`

- [ ] **Step 1: Create profile.json**

```json
{
  "name": "Dzaki Muhammad Yusfian",
  "title": "Accounting & Finance Professional",
  "tagline": "Specializing in Tax, Audit, and Financial Analysis",
  "bio": "A dedicated accounting and finance professional with expertise in tax compliance, auditing, and financial analysis. Committed to transforming complex financial data into actionable insights that drive business decisions.",
  "brandStatement": "Transforming financial complexity into clarity.",
  "avatar": "/images/profile/avatar.jpg"
}
```

- [ ] **Step 2: Create education.json**

```json
[
  {
    "school": "Universitas Padjadjaran",
    "degree": "Bachelor of Accounting",
    "field": "Accounting",
    "startDate": "2021-08",
    "endDate": "2025-07",
    "details": [
      "Focus on taxation, auditing, and financial reporting",
      "Active in academic research and student organizations"
    ]
  }
]
```

- [ ] **Step 3: Create experience.json**

```json
[
  {
    "company": "Placeholder Company",
    "role": "Tax & Audit Intern",
    "startDate": "2024-01",
    "endDate": "2024-06",
    "location": "Bandung, Indonesia",
    "bullets": [
      "Assisted in preparing tax compliance reports for corporate clients",
      "Supported audit fieldwork including substantive testing procedures",
      "Compiled and analyzed financial data for quarterly reviews"
    ]
  }
]
```

- [ ] **Step 4: Create certifications.json**

```json
[
  {
    "name": "Brevet A & B Taxation",
    "issuer": "IAI (Ikatan Akuntan Indonesia)",
    "date": "2025-03",
    "documentPath": "/files/certificates/brevet-ab.pdf",
    "slug": "brevet-ab",
    "description": "Professional certification covering individual and corporate taxation in Indonesia."
  }
]
```

- [ ] **Step 5: Create skills.json**

```json
[
  {
    "category": "Technical Skills",
    "items": ["Financial Reporting", "Tax Compliance", "Auditing", "Budgeting & Forecasting", "Financial Analysis"]
  },
  {
    "category": "Tools & Software",
    "items": ["Microsoft Excel", "SAP", "MYOB", "e-SPT", "SPSS"]
  },
  {
    "category": "Soft Skills",
    "items": ["Analytical Thinking", "Attention to Detail", "Team Collaboration", "Communication", "Time Management"]
  }
]
```

- [ ] **Step 6: Create awards.json**

```json
[
  {
    "title": "Placeholder Academic Achievement Award",
    "issuer": "Universitas Padjadjaran",
    "date": "2024",
    "description": "Recognized for outstanding academic performance."
  }
]
```

- [ ] **Step 7: Create courses.json**

```json
[
  {
    "name": "Placeholder Professional Development Course",
    "provider": "Coursera",
    "date": "2025-01",
    "certificateUrl": "/files/certificates/course-cert.pdf"
  }
]
```

- [ ] **Step 8: Create contact.json**

```json
{
  "email": "placeholder@email.com",
  "linkedin": "https://linkedin.com/in/placeholder",
  "github": "https://github.com/placeholder",
  "instagram": "https://instagram.com/placeholder",
  "tiktok": "https://tiktok.com/@placeholder"
}
```

- [ ] **Step 9: Create downloads.json**

```json
{
  "items": [
    {
      "label": "Download CV (PDF)",
      "filePath": "/files/cv/dzaki-cv.pdf",
      "icon": "file-text",
      "format": "PDF"
    },
    {
      "label": "Download Presentation (PPTX)",
      "filePath": "/files/presentations/dzaki-portfolio.pptx",
      "icon": "presentation",
      "format": "PPTX"
    }
  ]
}
```

- [ ] **Step 10: Create site.json**

```json
{
  "title": "Dzaki Muhammad Yusfian — Accounting & Finance Professional",
  "description": "Professional portfolio showcasing expertise in accounting, tax, audit, and financial analysis.",
  "url": "https://placeholder.github.io/Proffesional_Portfolio",
  "ogImage": "/images/og-image.jpg",
  "locale": "en"
}
```

- [ ] **Step 11: Create research/index.json**

```json
[
  {
    "title": "Placeholder Research Paper Title",
    "slug": "placeholder-research",
    "abstract": "This is a placeholder abstract for a research paper exploring financial topics.",
    "tags": ["accounting", "taxation"],
    "date": "2025-06",
    "pdfPath": "/files/research/placeholder-research.pdf"
  }
]
```

- [ ] **Step 12: Commit**

```bash
git add src/content/
git commit -m "content: add placeholder content JSON files"
```

---

### Task 7: Build Content Loaders

**Files:**
- Create: `src/data/content.ts`
- Test: `tests/data/content.test.ts`

- [ ] **Step 1: Write failing tests for content loaders**

Create `tests/data/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  getProfile,
  getEducation,
  getExperience,
  getCertifications,
  getSkills,
  getAwards,
  getCourses,
  getContact,
  getDownloads,
  getSiteConfig,
  getResearchEntries,
} from '@/data/content'

describe('getProfile', () => {
  it('returns profile with required fields', () => {
    const profile = getProfile()
    expect(profile.name).toBeTruthy()
    expect(profile.title).toBeTruthy()
    expect(profile.tagline).toBeTruthy()
    expect(profile.bio).toBeTruthy()
    expect(profile.brandStatement).toBeTruthy()
    expect(profile.avatar).toBeTruthy()
  })
})

describe('getEducation', () => {
  it('returns array of education entries', () => {
    const entries = getEducation()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].school).toBeTruthy()
    expect(entries[0].degree).toBeTruthy()
  })
})

describe('getExperience', () => {
  it('returns array of experience entries', () => {
    const entries = getExperience()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].company).toBeTruthy()
    expect(entries[0].role).toBeTruthy()
  })
})

describe('getCertifications', () => {
  it('returns array of certification entries with slugs', () => {
    const entries = getCertifications()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].slug).toBeTruthy()
    expect(entries[0].name).toBeTruthy()
  })
})

describe('getSkills', () => {
  it('returns array of skill categories', () => {
    const categories = getSkills()
    expect(Array.isArray(categories)).toBe(true)
    expect(categories.length).toBeGreaterThan(0)
    expect(categories[0].category).toBeTruthy()
    expect(Array.isArray(categories[0].items)).toBe(true)
  })
})

describe('getAwards', () => {
  it('returns array of awards', () => {
    const awards = getAwards()
    expect(Array.isArray(awards)).toBe(true)
    expect(awards.length).toBeGreaterThan(0)
    expect(awards[0].title).toBeTruthy()
  })
})

describe('getCourses', () => {
  it('returns array of courses', () => {
    const courses = getCourses()
    expect(Array.isArray(courses)).toBe(true)
    expect(courses.length).toBeGreaterThan(0)
    expect(courses[0].name).toBeTruthy()
  })
})

describe('getContact', () => {
  it('returns contact info with email and linkedin', () => {
    const contact = getContact()
    expect(contact.email).toBeTruthy()
    expect(contact.linkedin).toBeTruthy()
  })
})

describe('getDownloads', () => {
  it('returns download items array', () => {
    const downloads = getDownloads()
    expect(Array.isArray(downloads.items)).toBe(true)
    expect(downloads.items.length).toBeGreaterThan(0)
    expect(downloads.items[0].filePath).toBeTruthy()
  })
})

describe('getSiteConfig', () => {
  it('returns site config with title and url', () => {
    const config = getSiteConfig()
    expect(config.title).toBeTruthy()
    expect(config.url).toBeTruthy()
  })
})

describe('getResearchEntries', () => {
  it('returns array of research entries with slugs', () => {
    const entries = getResearchEntries()
    expect(Array.isArray(entries)).toBe(true)
    expect(entries.length).toBeGreaterThan(0)
    expect(entries[0].slug).toBeTruthy()
    expect(entries[0].title).toBeTruthy()
  })
})
```

Run: `npx vitest run tests/data/content.test.ts`
Expected: FAIL — module `@/data/content` not found

- [ ] **Step 2: Implement content loaders**

Create `src/data/content.ts`:

```ts
import type {
  Profile,
  EducationEntry,
  ExperienceEntry,
  CertificationEntry,
  SkillCategory,
  AwardEntry,
  CourseEntry,
  ContactInfo,
  Downloads,
  SiteConfig,
  ResearchEntry,
} from '@/types/content'

import profileData from '@/content/profile.json'
import educationData from '@/content/education.json'
import experienceData from '@/content/experience.json'
import certificationsData from '@/content/certifications.json'
import skillsData from '@/content/skills.json'
import awardsData from '@/content/awards.json'
import coursesData from '@/content/courses.json'
import contactData from '@/content/contact.json'
import downloadsData from '@/content/downloads.json'
import siteData from '@/content/site.json'
import researchData from '@/content/research/index.json'

export function getProfile(): Profile {
  return profileData as Profile
}

export function getEducation(): EducationEntry[] {
  return educationData as EducationEntry[]
}

export function getExperience(): ExperienceEntry[] {
  return experienceData as ExperienceEntry[]
}

export function getCertifications(): CertificationEntry[] {
  return certificationsData as CertificationEntry[]
}

export function getSkills(): SkillCategory[] {
  return skillsData as SkillCategory[]
}

export function getAwards(): AwardEntry[] {
  return awardsData as AwardEntry[]
}

export function getCourses(): CourseEntry[] {
  return coursesData as CourseEntry[]
}

export function getContact(): ContactInfo {
  return contactData as ContactInfo
}

export function getDownloads(): Downloads {
  return downloadsData as Downloads
}

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig
}

export function getResearchEntries(): ResearchEntry[] {
  return researchData as ResearchEntry[]
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/data/content.test.ts`
Expected: 11 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/data/ tests/data/
git commit -m "feat: add typed content loaders with tests"
```

---

### Task 8: Create Navigation Config & Minimal App Shell

**Files:**
- Create: `src/config/navigation.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create navigation config**

Create `src/config/navigation.ts`:

```ts
export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

export const sectionLinks: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const pageLinks: NavItem[] = [
  { label: 'Research', href: '/research' },
]

export const allNavItems: NavItem[] = [...sectionLinks, ...pageLinks]
```

- [ ] **Step 2: Create minimal root layout**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { getSiteConfig } from '@/data/content'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteConfig = getSiteConfig()

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create minimal homepage**

Create `src/app/page.tsx`:

```tsx
import { getProfile } from '@/data/content'

export default function Home() {
  const profile = getProfile()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gold-500">{profile.name}</h1>
      <p className="mt-2 text-muted-foreground">{profile.title}</p>
    </main>
  )
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npx next build`
Expected: Build succeeds, static export generated in `out/` directory

- [ ] **Step 5: Commit**

```bash
git add src/config/ src/app/
git commit -m "feat: add navigation config and minimal app shell"
```

---

### Task 9: Create Public Directory Structure

**Files:**
- Create: `public/files/cv/.gitkeep`
- Create: `public/files/certificates/.gitkeep`
- Create: `public/files/research/.gitkeep`
- Create: `public/files/presentations/.gitkeep`
- Create: `public/images/profile/.gitkeep`
- Create: `public/images/backgrounds/.gitkeep`
- Create: `public/icons/.gitkeep`

- [ ] **Step 1: Create directory structure with .gitkeep files**

> **Note:** On Windows, use `New-Item -ItemType Directory -Force` and `New-Item -ItemType File -Force` instead of `mkdir -p` and `touch`.

```bash
mkdir -p public/files/cv public/files/certificates public/files/research public/files/presentations
mkdir -p public/images/profile public/images/backgrounds public/icons
touch public/files/cv/.gitkeep public/files/certificates/.gitkeep
touch public/files/research/.gitkeep public/files/presentations/.gitkeep
touch public/images/profile/.gitkeep public/images/backgrounds/.gitkeep
touch public/icons/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add public/
git commit -m "chore: create public directory structure for assets"
```

---

**End of Chunk 1**

---

## Chunk 2: Layout Shell & Navigation

### Task 10: Build useTheme Hook & ThemeProvider

**Files:**
- Create: `src/hooks/use-theme.tsx`
- Test: `tests/hooks/use-theme.test.tsx`

- [ ] **Step 1: Write failing test for useTheme**

Create `tests/hooks/use-theme.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/hooks/use-theme'

function TestComponent() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('toggles to light theme', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('persists theme to localStorage', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    await user.click(screen.getByText('Toggle'))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('adds dark class to documentElement for dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

Run: `npx vitest run tests/hooks/use-theme.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement useTheme hook**

Create `src/hooks/use-theme.tsx`:

```tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const initial = stored || 'dark'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/hooks/use-theme.test.tsx`
Expected: 4 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-theme.tsx tests/hooks/use-theme.test.tsx
git commit -m "feat: add useTheme hook with ThemeProvider"
```

---

### Task 11: Build ThemeToggle Component

**Files:**
- Create: `src/components/ui/theme-toggle.tsx`
- Test: `tests/components/ui/theme-toggle.test.tsx`

- [ ] **Step 1: Write failing test for ThemeToggle**

Create `tests/components/ui/theme-toggle.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/hooks/use-theme'
import { ThemeToggle } from '@/components/ui/theme-toggle'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders a toggle button with accessible label', () => {
    renderWithTheme()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    renderWithTheme()
    const button = screen.getByRole('button')
    await user.click(button)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
```

Run: `npx vitest run tests/components/ui/theme-toggle.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement ThemeToggle**

Create `src/components/ui/theme-toggle.tsx`:

```tsx
'use client'

import { useTheme } from '@/hooks/use-theme'
import { motion } from 'framer-motion'

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 text-muted-foreground hover:text-gold-500 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </motion.div>
    </button>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/ui/theme-toggle.test.tsx`
Expected: 2 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/theme-toggle.tsx tests/components/ui/theme-toggle.test.tsx
git commit -m "feat: add ThemeToggle component with sun/moon icons"
```

---

### Task 12: Build NavLinks Component

**Files:**
- Create: `src/components/navigation/nav-links.tsx`
- Test: `tests/components/navigation/nav-links.test.tsx`

- [ ] **Step 1: Write failing test for NavLinks**

Create `tests/components/navigation/nav-links.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavLinks } from '@/components/navigation/nav-links'

const mockItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Research', href: '/research' },
]

describe('NavLinks', () => {
  it('renders all navigation items', () => {
    render(<NavLinks items={mockItems} />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('highlights the active section link', () => {
    render(<NavLinks items={mockItems} activeSection="about" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.className).toContain('gold')
  })

  it('does not highlight non-active links', () => {
    render(<NavLinks items={mockItems} activeSection="about" />)
    const skillsLink = screen.getByText('Skills')
    expect(skillsLink.className).not.toContain('gold')
  })
})
```

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement NavLinks**

Create `src/components/navigation/nav-links.tsx`:

```tsx
import { cn } from '@/utils/cn'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
}

export function NavLinks({ items, activeSection }: NavLinksProps) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'text-muted-foreground hover:text-foreground',
            activeSection && item.href === `#${activeSection}` && 'text-gold-500'
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/navigation/nav-links.tsx tests/components/navigation/nav-links.test.tsx
git commit -m "feat: add NavLinks component with active section highlighting"
```

---

### Task 13: Build MobileMenu Component

**Files:**
- Create: `src/components/navigation/mobile-menu.tsx`
- Test: `tests/components/navigation/mobile-menu.test.tsx`

- [ ] **Step 1: Write failing test for MobileMenu**

Create `tests/components/navigation/mobile-menu.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileMenu } from '@/components/navigation/mobile-menu'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

const mockItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
]

describe('MobileMenu', () => {
  it('renders hamburger button', () => {
    render(<MobileMenu items={mockItems} />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('shows menu items when opened', async () => {
    const user = userEvent.setup()
    render(<MobileMenu items={mockItems} />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('closes when a link is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileMenu items={mockItems} />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    await user.click(screen.getByText('About'))
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement MobileMenu**

Create `src/components/navigation/mobile-menu.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { NavItem } from '@/config/navigation'

interface MobileMenuProps {
  items: NavItem[]
  activeSection?: string
}

export function MobileMenu({ items, activeSection }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-64 bg-surface border-l border-border z-50 p-6"
            >
              <nav className="flex flex-col gap-4 mt-12">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'text-lg font-medium transition-colors',
                      'text-muted-foreground hover:text-foreground',
                      activeSection && item.href === `#${activeSection}` && 'text-gold-500'
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/navigation/mobile-menu.tsx tests/components/navigation/mobile-menu.test.tsx
git commit -m "feat: add MobileMenu with slide-in panel animation"
```

---

### Task 14: Build useScrollSpy Hook

**Files:**
- Create: `src/hooks/use-scroll-spy.ts`
- Test: `tests/hooks/use-scroll-spy.test.ts`

- [ ] **Step 1: Write failing test for useScrollSpy**

Create `tests/hooks/use-scroll-spy.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollSpy } from '@/hooks/use-scroll-spy'

let observerCallback: IntersectionObserverCallback
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()
  global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
    observerCallback = callback
    return { observe: mockObserve, disconnect: mockDisconnect, unobserve: vi.fn() }
  })
})

describe('useScrollSpy', () => {
  it('observes all provided section IDs', () => {
    const sections = ['about', 'skills']
    sections.forEach((id) => {
      const el = document.createElement('section')
      el.id = id
      document.body.appendChild(el)
    })

    renderHook(() => useScrollSpy(sections))

    expect(mockObserve).toHaveBeenCalledTimes(2)

    sections.forEach((id) => document.getElementById(id)?.remove())
  })

  it('returns active section when intersection triggers', () => {
    const el = document.createElement('section')
    el.id = 'about'
    document.body.appendChild(el)

    const { result } = renderHook(() => useScrollSpy(['about']))

    act(() => {
      observerCallback(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    expect(result.current).toBe('about')

    el.remove()
  })

  it('disconnects observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollSpy(['about']))
    unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })
})
```

Run: `npx vitest run tests/hooks/use-scroll-spy.test.ts`
Expected: FAIL — module not found

- [ ] **Step 2: Implement useScrollSpy**

Create `src/hooks/use-scroll-spy.ts`:

```ts
'use client'

import { useState, useEffect } from 'react'

export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/hooks/use-scroll-spy.test.ts`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-scroll-spy.ts tests/hooks/use-scroll-spy.test.ts
git commit -m "feat: add useScrollSpy hook with IntersectionObserver"
```

---

### Task 15: Build Navbar Component

**Files:**
- Create: `src/components/layout/navbar.tsx`
- Test: `tests/components/layout/navbar.test.tsx`

- [ ] **Step 1: Write failing test for Navbar**

Create `tests/components/layout/navbar.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/hooks/use-theme'
import { Navbar } from '@/components/layout/navbar'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => 'about',
}))

describe('Navbar', () => {
  it('renders the site logo/brand', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    expect(screen.getByText('DM')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('renders the theme toggle', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/layout/navbar.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement Navbar**

Create `src/components/layout/navbar.tsx`:

```tsx
'use client'

import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { allNavItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
        <a href="/" className="text-lg font-bold text-gold-500">
          DM
        </a>
        <div className="flex items-center gap-2">
          <NavLinks items={allNavItems} activeSection={activeSection} />
          <ThemeToggle />
          <MobileMenu items={allNavItems} activeSection={activeSection} />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/layout/navbar.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/navbar.tsx tests/components/layout/navbar.test.tsx
git commit -m "feat: add Navbar with scroll spy, nav links, theme toggle"
```

---

### Task 16: Build Footer Component

**Files:**
- Create: `src/components/layout/footer.tsx`
- Test: `tests/components/layout/footer.test.tsx`

- [ ] **Step 1: Write failing test for Footer**

Create `tests/components/layout/footer.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders social links with accessible labels', () => {
    render(<Footer />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders social links as external links', () => {
    render(<Footer />)
    const linkedinLink = screen.getByLabelText('LinkedIn')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
```

Run: `npx vitest run tests/components/layout/footer.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement Footer**

Create `src/components/layout/footer.tsx`:

```tsx
import { getContact } from '@/data/content'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

export function Footer() {
  const contact = getContact()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {year} Dzaki Muhammad Yusfian. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-gold-500 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-gold-500 transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="text-muted-foreground hover:text-gold-500 transition-colors"
            aria-label="Email"
          >
            <EmailIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/layout/footer.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/footer.tsx tests/components/layout/footer.test.tsx
git commit -m "feat: add Footer with social links and copyright"
```

---

### Task 17: Build SectionWrapper Component

**Files:**
- Create: `src/components/layout/section-wrapper.tsx`
- Test: `tests/components/layout/section-wrapper.test.tsx`

- [ ] **Step 1: Write failing test for SectionWrapper**

Create `tests/components/layout/section-wrapper.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionWrapper } from '@/components/layout/section-wrapper'

describe('SectionWrapper', () => {
  it('renders children within a section element with correct id', () => {
    render(
      <SectionWrapper id="about">
        <p>Hello World</p>
      </SectionWrapper>
    )
    const section = document.getElementById('about')
    expect(section).toBeInTheDocument()
    expect(section?.tagName).toBe('SECTION')
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <SectionWrapper id="test" className="bg-surface">
        <p>Content</p>
      </SectionWrapper>
    )
    const section = document.getElementById('test')
    expect(section?.className).toContain('bg-surface')
  })

  it('wraps children in a max-width container', () => {
    render(
      <SectionWrapper id="test">
        <p>Content</p>
      </SectionWrapper>
    )
    const section = document.getElementById('test')
    const container = section?.firstElementChild
    expect(container?.className).toContain('max-w')
  })
})
```

Run: `npx vitest run tests/components/layout/section-wrapper.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement SectionWrapper**

Create `src/components/layout/section-wrapper.tsx`:

```tsx
import { cn } from '@/utils/cn'

interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-20 px-4', className)}>
      <div className="mx-auto max-w-6xl">
        {children}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/layout/section-wrapper.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/section-wrapper.tsx tests/components/layout/section-wrapper.test.tsx
git commit -m "feat: add SectionWrapper with max-width container"
```

---

### Task 18: Update RootLayout & Verify Build

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update RootLayout with ThemeProvider, Navbar, Footer, and flash-prevention script**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { getSiteConfig } from '@/data/content'
import { ThemeProvider } from '@/hooks/use-theme'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteConfig = getSiteConfig()

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

The inline `<script>` prevents flash of incorrect theme (FOIT) by reading localStorage and applying the `dark` class before first paint.

- [ ] **Step 2: Verify the build compiles**

Run: `npx next build`
Expected: Build succeeds with static export in `out/`

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (utility tests + hook tests + component tests)

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire up RootLayout with Navbar, Footer, ThemeProvider"
```

---

**End of Chunk 2**

---

## Chunk 3: UI Components & Core Sections (Part 1)

### Task 19: Build SectionHeading Component

**Files:**
- Create: `src/components/ui/section-heading.tsx`
- Test: `tests/components/ui/section-heading.test.tsx`

- [ ] **Step 1: Write failing test for SectionHeading**

Create `tests/components/ui/section-heading.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from '@/components/ui/section-heading'

describe('SectionHeading', () => {
  it('renders title as h2', () => {
    render(<SectionHeading title="About Me" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('About Me')
  })

  it('renders subtitle when provided', () => {
    render(<SectionHeading title="Skills" subtitle="What I bring to the table" />)
    expect(screen.getByText('What I bring to the table')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    const { container } = render(<SectionHeading title="Skills" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })

  it('renders the gold divider', () => {
    const { container } = render(<SectionHeading title="Test" />)
    const divider = container.querySelector('.bg-gold-500')
    expect(divider).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/ui/section-heading.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement SectionHeading**

Create `src/components/ui/section-heading.tsx`:

```tsx
interface SectionHeadingProps {
  title: string
  subtitle?: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-gold-500" />
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/ui/section-heading.test.tsx`
Expected: 4 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/section-heading.tsx tests/components/ui/section-heading.test.tsx
git commit -m "feat: add SectionHeading with gold divider"
```

---

### Task 20: Build Button Component

**Files:**
- Create: `src/components/ui/button.tsx`
- Test: `tests/components/ui/button.test.tsx`

- [ ] **Step 1: Write failing test for Button**

Create `tests/components/ui/button.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders as a button element by default', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('renders as an anchor element when href is provided', () => {
    render(<Button href="/about">Go</Button>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/about')
  })

  it('opens external links in new tab', () => {
    render(<Button href="https://example.com" external>External</Button>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button').className).toContain('bg-gold')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button').className).toContain('border')
  })

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).not.toContain('bg-gold')
    expect(btn.className).not.toContain('border-gold')
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

Run: `npx vitest run tests/components/ui/button.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement Button**

Create `src/components/ui/button.tsx`:

```tsx
import { cn } from '@/utils/cn'

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
}

const variantStyles = {
  primary: 'bg-gold-500 text-black hover:bg-gold-600 font-medium',
  secondary: 'border border-gold-500 text-gold-500 hover:bg-gold-500/10 font-medium',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
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
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/ui/button.test.tsx`
Expected: 7 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/button.tsx tests/components/ui/button.test.tsx
git commit -m "feat: add Button with primary/secondary/ghost variants"
```

---

### Task 21: Build Card Component

**Files:**
- Create: `src/components/ui/card.tsx`
- Test: `tests/components/ui/card.test.tsx`

- [ ] **Step 1: Write failing test for Card**

Create `tests/components/ui/card.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders as a div by default', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders as an anchor when href is provided', () => {
    render(<Card href="/details"><p>Linked card</p></Card>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/details')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="p-8"><p>Content</p></Card>)
    expect(container.firstElementChild?.className).toContain('p-8')
  })
})
```

Run: `npx vitest run tests/components/ui/card.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement Card**

Create `src/components/ui/card.tsx`:

```tsx
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  href?: string
}

export function Card({ children, className, href }: CardProps) {
  const classes = cn(
    'rounded-lg border border-border bg-card p-6 transition-all duration-200',
    'hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/5',
    className
  )

  if (href) {
    return (
      <a href={href} className={cn(classes, 'block')}>
        {children}
      </a>
    )
  }

  return <div className={classes}>{children}</div>
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/ui/card.test.tsx`
Expected: 4 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/card.tsx tests/components/ui/card.test.tsx
git commit -m "feat: add Card with hover lift and gold glow"
```

---

### Task 22: Build Badge Component

**Files:**
- Create: `src/components/ui/badge.tsx`
- Test: `tests/components/ui/badge.test.tsx`

- [ ] **Step 1: Write failing test for Badge**

Create `tests/components/ui/badge.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>TypeScript</Badge>)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const { container } = render(<Badge>Tag</Badge>)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('applies custom className', () => {
    const { container } = render(<Badge className="ml-2">Extra</Badge>)
    expect(container.firstElementChild?.className).toContain('ml-2')
  })
})
```

Run: `npx vitest run tests/components/ui/badge.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement Badge**

Create `src/components/ui/badge.tsx`:

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
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        'bg-gold-500/10 text-gold-500 border border-gold-500/20',
        className
      )}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/ui/badge.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/badge.tsx tests/components/ui/badge.test.tsx
git commit -m "feat: add Badge component for skill/tag labels"
```

---

### Task 23: Build TimelineItem Component

**Files:**
- Create: `src/components/ui/timeline-item.tsx`
- Test: `tests/components/ui/timeline-item.test.tsx`

- [ ] **Step 1: Write failing test for TimelineItem**

Create `tests/components/ui/timeline-item.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from '@/components/ui/timeline-item'

describe('TimelineItem', () => {
  it('renders title, subtitle, and date range', () => {
    render(
      <TimelineItem
        title="Software Engineer"
        subtitle="Acme Corp"
        dateRange="Jan 2023 — Present"
      >
        <p>Built stuff</p>
      </TimelineItem>
    )
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Jan 2023 — Present')).toBeInTheDocument()
    expect(screen.getByText('Built stuff')).toBeInTheDocument()
  })

  it('renders connector line when not last item', () => {
    const { container } = render(
      <TimelineItem title="Role" subtitle="Company" dateRange="2023">
        <p>Details</p>
      </TimelineItem>
    )
    const connector = container.querySelector('.bg-border')
    expect(connector).toBeInTheDocument()
  })

  it('hides connector line when isLast is true', () => {
    const { container } = render(
      <TimelineItem title="Role" subtitle="Company" dateRange="2023" isLast>
        <p>Details</p>
      </TimelineItem>
    )
    const connectors = container.querySelectorAll('.bg-border')
    expect(connectors.length).toBe(0)
  })
})
```

Run: `npx vitest run tests/components/ui/timeline-item.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement TimelineItem**

Create `src/components/ui/timeline-item.tsx`:

```tsx
interface TimelineItemProps {
  title: string
  subtitle: string
  dateRange: string
  children: React.ReactNode
  isLast?: boolean
}

export function TimelineItem({
  title,
  subtitle,
  dateRange,
  children,
  isLast,
}: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
      )}
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 border-gold-500 bg-background flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-gold-500" />
      </div>
      {/* Content */}
      <div>
        <p className="text-sm text-gold-500 font-medium">{dateRange}</p>
        <h3 className="text-lg font-semibold text-foreground mt-1">{title}</h3>
        <p className="text-muted-foreground">{subtitle}</p>
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/ui/timeline-item.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/timeline-item.tsx tests/components/ui/timeline-item.test.tsx
git commit -m "feat: add TimelineItem with connector line and dot"
```

---

### Task 24: Build HeroSection

**Files:**
- Create: `src/components/sections/hero-section.tsx`
- Test: `tests/components/sections/hero-section.test.tsx`

- [ ] **Step 1: Write failing test for HeroSection**

Create `tests/components/sections/hero-section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/sections/hero-section'

describe('HeroSection', () => {
  it('renders the profile name as h1', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBeTruthy()
  })

  it('renders the profile title', () => {
    render(<HeroSection />)
    expect(screen.getByText(/accounting|finance/i)).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/specializing|tax|audit/i)).toBeInTheDocument()
  })

  it('has the hero section id', () => {
    render(<HeroSection />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/sections/hero-section.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement HeroSection**

Create `src/components/sections/hero-section.tsx`:

```tsx
import { getProfile } from '@/data/content'

export function HeroSection() {
  const profile = getProfile()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-4"
    >
      <div className="text-center">
        {/* Avatar — rendered as a placeholder circle until a real image is provided */}
        <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-gold-500 bg-muted">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {profile.name}
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gold-500">
          {profile.title}
        </p>
        <p className="mt-2 text-lg text-muted-foreground max-w-lg mx-auto">
          {profile.tagline}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/sections/hero-section.test.tsx`
Expected: 4 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero-section.tsx tests/components/sections/hero-section.test.tsx
git commit -m "feat: add HeroSection with avatar and profile info"
```

---

### Task 25: Build ProfileSection

**Files:**
- Create: `src/components/sections/profile-section.tsx`
- Test: `tests/components/sections/profile-section.test.tsx`

- [ ] **Step 1: Write failing test for ProfileSection**

Create `tests/components/sections/profile-section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileSection } from '@/components/sections/profile-section'

describe('ProfileSection', () => {
  it('renders the About Me heading', () => {
    render(<ProfileSection />)
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
  })

  it('renders the bio text', () => {
    render(<ProfileSection />)
    expect(screen.getByText(/accounting|finance|professional/i)).toBeInTheDocument()
  })

  it('renders the brand statement as a blockquote', () => {
    const { container } = render(<ProfileSection />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote).toBeInTheDocument()
    expect(blockquote?.textContent).toBeTruthy()
  })

  it('has the about section id', () => {
    render(<ProfileSection />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/sections/profile-section.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement ProfileSection**

Create `src/components/sections/profile-section.tsx`:

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getProfile } from '@/data/content'

export function ProfileSection() {
  const profile = getProfile()

  return (
    <SectionWrapper id="about">
      <SectionHeading title="About Me" />
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {profile.bio}
        </p>
        <blockquote className="mt-8 text-xl italic text-gold-500 font-medium">
          &ldquo;{profile.brandStatement}&rdquo;
        </blockquote>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/sections/profile-section.test.tsx`
Expected: 4 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/profile-section.tsx tests/components/sections/profile-section.test.tsx
git commit -m "feat: add ProfileSection with bio and brand statement"
```

---

### Task 26: Build TimelineSection

**Files:**
- Create: `src/components/sections/timeline-section.tsx`
- Test: `tests/components/sections/timeline-section.test.tsx`

- [ ] **Step 1: Write failing test for TimelineSection**

Create `tests/components/sections/timeline-section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineSection } from '@/components/sections/timeline-section'

describe('TimelineSection', () => {
  it('renders the Experience & Education heading', () => {
    render(<TimelineSection />)
    expect(
      screen.getByRole('heading', { name: /experience.*education/i })
    ).toBeInTheDocument()
  })

  it('renders education entries', () => {
    render(<TimelineSection />)
    expect(screen.getByText(/universitas|university/i)).toBeInTheDocument()
  })

  it('renders experience entries', () => {
    render(<TimelineSection />)
    expect(screen.getByText(/intern|company/i)).toBeInTheDocument()
  })

  it('has the experience section id', () => {
    render(<TimelineSection />)
    expect(document.getElementById('experience')).toBeInTheDocument()
  })

  it('renders date ranges for each entry', () => {
    render(<TimelineSection />)
    const datePattern = /\w{3} \d{4}|Present/
    const dateElements = screen.getAllByText(datePattern)
    expect(dateElements.length).toBeGreaterThan(0)
  })
})
```

Run: `npx vitest run tests/components/sections/timeline-section.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement TimelineSection**

Create `src/components/sections/timeline-section.tsx`:

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { TimelineItem } from '@/components/ui/timeline-item'
import { getEducation, getExperience } from '@/data/content'
import { formatDateRange } from '@/utils/format-date'

interface TimelineEntry {
  type: 'education' | 'experience'
  title: string
  subtitle: string
  startDate: string
  endDate: string | null
  bullets: string[]
}

export function TimelineSection() {
  const education = getEducation()
  const experience = getExperience()

  const allItems: TimelineEntry[] = [
    ...education.map((e) => ({
      type: 'education' as const,
      title: `${e.degree} — ${e.field}`,
      subtitle: e.school,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.details,
    })),
    ...experience.map((e) => ({
      type: 'experience' as const,
      title: e.role,
      subtitle: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets,
    })),
  ].sort((a, b) => b.startDate.localeCompare(a.startDate))

  return (
    <SectionWrapper id="experience">
      <SectionHeading title="Experience & Education" />
      <div className="max-w-3xl mx-auto">
        {allItems.map((item, index) => (
          <TimelineItem
            key={`${item.type}-${item.startDate}`}
            title={item.title}
            subtitle={item.subtitle}
            dateRange={formatDateRange(item.startDate, item.endDate)}
            isLast={index === allItems.length - 1}
          >
            <ul className="list-disc list-inside space-y-1">
              {item.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/sections/timeline-section.test.tsx`
Expected: 5 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/timeline-section.tsx tests/components/sections/timeline-section.test.tsx
git commit -m "feat: add TimelineSection with merged education/experience"
```

---

**End of Chunk 3**

---

## Chunk 4: Core Sections (Part 2) & Homepage Assembly

### Task 27: Build CertificationsSection

**Files:**
- Create: `src/components/sections/certifications-section.tsx`
- Test: `tests/components/sections/certifications-section.test.tsx`

- [ ] **Step 1: Write failing test for CertificationsSection**

Create `tests/components/sections/certifications-section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CertificationsSection } from '@/components/sections/certifications-section'

describe('CertificationsSection', () => {
  it('renders the Certifications heading', () => {
    render(<CertificationsSection />)
    expect(
      screen.getByRole('heading', { name: /certifications/i })
    ).toBeInTheDocument()
  })

  it('renders certification cards', () => {
    render(<CertificationsSection />)
    expect(screen.getByText(/brevet|cpa|certification/i)).toBeInTheDocument()
  })

  it('renders issuer and date for each certification', () => {
    render(<CertificationsSection />)
    expect(screen.getByText(/IAI|institute/i)).toBeInTheDocument()
  })

  it('renders links to certification detail pages', () => {
    render(<CertificationsSection />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    expect(links[0].getAttribute('href')).toContain('/certifications/')
  })

  it('has the certifications section id', () => {
    render(<CertificationsSection />)
    expect(document.getElementById('certifications')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/sections/certifications-section.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement CertificationsSection**

Create `src/components/sections/certifications-section.tsx`:

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { getCertifications } from '@/data/content'
import { formatDate } from '@/utils/format-date'

export function CertificationsSection() {
  const certifications = getCertifications()

  return (
    <SectionWrapper id="certifications">
      <SectionHeading title="Certifications" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.slug} href={`/certifications/${cert.slug}`}>
            <h3 className="text-lg font-semibold text-foreground">
              {cert.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
            <p className="mt-2 text-sm text-gold-500">{formatDate(cert.date)}</p>
            {cert.description && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {cert.description}
              </p>
            )}
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/sections/certifications-section.test.tsx`
Expected: 5 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/certifications-section.tsx tests/components/sections/certifications-section.test.tsx
git commit -m "feat: add CertificationsSection with card grid"
```

---

### Task 28: Build SkillsSection

**Files:**
- Create: `src/components/sections/skills-section.tsx`
- Test: `tests/components/sections/skills-section.test.tsx`

- [ ] **Step 1: Write failing test for SkillsSection**

Create `tests/components/sections/skills-section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillsSection } from '@/components/sections/skills-section'

describe('SkillsSection', () => {
  it('renders the Skills heading', () => {
    render(<SkillsSection />)
    expect(
      screen.getByRole('heading', { name: /skills/i })
    ).toBeInTheDocument()
  })

  it('renders skill categories', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/technical/i)).toBeInTheDocument()
    expect(screen.getByText(/tools/i)).toBeInTheDocument()
    expect(screen.getByText(/soft/i)).toBeInTheDocument()
  })

  it('renders individual skill items as badges', () => {
    render(<SkillsSection />)
    expect(screen.getByText('Financial Reporting')).toBeInTheDocument()
    expect(screen.getByText('Microsoft Excel')).toBeInTheDocument()
  })

  it('renders awards subsection', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/awards/i)).toBeInTheDocument()
  })

  it('renders courses subsection', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/courses|training/i)).toBeInTheDocument()
  })

  it('has the skills section id', () => {
    render(<SkillsSection />)
    expect(document.getElementById('skills')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/sections/skills-section.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement SkillsSection**

Create `src/components/sections/skills-section.tsx`:

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getSkills, getAwards, getCourses } from '@/data/content'
import { formatDate } from '@/utils/format-date'

export function SkillsSection() {
  const skills = getSkills()
  const awards = getAwards()
  const courses = getCourses()

  return (
    <SectionWrapper id="skills">
      <SectionHeading title="Skills & Achievements" />

      {/* Skill Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {skills.map((category) => (
          <Card key={category.category}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Awards */}
      {awards.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Awards & Achievements
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {awards.map((award) => (
              <Card key={award.title}>
                <h4 className="font-semibold text-foreground">{award.title}</h4>
                <p className="text-sm text-muted-foreground">{award.issuer}</p>
                <p className="text-sm text-gold-500 mt-1">
                  {formatDate(award.date)}
                </p>
                {award.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {award.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Courses */}
      {courses.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Courses & Training
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.name}>
                <h4 className="font-semibold text-foreground">{course.name}</h4>
                <p className="text-sm text-muted-foreground">{course.provider}</p>
                <p className="text-sm text-gold-500 mt-1">
                  {formatDate(course.date)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/sections/skills-section.test.tsx`
Expected: 6 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/skills-section.tsx tests/components/sections/skills-section.test.tsx
git commit -m "feat: add SkillsSection with categories, awards, and courses"
```

---

### Task 29: Build ContactSection

**Files:**
- Create: `src/components/sections/contact-section.tsx`
- Test: `tests/components/sections/contact-section.test.tsx`

- [ ] **Step 1: Write failing test for ContactSection**

Create `tests/components/sections/contact-section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactSection } from '@/components/sections/contact-section'

describe('ContactSection', () => {
  it('renders the Contact heading', () => {
    render(<ContactSection />)
    expect(
      screen.getByRole('heading', { name: /get in touch/i })
    ).toBeInTheDocument()
  })

  it('renders email link', () => {
    render(<ContactSection />)
    const emailLink = screen.getByRole('link', { name: /email/i })
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('renders LinkedIn link', () => {
    render(<ContactSection />)
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin'))
  })

  it('renders download buttons', () => {
    render(<ContactSection />)
    expect(screen.getByText(/download cv/i)).toBeInTheDocument()
  })

  it('has the contact section id', () => {
    render(<ContactSection />)
    expect(document.getElementById('contact')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/sections/contact-section.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement ContactSection**

Create `src/components/sections/contact-section.tsx`:

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { getContact, getDownloads } from '@/data/content'

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

export function ContactSection() {
  const contact = getContact()
  const downloads = getDownloads()

  return (
    <SectionWrapper id="contact">
      <SectionHeading title="Get In Touch" />

      <div className="max-w-2xl mx-auto text-center">
        {/* Contact Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button href={`mailto:${contact.email}`} variant="secondary" size="lg">
            <span aria-label="Email">✉ Email Me</span>
          </Button>
          <Button href={contact.linkedin} variant="secondary" size="lg" external>
            <span aria-label="LinkedIn">LinkedIn</span>
          </Button>
          <Button href={contact.github} variant="secondary" size="lg" external>
            <span aria-label="GitHub">GitHub</span>
          </Button>
          {contact.instagram && (
            <Button href={contact.instagram} variant="ghost" size="lg" external>
              Instagram
            </Button>
          )}
          {contact.tiktok && (
            <Button href={contact.tiktok} variant="ghost" size="lg" external>
              TikTok
            </Button>
          )}
        </div>

        {/* Download Buttons */}
        <div className="border-t border-border pt-8">
          <p className="text-muted-foreground mb-4">Download my documents:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {downloads.items.map((item) => (
              <Button key={item.filePath} href={item.filePath} variant="primary" size="lg" external>
                <DownloadIcon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/sections/contact-section.test.tsx`
Expected: 5 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/contact-section.tsx tests/components/sections/contact-section.test.tsx
git commit -m "feat: add ContactSection with social links and downloads"
```

---

### Task 30: Assemble Full Homepage

**Files:**
- Modify: `src/app/page.tsx`
- Test: `tests/app/page.test.tsx`

- [ ] **Step 1: Write failing test for homepage assembly**

Create `tests/app/page.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Home page', () => {
  it('renders the hero section', () => {
    render(<Home />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })

  it('renders the about section', () => {
    render(<Home />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders the experience section', () => {
    render(<Home />)
    expect(document.getElementById('experience')).toBeInTheDocument()
  })

  it('renders the certifications section', () => {
    render(<Home />)
    expect(document.getElementById('certifications')).toBeInTheDocument()
  })

  it('renders the skills section', () => {
    render(<Home />)
    expect(document.getElementById('skills')).toBeInTheDocument()
  })

  it('renders the contact section', () => {
    render(<Home />)
    expect(document.getElementById('contact')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/app/page.test.tsx`
Expected: FAIL — page doesn't include all sections yet

- [ ] **Step 2: Update page.tsx with all sections**

Replace `src/app/page.tsx` with:

```tsx
import { HeroSection } from '@/components/sections/hero-section'
import { ProfileSection } from '@/components/sections/profile-section'
import { TimelineSection } from '@/components/sections/timeline-section'
import { CertificationsSection } from '@/components/sections/certifications-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ContactSection } from '@/components/sections/contact-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProfileSection />
      <TimelineSection />
      <CertificationsSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
```

- [ ] **Step 3: Run page tests to verify**

Run: `npx vitest run tests/app/page.test.tsx`
Expected: 6 tests passed

- [ ] **Step 4: Run full build to verify**

Run: `npx next build`
Expected: Build succeeds. Static export in `out/` includes `index.html` with all sections.

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx tests/app/page.test.tsx
git commit -m "feat: assemble full homepage with all sections"
```

---

**End of Chunk 4**

---

## Chunk 5: Animation Layer

### Task 31: Build useReducedMotion Hook

**Files:**
- Create: `src/hooks/use-reduced-motion.ts`
- Test: `tests/hooks/use-reduced-motion.test.ts`

- [ ] **Step 1: Write failing test for useReducedMotion**

Create `tests/hooks/use-reduced-motion.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

describe('useReducedMotion', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  })

  it('returns false when user has no motion preference', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when user prefers reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })
})
```

Run: `npx vitest run tests/hooks/use-reduced-motion.test.ts`
Expected: FAIL — module not found

- [ ] **Step 2: Implement useReducedMotion**

Create `src/hooks/use-reduced-motion.ts`:

```ts
'use client'

import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mql.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/hooks/use-reduced-motion.test.ts`
Expected: 2 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-reduced-motion.ts tests/hooks/use-reduced-motion.test.ts
git commit -m "feat: add useReducedMotion hook"
```

---

### Task 32: Build AuroraBackground

**Files:**
- Create: `src/components/motion/aurora-background.tsx`
- Test: `tests/components/motion/aurora-background.test.tsx`

- [ ] **Step 1: Write failing test for AuroraBackground**

Create `tests/components/motion/aurora-background.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AuroraBackground } from '@/components/motion/aurora-background'

let mockReducedMotion = false
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => mockReducedMotion,
}))

beforeEach(() => {
  mockReducedMotion = false
})

describe('AuroraBackground', () => {
  it('renders a canvas element', () => {
    const { container } = render(<AuroraBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('positions canvas as fixed background', () => {
    const { container } = render(<AuroraBackground />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('fixed')
    expect(wrapper?.className).toContain('inset-0')
  })

  it('returns null when user prefers reduced motion', () => {
    mockReducedMotion = true
    const { container } = render(<AuroraBackground />)
    expect(container.innerHTML).toBe('')
  })
})
```

Run: `npx vitest run tests/components/motion/aurora-background.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement AuroraBackground**

Create `src/components/motion/aurora-background.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface AuroraWave {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  color: string
}

function createWaves(width: number, height: number): AuroraWave[] {
  const colors = [
    'rgba(212, 175, 55, 0.06)',
    'rgba(229, 193, 88, 0.04)',
    'rgba(184, 148, 31, 0.05)',
    'rgba(212, 175, 55, 0.03)',
    'rgba(154, 117, 24, 0.04)',
  ]

  return colors.map((color) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 200 + Math.random() * 300,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.2,
    color,
  }))
}

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let waves: AuroraWave[]

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      waves = createWaves(canvas!.width, canvas!.height)
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      waves.forEach((wave) => {
        const gradient = ctx!.createRadialGradient(
          wave.x, wave.y, 0,
          wave.x, wave.y, wave.radius
        )
        gradient.addColorStop(0, wave.color)
        gradient.addColorStop(1, 'transparent')

        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        ctx!.fill()

        wave.x += wave.dx
        wave.y += wave.dy

        if (wave.x < -wave.radius) wave.x = canvas!.width + wave.radius
        if (wave.x > canvas!.width + wave.radius) wave.x = -wave.radius
        if (wave.y < -wave.radius) wave.y = canvas!.height + wave.radius
        if (wave.y > canvas!.height + wave.radius) wave.y = -wave.radius
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId)
      } else {
        draw()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [prefersReduced])

  if (prefersReduced) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/motion/aurora-background.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/aurora-background.tsx tests/components/motion/aurora-background.test.tsx
git commit -m "feat: add AuroraBackground with Canvas 2D gold waves"
```

---

### Task 33: Build CustomCursor

**Files:**
- Create: `src/components/motion/custom-cursor.tsx`
- Test: `tests/components/motion/custom-cursor.test.tsx`

- [ ] **Step 1: Write failing test for CustomCursor**

Create `tests/components/motion/custom-cursor.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { CustomCursor } from '@/components/motion/custom-cursor'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
  useSpring: () => ({ set: vi.fn(), get: () => 0 }),
}))

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

describe('CustomCursor', () => {
  it('renders cursor elements', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('pointer: fine'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const { container } = render(<CustomCursor />)
    const cursorElements = container.querySelectorAll('[aria-hidden="true"]')
    expect(cursorElements.length).toBeGreaterThan(0)
  })

  it('returns null on touch devices', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const { container } = render(<CustomCursor />)
    expect(container.innerHTML).toBe('')
  })
})
```

Run: `npx vitest run tests/components/motion/custom-cursor.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement CustomCursor**

Create `src/components/motion/custom-cursor.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function CustomCursor() {
  const prefersReduced = useReducedMotion()
  const [isPointerDevice, setIsPointerDevice] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300 }
  const ringX = useSpring(cursorX, springConfig)
  const ringY = useSpring(cursorY, springConfig)

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    setIsPointerDevice(mql.matches)
  }, [])

  useEffect(() => {
    if (!isPointerDevice || prefersReduced) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      setIsHovering(!!isInteractive)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isPointerDevice, prefersReduced, cursorX, cursorY])

  if (!isPointerDevice || prefersReduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 border-gold-500"
        style={{
          x: ringX,
          y: ringY,
          width: isHovering ? 40 : 24,
          height: isHovering ? 40 : 24,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s',
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-gold-500"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/motion/custom-cursor.test.tsx`
Expected: 2 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/custom-cursor.tsx tests/components/motion/custom-cursor.test.tsx
git commit -m "feat: add CustomCursor with spring physics and hover state"
```

---

### Task 34: Build ScrollReveal Component

**Files:**
- Create: `src/components/motion/scroll-reveal.tsx`
- Test: `tests/components/motion/scroll-reveal.test.tsx`

- [ ] **Step 1: Write failing test for ScrollReveal**

Create `tests/components/motion/scroll-reveal.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ScrollReveal', () => {
  it('renders children', () => {
    render(
      <ScrollReveal>
        <p>Reveal me</p>
      </ScrollReveal>
    )
    expect(screen.getByText('Reveal me')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ScrollReveal className="custom-class">
        <p>Content</p>
      </ScrollReveal>
    )
    expect(container.firstElementChild?.className).toContain('custom-class')
  })
})
```

Run: `npx vitest run tests/components/motion/scroll-reveal.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement ScrollReveal**

Create `src/components/motion/scroll-reveal.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  // Note: Framer Motion automatically respects prefers-reduced-motion by
  // disabling animations. No manual useReducedMotion check needed here.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/components/motion/scroll-reveal.test.tsx`
Expected: 2 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/scroll-reveal.tsx tests/components/motion/scroll-reveal.test.tsx
git commit -m "feat: add ScrollReveal with fade-up animation"
```

---

### Task 35: Build HoverGlow & PageTransition Components

**Files:**
- Create: `src/components/motion/hover-glow.tsx`
- Create: `src/components/motion/page-transition.tsx`
- Test: `tests/components/motion/hover-glow.test.tsx`
- Test: `tests/components/motion/page-transition.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/components/motion/hover-glow.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HoverGlow } from '@/components/motion/hover-glow'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('HoverGlow', () => {
  it('renders children', () => {
    render(
      <HoverGlow>
        <p>Glowing card</p>
      </HoverGlow>
    )
    expect(screen.getByText('Glowing card')).toBeInTheDocument()
  })
})
```

Create `tests/components/motion/page-transition.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageTransition } from '@/components/motion/page-transition'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/components/motion/`
Expected: FAIL — modules not found

- [ ] **Step 2: Implement HoverGlow**

Create `src/components/motion/hover-glow.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface HoverGlowProps {
  children: React.ReactNode
  className?: string
}

export function HoverGlow({ children, className }: HoverGlowProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('group relative', className)}
    >
      {/* Glow effect — uses opacity only (GPU-composited per spec §8) */}
      <div className="absolute -inset-0.5 rounded-lg bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Implement PageTransition**

Create `src/components/motion/page-transition.tsx`:

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Run tests to verify**

Run: `npx vitest run tests/components/motion/`
Expected: All motion component tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/hover-glow.tsx src/components/motion/page-transition.tsx tests/components/motion/
git commit -m "feat: add HoverGlow and PageTransition motion components"
```

---

### Task 36: Integrate Animations into Layout and Sections

**Files:**
- Modify: `src/app/layout.tsx` (add AuroraBackground, CustomCursor, PageTransition)
- Modify: `src/components/layout/section-wrapper.tsx` (wrap with ScrollReveal)
- Modify: `src/components/ui/card.tsx` (wrap with HoverGlow)
- Modify: `src/components/ui/button.tsx` (add whileTap micro-interaction)
- Modify: `tests/components/layout/section-wrapper.test.tsx` (add framer-motion mock)

- [ ] **Step 1: Add AuroraBackground, CustomCursor, and PageTransition to RootLayout**

Update `src/app/layout.tsx` — add imports and place components inside `<ThemeProvider>`:

```tsx
// Add these imports
import { AuroraBackground } from '@/components/motion/aurora-background'
import { CustomCursor } from '@/components/motion/custom-cursor'
import { PageTransition } from '@/components/motion/page-transition'

// Inside <ThemeProvider>, before <Navbar />:
<AuroraBackground />
<CustomCursor />
<Navbar />
```

Full updated body content:

```tsx
<body className="min-h-screen">
  <ThemeProvider>
    <AuroraBackground />
    <CustomCursor />
    <Navbar />
    <PageTransition>
      <main className="pt-16">{children}</main>
    </PageTransition>
    <Footer />
  </ThemeProvider>
</body>
```

- [ ] **Step 2: Add ScrollReveal to SectionWrapper**

Update `src/components/layout/section-wrapper.tsx`:

```tsx
'use client'

import { cn } from '@/utils/cn'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-20 px-4', className)}>
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          {children}
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Wrap Card component with HoverGlow**

Update `src/components/ui/card.tsx` — import HoverGlow and wrap the outer element:

```tsx
import { HoverGlow } from '@/components/motion/hover-glow'

// Replace the existing Card return. Wrap the whole card in HoverGlow:
export function Card({ children, className }: CardProps) {
  return (
    <HoverGlow>
      <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
        {children}
      </div>
    </HoverGlow>
  )
}
```

- [ ] **Step 4: Add whileTap micro-interaction to Button**

Update `src/components/ui/button.tsx` — convert to motion.button for press feedback (spec §8):

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variants = {
  primary: 'bg-gold-500 text-background hover:bg-gold-600',
  secondary: 'border border-border text-foreground hover:bg-surface',
  ghost: 'text-muted-foreground hover:text-foreground',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

- [ ] **Step 5: Update section-wrapper test with framer-motion mock**

Add this mock at the top of `tests/components/layout/section-wrapper.test.tsx` (unconditionally — SectionWrapper now always imports ScrollReveal which uses framer-motion):

```tsx
import { vi } from 'vitest'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))
```

- [ ] **Step 6: Run full build to verify**

Run: `npx next build`
Expected: Build succeeds

- [ ] **Step 7: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx src/components/layout/section-wrapper.tsx src/components/ui/card.tsx src/components/ui/button.tsx tests/
git commit -m "feat: integrate animations — aurora, cursor, scroll reveal, hover glow, button press"
```

---

**End of Chunk 5**

---

## Chunk 6: Sub-Pages & MDX

### Task 37: Set Up MDX Rendering

**Files:**
- Create: `src/lib/mdx.ts`
- Test: `tests/lib/mdx.test.ts`

- [ ] **Step 1: Install MDX dependencies**

```bash
npm install next-mdx-remote gray-matter
```

- [ ] **Step 2: Write failing test for MDX utilities**

Create `tests/lib/mdx.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getResearchBySlug, getAllResearchSlugs } from '@/lib/mdx'

describe('getAllResearchSlugs', () => {
  it('returns an array of slug strings', () => {
    const slugs = getAllResearchSlugs()
    expect(Array.isArray(slugs)).toBe(true)
  })
})

describe('getResearchBySlug', () => {
  it('returns null for non-existent slug', () => {
    const result = getResearchBySlug('non-existent-slug')
    expect(result).toBeNull()
  })
})
```

Run: `npx vitest run tests/lib/mdx.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement MDX utilities**

Create `src/lib/mdx.ts`:

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const RESEARCH_DIR = path.join(process.cwd(), 'src/content/research')

export function getAllResearchSlugs(): string[] {
  if (!fs.existsSync(RESEARCH_DIR)) return []

  return fs
    .readdirSync(RESEARCH_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export interface ResearchMdxData {
  slug: string
  content: string
  frontmatter: {
    title: string
    date: string
    abstract: string
    tags: string[]
    pdfPath?: string
  }
}

export function getResearchBySlug(slug: string): ResearchMdxData | null {
  const filePath = path.join(RESEARCH_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    content,
    frontmatter: {
      title: data.title || '',
      date: data.date || '',
      abstract: data.abstract || '',
      tags: data.tags || [],
      pdfPath: data.pdfPath,
    },
  }
}
```

- [ ] **Step 4: Run tests to verify**

Run: `npx vitest run tests/lib/mdx.test.ts`
Expected: 2 tests passed

- [ ] **Step 5: Create a sample MDX research file**

Create `src/content/research/placeholder-research.mdx`:

```mdx
---
title: "Placeholder Research Paper Title"
date: "2025-06"
abstract: "This is a placeholder abstract for a research paper exploring financial topics."
tags: ["accounting", "taxation"]
pdfPath: "/files/research/placeholder-research.pdf"
---

## Introduction

This is placeholder content for a research paper. Replace this with actual research content.

## Methodology

Describe the research methodology here.

## Findings

Present the research findings here.

## Conclusion

Summarize the key takeaways.
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/mdx.ts tests/lib/mdx.test.ts src/content/research/placeholder-research.mdx package.json package-lock.json
git commit -m "feat: add MDX rendering utilities with sample research content"
```

---

### Task 38: Build Research Listing Page

**Files:**
- Create: `src/app/research/page.tsx`
- Test: `tests/app/research-page.test.tsx`

- [ ] **Step 1: Write failing test for research listing**

Create `tests/app/research-page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResearchPage from '@/app/research/page'

describe('ResearchPage', () => {
  it('renders Research heading', () => {
    render(<ResearchPage />)
    expect(
      screen.getByRole('heading', { name: /research/i })
    ).toBeInTheDocument()
  })

  it('renders research entry cards', () => {
    render(<ResearchPage />)
    expect(screen.getByText(/placeholder research/i)).toBeInTheDocument()
  })

  it('renders links to individual research pages', () => {
    render(<ResearchPage />)
    const links = screen.getAllByRole('link')
    const researchLinks = links.filter((l) =>
      l.getAttribute('href')?.includes('/research/')
    )
    expect(researchLinks.length).toBeGreaterThan(0)
  })
})
```

Run: `npx vitest run tests/app/research-page.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement research listing page**

Create `src/app/research/page.tsx`:

```tsx
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getResearchEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'

export default function ResearchPage() {
  const entries = getResearchEntries()

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title="Research" subtitle="Academic and professional research work" />

        <div className="space-y-6">
          {entries.map((entry) => (
            <Card key={entry.slug} href={`/research/${entry.slug}`}>
              <h3 className="text-xl font-semibold text-foreground">
                {entry.title}
              </h3>
              <p className="mt-1 text-sm text-gold-500">
                {formatDate(entry.date)}
              </p>
              <p className="mt-3 text-muted-foreground">{entry.abstract}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/app/research-page.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/app/research/page.tsx tests/app/research-page.test.tsx
git commit -m "feat: add research listing page"
```

---

### Task 39: Build Research Detail Page

**Files:**
- Create: `src/app/research/[slug]/page.tsx`
- Test: `tests/app/research-detail.test.tsx`

- [ ] **Step 1: Write failing test for research detail**

Create `tests/app/research-detail.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResearchDetailPage from '@/app/research/[slug]/page'

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div>{source}</div>,
}))

describe('ResearchDetailPage', () => {
  it('renders research title', async () => {
    const page = await ResearchDetailPage({
      params: Promise.resolve({ slug: 'placeholder-research' }),
    })
    render(page)
    expect(
      screen.getByRole('heading', { name: /placeholder research/i })
    ).toBeInTheDocument()
  })
})
```

Run: `npx vitest run tests/app/research-detail.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement research detail page**

Create `src/app/research/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
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

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params
  const research = getResearchBySlug(slug)

  if (!research) {
    notFound()
  }

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <a
          href="/research"
          className="text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8 inline-block"
        >
          ← Back to Research
        </a>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {research.frontmatter.title}
        </h1>

        <p className="mt-2 text-gold-500">{formatDate(research.frontmatter.date)}</p>

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

        <div className="mt-8 border-t border-border pt-8 prose prose-invert max-w-none">
          <MDXRemote source={research.content} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/app/research-detail.test.tsx`
Expected: 1 test passed

- [ ] **Step 4: Run build to verify static generation**

Run: `npx next build`
Expected: Build succeeds, `out/research/placeholder-research/index.html` generated

- [ ] **Step 5: Commit**

```bash
git add src/app/research/[slug]/ tests/app/research-detail.test.tsx
git commit -m "feat: add research detail page with MDX rendering"
```

---

### Task 40: Build Certification Detail Page

**Files:**
- Create: `src/app/certifications/[slug]/page.tsx`
- Test: `tests/app/certification-detail.test.tsx`

- [ ] **Step 1: Write failing test for certification detail**

Create `tests/app/certification-detail.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CertificationDetailPage from '@/app/certifications/[slug]/page'

describe('CertificationDetailPage', () => {
  it('renders certification name', async () => {
    const page = await CertificationDetailPage({
      params: Promise.resolve({ slug: 'brevet-ab' }),
    })
    render(page)
    expect(
      screen.getByRole('heading', { name: /brevet/i })
    ).toBeInTheDocument()
  })

  it('renders issuer information', async () => {
    const page = await CertificationDetailPage({
      params: Promise.resolve({ slug: 'brevet-ab' }),
    })
    render(page)
    expect(screen.getByText(/IAI/i)).toBeInTheDocument()
  })

  it('renders document viewer link', async () => {
    const page = await CertificationDetailPage({
      params: Promise.resolve({ slug: 'brevet-ab' }),
    })
    render(page)
    const viewLink = screen.getByRole('link', { name: /view|document|certificate/i })
    expect(viewLink).toHaveAttribute('href', expect.stringContaining('.pdf'))
  })
})
```

Run: `npx vitest run tests/app/certification-detail.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement certification detail page**

Create `src/app/certifications/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getCertifications } from '@/data/content'
import { formatDate } from '@/utils/format-date'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const certifications = getCertifications()
  return certifications.map((cert) => ({ slug: cert.slug }))
}

export default async function CertificationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const certifications = getCertifications()
  const cert = certifications.find((c) => c.slug === slug)

  if (!cert) {
    notFound()
  }

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <a
          href="/#certifications"
          className="text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8 inline-block"
        >
          ← Back to Certifications
        </a>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {cert.name}
        </h1>

        <div className="mt-4 space-y-2">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Issued by:</span>{' '}
            {cert.issuer}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Date:</span>{' '}
            {formatDate(cert.date)}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Button href={cert.documentPath} variant="primary" size="lg" external>
            View Certificate
          </Button>
          <a
            href={cert.documentPath}
            download
            className="inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-surface px-6 py-3 text-lg font-medium transition-colors"
          >
            Download PDF
          </a>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="mt-8 border border-border rounded-lg overflow-hidden">
          <iframe
            src={cert.documentPath}
            className="w-full h-[600px]"
            title={`${cert.name} certificate document`}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/app/certification-detail.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Commit**

```bash
git add src/app/certifications/ tests/app/certification-detail.test.tsx
git commit -m "feat: add certification detail page with document viewer"
```

---

### Task 41: Build Custom 404 Page

**Files:**
- Create: `src/app/not-found.tsx`
- Test: `tests/app/not-found.test.tsx`

- [ ] **Step 1: Write failing test for 404 page**

Create `tests/app/not-found.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

describe('NotFound (404)', () => {
  it('renders a 404 heading', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders a helpful message', () => {
    render(<NotFound />)
    expect(screen.getByText(/page.*not found|couldn.*find/i)).toBeInTheDocument()
  })

  it('renders a link back to home', () => {
    render(<NotFound />)
    const homeLink = screen.getByRole('link', { name: /home|back/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
```

Run: `npx vitest run tests/app/not-found.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 2: Implement 404 page**

Create `src/app/not-found.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { AuroraBackground } from '@/components/motion/aurora-background'

export default function NotFound() {
  return (
    <>
      <AuroraBackground />
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative z-10">
        <h1 className="text-8xl font-bold text-gold-500">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Page not found
        </p>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/app/not-found.test.tsx`
Expected: 3 tests passed

- [ ] **Step 4: Run full build to verify all pages**

Run: `npx next build`
Expected: Build succeeds. `out/` contains: `index.html`, `404.html`, `research/index.html`, `research/placeholder-research/index.html`, `certifications/brevet-ab/index.html`

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx tests/app/not-found.test.tsx
git commit -m "feat: add custom 404 page"
```

---

**End of Chunk 6**

---

## Chunk 7: SEO, Deployment & Polish

### Task 42: Add SEO Meta Tags, Open Graph & JSON-LD

**Files:**
- Modify: `src/app/layout.tsx` (expand metadata)
- Create: `src/app/metadata.ts`

- [ ] **Step 1: Create centralized metadata config**

Create `src/app/metadata.ts`:

```ts
import type { Metadata } from 'next'
import { getSiteConfig, getProfile } from '@/data/content'

const site = getSiteConfig()
const profile = getProfile()

export const siteMetadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${profile.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: profile.name,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

- [ ] **Step 2: Update layout.tsx to use centralized metadata**

In `src/app/layout.tsx`, replace the existing `metadata` export:

```tsx
import { siteMetadata } from './metadata'

export const metadata = siteMetadata
```

Remove the old `getSiteConfig()` call and inline metadata object.

- [ ] **Step 3: Create JSON-LD structured data component**

Create `src/components/layout/json-ld.tsx`:

```tsx
import { getProfile, getSiteConfig, getContact } from '@/data/content'

export function JsonLd() {
  const profile = getProfile()
  const site = getSiteConfig()
  const contact = getContact()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    url: site.url,
    image: `${site.url}${profile.avatar}`,
    sameAs: [contact.linkedin, contact.github, contact.instagram].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

- [ ] **Step 4: Add JSON-LD to layout**

In `src/app/layout.tsx`, add `<JsonLd />` inside `<body>` (before `<ThemeProvider>`). JSON-LD is valid anywhere in the document per schema.org spec:

```tsx
import { JsonLd } from '@/components/layout/json-ld'

// Inside <body>, before <ThemeProvider>:
<JsonLd />
<ThemeProvider>
```

- [ ] **Step 5: Add page-specific metadata to sub-pages**

Add metadata export to `src/app/research/page.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Academic and professional research work.',
}
```

Add `generateMetadata` to `src/app/research/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const research = getResearchBySlug(slug)
  if (!research) return {}

  return {
    title: research.frontmatter.title,
    description: research.frontmatter.abstract,
  }
}
```

Add `generateMetadata` to `src/app/certifications/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const certifications = getCertifications()
  const cert = certifications.find((c) => c.slug === slug)
  if (!cert) return {}

  return {
    title: cert.name,
    description: `${cert.name} certification from ${cert.issuer}`,
  }
}
```

- [ ] **Step 6: Verify build**

Run: `npx next build`
Expected: Build succeeds. Check `out/index.html` contains OG meta tags and JSON-LD script.

- [ ] **Step 7: Commit**

```bash
git add src/app/metadata.ts src/components/layout/json-ld.tsx src/app/
git commit -m "feat: add SEO meta tags, Open Graph, Twitter Cards, and JSON-LD"
```

---

### Task 43: Add Sitemap & robots.txt

**Files:**
- Create: `public/robots.txt`
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://placeholder.github.io/Proffesional_Portfolio/sitemap.xml
```

- [ ] **Step 2: Create sitemap generator**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { getSiteConfig } from '@/data/content'
import { getResearchEntries, getCertifications } from '@/data/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig()
  const baseUrl = site.url

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const researchRoutes: MetadataRoute.Sitemap = getResearchEntries().map(
    (entry) => ({
      url: `${baseUrl}/research/${entry.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })
  )

  const certRoutes: MetadataRoute.Sitemap = getCertifications().map(
    (cert) => ({
      url: `${baseUrl}/certifications/${cert.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })
  )

  return [...staticRoutes, ...researchRoutes, ...certRoutes]
}
```

- [ ] **Step 3: Verify build includes sitemap**

Run: `npx next build`
Expected: `out/sitemap.xml` exists and contains all routes

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt src/app/sitemap.ts
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

### Task 44: Set Up GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npx next build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deployment workflow"
```

---

### Task 45: Performance Optimization & Final Polish

**Files:**
- Modify: `next.config.ts` (add basePath if needed)
- Modify: `src/app/layout.tsx` (lazy-load AuroraBackground with next/dynamic)
- Create: `public/icons/favicon.ico` (placeholder)

- [ ] **Step 1: Lazy-load AuroraBackground with next/dynamic**

In `src/app/layout.tsx`, replace the direct import of `AuroraBackground` with a dynamic import deferred to after first paint (spec §12):

```tsx
import dynamic from 'next/dynamic'

// Replace: import { AuroraBackground } from '@/components/motion/aurora-background'
// With:
const AuroraBackground = dynamic(
  () => import('@/components/motion/aurora-background').then((m) => ({ default: m.AuroraBackground })),
  { ssr: false, loading: () => null }
)
```

This ensures the Canvas animation is lazy-loaded and doesn't block initial paint.

- [ ] **Step 2: Update Next.js config for GitHub Pages basePath**

If deploying to `username.github.io/Proffesional_Portfolio`, update `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/Proffesional_Portfolio' : '',
  assetPrefix: isProd ? '/Proffesional_Portfolio' : '',
}

export default nextConfig
```

- [ ] **Step 3: Add a placeholder favicon**

Create a minimal `public/icons/favicon.ico` (or use a favicon generator). Add favicon link in `src/app/layout.tsx` metadata:

```tsx
// In siteMetadata (src/app/metadata.ts), add:
icons: {
  icon: '/icons/favicon.ico',
},
```

- [ ] **Step 4: Update site.json URL for production**

Ensure `src/content/site.json` has the correct production URL:

```json
{
  "url": "https://placeholder.github.io/Proffesional_Portfolio"
}
```

Update with actual GitHub Pages URL when known.

- [ ] **Step 5: Update robots.txt sitemap URL**

Ensure `public/robots.txt` sitemap URL matches production URL.

- [ ] **Step 6: Run final build and verify**

```bash
npx next build
```

Expected: Build succeeds. Verify `out/` directory contains:
- `index.html` (homepage with all sections)
- `404.html` (custom 404)
- `research/index.html` (research listing)
- `research/placeholder-research/index.html` (research detail)
- `certifications/brevet-ab/index.html` (certification detail)
- `sitemap.xml`

- [ ] **Step 7: Run all tests one final time**

```bash
npx vitest run
```

Expected: All tests pass

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "chore: add performance config, favicon, and production URLs"
```

---

**End of Chunk 7**

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-18-portfolio-implementation.md`. Ready to execute?
