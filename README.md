# Dzaki Muhammad Yusfian — Professional Portfolio

> Accounting & Finance Professional | Specializing in Tax, Audit, and Financial Analysis

🌐 **Live:** [https://DMY-cmyk.github.io/Proffesional_Portfolio](https://DMY-cmyk.github.io/Proffesional_Portfolio)

A bold, editorial-quality professional portfolio website built with Next.js 15, Tailwind CSS 4, and Framer Motion. Features glass-morphism UI, triple-font typography, cursor-reactive effects, and a gold-accented dark/light theme — designed for Awwwards-level visual impact with static GitHub Pages deployment.

## ✨ Features

- **Dark/Light Theme** — System preference detection with localStorage persistence and flash prevention
- **6 Homepage Sections** — Cinematic hero, editorial profile, timeline, certifications, skills with animated progress bars, contact with form
- **Glass-Morphism UI** — Translucent cards with backdrop blur, cursor-reactive gold glow, floating glass pill navbar, touch-responsive feedback
- **Editorial Typography** — Instrument Serif (display), Inter (body), JetBrains Mono (labels) triple-font system
- **Animation Layer** — Aurora canvas background, custom cursor with spring physics, scroll reveal, smooth page transitions, avatar glow, scroll hints
- **Micro-interactions** — Animated link underlines, button hover shine, badge shimmer, cursor-tracking card glow
- **Visual Rhythm** — Monospace-numbered section headings, gradient dividers, grain texture overlay
- **Research Pages** — MDX-powered research articles with dynamic routing
- **Certification Detail** — Individual certification pages with document viewer
- **Full SEO** — Open Graph image, Twitter Cards, JSON-LD structured data, dynamic sitemap, robots config, apple-touch-icon
- **Accessibility** — Skip-to-content link, focus-visible outlines, reduced motion support, semantic HTML, ARIA labels
- **Contact Form** — Web3Forms-powered contact form (no backend needed) with validation and success states
- **Skill Progress Bars** — Animated gold gradient bars with Framer Motion scroll-triggered animation
- **Loading Skeletons** — Shimmer skeleton screens for dynamic routes and lazy-loaded homepage sections
- **Lazy Loading** — Below-fold homepage sections loaded on demand via `next/dynamic` with skeleton fallbacks
- **Performance Optimizations** — Preconnect/preload hints, throttled canvas event handlers, adaptive particle count based on device capability
- **Error Handling** — Custom 404 page and error boundary
- **GitHub Pages basePath** — `withBasePath()` utility ensures all asset paths work under `/Proffesional_Portfolio`
- **CI/CD** — GitHub Actions workflow with tests → build → deploy to GitHub Pages

## 🎨 Design Philosophy

- **Editorial Typography** — A triple-font system creates typographic hierarchy: Instrument Serif for display headings brings editorial gravitas, Inter for body text ensures readability, and JetBrains Mono for section numbers and labels adds technical precision
- **Glass-Morphism & Depth** — Translucent cards with backdrop blur, cursor-reactive gold radial glow, and a floating navbar create layered depth instead of flat surfaces
- **Analog Warmth** — SVG noise grain texture overlay, warm ivory light mode (`#faf9f7`), and deep dark mode with subtle surface layering give the site a tactile, analog feel
- **Cinematic Layout** — Asymmetric hero grid, left-aligned editorial section headings with monospace numbering (`01`, `02`...), and gradient dividers break the grid monotony
- **Micro-interactions** — Animated link underlines, button hover shine effects, badge shimmer animations, scroll hints, and pulsing avatar glow — subtle details that reward exploration
- **Gold Accent System** — `#d4af37` threads through decorative fills, borders, cursor glows, and interactive elements as the unifying accent color. In light mode, text uses dark amber (`#78600f`, 7.3:1 contrast) while gold stays decorative; dark mode uses gold directly
- **WCAG Contrast** — All text meets WCAG AA (4.5:1+). Muted text uses warm stone (`#3f3a36`, 9.2:1) in light mode. Dual-mode `.text-gold-accent` utility ensures readability without sacrificing the gold identity

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Static Export) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first `@theme` config) |
| Typography | [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) + [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| Animation | [Framer Motion](https://motion.dev/) + Canvas 2D |
| MDX | [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) + [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Deployment | [GitHub Pages](https://pages.github.com/) via [GitHub Actions](https://github.com/features/actions) |
| Language | TypeScript 5 |

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (pages, layouts, sitemap)
├── components/
│   ├── layout/       # Navbar, Footer, SectionWrapper, JsonLd
│   ├── motion/       # AuroraBackground, CustomCursor, ScrollReveal, HoverGlow, PageTransition
│   ├── sections/     # Hero, Profile, Timeline, Certifications, Skills, Contact
│   └── ui/           # Button, Card, Badge, Skeleton, ContactForm, SectionHeading, SectionDivider, ThemeToggle, TimelineItem
├── config/           # Performance configuration
├── content/          # JSON data files + MDX research articles
├── data/             # Typed content loader functions
├── hooks/            # useTheme, useReducedMotion
├── lib/              # MDX utilities, basePath helper
├── styles/           # Tailwind CSS 4 global theme tokens
├── types/            # TypeScript interfaces
└── utils/            # Format helpers
tests/                # 39 test files, 162 tests (mirrors src/ structure)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/DMY-cmyk/Proffesional_Portfolio.git
cd Proffesional_Portfolio
npm install
```

### Development

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build static export to out/
npm run lint      # Run ESLint
npm run test      # Run tests in watch mode
npm run test:run  # Run tests once (CI)
```

## 🎨 Customization

All content is data-driven via JSON files in `src/content/`:

| File | Controls |
|------|----------|
| `profile.json` | Name, title, tagline, bio, avatar |
| `site.json` | Site title, description, URL, OG image |
| `contact.json` | Email, LinkedIn, GitHub, Instagram, TikTok |
| `experience.json` | Work experience timeline |
| `education.json` | Education timeline |
| `certifications.json` | Certifications grid |
| `skills.json` | Skill categories with proficiency levels |
| `awards.json` | Awards list |
| `courses.json` | Courses list |
| `downloads.json` | Downloadable files (CV, portfolio) |
| `research/*.mdx` | Research articles (MDX with frontmatter) |

### Theme Colors

The gold-accented theme is defined in `src/styles/globals.css` using CSS custom properties:

- **Primary Accent:** `#d4af37` (Gold 500) — decorative fills, borders, backgrounds
- **Light Mode Text Accent:** `#78600f` (Dark Amber) — WCAG AA compliant gold-family text via `.text-gold-accent`
- **Light Mode:** Warm ivory (`#faf9f7`) backgrounds, muted text `#3f3a36`, borders `#c8c2b8`
- **Dark Mode:** Deep dark (`#09090b`) with glass-morphism cards (`bg-white/[0.03] backdrop-blur-xl`)
- **Grain Overlay:** SVG noise texture on `body::after` with theme-adaptive opacity

## 🧪 Testing

```bash
npm run test:run
```

- **162 tests** across **39 test files**
- Vitest + React Testing Library + jsdom
- Components, hooks, utilities, pages, and content loaders are all tested

## 📦 Deployment

The site auto-deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`:

1. **Checkout** → **Install deps** → **Run tests** → **Build** → **Upload artifact** → **Deploy**

To enable deployment:
1. Go to **Repository Settings → Pages → Source** → Select **GitHub Actions**
2. Push to `main` branch — deployment triggers automatically

## 📋 Changelog

### Phase 1 — Performance Foundation (2026-03-28)

5-task performance optimization pass reducing initial bundle size and CPU usage:

- **Lazy-loaded homepage sections** — 5 below-fold sections (`ProfileSection`, `TimelineSection`, `CertificationsSection`, `SkillsSection`, `ContactSection`) converted to `next/dynamic` imports with skeleton loading fallbacks; `HeroSection` stays static (above-the-fold)
- **Throttled Aurora canvas** — Mousemove and scroll event handlers throttled at 16ms (~60fps); `scrollHeight` cached instead of read every animation frame; cache updated on scroll and resize
- **Adaptive particle count** — Replaced hardcoded 80 particles with `getParticleCount()` returning 20 (mobile/low-end), 40 (tablet/mid-range), or 80 (desktop/high-end) based on `navigator.hardwareConcurrency` and `window.innerWidth`
- **Preconnect & preload hints** — Added `<link rel="preconnect">` for Google Fonts domains and `<link rel="preload">` for avatar image (LCP element)
- **Removed blur filter** — Page transitions now use opacity + transform only (no `filter: blur()` compositing)

### Improvement Roadmap (2026-03-26)

Comprehensive 5-phase improvement cycle covering SEO, content, UX, features, and accessibility:

**Sub-project 1 — SEO & Metadata Fixes (P0)**
- Fixed robots.txt sitemap URL (placeholder → real domain)
- Generated branded OG image (1200×630), avatar (400×400), apple-touch-icon (180×180) via Sharp
- Added JSON-LD null-safety guard and proper typing
- Fixed OG image basePath resolution for GitHub Pages
- Added apple-touch-icon to metadata

**Sub-project 2 — Content & Data Cleanup (P0)**
- Replaced all placeholder content with real user data across 7 JSON files
- Added real research article (sustainability reporting & firm value) from skripsi
- Updated contact info, experience (3 positions), education, courses
- Added downloadable CV PDF

**Sub-project 3 — P1 UX Polish**
- Added `width`/`height` to hero avatar to prevent layout shift (CLS)
- Created shimmer skeleton loading screens for research and certification detail pages
- Added touch feedback to Card component (gold overlay + active:scale press effect)
- Added skeleton-shimmer animation and tap highlight CSS

**Sub-project 4 — P2 New Features**
- Converted skills section from badge list to Style B grid cards with animated gold progress bars
- Added proficiency levels to skills data (visual bars only, no percentages shown)
- Added Web3Forms-powered contact form with validation and success states

**Sub-project 5 — Accessibility**
- Added global `focus-visible` gold outline for all interactive elements
- Added skip-to-content link for keyboard navigation
- Added aria-label to navbar logo link
- Added main content landmark id

### Dark Mode Visibility Fix (2026-03-25)

Fixed 6 dark mode visibility issues across 5 files:

- **Border token contrast** — `--border` upgraded from `#1e1e28` (~1.2:1) to `#27272a` (~2.2:1), fixing section dividers, timeline lines, and mobile menu borders
- **Hero CTA button** — Removed `dark:text-white`; black on gold gives ~8.5:1 contrast (WCAG AAA) in both modes
- **Card borders** — Removed `dark:border-white/[0.06]` override; `border-border` token now applies consistently
- **Navbar border** — Removed `dark:border-white/10` override; `border-border` token now applies consistently
- **Research prose** — `prose-invert` → `dark:prose-invert` (conditional); prose links use unified `text-gold-accent` class

### Light Mode Contrast Compliance (2026-03-24)

WCAG AA-compliant light mode overhaul:

- **Theme tokens** — Warm ivory background (`#faf9f7`), muted text `#3f3a36` (9.2:1), borders `#c8c2b8`
- **Gold accent system** — Dual-mode `.text-gold-accent` utility: dark amber `#78600f` (7.3:1) in light mode, gold `#d4af37` in dark mode
- **Component updates** — All sections, cards, badges, and navigation updated for proper contrast

## 📝 License

ISC © [Dzaki Muhammad Yusfian](https://github.com/DMY-cmyk)
