# UKM Hub — Frontend

Antarmuka web UKM Hub: React 19 + Vite + TypeScript + Tailwind CSS v4.

Panduan visual dan interaksi ada di [`DESIGN.md`](./DESIGN.md).

## Menjalankan

```bash
npm install
npm run dev
```

Dev server berjalan di `http://localhost:5173`. Permintaan ke `/api` diteruskan (proxy) ke
backend Go di `http://localhost:8080` — pastikan backend dan PostgreSQL aktif lebih dulu.

## Skrip

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Dev server + HMR |
| `npm run build` | Type-check lalu build produksi ke `dist/` |
| `npm run preview` | Pratinjau hasil build |
| `npm run lint` | Oxlint |

## Struktur singkat

```
src/
  components/  ui/ (primitif), layout/, home/, auth/, dashboard/
  hooks/       use-auth.ts, use-count-up.ts
  lib/         axios.ts, api.ts, errors.ts, format.ts, types.ts
  pages/       Home, Login, Register, Dashboard, NotFound
  stores/      auth.store.ts (Zustand + persist)
```

Token desain (warna, font, radius, easing) terpusat di `src/index.css` pada blok `@theme`.
Ubah tampilan lewat token tersebut, bukan nilai heks yang tersebar di komponen.
