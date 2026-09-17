import { CalendarCheck, Compass, LayoutDashboard } from 'lucide-react'

import { features } from '../../lib/content'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

const icons = [Compass, CalendarCheck, LayoutDashboard]

export function Features() {
  return (
    <section id="jelajahi" className="scroll-mt-24 border-t border-hairline py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">03 — Cara kerjanya</p>
              <h2 className="mt-6 text-3xl leading-[1.05] font-medium tracking-[-0.03em] sm:text-4xl">
                Dari sekadar tahu, sampai benar-benar ikut.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
                Kami merancang alurnya sederhana supaya kamu bisa langsung bergerak, bukan sibuk
                memahami antarmuka.
              </p>
            </Reveal>
          </div>

          <div className="border-b border-hairline">
            {features.map((feature, index) => {
              const Icon = icons[index]
              return (
                <Reveal key={feature.index} delay={index * 0.06}>
                  <article className="group grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-hairline py-9 transition-colors duration-500 ease-[var(--ease-editorial)] hover:border-emerald/40">
                    <div className="flex flex-col items-start gap-4">
                      <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-emerald">
                        {feature.index}
                      </span>
                      <span className="grid size-9 place-items-center rounded-full border border-hairline-strong text-ink transition-colors duration-300 group-hover:border-emerald group-hover:text-emerald">
                        <Icon className="size-4" strokeWidth={1.7} />
                      </span>
                    </div>

                    <div>
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-emerald">
                        {feature.title}
                      </p>
                      <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
                        {feature.heading}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                        {feature.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
