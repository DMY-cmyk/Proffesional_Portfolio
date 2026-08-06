# Phase 4 / Plan 2 — Substance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement spec stages 7–9: journal-grade research reading experience (B1), per-article OG images (B6), command palette (B4), Notes/blog surface (B3), and empty-safe testimonials (B5).

**Architecture:** Pure utilities live in `src/lib/article-utils.ts` (heading extraction, reading time, citations) so they are unit-testable without MDX rendering. The research detail page gains heading-id MDX components, a sticky TOC, a reading-progress bar, and a Cite-this block. OG images are generated at build time by a Node script using the already-installed `sharp`. The palette, notes, and testimonials each mirror an existing pattern (dialog a11y conventions, the research MDX collection, and JSON-driven sections respectively).

**Tech Stack:** Next.js 15 (App Router, static export), React 19, Tailwind 4, next-mdx-remote/rsc + gray-matter, sharp (devDependency, build-time only), Vitest 4 + RTL.

**Spec:** `docs/superpowers/specs/2026-08-06-phase4-full-upgrade-design.md` (stages 7–9)

## Global Constraints

- **No new runtime dependencies.** `sharp` is already a devDependency and runs only at build time. The command palette is hand-rolled — no cmdk/kbar.
- **Every animated/motion feature respects reduced motion** via `useReducedMotion()` or the CSS media query; easing `cubic-bezier(0.22, 1, 0.36, 1)` where an easing applies.
- **Static export must keep working:** `npm run build` green after every task; internal asset/link URLs go through `withBasePath()` from `src/lib/base-path.ts` (never hardcode `/Proffesional_Portfolio`); `next/link` and `router.push` handle basePath automatically — only raw `<a href>`, `window.open`, and metadata asset paths need `withBasePath()`.
- **No fabricated content:** testimonials ship as an empty array; the starter note derives from the existing thesis abstract; citation data comes from real profile/education/frontmatter values.
- **Full test suite green before every commit:** `npm run test:run` (54 files / 218 tests at start).
- **Test mocking conventions:** global `matchMedia` stub exists in `tests/setup.ts` (`configurable: true` — per-file overrides work); `vi.stubGlobal` on `IntersectionObserver` fails (non-configurable) — use direct assignment; prefer `vi.hoisted()` + mutable-state `vi.mock()` over `vi.doMock`/resetModules ordering.
- **Accessibility:** WCAG AA; dialog needs `role="dialog"`, `aria-modal`, focus management, Escape close; TOC nav needs an `aria-label`.
- Windows/PowerShell environment; forward-slash paths work in commands.

---

### Task 1: Article utilities (slugify, extractHeadings, readingTime)

**Files:**
- Create: `src/lib/article-utils.ts`
- Test: `tests/lib/article-utils.test.ts`

**Interfaces:**
- Consumes: nothing (pure functions)
- Produces (later tasks import these exact names from `@/lib/article-utils`):
  - `slugifyHeading(text: string): string` — lowercase, alphanumerics kept, everything else collapsed to single hyphens, trimmed
  - `interface ArticleHeading { id: string; text: string; level: 2 | 3 }`
  - `extractHeadings(markdown: string): ArticleHeading[]` — h2/h3 lines only, markdown formatting stripped from text
  - `readingTimeMinutes(markdown: string): number` — words ÷ 200, ceil, minimum 1

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/article-utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { slugifyHeading, extractHeadings, readingTimeMinutes } from '@/lib/article-utils'

describe('slugifyHeading', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyHeading('Research Question')).toBe('research-question')
  })
  it('collapses punctuation runs into single hyphens and trims', () => {
    expect(slugifyHeading("Tobin's Q — and M/B!")).toBe('tobin-s-q-and-m-b')
  })
})

describe('extractHeadings', () => {
  const md = [
    '# Title ignored',
    '## Research Question',
    'body text',
    '### Sub *point*',
    '#### h4 ignored',
    '## Key `Findings`',
  ].join('\n')

  it('extracts h2 and h3 with ids, skipping other levels', () => {
    expect(extractHeadings(md)).toEqual([
      { id: 'research-question', text: 'Research Question', level: 2 },
      { id: 'sub-point', text: 'Sub point', level: 3 },
      { id: 'key-findings', text: 'Key Findings', level: 2 },
    ])
  })

  it('strips link syntax from heading text', () => {
    expect(extractHeadings('## See [the paper](https://x.y)')).toEqual([
      { id: 'see-the-paper', text: 'See the paper', level: 2 },
    ])
  })
})

