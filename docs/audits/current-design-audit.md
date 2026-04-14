# Current Design Audit — Professional Portfolio

**Date:** 2026-04-14
**Audience:** D (Grad school admissions) + E (Mixed professional network)
**Auditor perspective:** Website designer · Portfolio reviewer · HR professional

---

## Executive Summary

The current portfolio is **technically well-built** (Next.js 15, tests, SEO, a11y foundations, performance-tuned) but **aesthetically and informationally mismatched to its audience**. The "premium dark with gold shimmer" direction communicates *creative portfolio* rather than *serious finance/accounting researcher*. For an audience of grad-school admissions committees and professional networks, the site currently undersells the owner's strongest asset (research / thesis) and oversells through flashy motion effects.

**Headline verdict:** Solid foundation, wrong tone, wrong hierarchy.

---

## What's Working Well

1. **Engineering hygiene** — TypeScript, Vitest tests, CI deploy, SEO meta, JSON-LD, skip-link, focus styles, reduced-motion support.
2. **Content architecture** — Clean separation between JSON content and components. Easy to restructure without rewrites.
3. **Performance** — Lazy-loaded sections, throttled animations, adaptive particles, preconnect hints. Good Lighthouse posture.
4. **Responsive foundation** — Layout adapts to mobile.
5. **Theme toggle** — Dark/light mode implemented.
6. **Typography pairing** — Instrument Serif + Inter + JetBrains Mono is thoughtful (though the *italic-only* display choice is unusual).

---

## Major Issues (Ranked by Severity)

### 🔴 CRITICAL — Trust-breakers

**1. Placeholder research entry on a live public site**
- `src/content/research/index.json` contains literally: *"Placeholder Research Paper Title"* with abstract *"This is a placeholder abstract..."*
- **Impact:** Immediate credibility death for any HR or academic reviewer. Tells them the site isn't maintained.
- **Fix:** Replace with real content OR remove the entry entirely before any redesign ships.

**2. Self-rated skill percentages**
- Skill bars show *"Financial Reporting 90%", "Auditing 80%", "SAP 70%"*.
- **Impact:** Widely mocked in HR/recruiting circles. Percentages are unverifiable and read as self-aggrandizing. For finance specifically, where verifiability matters (CPA, CFA, audit certifications), arbitrary % ratings actively damage credibility.
- **Fix:** Replace with tag clouds grouped by category; add proof (certifications, years used, where) rather than numbers.

**3. Research buried, flash prioritized**
- The single-page scroll goes: Hero → Profile → Timeline → Certifications → Skills → Contact. **Research is not on the homepage.** It lives on a separate `/research` page that most visitors will never click to.
- For audience D (grad school), research is THE thing they evaluate. Hiding it is self-sabotage.
- For audience E, a modern portfolio with a visible research section signals depth over showmanship.
- **Fix:** Research becomes a featured section on the homepage, ideally before the timeline.

### 🟠 HIGH — Tone / positioning mismatch

**4. Aesthetic signals don't match the claimed role**
- Aurora canvas background + custom cursor + particle effects + animated gold shimmer on name + avatar pulsing glow = creative/design portfolio language.
- Tagline says *"Accounting & Finance Professional"*. These two signals actively contradict each other. HR in finance typically reads flashy animation as *"this person doesn't understand our industry's norms"*.
- **Fix:** Strip the aurora/cursor/shimmer. Keep subtle scroll animations only. The restraint itself becomes a credibility signal.

**5. Thesis gets one bullet line**
- The thesis *"The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector"* is buried in a 3-bullet list inside Education.
- This is the single strongest academic artifact. For audience D, it should be a featured card with abstract, methodology teaser, and downloadable link.
- **Fix:** Promote thesis to a dedicated featured card in the Research section.

**6. No immediate credibility proof in the hero**
- Hero shows name + title + tagline + 2 CTAs. No dates, no institution, no "graduating from X, now at Y", no thesis teaser, no LinkedIn link.
- A reviewer cannot place you in 5 seconds.
- **Fix:** Add a compact "status line" under the tagline: *"Bachelor of Accounting @ STIE YKPN · Operations Officer @ Kolosal AI · Jakarta"*. Add LinkedIn icon link in hero.

### 🟡 MEDIUM — Information design

**7. "See my work" CTA with no work to see**
- Primary hero CTA is *"See my work"* which links to `#certifications`. But there's only 1 certification. The user lands on a sparse section.
- **Fix:** Change to *"Read my research"* → scrolls to the new research section. Secondary CTA: *"Download CV"* (PDF).

