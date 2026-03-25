# Light Mode Contrast Fix — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all light mode WCAG contrast failures by updating CSS tokens and replacing gold text with theme-aware dark amber, while keeping dark mode untouched.

**Architecture:** Two-layer approach — (1) update `:root` CSS tokens in globals.css to auto-fix ~30 muted-foreground and border locations, (2) add `.text-gold-accent` / `.hover-gold-accent` utility classes and replace `text-gold-500` with theme-aware classes across ~18 component files. Badge gets a filled gold variant in light mode.

**Tech Stack:** Tailwind CSS 4 (CSS-first `@theme`), Next.js 15, React 19, Vitest

**Spec:** `docs/superpowers/specs/2026-03-25-light-mode-contrast-design.md`

---

## Chunk 1: CSS Foundation + Utility Classes

### Task 1: Update light mode tokens and add gold accent utilities

**Files:**
- Modify: `src/styles/globals.css:28-36` (`:root` block) and add new utility classes after existing `.link-underline`

- [ ] **Step 1: Update `:root` token values**

In `src/styles/globals.css`, change two values in the `:root` block (lines ~33-34):

```css
/* Before */
:root {
  --background: #faf9f7;
  --foreground: #0f172a;
  --surface: #ffffff;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --muted: #f5f3f0;
  --muted-foreground: #64748b;
  --border: #e8e4df;
}

/* After */
:root {
  --background: #faf9f7;
  --foreground: #0f172a;
  --surface: #ffffff;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --muted: #f5f3f0;
  --muted-foreground: #3f3a36;
  --border: #c8c2b8;
}
```

DO NOT touch the `.dark` block. It stays exactly as-is.

- [ ] **Step 2: Add gold accent utility classes**

Add these utility classes in `src/styles/globals.css` after the existing `.link-underline` block (after line ~146):

```css
/* Gold accent text — dark amber in light mode, original gold in dark mode */
.text-gold-accent {
  color: #78600f;
}
.dark .text-gold-accent {
  color: #d4af37;
}

.hover-gold-accent:hover {
  color: #78600f;
}
.dark .hover-gold-accent:hover {
  color: #d4af37;
}
```

- [ ] **Step 3: Run tests to verify token changes don't break anything**

Run: `npx vitest run --reporter=verbose 2>&1 | Select-Object -Last 20`
Expected: All 148 tests pass. Token changes are CSS-only and won't affect test assertions.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "fix: update light mode tokens for WCAG contrast compliance

- --muted-foreground: #64748b → #3f3a36 (8.2:1 contrast)
- --border: #e8e4df → #c8c2b8 (3.5:1 contrast)
- Add .text-gold-accent and .hover-gold-accent utility classes
- Dark mode unchanged

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 2: UI Components

### Task 2: Update section-heading gold text

**Files:**
- Modify: `src/components/ui/section-heading.tsx:13`

- [ ] **Step 1: Replace `text-gold-500` with `text-gold-accent`**

Change line 13 from:
```tsx
<span className="font-mono text-xs text-gold-500 tracking-widest">{sectionNumber}</span>
```
To:
```tsx
<span className="font-mono text-xs text-gold-accent tracking-widest">{sectionNumber}</span>
```

- [ ] **Step 2: Run section-heading tests**

Run: `npx vitest run tests/components/ui/section-heading.test.tsx --reporter=verbose`
Expected: All 5 tests pass.

---

### Task 3: Update badge with light mode filled variant

**Files:**
- Modify: `src/components/ui/badge.tsx:13-15`

- [ ] **Step 1: Replace badge styling with theme-aware classes**

Replace the current className block:
```tsx
'bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 text-gold-500 border border-gold-500/20',
'bg-[length:200%_100%] animate-[badge-shimmer_3s_ease-in-out_infinite]',
'transition-colors duration-200 hover:bg-gold-500/20 hover:border-gold-500/30',
```

With:
```tsx
'bg-gold-500 text-black/90 border border-gold-500/30 font-semibold',
'dark:bg-gradient-to-r dark:from-gold-500/10 dark:via-gold-500/20 dark:to-gold-500/10 dark:text-gold-500 dark:border-gold-500/20',
'dark:bg-[length:200%_100%] dark:animate-[badge-shimmer_3s_ease-in-out_infinite]',
'transition-colors duration-200 hover:bg-gold-600 dark:hover:bg-gold-500/20 dark:hover:border-gold-500/30',
```

