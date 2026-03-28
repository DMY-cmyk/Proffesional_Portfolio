# Section Redesigns — Design Spec

**Date:** 2026-03-28
**Status:** Draft
**Phase:** 3 of 5
**Depends on:** Phase 2 (accent token system)

## Problem

All homepage sections are functional but lack visual polish that would push the portfolio to Awwwards-level quality. Specific gaps:
- Hero CTAs lack directional icons; shimmer is static
- Profile section is text-only with no visual metrics
- Timeline has no type differentiation (education vs work), no connector lines, no location display
- Skills bars lack labels; subsections are visually inconsistent
- Contact form has minimal validation and no input persistence

## Design

### 1. Hero Section upgrades (hero-section.tsx)

#### 1a. CTA arrow icons
Add arrow SVG icons to both CTA buttons:

```tsx
<Button href="#about" variant="primary">
  See my work
  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</Button>

<Button href="#about" variant="outline">
  About me
  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
</Button>
```

The Button component may need a small update to accept `children` that include icons alongside text.

#### 1b. Scroll-reactive shimmer
Make the hero title gradient shimmer respond to scroll position. As the user scrolls, the shimmer brightens and accelerates:

```tsx
const { scrollProgress } = useScrollProgress()
const shimmerIntensity = 1 + scrollProgress * 2 // 1x → 3x brightness

// Apply via inline style on the gradient text span:
<span
  className="hero-gradient-text"
  style={{
    filter: `brightness(${shimmerIntensity})`,
    animationDuration: `${Math.max(2, 6 - scrollProgress * 4)}s`,
  }}
>
  {profile.title}
</span>
```

#### 1c. Avatar parallax
Add subtle parallax movement to the avatar on scroll:

```tsx
const y = useTransform(scrollYProgress, [0, 1], [0, -40])
// scrollYProgress from the hero section ref, not full page

<motion.div style={{ y }} className="relative">
  <AvatarWithGlow ... />
</motion.div>
```

#### 1d. Theme-aware avatar glow
Increase glow intensity in light mode where the effect is harder to see:

```css
/* globals.css */
.animate-avatar-glow {
  animation: avatar-glow 4s ease-in-out infinite;
}

:root .animate-avatar-glow {
  filter: drop-shadow(0 0 20px var(--accent-glow));
}
.dark .animate-avatar-glow {
  filter: drop-shadow(0 0 12px var(--accent-glow));
}
```

### 2. Profile Section upgrades (profile-section.tsx)

#### 2a. Animated metric callouts
Add a row of metric cards between the bio and blockquote. Counts are derived dynamically from content data:

```tsx
import { getExperience, getCertifications, getResearchArticles } from '@/data/content'

const metrics = [
  {
    value: getExperience().length,
    suffix: '+',
    label: 'Professional Roles',
  },
  {
    value: getCertifications().length,
    label: 'Certifications',
  },
  {
    value: getResearchArticles().length,
    label: 'Research Papers',
  },
]
```

Each metric renders as a card with a count-up animation:

```tsx
function MetricCard({ value, suffix = '', label }: MetricProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = (timestamp: number) => {
      start = start || timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center"
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
    >
      <div className="text-3xl font-bold text-[var(--accent-400)]">
        {count}{suffix}
      </div>
      <div className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</div>
    </motion.div>
  )
}
```

Layout: 3-column grid below bio paragraph, above blockquote.

#### 2b. Decorative quote marks
Add large SVG quote marks to the blockquote:

```tsx
<blockquote className="relative border-l-4 border-[var(--accent-400)] pl-6 py-2">
  <svg
    className="absolute -top-4 -left-2 h-8 w-8 text-[var(--accent-400)] opacity-20"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
  </svg>
  <p className="italic text-[var(--muted-foreground)]">{profile.brandStatement}</p>
</blockquote>
```

### 3. Timeline Section upgrades (timeline-section.tsx + timeline-item.tsx)

#### 3a. Color-coded type badges
Add a `type` prop to TimelineItem and render a colored badge:

```tsx
// In TimelineItem component:
<span className={cn(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  type === 'education'
    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    : 'bg-[var(--accent-glow)] text-[var(--accent-400)]'
)}>
  {type === 'education' ? '🎓' : '💼'}
  {type === 'education' ? 'Education' : 'Work'}
</span>
```

#### 3b. Vertical connector line with milestone dots
Add a vertical line running through all timeline entries with circular dots at each entry:

```tsx
// In TimelineSection, wrap entries in a container with a vertical line:
<div className="relative">
  {/* Vertical connector line */}
  <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />

  {entries.map((entry, i) => (
    <div key={i} className="relative pl-12">
      {/* Milestone dot */}
      <div className={cn(
        'absolute left-2.5 top-6 h-3 w-3 rounded-full border-2 border-[var(--background)]',
        entry.type === 'education' ? 'bg-blue-500' : 'bg-[var(--accent-400)]'
      )} />
      <TimelineItem {...entry} />
    </div>
  ))}
</div>
```

#### 3c. Location display
Add location to each timeline entry. The data already exists in experience.json (`location` field) — surface it in the UI:

```tsx
{entry.location && (
  <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    {entry.location}
  </span>
)}
```

#### 3d. Collapsible bullet lists
For entries with more than 3 bullets, collapse with a "Show more" toggle on mobile:

```tsx
const [expanded, setExpanded] = useState(false)
const visibleItems = expanded ? entry.list : entry.list.slice(0, 3)
const hasMore = entry.list.length > 3

// Render visibleItems in <ul>
{hasMore && (
  <button
    onClick={() => setExpanded(!expanded)}
    className="mt-2 text-sm text-[var(--accent-400)] hover:underline md:hidden"
  >
    {expanded ? 'Show less' : `Show ${entry.list.length - 3} more`}
  </button>
)}
```

