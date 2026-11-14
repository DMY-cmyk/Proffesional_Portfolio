# Plan Baseline and Working Rules — Professional Portfolio (Dzaki)

## Goal

Dzaki's own professional portfolio site (accounting, finance, tax, audit; research on sustainability reporting and firm value). The site is public on GitHub Pages and is meant for recruiters, lecturers, and professional peers. This plan records the state of the project as of 13/11/2026, the criteria for a "healthy project", and the working rules for later changes. This plan is **not** an instruction to change code now.

### Problem statement

The public portfolio site has a baseline but its test results have not been re-run on this laptop, and every push to `main` publishes immediately, so unverified changes can reach recruiters and lecturers.

### Measurable targets

- T1. Tests and build are re-run and recorded (AC1–AC3); date: not applicable (no deadline in this plan's sources).
- T2. The README test count matches reality (AC4), and AC5 and AC6 are checked before any content change is pushed.

### Deliverables

- D1. Recorded test and build results in the Execution log.
- D2. A README update plan if the test count differs.

## Current state (evidence, verified 2026-11-13)

Repository
- Git, active branch `main`, remote `origin` = `DMY-cmyk/Proffesional_Portfolio` (public). The working tree was clean before this plan was written (the initial `git status` snapshot was empty).
- Last commit `b9d2a5a` 2026-08-08 "fix(a11y): explicit list role on article MDX lists". No open PRs (`gh pr list --state open` empty).
- The last three GitHub Actions runs of "Deploy to GitHub Pages" have status `success` (latest 2026-08-08, `gh run list -L 3`).

Technology and commands
- Next.js `^15.5.13`, React `^19.2.4`, Tailwind CSS `^4.2.1`, Vitest `^4.1.0` (`package.json:31`, `package.json:33`, `package.json:52`, `package.json:54`).
- Scripts: `dev`, `build`, `prebuild` (generates OG images), `lint`, `test`, `test:run` (`package.json:7-14`).
- Static export with `basePath` `/Proffesional_Portfolio` in production (`next.config.ts:6-11`).
- The `node_modules/` folder was **not present** on disk when checked, so tests cannot run without `npm ci` (needs network).

Tests and publishing
- The README records **357 tests in 75 test files** (`README.md:148-150`). Current file count: `find tests -name '*.test.*'` = **76**. This difference of one is not yet explained.
- The site publishes automatically to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml:3-5`); the CI flow runs `npm ci` → `npm run test:run` → `npm run build` (`.github/workflows/deploy.yml:34-40`). This means **a push to `main` = publishing to the public**.
- Site address: `README.md:5`.

Existing planning documents
- `docs/superpowers/specs/` (6 files) and `docs/superpowers/plans/` (6 files); the latest is `docs/superpowers/plans/2026-08-08-article-typography.md` and its paired spec.
- Change history in the README Changelog section (`README.md:162`); latest entry "Article Typography — Hybrid Journal (2026-08-08)" (`README.md:164`).
- There was no `docs/plan/` folder before this plan.

Sensitive files
- The contact form uses the Web3Forms service with an access key in client-side code (`src/components/ui/contact-form.tsx:72`); its value is not copied into this plan.
- The thesis PDF in the repo root is not tracked by git (`.gitignore` lists `*.pdf`, except `public/files/cv/*.pdf`); its contents were not opened.

## Gap inventory

1. **No active work recorded** since 2026-08-08; no written follow-up roadmap after Phase 4 (`README.md:164-205`).
2. **The test count in the README may be stale**: 75 files in the README vs 76 files on disk (see Current state).
3. **Dependencies are not installed on the laptop** (`node_modules/` absent), so the local test status as of today is not yet proven.
4. **Risk of accidental publishing**: every push to `main` immediately publishes the public site (`.github/workflows/deploy.yml:3-5`); there is no preview stage.
5. **Web3Forms key in client code** (`src/components/ui/contact-form.tsx:72`): Web3Forms keys are designed to be public, but it still needs checking that domain/spam restrictions in the Web3Forms dashboard are active (not yet proven).
6. **Node version in CI** = 20 (`.github/workflows/deploy.yml:30`) while the workflow forces JavaScript actions onto Node 24 (`.github/workflows/deploy.yml:17-18`); there is no written decision yet on the local Node version.

## Decisions

Decisions already recorded:
- **Static export to GitHub Pages** (`next.config.ts:6-11`, `README.md:152-160`). The source names no rejected alternative.
- **"Research journal" style** (cream paper, Newsreader serif typography, teal + gold): `README.md:7`, `README.md:42-50`, `README.md:230-243`.
- **"Hybrid journal" article typography** (2026-08-08): spec `docs/superpowers/specs/2026-08-08-article-typography-design.md`; summary in `README.md:164-173`.
- **Bilingual EN/ID** (Phase 4 Plan 3, 2026-08-06): `README.md:197-203`.

Decisions of this plan:
- The baseline plan lives in `docs/plan/`. Rejected: adding a section to the README (the README is a public document and not the place for plans).

## Acceptance criteria

- **AC1** Given a clean copy of the repo, when `npm ci && npm run test:run` is run, then all tests pass (0 failures) and the number of tests and test files matches the figures in the README.
- **AC2** When `npm run build` is run, then the static export completes without errors and the `out/` folder is created.
- **AC3** When `npm run lint` is run, then there are no lint errors.
- **AC4** The test figures in the `README.md` Testing section match the result of AC1 (fixing Gap 2).
- **AC5** The last GitHub Actions run on `main` has status `success`, and the site at the address in `README.md:5` responds with HTTP 200.
- **AC6** No secrets in the public repo: `git ls-files` lists no `.env*` (other than examples), `*.pem`, or PDF files other than `public/files/cv/*.pdf`; a keyword scan of the diff finds no tokens/passwords.
- **AC7** Every later change has a plan in `docs/plan/` or `docs/superpowers/plans/` with numbered ACs before its code is written, and pushes to `main` happen only with Dzaki's permission in chat.

## Execution phases

1. Install dependencies (`npm ci`) on the laptop, then run AC1–AC3; record the results in the Execution log.
2. If the test count differs from the README, write a small plan to update the README (AC4).
3. Check AC5 and AC6.
4. New feature work (if any) starts with its own plan.

### Work breakdown & dependencies

| # | Task | Depends on |
|---|---|---|
| 1 | Install dependencies and run AC1–AC3 | — |
| 2 | README update plan if the test count differs (AC4) | 1 |
| 3 | Check AC5 and AC6 | 1 |
| 4 | New features start with their own plan | 3 |

### Milestones

Not applicable (this baseline names no delivery date). Milestones with buffers go into each feature plan.

### Roles (RACI)

| Deliverable/phase | R | A | C | I |
|---|---|---|---|---|
| Tests, plans, changes | Claude | Dzaki | — | — |
| Push to `main` (publishes) | Dzaki | Dzaki | — | site visitors (via the live site) |

### Resources & budget

- Technical: Node/npm (`npm ci`), the existing build and test scripts, GitHub Pages CI
- Budget: not applicable (GitHub Pages hosting; no spending in this plan)

### Stakeholder communication

| Who | When/trigger | Channel | Content |
|---|---|---|---|
| Dzaki | after each phase and before any push | chat | AC status and permission requests |

## Test plan

| AC | Check/test name | Command or method | Status today |
|---|---|---|---|
| AC1 | `tes-unit` | `npm ci` then `npm run test:run` | not run (reason: `node_modules/` is absent; `npm ci` needs network and writes to the repo) |
| AC2 | `build-statis` | `npm run build`; check that `out/` exists | not run (reason: same as AC1) |
| AC3 | `lint` | `npm run lint` | not run (reason: same as AC1) |
| AC4 | `cocok-readme` | compare the AC1 output with `README.md:148-150` | not run (reason: depends on AC1) |
| AC5 | `ci-dan-situs` | `gh run list -L 1` = `success`; `curl -I` on the site address = 200 | not yet proven: the last run was `success` (2026-08-08); the site was not checked |
| AC6 | `tanpa-rahasia` | `git ls-files \| grep -E '\.env\|\.pem$\|\.pdf$'` yields only the CV; keyword scan (token, password, secret, key) on the diff | not run (reason: not recorded in the original plan) |
| AC7 | `plan-dulu` | every new feature commit has a plan file referenced in the commit message or plan | not yet proven (applies from now on) |

### Test types

- UAT: Dzaki reviews every content change on the site before it is pushed.
- Security: a personal-data check on content changes before push, because the site is public.
- Performance: not applicable (no performance target is stated in this plan's sources)

## Verification

- AC1–AC6 are checked with the commands in the Test plan; each result is recorded in the Execution log with the status `pass / fail / not yet proven / not run (reason)`.
- AC7 is checked per later change by looking for its plan file before its first code commit.

## Files this plan will touch

- Added: `docs/plan/2026-11-13-baseline-dan-aturan-kerja.md` (this plan).
- Changed: none by this plan. Phase 2 may later change `README.md` (Testing section) through its own plan.

## Risk & rollback

| Risk | Type | Prevention | Plan B |
|---|---|---|---|
| A push to `main` publishes immediately | technical | work on a separate branch; push only with Dzaki's permission | `git revert` the last commit and push (CI republishes the previous version) |
| Personal data on the public site | non-technical (privacy) | Dzaki checks every content change before pushing | remove the content and republish |
| `npm ci` changes `package-lock.json` | technical | check `git status` afterwards | `git checkout -- package-lock.json` |

- **A push to `main` publishes to the public immediately.** Mitigation: work on a separate branch; push only with Dzaki's permission. Rollback: `git revert` the last commit and push (CI republishes the previous version).
- **Personal data on the public site** (contact, CV). Mitigation: every content change is checked by Dzaki before pushing.
- **`npm ci` changes `package-lock.json`** if the npm version differs. Mitigation: check `git status` afterwards; restore with `git checkout -- package-lock.json` if unintended.

## Non-goals

- No site redesign and no new features.
- No upgrade of Next.js/React/Tailwind.
- No change to content, the CV, or the contact form.

## Execution log

- 2026-11-13 baseline written; nothing executed.
- 2026-11-14 translated into English (this repo is public) and aligned with the v1 section order: the former "Langkah kerja berikutnya" became Execution phases, the former check table became the Test plan, and a Verification section was added; the working-rules summary section was removed and the decision note no longer cites private rules; statuses use the standard vocabulary. Every AC, every `path:line` reference, and every decision is kept. The Indonesian original is in commit `8d9d621`.
- 2026-11-14 review fixes: a local snapshot path in Current state was replaced by a plain description, and the AC6 status reason now says it was not recorded in the original plan.

- 2026-11-14 — Extended to the updated plan template: Problem statement, Measurable targets, Deliverables, Test types, Work breakdown & dependencies, Milestones, Roles (RACI), Resources & budget, Stakeholder communication, a risk table with a Plan B column, and Plan revisions were added, derived from this plan's own sections. No existing line and no acceptance criterion was changed.

### Plan revisions

Plan revision: 2 (2026-11-14)

| Revision | Date | What changed | Why | Approved |
|---|---|---|---|---|
| 1 | 2026-11-13 | baseline plan written | baseline for every project | Dzaki |
| 2 | 2026-11-14 | updated plan template elements added; acceptance criteria unchanged | plan template update | Dzaki |

Re-review triggers: direction or scope changes, a new request from the owner, a moved deadline, reviewer findings, or a production incident.
