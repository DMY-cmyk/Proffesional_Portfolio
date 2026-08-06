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
| Performance | 79 | -6 |
| Accessibility | 92 | -4 |
| Best Practices | 96 | 0 |
| SEO | 100 | 0 |

Measured the same way as the baseline: `/` (static export served locally under basePath), headless Chrome, default Lighthouse config (mobile emulation, throttled — no `--preset=desktop`). Ran with `lighthouse@13.4.1` via the exact pinned command:

```
npx lighthouse http://localhost:3999/Proffesional_Portfolio/ --quiet --chrome-flags="--headless" --output=json --output-path=scratch-lh/final.json
```

Performance dropped 6 points (>5), so the top 3 Lighthouse opportunities from `final.json` are listed below:

1. **Reduce unused JavaScript** — Est. savings of 22 KiB / 290 ms (`unused-javascript`).
2. **Initial server response time was short** — passed, 0 ms in savings (`server-response-time`); listed only because no other opportunity audit reported savings beyond #1.
3. **Avoid multiple page redirects** — passed, 0 ms in savings (`redirects`); listed only because no other opportunity audit reported savings beyond #1.

Note: only the "Reduce unused JavaScript" audit reported measurable savings; the rest of the Opportunities section audits (minify CSS/JS, reduce unused CSS) were already passing with 0 ms savings. The Performance score drop is primarily driven by weighted metric regressions rather than the Opportunities list: Largest Contentful Paint scored 0.51 (3.9 s, weight 25), Total Blocking Time scored 0.81 (280 ms, weight 30), First Contentful Paint scored 0.80 (2.1 s, weight 10), and Speed Index scored 0.89 (3.4 s, weight 10). Accessibility dropped 4 points (within the 5-point threshold, no opportunities listed per the audit procedure).
