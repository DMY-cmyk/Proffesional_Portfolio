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

Accessibility is still 92 (delta -4, within the 5-point no-opportunities-list threshold). Verified in `final.json` that `target-size` (the LanguageToggle hit-area audit fixed in this pass) now scores 1 with zero failing elements — the fix works. The score did not move because two other audits still fail: `color-contrast` (weight 7) on `text-subtle` (#718096) spans in the stats strip and footer, and `aria-prohibited-attr` (weight 7) on the `aria-label`-bearing `<span>` with no ARIA role in the hero's `WordReveal` markup. Provenance correction (re-review finding): `aria-prohibited-attr` is a **Phase 4 regression, not pre-existing** — `WordReveal` was added in Plan 1 (`eba4880`) with `role="text"`, and Plan 1's own fix wave (`eec1b13`) removed that role (nonstandard) without replacing the pattern, leaving `aria-label` on a role-less span. Fix direction for the follow-up: keep the full headline readable via a visually-hidden text node (or `role="heading"`-safe pattern) instead of `aria-label` on a generic span. Both audits are the next accessibility follow-up; neither was introduced by this fix pass itself.
