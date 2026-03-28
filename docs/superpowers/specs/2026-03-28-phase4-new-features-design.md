# New Features & Content — Design Spec

**Date:** 2026-03-28
**Status:** Draft
**Phase:** 4 of 5
**Depends on:** Phase 3 (consistent design language, accent tokens)

## Problem

The portfolio lacks a Projects/Case Studies showcase, research articles have no table of contents or discoverability features, certification pages have no verification links, and detail pages lack breadcrumb navigation. These additions will significantly increase the portfolio's depth and professionalism.

## Design

### 1. Projects / Case Studies section

#### 1a. Data model

Create a new content file for projects:

```json
// src/content/projects.json
[
  {
    "slug": "financial-dashboard",
    "title": "Financial Dashboard Prototype",
    "description": "Interactive dashboard for visualizing quarterly financial reports with drill-down capabilities.",
    "thumbnail": "/images/projects/financial-dashboard.jpg",
    "techStack": ["Excel", "Power BI", "Python"],
    "outcome": "Reduced reporting time by 40%",
    "link": null,
    "featured": true
  },
  {
    "slug": "tax-compliance-system",
    "title": "Tax Compliance Automation",
    "description": "Streamlined tax filing workflow for small businesses using standardized templates.",
    "thumbnail": "/images/projects/tax-compliance.jpg",
    "techStack": ["Excel", "VBA", "SAP"],
    "outcome": "Processed 200+ tax returns",
    "link": null,
    "featured": true
  },
  {
    "slug": "sustainability-research",
    "title": "Sustainability Reporting Analysis",
    "description": "Research analysis on the impact of sustainability reporting on firm value in Indonesian companies.",
    "thumbnail": "/images/projects/sustainability.jpg",
    "techStack": ["SPSS", "Excel", "Academic Writing"],
    "outcome": "Published undergraduate thesis",
    "link": "/research/sustainability-reporting-firm-value",
    "featured": false
  }
]
```

#### 1b. TypeScript types

```tsx
// src/types/content.ts — add:
export interface Project {
  slug: string
  title: string
  description: string
  thumbnail: string | null
  techStack: string[]
  outcome: string
  link: string | null
  featured: boolean
}
```

#### 1c. Content loader

```tsx
// src/data/content.ts — add:
import projectsData from '@/content/projects.json'

export function getProjects(): Project[] {
  return projectsData
}

export function getFeaturedProjects(): Project[] {
  return projectsData.filter(p => p.featured)
}
```

#### 1d. ProjectsSection component

Place between SkillsSection and ContactSection on the homepage:

```tsx
// src/components/sections/projects-section.tsx
'use client'

import { getProjects } from '@/data/content'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StaggerChildren } from '@/components/motion/stagger-children'

export function ProjectsSection() {
  const projects = getProjects()

  return (
    <SectionWrapper id="projects">
      <SectionHeading number="05" title="Projects" subtitle="Selected work & case studies" />

      <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
        {projects.map((project) => (
          <Card key={project.slug} className="group flex flex-col">
            {/* Thumbnail placeholder */}
            <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-[var(--muted)]">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">
                  <svg className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)] line-clamp-2">{project.description}</p>

              {/* Tech stack badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">{tech}</Badge>
                ))}
              </div>

              {/* Outcome metric */}
              {project.outcome && (
                <div className="mt-auto pt-4 text-sm font-medium text-[var(--accent-400)]">
                  📊 {project.outcome}
                </div>
              )}

              {/* External link */}
              {project.link && (
                <a
                  href={project.link}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--accent-400)] hover:underline"
                >
                  View details →
                </a>
              )}
            </div>
          </Card>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  )
}
```

#### 1e. Navigation update

Add "Projects" to the section links in `src/config/navigation.ts`:

```tsx
export const sectionLinks = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },  // NEW
  { href: '#contact', label: 'Contact' },
]
```

Update section numbering in all SectionHeading components (Projects = 05, Contact = 06).

### 2. Research article enhancements

#### 2a. Table of Contents

Auto-generate TOC from MDX headings. Extract heading structure during MDX compilation:

```tsx
// src/lib/mdx.ts — add TOC extraction:
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w]+/g, '-')
    headings.push({ id, text, level })
  }

  return headings
}
```