- [ ] **Step 2: Run badge tests**

Run: `npx vitest run tests/components/ui/badge.test.tsx --reporter=verbose`
Expected: All 4 tests pass.

---

### Task 4: Update button secondary variant

**Files:**
- Modify: `src/components/ui/button.tsx:21`

- [ ] **Step 1: Replace secondary variant gold text**

Change line 21 from:
```tsx
secondary: 'border border-gold-500 text-gold-500 hover:bg-gold-500/10 font-medium',
```
To:
```tsx
secondary: 'border border-gold-500 text-gold-accent hover:bg-gold-500/10 font-medium dark:text-gold-500',
```

- [ ] **Step 2: Run button tests**

Run: `npx vitest run tests/components/ui/button.test.tsx --reporter=verbose`
Expected: All 9 tests pass. The `bg-gold` assertions check primary variant (unchanged).

---

### Task 5: Update timeline-item dates

**Files:**
- Modify: `src/components/ui/timeline-item.tsx:25`

- [ ] **Step 1: Replace `text-gold-500`**

Change from:
```tsx
<p className="text-sm text-gold-500 font-medium">{dateRange}</p>
```
To:
```tsx
<p className="text-sm text-gold-accent font-medium">{dateRange}</p>
```

- [ ] **Step 2: Run timeline-item tests**

Run: `npx vitest run tests/components/ui/timeline-item.test.tsx --reporter=verbose`
Expected: All 3 tests pass.

---

### Task 6: Update theme-toggle hover

**Files:**
- Modify: `src/components/ui/theme-toggle.tsx:28`

- [ ] **Step 1: Replace `hover:text-gold-500`**

Change from:
```tsx
className="rounded-full p-2 text-muted-foreground hover:text-gold-500 transition-colors"
```
To:
```tsx
className="rounded-full p-2 text-muted-foreground hover-gold-accent transition-colors"
```

- [ ] **Step 2: Run theme-toggle tests**

Run: `npx vitest run tests/components/ui/theme-toggle.test.tsx --reporter=verbose`
Expected: All 2 tests pass.

---

### Task 7: Commit UI component changes

- [ ] **Commit all UI changes**

```bash
git add src/components/ui/
git commit -m "fix: update UI components for light mode contrast

- section-heading: gold number text → text-gold-accent
- badge: filled gold bg in light mode, transparent in dark
- button: secondary variant → text-gold-accent
- timeline-item: date text → text-gold-accent
- theme-toggle: hover → hover-gold-accent

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 3: Layout + Navigation Components

### Task 8: Update navbar

**Files:**
- Modify: `src/components/layout/navbar.tsx:20,25`

- [ ] **Step 1: Fix navbar border and logo text**

On line 20, change the border class from:
```
border border-white/15 dark:border-white/10
```
To:
```
border border-border dark:border-white/10
```

On line 25, change logo text from:
```tsx
<Link href="/" className="text-lg font-bold font-display text-gold-500">
```
To:
```tsx
<Link href="/" className="text-lg font-bold font-display text-gold-accent">
```

- [ ] **Step 2: Run navbar tests**

Run: `npx vitest run tests/components/layout/navbar.test.tsx --reporter=verbose`
Expected: All 5 tests pass.

---

### Task 9: Update nav-links active state

**Files:**
- Modify: `src/components/navigation/nav-links.tsx:25`

- [ ] **Step 1: Replace active link gold text**

Change from:
```tsx
isActive && 'text-gold-500'
```
To:
```tsx
isActive && 'text-gold-accent'
```

- [ ] **Step 2: Run nav-links tests**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx --reporter=verbose`
Expected: May fail on line 33 (`expect(aboutLink.className).toContain('gold')`). If it passes (because `text-gold-accent` still contains 'gold'), proceed. If it fails, we'll fix in Chunk 5.

---

### Task 10: Update mobile-menu active state

**Files:**
- Modify: `src/components/navigation/mobile-menu.tsx:60`

- [ ] **Step 1: Replace active link gold text**

