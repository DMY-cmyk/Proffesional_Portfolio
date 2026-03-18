# Display Polish Phase 2 — Sub-pages & Navigation

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the remaining unenhanced pages (research, certification detail, 404) and navigation components (navbar scroll effects, active link animations, footer back-to-top) to match the quality of the homepage improvements from Phase 1.

**Architecture:** Each task targets one component/page. Navbar gets scroll-based effects via a new `useScrollProgress` hook. Sub-pages get entrance animations via the existing `StaggerChildren` component and layout polish. NavLinks get an animated underline indicator. Footer gets a back-to-top button.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion 12

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/hooks/use-scroll-progress.ts` | Custom hook returning scroll percentage (0–1) |
| Modify | `src/components/layout/navbar.tsx` | Add scroll progress bar and shadow-on-scroll |
| Modify | `src/components/navigation/nav-links.tsx` | Add animated underline indicator for active link |
| Modify | `src/app/research/page.tsx` | Add StaggerChildren animation to research cards |
| Modify | `src/app/research/[slug]/page.tsx` | Polish layout: styled back-link, visual divider, tag spacing |
| Modify | `src/app/certifications/[slug]/page.tsx` | Polish layout: styled back-link, metadata card, responsive iframe |
| Modify | `src/app/not-found.tsx` | Animated 404 text, gradient shimmer, better visual hierarchy |
| Modify | `src/components/layout/footer.tsx` | Add back-to-top button, improve icon hover animations |
| Create | `tests/hooks/use-scroll-progress.test.ts` | Tests for scroll progress hook |
| Modify | `tests/components/layout/navbar.test.tsx` | Add test for scroll progress bar element |
| Modify | `tests/components/navigation/nav-links.test.tsx` | Verify underline indicator renders for active link |
| Modify | `tests/components/layout/footer.test.tsx` | Add test for back-to-top button |
| Modify | `tests/app/not-found.test.tsx` | Update framer-motion mock for new elements |

---

## Chunk 1: Navbar Scroll Effects & Active Link Indicator

### Task 1: Create useScrollProgress hook

**Files:**
- Create: `src/hooks/use-scroll-progress.ts`
- Create: `tests/hooks/use-scroll-progress.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tests/hooks/use-scroll-progress.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollProgress } from '@/hooks/use-scroll-progress'

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  })

  it('returns 0 initially', () => {
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)
  })

  it('updates on scroll', () => {
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(0.5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/hooks/use-scroll-progress.test.ts -v`
Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```ts
// src/hooks/use-scroll-progress.ts
'use client'

import { useState, useEffect } from 'react'

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return progress
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/hooks/use-scroll-progress.test.ts -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-scroll-progress.ts tests/hooks/use-scroll-progress.test.ts
git commit -m "feat: add useScrollProgress hook"
```

---

### Task 2: Add scroll progress bar and shadow to Navbar

**Files:**
- Modify: `src/components/layout/navbar.tsx`
- Modify: `tests/components/layout/navbar.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `tests/components/layout/navbar.test.tsx` inside the describe block:

```tsx
it('renders a scroll progress bar', () => {
  render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  )
  expect(document.querySelector('[data-testid="scroll-progress"]')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/layout/navbar.test.tsx -v`
Expected: FAIL — element not found

- [ ] **Step 3: Implement the scroll progress bar in Navbar**

Replace `src/components/layout/navbar.tsx` with:

```tsx
'use client'

import Link from 'next/link'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import { allNavItems, sectionLinks } from '@/config/navigation'
import { NavLinks } from '@/components/navigation/nav-links'
import { MobileMenu } from '@/components/navigation/mobile-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const sectionIds = sectionLinks.map((item) => item.href.replace('#', ''))

export function Navbar() {
  const activeSection = useScrollSpy(sectionIds)
  const scrollProgress = useScrollProgress()
  const hasScrolled = scrollProgress > 0.01

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-shadow duration-300 ${
        hasScrolled ? 'shadow-md shadow-black/5' : ''
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
        <Link href="/" className="text-lg font-bold text-gold-500">
          DM
        </Link>
        <div className="flex items-center gap-2">
          <NavLinks items={allNavItems} activeSection={activeSection} />
          <ThemeToggle />
          <MobileMenu items={allNavItems} activeSection={activeSection} />
        </div>
      </div>
      <div
        data-testid="scroll-progress"
        className="absolute bottom-0 left-0 h-0.5 bg-gold-500 transition-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </header>
  )
}
```

- [ ] **Step 4: Add useScrollProgress mock to navbar test**

The navbar test also needs to mock `useScrollProgress`. Add at the top of the test file after existing mocks:

```tsx
vi.mock('@/hooks/use-scroll-progress', () => ({
  useScrollProgress: () => 0,
}))
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/components/layout/navbar.test.tsx -v`
Expected: PASS (all 4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/navbar.tsx tests/components/layout/navbar.test.tsx
git commit -m "feat: add scroll progress bar and shadow to navbar"
```

---

### Task 3: Add animated underline indicator to NavLinks

**Files:**
- Modify: `src/components/navigation/nav-links.tsx`
- Modify: `tests/components/navigation/nav-links.test.tsx`

- [ ] **Step 1: Add framer-motion mock and write the failing test**

First add the framer-motion mock at the top of `tests/components/navigation/nav-links.test.tsx` (after imports, before describe):

```tsx
vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))
```

Then add to the describe block:

```tsx
it('renders an underline indicator for the active link', () => {
  const { container } = render(<NavLinks items={mockItems} activeSection="about" />)
  const indicator = container.querySelector('[data-testid="active-indicator"]')
  expect(indicator).toBeInTheDocument()
})
```

Also add `vi` to the vitest import if not already present: `import { describe, it, expect, vi } from 'vitest'`

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx -v`
Expected: FAIL — element not found (NavLinks doesn't render the indicator yet)

- [ ] **Step 3: Implement the animated underline**

Replace `src/components/navigation/nav-links.tsx` with:

```tsx
'use client'

import { cn } from '@/utils/cn'
import { withBasePath } from '@/lib/base-path'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '@/config/navigation'

interface NavLinksProps {
  items: NavItem[]
  activeSection?: string
}

export function NavLinks({ items, activeSection }: NavLinksProps) {
  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((item) => {
        const isActive = activeSection && item.href === `#${activeSection}`
        return (
          <a
            key={item.href}
            href={item.href.startsWith('#') ? item.href : withBasePath(item.href)}
            className={cn(
              'relative px-3 py-2 text-sm font-medium rounded-md transition-colors',
              'text-muted-foreground hover:text-foreground',
              isActive && 'text-gold-500'
            )}
          >
            {item.label}
            <AnimatePresence>
              {isActive && (
                <motion.span
                  data-testid="active-indicator"
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gold-500"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </a>
        )
      })}
    </nav>
  )
}
```

Note: This adds `'use client'` directive since we're now using conditional rendering logic with framer-motion. The `NavLinks` component was already rendered inside a client component (Navbar), so this is safe. The `layoutId="nav-underline"` makes the indicator smoothly slide between links as the active section changes.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx -v`
Expected: PASS (all 4 tests)

