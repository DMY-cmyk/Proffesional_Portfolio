# Phase 4 / Plan 3 — Bilingual EN/ID + Final Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement spec stage 10: a client-side EN ↔ ID language toggle covering the homepage and site chrome, Indonesian translation drafts collected for Dzaki's review, and the final Lighthouse audit against the pinned baseline.

**Architecture:** A `LanguageProvider` mirrors the existing `ThemeProvider` (localStorage, context hook). Content JSON fields that carry user-visible prose become `{ "en": ..., "id": ... }` objects; the typed loaders in `src/data/content.ts` accept a `lang` parameter and resolve them back to plain strings via a `pickLang` helper, so components keep their existing prop shapes. UI chrome strings (nav, buttons, form labels, section headings) move to a `ui-strings.json` dictionary. Sections that display localized prose become client components reading `useLanguage()`. Research/notes article bodies stay English (spec non-goal).

**Tech Stack:** Next.js 15 (App Router, static export), React 19 context, Vitest 4 + RTL. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-06-phase4-full-upgrade-design.md` (stage 10)

## Global Constraints

- **No new runtime dependencies.** Hand-rolled context + JSON dictionaries only.
- **Default language `en`; persisted to localStorage key `lang`; missing ID string falls back to EN — never blank UI.** `document.documentElement.lang` must track the active language.
- **SSR/hydration safety:** the provider must initialize to `'en'` in `useState` and only read localStorage in an effect — the prerendered HTML is English, so the first client render MUST also be English (ID users get a brief EN flash after hydration; that is accepted and documented). Never read localStorage during render.
- **Spec deviation (intentional, document in README):** the spec suggested a pre-hydration script "same technique as theme" to prevent language flash. That works for theme because it only toggles a CSS class; text content is baked into the prerendered HTML, so no script can prevent the flash. No pre-hydration language script.
- **Translation integrity:** Indonesian drafts are written by the implementer from the real English source text — no invented facts, no embellishment. Proper nouns (DJP, STIE YKPN, Kolosal AI, GRI Standards, IDX, course/cert names, place names) stay untranslated. **Every ID string must be logged in `docs/superpowers/specs/2026-08-06-id-translations-review.md` for Dzaki's review; the branch must NOT be merged/deployed before he reviews that file.**
- **MDX article bodies (research + notes) stay English.** Sitemap, metadata, and print stylesheet stay English.
- **Static export must keep working:** `npm run build` green after every task; `withBasePath()` conventions unchanged.
- **Full test suite green before every commit:** `npm run test:run` (64 files / 249 tests at start).
- **Test mechanics:** global matchMedia stub in tests/setup.ts (configurable: true); direct assignment for IntersectionObserver; vi.hoisted + mutable vi.mock over vi.doMock; components using `useLanguage` in tests either wrap in `LanguageProvider` or mock `@/hooks/use-language`.
- Windows/PowerShell; run test/build commands synchronously (never in background).

---

### Task 1: Language core (types, pickLang, provider, hook)

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/hooks/use-language.tsx`
- Modify: `src/app/layout.tsx` (wrap children with `LanguageProvider` directly inside `ThemeProvider`)
- Test: `tests/lib/i18n.test.ts`, `tests/hooks/use-language.test.tsx`

**Interfaces:**
- Consumes: nothing
- Produces (all later tasks depend on these exact names):
  - `type Lang = 'en' | 'id'` and `type LocalizedString = string | { en: string; id?: string }` in `src/lib/i18n.ts`
  - `pickLang(value: LocalizedString, lang: Lang): string` — plain strings pass through; objects return `value[lang] ?? value.en`
  - `pickLangArray(values: LocalizedString[], lang: Lang): string[]`
  - `LanguageProvider`, `useLanguage(): { lang: Lang; setLang: (l: Lang) => void }` in `src/hooks/use-language.tsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/lib/i18n.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { pickLang, pickLangArray } from '@/lib/i18n'

describe('pickLang', () => {
  it('passes plain strings through for any lang', () => {
    expect(pickLang('Hello', 'id')).toBe('Hello')
  })
  it('returns the requested language', () => {
    expect(pickLang({ en: 'Hello', id: 'Halo' }, 'id')).toBe('Halo')
  })
  it('falls back to en when id is missing', () => {
    expect(pickLang({ en: 'Hello' }, 'id')).toBe('Hello')
  })
})

describe('pickLangArray', () => {
  it('resolves each element', () => {
    expect(
      pickLangArray(['plain', { en: 'Two', id: 'Dua' }], 'id')
    ).toEqual(['plain', 'Dua'])
  })
})
```

