import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Page } from '../components/layout/Page'
import { Container } from '../components/ui/Container'
import { buttonStyles } from '../components/ui/button-styles'

export function NotFoundPage() {
  return (
    <Page>
      <Container className="flex min-h-[70vh] flex-col justify-center py-20">
        <p className="eyebrow">Error 404</p>
        <p className="mt-8 font-display text-[6rem] leading-none tracking-[-0.04em] text-ink sm:text-[9rem]">
          Nyasar
          <span className="text-emerald">.</span>
        </p>
        <h1 className="mt-6 max-w-md text-xl leading-relaxed font-medium tracking-[-0.02em] text-ink-soft">
          Halaman yang kamu cari tidak ada di sini. Mungkin sudah dipindahkan, atau memang belum
          pernah dibuat.
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link to="/" className={buttonStyles({ variant: 'dark', size: 'md' })}>
            <ArrowLeft className="size-4 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:-translate-x-1" />
            Kembali ke beranda
          </Link>
          <Link to="/login" className={buttonStyles({ variant: 'ghost', size: 'md' })}>
            Masuk ke akun
          </Link>
        </div>
      </Container>
    </Page>
  )
}