- [ ] **Step 5: Run all tests to verify no regressions**

Run: `npx vitest run`
Expected: All 126+ tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/navigation/nav-links.tsx tests/components/navigation/nav-links.test.tsx
git commit -m "feat: add animated underline indicator to active nav link"
```

---

## Chunk 2: Sub-page Polish & 404 Upgrade

### Task 4: Polish research listing page

**Files:**
- Modify: `src/app/research/page.tsx`

- [ ] **Step 1: Add StaggerChildren to research listing**

Replace `src/app/research/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getResearchEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { StaggerChildren } from '@/components/motion/stagger-children'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Academic and professional research work.',
}

export default function ResearchPage() {
  const entries = getResearchEntries()

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title="Research" subtitle="Academic and professional research work" />

        <StaggerChildren className="space-y-6">
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
        </StaggerChildren>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run the existing test to verify no regressions**

Run: `npx vitest run tests/app/research-page.test.tsx -v`
Expected: PASS (all 3 tests)

- [ ] **Step 3: Commit**

```bash
git add src/app/research/page.tsx
git commit -m "feat: add stagger animation to research listing"
```

---

### Task 5: Polish research detail page

**Files:**
- Modify: `src/app/research/[slug]/page.tsx`

- [ ] **Step 1: Polish the research detail layout**

Replace `src/app/research/[slug]/page.tsx` with:

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
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/research"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> Back to Research
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {research.frontmatter.title}
        </h1>

        <p className="mt-3 text-gold-500 font-medium">{formatDate(research.frontmatter.date)}</p>

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

        <div className="mt-10 border-t border-border pt-10">
          <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-gold-500 prose-strong:text-foreground">
            <MDXRemote source={research.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

Key changes: better spacing, font-medium on date, improved prose typography classes, visual divider spacing.

- [ ] **Step 2: Run existing tests**

Run: `npx vitest run tests/app/research-detail.test.tsx -v`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/research/[slug]/page.tsx
git commit -m "feat: polish research detail page layout"
```

---

### Task 6: Polish certification detail page

**Files:**
- Modify: `src/app/certifications/[slug]/page.tsx`

- [ ] **Step 1: Polish the certification detail layout**

Replace `src/app/certifications/[slug]/page.tsx` with:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCertifications } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { withBasePath } from '@/lib/base-path'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const certifications = getCertifications()
  return certifications.map((cert) => ({ slug: cert.slug }))
}

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
        <Link
          href="/#certifications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> Back to Certifications
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {cert.name}
        </h1>

        <div className="mt-6 rounded-lg border border-border bg-card/80 backdrop-blur-sm p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Issued by:</span>{' '}
              {cert.issuer}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Date:</span>{' '}
              <span className="text-gold-500">{formatDate(cert.date)}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button href={cert.documentPath} variant="primary" size="lg" external>
            View Certificate
          </Button>
          <a
            href={withBasePath(cert.documentPath)}
            download
            className="inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-surface hover:border-gold-500/50 px-6 py-3 text-lg font-medium transition-colors"
          >
            Download PDF
          </a>
        </div>

        <div className="mt-8 border border-border rounded-lg overflow-hidden">
          <iframe
            src={withBasePath(cert.documentPath)}
            className="w-full h-[70vh] min-h-[400px]"
            title={`${cert.name} certificate document`}
          />
        </div>
      </div>
    </div>
  )
}
```

Key changes: styled metadata card with glassmorphism, better back-link, responsive iframe height (70vh instead of fixed 600px), hover effect on download button.

- [ ] **Step 2: Run existing tests**

Run: `npx vitest run tests/app/certification-detail.test.tsx -v`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/certifications/[slug]/page.tsx
git commit -m "feat: polish certification detail page layout"
```

---

### Task 7: Upgrade 404 page with animations

**Files:**
- Modify: `src/app/not-found.tsx`
- Modify: `tests/app/not-found.test.tsx`

- [ ] **Step 1: Implement animated 404 page**

Replace `src/app/not-found.tsx` with:

```tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AuroraBackground } from '@/components/motion/aurora-background'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function NotFound() {
  return (
    <>
      <AuroraBackground />
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative z-10">
        <motion.h1
          className="text-8xl md:text-9xl font-bold hero-gradient-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          404
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page not found
        </motion.p>
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
        </motion.div>
      </div>
    </>
  )
}
```

Key changes: `'use client'` added, framer-motion entrance animations, `hero-gradient-text` class on 404 heading (reuses existing gold shimmer animation from globals.css), staggered fade-in for all elements, larger text on desktop (text-9xl).

- [ ] **Step 2: Update the 404 test mock to include motion.h1 and motion.p**

Replace the framer-motion mock in `tests/app/not-found.test.tsx`:

```tsx
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))
```

- [ ] **Step 3: Run tests to verify**

Run: `npx vitest run tests/app/not-found.test.tsx -v`
Expected: PASS (all 3 tests)

- [ ] **Step 4: Commit**

```bash
git add src/app/not-found.tsx tests/app/not-found.test.tsx
git commit -m "feat: add entrance animations and gradient text to 404 page"
```

---

### Task 8: Add back-to-top button and polish Footer

**Files:**
- Modify: `src/components/layout/footer.tsx`
- Modify: `tests/components/layout/footer.test.tsx`

- [ ] **Step 1: Write the failing test**

Add to `tests/components/layout/footer.test.tsx` inside the describe block:

```tsx
it('renders a back-to-top button', () => {
  render(<Footer />)
  expect(screen.getByRole('button', { name: /top|scroll/i })).toBeInTheDocument()
})
```

Also add `vi` to the imports: `import { describe, it, expect, vi, afterEach } from 'vitest'`

And add framer-motion mock at top:

```tsx
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/layout/footer.test.tsx -v`
Expected: FAIL — button not found

- [ ] **Step 3: Implement back-to-top button in Footer**

Replace `src/components/layout/footer.tsx` with:

```tsx
'use client'