The collapse only applies on mobile (`md:hidden`). On desktop, all bullets are always visible.

#### 3e. Type icons
Replace emoji with SVG icons for cleaner rendering:

```tsx
const TypeIcon = ({ type }: { type: 'education' | 'work' }) => (
  type === 'education' ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
)
```

### 4. Skills Section upgrades (skills-section.tsx)

#### 4a. Proficiency tier labels
Add tier labels on the progress bar, derived from the numeric level:

```tsx
function getTier(level: number): string {
  if (level >= 90) return 'Expert'
  if (level >= 70) return 'Advanced'
  if (level >= 50) return 'Intermediate'
  return 'Beginner'
}

// In the skill card, next to the bar:
<div className="flex items-center justify-between text-sm">
  <span className="font-medium">{skill.name}</span>
  <span className="text-xs text-[var(--muted-foreground)]">{getTier(skill.level)}</span>
</div>
<div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
  <motion.div
    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)]"
    initial={{ width: 0 }}
    whileInView={{ width: `${skill.level}%` }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  />
</div>
```

#### 4b. Category icons
Add icons to each category header:

```tsx
const categoryIcons: Record<string, JSX.Element> = {
  Technical: <CodeIcon className="h-5 w-5" />,
  Tools: <WrenchIcon className="h-5 w-5" />,
  'Soft Skills': <UsersIcon className="h-5 w-5" />,
}

// SVG icon components defined inline or extracted to a shared icons file
```

#### 4c. Hover tooltip on skill cards
Show additional context on hover using a simple CSS tooltip:

```tsx
<div className="group relative">
  {/* existing card content */}
  <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-[var(--foreground)] px-2.5 py-1 text-xs text-[var(--background)] opacity-0 transition-opacity group-hover:opacity-100">
    {skill.level}% proficiency
  </div>
</div>
```

#### 4d. Unified card styling
Apply consistent Card component usage across skills, awards, and courses subsections. Currently they use different markup — standardize on the Card component with uniform padding, border, and hover behavior.

### 5. Contact Section upgrades (contact-section.tsx + contact-form.tsx)

#### 5a. Client-side email validation
Add email format validation with visual feedback:

```tsx
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const [emailError, setEmailError] = useState('')

const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  if (e.target.value && !emailRegex.test(e.target.value)) {
    setEmailError('Please enter a valid email address')
  } else {
    setEmailError('')
  }
}

// In JSX:
<input
  type="email"
  onBlur={handleEmailBlur}
  className={cn('...', emailError && 'border-red-500')}
/>
{emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
```

#### 5b. Character count on textarea
Add a live character counter:

```tsx
const MAX_MESSAGE_LENGTH = 1000
const [messageLength, setMessageLength] = useState(0)

<textarea
  maxLength={MAX_MESSAGE_LENGTH}
  onChange={(e) => setMessageLength(e.target.value.length)}
/>
<div className="mt-1 text-right text-xs text-[var(--muted-foreground)]">
  {messageLength}/{MAX_MESSAGE_LENGTH}
</div>
```

#### 5c. Move Web3Forms key to environment variable
Move the hardcoded access key to `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_WEB3FORMS_KEY=your-key-here
```

```tsx
// In contact-form.tsx:
<input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY} />
```

Add `.env.local` to `.gitignore` if not already present. Add `.env.example` with a placeholder.

#### 5d. Form input persistence via sessionStorage
Save form values to sessionStorage on change, restore on mount:

```tsx
useEffect(() => {
  const saved = sessionStorage.getItem('contact-form')
  if (saved) {
    const data = JSON.parse(saved)
    // Populate form fields from data
  }
}, [])

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const form = e.target.form
  if (!form) return
  const data = Object.fromEntries(new FormData(form))
  sessionStorage.setItem('contact-form', JSON.stringify(data))
}
```

Clear sessionStorage on successful submission.

## Files Changed

| File | Change |
|------|--------|
| `src/components/sections/hero-section.tsx` | CTA icons, scroll shimmer, avatar parallax, glow |
| `src/components/sections/profile-section.tsx` | Metric callouts, decorative quotes |
| `src/components/sections/timeline-section.tsx` | Connector line, milestone dots, layout |
| `src/components/ui/timeline-item.tsx` | Type badge, icon, location, collapsible |
| `src/components/sections/skills-section.tsx` | Tier labels, category icons, tooltips, unified cards |
| `src/components/sections/contact-section.tsx` | Minor layout adjustments |
| `src/components/ui/contact-form.tsx` | Email validation, char count, env var, persistence |
| `src/styles/globals.css` | Theme-aware avatar glow |
| `src/data/content.ts` | Expose getResearchArticles for metric count |
| `.env.local` | NEW — Web3Forms key |
| `.env.example` | NEW — placeholder |

## Test Impact

- `tests/components/sections/hero-section.test.tsx` — Add assertions for CTA icons, parallax wrapper.
- `tests/components/sections/profile-section.test.tsx` — Add assertions for metric cards, quote marks.
- `tests/components/sections/timeline-section.test.tsx` — Update for connector line, badges, location.
- `tests/components/ui/timeline-item.test.tsx` — Add type badge, collapsible behavior tests.
- `tests/components/sections/skills-section.test.tsx` — Add tier label assertions, tooltip tests.
- `tests/components/sections/contact-section.test.tsx` — Add email validation, char count tests.
- Mock `sessionStorage` in contact form tests.

## Verification

```bash
npm run test:run
npm run build
```

Visual verification per section on both light/dark themes with all 3 accent colors.
