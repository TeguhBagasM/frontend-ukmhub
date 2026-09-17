import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { agenda } from '../../lib/content'
import { Badge } from '../ui/Badge'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export function Agenda() {
  return (
    <section id="kegiatan" className="scroll-mt-24 border-t border-hairline py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="eyebrow">04 — Agenda</p>
            <h2 className="mt-6 max-w-xl text-3xl leading-[1.05] font-medium tracking-[-0.03em] sm:text-4xl">
              Yang berlangsung di kampus semester ini.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm text-muted">
              {agenda.length} kegiatan mendatang · diperbarui tiap pekan
            </p>
          </Reveal>
        </div>

        <div className="mt-14 hidden grid-cols-[8rem_1fr_auto] gap-6 border-b border-hairline pb-3 sm:grid">
          <span className="eyebrow">Tanggal</span>
          <span className="eyebrow">Kegiatan</span>
          <span className="eyebrow">Bidang</span>
        </div>

        <div className="mt-2">
          {agenda.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <Link
                to="/#kegiatan"
                className="group -mx-3 grid grid-cols-1 gap-3 rounded-md border-b border-hairline px-3 py-6 transition-colors duration-300 ease-[var(--ease-editorial)] hover:bg-surface sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:gap-6"
              >
                <div className="flex items-baseline gap-2 sm:flex-col sm:gap-0">
                  <span className="font-display text-2xl tracking-[-0.02em] text-ink">
                    {item.date}
                  </span>
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                    {item.day}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-medium text-ink transition-colors duration-300 group-hover:text-emerald sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">
                    {item.unit}
                    <span aria-hidden="true" className="mx-2 text-hairline-strong">
                      /
                    </span>
                    {item.place}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <Badge>{item.tag}</Badge>
                  <span className="grid size-9 place-items-center rounded-full border border-hairline-strong text-ink transition-all duration-300 ease-[var(--ease-editorial)] group-hover:border-emerald group-hover:bg-emerald group-hover:text-surface">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
