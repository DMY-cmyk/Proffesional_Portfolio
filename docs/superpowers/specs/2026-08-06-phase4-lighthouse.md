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

_To be filled in Plan 3, Stage 10._
