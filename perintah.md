# TUGAS: Lanjutkan slicing frontend UKM Hub (React + Vite + Tailwind v4)

Kamu bekerja di repo frontend `frontend-ukmhub`. Backend REST sudah 100% selesai,
berjalan di `http://localhost:8080`, dan di-proxy oleh Vite: semua request ke
`/api/*` diteruskan ke backend. Jangan mengubah backend.

## Konteks yang SUDAH ADA (jangan dirombak, ikuti polanya)
- `src/lib/axios.ts` — instance axios, `baseURL: '/api/v1'`, interceptor menyuntik
  `Authorization: Bearer <token>` dari `useAuthStore`, dan pada 401 memanggil
  `useAuthStore.getState().clear()`.
- `src/lib/api.ts` — fungsi API auth yang sudah ada.
- `src/lib/types.ts` — tipe `User`, `ApiEnvelope<T>`.
- `src/lib/errors.ts` — `getErrorMessage()` memetakan error API ke bahasa Indonesia.
- `src/lib/format.ts` — `initials`, `formatDateID`, `formatTodayID`, `greeting`.
- `src/stores/auth.store.ts` — Zustand persist (key `ukm-hub.auth`) berisi
  `token`, `user`, aksi `setSession/setUser/clear`.
- `src/hooks/use-auth.ts` — hook TanStack Query untuk auth.
- Primitif UI di `src/components/ui/`: `Button`, `button-styles`, `Input`, `Card`,
  `Badge`, `EmptyState`, `Spinner`, `Logo`, `Container`, `Reveal`.
- Layout di `src/components/layout/`: `Navbar`, `Footer`, `Page`, `ProtectedRoute`,
  `GuestRoute`, `ScrollToTop`.
- Halaman yang sudah jadi: `/` (landing), `/login`, `/register`, `/dashboard`
  (baru profil + placeholder), `/404`. Routing di `src/App.tsx` dengan lazy pages.
- **`DESIGN.md` adalah sumber kebenaran visual.** Baca dan patuhi: arah "Editorial
  Kampus", token `@theme` di `src/index.css`, satu aksen emerald, hairline bukan
  shadow, tipografi Fraunces/Inter/IBM Plex Mono, copy bahasa Indonesia "kamu",
  tanpa emoji, hormati `prefers-reduced-motion`.
- Konvensi kode ada di `DESIGN.md` §11. Nama komponen `PascalCase.tsx`, util
  `kebab-case.ts`, styling hanya Tailwind + token, semua teks Indonesia.

## Kontrak API backend (akurat — pakai ini, jangan mengarang)

Base path: `/api/v1`. Header: `Authorization: Bearer <token>`.
Sukses: `{ "success": true, "data": <T>, "message": "" }`.
Gagal dari handler: `{ "success": false, "message": "..." }`.
Gagal dari middleware/auth: `{ "error": "..." }`.
→ Perbarui `getErrorMessage` agar membaca `message` ATAU `error`, dan tambahkan
field `success?: boolean` ke `ApiEnvelope<T>`.

### Auth
- `POST /auth/login` body `{email,password}` → `{ token, user }`
- `POST /auth/register` body `{name,email,password}` → `{ user }`
- `POST /auth/logout`
- `GET /users/me` → user
- `PUT /users/me` body `{name,email}`

Role: `SUPER_ADMIN` (akses semua organisasi) dan `ORG_ADMIN` (hanya organisasi
yang ia kelola). `GET /organizations` sudah otomatis ter-scope per role.

### Organizations (list = array, bukan paginasi)
- `GET /organizations` → `Organization[]`
- `POST /organizations` `{name,slug,description,logo,email,phone,status}`
- `GET /organizations/:id`
- `PUT /organizations/:id` field sama (opsional)
- `DELETE /organizations/:id` (hanya SUPER_ADMIN)
- `Organization`: `{id,name,slug,description,logo,email,phone,status,created_at,updated_at}`
  `status`: `"active" | "inactive"`

### Divisions (array)
- `GET /organizations/:id/divisions` → `Division[]`
- `POST /organizations/:id/divisions` `{name,description,status}`
- `GET /divisions/:id`
- `PUT /divisions/:id` `{name,description,status}`
- `DELETE /divisions/:id`
- `Division`: `{id,organization_id,name,description,status,created_at,updated_at}`

### Events (array per organisasi)
- `GET /organizations/:id/events` → `Event[]`
- `POST /organizations/:id/events`
  `{name,slug,description,location,start_date,end_date,registration_start,registration_end,quota,status}`
- `GET /events/:id`
- `PUT /events/:id` (field opsional)
- `DELETE /events/:id`
- `POST /events/:id/publish` | `POST /events/:id/close` | `POST /events/:id/archive`
- `Event`: `{id,organization_id,name,slug,description,location,start_date,end_date,
  registration_start,registration_end,quota,status,registration_count,created_at,updated_at}`
  `status`: `"DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED"`