Render as a sticky sidebar on desktop, collapsible on mobile:

```tsx
// src/components/ui/table-of-contents.tsx
'use client'

import { useState } from 'react'
import { useScrollSpy } from '@/hooks/use-scroll-spy'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false)
  const activeId = useScrollSpy(headings.map(h => h.id))

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="lg:sticky lg:top-24">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-[var(--border)] p-3 text-sm lg:hidden"
      >
        On this page
        <span>{open ? '▲' : '▼'}</span>
      </button>

      <ul className={`mt-2 space-y-1 text-sm lg:mt-0 lg:block ${open ? 'block' : 'hidden'}`}>
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12}px` }}>
            <a
              href={`#${h.id}`}
              className={`block rounded px-2 py-1 transition-colors ${
                activeId === h.id
                  ? 'text-[var(--accent-400)] bg-[var(--accent-glow)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

Update the research detail page layout to 2-column (content + TOC sidebar) on desktop.

#### 2b. Related articles

Show 2-3 related articles at the bottom of each research article, matched by shared tags:

```tsx
// src/lib/mdx.ts — add:
export function getRelatedArticles(currentSlug: string, currentTags: string[], allArticles: ResearchArticle[], limit = 3) {
  return allArticles
    .filter(a => a.slug !== currentSlug)
    .map(a => ({
      ...a,
      relevance: a.tags.filter(t => currentTags.includes(t)).length,
    }))
    .filter(a => a.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}
```

Render as small cards with title, date, and shared tag highlights.

#### 2c. Reading time estimate

Calculate reading time from word count (200 wpm average):

```tsx
// src/utils/reading-time.ts
export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
```

Display as a badge on both the listing page cards and the detail page header:

```tsx
<span className="text-sm text-[var(--muted-foreground)]">
  {readingTime} min read
</span>
```

#### 2d. Social sharing buttons

Add share buttons for LinkedIn and Twitter/X at the top and bottom of research articles:

```tsx
// src/components/ui/share-buttons.tsx
'use client'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--muted-foreground)]">Share:</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--muted-foreground)] hover:text-[var(--accent-400)] transition-colors"
        aria-label="Share on LinkedIn"
      >
        {/* LinkedIn SVG icon */}
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--muted-foreground)] hover:text-[var(--accent-400)] transition-colors"
        aria-label="Share on X"
      >
        {/* X/Twitter SVG icon */}
      </a>
    </div>
  )
}
```

### 3. Certification page enhancements

#### 3a. Verify Certificate button

Add an optional `verifyUrl` field to certifications.json and render a verification link:

```json
// certifications.json — updated entry:
{
  "slug": "brevet-ab",
  "title": "Brevet Pajak AB",
  "issuer": "IAI",
  "date": "2025-06-15",
  "expiresAt": null,
  "verifyUrl": "https://iai.or.id/verify/12345",
  "pdfPath": "/certificates/brevet-ab.pdf"
}
```

```tsx
{cert.verifyUrl && (
  <a
    href={cert.verifyUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
  >
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
    Verify Certificate
  </a>
)}
```

#### 3b. Expiration date display

Show expiration status with color-coded indicators:

```tsx
function CertStatus({ expiresAt }: { expiresAt: string | null }) {
  if (!expiresAt) {
    return <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">No Expiration</Badge>
  }

  const expDate = new Date(expiresAt)
  const now = new Date()
  const daysUntil = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil < 0) {
    return <Badge variant="outline" className="border-red-500/30 text-red-600 dark:text-red-400">Expired</Badge>
  }
  if (daysUntil < 90) {
    return <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400">Expiring in {daysUntil} days</Badge>
  }
  return <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">Valid until {formatDate(expiresAt)}</Badge>
}
```

#### 3c. PDF loading state

Add a loading skeleton and file size display for the certificate PDF iframe:

```tsx
const [pdfLoaded, setPdfLoaded] = useState(false)

<div className="relative">
  {!pdfLoaded && (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--muted)] rounded-lg">
      <div className="text-center">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">Loading certificate...</p>
      </div>
    </div>
  )}
  <iframe
    src={pdfPath}
    onLoad={() => setPdfLoaded(true)}
    className={cn('h-[600px] w-full rounded-lg', !pdfLoaded && 'invisible')}
  />
