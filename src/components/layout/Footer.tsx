import { Link } from 'react-router-dom'

import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

const columns = [
  {
    title: 'Produk',
    items: [
      { label: 'Jelajahi UKM', href: '/#jelajahi' },
      { label: 'Agenda Kegiatan', href: '/#kegiatan' },
      { label: 'Papan Pengumuman', href: '/#jelajahi' },
    ],
  },
  {
    title: 'Organisasi',
    items: [
      { label: 'Daftarkan UKM', href: '/register' },
      { label: 'Panduan Pengurus', href: '/#tentang' },
      { label: 'Kode Etik', href: '/#tentang' },
    ],
  },
  {
    title: 'Akun',
    items: [
      { label: 'Masuk', href: '/login' },
      { label: 'Buat Akun', href: '/register' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-paper-deep/60">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Wadah mahasiswa menemukan, mengikuti, dan mengelola unit kegiatan kampus — dari
              ruang latihan sampai panggung utama.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="eyebrow">{column.title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="link-underline text-sm text-ink-soft hover:text-emerald"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 overflow-hidden border-t border-hairline pt-10">
          <p className="select-none font-display text-[13vw] leading-[0.85] tracking-[-0.04em] text-ink/10">
            UKM Hub
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UKM Hub. Dibangun untuk kehidupan kampus.</p>
          <p className="font-mono uppercase tracking-[0.14em]">Satu kampus, banyak cerita</p>
        </div>
      </Container>
    </footer>
  )
}