### Form Builder
- `GET /events/:id/form` → `Form` (dengan `fields[]`)
- `POST /events/:id/form` `{title,description,submit_webhook_url,is_published}`
- `PUT /forms/:id` `{title,description,submit_webhook_url}`
- `POST /forms/:id/publish` | `POST /forms/:id/unpublish`
- `POST /forms/:id/fields` `{label,name,type,placeholder,description,required,options,sort_order}`
- `PUT /fields/:id` (field sama)
- `DELETE /fields/:id`
- `POST /forms/:id/fields/:fieldId/duplicate`
- `POST /forms/:id/fields/reorder` body = **array**: `[{ "id": "...", "sort_order": 0 }, ...]`
- `Form`: `{id,event_id,title,description,submit_webhook_url,is_published,fields[],created_at,updated_at}`
- `FormField`: `{id,form_id,label,name,type,placeholder,description,required,options[],sort_order}`
- `type` yang didukung backend: `TEXT, TEXTAREA, EMAIL, NUMBER, PHONE, DATE, SELECT, RADIO, CHECKBOX, URL`
  (`SELECT`/`RADIO`/`CHECKBOX` memakai `options: string[]`).

### Registrations (paginasi)
- `GET /events/:id/registrations?status=&search=&page=&per_page=` → `{items,page,per_page,total,total_pages}`
- `GET /registrations/:id` → detail + `answers[]`
- `POST /registrations/:id/accept`
- `POST /registrations/:id/reject` body `{reason}` (wajib, min 3 char; tanpa reason → 400)
- `Registration`: `{id,event_id,status,rejection_reason,submitted_at,created_at,updated_at,answers[]}`
  `answers[]`: `{field_id,label,name,type,value}`
  `status`: `"PENDING" | "ACCEPTED" | "REJECTED"`
  Terima ulang registrasi yang sudah ACCEPTED → 409.

### Members (paginasi)
- `GET /organizations/:id/members?search=&division_id=&page=&per_page=` → `{items,page,per_page,total,total_pages}`
- `POST /registrations/:id/convert-member` `{division_id,name,email,phone,student_id,status}`
- `GET /members/:id`
- `PUT /members/:id` `{division_id,name,email,phone,student_id,status}`
- `DELETE /members/:id`
- `Member`: `{id,organization_id,division_id,registration_id,name,email,phone,student_id,status,joined_at,created_at,updated_at}`
  `status`: `"active" | "inactive"`; `division_id`/`registration_id` bisa `null`.

### Dashboard
- `GET /organizations/:id/dashboard` →
  `{ metrics:{total_members,active_members,active_events,total_events,total_registrations,pending_applications},
     registration_status_distribution:{"PENDING":n,"ACCEPTED":n,"REJECTED":n},
     members_by_division:[{division_id,division_name,count}],
     recent_registrations:[{id,event_id,event_title,status,submitted_at}] }`

### CSV Export (butuh Bearer token!)
- `GET /organizations/:id/registrations/export?event_id=`
- `GET /organizations/:id/members/export`
  Response = file CSV (`Content-Disposition: attachment`).
  **Karena butuh header Authorization, jangan pakai `<a href>`. Ambil via axios
  dengan `responseType: 'blob'`, lalu buat object URL + klik anchor untuk unduh.**

### Public (tanpa auth)
- `GET /public/events/:slug` → detail event publik + `registration_count`
- `GET /public/events/:slug/form` → `{event, form:{title,description,fields[]}}`
- `POST /public/events/:slug/registrations` body `{answers:[{field_id,value}]}`
  `value` selalu string (checkbox: gabungkan/JSON sesuai kebutuhan renderer).

## Yang harus kamu bangun

### A. Fondasi
1. Perluas `src/lib/types.ts` dengan semua tipe di atas (Organization, Division,
   Event, Form, FormField, Registration, RegistrationAnswer, Member, DashboardData,
   paginated response generik).
2. Buat modul API terpisah di `src/lib/api/` (mis. `organizations.ts`, `divisions.ts`,
   `events.ts`, `forms.ts`, `registrations.ts`, `members.ts`, `dashboard.ts`,
   `public.ts`) — semua lewat instance axios yang ada.
3. Buat hook TanStack Query per resource di `src/hooks/` (query + mutation,
   invalidate query yang relevan). Contoh: `use-organizations.ts`, `use-events.ts`,
   dst. Jangan taruh fetch langsung di komponen.
4. Buat komponen bersama: `DataTable`/`Table` sederhana (hairline, header mono),
   `Pagination`, `PageHeader` (eyebrow + judul display), `ConfirmDialog`,
   `StatusBadge` (map status → tone Badge), `Select`, `Textarea`, `Field`
   (label + error + hint), `Toast` via `sonner`.

