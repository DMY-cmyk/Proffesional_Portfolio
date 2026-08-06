# Indonesian Translation Review — Phase 4 Plan 3

**Status: AWAITING DZAKI'S REVIEW — do not deploy before approval.**
How to review: read the ID column; edit any wording you want changed directly in this file or tell Claude; the JSON files are the source of truth and will be updated to match your edits.

### ⚠ Items needing your decision

1. **"Operations Officer" → "Staf Operasional"** — this may erase the promotion signal from "Finance Operation Staff" (the two roles read as a clear step up in English but collapse into near-duplicate titles in Indonesian). Alternative: keep "Operations Officer" untranslated — the English title is common as-is in Indonesian resumes/LinkedIn profiles.
2. **Officer bullet grammar tweak** — bullet 1 for the Operations Officer role currently reads "...di bidang keuangan, administrasi, dan tim lintas fungsi", which mixes a list of domains with a list of teams under one "dan". Suggested alternative: "...di bidang keuangan dan administrasi, serta lintas tim fungsional" (separates the functional domains from the cross-team scope for cleaner Indonesian grammar).

## ui-strings.json

| Key | EN | ID |
|---|---|---|
| navResearch | Research | Riset |
| navExperience | Experience | Pengalaman |
| navEducation | Education | Pendidikan |
| navCredentials | Credentials | Kredensial |
| navSkills | Skills | Keahlian |
| navContact | Contact | Kontak |
| navNotes | Notes | Catatan |
| downloadCv | Download CV | Unduh CV |
| readResearch | Read my research → | Baca riset saya → |
| sectionResearch | Research | Riset |
| sectionExperience | Experience | Pengalaman |
| sectionEducation | Education | Pendidikan |
| sectionCredentials | Credentials | Kredensial |
| sectionSkills | Skills | Keahlian |
| sectionTestimonials | Testimonials | Testimoni |
| statYears | Years of experience | Tahun pengalaman |
| statPositions | Positions held | Posisi dijalani |
| statCertifications | Certifications | Sertifikasi |
| statResearch | Research works | Karya riset |
| contactEyebrow | Get in touch | Hubungi saya |
| contactHeading | Open to research collaboration, internships, and conversation. | Terbuka untuk kolaborasi riset, magang, dan diskusi. |
| contactBody | I'm currently open to discussions around tax, audit, and sustainability-reporting research — including graduate program opportunities. The fastest way to reach me is email or LinkedIn. | Saat ini saya terbuka untuk diskusi seputar pajak, audit, dan riset pelaporan keberlanjutan — termasuk peluang program pascasarjana. Cara tercepat menghubungi saya adalah lewat email atau LinkedIn. |
| contactEmailMe | Email me | Kirim email |
| formName | Name | Nama |
| formEmail | Email | Email |
| formMessage | Message | Pesan |
| formNamePlaceholder | Your name | Nama Anda |
| formEmailPlaceholder | you@example.com | anda@contoh.com |
| formMessagePlaceholder | How can I help you? | Ada yang bisa saya bantu? |
| formSend | Send Message | Kirim Pesan |
| formSending | Sending... | Mengirim... |
| formSuccessTitle | Message sent! ✓ | Pesan terkirim! ✓ |
| formSuccessBody | Thank you for reaching out. I'll get back to you soon. | Terima kasih sudah menghubungi. Saya akan segera membalas. |
| formSendAnother | Send another message | Kirim pesan lain |
| footerBuiltWith | Built with Next.js · GitHub Pages | Dibangun dengan Next.js · GitHub Pages |
| footerPersonal | personal → | personal → |
| minRead | min read | menit baca *(reserved — not yet rendered; article pages are English by design)* |

## profile.json

| Field | EN | ID |
|---|---|---|
| title | Accounting, tax & sustainability research | Akuntansi, pajak & riset keberlanjutan |
| tagline | Early-career accounting professional researching sustainability reporting and firm value. | Profesional akuntansi awal karier yang meneliti pelaporan keberlanjutan dan nilai perusahaan. |
| bio | Specializing in tax compliance, auditing, and financial analysis — with ongoing research on how sustainability reporting affects firm value in Indonesian manufacturing. Previously a Tax Volunteer at DJP, serving 90+ taxpayers and running community outreach across Bantul Regency. | Berfokus pada kepatuhan pajak, audit, dan analisis keuangan — dengan riset berkelanjutan tentang pengaruh pelaporan keberlanjutan terhadap nilai perusahaan manufaktur Indonesia. Sebelumnya Relawan Pajak di DJP, melayani 90+ wajib pajak dan menjalankan penyuluhan masyarakat di Kabupaten Bantul. |
| brandStatement | Transforming financial complexity into clarity. | Mengubah kompleksitas keuangan menjadi kejelasan. |
| headline.plain | Accounting, tax, & | Akuntansi, pajak, & |
| headline.emphasis | sustainability research | riset keberlanjutan |
| positioning | Early-career professional working at the intersection of financial reporting and sustainability disclosure. | Profesional awal karier yang bekerja di persimpangan pelaporan keuangan dan pengungkapan keberlanjutan. |