Create `tests/hooks/use-language.test.tsx`:

```tsx
import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '@/hooks/use-language'

const wrapper = ({ children }: React.PropsWithChildren) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('useLanguage', () => {
  afterEach(() => localStorage.removeItem('lang'))

  it('defaults to en', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.lang).toBe('en')
  })

  it('persists changes and updates the html lang attribute', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => result.current.setLang('id'))
    expect(result.current.lang).toBe('id')
    expect(localStorage.getItem('lang')).toBe('id')
    expect(document.documentElement.lang).toBe('id')
  })

  it('restores a stored language after mount', () => {
    localStorage.setItem('lang', 'id')
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.lang).toBe('id')
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run tests/lib/i18n.test.ts tests/hooks/use-language.test.tsx`
Expected: FAIL — modules do not exist.

- [ ] **Step 3: Implement i18n.ts**

Create `src/lib/i18n.ts`:

```ts
export type Lang = 'en' | 'id'

export type LocalizedString = string | { en: string; id?: string }

export function pickLang(value: LocalizedString, lang: Lang): string {
  if (typeof value === 'string') return value
  return value[lang] ?? value.en
}

export function pickLangArray(values: LocalizedString[], lang: Lang): string[] {
  return values.map((v) => pickLang(v, lang))
}
```

- [ ] **Step 4: Implement the provider (mirrors use-theme.tsx)**

Create `src/hooks/use-language.tsx`:

```tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Lang } from '@/lib/i18n'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'id' || stored === 'en') {
      setLangState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem('lang', next)
    document.documentElement.lang = next
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
```

- [ ] **Step 5: Mount in layout**

In `src/app/layout.tsx`: `import { LanguageProvider } from '@/hooks/use-language'` and wrap directly inside ThemeProvider:

```tsx
<ThemeProvider>
  <LanguageProvider>
    <ClientMotion />
    <CommandPalette />
    <Navbar />
    <PageTransition>
      <main id="main-content" className="pt-24">{children}</main>
    </PageTransition>
    <Footer />
  </LanguageProvider>
</ThemeProvider>
```

- [ ] **Step 6: Verify + commit**

```bash
npx vitest run tests/lib/i18n.test.ts tests/hooks/use-language.test.tsx
npm run test:run
npm run build
git add src/lib/i18n.ts src/hooks/use-language.tsx src/app/layout.tsx tests/lib/i18n.test.ts tests/hooks/use-language.test.tsx
git commit -m "feat(i18n): language core — Lang types, pickLang, LanguageProvider"
```

---

### Task 2: UI strings dictionary

**Files:**
- Create: `src/content/ui-strings.json`
- Modify: `src/data/content.ts` (add `getUiStrings`)
- Modify: `src/types/content.ts` (add `UiStrings`)
- Test: `tests/data/ui-strings.test.ts`

**Interfaces:**
- Consumes: `Lang` from Task 1
- Produces:
  - `src/content/ui-strings.json` shaped `{ "en": { <key>: string, ... }, "id": { <key>: string, ... } }` — **both languages must have identical key sets** (enforced by test)
  - `getUiStrings(lang: Lang): UiStrings` in `src/data/content.ts` where `UiStrings = Record<UiStringKey, string>` (typed from the EN keys)

- [ ] **Step 1: Write the failing test**

Create `tests/data/ui-strings.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getUiStrings } from '@/data/content'
import uiStrings from '@/content/ui-strings.json'

describe('ui strings', () => {
  it('en and id have identical key sets', () => {
    const enKeys = Object.keys(uiStrings.en).sort()
    const idKeys = Object.keys(uiStrings.id).sort()
    expect(idKeys).toEqual(enKeys)
  })

  it('resolves by language with the same keys', () => {
    const en = getUiStrings('en')
    const id = getUiStrings('id')
    expect(en.navResearch).toBe('Research')
    expect(id.navResearch.length).toBeGreaterThan(0)
  })

  it('no empty values in either language', () => {
    for (const langBlock of [uiStrings.en, uiStrings.id]) {
      for (const [key, value] of Object.entries(langBlock)) {
        expect(value, `empty value for ${key}`).not.toBe('')
      }
    }
  })
})
```

