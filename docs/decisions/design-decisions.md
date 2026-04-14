# Design Decisions Log

A short, dated log of the key design decisions made during the redesign brainstorm. Each decision captures the *why*, not just the *what*, so future-you (or anyone else touching the design) can reason about edge cases.

---

## 2026-04-14 · Primary audience: D + E

**Decision:** Primary viewers are graduate-school admissions reviewers (D) and the mixed professional network (E).

**Why:** The owner explicitly chose these two. Combined, they mean the portfolio must signal *substance and research depth* while remaining broadly legible to non-academic visitors.

**How to apply:** When any downstream decision is unclear, pick the option that preserves research credibility without alienating a generalist recruiter.

---

## 2026-04-14 · Direction C — Research Journal

**Decision:** Of three proposed directions (A Editorial Scholar / B Modern Minimal / C Research Journal), C is the chosen direction.

**Why:** C balances both audiences. A skews too academic for E; B skews too generic for D. C uses serif display with clean sans body and a deep teal primary with a restrained gold *highlight* (not a decoration) to signal academic gravitas without stuffiness.

**How to apply:** Don't drift toward A (too stuffy) or B (too startup). When in doubt, reduce ornament, sharpen content hierarchy.

---

## 2026-04-14 · Default theme → Light

**Decision:** The default theme flips from dark to light (cool cream `#fbf9f4` on ink `#0f1419`). Dark remains available via the theme toggle.

**Why:** Dark-default portfolios read as "creative/dev/design" to the target audience. Light cream paper on deep ink reads as "serious publication / academic personal page" — which is exactly the positioning Direction C demands.

**How to apply:** If dark mode usage analytics ever show consistent preference, re-evaluate. For now, light is canonical.

---

## 2026-04-14 · Remove motion effects

**Decision:** Aurora canvas, custom cursor, particle effects, name shimmer gradient, and avatar glow pulse are all removed.

**Why:** Each one individually reads as "creative portfolio" rather than "finance/accounting professional." Collectively, they overwhelm the content. Restraint is the credibility signal for this audience.

**How to apply:** Adding any ambient/decorative motion going forward requires an explicit design justification tied to content clarity, not vibe. "Because it looks cool" is not sufficient.

---

## 2026-04-14 · Skill percentages eliminated

**Decision:** Remove all numeric skill levels (the 65–90% bars). Replace with tag pills that carry an optional **context label** (e.g., `· applied`, `· coursework`, `· daily`, `· DJP`).

**Why:** Self-rated percentages are the single most reliably-mocked pattern in HR-reviewed portfolios. For finance in particular — where skills are verifiable through certifications and billable experience — numeric self-assessments actively damage credibility. The context label does the same job honestly: it tells a reviewer *where* a skill was exercised, which is what they actually care about.

**How to apply:** Never reintroduce skill % bars under any redesign iteration. The `level` field in `SkillItem` is deprecated; don't read it.

---

## 2026-04-14 · Research → homepage flagship

**Decision:** Research moves from a sub-page (`/research`) to a dedicated section on the homepage, positioned immediately after the hero as Section 01.

**Why:** For audience D, research is the single highest-leverage content the site owns. Hiding it behind a nav click costs the majority of visitors ever seeing it. The sub-pages (`/research/[slug]`) are retained for detail views.

**How to apply:** Never let the homepage IA quietly re-demote Research. If a future section (e.g., "Projects") is added, it goes *after* Research, not before.

---

## 2026-04-14 · Thesis as featured card, not bullet

**Decision:** The undergraduate thesis *"The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector"* becomes a Featured card in the Research section — with abstract, tags, methodology note, and optional PDF. Its mention in Education shrinks to a pointer.

**Why:** The thesis is the strongest single academic artifact on the site. For grad-school admissions review, it is the primary evaluation signal. Bullet-point treatment squanders it.

**How to apply:** Any subsequent research that reaches thesis-level significance can take the Featured slot. Only one Featured card at a time — don't dilute by featuring three things simultaneously.

---

## 2026-04-14 · Credentials consolidated

**Decision:** Separate sections for Certifications, Courses, and Awards collapse into a single Credentials section with two columns (Certifications / Training).

**Why:** With only 1 certification, 0 awards, and 2 courses today, three separate sections emphasize emptiness. Consolidation makes the section look substantive at current content density and allows growth without restructuring.

**How to apply:** If awards reach ≥3 entries, promote to a third column. Don't split into separate top-level sections again.

---