</div>
```

### 4. Breadcrumb navigation

Create a reusable Breadcrumb component for detail pages:

```tsx
// src/components/ui/breadcrumb.tsx
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-[var(--accent-400)]">/</span>
            )}
            {item.href ? (
              <Link href={item.href} className="hover:text-[var(--accent-400)] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--foreground)] font-medium truncate max-w-[200px]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

Usage in research detail page:
```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Research', href: '/research' },
  { label: article.title },
]} />
```

Usage in certification detail page:
```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Certifications', href: '/#certifications' },
  { label: cert.title },
]} />
```

### 5. Research search

Add client-side search to the research listing page:

```tsx
// src/components/ui/search-input.tsx
'use client'

import { useState, useMemo, useCallback } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
}

export function SearchInput({ placeholder = 'Search...', onSearch, debounceMs = 300 }: SearchInputProps) {
  const [value, setValue] = useState('')

  const debouncedSearch = useMemo(() => {
    let timer: NodeJS.Timeout
    return (query: string) => {
      clearTimeout(timer)
      timer = setTimeout(() => onSearch(query), debounceMs)
    }
  }, [onSearch, debounceMs])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    debouncedSearch(v)
  }, [debouncedSearch])

  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--accent-400)] focus:ring-1 focus:ring-[var(--accent-400)] transition-colors"
      />
    </div>
  )
}
```

In the research listing page, filter articles by title, tags, and abstract:

```tsx
const [query, setQuery] = useState('')

const filtered = useMemo(() => {
  if (!query.trim()) return articles
  const q = query.toLowerCase()
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.abstract?.toLowerCase().includes(q) ||
    a.tags?.some(t => t.toLowerCase().includes(q))
  )
}, [articles, query])

// Add highlight utility for matching text
function highlightMatch(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-[var(--accent-glow)] text-[var(--foreground)] rounded px-0.5">$1</mark>')
}
```

## Files Changed

| File | Change |
|------|--------|
| `src/content/projects.json` | NEW — project data |
| `src/types/content.ts` | Add Project interface |
| `src/data/content.ts` | Add getProjects, getFeaturedProjects, getResearchArticles |
| `src/components/sections/projects-section.tsx` | NEW — Projects section |
| `src/config/navigation.ts` | Add Projects nav link |
| `src/app/page.tsx` | Add ProjectsSection, update section numbering |
| `src/lib/mdx.ts` | Add extractHeadings, getRelatedArticles |
| `src/utils/reading-time.ts` | NEW — reading time calculator |
| `src/components/ui/table-of-contents.tsx` | NEW — TOC component |
| `src/components/ui/share-buttons.tsx` | NEW — social share buttons |
| `src/components/ui/breadcrumb.tsx` | NEW — breadcrumb navigation |
| `src/components/ui/search-input.tsx` | NEW — search input component |
| `src/app/research/page.tsx` | Add search, reading time |
| `src/app/research/[slug]/page.tsx` | Add TOC, related, sharing, breadcrumb |
| `src/app/certifications/[slug]/page.tsx` | Add verify button, expiry, PDF loading, breadcrumb |
| `src/content/certifications.json` | Add verifyUrl, expiresAt fields |

## Test Impact

- NEW: `tests/components/sections/projects-section.test.tsx`
- NEW: `tests/components/ui/table-of-contents.test.tsx`
- NEW: `tests/components/ui/share-buttons.test.tsx`
- NEW: `tests/components/ui/breadcrumb.test.tsx`
- NEW: `tests/components/ui/search-input.test.tsx`
- NEW: `tests/utils/reading-time.test.ts`
- UPDATE: `tests/app/page.test.tsx` — add Projects section assertion
- UPDATE: `tests/app/research-page.test.tsx` — add search behavior
- UPDATE: `tests/app/research-detail.test.tsx` — add TOC, breadcrumb
- UPDATE: `tests/app/certification-detail.test.tsx` — add verify, expiry, loading

## Verification

```bash
npm run test:run
npm run build
```

Visual verification: navigate to /research, test search filtering. Open a research article, verify TOC highlights on scroll. Check certification detail pages for verify buttons and expiry badges.
