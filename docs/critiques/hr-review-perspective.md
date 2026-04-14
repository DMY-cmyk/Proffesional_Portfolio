# HR Review Perspective — Simulated Reviewer Notes

**Reviewer profiles simulated:**
- A — Talent manager at Big 4 Indonesia audit firm (PwC/EY/KPMG/Deloitte)
- B — Admissions reviewer at an international MSc Accounting program
- C — Recruiter on LinkedIn browsing candidate profiles
- D — Hiring manager at a mid-size corporate finance team

Each reviewer spends 30–90 seconds on first pass. They are looking for reasons to filter OUT, not to accept. The bar is ruthless.

---

## Reviewer A — Big 4 Audit Firm Talent Manager

**What they're looking for:** credibility, compliance-mindset, no red flags, clean signal of career progression, recognized credentials (Brevet, PPAk, CA, ACCA, CPA track), internship/volunteer proofs.

**First-pass impression of current site:**
- ❌ "Aurora animation and custom cursor. This isn't how our candidates usually present themselves. Flag: may not understand industry norms."
- ❌ "Skill bars with percentages. Nobody in audit self-rates at 80%. This gets dismissed in candidate screens."
- ✅ "Tax Volunteer at DJP — good. Concrete volume (90+ taxpayers, 200+ outreach). This is real."
- ❌ "Only 1 certification. Where's the rest? Brevet AB appears twice as IAI and UGM — confusing."
- ⚠️ "Where does he work now? Current role is there but buried in a timeline. Should be immediately visible."
- ⚠️ "Thesis topic is good (sustainability reporting × firm value) but it's one bullet. I want to see it as a featured piece."
- **Verdict:** *Probably passes first screen because of the DJP experience, but the site actively works against him.*

**What would help:**
- Persistent "Download CV" button
- Current role + institution visible above the fold
- Consolidated Credentials section (certifications + courses in one list)
- Remove skill percentages
- Remove flashy motion

---

## Reviewer B — International MSc Admissions Committee

**What they're looking for:** thesis depth, research methodology hints, English fluency signal, publications (even working papers), academic awards, GPA/honours if applicable.

**First-pass impression of current site:**
- ❌ "I navigated to /research expecting their thesis. I got *'Placeholder Research Paper Title'* with *'This is a placeholder abstract'*. **Dismissed.**"
- ❌ "Animated background and custom cursor on a research-intended site. Tonally off for academic review."
- ⚠️ "Thesis mentioned in education only. Cannot evaluate methodology, variables, findings. No PDF, no abstract, no preview."
- ❌ "No visible statement of research interests. No list of courses completed. No grad-school-relevant detail."
- **Verdict:** *Fails. The placeholder alone disqualifies.*

**What would help:**
- Replace placeholder immediately
- Thesis as a featured card with abstract + tags (sustainability reporting, firm value, manufacturing) + methodology note + optional PDF
- Research interests statement ("My work focuses on…")
- List of relevant coursework if applicable
- Scholarly typography (serif display, paper background)
- Remove flashy effects

---

## Reviewer C — LinkedIn Recruiter (generalist)

**What they're looking for:** quick match to open reqs (finance, accounting, audit, tax), currency/location, reachability, something interesting that distinguishes the candidate.

**First-pass impression of current site:**
- ✅ "Nice site, clearly someone who cares about presentation."
- ⚠️ "But I can't tell what roles he's open to. 'Accounting & Finance Professional' is too broad."
- ⚠️ "His current role is Operations Officer — that's a pivot from finance. Is he leaving finance? Worth a message to ask."
- ✅ "LinkedIn link at bottom, I can click through."
- ❌ "No clear 'open to opportunities' signal. No location ribbon in hero."
- **Verdict:** *Might click LinkedIn, might not send InMail.*

**What would help:**
- Specific role signal ("Seeking: tax / audit / financial analysis roles")
- Current role + location above the fold
- Prominent LinkedIn icon in navbar
- Clear, searchable tag cloud for skills (so ATS-style scanning works)

---

## Reviewer D — Mid-size Corporate Finance Hiring Manager

**What they're looking for:** practical competencies, tool familiarity, specific quantified impact, cultural fit signal.

**First-pass impression of current site:**
- ✅ "Finance Ops Staff → Operations Officer progression at same company. Shows he earned a promotion. Good."
- ✅ "Specific metrics in Tax Volunteer role (90+ taxpayers, 30% on-time improvement, 200+ outreach). This is rare — most junior candidates don't quantify. Strong."
- ⚠️ "Tools listed (SAP, MYOB, e-SPT, Excel, SPSS) but I can't tell what he's actually used at work vs. learned at school."
- ⚠️ "No impact metrics for the finance ops role yet. What did he actually improve? Can he tell a numbers story?"
- **Verdict:** *Interesting candidate, would probably shortlist but with questions.*

**What would help:**
- Per-role impact bullets (ideally quantified) for the current finance/ops roles
- Tool ownership clarified (work vs. academic use)
- A short "How I work" or "What I'm good at" paragraph, not skill bars

---

## Pattern Across Reviewers

**Common failures of the current design:**
1. Placeholder research = instant disqualification for academic reviewer
2. Aesthetic mismatch (flashy motion on a finance portfolio) = reduced credibility for all reviewers
3. Skill percentages = universally disliked
4. Research buried = misses the highest-leverage content for audience D
5. Current role/location not visible above the fold = friction for all reviewers
6. Only 1 cert, empty awards = sections look undersupplied

**Common strengths (keep these):**
1. Quantified impact in Tax Volunteer role — rare and powerful
2. Clear career progression at one company (FinOps → Ops Officer)
3. DJP volunteer experience is a strong government-linked credential
4. Thesis topic (sustainability reporting × firm value) is a credible, timely research area
5. LinkedIn is linked (though should be more prominent)

---

## Redesign Must-Haves (from HR perspective)

1. **Above-the-fold status line:** `Bachelor of Accounting @ STIE YKPN · Operations Officer @ Kolosal AI · Jakarta, Indonesia`
2. **CV download** as a primary action, persistent in navbar
3. **Research as a top-fold section** with thesis as a featured card
4. **Replace skill bars** with categorized tag cloud + proof (years, where used)
5. **Consolidate Credentials** (certifications + courses + awards) into one clean section
6. **Remove visual noise** (aurora, cursor, shimmer, particles)
7. **Per-role impact bullets** with numbers where possible for every role
8. **LinkedIn + email** in navbar + hero
9. **Clear positioning line** after name (something like: *"Early-career accounting professional focused on tax, audit, and sustainability reporting research."*)
10. **Print-friendly layout** — a reviewer should be able to Cmd+P and get a usable CV-like document