describe('readingTimeMinutes', () => {
  it('is at least 1 for short content', () => {
    expect(readingTimeMinutes('a few words only')).toBe(1)
  })
  it('divides by 200 wpm and ceils', () => {
    const words = Array.from({ length: 401 }, (_, i) => `w${i}`).join(' ')
    expect(readingTimeMinutes(words)).toBe(3)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/lib/article-utils.test.ts`
Expected: FAIL — module `@/lib/article-utils` does not exist.

- [ ] **Step 3: Implement**

Create `src/lib/article-utils.ts`:

```ts
export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → label
    .replace(/[*_`~]/g, '')
    .trim()
}

export function extractHeadings(markdown: string): ArticleHeading[] {
  const headings: ArticleHeading[] = []
  const pattern = /^(#{2,3})\s+(.+)$/gm
  let match: RegExpExecArray | null
  while ((match = pattern.exec(markdown)) !== null) {
    const text = stripMarkdown(match[2])
    headings.push({
      id: slugifyHeading(text),
      text,
      level: match[1].length as 2 | 3,
    })
  }
  return headings
}

export function readingTimeMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tests/lib/article-utils.test.ts` → PASS.

- [ ] **Step 5: Full suite + commit**

```bash
npm run test:run
git add src/lib/article-utils.ts tests/lib/article-utils.test.ts
git commit -m "feat(research): add article utils (heading extraction, slugs, reading time)"
```

---

### Task 2: Citation builders (APA + BibTeX)

**Files:**
- Modify: `src/lib/article-utils.ts` (append)
- Test: `tests/lib/citations.test.ts`

**Interfaces:**
- Consumes: nothing (pure)
- Produces:
  - `interface CitationInput { authorName: string; title: string; year: string; institution: string; kind: string }` (`kind` e.g. `'thesis'`; `year` is the 4-digit string)
  - `buildApaCitation(c: CitationInput): string`
  - `buildBibtex(c: CitationInput): string`
  - `apaAuthor(fullName: string): string` — "Dzaki Muhammad Yusfian" → "Yusfian, D. M."

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/citations.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { apaAuthor, buildApaCitation, buildBibtex } from '@/lib/article-utils'

const input = {
  authorName: 'Dzaki Muhammad Yusfian',
  title: 'The Effect of Sustainability Report Disclosure on Firm Value',
  year: '2026',
  institution: 'STIE YKPN',
  kind: 'thesis',
}

describe('apaAuthor', () => {
  it('formats Last, F. M.', () => {
    expect(apaAuthor('Dzaki Muhammad Yusfian')).toBe('Yusfian, D. M.')
  })
  it('handles single names', () => {
    expect(apaAuthor('Dzaki')).toBe('Dzaki')
  })
})

describe('buildApaCitation', () => {
  it('produces an APA-style undergraduate thesis citation', () => {
    expect(buildApaCitation(input)).toBe(
      'Yusfian, D. M. (2026). The Effect of Sustainability Report Disclosure on Firm Value [Undergraduate thesis, STIE YKPN].'
    )
  })
})

describe('buildBibtex', () => {
  it('produces a @thesis entry keyed by last name + year', () => {
    const bib = buildBibtex(input)
    expect(bib).toContain('@thesis{yusfian2026')
    expect(bib).toContain('author = {Dzaki Muhammad Yusfian}')
    expect(bib).toContain('title = {The Effect of Sustainability Report Disclosure on Firm Value}')
    expect(bib).toContain('year = {2026}')
    expect(bib).toContain('school = {STIE YKPN}')
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/lib/citations.test.ts`
Expected: FAIL — exports missing.

- [ ] **Step 3: Implement (append to article-utils.ts)**

```ts
export interface CitationInput {
  authorName: string
  title: string
  year: string
  institution: string
  kind: string
}

export function apaAuthor(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  const last = parts[parts.length - 1]
  const initials = parts
    .slice(0, -1)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(' ')
  return `${last}, ${initials}`
}

function kindLabel(kind: string): string {
  return kind === 'thesis' ? 'Undergraduate thesis' : kind.charAt(0).toUpperCase() + kind.slice(1)
}

export function buildApaCitation(c: CitationInput): string {
  return `${apaAuthor(c.authorName)} (${c.year}). ${c.title} [${kindLabel(c.kind)}, ${c.institution}].`
}

export function buildBibtex(c: CitationInput): string {
  const lastName = c.authorName.trim().split(/\s+/).pop()?.toLowerCase() ?? 'author'
  return [
    `@thesis{${lastName}${c.year},`,
    `  author = {${c.authorName}},`,
    `  title = {${c.title}},`,
    `  year = {${c.year}},`,
    `  school = {${c.institution}},`,
    `  type = {${kindLabel(c.kind)}}`,
    `}`,
  ].join('\n')
}
```

- [ ] **Step 4: Run to verify pass, full suite, commit**

```bash
npx vitest run tests/lib/citations.test.ts
npm run test:run
git add src/lib/article-utils.ts tests/lib/citations.test.ts
git commit -m "feat(research): add APA and BibTeX citation builders"
```

---

### Task 3: Reading progress bar + TOC components

**Files:**
- Create: `src/components/research/reading-progress.tsx`
- Create: `src/components/research/table-of-contents.tsx`
- Test: `tests/components/research/reading-progress.test.tsx`, `tests/components/research/table-of-contents.test.tsx`

**Interfaces:**
- Consumes: `useScrollProgress()` from `@/hooks/use-scroll-progress` (returns 0..1); `useScrollSpy(ids: string[])` from `@/hooks/use-scroll-spy` (returns active id string); `ArticleHeading` from Task 1.
- Produces:
  - `<ReadingProgress />` — client; fixed 2px teal bar directly below the navbar, width = scroll progress
  - `<TableOfContents headings={ArticleHeading[]} />` — client; `<nav aria-label="Table of contents">`; desktop sticky list, h3 entries indented; active heading gets `text-accent`; renders `null` when fewer than 2 headings

- [ ] **Step 1: Write the failing tests**

Create `tests/components/research/reading-progress.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/hooks/use-scroll-progress', () => ({ useScrollProgress: () => 0.4 }))

import { ReadingProgress } from '@/components/research/reading-progress'

describe('ReadingProgress', () => {
  afterEach(() => cleanup())
  it('renders a progressbar reflecting scroll progress', () => {
    render(<ReadingProgress />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('40')
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('40%')
  })
})
```

Create `tests/components/research/table-of-contents.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/hooks/use-scroll-spy', () => ({ useScrollSpy: () => 'method' }))

import { TableOfContents } from '@/components/research/table-of-contents'

const headings = [
  { id: 'research-question', text: 'Research Question', level: 2 as const },
  { id: 'method', text: 'Method', level: 2 as const },
  { id: 'sub-point', text: 'Sub point', level: 3 as const },
]

describe('TableOfContents', () => {
  afterEach(() => cleanup())

  it('renders a labeled nav with one link per heading', () => {
    render(<TableOfContents headings={headings} />)
    const nav = screen.getByRole('navigation', { name: /table of contents/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Method' }).getAttribute('href')).toBe('#method')
  })

  it('marks the active heading', () => {
    render(<TableOfContents headings={headings} />)
    expect(screen.getByRole('link', { name: 'Method' }).className).toContain('text-accent')
    expect(screen.getByRole('link', { name: 'Research Question' }).className).not.toContain('text-accent')
  })

  it('renders nothing for fewer than 2 headings', () => {
    const { container } = render(<TableOfContents headings={[headings[0]]} />)
    expect(container.innerHTML).toBe('')
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/components/research/reading-progress.test.tsx tests/components/research/table-of-contents.test.tsx`
Expected: FAIL — modules do not exist.

- [ ] **Step 3: Implement ReadingProgress**

Create `src/components/research/reading-progress.tsx`:

```tsx
'use client'

import { useScrollProgress } from '@/hooks/use-scroll-progress'

export function ReadingProgress() {
  const progress = useScrollProgress()
  const percent = Math.round(progress * 100)

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed left-0 right-0 top-0 z-40 h-0.5 bg-transparent"
    >
      <div className="h-full bg-accent transition-none" style={{ width: `${percent}%` }} />
    </div>
  )
}
```

- [ ] **Step 4: Implement TableOfContents**

Create `src/components/research/table-of-contents.tsx`:

```tsx
'use client'

import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { cn } from '@/utils/cn'
import type { ArticleHeading } from '@/lib/article-utils'

export function TableOfContents({ headings }: { headings: ArticleHeading[] }) {
  const ids = headings.map((h) => h.id)
  const active = useScrollSpy(ids)

  if (headings.length < 2) return null

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-subtle">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                '-ml-px block border-l pl-3 leading-snug transition-colors',
                h.level === 3 && 'pl-6',
                active === h.id
                  ? 'border-accent text-accent font-medium'
                  : 'border-transparent text-muted hover:text-foreground'
              )}
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

- [ ] **Step 5: Run to verify pass, full suite, commit**

```bash
npx vitest run tests/components/research/reading-progress.test.tsx tests/components/research/table-of-contents.test.tsx
npm run test:run
git add src/components/research/ tests/components/research/
git commit -m "feat(research): add reading progress bar and table of contents"
```

---

### Task 4: CiteThis component

**Files:**
- Create: `src/components/research/cite-this.tsx`
- Test: `tests/components/research/cite-this.test.tsx`

**Interfaces:**
- Consumes: `buildApaCitation`, `buildBibtex`, `CitationInput` from Task 2.
- Produces: `<CiteThis citation={CitationInput} />` — client; renders APA text and BibTeX in `<pre>`, each with a copy button using `navigator.clipboard.writeText`; button text flips to "Copied ✓" for 2s on success; if clipboard is unavailable, the button is replaced by a hint "Select the text to copy".

- [ ] **Step 1: Write the failing test**

Create `tests/components/research/cite-this.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CiteThis } from '@/components/research/cite-this'

const citation = {
  authorName: 'Dzaki Muhammad Yusfian',
  title: 'Sample Thesis Title',
  year: '2026',
  institution: 'STIE YKPN',
  kind: 'thesis',
}

describe('CiteThis', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
  })
  afterEach(() => cleanup())

  it('renders APA and BibTeX outputs', () => {
    render(<CiteThis citation={citation} />)
    expect(screen.getByText(/Yusfian, D\. M\. \(2026\)\./)).toBeInTheDocument()
    expect(screen.getByText(/@thesis\{yusfian2026/)).toBeInTheDocument()
  })

  it('copies APA text and shows feedback', async () => {
    const user = userEvent.setup()
    render(<CiteThis citation={citation} />)
    await user.click(screen.getByRole('button', { name: /copy apa/i }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Yusfian, D. M. (2026).')
    )
    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/components/research/cite-this.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

Create `src/components/research/cite-this.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { buildApaCitation, buildBibtex, type CitationInput } from '@/lib/article-utils'

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const clipboardAvailable = typeof navigator !== 'undefined' && !!navigator.clipboard

  if (!clipboardAvailable) {
    return <span className="text-xs text-subtle">Select the text to copy</span>
  }

  return (
    <button
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
          .catch(() => {})
      }}
      className="rounded-md border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted hover:border-accent hover:text-accent transition-colors"
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}

export function CiteThis({ citation }: { citation: CitationInput }) {
  const apa = buildApaCitation(citation)
  const bibtex = buildBibtex(citation)

  return (
    <aside aria-label="Cite this work" className="mt-12 rounded-lg border border-border bg-surface-alt/60 p-6">
      <h2 className="font-display text-lg font-medium text-foreground">Cite this work</h2>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">APA</p>
          <CopyButton label="Copy APA" text={apa} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{apa}</p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">BibTeX</p>
          <CopyButton label="Copy BibTeX" text={bibtex} />
        </div>
        <pre className="mt-2 overflow-x-auto rounded-md bg-background p-3 text-xs leading-relaxed text-muted">{bibtex}</pre>
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: Run to verify pass, full suite, commit**

```bash
npx vitest run tests/components/research/cite-this.test.tsx
npm run test:run
git add src/components/research/cite-this.tsx tests/components/research/cite-this.test.tsx
git commit -m "feat(research): add Cite this block with APA/BibTeX copy"
```

---

### Task 5: Wire the reading experience into the research detail page

**Files:**
- Modify: `src/app/research/[slug]/page.tsx`
- Test: build + existing suite (server component; jsdom cannot render MDXRemote — coverage comes from Tasks 1–4 units + `npm run build`)

**Interfaces:**
- Consumes: everything from Tasks 1–4; `getProfile()`, `getEducation()`, `getResearchEntries()` from `@/data/content`.
- Produces: the composed article page (no new exports).

- [ ] **Step 1: Rewrite the page**

Replace the body of `src/app/research/[slug]/page.tsx` (keep `generateStaticParams` unchanged; `generateMetadata` gains OG in Task 6):

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getResearchBySlug, getAllResearchSlugs } from '@/lib/mdx'
import { extractHeadings, readingTimeMinutes, slugifyHeading } from '@/lib/article-utils'
import { ReadingProgress } from '@/components/research/reading-progress'
import { TableOfContents } from '@/components/research/table-of-contents'
import { CiteThis } from '@/components/research/cite-this'
import { getProfile, getEducation, getResearchEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'

// (interface PageProps, generateStaticParams, generateMetadata stay as-is)

// Recursively extract plain text from React children — headings like
// "Key **Findings**" arrive as arrays containing elements, and a naive
// children.join('') would stringify elements as "[object Object]",
// desyncing the id from extractHeadings' markdown-derived id.
function nodeText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return nodeText((node as React.ReactElement<{ children?: React.ReactNode }>).props.children)
  }
  return ''
}

function headingWithId(Tag: 'h2' | 'h3') {
  return function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <Tag id={slugifyHeading(nodeText(children))} className="scroll-mt-28" {...props}>
        {children}
      </Tag>
    )
  }
}

const mdxComponents = { h2: headingWithId('h2'), h3: headingWithId('h3') }

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params
  const research = getResearchBySlug(slug)
  if (!research) notFound()

  const headings = extractHeadings(research.content)
  const minutes = readingTimeMinutes(research.content)
  const profile = getProfile()
  const education = getEducation()
  const entry = getResearchEntries().find((e) => e.slug === slug)
  const citation = {
    authorName: profile.name,
    title: research.frontmatter.title,
    year: research.frontmatter.date.slice(0, 4),
    institution: education[0]?.school ?? '',
    kind: entry?.type ?? 'thesis',
  }

  return (
    <article className="py-16 px-6">
      <ReadingProgress />
      <div className="mx-auto grid max-w-6xl gap-10 xl:grid-cols-[1fr_240px]">
        <div className="mx-auto w-full max-w-3xl">
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
            {formatDate(research.frontmatter.date)} · {minutes} min read
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

          {headings.length >= 2 && (
            <details className="mt-8 rounded-lg border border-border p-4 xl:hidden">
              <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-subtle">
                On this page
              </summary>
              <div className="mt-3">
                <TableOfContents headings={headings} />
              </div>
            </details>
          )}

          <div className="mt-10 border-t border-border pt-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-accent prose-strong:text-foreground">
            <MDXRemote source={research.content} components={mdxComponents} />
          </div>

          <CiteThis citation={citation} />
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </article>
  )
}
```

Notes for the implementer:
- **Check `ResearchEntry` in `src/types/content.ts` has a `type?: string` field** (index.json carries `"type": "thesis"`). If the interface lacks it, add `type?: string` — otherwise `entry?.type` is a TypeScript error.
- The mobile TOC lives in a `<details>` (no JS needed); the desktop TOC is the sticky sidebar — both render the same component.
- `scroll-mt-28` keeps anchored headings clear of the fixed navbar.
- The double `TableOfContents` render is intentional (different breakpoints); its own `headings.length < 2 → null` guard prevents empty shells.

- [ ] **Step 2: Verify build + suite**

Run: `npm run build` (must export all pages; catches RSC mistakes) and `npm run test:run`.

- [ ] **Step 3: Manual check**

`npm run dev` → open `/research/sustainability-reporting-firm-value`: TOC links jump with offset, active section highlights while scrolling, progress bar fills, reading time shows, Cite block copies. Stop the server. (If headless, note for the wrap-up visual pass.)

- [ ] **Step 4: Commit**

```bash
git add src/app/research/[slug]/page.tsx
git commit -m "feat(research): journal-grade reading experience on article pages"
```

---

### Task 6: Per-article OG images (build-time)

**Files:**
- Create: `scripts/generate-og.mjs`
- Modify: `package.json` (add `"generate:og"` and `"prebuild"` scripts)
- Modify: `.github/workflows/deploy.yml` (build step `npx next build` → `npm run build`, so prebuild runs in CI)
- Modify: `.gitignore` (add `public/og/`)
- Modify: `src/app/research/[slug]/page.tsx` (`generateMetadata` gains OG/Twitter images)
- Test: script run + build verification (no vitest unit — Node script exercised directly)

**Interfaces:**
- Consumes: `src/content/research/index.json`, `src/content/site.json` (`site.url` already includes the basePath).
- Produces: `public/og/research-<slug>.png` (1200×630) for every research entry, regenerated on every build.

- [ ] **Step 1: Write the generator script**

Create `scripts/generate-og.mjs`:

```js
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const entries = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/research/index.json'), 'utf-8'))
const profile = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/profile.json'), 'utf-8'))
const OUT_DIR = path.join(ROOT, 'public/og')

fs.mkdirSync(OUT_DIR, { recursive: true })

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

function wrapTitle(title, maxChars = 32, maxLines = 4) {
  const words = title.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = (line + ' ' + word).trim()
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    lines.length = maxLines
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'
  }
  return lines
}

function ogSvg(title, authorName) {
  const lines = wrapTitle(title)
  const titleSpans = lines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 64}">${escapeXml(l)}</tspan>`)
    .join('')
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fbf9f4"/>
  <rect x="0" y="0" width="1200" height="8" fill="#b8944a"/>
  <text x="80" y="120" font-family="Georgia, serif" font-size="26" letter-spacing="6" fill="#b8944a">RESEARCH</text>
  <text x="80" y="240" font-family="Georgia, serif" font-size="54" font-weight="500" fill="#0d4f5c">${titleSpans}</text>
  <text x="80" y="560" font-family="Georgia, serif" font-size="30" fill="#1a1a1a">${escapeXml(authorName)}</text>
</svg>`
}

for (const entry of entries) {
  const svg = ogSvg(entry.title, profile.name)
  const out = path.join(OUT_DIR, `research-${entry.slug}.png`)
  await sharp(Buffer.from(svg)).png().toFile(out)
  console.log(`og: wrote ${path.relative(ROOT, out)}`)
}
```

- [ ] **Step 2: Run it and inspect**

Run: `node scripts/generate-og.mjs`
Expected: `og: wrote public/og/research-sustainability-reporting-firm-value.png`. Open the PNG (or check size > 10 KB) to confirm it rendered text, not an empty rect.

- [ ] **Step 3: Wire into build**

In `package.json` scripts add:

```json
"generate:og": "node scripts/generate-og.mjs",
"prebuild": "node scripts/generate-og.mjs",
```

In `.github/workflows/deploy.yml`, change the build step from `run: npx next build` to `run: npm run build` (npm lifecycle runs `prebuild` automatically; `npx next build` bypasses it).

Add to `.gitignore`:

```
public/og/
```

- [ ] **Step 4: Reference in article metadata**

In `src/app/research/[slug]/page.tsx` `generateMetadata`, after the existing title/description:

```tsx
return {
  title: research.frontmatter.title,
  description: research.frontmatter.abstract,
  openGraph: {
    title: research.frontmatter.title,
    description: research.frontmatter.abstract,
    images: [{ url: `/og/research-${slug}.png`, width: 1200, height: 630, alt: research.frontmatter.title }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`/og/research-${slug}.png`],
  },
}
```

(`metadataBase` in `src/app/metadata.ts` is `site.url`, which already includes the GitHub Pages basePath, so the relative `/og/...` path resolves to the correct absolute URL.)

- [ ] **Step 5: Verify + commit**

```bash
npm run build   # runs prebuild → generates og → builds; check out/og/ exists in export
npm run test:run
git add scripts/generate-og.mjs package.json .github/workflows/deploy.yml .gitignore src/app/research/[slug]/page.tsx
git commit -m "feat(seo): generate per-article OG images at build time"
```

---

### Task 7: Command palette (Ctrl+K)

**Files:**
- Create: `src/components/navigation/command-palette.tsx`
- Modify: `src/app/layout.tsx` (mount `<CommandPalette />` inside ThemeProvider, next to `<ClientMotion />`)
- Modify: `src/components/layout/navbar.tsx` (hint chip button, hidden on mobile, before the CV link)
- Test: `tests/components/navigation/command-palette.test.tsx`

**Interfaces:**
- Consumes: `allNavItems` from `@/config/navigation`; `getResearchEntries()`, `getProfessionalContact()` from `@/data/content`; `useTheme()` (toggleTheme with no origin = instant); `withBasePath()`; `useRouter` from `next/navigation`.
- Produces:
  - `<CommandPalette />` — self-contained client component; opens on Ctrl+K / Cmd+K or on window event `'open-command-palette'`; closes on Escape/backdrop click.
  - Convention for Task 8 (notes): palette builds its command list from `allNavItems` + research entries + actions; Task 8 extends `pageLinks` in navigation.ts and adds notes entries analogously.

- [ ] **Step 1: Write the failing test**

Create `tests/components/navigation/command-palette.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/',
}))
vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}))

import { CommandPalette } from '@/components/navigation/command-palette'

describe('CommandPalette', () => {
  beforeEach(() => { push.mockClear() })
  afterEach(() => cleanup())

  it('is closed by default and opens on Ctrl+K', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument()
  })

  it('filters commands as you type', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('resear')
    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThanOrEqual(1)
    expect(options.some((o) => /research/i.test(o.textContent ?? ''))).toBe(true)
    expect(options.some((o) => /contact/i.test(o.textContent ?? ''))).toBe(false)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navigates on Enter for an article command', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    // 'sustainability' matches only the research article title, so the
    // selected command is a page navigation (not a same-page '#' anchor)
    await user.keyboard('sustainability')
    await user.keyboard('{Enter}')
    expect(push).toHaveBeenCalledWith('/research/sustainability-reporting-firm-value')
  })

  it('opens via the open-command-palette window event', async () => {
    render(<CommandPalette />)
    const { act } = await import('@testing-library/react')
    await act(async () => {
      window.dispatchEvent(new Event('open-command-palette'))
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/components/navigation/command-palette.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

Create `src/components/navigation/command-palette.tsx`:

```tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { allNavItems } from '@/config/navigation'
import { getResearchEntries, getProfessionalContact } from '@/data/content'
import { useTheme } from '@/hooks/use-theme'
import { withBasePath } from '@/lib/base-path'
import { cn } from '@/utils/cn'

interface Command {
  id: string
  label: string
  hint: string
  run: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toggleTheme } = useTheme()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  const goTo = useCallback(
    (href: string) => {
      if (href.startsWith('#')) {
        if (pathname === '/') {
          document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
        } else {
          router.push(`/${href}`)
        }
      } else {
        router.push(href)
      }
      close()
    },
    [pathname, router, close]
  )

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = allNavItems.map((item) => ({
      id: `nav:${item.href}`,
      label: item.label,
      hint: item.href.startsWith('#') ? 'Section' : 'Page',
      run: () => goTo(item.href),
    }))
    const research: Command[] = getResearchEntries().map((entry) => ({
      id: `research:${entry.slug}`,
      label: entry.title,
      hint: 'Research',
      run: () => goTo(`/research/${entry.slug}`),
    }))
    const actions: Command[] = [
      { id: 'action:theme', label: 'Toggle dark mode', hint: 'Action', run: () => { toggleTheme(); close() } },
      { id: 'action:cv', label: 'Download CV', hint: 'Action', run: () => { window.open(withBasePath('/files/cv/dzaki-cv.pdf'), '_blank'); close() } },
      { id: 'action:email', label: 'Copy email address', hint: 'Action', run: () => { navigator.clipboard?.writeText(getProfessionalContact().email).catch(() => {}); close() } },
    ]
    return [...nav, ...research, ...actions]
  }, [goTo, toggleTheme, close])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    function onOpenEvent() {
      setOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', onOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/30 pt-[18vh] px-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); close() }
            if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
            if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); filtered[selected].run() }
          }}
          placeholder="Type a command or search…"
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-listbox"
          aria-activedescendant={filtered[selected]?.id}
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-[15px] text-foreground placeholder:text-subtle/60 focus:outline-none"
        />
        <ul id="palette-listbox" role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-subtle">No matching commands</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              id={cmd.id}
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={cmd.run}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-sm',
                i === selected ? 'bg-accent/10 text-foreground' : 'text-muted'
              )}
            >
              <span className="truncate">{cmd.label}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-subtle">{cmd.hint}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-subtle">
          ↑↓ navigate · Enter select · Esc close
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Mount in layout + navbar hint**

In `src/app/layout.tsx`: `import { CommandPalette } from '@/components/navigation/command-palette'` and render `<CommandPalette />` directly after `<ClientMotion />`.

In `src/components/layout/navbar.tsx`, before the CV `<a>`:

```tsx
<button
  onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
  className="hidden md:inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-subtle hover:text-accent hover:border-accent transition-colors"
  aria-label="Open command palette"
>
  Ctrl K
</button>
```

- [ ] **Step 5: Verify + commit**

```bash
npx vitest run tests/components/navigation/command-palette.test.tsx tests/components/layout/navbar.test.tsx
npm run test:run
npm run build
git add src/components/navigation/command-palette.tsx src/app/layout.tsx src/components/layout/navbar.tsx tests/components/navigation/command-palette.test.tsx
git commit -m "feat(nav): hand-rolled Ctrl+K command palette"
```

(If navbar tests fail because of the new button, extend their assertions minimally — the button is expected.)

---

### Task 8: Notes surface (/notes + /notes/[slug])

**Files:**
- Create: `src/content/notes/index.json`, `src/content/notes/reading-sustainability-reports.mdx`
- Modify: `src/lib/mdx.ts` (add notes collection functions)
- Modify: `src/data/content.ts` + `src/types/content.ts` (NoteEntry + getNoteEntries)
- Create: `src/app/notes/page.tsx`, `src/app/notes/[slug]/page.tsx`
- Modify: `src/config/navigation.ts` (pageLinks += Notes), `src/app/sitemap.ts` (+/notes routes), `src/components/navigation/command-palette.tsx` (+notes commands)
- Test: `tests/lib/notes-mdx.test.ts`, `tests/data/get-notes.test.ts`

**Interfaces:**
- Consumes: patterns from research (mdx.ts, index.json, list/detail pages), palette command builder from Task 7.
- Produces:
  - `interface NoteEntry { title: string; slug: string; summary: string; date: string; tags: string[] }` in types/content.ts
  - `getNoteEntries(): NoteEntry[]` in data/content.ts
  - `getAllNoteSlugs(): string[]`, `getNoteBySlug(slug): NoteMdxData | null` in lib/mdx.ts where `NoteMdxData = { slug, content, frontmatter: { title, date, summary, tags } }`

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/notes-mdx.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getAllNoteSlugs, getNoteBySlug } from '@/lib/mdx'

describe('notes mdx collection', () => {
  it('lists the starter note slug', () => {
    expect(getAllNoteSlugs()).toContain('reading-sustainability-reports')
  })
  it('loads a note with frontmatter', () => {
    const note = getNoteBySlug('reading-sustainability-reports')
    expect(note).not.toBeNull()
    expect(note!.frontmatter.title.length).toBeGreaterThan(0)
    expect(note!.frontmatter.summary.length).toBeGreaterThan(0)
    expect(note!.content).toContain('##')
  })
  it('returns null for unknown slug', () => {
    expect(getNoteBySlug('nope')).toBeNull()
  })
})
```

Create `tests/data/get-notes.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getNoteEntries } from '@/data/content'
import { getAllNoteSlugs } from '@/lib/mdx'