- [ ] **Step 2: Run to verify fail** — `npx vitest run tests/data/ui-strings.test.ts` → FAIL.

- [ ] **Step 3: Author the dictionary**

Create `src/content/ui-strings.json` with EXACTLY these keys (EN copied from the current UI; ID drafted faithfully — proper nouns untranslated):

```json
{
  "en": {
    "navResearch": "Research",
    "navExperience": "Experience",
    "navEducation": "Education",
    "navCredentials": "Credentials",
    "navSkills": "Skills",
    "navContact": "Contact",
    "navNotes": "Notes",
    "downloadCv": "Download CV",
    "readResearch": "Read my research →",
    "sectionResearch": "Research",
    "sectionExperience": "Experience",
    "sectionEducation": "Education",
    "sectionCredentials": "Credentials",
    "sectionSkills": "Skills",
    "sectionTestimonials": "Testimonials",
    "statYears": "Years of experience",
    "statPositions": "Positions held",
    "statCertifications": "Certifications",
    "statResearch": "Research works",
    "contactEyebrow": "Get in touch",
    "contactHeading": "Open to research collaboration, internships, and conversation.",
    "contactBody": "I'm currently open to discussions around tax, audit, and sustainability-reporting research — including graduate program opportunities. The fastest way to reach me is email or LinkedIn.",
    "contactEmailMe": "Email me",
    "formName": "Name",
    "formEmail": "Email",
    "formMessage": "Message",
    "formNamePlaceholder": "Your name",
    "formEmailPlaceholder": "you@example.com",
    "formMessagePlaceholder": "How can I help you?",
    "formSend": "Send Message",
    "formSending": "Sending...",
    "formSuccessTitle": "Message sent! ✓",
    "formSuccessBody": "Thank you for reaching out. I'll get back to you soon.",
    "formSendAnother": "Send another message",
    "footerBuiltWith": "Built with Next.js · GitHub Pages",
    "footerPersonal": "personal →",
    "minRead": "min read"
  },
  "id": {
    "navResearch": "Riset",
    "navExperience": "Pengalaman",
    "navEducation": "Pendidikan",
    "navCredentials": "Kredensial",
    "navSkills": "Keahlian",
    "navContact": "Kontak",
    "navNotes": "Catatan",
    "downloadCv": "Unduh CV",
    "readResearch": "Baca riset saya →",
    "sectionResearch": "Riset",
    "sectionExperience": "Pengalaman",
    "sectionEducation": "Pendidikan",
    "sectionCredentials": "Kredensial",
    "sectionSkills": "Keahlian",
    "sectionTestimonials": "Testimoni",
    "statYears": "Tahun pengalaman",
    "statPositions": "Posisi dijalani",
    "statCertifications": "Sertifikasi",
    "statResearch": "Karya riset",
    "contactEyebrow": "Hubungi saya",
    "contactHeading": "Terbuka untuk kolaborasi riset, magang, dan diskusi.",
    "contactBody": "Saat ini saya terbuka untuk diskusi seputar pajak, audit, dan riset pelaporan keberlanjutan — termasuk peluang program pascasarjana. Cara tercepat menghubungi saya adalah lewat email atau LinkedIn.",
    "contactEmailMe": "Kirim email",
    "formName": "Nama",
    "formEmail": "Email",
    "formMessage": "Pesan",
    "formNamePlaceholder": "Nama Anda",
    "formEmailPlaceholder": "anda@contoh.com",
    "formMessagePlaceholder": "Ada yang bisa saya bantu?",
    "formSend": "Kirim Pesan",
    "formSending": "Mengirim...",
    "formSuccessTitle": "Pesan terkirim! ✓",
    "formSuccessBody": "Terima kasih sudah menghubungi. Saya akan segera membalas.",
    "formSendAnother": "Kirim pesan lain",
    "footerBuiltWith": "Dibangun dengan Next.js · GitHub Pages",
    "footerPersonal": "personal →",
    "minRead": "menit baca"
  }
}
```

- [ ] **Step 4: Implement the loader**

Add to `src/data/content.ts` (no change to types/content.ts — the type derives from the JSON):

