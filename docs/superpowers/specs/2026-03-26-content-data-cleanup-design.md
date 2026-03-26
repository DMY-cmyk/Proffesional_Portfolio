# Content & Data Cleanup — Design Spec

**Status:** Approved
**Date:** 2026-03-26
**Sub-project:** 2 of 7 (P0 — Critical)

## Problem

The portfolio contains placeholder data in 6 content files, making the deployed site look unprofessional and incomplete. Real user data has been collected and needs to replace all placeholders.

## Solution

Direct data replacement in JSON/MDX content files. No code changes needed — the components already handle all fields correctly (including optional tiktok/instagram with conditional rendering).

### Changes

**1. contact.json** — Replace all placeholder values:
- email: `dmy.23022004@gmail.com`
- linkedin: `https://www.linkedin.com/in/dzakimyusfian/`
- github: `https://github.com/DMY-cmyk` (already correct)
- instagram: `https://instagram.com/dzaki_yusfian`
- tiktok: `https://tiktok.com/@dmy_0223`

**2. experience.json** — Replace with 3 real positions:
1. PT. Kolosal Kecerdasan Artifisial — Operations Officer (Mar 2026–present, Jakarta)
2. PT. Kolosal Kecerdasan Artifisial — Finance Operation Staff (Dec 2025–Mar 2026, Jakarta)
3. Direktorat Jenderal Pajak — Tax Volunteer (Jan 2025–Dec 2025, Yogyakarta)

**3. awards.json** — Set to empty array `[]`

**4. courses.json** — Replace with 2 real courses:
1. English for Professional Development — Duta Wacana Christian University (Jun 2023)
2. Brevet Pajak AB — Fakultas Ekonomika dan Bisnis UGM (Oct 2025, credential: 1113/UN1/EK.RSDI/DL/2025)

**5. education.json** — Fix school name and dates:
- School: STIE YKPN Business School Yogyakarta
- Degree: Bachelor of Accounting
- Dates: 2022-09 to 2026-04

**6. research/** — Replace placeholder MDX with real skripsi:
- Title: "Pengaruh Pengungkapan Laporan Keberlanjutan Terhadap Nilai Perusahaan Pada Sektor Manufaktur"
- English: "The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector"
- Date: 2025-12
- Tags: sustainability-reporting, firm-value, manufacturing, indonesia-stock-exchange

**7. downloads.json** — Copy CV PDF to `public/files/cv/`, update reference, remove presentation

## Files Changed

| File | Action |
|------|--------|
| `src/content/contact.json` | Edit — real contact info |
| `src/content/experience.json` | Edit — 3 real positions |
| `src/content/awards.json` | Edit — empty array |
| `src/content/courses.json` | Edit — 2 real courses |
| `src/content/education.json` | Edit — correct school/dates |
| `src/content/research/placeholder-research.mdx` | Delete |
| `src/content/research/sustainability-reporting-firm-value.mdx` | Create — real skripsi |
| `src/content/downloads.json` | Edit — CV only, correct path |
| `public/files/cv/dzaki-cv.pdf` | Create — copy from repo root |

## Testing

- Build succeeds (`npm run build`)
- All existing tests pass with 0 failures
- Verify all static pages generate (8 routes)

## Out of Scope

- Adding actual certificate PDFs (brevet-ab.pdf, etc.)
- Adding the skripsi PDF to downloads
- Profile photo (Sub-project 3)