describe('getNoteEntries', () => {
  it('index.json slugs match mdx files on disk', () => {
    const indexSlugs = getNoteEntries().map((n) => n.slug).sort()
    expect(indexSlugs).toEqual(getAllNoteSlugs().sort())
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/lib/notes-mdx.test.ts tests/data/get-notes.test.ts`
Expected: FAIL — functions missing.

- [ ] **Step 3: Implement the collection**

In `src/lib/mdx.ts` add (mirroring the research functions):

```ts
const NOTES_DIR = path.join(process.cwd(), 'src/content/notes')

export interface NoteMdxData {
  slug: string
  content: string
  frontmatter: {
    title: string
    date: string
    summary: string
    tags: string[]
  }
}

export function getAllNoteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return []
  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getNoteBySlug(slug: string): NoteMdxData | null {
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    content,
    frontmatter: {
      title: data.title || '',
      date: data.date || '',
      summary: data.summary || '',
      tags: data.tags || [],
    },
  }
}
```

In `src/types/content.ts`:

```ts
export interface NoteEntry {
  title: string
  slug: string
  summary: string
  date: string
  tags: string[]
}
```

In `src/data/content.ts`: import `noteData from '@/content/notes/index.json'` and `NoteEntry`, add:

```ts
export function getNoteEntries(): NoteEntry[] {
  return noteData as NoteEntry[]
}
```

- [ ] **Step 4: Author the starter note (real content, from the thesis abstract)**

Create `src/content/notes/index.json`:

```json
[
  {
    "title": "How to Read a Sustainability Report Without Getting Fooled",
    "slug": "reading-sustainability-reports",
    "summary": "A plain-language walkthrough of what my thesis taught me about separating real sustainability disclosure from box-ticking — and why quality, not existence, is what moves firm value.",
    "date": "2026-08",
    "tags": ["sustainability reporting", "plain language", "thesis notes"]
  }
]
```

Create `src/content/notes/reading-sustainability-reports.mdx`:

```mdx
---
title: "How to Read a Sustainability Report Without Getting Fooled"
slug: "reading-sustainability-reports"
summary: "A plain-language walkthrough of what my thesis taught me about separating real sustainability disclosure from box-ticking — and why quality, not existence, is what moves firm value."
date: "2026-08"
tags: ["sustainability reporting", "plain language", "thesis notes"]
---

## Why this note exists

My undergraduate thesis asked a narrow question with a practical payoff: does the **quality** of sustainability disclosure — not merely its presence — affect firm value among publicly listed Indonesian manufacturers? This note is the plain-language version of what I learned reading hundreds of report pages along the way.

## Presence is cheap, quality is costly

Most listed manufacturers now publish something that looks like a sustainability report. The existence of a report tells you almost nothing — publishing one has become an institutional expectation. What separates reports is the quality of disclosure: whether the company reports against a recognized reference (my thesis used GRI Standards), whether the numbers are specific and comparable year over year, and whether bad news appears at all.

## Three quick checks

1. **Look for the standard.** A report mapped to GRI Standards (or an equivalent framework) commits the company to defined indicators. No framework usually means free-form storytelling.
2. **Look for numbers with baselines.** "We reduced emissions" is a sentence; "Scope 1 emissions fell 8% against our 2022 baseline" is a disclosure.
3. **Look for the uncomfortable section.** Credible reports disclose incidents, non-compliance, or missed targets. A report with only good news is a brochure.

## What the market seems to price

The research literature on emerging markets is genuinely contested, which is exactly why the question is worth asking with panel data instead of anecdotes. My thesis tests the disclosure-quality → firm-value relationship (Tobin's Q and market-to-book) with the usual controls. The full methodology and findings are in [the research article](/research/sustainability-reporting-firm-value).
```

- [ ] **Step 5: Create the routes**

Create `src/app/notes/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getNoteEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Short, plain-language notes on accounting, tax, and sustainability topics.',
}

export default function NotesPage() {
  const notes = [...getNoteEntries()].sort((a, b) => b.date.localeCompare(a.date))

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
          Notes
        </h1>
        <p className="mt-2 text-muted text-base">
          Short, plain-language notes on accounting, tax, and sustainability topics.
        </p>

        <div className="mt-12 space-y-4">
          {notes.length === 0 && <p className="text-muted">Notes are coming soon.</p>}
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="block rounded-lg border border-border p-6 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(13,79,92,0.35)]"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-subtle">{formatDate(note.date)}</p>
              <h2 className="mt-2 font-display text-xl font-medium leading-snug text-foreground">{note.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{note.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
```

Create `src/app/notes/[slug]/page.tsx` (same shape as the research detail page, minus TOC/citation — notes are short):

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Badge } from '@/components/ui/badge'
import { getNoteBySlug, getAllNoteSlugs } from '@/lib/mdx'
import { readingTimeMinutes } from '@/lib/article-utils'
import { ReadingProgress } from '@/components/research/reading-progress'
import { formatDate } from '@/utils/format-date'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) return {}
  return { title: note.frontmatter.title, description: note.frontmatter.summary }
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  if (!note) notFound()

  return (
    <article className="py-16 px-6">
      <ReadingProgress />
      <div className="mx-auto max-w-3xl">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← All notes
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
          {note.frontmatter.title}
        </h1>

        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-subtle">
          {formatDate(note.frontmatter.date)} · {readingTimeMinutes(note.content)} min read
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {note.frontmatter.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-10 prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-medium prose-a:text-accent prose-strong:text-foreground">
          <MDXRemote source={note.content} />
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 6: Register everywhere**

`src/config/navigation.ts`:

```ts
export const pageLinks: NavItem[] = [
  { label: 'Research', href: '/research' },
  { label: 'Notes', href: '/notes' },
]
```

`src/app/sitemap.ts` — import `getNoteEntries`, add `/notes` to `staticRoutes` (priority 0.7, monthly) and:

```ts
const noteRoutes: MetadataRoute.Sitemap = getNoteEntries().map((note) => ({
  url: `${baseUrl}/notes/${note.slug}`,
  lastModified: new Date(),
  changeFrequency: 'monthly' as const,
  priority: 0.5,
}))
```

(include `...noteRoutes` in the returned array).

`src/components/navigation/command-palette.tsx` — import `getNoteEntries`, add after the research block in `commands`:

```ts
const notes: Command[] = getNoteEntries().map((note) => ({
  id: `note:${note.slug}`,
  label: note.title,
  hint: 'Note',
  run: () => goTo(`/notes/${note.slug}`),
}))
```

(and spread `...notes` into the returned array).

- [ ] **Step 7: Verify + commit**

```bash
npx vitest run tests/lib/notes-mdx.test.ts tests/data/get-notes.test.ts tests/components/navigation/command-palette.test.tsx
npm run test:run
npm run build   # /notes and /notes/reading-sustainability-reports must appear in the route list
git add src/content/notes/ src/lib/mdx.ts src/data/content.ts src/types/content.ts src/app/notes/ src/config/navigation.ts src/app/sitemap.ts src/components/navigation/command-palette.tsx tests/lib/notes-mdx.test.ts tests/data/get-notes.test.ts
git commit -m "feat(notes): add Notes surface with starter thesis note"
```

(Navbar/mobile-menu tests may assert the exact nav item list — extend them for "Notes" if they fail.)

---

### Task 9: Testimonials (empty-safe)

**Files:**
- Create: `src/content/testimonials.json` (empty array)
- Modify: `src/types/content.ts` (TestimonialEntry), `src/data/content.ts` (getTestimonials)
- Create: `src/components/sections/testimonials-section.tsx`
- Modify: `src/app/page.tsx` (render between CredentialsSection and SkillsSection)
- Test: `tests/components/sections/testimonials-section.test.tsx`

**Interfaces:**
- Consumes: `SectionWrapper`, `SectionHeading` (existing layout components; see experience-section.tsx for usage).
- Produces:
  - `interface TestimonialEntry { quote: string; name: string; role: string; relationship: string }`
  - `getTestimonials(): TestimonialEntry[]`
  - `<TestimonialsSection />` — server component; returns `null` when the JSON array is empty. **Never invent quotes: the JSON ships empty.**

- [ ] **Step 1: Write the failing test**

Create `tests/components/sections/testimonials-section.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

const mockData = vi.hoisted(() => ({ entries: [] as unknown[] }))
vi.mock('@/data/content', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/content')>()
  return { ...original, getTestimonials: () => mockData.entries }
})

import { TestimonialsSection } from '@/components/sections/testimonials-section'

describe('TestimonialsSection', () => {
  afterEach(() => { cleanup(); mockData.entries = [] })

  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<TestimonialsSection />)
    expect(container.innerHTML).toBe('')
  })

  it('renders quotes when data exists', () => {
    mockData.entries = [
      { quote: 'A rigorous, reliable analyst.', name: 'Jane Doe', role: 'Thesis Supervisor', relationship: 'Academic advisor' },
    ]
    render(<TestimonialsSection />)
    expect(screen.getByText(/rigorous, reliable analyst/i)).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/components/sections/testimonials-section.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

`src/content/testimonials.json`:

```json
[]
```

`src/types/content.ts`:

```ts
export interface TestimonialEntry {
  quote: string
  name: string
  role: string
  relationship: string
}
```

`src/data/content.ts`: import `testimonialsData from '@/content/testimonials.json'` and `TestimonialEntry`, add:

```ts
export function getTestimonials(): TestimonialEntry[] {
  return testimonialsData as TestimonialEntry[]
}
```

`src/components/sections/testimonials-section.tsx`:

```tsx
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { getTestimonials } from '@/data/content'

export function TestimonialsSection() {
  const testimonials = getTestimonials()
  if (testimonials.length === 0) return null

  return (
    <SectionWrapper id="testimonials">
      <SectionHeading title="Testimonials" sectionNumber="05" label="References" />
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={`${t.name}-${t.quote.slice(0, 16)}`} className="rounded-lg border border-border bg-surface-alt/60 p-6">
            <blockquote className="font-display text-lg italic leading-relaxed text-foreground">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-medium text-foreground">{t.name}</span>
              <span className="text-muted"> — {t.role}</span>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-subtle">{t.relationship}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionWrapper>
  )
}
```

`src/app/page.tsx`: `import { TestimonialsSection } from '@/components/sections/testimonials-section'` (static import — it renders null today) and place `<TestimonialsSection />` between `<CredentialsSection />` and `<SkillsSection />`.

Note: `SectionHeading`'s `sectionNumber` values on the homepage may need no renumbering because the section renders null while empty; do NOT renumber other sections in this task.

- [ ] **Step 4: Verify + commit**

```bash
npx vitest run tests/components/sections/testimonials-section.test.tsx tests/app/page.test.tsx
npm run test:run
npm run build
git add src/content/testimonials.json src/types/content.ts src/data/content.ts src/components/sections/testimonials-section.tsx src/app/page.tsx tests/components/sections/testimonials-section.test.tsx
git commit -m "feat(sections): add empty-safe testimonials section"
```

---

### Task 10: Plan 2 wrap-up (README, verification, visual pass)

**Files:**
- Modify: `README.md` (features list + changelog entry for Phase 4 Plan 2)

- [ ] **Step 1: README updates**

Add to the Features list (after the Research Pages bullet):

```markdown
- **Journal Reading Experience** — Sticky table of contents, reading progress bar, reading-time estimate, and "Cite this" (APA + BibTeX) on research articles
- **Per-Article OG Images** — Branded 1200×630 preview images generated at build time for every research article
- **Command Palette** — Ctrl+K / Cmd+K quick navigation across sections, pages, articles, and actions
- **Notes** — Plain-language MDX notes at `/notes` with the same content pipeline as research articles
- **Testimonials (data-driven)** — `testimonials.json`-powered section that appears only when quotes exist
```

Add under `## 📋 Changelog`, directly below the heading:

```markdown
### Phase 4 Plan 2 — Substance (2026-08-06)

- Journal-grade reading experience on `/research/[slug]`: sticky TOC with scroll-spy, reading progress bar, reading time, APA/BibTeX "Cite this" block with copy buttons
- Per-article OG images generated at build time via Sharp (`scripts/generate-og.mjs`, wired as `prebuild`)
- Hand-rolled Ctrl+K command palette (navigation, research articles, notes, theme/CV/email actions) with full keyboard support
- New `/notes` surface (MDX, mirrors the research pipeline) with a starter plain-language thesis note
- Empty-safe testimonials section (renders only when `testimonials.json` has entries)
```

- [ ] **Step 2: Full verification battery**

```bash
npm run test:run
npm run lint
npm run build
```

Expected: suite green; lint only the two known `<img>` warnings; build exports all routes including `/notes`, `/notes/reading-sustainability-reports`, and `out/og/research-*.png` present.

- [ ] **Step 3: Manual visual pass (dev server)**

`npm run dev` and check:
1. `/research/sustainability-reporting-firm-value` — TOC highlights while scrolling, links jump below navbar, progress bar fills, Cite block copies APA and BibTeX.
2. Ctrl+K anywhere — palette opens, arrows navigate, Enter jumps, Esc closes; navbar chip opens it too.
3. `/notes` list and the starter note render styled prose.
4. Homepage unchanged visually (testimonials invisible while empty).
5. Reduced-motion emulation: no broken states.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document Phase 4 Plan 2 substance features"
```

- [ ] **Step 5: Report to user with evidence** (superpowers:verification-before-completion)
