import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Container } from '../ui/Container'
import { buttonStyles } from '../ui/button-styles'
import { Reveal } from '../ui/Reveal'

export function CtaBand() {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl bg-emerald-ink px-8 py-14 sm:px-14 sm:py-20">
            <div aria-hidden="true" className="paper-grain absolute inset-0 opacity-[0.05]" />
            <div className="relative max-w-2xl">
              <p className="eyebrow text-moss-strong">Siap mulai?</p>
              <h2 className="mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.03em] text-surface sm:text-4xl">
                Satu akun untuk semua kegiatan kampusmu.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-moss sm:text-base">
                Gratis untuk seluruh mahasiswa. Cukup daftar dengan email kampus, lalu pilih UKM
                pertamamu.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className={buttonStyles({
                    size: 'lg',
                    className: 'bg-surface text-emerald-ink hover:bg-paper hover:text-emerald-ink',
                  })}
                >
                  Buat akun
                  <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className={buttonStyles({
                    variant: 'outline',
                    size: 'lg',
                    className: 'border-moss-strong/40 text-moss hover:border-moss hover:text-surface',
                  })}
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