### B. Layout Admin
- Buat `AdminLayout` dengan sidebar (elemen aktif emerald, ikon lucide
  `strokeWidth={1.6}`, ukuran `size-4/5`), area konten `Container`, dan breadcrumb.
- Sidebar menyesuaikan role: `SUPER_ADMIN` melihat daftar Organisasi;
  `ORG_ADMIN` langsung ke organisasinya.
- Simpan organisasi aktif (mis. di URL param atau store ringan) agar halaman
  divisi/event/member tahu konteks organisasi.
- Tambahkan sub-route admin di `src/App.tsx` di bawah `ProtectedRoute`.

### C. Halaman Admin (rute sesuai PRD §22)
- `/organizations` — daftar organisasi (Card grid/table), tombol buat (SUPER_ADMIN),
  aksi edit/hapus.
- `/organizations/:id` — detail + ringkasan (metrik dari dashboard) + tautan ke
  divisi/event/member.
- `/organizations/:id/divisions` — CRUD divisi.
- `/organizations/:id/events` — daftar event + badge status + aksi
  publish/close/archive + tombol buat event (form dengan date-time).
- `/events/:id` — detail event + tombol ekspor CSV registrations.
- `/events/:id/form-builder` — editor form: tambah/edit/hapus field, pilih tipe,
  opsi untuk SELECT/RADIO/CHECKBOX, toggle required, **reorder drag-and-drop**
  (kirim array `[{id,sort_order}]`), publish/unpublish, set `submit_webhook_url`.
  Beri preview renderer di sisi kanan.
- `/events/:id/registrations` — tabel paginasi + filter status + search, tombol
  lihat detail.
- `/registrations/:id` — detail: semua jawaban (label + value), aksi
  Accept / Reject (modal alasan wajib), dan tombol "Jadikan anggota" (konversi).
- `/members` — tabel paginasi + filter divisi + search + ekspor CSV.
- `/members/:id` — detail + edit + hapus.
- `/dashboard` — ganti placeholder dengan dashboard nyata: kartu metrik
  (pakai `.stat-figure`), distribusi status (bar sederhana berbasis CSS, tanpa
  library chart), anggota per divisi, daftar registrasi terbaru.

### D. Halaman Publik & Dynamic Form Renderer
- `/events` — daftar event publik (endpoint publik berbasis slug; buat discovery
  dari organisasi/event yang PUBLISHED, atau tampilkan yang tersedia).
- `/events/:slug` — detail event publik + status buka/tutup pendaftaran + kuota
  terisi (`registration_count` vs `quota`) + CTA daftar.
- `/events/:slug/register` — **Dynamic Form Renderer**: render field dari
  `GET /public/events/:slug/form` tanpa asumsi field tertentu. Map tipe →
  komponen (TEXT/EMAIL/URL/PHONE → Input, TEXTAREA → Textarea, NUMBER → number,
  DATE → date, SELECT → Select, RADIO → radio group, CHECKBOX → checkbox).
  Validasi klien dari `required` + tipe.
- `/events/:slug/success` — konfirmasi pengiriman.

## Aturan wajib
- Semua request lewat axios instance + TanStack Query. Jangan `fetch` mentah.
- Setiap daftar/detail punya 3 state: loading (Spinner/skeleton), empty
  (`EmptyState`), error (`getErrorMessage`) — lihat PRD §26.
- Form pakai `react-hook-form` + `zod` bila tersedia; jika belum ada, tambahkan
  dependensinya. Validasi klien pelengkap, bukan pengganti backend.
- Tanggal ditampilkan via `formatDateID`; input tanggal kirim ISO string.
- Responsif di 375 / 768 / 1280 px; target sentuh ≥ 44px; fokus terlihat;
  `aria-invalid`/`aria-describedby` pada input error; ikon dekoratif `aria-hidden`.
- Ikon hanya lucide, tanpa emoji. Copy bahasa Indonesia memakai "kamu".
- Jangan mengubah landing/login/register yang sudah ada kecuali menambah tautan
  navigasi yang relevan (mis. menu "Event" di Navbar dan tautan ke area admin).
- Kerjakan bertahap per bagian (A→D). Setelah tiap bagian, pastikan tidak ada
  error TypeScript.

## Definition of Done
- `npx tsc -b`, `npm run lint`, dan `npm run build` semuanya lulus tanpa error.
- Backend berjalan di `:8080`; alur ini terbukti manual end-to-end:
  login → buat/lihat organisasi → buat divisi & event → publish → susun form →
  daftar via halaman publik → lihat registrasi → accept/reject → konversi jadi
  anggota → lihat dashboard → unduh CSV.
