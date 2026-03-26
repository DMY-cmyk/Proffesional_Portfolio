# SEO & Metadata Fixes — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all SEO and metadata issues (broken robots.txt, missing OG image, missing avatar, broken JSON-LD, missing apple-touch-icon) so the deployed portfolio has correct search engine discoverability and social media previews.

**Architecture:** Config-file fixes for robots.txt and site.json, a Node.js script using sharp+SVG to generate 3 branded images, a resilient JSON-LD component with null-checks, and an updated metadata.ts with apple-touch-icon. All changes are independently deployable.

**Tech Stack:** Next.js 15 (static export), sharp (image generation), Vitest + testing-library (tests)

**Spec:** `docs/superpowers/specs/2026-03-25-seo-metadata-fixes-design.md`

---

## Chunk 1: SEO & Metadata Fixes

### Task 1: Fix robots.txt and site.json Config

**Files:**
- Modify: `public/robots.txt` (line 4)
- Modify: `src/content/site.json` (line 5)

- [ ] **Step 1: Fix robots.txt sitemap URL**

In `public/robots.txt`, replace the placeholder domain:

```
User-agent: *
Allow: /

Sitemap: https://DMY-cmyk.github.io/Proffesional_Portfolio/sitemap.xml
```

- [ ] **Step 2: Fix site.json ogImage basePath**

In `src/content/site.json`, change `ogImage` to include the basePath so Next.js resolves it correctly against `metadataBase`:

```json
{
  "title": "Dzaki Muhammad Yusfian — Accounting & Finance Professional",
  "description": "Professional portfolio showcasing expertise in accounting, tax, audit, and financial analysis.",
  "url": "https://DMY-cmyk.github.io/Proffesional_Portfolio",
  "ogImage": "/Proffesional_Portfolio/images/og-image.jpg",
  "locale": "en"
}
```

- [ ] **Step 3: Verify config changes**

Run: `Get-Content public\robots.txt`
Expected: Sitemap line contains `DMY-cmyk.github.io`

Run: `Get-Content src\content\site.json`
Expected: ogImage is `"/Proffesional_Portfolio/images/og-image.jpg"`

- [ ] **Step 4: Commit config fixes**

```bash
git add public/robots.txt src/content/site.json
git commit -m "fix(seo): correct robots.txt sitemap URL and ogImage basePath

- Replace placeholder.github.io with DMY-cmyk.github.io in robots.txt
- Add /Proffesional_Portfolio prefix to ogImage path in site.json
  so Next.js metadataBase resolves OG image URL correctly

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Install sharp and Create Image Generation Script

**Files:**
- Modify: `package.json` (devDependencies)
- Create: `scripts/generate-images.js`

- [ ] **Step 1: Install sharp as dev dependency**

Run: `npm install --save-dev sharp`
Expected: sharp added to devDependencies in package.json, install succeeds

- [ ] **Step 2: Create scripts directory**

Run: `New-Item -ItemType Directory -Path scripts -Force`

- [ ] **Step 3: Create the image generation script**

Create `scripts/generate-images.js`:

```javascript
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a"/>
          <stop offset="100%" style="stop-color:#1e293b"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <!-- Accent line -->
      <rect x="80" y="200" width="120" height="4" rx="2" fill="url(#accent)"/>
      <!-- Name -->
      <text x="80" y="270" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        Dzaki Muhammad Yusfian
      </text>
      <!-- Title -->
      <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#cbd5e1">
        Accounting &amp; Finance Professional
      </text>
      <!-- Tagline -->
      <text x="80" y="370" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">
        Specializing in Tax, Audit, and Financial Analysis
      </text>
      <!-- Bottom accent dots -->
      <circle cx="80" cy="550" r="4" fill="#3b82f6" opacity="0.6"/>
      <circle cx="100" cy="550" r="4" fill="#6366f1" opacity="0.5"/>
      <circle cx="120" cy="550" r="4" fill="#8b5cf6" opacity="0.4"/>
    </svg>
  `;

  const outputPath = path.join(PUBLIC_DIR, 'images', 'og-image.jpg');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log(`✅ OG image generated: ${outputPath} (${width}x${height})`);
}

async function generateAvatar() {
  const size = 400;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#8b5cf6"/>
        </linearGradient>
        <clipPath id="circle">
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/>
        </clipPath>
      </defs>
      <g clip-path="url(#circle)">
        <rect width="${size}" height="${size}" fill="url(#avatarBg)"/>
        <text
          x="${size / 2}"
          y="${size / 2 + 40}"
          font-family="Arial, Helvetica, sans-serif"
          font-size="120"
          font-weight="bold"
          fill="#ffffff"
          text-anchor="middle"
        >DMY</text>
      </g>
    </svg>
  `;

  const outputPath = path.join(PUBLIC_DIR, 'images', 'profile', 'avatar.jpg');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log(`✅ Avatar generated: ${outputPath} (${size}x${size})`);
}