```ts
import uiStringsData from '@/content/ui-strings.json'
import type { Lang } from '@/lib/i18n'

export type UiStrings = typeof uiStringsData.en

export function getUiStrings(lang: Lang): UiStrings {
  return lang === 'id'
    ? { ...uiStringsData.en, ...uiStringsData.id }
    : uiStringsData.en
}
```

(The `{ ...en, ...id }` spread is the EN-fallback guarantee for any future key added to EN only.)

- [ ] **Step 5: Verify + commit**

```bash
npx vitest run tests/data/ui-strings.test.ts
npm run test:run
git add src/content/ui-strings.json src/data/content.ts src/types/content.ts tests/data/ui-strings.test.ts
git commit -m "feat(i18n): ui-strings dictionary with EN/ID parity test"
```

---

### Task 3: Language toggle in navbar + mobile menu

**Files:**
- Create: `src/components/ui/language-toggle.tsx`
- Modify: `src/components/layout/navbar.tsx` (mount next to ThemeToggle)
- Modify: `src/components/navigation/mobile-menu.tsx` (mount inside the menu panel)
- Test: `tests/components/ui/language-toggle.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from Task 1
- Produces: `<LanguageToggle />` — segmented EN | ID control; active language gets `text-accent font-semibold`; `aria-pressed` on each button; 44px touch target on mobile menu instance via size prop not needed — single compact variant.

- [ ] **Step 1: Write the failing test**

Create `tests/components/ui/language-toggle.test.tsx`:

```tsx
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '@/hooks/use-language'
import { LanguageToggle } from '@/components/ui/language-toggle'

function renderToggle() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
}

describe('LanguageToggle', () => {
  afterEach(() => {
    cleanup()
    localStorage.removeItem('lang')
  })

  it('renders EN and ID buttons with EN active by default', () => {
    renderToggle()
    const en = screen.getByRole('button', { name: /english/i })
    const id = screen.getByRole('button', { name: /indonesia/i })
    expect(en.getAttribute('aria-pressed')).toBe('true')
    expect(id.getAttribute('aria-pressed')).toBe('false')
  })

  it('switches to ID on click and persists', async () => {
    const user = userEvent.setup()
    renderToggle()
    await user.click(screen.getByRole('button', { name: /indonesia/i }))
    expect(screen.getByRole('button', { name: /indonesia/i }).getAttribute('aria-pressed')).toBe('true')
    expect(localStorage.getItem('lang')).toBe('id')
  })
})
```

- [ ] **Step 2: Run to verify fail** — module does not exist.

- [ ] **Step 3: Implement**

Create `src/components/ui/language-toggle.tsx`:

```tsx
'use client'

