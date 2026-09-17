import { manifesto } from '../../lib/content'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export function Manifesto() {
  return (
    <section id="tentang" className="scroll-mt-24 border-t border-hairline py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.4fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">05 — Kenapa kami</p>
          </Reveal>

          <div>
            <Reveal>
              <p className="font-display text-2xl leading-[1.25] tracking-[-0.02em] text-ink sm:text-3xl">
                {manifesto[0]}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 text-base leading-relaxed text-muted sm:text-lg">
                {manifesto[1]}
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-10 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                — Tim UKM Hub
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