async function generateAppleTouchIcon() {
  const size = 180;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="36" fill="#3b82f6"/>
      <text
        x="${size / 2}"
        y="${size / 2 + 18}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="56"
        font-weight="bold"
        fill="#ffffff"
        text-anchor="middle"
      >DMY</text>
    </svg>
  `;

  const outputPath = path.join(PUBLIC_DIR, 'icons', 'apple-touch-icon.png');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✅ Apple touch icon generated: ${outputPath} (${size}x${size})`);
}

async function main() {
  console.log('Generating SEO images...\n');
  await generateOgImage();
  await generateAvatar();
  await generateAppleTouchIcon();
  console.log('\n🎉 All images generated successfully!');
}

main().catch((err) => {
  console.error('❌ Image generation failed:', err);
  process.exit(1);
});
```

- [ ] **Step 4: Run the image generation script**

Run: `node scripts/generate-images.js`
Expected output:
```
Generating SEO images...

✅ OG image generated: ...\public\images\og-image.jpg (1200x630)
✅ Avatar generated: ...\public\images\profile\avatar.jpg (400x400)
✅ Apple touch icon generated: ...\public\icons\apple-touch-icon.png (180x180)

🎉 All images generated successfully!
```

- [ ] **Step 5: Verify generated images exist and have correct dimensions**

Run: `node -e "const sharp = require('sharp'); async function check(f,w,h){const m=await sharp(f).metadata();console.log(f,m.width+'x'+m.height,m.width===w&&m.height===h?'✅':'❌')} check('public/images/og-image.jpg',1200,630).then(()=>check('public/images/profile/avatar.jpg',400,400)).then(()=>check('public/icons/apple-touch-icon.png',180,180))"`

Expected: All three files show correct dimensions with ✅

- [ ] **Step 6: Commit script and generated images**

```bash
git add scripts/generate-images.js public/images/og-image.jpg public/images/profile/avatar.jpg public/icons/apple-touch-icon.png package.json package-lock.json
git commit -m "feat(seo): add image generation script and branded assets

- Add scripts/generate-images.js using sharp + SVG
- Generate 1200x630 OG image with name/title/tagline
- Generate 400x400 initials avatar (DMY)
- Generate 180x180 apple-touch-icon (DMY)
- Install sharp as dev dependency

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Write JSON-LD Tests (TDD — RED Phase)

**Files:**
- Create: `tests/components/layout/json-ld.test.tsx`

- [ ] **Step 1: Write the failing tests for JSON-LD component**

Create `tests/components/layout/json-ld.test.tsx`:

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

// Mock the data modules
vi.mock('@/data/content', () => ({
  getProfile: vi.fn(),
  getSiteConfig: vi.fn(),
  getContact: vi.fn(),
}))

import { getProfile, getSiteConfig, getContact } from '@/data/content'
import { JsonLd } from '@/components/layout/json-ld'

const mockGetProfile = vi.mocked(getProfile)
const mockGetSiteConfig = vi.mocked(getSiteConfig)
const mockGetContact = vi.mocked(getContact)

function setupMocks(overrides: { avatar?: string; linkedin?: string; github?: string; instagram?: string } = {}) {
  mockGetProfile.mockReturnValue({
    name: 'Test User',
    title: 'Test Title',
    tagline: 'Test tagline',
    bio: 'Test bio',
    brandStatement: 'Test brand',
    avatar: overrides.avatar ?? '/images/profile/avatar.jpg',
  })
  mockGetSiteConfig.mockReturnValue({
    title: 'Test Site',
    description: 'Test description',
    url: 'https://example.com/portfolio',
    ogImage: '/portfolio/images/og-image.jpg',
    locale: 'en',
  })
  mockGetContact.mockReturnValue({
    email: 'test@example.com',
    linkedin: overrides.linkedin ?? 'https://linkedin.com/in/test',
    github: overrides.github ?? 'https://github.com/test',
    instagram: overrides.instagram ?? '',
    location: 'Test City',
  })
}

function getStructuredData(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]')
  if (!script?.textContent) throw new Error('No JSON-LD script found')
  return JSON.parse(script.textContent)
}