import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/utils/cn'
import type { Lang } from '@/lib/i18n'

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: 'en', label: 'EN', aria: 'Switch to English' },
  { value: 'id', label: 'ID', aria: 'Beralih ke Bahasa Indonesia' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="inline-flex items-center rounded-md border border-border font-mono text-[11px] uppercase tracking-wider" role="group" aria-label="Language">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLang(opt.value)}
          aria-pressed={lang === opt.value}
          aria-label={opt.aria}
          className={cn(
            'px-2 py-1.5 transition-colors',
            lang === opt.value
              ? 'text-accent font-semibold'
              : 'text-subtle hover:text-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Mount it**

In `src/components/layout/navbar.tsx`: `import { LanguageToggle } from '@/components/ui/language-toggle'` and render `<LanguageToggle />` immediately before `<ThemeToggle />`.

In `src/components/navigation/mobile-menu.tsx`: import the same and render `<LanguageToggle />` inside the opened menu panel, after the nav links list (read the file; place it in the existing footer/controls area of the panel — keep the panel's markup conventions).

- [ ] **Step 5: Verify + commit**

```bash
npx vitest run tests/components/ui/language-toggle.test.tsx tests/components/layout/navbar.test.tsx
npm run test:run
npm run build
git add src/components/ui/language-toggle.tsx src/components/layout/navbar.tsx src/components/navigation/mobile-menu.tsx tests/components/ui/language-toggle.test.tsx
git commit -m "feat(i18n): EN/ID language toggle in navbar and mobile menu"
```

(Extend navbar/mobile-menu tests minimally if they snapshot child counts.)

---

### Task 4: Localize profile + hero + stats

**Files:**
- Modify: `src/content/profile.json` (localized fields)
- Modify: `src/types/content.ts` (Profile fields → `LocalizedString` where localized)
- Modify: `src/data/content.ts` (`getProfile(lang?: Lang)` resolves to plain strings)
- Modify: `src/components/sections/hero-section.tsx` (use `useLanguage()`; button labels from ui-strings)
- Modify: `src/components/sections/stats-strip.tsx` (labels from ui-strings; `getStats(lang)`)
- Test: extend `tests/data/get-stats.test.ts`, `tests/components/sections/hero-section.test.tsx`, `tests/components/sections/stats-strip.test.tsx`

**Interfaces:**
- Consumes: `pickLang`, `Lang`, `useLanguage`, `getUiStrings`
- Produces:
  - `getProfile(lang: Lang = 'en'): Profile` — same `Profile` shape as today (plain strings), resolved internally
  - `getStats(lang: Lang = 'en'): StatEntry[]` — labels localized via ui-strings keys `statYears`/`statPositions`/`statCertifications`/`statResearch`
  - Convention for Tasks 5–6: raw JSON types use `LocalizedString`; public loaders take `lang` and return the existing plain-string interfaces.

- [ ] **Step 1: Restructure profile.json (exact content)**

Replace the localized fields in `src/content/profile.json` (name, avatar, statusLine values stay plain — proper nouns/dates):

```json
{
  "name": "Dzaki Muhammad Yusfian",
  "title": {
    "en": "Accounting, tax & sustainability research",
    "id": "Akuntansi, pajak & riset keberlanjutan"
  },
  "tagline": {
    "en": "Early-career accounting professional researching sustainability reporting and firm value.",
    "id": "Profesional akuntansi awal karier yang meneliti pelaporan keberlanjutan dan nilai perusahaan."
  },
  "bio": {
    "en": "Specializing in tax compliance, auditing, and financial analysis — with ongoing research on how sustainability reporting affects firm value in Indonesian manufacturing. Previously a Tax Volunteer at DJP, serving 90+ taxpayers and running community outreach across Bantul Regency.",
    "id": "Berfokus pada kepatuhan pajak, audit, dan analisis keuangan — dengan riset berkelanjutan tentang pengaruh pelaporan keberlanjutan terhadap nilai perusahaan manufaktur Indonesia. Sebelumnya Relawan Pajak di DJP, melayani 90+ wajib pajak dan menjalankan penyuluhan masyarakat di Kabupaten Bantul."
  },
  "brandStatement": {
    "en": "Transforming financial complexity into clarity.",
    "id": "Mengubah kompleksitas keuangan menjadi kejelasan."
  },
  "avatar": "/images/profile/avatar.jpg",
  "headline": {
    "plain": { "en": "Accounting, tax, &", "id": "Akuntansi, pajak, &" },
    "emphasis": { "en": "sustainability research", "id": "riset keberlanjutan" },
    "suffix": "."
  },
  "positioning": {
    "en": "Early-career professional working at the intersection of financial reporting and sustainability disclosure.",
    "id": "Profesional awal karier yang bekerja di persimpangan pelaporan keuangan dan pengungkapan keberlanjutan."
  },
  "statusLine": {
    "now": "Operations Officer @ Kolosal AI",
    "basedIn": "Jakarta, Indonesia",
    "education": "B.Acc. · STIE YKPN · Apr 2026"
  }
}
```

- [ ] **Step 2: Types + loader**

In `src/types/content.ts`: introduce a `RawProfile` (current `Profile` but with `LocalizedString` on title/tagline/bio/brandStatement/positioning and headline.plain/emphasis). Keep the public `Profile` interface as plain strings (unchanged shape for components).

In `src/data/content.ts`:

```ts
import { pickLang, type Lang } from '@/lib/i18n'

export function getProfile(lang: Lang = 'en'): Profile {
  const raw = profileData as unknown as RawProfile
  return {
    ...raw,
    title: pickLang(raw.title, lang),
    tagline: pickLang(raw.tagline, lang),
    bio: pickLang(raw.bio, lang),
    brandStatement: pickLang(raw.brandStatement, lang),
    positioning: pickLang(raw.positioning, lang),
    headline: raw.headline && {
      plain: pickLang(raw.headline.plain, lang),
      emphasis: pickLang(raw.headline.emphasis, lang),
      suffix: raw.headline.suffix,
    },
  }
}
```

And localize stats labels:

```ts
export function getStats(lang: Lang = 'en'): StatEntry[] {
  const ui = getUiStrings(lang)
  const experience = getExperience()  // lang param arrives in Task 5; counts are language-independent
  const earliestYear = Math.min(...experience.map((e) => new Date(e.startDate).getFullYear()))
  const years = Math.max(1, new Date().getFullYear() - earliestYear)
  return [
    { label: ui.statYears, value: years, suffix: '+' },
    { label: ui.statPositions, value: experience.length },
    { label: ui.statCertifications, value: getCertifications().length },
    { label: ui.statResearch, value: getResearchEntries().length },
  ]
}
```

- [ ] **Step 3: Components**

`hero-section.tsx` (already client): `const { lang } = useLanguage()`; `const profile = getProfile(lang)`; `const ui = getUiStrings(lang)`; CTA labels become `{ui.readResearch}` and `{ui.downloadCv}`.

`stats-strip.tsx` (already client): `const { lang } = useLanguage()`; `const stats = getStats(lang)`.

- [ ] **Step 4: Tests**

- `tests/data/get-stats.test.ts`: existing label assertions keep working for the default `'en'`; ADD a case: `getStats('id')` labels equal the ID ui-strings (`Tahun pengalaman`, etc.) and values identical to `getStats('en')` values.
- Hero/stats component tests: these render without a LanguageProvider today — add `vi.mock('@/hooks/use-language', () => ({ useLanguage: () => ({ lang: 'en', setLang: () => {} }) }))` to each affected test file (behavioral assertions unchanged; they assert EN copy).
- Add one new hero test: with the mock returning `lang: 'id'`, the bio contains 'Berfokus' (ID text renders).

- [ ] **Step 5: Verify + commit**

```bash
npx vitest run tests/data/get-stats.test.ts tests/components/sections/hero-section.test.tsx tests/components/sections/stats-strip.test.tsx
npm run test:run
npm run build
git add src/content/profile.json src/types/content.ts src/data/content.ts src/components/sections/hero-section.tsx src/components/sections/stats-strip.tsx tests/
git commit -m "feat(i18n): localize profile, hero, and stats strip"
```

---

### Task 5: Localize experience + education sections

**Files:**
- Modify: `src/content/experience.json` (role stays EN?, no — `role` and `bullets` become `{en,id}`; company/location/dates stay plain)
- Modify: `src/content/education.json` (`degree`/`field` stay plain — official names; `details` become `{en,id}`)
- Modify: `src/types/content.ts` (Raw types), `src/data/content.ts` (`getExperience(lang)`, `getEducation(lang)`)
- Modify: `src/components/sections/experience-section.tsx`, `src/components/sections/education-section.tsx` (add `'use client'`, `useLanguage()`, section titles from ui-strings)
- Test: extend existing section tests + loaders

**Interfaces:**
- Consumes: Task 1–2 primitives, Task 4 convention
- Produces: `getExperience(lang: Lang = 'en'): ExperienceEntry[]`, `getEducation(lang: Lang = 'en'): EducationEntry[]` — public shapes unchanged (plain strings).

- [ ] **Step 1: Translate content**

The implementer reads `src/content/experience.json` and `src/content/education.json`, converts every `role` and every string in `bullets`/`details` to `{ "en": "<exact current text>", "id": "<faithful Indonesian translation>" }`. Translation rules: keep numbers, employer names, DJP/STIE YKPN/Kolosal AI, place names, and technical terms (Tobin's Q, GRI) untranslated; natural professional Indonesian; no added claims. Every ID string is ALSO appended to the running review doc (see Task 7 — create `docs/superpowers/specs/2026-08-06-id-translations-review.md` now with a `## experience.json` / `## education.json` section listing EN → ID pairs).

- [ ] **Step 2: Loaders**

In `src/data/content.ts`:

```ts
export function getExperience(lang: Lang = 'en'): ExperienceEntry[] {
  return (experienceData as unknown as RawExperienceEntry[]).map((e) => ({
    ...e,
    role: pickLang(e.role, lang),
    bullets: pickLangArray(e.bullets, lang),
  }))
}

export function getEducation(lang: Lang = 'en'): EducationEntry[] {
  return (educationData as unknown as RawEducationEntry[]).map((e) => ({
    ...e,
    details: pickLangArray(e.details, lang),
  }))
}
```

with `RawExperienceEntry`/`RawEducationEntry` added to `src/types/content.ts` (existing interfaces with those fields typed `LocalizedString`/`LocalizedString[]`).

- [ ] **Step 3: Sections become client components**

Both sections: add `'use client'` at top, `const { lang } = useLanguage()`, `const ui = getUiStrings(lang)`, pass `title={ui.sectionExperience}` / `title={ui.sectionEducation}` to SectionHeading (labels "Work"/"Academic" and section numbers stay as-is). `TimelineWithSpine` wrapping is unchanged (client-in-client is fine).

- [ ] **Step 4: Tests**

- Loader test additions (in a new `tests/data/localized-content.test.ts`): `getExperience('id')[0].bullets[0]` differs from `getExperience('en')[0].bullets[0]` (translation exists) AND `getExperience()` defaults to EN; same for education details; company/dates identical across langs.
- Section tests: add the `use-language` mock (EN) as in Task 4; assertions unchanged.

- [ ] **Step 5: Verify + commit**

```bash
npx vitest run tests/data/localized-content.test.ts tests/components/sections/experience-section.test.tsx tests/components/sections/education-section.test.tsx
npm run test:run
npm run build
git add src/content/experience.json src/content/education.json src/types/content.ts src/data/content.ts src/components/sections/experience-section.tsx src/components/sections/education-section.tsx tests/ docs/superpowers/specs/2026-08-06-id-translations-review.md
git commit -m "feat(i18n): localize experience and education sections"
```

---

### Task 6: Localize contact, form, footer, and remaining section headings

**Files:**
- Modify: `src/components/sections/contact-section.tsx` (add `'use client'`, all hardcoded copy → ui-strings)
- Modify: `src/components/ui/contact-form.tsx` (labels/placeholders/status copy → ui-strings; keep Web3Forms hidden fields EN)
- Modify: `src/components/layout/footer.tsx` (add `'use client'`, strings → ui-strings)
- Modify: `src/components/sections/research-section.tsx`, `credentials-section.tsx`, `skills-section.tsx` (SectionHeading titles via ui-strings — these become client components if not already; check each first)
- Modify: `src/components/sections/testimonials-section.tsx` (title via ui-strings — becomes client; empty-safe null render unchanged)
- Test: extend contact/footer/section tests with the `use-language` mock; one ID-rendering test for the contact section

**Interfaces:**
- Consumes: `getUiStrings`, `useLanguage`
- Produces: no new APIs. **Fallback rule check:** every string consumed MUST come from a key present in BOTH en and id blocks (the Task 2 parity test enforces this globally).

- [ ] **Step 1: Contact section** — replace the four hardcoded strings ("Get in touch", the h2, the paragraph, "Email me") with `ui.contactEyebrow`, `ui.contactHeading`, `ui.contactBody`, `ui.contactEmailMe`. "LinkedIn →" stays (proper noun + arrow).

- [ ] **Step 2: Contact form** — labels `ui.formName`/`ui.formEmail`/`ui.formMessage`, placeholders `ui.formNamePlaceholder`/`ui.formEmailPlaceholder`/`ui.formMessagePlaceholder`, button `ui.formSend`/`ui.formSending`, success block `ui.formSuccessTitle`/`ui.formSuccessBody`/`ui.formSendAnother`. Keep the hidden Web3Forms fields and error messages from the API as-is; the network-error fallback string moves to ui-strings ONLY if trivial — otherwise leave EN and log it in the review doc as intentionally untranslated.

- [ ] **Step 3: Footer** — `'use client'`, `ui.footerBuiltWith`, `ui.footerPersonal`. Copyright line stays (name + year).

- [ ] **Step 4: Remaining headings** — research/credentials/skills/testimonials sections: pass ui-strings titles to SectionHeading. For each file: if it is currently a server component, add `'use client'` and verify no server-only imports (they all read JSON via loaders — safe). Skill category names and certification names stay untranslated (proper nouns/data).

- [ ] **Step 5: Tests** — add the `use-language` EN mock wherever these components' tests fail without it; add one contact-section test with the mock returning `id` asserting `Hubungi saya` renders.

- [ ] **Step 6: Verify + commit**

```bash
npm run test:run
npm run build
git add src/components/ tests/ src/content/ui-strings.json
git commit -m "feat(i18n): localize contact, form, footer, and section headings"
```

(If Step 2 needed a new ui-strings key, keep the parity test green by adding it to both blocks.)

---

### Task 7: Translation review doc + README

**Files:**
- Modify/complete: `docs/superpowers/specs/2026-08-06-id-translations-review.md`
- Modify: `README.md` (feature bullet + changelog)

**Interfaces:**
- Consumes: all ID strings introduced in Tasks 2–6
- Produces: the single review artifact Dzaki reads before deploy.

- [ ] **Step 1: Complete the review doc**

Structure (every ID string in the branch must appear — cross-check against `git diff main -- src/content/ src/components/`):

```markdown
# Indonesian Translation Review — Phase 4 Plan 3

**Status: AWAITING DZAKI'S REVIEW — do not deploy before approval.**
How to review: read the ID column; edit any wording you want changed directly in this file or tell Claude; the JSON files are the source of truth and will be updated to match your edits.

## ui-strings.json
| Key | EN | ID |
|---|---|---|
| navResearch | Research | Riset |
... (every key)

## profile.json
| Field | EN | ID |
... (every localized field)

## experience.json
... (every role + bullet, EN → ID)

## education.json
... (every detail)

## Intentionally untranslated
- MDX article bodies (research + notes) — English by design
- Proper nouns: DJP, STIE YKPN, Kolosal AI, GRI, IDX, degree names, cert names, skill/course names
- <any string left EN with reason>
```

- [ ] **Step 2: README**

Features list addition (after the Command Palette bullet):

```markdown
- **Bilingual EN/ID** — Client-side language toggle (navbar + mobile menu) covering the homepage and site chrome; content JSON carries `{en, id}` fields with EN fallback; research/notes article bodies remain English
```

Changelog entry directly below `## 📋 Changelog`:

```markdown
### Phase 4 Plan 3 — Bilingual EN/ID (2026-08-06)

- EN ↔ ID language toggle (localStorage-persisted, `document.documentElement.lang` synced, EN fallback for any missing string)
- Localized: hero, stats, experience, education, contact + form, footer, section headings, nav labels via `ui-strings.json`
- Content JSON fields carry `{en, id}` objects resolved by typed loaders — component prop shapes unchanged
- Note: prerendered HTML is English; ID users see a brief EN flash after hydration (text cannot be pre-hydration-swapped the way theme classes can)
- Research/notes article bodies remain English by design
```

- [ ] **Step 3: Verify + commit**

```bash
npm run test:run
git add docs/superpowers/specs/2026-08-06-id-translations-review.md README.md
git commit -m "docs(i18n): translation review doc and README for Plan 3"
```

---

### Task 8: Final audit (Lighthouse vs baseline + full battery)

**Files:**
- Modify: `docs/superpowers/specs/2026-08-06-phase4-lighthouse.md` (fill the Final section)

**Interfaces:**
- Consumes: the pinned command in that doc (MUST be reused verbatim for a valid comparison — default Lighthouse config, mobile emulation; do NOT add --preset=desktop)

- [ ] **Step 1: Battery**

```bash
npm run test:run
npm run lint
npm run build
```

Expected: suite green; only the 2 known `<img>` warnings; all routes exported.

- [ ] **Step 2: Lighthouse (exact pinned procedure)**

```powershell
New-Item -ItemType Directory -Force scratch-lh | Out-Null
Copy-Item -Recurse -Force out scratch-lh/Proffesional_Portfolio
npx serve scratch-lh -l 3999   # background process, stop afterwards
npx lighthouse http://localhost:3999/Proffesional_Portfolio/ --quiet --chrome-flags="--headless" --output=json --output-path=scratch-lh/final.json
```

Fill `## Final (after Phase 4)` in the lighthouse doc with the same table format plus a delta column vs baseline (85/96/96/100). If any category dropped >5 points, list the top 3 Lighthouse opportunities in the doc. Clean up `scratch-lh/` and stop the server.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-08-06-phase4-lighthouse.md
git commit -m "docs: record final Lighthouse scores for Phase 4"
```

- [ ] **Step 4: STOP — user review gate**

Report to the controller: the branch is complete but **MUST NOT be merged or deployed until Dzaki reviews `docs/superpowers/specs/2026-08-06-id-translations-review.md`**. The controller presents the translations to Dzaki and only proceeds to finishing-a-development-branch after his approval.
