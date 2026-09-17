import { stats } from '../../lib/content'
import { useCountUp } from '../../hooks/use-count-up'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

function StatItem({
  value,
  suffix,
  label,
  note,
}: {
  value: number
  suffix: string
  label: string
  note: string
}) {
  const { ref, value: current } = useCountUp(value)

  return (
    <div className="flex flex-col">
      <p className="stat-figure text-4xl text-ink sm:text-5xl">
        <span ref={ref}>{current.toLocaleString('id-ID')}</span>
        {suffix}
      </p>
      <p className="mt-3 text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </div>
  )
}

export function StatsStrip() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <p className="eyebrow">02 — Potret singkat</p>
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.08}
              className="border-t border-hairline pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <StatItem {...stat} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
