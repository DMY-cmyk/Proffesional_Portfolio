# Plan Baseline dan Aturan Kerja — Professional Portfolio (Dzaki)

## Tujuan

Situs portofolio profesional milik Dzaki sendiri (akuntansi, keuangan, pajak, audit; riset pelaporan keberlanjutan dan nilai perusahaan). Situs ini terbuka untuk publik di GitHub Pages dan ditujukan bagi perekrut, dosen, dan rekan profesional. Plan ini mencatat keadaan proyek per 13/11/2026, kriteria "proyek sehat", dan aturan kerja untuk perubahan berikutnya. Plan ini **bukan** perintah untuk mengubah kode sekarang.

## Kondisi sekarang (bukti, diverifikasi 2026-11-13)

Repositori
- Git, cabang aktif `main`, remote `origin` = `DMY-cmyk/Proffesional_Portfolio` (publik). Pohon kerja bersih sebelum plan ini ditulis (potret awal `scratchpad\baseline\11.txt` kosong).
- Commit terakhir `b9d2a5a` 2026-08-08 "fix(a11y): explicit list role on article MDX lists". Tidak ada PR terbuka (`gh pr list --state open` kosong).
- Tiga run GitHub Actions terakhir "Deploy to GitHub Pages" berstatus `success` (terakhir 2026-08-08, `gh run list -L 3`).

Teknologi dan perintah
- Next.js `^15.5.13`, React `^19.2.4`, Tailwind CSS `^4.2.1`, Vitest `^4.1.0` (`package.json:31`, `package.json:33`, `package.json:52`, `package.json:54`).
- Skrip: `dev`, `build`, `prebuild` (membuat gambar OG), `lint`, `test`, `test:run` (`package.json:7-14`).
- Ekspor statis dengan `basePath` `/Proffesional_Portfolio` saat produksi (`next.config.ts:6-11`).
- Folder `node_modules/` **tidak ada** di disk saat diperiksa, sehingga tes tidak bisa dijalankan tanpa `npm ci` (butuh jaringan).

Tes dan penerbitan
- README mencatat **357 tes di 75 berkas tes** (`README.md:148-150`). Hitungan berkas sekarang: `find tests -name '*.test.*'` = **76**. Selisih satu ini belum dijelaskan.
- Situs terbit otomatis ke GitHub Pages pada setiap push ke `main` (`.github/workflows/deploy.yml:3-5`); alur CI menjalankan `npm ci` → `npm run test:run` → `npm run build` (`.github/workflows/deploy.yml:34-40`). Artinya **push ke `main` = terbit ke publik**.
- Alamat situs: `README.md:5`.

Dokumen perencanaan yang sudah ada
- `docs/superpowers/specs/` (6 berkas) dan `docs/superpowers/plans/` (6 berkas); yang terbaru `docs/superpowers/plans/2026-08-08-article-typography.md` dan spec pasangannya.
- Riwayat perubahan di README bagian Changelog (`README.md:162`); entri terbaru "Article Typography — Hybrid Journal (2026-08-08)" (`README.md:164`).
- Tidak ada folder `docs/plan/` sebelum plan ini.

Berkas sensitif
- Formulir kontak memakai layanan Web3Forms dengan kunci akses di kode sisi klien (`src/components/ui/contact-form.tsx:72`); nilainya tidak disalin ke plan ini.
- Berkas PDF skripsi di akar repo tidak dilacak git (`.gitignore` memuat `*.pdf`, kecuali `public/files/cv/*.pdf`); isinya tidak dibuka.

## Celah

1. **Tidak ada pekerjaan aktif tercatat** sejak 2026-08-08; tidak ada roadmap lanjutan yang tertulis sesudah Phase 4 (`README.md:164-205`).
2. **Jumlah tes di README mungkin usang**: 75 berkas di README vs 76 berkas di disk (lihat Kondisi sekarang).
3. **Ketergantungan belum terpasang di laptop** (`node_modules/` tidak ada), jadi status tes lokal per hari ini belum terbukti.
4. **Risiko terbit tidak sengaja**: setiap push ke `main` langsung menerbitkan situs publik (`.github/workflows/deploy.yml:3-5`); tidak ada tahap pratinjau.
5. **Kunci Web3Forms di kode klien** (`src/components/ui/contact-form.tsx:72`): kunci Web3Forms memang dirancang publik, tetapi perlu dicek bahwa pembatasan domain/spam di dasbor Web3Forms aktif (belum terbukti).
6. **Versi Node di CI** = 20 (`.github/workflows/deploy.yml:30`) sementara alur memaksa aksi JavaScript ke Node 24 (`.github/workflows/deploy.yml:17-18`); belum ada keputusan tertulis soal versi Node lokal.

## Keputusan

Keputusan yang sudah tercatat:
- **Ekspor statis ke GitHub Pages** (`next.config.ts:6-11`, `README.md:152-160`). Alternatif yang ditolak tidak tercatat di repo.
- **Gaya "research journal"** (kertas krem, tipografi serif Newsreader, teal + emas): `README.md:7`, `README.md:42-50`, `README.md:230-243`.
- **Tipografi artikel "hybrid journal"** (2026-08-08): spec `docs/superpowers/specs/2026-08-08-article-typography-design.md`; ringkasan di `README.md:164-173`.
- **Dwibahasa EN/ID** (Phase 4 Plan 3, 2026-08-06): `README.md:197-203`.

Keputusan plan ini:
- Plan baseline ditaruh di `docs/plan/` sesuai aturan §2 CLAUDE.md global. Alternatif yang ditolak: menambah bagian ke README (README adalah dokumen publik dan bukan tempat plan).

