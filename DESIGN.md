# UKM Hub — Design System

Dokumen ini adalah acuan visual dan interaksi untuk frontend UKM Hub (React + Vite +
Tailwind v4). Tujuannya sederhana: memastikan setiap halaman terasa **dirancang oleh manusia
untuk kampus**, bukan hasil templat yang bisa ditebak.

- **Arah**: *Editorial Kampus* — paper hangat, tinta forest, satu aksen emerald.
- **Kesan**: tenang, percaya diri, sedikit "cetak" (print-like), dengan gerak yang halus.
- **Sumber kebenaran token**: `src/index.css` (`@theme`).

---

## 1. Prinsip

1. **Satu aksen, dipakai hemat.** Emerald adalah satu-satunya warna aksi. Marigold dan clay
   hanya untuk sinyal kecil (badge, status), bukan dekorasi.
2. **Garis rambut, bukan bayangan.** Pemisah utama adalah `1px` hairline hangat. Shadow hanya
   untuk elemen yang benar-benar "mengambang".
3. **Asimetri yang disengaja.** Layout jarang simetris sempurna: kolom kiri/kanan beda lebar,
   grid offset, angka besar sebagai jangkar visual.
4. **Tipografi sebagai ornamen.** Judul serif (Fraunces) + label mono huruf besar. Kontras
   serif/sans/mono inilah yang membuat halaman terasa editorial.
5. **Gerak punya alasan.** Animasi menjelaskan hierarki dan arah, bukan hiasan. Selalu hormati
   `prefers-reduced-motion`.
6. **Copy manusiawi.** Bahasa Indonesia, kalimat pendek, tanpa klise pemasaran.

### Hindari (anti "AI-generated")

- Gradasi ungu/biru-teal, `bg-gradient-to-r` dekoratif, glow neon.
- Sudut membulat seragam di semua elemen + drop-shadow besar di mana-mana.
- Emoji di UI, ikon berlebihan, ilustrasi 3D generik.
- Layout simetris "hero + 3 kartu ikon + testimoni" tanpa karakter.
- Warna aksen lebih dari satu pada satu layar.

---

## 2. Warna

Token didefinisikan di `@theme` (`index.css`). Gunakan nama token, jangan pakai nilai heks
langsung di komponen.

| Token | Heks | Peran |
| --- | --- | --- |
| `--color-paper` | `#f7f4ec` | Latar utama halaman |
| `--color-paper-deep` | `#f0ebdd` | Latar sekunder / footer / hover lembut |
| `--color-surface` | `#fdfbf6` | Permukaan kartu & input |
| `--color-surface-strong` | `#ffffff` | Permukaan paling terang (jarang) |
| `--color-ink` | `#16211d` | Teks utama, tombol gelap |
| `--color-ink-soft` | `#2d3a34` | Teks sekunder |
| `--color-forest` | `#223c33` | Aksen gelap / hover tombol dark |
| `--color-muted` | `#6e736a` | Teks bantu, label |
| `--color-muted-soft` | `#9aa094` | Placeholder, ikon nonaktif |
| `--color-hairline` | `#e5dfd0` | Garis pemisah utama |
| `--color-hairline-strong` | `#d6cebb` | Garis border input/kontrol |
| `--color-emerald` | `#0f7a5a` | **Aksen aksi** (tautan, tombol utama, fokus) |
| `--color-emerald-deep` | `#0a5a42` | Hover tombol utama |
| `--color-emerald-ink` | `#08382a` | Blok emerald gelap (panel, CTA band) |
| `--color-moss` | `#e5eee7` | Latar lembut untuk aksen emerald |
| `--color-moss-strong` | `#cfe0d4` | Border/teks di atas emerald-ink |
| `--color-marigold` | `#c99535` | Sinyal kecil (admin, peringatan ramah) |
| `--color-clay` | `#b4553c` | Error / pesan gagal |

**Aturan pemakaian**

- Latar default selalu paper. Kartu memakai `surface` + `border-hairline`.
- Teks utama `ink`; teks penjelas `muted`; jangan pernah abu-abu murni.
- Emerald maksimal **satu blok besar per layar** (tombol, atau CTA band, bukan keduanya).
- Kontras teks minimal 4.5:1. `muted-soft` hanya untuk placeholder, bukan teks isi.

---

## 3. Tipografi

| Peran | Font | Pemakaian |
| --- | --- | --- |
| Display | **Fraunces Variable** (`font-display`) | `h1`–`h4`, angka besar, kutipan, wordmark |
| Body / UI | **Inter Variable** (`font-sans`) | Paragraf, label, tombol, form |
| Label teknis | **IBM Plex Mono** (`font-mono`) | Eyebrow, tanggal, nomor section, tag |