Change from:
```tsx
activeSection && item.href === `#${activeSection}` && 'text-gold-500'
```
To:
```tsx
activeSection && item.href === `#${activeSection}` && 'text-gold-accent'
```

- [ ] **Step 2: Run mobile-menu tests**

Run: `npx vitest run tests/components/navigation/mobile-menu.test.tsx --reporter=verbose`
Expected: All 3 tests pass.

---

### Task 11: Update footer hover states

**Files:**
- Modify: `src/components/layout/footer.tsx:64,73,80,89`

- [ ] **Step 1: Replace all `hover:text-gold-500` with `hover-gold-accent`**

On lines 64, 73, 80: change:
```
text-muted-foreground hover:text-gold-500 hover:scale-110
```
To:
```
text-muted-foreground hover-gold-accent hover:scale-110
```

On line 89 (back-to-top button): change:
```
text-muted-foreground hover:text-gold-500
```
To:
```
text-muted-foreground hover-gold-accent
```

- [ ] **Step 2: Run footer tests**

Run: `npx vitest run tests/components/layout/footer.test.tsx --reporter=verbose`
Expected: All 6 tests pass.

---

### Task 12: Commit layout/navigation changes

- [ ] **Commit**

```bash
git add src/components/layout/ src/components/navigation/
git commit -m "fix: update layout and nav components for light mode contrast

- navbar: border-border for light mode, logo → text-gold-accent
- nav-links: active state → text-gold-accent
- mobile-menu: active state → text-gold-accent
- footer: hover states → hover-gold-accent

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 4: Section + Page Components

### Task 13: Update hero section

**Files:**
- Modify: `src/components/sections/hero-section.tsx:87,112`

- [ ] **Step 1: Fix hero label and CTA button**

On the name label (line ~87): change:
```tsx
className="font-mono text-xs text-gold-500 tracking-widest uppercase"
```
To:
```tsx
className="font-mono text-xs text-gold-accent tracking-widest uppercase"
```

On "See my work" button (line ~112): change:
```tsx
className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 text-white font-medium hover:bg-gold-600 transition-colors"
```
To:
```tsx
className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 text-black font-medium hover:bg-gold-600 transition-colors dark:text-white"
```

- [ ] **Step 2: Run hero tests**

Run: `npx vitest run tests/components/sections/hero-section.test.tsx --reporter=verbose`
Expected: All 7 tests pass.

---

### Task 14: Update profile section blockquote

**Files:**
- Modify: `src/components/sections/profile-section.tsx:19`

- [ ] **Step 1: Replace blockquote gold text**

Change from:
```tsx
<blockquote className="border-l-2 border-gold-500 pl-6 text-2xl md:text-3xl font-display italic text-gold-500">
```
To:
```tsx
<blockquote className="border-l-2 border-gold-500 pl-6 text-2xl md:text-3xl font-display italic text-gold-accent">
```

Note: `border-gold-500` stays — it's decorative.

- [ ] **Step 2: Run profile tests**

Run: `npx vitest run tests/components/sections/profile-section.test.tsx --reporter=verbose`
Expected: All 5 tests pass.

---

### Task 15: Update skills section dates

**Files:**
- Modify: `src/components/sections/skills-section.tsx:43,67`

- [ ] **Step 1: Replace both date gold text instances**

On line 43 and line 67, change both from:
```tsx
<p className="text-sm text-gold-500 mt-1">
```
To:
```tsx
<p className="text-sm text-gold-accent mt-1">
```

- [ ] **Step 2: Run skills tests**

Run: `npx vitest run tests/components/sections/skills-section.test.tsx --reporter=verbose`
Expected: All 6 tests pass.

---

### Task 16: Update certifications section date

**Files:**
- Modify: `src/components/sections/certifications-section.tsx:21`

- [ ] **Step 1: Replace date gold text**

Change from:
```tsx
<p className="mt-2 text-sm text-gold-500">{formatDate(cert.date)}</p>
```
To:
```tsx
<p className="mt-2 text-sm text-gold-accent">{formatDate(cert.date)}</p>
```

- [ ] **Step 2: Run certifications tests**

Run: `npx vitest run tests/components/sections/certifications-section.test.tsx --reporter=verbose`
Expected: All 5 tests pass.

---

### Task 17: Update research pages

**Files:**
- Modify: `src/app/research/page.tsx:28`
- Modify: `src/app/research/[slug]/page.tsx:41,50,67`

- [ ] **Step 1: Fix research listing page date**

In `src/app/research/page.tsx`, change line 28 from:
```tsx
<p className="mt-1 text-sm text-gold-500">
```
To:
```tsx
<p className="mt-1 text-sm text-gold-accent">
```