describe('JsonLd', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders structured data with all fields when avatar is set', () => {
    setupMocks()
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Person')
    expect(data.name).toBe('Test User')
    expect(data.jobTitle).toBe('Test Title')
    expect(data.description).toBe('Test bio')
    expect(data.url).toBe('https://example.com/portfolio')
    expect(data.image).toBe('https://example.com/portfolio/images/profile/avatar.jpg')
  })

  it('omits image field when avatar is empty string', () => {
    setupMocks({ avatar: '' })
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data).not.toHaveProperty('image')
  })

  it('filters out empty social links from sameAs', () => {
    setupMocks({ linkedin: 'https://linkedin.com/in/test', github: '', instagram: '' })
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data.sameAs).toEqual(['https://linkedin.com/in/test'])
  })

  it('renders sameAs with all non-empty social links', () => {
    setupMocks({
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
      instagram: 'https://instagram.com/test',
    })
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data.sameAs).toEqual([
      'https://linkedin.com/in/test',
      'https://github.com/test',
      'https://instagram.com/test',
    ])
  })
})
```

- [ ] **Step 2: Run tests — verify they FAIL**

Run: `npx vitest run tests/components/layout/json-ld.test.tsx`
Expected: FAIL — the test `omits image field when avatar is empty string` should fail because `json-ld.tsx` currently always includes `image` (it concatenates `site.url + profile.avatar` even when avatar is empty, producing a broken URL).

The other tests may pass since the existing implementation does include all fields.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/components/layout/json-ld.test.tsx
git commit -m "test(seo): add JSON-LD component tests (RED - avatar guard fails)

- Test structured data renders correctly with valid avatar
- Test image field is omitted when avatar is empty (FAILING)
- Test sameAs filters empty social links
- TDD: tests written before implementation fix

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Implement Resilient JSON-LD (TDD — GREEN Phase)

**Files:**
- Modify: `src/components/layout/json-ld.tsx`

- [ ] **Step 1: Update json-ld.tsx with avatar guard**

Replace the full content of `src/components/layout/json-ld.tsx` with:

```typescript
import { getProfile, getSiteConfig, getContact } from '@/data/content'

export function JsonLd() {
  const profile = getProfile()
  const site = getSiteConfig()
  const contact = getContact()

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    url: site.url,
    sameAs: [contact.linkedin, contact.github, contact.instagram].filter(Boolean),
  }

  // Only include image if avatar path is set.
  // Note: site.url already includes the basePath (e.g. /Proffesional_Portfolio),
  // and profile.avatar starts with /images/..., so concatenation produces the correct full URL.
  if (profile.avatar && profile.avatar.length > 0) {
    structuredData.image = `${site.url}${profile.avatar}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

- [ ] **Step 2: Run JSON-LD tests — verify they PASS**

Run: `npx vitest run tests/components/layout/json-ld.test.tsx`
Expected: All 4 tests PASS

- [ ] **Step 3: Run full test suite — verify no regressions**

Run: `npx vitest run`
Expected: All tests pass with 0 failures (existing + 4 new JSON-LD tests)

- [ ] **Step 4: Commit the implementation**

```bash
git add src/components/layout/json-ld.tsx
git commit -m "fix(seo): make JSON-LD resilient to missing avatar image

- Only include image field when profile.avatar is non-empty
- Add comment documenting URL construction assumption
- All 4 JSON-LD tests now pass (TDD GREEN)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Add Apple Touch Icon to Metadata

**Files:**
- Modify: `src/app/metadata.ts` (line 40)

- [ ] **Step 1: Update metadata.ts icons config**

In `src/app/metadata.ts`, replace the `icons` block:

```typescript
// BEFORE:
  icons: {
    icon: withBasePath('/icons/favicon.ico'),
  },

// AFTER:
  icons: {
    icon: withBasePath('/icons/favicon.ico'),
    apple: withBasePath('/icons/apple-touch-icon.png'),
  },
```

- [ ] **Step 2: Run full test suite to verify no regressions**

Run: `npx vitest run`
Expected: All tests pass with 0 failures

- [ ] **Step 3: Commit metadata update**

```bash
git add src/app/metadata.ts
git commit -m "feat(seo): add apple-touch-icon to metadata

- Reference generated apple-touch-icon.png in metadata icons
- Uses withBasePath() for correct production URL

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Final Verification and Deploy

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors. The `out/` directory contains:
- `robots.txt` with correct sitemap URL
- `images/og-image.jpg`
- `images/profile/avatar.jpg`
- `icons/apple-touch-icon.png`

- [ ] **Step 2: Verify built robots.txt**

Run: `Get-Content out\robots.txt`
Expected: Contains `Sitemap: https://DMY-cmyk.github.io/Proffesional_Portfolio/sitemap.xml`

- [ ] **Step 3: Verify built images exist in output**

Run: `Test-Path out\images\og-image.jpg; Test-Path out\images\profile\avatar.jpg; Test-Path out\icons\apple-touch-icon.png`
Expected: All three return `True`

- [ ] **Step 4: Push to deploy**

```bash
git push origin main
```

Expected: Push succeeds, GitHub Actions deploys the updated site.

- [ ] **Step 5: Verify deployment**

Check GitHub Actions for a successful deploy run. The live site at `https://DMY-cmyk.github.io/Proffesional_Portfolio` should now have:
- Correct sitemap URL in robots.txt
- Working OG image for social media previews
- Avatar image in JSON-LD structured data
- Apple touch icon for mobile bookmarks