Font di-self-host via Fontsource (lihat `src/main.tsx`) — tidak ada permintaan ke
Google Fonts saat runtime.

**Skala umum**

| Peran | Kelas contoh |
| --- | --- |
| Hero display | `text-[2.75rem] sm:text-6xl lg:text-[4.25rem] tracking-[-0.03em]` |
| Section heading | `text-3xl sm:text-4xl tracking-[-0.03em]` |
| Kartu heading | `text-xl sm:text-2xl tracking-[-0.02em]` |
| Body | `text-base leading-relaxed` |
| Body kecil | `text-sm leading-relaxed` |
| Eyebrow | `.eyebrow` (mono, uppercase, `letter-spacing: 0.18em`) |
| Angka statistik | `.stat-figure` (display, tabular-nums) |

**Aturan**

- Tracking judul selalu negatif (`-0.02em` s/d `-0.03em`); body normal.
- `leading` untuk display ~`1.02`–`1.05`; body `relaxed`.
- Maksimal dua ukuran display dalam satu section.
- Style italic hanya untuk penekanan kata di judul, bukan seluruh paragraf.

---

## 4. Layout & Spasi

- Lebar konten: `Container` → `narrow` (`max-w-3xl`), `default` (`max-w-6xl`), `wide` (`max-w-[88rem]`).
- Padding horizontal: `px-5 sm:px-8`.
- Ritme section: `py-20 sm:py-28`; section dengan garis atas pakai `border-t border-hairline`.
- Grid dua kolom asimetris favorit: `lg:grid-cols-[0.85fr_1.15fr]` atau `[1.1fr_0.9fr]`.
- Jarak antar elemen: pakai kelipatan 4 (`gap-3/4/5/6/8`). Jangan campur `gap-2` dan `gap-7` di komponen sejenis.
- Grid latar (`paper-grid`) dan tekstur (`paper-grain`) hanya di area dekoratif, `opacity ≤ 0.05`.

---

## 5. Bentuk & Elevasi

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| `--radius-xs` | `0.25rem` | Tag kecil, kontrol mini |
| `--radius-sm` | `0.375rem` | Tombol, input (via `rounded-md` = `--radius-md`) |
| `--radius-md` | `0.625rem` | **Default** tombol, input, kartu kecil |
| `--radius-lg` | `1rem` | Kartu, panel |
| `--radius-xl` | `1.5rem` | Blok besar / CTA band |
| `--shadow-lift` | dua lapis halus | Hanya kartu mengambang & elemen hero |
| `--shadow-hatch` | `0 1px 0` | Garis bawah sangat halus (opsional) |

Aturan: tak ada shadow di dalam kartu, tak ada shadow pada tombol kecuali saat hover
(`hover:shadow-lift`). Border lebih diutamakan daripada shadow.

---

## 6. Gerak

Token easing: `--ease-editorial: cubic-bezier(0.22, 1, 0.36, 1)` untuk kemunculan/reveal, dan
`--ease-soft` untuk transisi warna/opacity.

| Pola | Implementasi | Contoh lokasi |
| --- | --- | --- |
| Reveal on scroll | `<Reveal>` (framer-motion `whileInView`, `y: 18`, `0.7s`) | Section landing |
| Stagger masuk | `initial/animate` + `delay` bertingkat | `Hero` |
| Kata bergilir | `AnimatePresence mode="wait"` | `Hero` kata "berkarya…" |
| Parallax kursor | `useMotionValue` + `useSpring` + `useTransform` | `HeroPoster` |
| Marquee | CSS `@keyframes marquee-left/right`, pause saat hover | `Marquee` |
| Count-up | `animate()` + `useInView` | `StatsStrip` |
| Navbar menyusut | transisi `h-20 → h-14` + backdrop-blur | `Navbar` |
| Hover baris | warna teks → emerald, ikon panah terisi | `Agenda` |
| Underline reveal | kelas `.link-underline` | Navbar, footer |

**Durasi**: mikro-interaksi `200–300ms`, kemunculan `500–700ms`, transisi halaman `500ms`.
Jangan melebihi `0.9s` untuk elemen konten.

**Reduced motion**: blok `@media (prefers-reduced-motion: reduce)` menonaktifkan animasi CSS,
dan komponen memakai `useReducedMotion` untuk mematikan parallax/rotasi. Wajib dipertahankan.

---

## 7. Komponen

Semua di `src/components/ui/`.