Notes:
- `headline.suffix` ("`.`") is a shared punctuation mark, not localized per-language.
- `statusLine` (`now`, `basedIn`, `education`) and `name` are single (non-`{en, id}`) fields not run through the language toggle; `statusLine.now` ("Operations Officer @ Kolosal AI") stays in its authored English/mixed form regardless of the language toggle.

## experience.json

### PT. Kolosal Kecerdasan Artifisial — Operations Officer

| Field | EN | ID |
|---|---|---|
| role | Operations Officer | Staf Operasional |
| bullet 1 | Leading end-to-end operational workflows across finance, administration, and cross-functional teams | Memimpin alur kerja operasional menyeluruh di bidang keuangan, administrasi, dan tim lintas fungsi |
| bullet 2 | Driving process improvements and operational efficiency initiatives to support company scaling objectives | Mendorong perbaikan proses dan inisiatif efisiensi operasional untuk mendukung target skalabilitas perusahaan |

### PT. Kolosal Kecerdasan Artifisial — Finance Operation Staff

| Field | EN | ID |
|---|---|---|
| role | Finance Operation Staff | Staf Operasional Keuangan |
| bullet 1 | Oversaw end-to-end daily finance operations including AP/AR management, invoice processing, and payment/collection activities | Mengawasi operasional keuangan harian secara menyeluruh, termasuk pengelolaan AP/AR, pemrosesan invoice, dan aktivitas pembayaran/penagihan |
| bullet 2 | Executed account reconciliations and contributed to month-end financial closing including adjusting entries and financial statement preparation | Melaksanakan rekonsiliasi akun dan berkontribusi pada penutupan buku bulanan, termasuk jurnal penyesuaian dan penyusunan laporan keuangan |
| bullet 3 | Ensured integrity and completeness of financial records and documentation, maintaining high standards of accuracy and compliance | Memastikan integritas dan kelengkapan catatan serta dokumentasi keuangan dengan menjaga standar akurasi dan kepatuhan yang tinggi |
| bullet 4 | Produced regular financial reports and delivered budget and forecast variance analysis to support management decision-making | Menyusun laporan keuangan berkala dan menyampaikan analisis varians anggaran serta proyeksi untuk mendukung pengambilan keputusan manajemen |

### Direktorat Jenderal Pajak — Tax Volunteer

| Field | EN | ID |
|---|---|---|
| role | Tax Volunteer | Relawan Pajak |
| bullet 1 | Assisted 90+ individual taxpayers and entrepreneurs in accurately filing SPT PPh 23 returns, reducing errors and increasing on-time submissions by 30% | Membantu 90+ wajib pajak orang pribadi dan pelaku usaha dalam pelaporan SPT PPh 23 secara akurat, mengurangi kesalahan dan meningkatkan pelaporan tepat waktu sebesar 30% |
| bullet 2 | Spearheaded community outreach programs in Bantul Regency, educating 200+ taxpayers on compliance benefits and contributing to the Patuh Pajak initiative | Memimpin program penyuluhan masyarakat di Kabupaten Bantul, mengedukasi 200+ wajib pajak mengenai manfaat kepatuhan dan berkontribusi pada inisiatif Patuh Pajak |
| bullet 3 | Designed and promoted tax literacy campaigns on Instagram & TikTok, simplifying complex tax concepts into digestible content to enhance public trust | Merancang dan mempromosikan kampanye literasi pajak di Instagram & TikTok, menyederhanakan konsep pajak yang kompleks menjadi konten yang mudah dipahami untuk meningkatkan kepercayaan publik |
| bullet 4 | Resolved tax challenges through consultation and pioneered Core Tax system adoption | Menyelesaikan kendala perpajakan melalui konsultasi dan menjadi pelopor adopsi sistem Core Tax |

## education.json

### STIE YKPN Business School Yogyakarta — Bachelor of Accounting

| Field | EN | ID |
|---|---|---|
| detail 1 | Focus on taxation, auditing, and financial reporting. | Berfokus pada perpajakan, audit, dan pelaporan keuangan. |
| detail 2 | Active in academic research and student organizations. | Aktif dalam riset akademik dan organisasi kemahasiswaan. |
| detail 3 | Thesis: see the Research section. | Skripsi: lihat bagian Riset. |

## Intentionally untranslated

- MDX article bodies (research + notes) — English by design.
- Proper nouns: DJP, STIE YKPN, Kolosal AI, GRI, IDX, and all degree/certification/skill/course names.
- Form error fallbacks — `'Something went wrong. Please try again.'` and `'Network error. Please try again later.'` in `src/components/ui/contact-form.tsx` — authored EN strings, kept EN (not wired to `ui-strings.json`).
- Contact info list labels — "Email", "LinkedIn", "GitHub", "Location" in `src/components/sections/contact-section.tsx` — kept as EN labels.
- `SectionHeading` side labels — "Work", "Academic", "References", etc. — and the "Section N" prefix in `src/components/ui/section-heading.tsx` — kept EN.
- Credentials sub-headings — "Training & Courses", "Awards" in `src/components/sections/credentials-section.tsx` — kept EN.
- Known limitation: printing the page while in ID mode produces a mixed-language document — the nav and side-labels listed above stay in English regardless of the toggle.
- Known limitation: `ContactForm` (`src/components/ui/contact-form.tsx`) is fully localized but is not currently rendered on any route — keep/mount/remove is an open owner decision.
