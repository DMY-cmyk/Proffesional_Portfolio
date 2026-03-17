# Professional Portfolio — Design Specification

**Date**: 2026-03-17
**Status**: Approved
**Author**: Brainstorming session (Copilot + Dzaki)

---

## 1. Product Vision

A premium, dark-themed personal portfolio website for an accounting, tax, audit, and finance professional. The site positions the owner as a credible, polished professional to recruiters, HR teams, and hiring managers.

The portfolio must feel alive and memorable — aurora-like animated backgrounds, a custom cursor trail, and tasteful micro-interactions — while remaining recruiter-friendly, fast, and accessible. Content is owner-managed through structured local files in the codebase, deployed automatically via GitHub Pages.

**Core principles:**
- Elegant, modern, and professional
- Minimal and focused — no unnecessary features
- Readable, credible, responsive, accessible, and performant
- Easy to update by the portfolio owner

---

## 2. Target Audience

- HR teams and recruiters
- Hiring managers
- Professional contacts and networking connections

The design must prioritize clarity, credibility, and quick access to key information (qualifications, experience, downloadable documents).

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (static export) | Component-based, excellent DX, `output: 'export'` for GitHub Pages |
| Styling | Tailwind CSS 4 | Utility-first, dark theme tokens, responsive utilities |
| Animations | Framer Motion | Declarative React animations, scroll triggers, layout animations |
| Background FX | HTML Canvas / WebGL | Aurora wave effect, performant rendering |
| Content | JSON + MDX (build-time) | Structured data + rich text for research pages |
| Language | TypeScript | Type-safe content models, better DX |
| Deployment | GitHub Actions → GitHub Pages | Automated builds on push to main |
| i18n | next-intl (prepared) | Language switching architecture ready, English first |

---

## 4. Visual Direction