## Kriteria penerimaan

- **AC1** Diberikan salinan bersih repo, ketika `npm ci && npm run test:run` dijalankan, maka seluruh tes lulus (0 gagal) dan jumlah tes serta berkas tes sama dengan angka di README.
- **AC2** Ketika `npm run build` dijalankan, maka ekspor statis selesai tanpa galat dan folder `out/` terbentuk.
- **AC3** Ketika `npm run lint` dijalankan, maka tidak ada galat lint.
- **AC4** Angka tes di `README.md` bagian Testing sesuai hasil AC1 (memperbaiki Celah 2).
- **AC5** Run GitHub Actions terakhir di `main` berstatus `success`, dan situs di alamat `README.md:5` merespons HTTP 200.
- **AC6** Tidak ada rahasia di repo publik: `git ls-files` tidak memuat `.env*` (selain contoh), `*.pem`, atau berkas PDF selain `public/files/cv/*.pdf`; pemindaian kata kunci pada diff tidak menemukan token/kata sandi.
- **AC7** Setiap perubahan berikutnya punya plan di `docs/plan/` atau `docs/superpowers/plans/` dengan AC bernomor sebelum kodenya ditulis, dan push ke `main` hanya dilakukan dengan izin Dzaki di chat.

## Rencana cek/tes per AC

| AC | Nama cek/tes | Perintah atau cara | Status hari ini |
|---|---|---|---|
| AC1 | `tes-unit` | `npm ci` lalu `npm run test:run` | belum dijalankan — `node_modules/` tidak ada; `npm ci` butuh jaringan dan menulis ke repo |
| AC2 | `build-statis` | `npm run build`; periksa `out/` ada | belum dijalankan (alasan sama) |
| AC3 | `lint` | `npm run lint` | belum dijalankan (alasan sama) |
| AC4 | `cocok-readme` | bandingkan keluaran AC1 dengan `README.md:148-150` | belum dijalankan |
| AC5 | `ci-dan-situs` | `gh run list -L 1` = `success`; `curl -I` alamat situs = 200 | sebagian: run terakhir `success` (2026-08-08); situs belum dicek |
| AC6 | `tanpa-rahasia` | `git ls-files \| grep -E '\.env\|\.pem$\|\.pdf$'` hanya menghasilkan CV; pindai kata kunci (token, password, secret, key) pada diff | belum dijalankan |
| AC7 | `plan-dulu` | setiap commit fitur baru punya berkas plan yang dirujuk di pesan commit atau plan | berlaku mulai sekarang |

## Langkah kerja berikutnya

1. Pasang ketergantungan (`npm ci`) di laptop lalu jalankan AC1–AC3; catat hasilnya di Log pelaksanaan.
2. Bila jumlah tes berbeda dari README, buat plan kecil untuk memperbarui README (AC4).
3. Cek AC5 dan AC6.
4. Pekerjaan fitur baru (bila ada) dimulai dengan plan tersendiri.

## Berkas yang akan disentuh

- Ditambah: `docs/plan/2026-11-13-baseline-dan-aturan-kerja.md` (plan ini).
- Diubah: tidak ada oleh plan ini. Langkah 2 kelak dapat mengubah `README.md` (bagian Testing) lewat plan tersendiri.

## Risiko & cara mundur

- **Push ke `main` langsung terbit ke publik.** Mitigasi: kerja di cabang terpisah; push hanya dengan izin Dzaki. Cara mundur: `git revert` commit terakhir lalu push (CI menerbitkan ulang versi sebelumnya).
- **Data pribadi di situs publik** (kontak, CV). Mitigasi: setiap perubahan konten dicek Dzaki sebelum push.
- **`npm ci` mengubah `package-lock.json`** bila versi npm berbeda. Mitigasi: periksa `git status` sesudahnya; kembalikan dengan `git checkout -- package-lock.json` bila tidak disengaja.

## Bukan-tujuan

- Tidak mendesain ulang situs atau menambah fitur.
- Tidak memperbarui versi Next.js/React/Tailwind.
- Tidak mengubah konten, CV, atau formulir kontak.

## Log pelaksanaan

- 2026-11-13 baseline ditulis; belum ada yang dieksekusi.

## Aturan kerja

Ringkasan §2 `C:\Users\HP\.claude\CLAUDE.md` (berlaku untuk proyek ini):
1. **Plan dulu, tertulis sebagai berkas** di `docs/plan/` atau `docs/superpowers/plans/`, berisi tujuan, kondisi sekarang dengan bukti, keputusan dan alternatif yang ditolak, AC bernomor, rencana tes per AC, langkah, berkas, risiko, bukan-tujuan, dan log.
2. **Persetujuan Dzaki sebelum eksekusi.** Tulis plan, tunjukkan, lalu berhenti. Perubahan sepele (salah ketik, format) boleh langsung dikerjakan sambil disebutkan.
3. **Eksekusi wajib memenuhi AC plan.** Perubahan arah berarti plan diubah dulu. AC yang gagal berarti pekerjaan belum selesai.
4. **Bukti per AC sebelum klaim selesai**: tabel AC → bukti → hasil, dengan status "belum terbukti" bila memang belum, lalu dicatat di Log pelaksanaan.
5. **Ukuran plan sebanding dengan pekerjaannya**: perubahan kecil cukup satu halaman dengan 2–5 AC.
6. Push ke `main` (yang langsung menerbitkan situs) hanya dengan izin Dzaki di chat.
