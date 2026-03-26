# Dark Mode Visibility Fix Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 dark mode visibility issues across 5 files so structural elements (borders, dividers, lines) and one CTA button have proper contrast.

**Architecture:** Targeted CSS/class edits — one token change in `globals.css`, removal of dark overrides in 3 components, and prose class fixes in the research page. No new files, no new tokens, no structural changes.

**Tech Stack:** Next.js 15, Tailwind CSS 4, React 19, Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-03-25-dark-mode-visibility-fix-design.md`

---

## Chunk 1: CSS Token + Component Fixes

### Task 1: Fix dark mode `--border` token

**Files:**
- Modify: `src/styles/globals.css:48`

- [ ] **Step 1: Update the border token**

In `src/styles/globals.css`, inside the `.dark { }` block (line 48), change:
```css
--border: #1e1e28;
```
to:
```css
--border: #27272a;
```

This single change fixes section dividers (`section-divider.tsx`), timeline connecting line (`timeline-item.tsx`), and mobile menu border (`mobile-menu.tsx`) since they all reference the `border` token.

- [ ] **Step 2: Run existing tests**

Run: `npx vitest run tests/components/ui/section-divider.test.tsx tests/components/ui/timeline-item.test.tsx tests/components/navigation/mobile-menu.test.tsx --reporter=verbose`

Expected: All pass (tests don't check hex values, just structure)

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "fix: increase dark mode border token contrast (#1e1e28 → #27272a)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Fix Hero CTA button contrast

**Files:**
- Modify: `src/components/sections/hero-section.tsx:112`

- [ ] **Step 1: Remove dark:text-white from CTA button**

In `src/components/sections/hero-section.tsx` line 112, change:
```tsx
className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 text-black font-medium hover:bg-gold-600 transition-colors dark:text-white"
```
to:
```tsx
className="inline-flex items-center px-6 py-3 rounded-full bg-gold-500 text-black font-medium hover:bg-gold-600 transition-colors"
```

Black text on gold gives ~8.5:1 contrast in both modes.

- [ ] **Step 2: Run hero section tests**

Run: `npx vitest run tests/components/sections/hero-section.test.tsx --reporter=verbose`

Expected: All pass

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/hero-section.tsx
git commit -m "fix: remove dark:text-white from hero CTA for WCAG contrast

Black on gold (#d4af37) gives ~8.5:1 contrast vs white on gold at ~1.8:1.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Fix card border visibility

**Files:**
- Modify: `src/components/ui/card.tsx:30`

- [ ] **Step 1: Remove dark border override from card**

In `src/components/ui/card.tsx` line 30, change:
```tsx
'dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/[0.06]',
```
to:
```tsx
'dark:bg-white/[0.03] dark:backdrop-blur-xl',
```

The `border-border` class on line 29 already applies the theme border token in both modes.

- [ ] **Step 2: Run card tests**

Run: `npx vitest run tests/components/ui/card.test.tsx --reporter=verbose`

Expected: All pass

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/card.tsx
git commit -m "fix: remove dark border override from card, use border token

border-border already present; removing dark:border-white/[0.06] lets
the theme token (#27272a) apply consistently.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Fix navbar border visibility

**Files:**
- Modify: `src/components/layout/navbar.tsx:20`

- [ ] **Step 1: Remove dark border override from navbar**

In `src/components/layout/navbar.tsx` line 20, in the long className string, remove ` dark:border-white/10` from:
```
border border-border dark:border-white/10 shadow-lg
```
so it becomes:
```
border border-border shadow-lg
```

- [ ] **Step 2: Run navbar tests**

Run: `npx vitest run tests/components/layout/navbar.test.tsx --reporter=verbose`

Expected: All pass

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/navbar.tsx
git commit -m "fix: remove dark border override from navbar, use border token

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Fix research page prose styling

**Files:**
- Modify: `src/app/research/[slug]/page.tsx:67`

- [ ] **Step 1: Fix prose-invert and prose link classes**

In `src/app/research/[slug]/page.tsx` line 67, change:
```tsx
<div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-[#78600f] dark:prose-a:text-gold-500 prose-strong:text-foreground">
```
to:
```tsx
<div className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-gold-accent prose-strong:text-foreground">
```

Two changes:
1. `prose-invert` → `dark:prose-invert` — only invert prose colors in dark mode
2. `prose-a:text-[#78600f] dark:prose-a:text-gold-500` → `prose-a:text-gold-accent` — the custom `.text-gold-accent` class has proper specificity (0,2,0) to override in both modes: `#78600f` in light, `#d4af37` in dark

- [ ] **Step 2: Run research detail tests**

Run: `npx vitest run tests/app/research-detail.test.tsx --reporter=verbose`

Expected: All pass

- [ ] **Step 3: Commit**

```bash
git add src/app/research/[slug]/page.tsx
git commit -m "fix: conditional prose-invert and fix prose link dark specificity

- prose-invert → dark:prose-invert (prevents light mode breakage)
- Use text-gold-accent class for prose links (proper Tailwind 4 specificity)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 2: Verification

### Task 6: Run full test suite

- [ ] **Step 1: Run all tests**

Run: `npx vitest run --reporter=verbose`

Expected: All tests pass with no regressions.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: Build succeeds with no errors. The `out/` directory is generated for static export.

- [ ] **Step 3: Visual verification (dark mode)**

Start dev server and use Playwright to capture dark mode screenshots of all 6 homepage sections + research page. Compare against baseline screenshots in session files to confirm:
- Section dividers visible
- Timeline line visible
- Card borders visible
- Navbar border visible
- Hero CTA button text readable (black on gold)
- Research prose links properly colored
- Mobile menu border visible

- [ ] **Step 4: Visual verification (light mode)**

Capture light mode screenshots to confirm no regressions:
- Research page prose text still readable (was broken by unconditional prose-invert)
- All other sections unchanged

- [ ] **Step 5: Final commit (if any adjustments needed)**

If visual verification reveals issues, fix and commit. Otherwise, task is complete.