- **Button** (`Button.tsx`, varian di `button-styles.ts`)
  - `primary` (emerald), `dark` (ink), `outline` (hairline), `ghost`.
  - Ukuran `sm | md | lg`; `loading` menampilkan spinner dan menonaktifkan tombol.
  - Untuk `<Link>` bergaya tombol, pakai `buttonStyles()` — jangan bungkus Link dalam Button.
- **Input** (`Input.tsx`): label `.eyebrow`, border `hairline-strong`, fokus `ring-emerald/15`,
  dukungan `error` (clay) dan `hint`.
- **Card** (`Card.tsx`): `surface` + `border-hairline`, `rounded-lg`, padding `p-6`.
- **Badge** (`Badge.tsx`): mono uppercase; tone `neutral | emerald | marigold`.
- **EmptyState** (`EmptyState.tsx`): border putus-putus, ikon dalam lingkaran, aksi opsional.
- **Spinner** (`Spinner.tsx`), **Logo** (`Logo.tsx`), **Container**, **Reveal**.

Ikon dari `lucide-react`, selalu `strokeWidth={1.6–1.8}` dan ukuran `size-4`/`size-5` agar
konsisten dengan bobot garis hairline.

---

## 8. Halaman

- **`/` Landing** — Hero editorial (kata berputar + poster parallax), `Marquee` bidang, `StatsStrip`
  (count-up), `Features` (kolom sticky + daftar bernomor), `Agenda` (daftar baris hairline),
  `Manifesto`, `CtaBand` (blok emerald-ink).
- **`/login` & `/register`** — `AuthShell`: form kiri, panel editorial emerald-ink kanan (desktop).
  Validasi klien + pesan error dari API dipetakan ke bahasa Indonesia (`lib/errors.ts`).
- **`/dashboard`** — sapaan personal, `ProfileCard`, `EditProfileForm`, lalu placeholder
  "Ruang kegiatanmu" (EmptyState) untuk modul UKM & agenda mendatang.
- **`/404`** — angka besar "Nyasar." + jalan kembali.
- Transisi antar halaman via `<Page>` (`framer-motion` fade/geser halus).

---

## 9. Suara & Nada (Copy)

- Bahasa Indonesia, sapaan "kamu", hindari "Anda" yang kaku maupun "kalian".
- Kalimat pendek, konkret, tanpa superlatif kosong ("revolusioner", "terbaik se-Indonesia").
- Label UI berupa kata kerja: "Mulai jelajahi", "Simpan perubahan", "Buat akun".
- Pesan error menuntun, bukan menyalahkan: "Email atau kata sandi salah. Periksa kembali."
- Eyebrow bernomor ("01 — Ruang mahasiswa") untuk kesan terbitan cetak.

---

## 10. Aksesibilitas

- Fokus terlihat jelas: `outline: 2px solid emerald` dengan offset (global `:focus-visible`).
- Semua kontrol punya label; `aria-invalid`/`aria-describedby` pada input error.
- Ikon dekoratif `aria-hidden`; yang bermakna punya `aria-label`.
- Kontras minimal 4.5:1; jangan sandarkan makna hanya pada warna (badge punya teks).
- Target sentuh minimal `44px` (tombol `md`/`lg`).

---

## 11. Konvensi Kode Frontend

```
frontend/src/
  components/ui/         # primitif tanpa logika domain
  components/layout/     # Navbar, Footer, Page, ProtectedRoute, GuestRoute, ScrollToTop
  components/<fitur>/    # home/, auth/, dashboard/
  hooks/                 # use-auth.ts (TanStack Query), use-count-up.ts
  lib/                   # axios.ts, api.ts, errors.ts, format.ts, types.ts, cn.ts, content.ts
  stores/                # auth.store.ts (Zustand + persist)
  pages/                 # satu file per rute (di-lazy load di App.tsx)
```

- Styling hanya lewat kelas Tailwind + token `@theme`. Hindari `style` inline kecuali nilai
  yang dihitung runtime (mis. warna Toaster).
- Nama file komponen `PascalCase.tsx`; util `kebab-case.ts`.
- Semua teks UI dalam bahasa Indonesia.
- Jalankan `npx tsc -b`, `npm run lint`, dan `npm run build` sebelum menganggap pekerjaan selesai.

---

## 12. Menambah Halaman Baru (checklist)

1. Pilih section rhythm: `border-t border-hairline`, `py-20 sm:py-28`, `Container`.
2. Mulai dari `eyebrow` + `h2` display; batasi aksen emerald ke satu elemen.
3. Bungkus konten dinamis dengan `<Reveal>`; bungkus rute dengan `<Page>`.
4. Gunakan primitif `ui/` yang ada sebelum membuat komponen baru.
5. Uji di lebar `375px`, `768px`, `1280px`; cek mode reduced-motion.