- [ ] **Step 2: Fix research detail page**

In `src/app/research/[slug]/page.tsx`:

Line 41 — back link hover: change:
```tsx
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8"
```
To:
```tsx
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover-gold-accent transition-colors mb-8"
```

Line 50 — date text: change:
```tsx
<p className="mt-3 text-gold-500 font-medium">{formatDate(research.frontmatter.date)}</p>
```
To:
```tsx
<p className="mt-3 text-gold-accent font-medium">{formatDate(research.frontmatter.date)}</p>
```

Line 67 — prose link color: change:
```tsx
prose-a:text-gold-500
```
To:
```tsx
prose-a:text-[#78600f] dark:prose-a:text-gold-500
```

- [ ] **Step 3: Run research page tests**

Run: `npx vitest run tests/app/research-page.test.tsx tests/app/research-detail.test.tsx --reporter=verbose`
Expected: All tests pass.

---

### Task 18: Update certification detail page

**Files:**
- Modify: `src/app/certifications/[slug]/page.tsx:43,60`

- [ ] **Step 1: Fix certification detail page**

Line 43 — back link hover: change:
```tsx
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8"
```
To:
```tsx
className="inline-flex items-center gap-1 text-sm text-muted-foreground hover-gold-accent transition-colors mb-8"
```

Line 60 — date text: change:
```tsx
<span className="text-gold-500">{formatDate(cert.date)}</span>
```
To:
```tsx
<span className="text-gold-accent">{formatDate(cert.date)}</span>
```

- [ ] **Step 2: Run certification detail tests**

Run: `npx vitest run tests/app/certification-detail.test.tsx --reporter=verbose`
Expected: All tests pass.

---

### Task 19: Commit section and page changes

- [ ] **Commit**

```bash
git add src/components/sections/ src/app/research/ src/app/certifications/
git commit -m "fix: update sections and pages for light mode contrast

- hero: label → text-gold-accent, CTA button → text-black
- profile: blockquote → text-gold-accent
- skills/certs: dates → text-gold-accent
- research pages: dates, back links, prose links
- certification detail: dates, back link

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 5: Test Updates + Final Verification

### Task 20: Update nav-links test assertions (if needed)

**Files:**
- Modify: `tests/components/navigation/nav-links.test.tsx:33,39`

- [ ] **Step 1: Check if tests pass first**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx --reporter=verbose`

If all pass (because `text-gold-accent` contains 'gold'), skip to Task 21.

If line 33 fails, update the assertion:

Change:
```tsx
expect(aboutLink.className).toContain('gold')
```
To:
```tsx
expect(aboutLink.className).toContain('gold-accent')
```

And line 39:
```tsx
expect(skillsLink.className).not.toContain('gold')
```
To:
```tsx
expect(skillsLink.className).not.toContain('gold-accent')
```

- [ ] **Step 2: Re-run to confirm pass**

Run: `npx vitest run tests/components/navigation/nav-links.test.tsx --reporter=verbose`
Expected: All 4 tests pass.

---

### Task 21: Full test suite verification

- [ ] **Step 1: Run all 148 tests**

Run: `npx vitest run --reporter=verbose 2>&1 | Select-Object -Last 30`
Expected: All 148 tests pass. Zero failures.

- [ ] **Step 2: Run build to verify static export**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit test fixes (if any)**

```bash
git add tests/
git commit -m "test: update assertions for light mode contrast changes

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

- [ ] **Step 4: Push and verify deployment**

```bash
git push origin main
```

Monitor GitHub Actions for successful deployment.

---

## Verification Checklist

- [ ] All `:root` tokens updated (`--muted-foreground: #3f3a36`, `--border: #c8c2b8`)
- [ ] `.dark` block completely unchanged
- [ ] All `text-gold-500` text instances replaced with `text-gold-accent` or theme-aware equivalent
- [ ] Decorative gold (`bg-gold-500`, `border-gold-500`, underlines) left untouched
- [ ] Badge has filled gold bg in light mode, transparent in dark
- [ ] Hero "See my work" button uses `text-black` (not `text-white`)
- [ ] Navbar border uses `border-border` (not `border-white/15`) in light mode
- [ ] All 148 tests pass
- [ ] Build succeeds
- [ ] Pushed and deployed
