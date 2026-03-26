# SEO & Metadata Fixes — Design Spec

**Status:** Draft (Rev 2 — addressing spec review)
**Date:** 2026-03-25
**Sub-project:** 1 of 7 (P0 — Critical)

## Problem

The deployed portfolio at `https://DMY-cmyk.github.io/Proffesional_Portfolio` has several SEO and metadata issues that degrade search engine discoverability, social media link previews, and structured data integrity:

1. `robots.txt` references `placeholder.github.io` instead of the real domain
2. OG image (`/images/og-image.jpg`) is referenced in metadata but the file doesn't exist — social cards show no preview
3. Avatar image (`/images/profile/avatar.jpg`) is referenced in `profile.json` and JSON-LD but doesn't exist — structured data contains a broken image URL
4. No `apple-touch-icon` — mobile users who bookmark the site get a generic icon
5. `json-ld.tsx` doesn't guard against missing images, producing invalid structured data

## Solution Overview

Five targeted fixes, each independently deployable:

### Fix 1: robots.txt Domain Correction

**File:** `public/robots.txt`

Replace:
```
Sitemap: https://placeholder.github.io/Proffesional_Portfolio/sitemap.xml
```
With:
```
Sitemap: https://DMY-cmyk.github.io/Proffesional_Portfolio/sitemap.xml
```

### Fix 1b: OG Image URL BasePath Fix

**File:** `src/content/site.json`

The `ogImage` field is `/images/og-image.jpg` (absolute path). With `metadataBase: new URL('https://DMY-cmyk.github.io/Proffesional_Portfolio')`, Next.js resolves absolute paths against the **origin**, producing `https://DMY-cmyk.github.io/images/og-image.jpg` — missing the basePath.

**Fix:** Change `ogImage` to include the basePath explicitly:
```json
"ogImage": "/Proffesional_Portfolio/images/og-image.jpg"
```

Alternatively, apply `withBasePath()` in `metadata.ts` when referencing `site.ogImage`. The JSON approach is simpler and avoids runtime logic.

### Fix 2: Generate Static OG Image

**Tooling:** Node.js script using `sharp` + inline SVG (prebuilt native binaries for common platforms — no manual compilation step needed, works reliably on Windows and CI).

**Design:**
- Size: 1200 × 630 px (Open Graph standard)
- Background: Dark gradient matching site theme (`#0f172a` → `#1e293b`)
- Content:
  - Name: "Dzaki Muhammad Yusfian" (white, bold, ~48px)
  - Title: "Accounting & Finance Professional" (slate-300, ~28px)
  - Tagline: "Specializing in Tax, Audit, and Financial Analysis" (slate-400, ~20px)
  - Subtle geometric accent (optional — lines or dots pattern)
- Output: `public/images/og-image.jpg` (JPEG, quality 90)

**Script location:** `scripts/generate-images.js` (single script generating all 3 images: OG, avatar, apple-touch-icon — committed, can be re-run when branding changes)

### Fix 3: Generate Initials Avatar

**Tooling:** Same `scripts/generate-images.js` script.

**Design:**
- Size: 400 × 400 px
- Circular clipping (or square with rounded appearance)
- Background: Brand gradient (`#3b82f6` → `#8b5cf6` — blue to purple)
- Content: "DMY" initials (white, bold, centered, ~120px)
- Output: `public/images/profile/avatar.jpg` (JPEG, quality 90)

### Fix 4: Resilient JSON-LD

**File:** `src/components/layout/json-ld.tsx`

Changes:
- Only include `image` field if `profile.avatar` is a non-empty string (guard: `if (profile.avatar && profile.avatar.length > 0)`)
- The URL construction `${site.url}${profile.avatar}` is currently correct because `site.url` includes the basePath and `profile.avatar` starts with `/images/...`. Document this assumption with a comment.
- Filter out empty/null social links from `sameAs` (already done with `.filter(Boolean)`)
- ~~`alumniOf` structured data~~ — moved to Out of Scope (Sub-project 2: Content & Data)

### Fix 5: Apple Touch Icon

**Tooling:** Same `scripts/generate-images.js` script.

**Design:**
- Size: 180 × 180 px
- Background: Solid brand blue (`#3b82f6`)
- Content: "DMY" initials (white, bold, centered)
- Output: `public/icons/apple-touch-icon.png` (PNG)

**Metadata update in** `src/app/metadata.ts`:
```typescript
icons: {
  icon: withBasePath('/icons/favicon.ico'),
  apple: withBasePath('/icons/apple-touch-icon.png'),
},
```

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `public/robots.txt` | Edit | Fix sitemap URL domain |
| `src/content/site.json` | Edit | Fix ogImage path to include basePath |
| `scripts/generate-images.js` | Create | Image generation script (OG, avatar, apple-touch-icon) |
| `public/images/og-image.jpg` | Create | Generated OG image |
| `public/images/profile/avatar.jpg` | Create | Generated initials avatar |
| `public/icons/apple-touch-icon.png` | Create | Generated touch icon |
| `src/components/layout/json-ld.tsx` | Edit | Add image null-checks |
| `src/app/metadata.ts` | Edit | Add apple-touch-icon reference |

## Testing

- **robots.txt:** Verify content matches expected URL
- **OG image URL:** Verify `site.json` ogImage path resolves correctly with metadataBase (should produce `https://DMY-cmyk.github.io/Proffesional_Portfolio/images/og-image.jpg`)
- **OG image file:** Verify file exists and is valid JPEG at 1200×630
- **Avatar:** Verify file exists and is valid JPEG at 400×400
- **JSON-LD (new test):** Unit test verifying that JSON-LD omits the `image` field when `profile.avatar` is empty/null, and includes it when set
- **Metadata:** Run existing tests, verify apple-touch-icon link renders
- **Build:** `npm run build` succeeds with all changes
- **Existing tests:** All 148 tests continue to pass

## Out of Scope

- Real profile photo (Sub-project 2 — Content & Data)
- Dynamic OG image generation via `next/og` (over-engineered for static export)
- Full favicon set (favicon-32x32, favicon-16x16, manifest.json) — not needed for MVP
- `alumniOf` structured data in JSON-LD — deferred to Sub-project 2 (Content & Data)
- SEO content optimization (keywords, meta descriptions) — separate concern

## Dependencies

- `sharp` npm package (dev dependency) for image generation — prebuilt native binaries, no manual compilation needed
- Already commonly used in Next.js ecosystems
