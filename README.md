# Dzaki Muhammad Yusfian — Professional Portfolio

> Accounting & Finance Professional | Specializing in Tax, Audit, and Financial Analysis

🌐 **Live:** [https://DMY-cmyk.github.io/Proffesional_Portfolio](https://DMY-cmyk.github.io/Proffesional_Portfolio)

A modern, responsive professional portfolio website built with Next.js 15, Tailwind CSS 4, and Framer Motion. Features a gold-accented dark/light theme, animated canvas background, and static export for GitHub Pages deployment.

## ✨ Features

- **Dark/Light Theme** — System preference detection with localStorage persistence and flash prevention
- **6 Homepage Sections** — Hero, Profile, Timeline (Experience & Education), Certifications, Skills, Contact
- **Animation Layer** — Aurora canvas background, custom cursor with spring physics, scroll reveal, hover glow, page transitions
- **Research Pages** — MDX-powered research articles with dynamic routing
- **Certification Detail** — Individual certification pages with document viewer
- **Full SEO** — Open Graph, Twitter Cards, JSON-LD structured data, dynamic sitemap, robots config
- **Accessibility** — Reduced motion support (`prefers-reduced-motion`), semantic HTML, ARIA labels
- **Error Handling** — Custom 404 page and error boundary
- **CI/CD** — GitHub Actions workflow with tests → build → deploy to GitHub Pages

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Static Export) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first `@theme` config) |
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
│   └── ui/           # Button, Card, Badge, SectionHeading, TimelineItem
├── config/           # Performance configuration
├── content/          # JSON data files + MDX research articles
├── data/             # Typed content loader functions
├── hooks/            # useTheme, useReducedMotion
├── lib/              # MDX utilities
├── styles/           # Tailwind CSS 4 global theme tokens
├── types/            # TypeScript interfaces
└── utils/            # Format helpers
tests/                # 35 test files, 126 tests (mirrors src/ structure)
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
- **Light Mode:** Light backgrounds with dark text
- **Dark Mode:** Deep dark backgrounds with light text

## 🧪 Testing

```bash
npm run test:run
```

- **126 tests** across **35 test files**
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
