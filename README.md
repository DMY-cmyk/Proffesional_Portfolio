# Dzaki Muhammad Yusfian — Professional Portfolio

> Accounting & Finance Professional | Specializing in Tax, Audit, and Financial Analysis

🌐 **Live:** [https://DMY-cmyk.github.io/Proffesional_Portfolio](https://DMY-cmyk.github.io/Proffesional_Portfolio)

A bold, editorial-quality professional portfolio website built with Next.js 15, Tailwind CSS 4, and Framer Motion. Features glass-morphism UI, triple-font typography, cursor-reactive effects, and a gold-accented dark/light theme — designed for Awwwards-level visual impact with static GitHub Pages deployment.

## ✨ Features

- **Dark/Light Theme** — System preference detection with localStorage persistence and flash prevention
- **6 Homepage Sections** — Cinematic hero, editorial profile, timeline, certifications, skills, contact
- **Glass-Morphism UI** — Translucent cards with backdrop blur, cursor-reactive gold glow, floating glass pill navbar
- **Editorial Typography** — Instrument Serif (display), Inter (body), JetBrains Mono (labels) triple-font system
- **Animation Layer** — Aurora canvas background, custom cursor with spring physics, scroll reveal, blur page transitions, avatar glow, scroll hints
- **Micro-interactions** — Animated link underlines, button hover shine, badge shimmer, cursor-tracking card glow
- **Visual Rhythm** — Monospace-numbered section headings, gradient dividers, grain texture overlay
- **Research Pages** — MDX-powered research articles with dynamic routing
- **Certification Detail** — Individual certification pages with document viewer
- **Full SEO** — Open Graph, Twitter Cards, JSON-LD structured data, dynamic sitemap, robots config
- **Accessibility** — Reduced motion support (`prefers-reduced-motion`), semantic HTML, ARIA labels
- **Error Handling** — Custom 404 page and error boundary
- **GitHub Pages basePath** — `withBasePath()` utility ensures all asset paths work under `/Proffesional_Portfolio`
- **CI/CD** — GitHub Actions workflow with tests → build → deploy to GitHub Pages

## 🎨 Design Philosophy

- **Editorial Typography** — A triple-font system creates typographic hierarchy: Instrument Serif for display headings brings editorial gravitas, Inter for body text ensures readability, and JetBrains Mono for section numbers and labels adds technical precision
- **Glass-Morphism & Depth** — Translucent cards with backdrop blur, cursor-reactive gold radial glow, and a floating navbar create layered depth instead of flat surfaces
- **Analog Warmth** — SVG noise grain texture overlay, warm ivory light mode (`#faf9f7`), and deep dark mode with subtle surface layering give the site a tactile, analog feel
- **Cinematic Layout** — Asymmetric hero grid, left-aligned editorial section headings with monospace numbering (`01`, `02`...), and gradient dividers break the grid monotony
- **Micro-interactions** — Animated link underlines, button hover shine effects, badge shimmer animations, scroll hints, and pulsing avatar glow — subtle details that reward exploration
- **Gold Accent System** — `#d4af37` threads through headings, hover states, cursor glows, section numbers, and interactive elements as the unifying accent color

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
│   └── ui/           # Button, Card, Badge, SectionHeading, SectionDivider, TimelineItem
├── config/           # Performance configuration
├── content/          # JSON data files + MDX research articles
├── data/             # Typed content loader functions
├── hooks/            # useTheme, useReducedMotion
├── lib/              # MDX utilities, basePath helper
├── styles/           # Tailwind CSS 4 global theme tokens
├── types/            # TypeScript interfaces
└── utils/            # Format helpers
tests/                # 37 test files, 148 tests (mirrors src/ structure)
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
| `skills.json` | Skill categories and items |
| `awards.json` | Awards list |
| `courses.json` | Courses list |
| `downloads.json` | Downloadable files (CV, portfolio) |
| `research/*.mdx` | Research articles (MDX with frontmatter) |

### Theme Colors

The gold-accented theme is defined in `src/styles/globals.css` using CSS custom properties:

- **Primary Accent:** `#d4af37` (Gold 500)
- **Light Mode:** Warm ivory (`#faf9f7`) backgrounds with white cards and subtle shadows
- **Dark Mode:** Deep dark (`#09090b`) with glass-morphism cards (`bg-white/[0.03] backdrop-blur-xl`)
- **Grain Overlay:** SVG noise texture on `body::after` with theme-adaptive opacity

## 🧪 Testing

```bash
npm run test:run
```

- **148 tests** across **37 test files**
- Vitest + React Testing Library + jsdom
- Components, hooks, utilities, pages, and content loaders are all tested

## 📦 Deployment

The site auto-deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`:

1. **Checkout** → **Install deps** → **Run tests** → **Build** → **Upload artifact** → **Deploy**

To enable deployment:
1. Go to **Repository Settings → Pages → Source** → Select **GitHub Actions**
2. Push to `main` branch — deployment triggers automatically

## 📝 License

ISC © [Dzaki Muhammad Yusfian](https://github.com/DMY-cmyk)