## 2026-04-14 · Personal socials dropped from professional portfolio

**Decision:** Instagram and TikTok links are removed from rendered contact UI. LinkedIn, email, and GitHub remain.

**Why:** Audience D+E reads IG / TikTok as noise or personal branding at best, dilution at worst. The tax-literacy TikTok work is valuable *content* and belongs in the Tax Volunteer bullet as *"designed tax-literacy content for Instagram and TikTok"* — not as a clickable follow link.

**How to apply:** Re-adding personal socials requires creating a separate `/personal` or similar subpage — never in the main professional contact section.

---

## 2026-04-14 · Thesis shown as abstract-only (no PDF download)

**Decision:** The Featured Thesis card links to the existing MDX detail page (`/research/sustainability-reporting-firm-value`) rather than a PDF download. Full PDF is not publicly hosted.

**Why:** Owner elected to keep the full paper private while exposing abstract and key findings. The abstract + MDX detail satisfies grad-school reviewers' need to evaluate substance; full-paper requests can still come via email.

**How to apply:** If thesis PDF ever becomes public, add `/files/research/thesis.pdf`, update `ResearchEntry.pdfPath`, extend `.gitignore` exception, and switch the card's CTA from "Read abstract" to "Read abstract & download PDF."

---

## 2026-04-14 · Thesis advisor name omitted

**Decision:** Do not render the thesis advisor's name anywhere in the UI.

**Why:** Owner preference. Advisor attribution is a personal / relational detail that doesn't belong on a public portfolio unless the owner wants it there.

**How to apply:** The `ResearchEntry.advisor` field remains in the schema (optional) in case future entries want it — but the Featured Thesis card renders without it.

---

## 2026-04-14 · Thesis is the only research entry for initial launch

**Decision:** The Research section's secondary grid is hidden on launch because only the thesis exists. The grid markup is built but conditionally rendered (`research.length > 1`).

**Why:** Owner confirmed E (more than thesis exists) at brainstorm time but hasn't provided concrete entries yet. Shipping with a visibly empty grid would signal the same thinness the audit flagged. Conditional rendering preserves the design for when real entries arrive.

**How to apply:** When a second research entry is added, the grid should render automatically without design changes. Never hard-code "Coming soon" placeholders in the grid.

---

## 2026-04-14 · Brevet: keep IAI, remove UGM duplicate

**Decision:** The IAI `Brevet A & B Taxation` entry stays in `certifications.json`. The UGM `Brevet Pajak AB` entry is removed from `courses.json`.

**Why:** Owner confirmed these are the same credential listed twice by mistake. IAI (Ikatan Akuntan Indonesia) is the professional accounting body — its certification is the authoritative version.

**How to apply:** If it turns out the two were actually different credentials after all (e.g., IAI = professional cert, UGM = separate training course), the removed UGM entry can be restored from git history. Re-evaluate after content review.

---

## 2026-04-14 · Personal socials moved to `/personal` subpage

**Decision:** Instagram and TikTok links move from the main contact section to a new `/personal` page, linked only from the footer's right-aligned `personal →` link.

**Why:** Owner wants the personal/creative content accessible but separated from the professional portfolio. This lets audience D/E see the clean professional surface while curious visitors can still find the personal brand.

**How to apply:** `/personal` is intentionally minimal — name, portrait, one paragraph, two links. Don't turn it into a second portfolio. If the personal side ever grows, it moves to a separate domain.

---

## 2026-04-14 · Site title uses pipes-as-middots format

**Decision:** `site.json.title` becomes `Dzaki Muhammad Yusfian — Accounting · Finance · Tax · Audit Enthusiast` (user-supplied wording; pipe separators rendered as middots).

**Why:** Owner's preferred framing emphasizes breadth across finance subdomains and positions as an enthusiast rather than over-claiming seniority. The middot rendering is a typographic choice — pipes render poorly at display sizes across browsers.

**How to apply:** Keep "Enthusiast" at the end; don't promote to "Professional" or "Specialist" unless owner says so explicitly. It's a deliberate signal of early-career humility.

---

## 2026-04-14 · Print-fidelity as a requirement, not a nice-to-have

**Decision:** A dedicated print stylesheet is part of the redesign scope. Printing the site must produce a clean CV-like document.

**Why:** A surprising number of recruiters still print portfolios to add to candidate files. A messy print output is a passive signal that the owner doesn't think about real-world workflows.

**How to apply:** Any new section or component must be print-tested before the redesign is called done.
