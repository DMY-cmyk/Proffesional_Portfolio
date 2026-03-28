# SEO & Analytics — Design Spec

**Date:** 2026-03-28
**Status:** Draft
**Phase:** 5 of 5
**Depends on:** Phase 4 (research enhancements, cert enhancements)

## Problem

The portfolio has solid base SEO (OG tags, JSON-LD, sitemap) but lacks per-article OG images, Article-level structured data, analytics tracking, and complete sitemap coverage for all dynamic routes.

## Design

### 1. Google Analytics integration

#### 1a. Environment variable

```bash
# .env.local — add:
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Add to `.env.example`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=  # Google Analytics 4 measurement ID
```

#### 1b. Analytics component

Create a reusable analytics component using `next/script`:

```tsx
// src/components/layout/google-analytics.tsx
'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}
```

Add to `layout.tsx` inside `<body>`:
```tsx
<GoogleAnalytics />
```

#### 1c. Custom event tracking

Create a utility for firing custom events:

```tsx
// src/utils/analytics.ts
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    })
  }
}
```

Track key interactions:

| Event | Where | Code |
|-------|-------|------|
| Section scroll | SectionWrapper | `trackEvent('scroll_into_view', 'section', sectionId)` |
| Form submit | ContactForm | `trackEvent('submit', 'contact_form', 'success')` |
| CV download | ContactSection | `trackEvent('download', 'cv', filename)` |
| Research article view | Research detail | `trackEvent('view', 'research', slug)` |
| Cert view | Cert detail | `trackEvent('view', 'certification', slug)` |
| Accent change | AccentPicker | `trackEvent('change', 'accent_color', newAccent)` |
| Theme toggle | ThemeToggle | `trackEvent('toggle', 'theme', newTheme)` |

#### 1d. Section scroll depth tracking

Add intersection observer to SectionWrapper for automatic scroll depth tracking:

```tsx
// In SectionWrapper, add to existing IntersectionObserver:
useEffect(() => {
  if (!ref.current) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        trackEvent('scroll_into_view', 'section', id)
      }
    },
    { threshold: 0.3 }
  )
  observer.observe(ref.current)
  return () => observer.disconnect()
}, [id])
```

### 2. Dynamic OG images for research articles

Since this is a static export site, generate OG images at build time using a build script with `sharp` (already a dependency).

#### 2a. Build script

```tsx
// scripts/generate-og-images.ts
import sharp from 'sharp'
import { getResearchArticles } from '../src/data/content'
import path from 'path'
import fs from 'fs'

const WIDTH = 1200
const HEIGHT = 630

async function generateOgImage(title: string, date: string, outputPath: string) {
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#09090b"/>
      <rect x="0" y="0" width="100%" height="4" fill="#d4af37"/>
      <text x="80" y="280" fill="#e4e4e7" font-size="48" font-family="serif" font-weight="700">
        ${escapeXml(truncate(title, 50))}
      </text>
      ${title.length > 50 ? `
        <text x="80" y="340" fill="#e4e4e7" font-size="48" font-family="serif" font-weight="700">
          ${escapeXml(truncate(title.substring(50), 50))}
        </text>
      ` : ''}
      <text x="80" y="${title.length > 50 ? 400 : 340}" fill="#a1a1aa" font-size="24" font-family="sans-serif">
        ${date} · Dzaki Muhammad Yusfian
      </text>
      <text x="80" y="560" fill="#d4af37" font-size="20" font-family="monospace">
        Research Article
      </text>
    </svg>
  `

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath)
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function truncate(s: string, len: number) {
  return s.length > len ? s.substring(0, len) + '...' : s
}

async function main() {
  const articles = getResearchArticles()
  const outputDir = path.join(process.cwd(), 'public', 'images', 'og')
  fs.mkdirSync(outputDir, { recursive: true })

  for (const article of articles) {
    const outputPath = path.join(outputDir, `${article.slug}.png`)
    await generateOgImage(article.title, article.date, outputPath)
    console.log(`Generated: ${outputPath}`)
  }
}