import { motion } from 'framer-motion'
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

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  )
}

export function Footer() {
  const contact = getContact()
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-500 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUpIcon className="h-4 w-4" />
            Back to top
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} Dzaki Muhammad Yusfian. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold-500 hover:scale-110 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-gold-500 hover:scale-110 transition-all duration-200"
              aria-label="GitHub"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-muted-foreground hover:text-gold-500 hover:scale-110 transition-all duration-200"
              aria-label="Email"
            >
              <EmailIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

Key changes: `'use client'` directive, back-to-top button with motion animation, `hover:scale-110` on social icons for pop effect.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/layout/footer.test.tsx -v`
Expected: PASS (all 4 tests)

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Run production build**

Run: `npx next build`
Expected: Build succeeds with no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/footer.tsx tests/components/layout/footer.test.tsx
git commit -m "feat: add back-to-top button and icon hover animations to footer"
```

---

## Final Verification

- [ ] **Step 1: Run full test suite one last time**

Run: `npx vitest run --reporter=verbose`
Expected: All tests pass (130+ tests across 37+ files)

- [ ] **Step 2: Run production build**

Run: `npx next build`
Expected: Build succeeds, static export to `/out`

- [ ] **Step 3: Verify git status is clean**

Run: `git --no-pager status && git --no-pager log --oneline -5`
Expected: Clean working tree, all commits present
