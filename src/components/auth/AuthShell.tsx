import type { ReactNode } from 'react'

import { Logo } from '../ui/Logo'

const points = [
  'Temukan UKM sesuai minat dan jadwalmu.',
  'Satu kalender untuk semua agenda kampus.',
  'Peralatan lengkap untuk pengurus organisasi.',
]

export function AuthShell({
  children,
  eyebrow,
}: {
  children: ReactNode
  eyebrow: string
}) {
  return (
    <div className="grid min-h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="eyebrow">{eyebrow}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-emerald-ink lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div aria-hidden="true" className="paper-grain absolute inset-0 opacity-[0.05]" />
        <div
          aria-hidden="true"
          className="absolute -right-16 -bottom-24 size-80 rounded-full bg-emerald/25 blur-3xl"
        />

        <div className="relative">
          <Logo className="[&_span]:text-surface" />
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-3xl leading-[1.2] tracking-[-0.02em] text-surface">
            Kampus jadi lebih hidup begitu kamu ikut bergerak.
          </p>
          <ul className="mt-10 flex flex-col gap-5">
            {points.map((point, index) => (
              <li key={point} className="flex items-start gap-4 border-t border-moss-strong/15 pt-5">
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-moss-strong/70">
                  0{index + 1}
                </span>
                <span className="text-sm leading-relaxed text-moss">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[0.625rem] uppercase tracking-[0.18em] text-moss-strong/60">
          UKM Hub — Satu kampus, banyak cerita
        </p>
      </aside>
    </div>
  )
}
