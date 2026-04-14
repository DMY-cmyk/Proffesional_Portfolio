# Dzaki Muhammad Yusfian — Professional Portfolio

> Accounting · Finance · Tax · Audit — early-career researcher on sustainability reporting and firm value.

🌐 **Live:** [https://DMY-cmyk.github.io/Proffesional_Portfolio](https://DMY-cmyk.github.io/Proffesional_Portfolio)

A research-journal-inspired professional portfolio built with Next.js 15, Tailwind CSS 4, and Framer Motion. Features a cool cream paper visual system, Newsreader serif editorial typography, and a deep teal + muted gold palette — designed for clarity and academic credibility with static GitHub Pages deployment.

## ✨ Features

- **7 Homepage Sections** — Hero → Research → Experience → Education → Credentials → Skills → Contact, in editorial reading order
- **Visual System** — Cool cream paper background (`#fbf9f4`), deep teal primary (`#0d4f5c`), muted gold highlight (`#b8944a`) — restrained motion, no ambient decoration
- **Editorial Typography** — Newsreader (display/serif), Inter (body), JetBrains Mono (labels/mono) triple-font system
- **Research Pages** — MDX-powered research articles at `/research` and `/research/[slug]` with featured-thesis card on the homepage
- **Certification Detail** — Individual certification pages at `/certifications/[slug]` with document viewer
- **Personal Page** — `/personal` route for personal social links (Instagram, TikTok) kept separate from the professional surface
- **Persistent CV Button** — "↓ CV" download button always visible in the navbar
- **Tag-Cloud Skills** — Skill tags with context labels replacing percentage-based progress bars
- **Full SEO** — Open Graph image, Twitter Cards, JSON-LD structured data, dynamic sitemap, robots config, apple-touch-icon
- **Accessibility** — Skip-to-content link, focus ring on teal, reduced-motion support, semantic HTML, ARIA labels
- **Print Stylesheet** — CV-like print output for direct browser printing
- **Contact Form** — Web3Forms-powered contact form (no backend needed) with validation and success states
- **Loading Skeletons** — Shimmer skeleton screens for dynamic routes and lazy-loaded homepage sections
- **Lazy Loading** — Below-fold homepage sections loaded on demand via `next/dynamic` with skeleton fallbacks
- **Performance Optimizations** — Preconnect/preload hints, throttled event handlers, adaptive rendering based on device capability
- **Error Handling** — Custom 404 page and error boundary
- **GitHub Pages basePath** — `withBasePath()` utility ensures all asset paths work under `/Proffesional_Portfolio`
- **CI/CD** — GitHub Actions workflow with tests → build → deploy to GitHub Pages

## 🎨 Design Philosophy

- **Research-Journal Aesthetic** — The layout draws from academic journal conventions: Newsreader serif for display headings lends editorial gravitas, generous whitespace and a cool cream paper ground (`#fbf9f4`) create a reading-first experience
- **Restrained Palette** — Deep teal (`#0d4f5c`) as the primary action color and muted gold (`#b8944a`) as a highlight accent replace high-contrast neon; every color has a semantic role
- **Information Architecture** — Homepage sections follow a logical reading path: Hero → Research → Experience → Education → Credentials → Skills → Contact, mirroring a CV structure the reader already knows
- **Professional / Personal Separation** — Instagram and TikTok are intentionally moved to `/personal`, keeping the main portfolio surface focused on professional credibility
- **Accessibility First** — Skip-link, teal focus ring, and reduced-motion support are built in, not bolted on; the print stylesheet makes the portfolio directly printable as a CV
- **WCAG Contrast** — All text meets WCAG AA (4.5:1+). Teal and gold are chosen for sufficient contrast ratios on the cream paper ground

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Static Export) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first `@theme` config) |
| Typography | [Newsreader](https://fonts.google.com/specimen/Newsreader) + [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| Animation | [Framer Motion](https://motion.dev/) |
| MDX | [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) + [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) |
| Deployment | [GitHub Pages](https://pages.github.com/) via [GitHub Actions](https://github.com/features/actions) |
| Language | TypeScript 5 |

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (pages, layouts, sitemap)
│   ├── research/     # /research list + /research/[slug] detail
│   ├── certifications/ # /certifications/[slug] detail
│   └── personal/     # /personal social links page
├── components/
│   ├── layout/       # Navbar (with CV button), Footer, SectionWrapper, JsonLd
│   ├── motion/       # ScrollReveal, PageTransition
│   ├── sections/     # Hero, Research, Experience, Education, Credentials, Skills, Contact
│   └── ui/           # Button, Card, Badge, Skeleton, ContactForm, SectionHeading, SectionDivider, ThemeToggle, TimelineItem
├── config/           # Performance configuration
├── content/          # JSON data files + MDX research articles
├── data/             # Typed content loader functions
├── hooks/            # useTheme, useReducedMotion
├── lib/              # MDX utilities, basePath helper
├── styles/           # Tailwind CSS 4 global theme tokens + print stylesheet
├── types/            # TypeScript interfaces
└── utils/            # Format helpers
tests/                # 170 tests across 39+ test files (mirrors src/ structure)
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
| `contact.json` | Email, LinkedIn, GitHub |
| `experience.json` | Work experience timeline |
| `education.json` | Education timeline |
| `certifications.json` | Certifications grid |
| `skills.json` | Skill categories with context labels |
| `awards.json` | Awards list |
| `courses.json` | Courses list |
| `downloads.json` | Downloadable files (CV, portfolio) |
| `research/*.mdx` | Research articles (MDX with frontmatter) |

### Theme Colors

The visual system is defined in `src/styles/globals.css` using CSS custom properties:

- **Background:** `#fbf9f4` (cool cream paper)
- **Primary:** `#0d4f5c` (deep teal) — actions, links, focus rings
- **Highlight:** `#b8944a` (muted gold) — accents, borders, tag labels
- **Body Text:** high-contrast dark on cream, WCAG AA compliant
- **Print:** dedicated `@media print` stylesheet for CV-like output

## 🧪 Testing

```bash
npm run test:run
```

- **170 tests** across **39+ test files**
- Vitest + React Testing Library + jsdom
- Components, hooks, utilities, pages, and content loaders are all tested

## 📦 Deployment

The site auto-deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`:

1. **Checkout** → **Install deps** → **Run tests** → **Build** → **Upload artifact** → **Deploy**

To enable deployment:
1. Go to **Repository Settings → Pages → Source** → Select **GitHub Actions**
2. Push to `main` branch — deployment triggers automatically

## 📋 Changelog

### Phase 2 — Research Journal Redesign (2026-04-14)

Full visual and information-architecture overhaul replacing the dark glass-morphism system with a research-journal aesthetic:

- **New visual system** — Cool cream paper ground (`#fbf9f4`), deep teal primary (`#0d4f5c`), muted gold highlight (`#b8944a`); light mode default, dark mode preserved as a toggle
- **Typography swap** — Newsreader serif replaces the previous display font; Inter body and JetBrains Mono labels retained
- **Homepage IA reordered** — Seven sections in CV-logical order: Hero → Research → Experience → Education → Credentials → Skills → Contact
- **New routes** — `/research` list, `/research/[slug]` detail, `/certifications/[slug]` detail, `/personal` page
- **Persistent CV button** — "↓ CV" download always visible in the navbar
- **Tag-cloud skills** — Skill tags with context labels replace percentage-based animated progress bars
- **Featured-thesis card** — Dedicated card for the primary research thesis on the homepage Research section
- **Personal page** — Instagram and TikTok moved to `/personal`, removed from the professional-surface navbar and contact section
- **Print stylesheet** — `@media print` CSS produces a clean CV-like printout directly from the browser
- **Removed** — Canvas aurora background, custom cursor, particle effects, name shimmer, avatar glow, skill-bar percentages, Instagram/TikTok from professional nav/contact

### Phase 1 — Performance Foundation (2026-03-28)

5-task performance optimization pass reducing initial bundle size and CPU usage:

- **Lazy-loaded homepage sections** — 5 below-fold sections converted to `next/dynamic` imports with skeleton loading fallbacks; `HeroSection` stays static (above-the-fold)
- **Throttled canvas event handlers** — Mousemove and scroll event handlers throttled at 16ms (~60fps); `scrollHeight` cached instead of read every animation frame
- **Adaptive rendering** — Replaced hardcoded particle counts with capability-based values (mobile/tablet/desktop) based on `navigator.hardwareConcurrency` and `window.innerWidth`
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
- Added touch feedback to Card component (active:scale press effect)
- Added skeleton-shimmer animation and tap highlight CSS

**Sub-project 4 — P2 New Features**
- Converted skills section from badge list to grid cards
- Added Web3Forms-powered contact form with validation and success states

**Sub-project 5 — Accessibility**
- Added global `focus-visible` outline for all interactive elements
- Added skip-to-content link for keyboard navigation
- Added aria-label to navbar logo link
- Added main content landmark id

### Dark Mode Visibility Fix (2026-03-25)

Fixed 6 dark mode visibility issues across 5 files:

- **Border token contrast** — `--border` upgraded from `#1e1e28` (~1.2:1) to `#27272a` (~2.2:1), fixing section dividers, timeline lines, and mobile menu borders
- **Hero CTA button** — Removed `dark:text-white`; black on gold gives ~8.5:1 contrast (WCAG AAA) in both modes
- **Card borders** — Removed `dark:border-white/[0.06]` override; `border-border` token now applies consistently
- **Navbar border** — Removed `dark:border-white/10` override; `border-border` token now applies consistently
- **Research prose** — `prose-invert` → `dark:prose-invert` (conditional); prose links use unified text-accent class

### Light Mode Contrast Compliance (2026-03-24)

WCAG AA-compliant light mode overhaul:

- **Theme tokens** — Warm ivory background, muted text (9.2:1), accessible borders
- **Accent system** — Dual-mode accent utility ensuring readability in both light and dark contexts
- **Component updates** — All sections, cards, badges, and navigation updated for proper contrast

## 📝 License

ISC © [Dzaki Muhammad Yusfian](https://github.com/DMY-cmyk)