**8. Thin sections look thinner**
- Certifications: 1 entry. Awards: empty. Courses: 2 entries.
- When a section has 1–2 items, a grid layout makes it look sparser than a list would.
- **Fix:** Consolidate into a single "Credentials" section combining certifications + courses + awards + notable training. Use a compact list format. Add more real entries if they exist.

**9. Duplicate / overlapping content**
- Certifications has *"Brevet A & B Taxation"* (IAI, 2025-03). Courses has *"Brevet Pajak AB"* (UGM, 2025-10). These appear to be related credentials — are they the same? different? The visitor can't tell.
- **Fix:** Clarify or consolidate.

**10. Contact section relegates itself**
- Contact is the last section after skills. Email and LinkedIn should also appear in the navbar and hero so visitors don't have to scroll to find them.
- **Fix:** Add contact icons in navbar + hero.

### 🟢 LOW — Polish / details

**11. Italic-only serif display**
- `Instrument Serif` in italic, 400 weight. Italic for all display is unusual and harder to scan at large sizes.
- **Fix:** Either use italic sparingly (for emphasis like thesis title), or swap to a non-italic scholarly serif (Newsreader, Fraunces, Source Serif 4).

**12. Gold shimmer animation on name**
- Fun, but reads as "creative portfolio" not "finance professional".
- **Fix:** Remove shimmer. Keep gold as a *semantic* accent color, not a decoration.

**13. Social links mix professional and personal**
- Contact includes LinkedIn (professional), GitHub (semi-professional for an accountant), Instagram, TikTok (personal brand).
- For audience D+E, TikTok and personal Instagram dilute the professional signal. Keep only LinkedIn + email + optional GitHub.
- **Fix:** Hide Instagram/TikTok from the professional portfolio OR move to a separate "personal" toggle.

**14. No downloadable CV prominent**
- There's a CV PDF at `/files/cv/dzaki-cv.pdf` but no prominent download in the hero or navbar.
- **Fix:** Persistent "Download CV" button in navbar.

**15. Thesis PDF not linked**
- `Skripsi_31998_DZAKI.pdf` exists locally but isn't served by the site (it's gitignored).
- **Fix:** If the thesis is shareable, host it at `/files/research/thesis.pdf` (the `*.pdf` gitignore exception would need extending).

---

## HR Perspective — First 30 Seconds

Simulated first-visit impression from a recruiter at a Big 4 / corporate finance org:

1. **0–5s** — "Dark site with moving lights and a custom cursor. Designer portfolio? Oh, he says accounting. Huh."
2. **5–15s** — "Nice portrait. Tagline is generic. No dates, no institution visible. Where is he now?"
3. **15–30s** — "Scroll… about… timeline shows current role… skills have percentages, that's a red flag… one cert… contact."
4. **End state** — "Can't tell me confidently whether this person has real academic or professional substance. Skipping."

Simulated first-visit from a grad-school admissions reviewer:

1. **0–5s** — "Animated website. Where's the research?"
2. **5–30s** — "Scrolling… no research on homepage… clicks 'Research' nav link… **placeholder entry**. Next candidate."

**Both fail within 30 seconds.** The redesign must solve this.

---

## Redesign Principles (for Direction C — Research Journal)

1. **Substance over show** — remove aurora, cursor, particles, shimmer. Motion only where it clarifies hierarchy.
2. **Research first** — thesis + other work is the first major section after hero.
3. **No vanity metrics** — no skill percentages. Use tags + proof (years, institution, credential).
4. **Credibility ribbon in hero** — status line with institution, role, location so visitors can place you in 3 seconds.
5. **Scholarly-modern tone** — serif display (non-italic) + clean sans body + paper background + a single deep accent color + warm gold as a sparing *highlight*, not a decoration.
6. **Trust in restraint** — the *absence* of flashy effects is the credibility signal for this audience.
7. **Easy-exit actions** — CV download + LinkedIn + email visible in navbar, hero, and footer.
8. **Print-fidelity** — the page should print to a clean CV-like document (useful for recruiters).

---

## Content Gaps to Address Before Redesign Ships

- [ ] Replace `placeholder-research` entry with real content (or remove).
- [ ] Add real entries for: other research/working papers, presentations, award(s), additional certifications.
- [ ] Decide: is the thesis shareable as a public PDF?
- [ ] Decide: drop Instagram/TikTok from professional portfolio?
- [ ] Clarify: is "Brevet A & B Taxation" (IAI) the same as "Brevet Pajak AB" (UGM) — or two different credentials?

These are **content decisions**, not design decisions. Design can't rescue missing content.