**Theme**: Dark premium
- Dark backgrounds (#0a0a0f to #111118 range)
- Gold accent (#d4af37 primary, #b8941f secondary)
- White text with opacity variations for hierarchy
- Light mode variant: white/light gray backgrounds, navy/dark text, gold accents preserved

**Typography**: Modern, professional sans-serif (Inter or similar). Self-hosted, `font-display: swap`.

**Dark/Light mode**: Smooth toggle. Dark is default. User preference persisted in localStorage.

---

## 5. Page Structure

Hybrid architecture: single-page scrolling main site with dedicated sub-pages.

### Routes

```
/ (Home — single-page scroll)
├── #hero           — Centered hero with name, title, aurora background
├── #about          — Professional summary + branding statement
├── #experience     — Education & work experience timeline
├── #certifications — Certification cards with document links
├── #skills         — Categorized skills, awards, courses grid
├── #contact        — Contact links + download buttons

/research           — Research listing page
/research/[slug]    — Individual research detail (MDX rendered)

/certifications/[slug] — Certification detail with document viewer
```

### Navigation

- Fixed top navbar with smooth-scroll links for main sections
- Active section highlighted via scroll spy
- Links to sub-pages (Research, Certification details)
- Mobile: hamburger menu with slide-in panel
- Theme toggle and language toggle (when second language added) in navbar

### User Flow (Recruiter Path)

1. Land on hero → immediately understand who the person is
2. Scroll through profile → read professional summary
3. Scan education/experience timeline → verify background
4. View certifications → click to open supporting documents
5. Check skills grid → see competencies at a glance
6. Reach contact section → download CV/PPT, click LinkedIn/email

---

## 6. Content Model

All portfolio data lives in `src/content/` as typed JSON files. Research content uses MDX for rich formatting. TypeScript interfaces in `src/types/content.ts` enforce the schema at build time.

### Content Files

| File | Purpose | Format |
|------|---------|--------|
| `profile.json` | Name, title, bio, branding statement, avatar | JSON |
| `education.json` | Education entries (school, degree, dates, details) | JSON |
| `experience.json` | Work/internship entries (company, role, dates, bullets) | JSON |
| `certifications.json` | Certifications (name, issuer, date, document path, slug) | JSON |
| `skills.json` | Categorized skills (technical, tools, soft skills) | JSON |
| `awards.json` | Awards and achievements | JSON |
| `courses.json` | Courses and training completed | JSON |
| `contact.json` | Social links (email, LinkedIn, IG, TikTok, GitHub) | JSON |
| `downloads.json` | Downloadable files config (CV path, PPT path, labels) | JSON |
| `site.json` | Site metadata (title, description, OG tags) | JSON |
| `research/index.json` | Research entries list (title, slug, abstract, tags) | JSON |
| `research/*.mdx` | Rich content for each research piece | MDX |

### Example Schemas

**profile.json:**
```json
{
  "name": "Muhammad Dzaki",
  "title": "Accounting & Finance Professional",
  "tagline": "Specializing in Tax, Audit, and Financial Analysis",
  "bio": "A dedicated professional with...",
  "brandStatement": "Transforming financial complexity into clarity.",
  "avatar": "/images/profile/avatar.jpg"
}
```

**certifications.json entry:**
```json
{
  "name": "Certified Public Accountant",
  "issuer": "Indonesian Institute of CPAs",
  "date": "2025-06",
  "documentPath": "/files/certificates/cpa-certificate.pdf",
  "slug": "cpa"
}
```

**downloads.json:**
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

### i18n Content Strategy (Future)

When a second language is added, content files gain locale suffixes:
- `profile.json` → `profile.en.json`, `profile.id.json`
- Data loaders resolve the correct locale at build time
- MDX research files: `research/thesis-title.en.mdx`, `research/thesis-title.id.mdx`

---

## 7. Component Architecture

### 4 Component Layers

**Layout Components** (`src/components/layout/`):
- `RootLayout` — theme provider, fonts, metadata
- `Navbar` — fixed nav, scroll spy, mobile menu, theme toggle
- `Footer` — social links, copyright
- `SectionWrapper` — scroll-triggered reveal container

**Section Components** (`src/components/sections/`):
- `HeroSection` — centered hero with animated avatar
- `ProfileSection` — bio + brand statement
- `TimelineSection` — education + experience timeline
- `CertificationsSection` — certification cards grid
- `SkillsSection` — categorized skills, awards, courses grid
- `ContactSection` — contact links + download buttons

**UI Components** (`src/components/ui/`) — reusable, content-agnostic:
- `Button` — primary/secondary/ghost variants with press animation
- `Card` — base card with hover glow effect
- `Badge` — skill/tag labels
- `TimelineItem` — single timeline entry with icon and connector
- `SectionHeading` — title + subtitle + gold divider
- `ThemeToggle` — dark/light switch with smooth transition

**Motion Components** (`src/components/motion/`) — animation-only wrappers:
- `AuroraBackground` — Canvas/WebGL aurora wave effect
- `CustomCursor` — trailing ring + dot cursor (desktop only)
- `ScrollReveal` — fade-up + stagger on viewport enter
- `HoverGlow` — card hover gold glow effect
- `PageTransition` — route transition wrapper

### Architecture Rules

- Section components receive typed data from loaders — they render content only
- Motion components wrap UI elements to add effects — no content logic
- UI components are fully reusable and not coupled to specific sections
- Animation logic is separated from content logic at the component level
- Each component has a single responsibility
- Files stay focused and small — split when a file grows beyond ~200 lines

### Data Flow

```
JSON/MDX Files → TypeScript Loader (src/data/) → Section Components → UI Components → Static HTML
```

All content resolves at build time. Zero runtime API calls. Motion components hydrate client-side (`"use client"`).

---

## 8. Animation & Interaction System

### Layer 1: Aurora Background

A slow-drifting, luminous wave effect rendered via HTML Canvas or WebGL. Gold-tinted translucent shapes drift and morph behind all content.

- Renders at device refresh rate, GPU-composited
- Auto-pauses when tab is hidden (visibility API)
- Respects `prefers-reduced-motion` (pauses/hides)
- Subtle enough to not distract from content readability

### Layer 2: Custom Cursor

Desktop-only custom cursor with spring physics.

**Default state**: Outer ring (24px, gold border) + inner dot (6px, gold fill). The ring follows the mouse with a slight spring lag — feels alive and playful.

**Hover state** (over links, buttons, interactive elements): Ring expands to ~40px, fills slightly with gold tint. Signals interactivity.

- Hidden on touch devices (detected via pointer media query)
- Uses Framer Motion `useSpring` for physics
- Respects `prefers-reduced-motion`

### Layer 3: Micro-Interactions

| Element | Effect | Implementation |
|---------|--------|----------------|
| Section enter | Fade up + stagger children | Framer Motion `whileInView` + `staggerChildren` |
| Card hover | Lift (translateY -4px) + gold glow border | Framer Motion `whileHover` |
| Button press | Scale down (0.97) + darken | Framer Motion `whileTap` |
| Nav link hover | Underline slide-in from left | CSS transition |
| Theme toggle | Smooth rotation + color morph | Framer Motion `animate` |
| Page transition | Fade + slight slide | Framer Motion `AnimatePresence` |

### Performance & Accessibility

- All CSS animations use `transform` and `opacity` only (GPU-composited, 60fps)
- Canvas renders at device refresh rate, no layout thrashing
- All animations respect `prefers-reduced-motion`: aurora pauses, cursor hides, reveals become instant
- No animation blocks content visibility or interaction

---

## 9. File & Document Handling

### Directory Structure

```
public/files/
├── cv/                    # ATS-friendly CV (PDF)
├── certificates/          # Certificate PDFs/images
├── research/              # Research paper PDFs
└── presentations/         # PPT/PPTX portfolio files
```

### Update Workflow

1. Replace the file in `public/files/` (e.g., drop new `dzaki-cv.pdf`)
2. If the filename changes, update the path in `downloads.json` or `certifications.json`
3. Commit and push → GitHub Actions rebuilds → new file is live

### Document Viewing

- PDFs: browser-native PDF viewer (link opens in new tab)
- Certificates: displayed in a detail page with metadata + embedded PDF viewer
- Research papers: MDX content page with optional PDF download link

---

## 10. Owner-Only Editing Strategy

Content updates happen exclusively through git:

1. Edit a JSON file (e.g., add a new certification to `certifications.json`)
2. Place any new files in `public/files/`
3. `git add . && git commit && git push`
4. GitHub Actions auto-builds and deploys

**Security model**: Only someone with write access to the GitHub repository can modify content. No public-facing CMS, admin panel, or authentication system. GitHub branch protection can add an extra approval layer if desired.

---

## 11. Deployment Strategy

### GitHub Actions Pipeline

```yaml
# .github/workflows/deploy.yml
trigger: push to main
steps:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies (npm ci)
  4. Build (next build → static export)
  5. Deploy to GitHub Pages
```

### Next.js Configuration

- `output: 'export'` — full static generation
- `images.unoptimized: true` — required for static export
- `basePath` configured if using project-site URL (username.github.io/repo)

### Custom Domain

- CNAME file in `public/` for custom domain support
- HTTPS provided by GitHub Pages

---

## 12. Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| JS Bundle (gzipped) | < 200KB |
| Time to Interactive | < 3s |

### Optimizations

- Self-hosted fonts with `font-display: swap`
- Static image optimization (WebP format, sized appropriately)
- Code splitting per route (Next.js automatic)
- Canvas animation lazy-loaded, deferred to after first paint
- Minimal third-party dependencies

---

## 13. SEO & Social Sharing

- Open Graph meta tags (critical for LinkedIn sharing by recruiters)
- Twitter Card meta tags
- JSON-LD structured data for professional profile
- Auto-generated sitemap
- `robots.txt` in public/
- Descriptive page titles and meta descriptions per route

---

## 14. Folder Structure

```
Proffesional_Portfolio/
├── docs/
│   └── superpowers/
│       └── specs/                     # Design specifications
├── public/
│   ├── files/
│   │   ├── cv/                        # ATS CV (PDF), PPT/PPTX files
│   │   ├── certificates/              # Certificate PDFs/images
│   │   ├── research/                  # Research paper PDFs
│   │   └── presentations/             # PPT/PPTX portfolio files
│   ├── images/
│   │   ├── profile/                   # Avatar, professional photos
│   │   ├── projects/                  # Project screenshots
│   │   └── backgrounds/               # Static fallback images
│   └── icons/                         # Favicon, app icons
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home (single-page scroll)
│   │   ├── research/
│   │   │   ├── page.tsx               # Research listing
│   │   │   └── [slug]/page.tsx        # Research detail
│   │   └── certifications/
│   │       └── [slug]/page.tsx        # Cert detail
│   ├── components/
│   │   ├── layout/                    # Navbar, Footer, SectionWrapper
│   │   ├── sections/                  # HeroSection, ProfileSection, etc.
│   │   ├── ui/                        # Button, Card, Badge, etc.
│   │   ├── motion/                    # AuroraBackground, CustomCursor, etc.
│   │   └── navigation/               # NavLinks, MobileMenu, ScrollSpy
│   ├── content/                       # JSON + MDX content files
│   │   ├── profile.json
│   │   ├── education.json
│   │   ├── experience.json
│   │   ├── certifications.json
│   │   ├── skills.json
│   │   ├── awards.json
│   │   ├── courses.json
│   │   ├── contact.json
│   │   ├── downloads.json
│   │   ├── site.json
│   │   └── research/                  # MDX files for research
│   ├── data/                          # Content loaders (read + validate JSON)
│   ├── hooks/                         # useScrollSpy, useTheme, useReducedMotion
│   ├── lib/                           # MDX renderer, i18n setup
│   ├── styles/                        # globals.css, theme tokens
│   ├── types/                         # TypeScript content interfaces
│   ├── utils/                         # formatDate, cn(), etc.
│   └── config/                        # Site config, nav items, theme config
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions → Pages deploy
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 15. Implementation Roadmap

### Phase 1: Foundation
- Initialize Next.js project with TypeScript, Tailwind CSS
- Set up folder structure and configuration
- Create TypeScript content type definitions
- Build content loaders (JSON reader + validator)
- Set up Tailwind theme tokens (dark/light, gold accents)

### Phase 2: Layout & Navigation
- Build RootLayout with theme provider
- Build Navbar with scroll spy and mobile menu
- Build Footer component
- Implement dark/light theme toggle with localStorage persistence
- Build SectionWrapper with scroll-triggered reveal

### Phase 3: Core Sections
- Build HeroSection (centered layout, animated avatar)
- Build ProfileSection (bio, brand statement)
- Build TimelineSection (education + experience)
- Build CertificationsSection (cards grid)
- Build SkillsSection (categorized grid with awards + courses)
- Build ContactSection (social links + download buttons)

### Phase 4: Animation Layer
- Implement AuroraBackground (Canvas/WebGL)
- Implement CustomCursor (spring physics, hover states)
- Add ScrollReveal animations to all sections
- Add card hover glow and button press effects
- Implement page transitions
- Ensure prefers-reduced-motion support

### Phase 5: Sub-Pages
- Build research listing page
- Build research detail page (MDX rendering)
- Build certification detail page (document viewer)
- Wire up navigation to sub-pages

### Phase 6: Polish & Deploy
- Populate placeholder content in JSON files
- Add SEO meta tags, Open Graph, JSON-LD
- Optimize images, fonts, bundle size
- Set up GitHub Actions deployment workflow
- Lighthouse audit and performance optimization
- Add .gitignore entries for .superpowers/ and other generated files
- Final testing across devices and browsers
