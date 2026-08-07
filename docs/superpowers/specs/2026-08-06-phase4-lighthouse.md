# Phase 4 Lighthouse Comparison

## Baseline (before Phase 4, 2026-08-06)

| Category | Score |
|---|---|
| Performance | 85 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |

Measured on `/` (static export served locally under basePath), headless Chrome, default Lighthouse config (mobile emulation, throttled — no `--preset=desktop` was passed). Ran with `lighthouse@13.4.1` via:

```
npx lighthouse http://localhost:3999/Proffesional_Portfolio/ --quiet --chrome-flags="--headless" --output=json --output-path=scratch-lh/baseline.json
```

Plan 3 Stage 10 must reuse this exact command (same config, no `--preset=desktop`) for the before/after comparison to be valid.

## Final (after Phase 4)

| Category | Score | Delta vs Baseline |
|---|---|---|
| Performance | 85 | 0 |
| Accessibility | 92 | -4 |
| Best Practices | 96 | 0 |
| SEO | 100 | 0 |

Re-run after the final-review fixes (LanguageToggle target-size/contrast a11y fix + nav-labels-via-ui-strings wiring, 2026-08-06) using the exact pinned command below — same config as baseline, no `--preset=desktop`:

```
npx lighthouse http://localhost:3999/Proffesional_Portfolio/ --quiet --chrome-flags="--headless" --output=json --output-path=scratch-lh/final.json
```

Performance recovered to the baseline score (delta 0, no drop >5, so no opportunities list is required by the audit procedure). Metric detail: Largest Contentful Paint scored 0.55 (3.8 s, weight 25), Total Blocking Time scored 0.95 (140 ms, weight 30), First Contentful Paint scored 0.80 (2.1 s, weight 10), Speed Index scored 0.99 (2.1 s, weight 10), Cumulative Layout Shift scored 1.0 (weight 5).

Accessibility is still 92 (delta -4, within the 5-point no-opportunities-list threshold). Verified in `final.json` that `target-size` (the LanguageToggle hit-area audit fixed in this pass) now scores 1 with zero failing elements — the fix works. The score did not move because two other audits still fail: `color-contrast` (weight 7) on `text-subtle` (#718096) spans in the stats strip and footer, and `aria-prohibited-attr` (weight 7) on the `aria-label`-bearing `<span>` with no ARIA role in the hero's `WordReveal` markup. Provenance correction (re-review finding): `aria-prohibited-attr` is a **Phase 4 regression, not pre-existing** — `WordReveal` was added in Plan 1 (`eba4880`) with `role="text"`, and Plan 1's own fix wave (`eec1b13`) removed that role (nonstandard) without replacing the pattern, leaving `aria-label` on a role-less span.

## Accessibility follow-up (2026-08-07) — `aria-prohibited-attr` fixed

`WordReveal` no longer sets `aria-label` on its wrapper span. The full text now lives in a visually hidden `sr-only` child, so the accessible name comes from real content while the animated per-word spans stay `aria-hidden="true"`. Re-measured with the same pinned command:

| Category | Score | Delta vs Baseline | Delta vs Phase 4 Final |
|---|---|---|---|
| Performance | 85 | 0 | 0 |
| Accessibility | **96** | **0** | **+4** |
| Best Practices | 96 | 0 | 0 |
| SEO | 100 | 0 | 0 |

`aria-prohibited-attr` now scores 1 with 0 failing elements, and Accessibility is back to the pre-Phase-4 baseline of 96. The Phase 4 accessibility regression is fully closed.

## Accessibility follow-up (2026-08-07, second pass) — `color-contrast` fixed → **Accessibility 100**

The `--subtle` token was too light for small text. Lighthouse reported 6 failing elements, all of them `--subtle` at 11–12px: the four stats-strip labels (3.88:1 on the blended `--surface-alt`) and two footer spans (3.81:1 on `--background`). Computing the ratios across every token pair showed the same token also failed in **both** dark-theme surfaces (3.39–3.83:1) — invisible to Lighthouse, which only audits the light theme.

The worst case is the *darkest* light background (`--background` #fbf9f4) and the *lightest* dark background (`--surface` #1a2028), so the token was raised until it clears 4.5:1 there, with a small margin, while staying visually lighter than `--muted` so the three-level type hierarchy survives:

| Theme | Token | Before | After | Worst-case ratio |
|---|---|---|---|---|
| Light | `--subtle` | #718096 (3.82:1) | **#657287** | 4.63:1 on `--background` |
| Dark | `--subtle` | #71717a (3.39:1) | **#878790** | 4.60:1 on `--surface` |

Result: `color-contrast` scores 1 with **0 failing elements**, and **Accessibility reaches 100**. `tests/styles/token-contrast.test.ts` now parses the tokens straight out of `globals.css` and asserts every text token clears 4.5:1 against every background token in both themes, plus the hierarchy ordering — so this cannot silently regress again.

**Performance note — do not read the numbers from this pass as a regression.** Both post-fix runs reported Performance 53, but an A/B measurement on the *pre-fix* build under the same machine load reported 55 (TBT 700 ms, LCP 5.2 s) against 85 earlier the same day on identical JS. A two-hex-value CSS change cannot move TBT by an order of magnitude; the machine was simply loaded. The Performance figure of record remains **85** from the quiet run above. Re-measure on an idle machine before drawing any performance conclusion.

Still open (pre-existing, no score impact):
- `label-content-name-mismatch` (weight 0) — the navbar "Ctrl K" chip's visible text is not part of its accessible name ("Open command palette").