main()
```

#### 2b. Add to build pipeline

Update `package.json` scripts:
```json
{
  "scripts": {
    "prebuild": "tsx scripts/generate-og-images.ts",
    "build": "next build"
  }
}
```

Add `tsx` as a dev dependency if not already installed.

#### 2c. Reference in metadata

Update research detail page metadata to reference article-specific OG images:

```tsx
// src/app/research/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  return {
    title: article.title,
    description: article.abstract,
    openGraph: {
      title: article.title,
      description: article.abstract,
      images: [
        {
          url: withBasePath(`/images/og/${article.slug}.png`),
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.abstract,
      images: [withBasePath(`/images/og/${article.slug}.png`)],
    },
  }
}
```

### 3. Article JSON-LD schema

Extend the existing JsonLd component to support Article structured data:

```tsx
// src/components/layout/json-ld.tsx — add ArticleJsonLd:
interface ArticleJsonLdProps {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  url: string
  image?: string
}

export function ArticleJsonLd({ title, description, datePublished, dateModified, author, url, image }: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: author,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && { image }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
```

Use in research detail pages:

```tsx
<ArticleJsonLd
  title={article.title}
  description={article.abstract}
  datePublished={article.date}
  author="Dzaki Muhammad Yusfian"
  url={`${site.url}/research/${article.slug}`}
  image={`${site.url}${withBasePath(`/images/og/${article.slug}.png`)}`}
/>
```

### 4. Verify sitemap coverage

Check and update `src/app/sitemap.ts` to include all dynamic routes:

```tsx
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getResearchArticles, getCertifications } from '@/data/content'
import { getSite } from '@/data/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite()
  const baseUrl = site.url

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const researchRoutes: MetadataRoute.Sitemap = getResearchArticles().map(article => ({
    url: `${baseUrl}/research/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  const certRoutes: MetadataRoute.Sitemap = getCertifications().map(cert => ({
    url: `${baseUrl}/certifications/${cert.slug}`,
    lastModified: new Date(cert.date),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...researchRoutes, ...certRoutes]
}
```

Key points:
- Include `lastModified` from actual content dates
- Set appropriate `changeFrequency` and `priority`
- Cover all research articles and certification detail pages
- Verify the output URL includes the basePath for GitHub Pages

## Files Changed

| File | Change |
|------|--------|
| `.env.local` | Add GA_MEASUREMENT_ID |
| `.env.example` | Add GA_MEASUREMENT_ID placeholder |
| `src/components/layout/google-analytics.tsx` | NEW — GA4 component |
| `src/utils/analytics.ts` | NEW — event tracking utility |
| `src/app/layout.tsx` | Add GoogleAnalytics component |
| `src/components/layout/section-wrapper.tsx` | Add scroll depth tracking |
| `src/components/ui/contact-form.tsx` | Add form submit tracking |
| `src/components/sections/contact-section.tsx` | Add download tracking |
| `scripts/generate-og-images.ts` | NEW — OG image generator |
| `package.json` | Add prebuild script, tsx dependency |
| `src/components/layout/json-ld.tsx` | Add ArticleJsonLd component |
| `src/app/research/[slug]/page.tsx` | Add OG image metadata, ArticleJsonLd |
| `src/app/sitemap.ts` | Ensure full route coverage |

## Test Impact

- NEW: `tests/components/layout/google-analytics.test.tsx` — verify script rendering, no-op without env var.
- NEW: `tests/utils/analytics.test.ts` — verify trackEvent calls gtag.
- UPDATE: `tests/components/layout/json-ld.test.tsx` — add ArticleJsonLd assertions.
- UPDATE: `tests/app/research-detail.test.tsx` — verify Article JSON-LD output.
- Sitemap output should be verified in build step.

## Verification

```bash
npm run test:run
npm run build          # prebuild generates OG images, then build succeeds
```

Post-deploy verification:
1. Check `/sitemap.xml` includes all research and cert URLs
2. Use Google's Rich Results Test for Article JSON-LD
3. Use Facebook Sharing Debugger for OG image preview
4. Check GA4 real-time dashboard for event tracking
