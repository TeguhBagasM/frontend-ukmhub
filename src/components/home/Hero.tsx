import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { heroWords } from '../../lib/content'
import { Container } from '../ui/Container'
import { buttonStyles } from '../ui/button-styles'

function RotatingWord() {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setIndex((value) => (value + 1) % heroWords.length), 2600)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <span className="relative inline-block text-emerald">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={heroWords[index]}
          initial={{ y: '0.6em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.6em', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block italic"
        >
          {heroWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function HeroPoster() {
  const reduce = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.6 })
  const springY = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.6 })

  const cardX = useTransform(springX, (value) => value * 16)
  const cardY = useTransform(springY, (value) => value * 16)
  const frameX = useTransform(springX, (value) => value * -22)
  const frameY = useTransform(springY, (value) => value * -22)
  const chipX = useTransform(springX, (value) => value * 30)
  const chipY = useTransform(springY, (value) => value * 30)

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-none"
      onPointerMove={(event) => {
        if (reduce) return
        const rect = event.currentTarget.getBoundingClientRect()
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
      }}
      onPointerLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{ x: frameX, y: frameY }}
        className="paper-grid absolute -inset-x-6 -inset-y-8 -z-10 rounded-xl border border-hairline"
      />

      <motion.article
        style={{ x: cardX, y: cardY }}
        className="relative overflow-hidden rounded-xl border border-hairline bg-surface p-6 shadow-lift sm:p-7"
      >
        <div className="flex items-center justify-between">
          <span className="eyebrow">UKM / 03 — Seni &amp; Budaya</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-emerald">
            <span className="size-1.5 rounded-full bg-emerald" />
            Aktif
          </span>
        </div>

        <p className="mt-10 font-display text-5xl leading-[0.9] tracking-[-0.03em] text-ink sm:text-6xl">
          Paduan
          <br />
          <span className="italic text-forest">Suara</span>
        </p>

        <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
          Latihan rutin tiap Rabu &amp; Sabtu, plus dua konser besar setiap semester. Terbuka untuk
          semua angkatan.
        </p>

        <div className="mt-7 flex items-center gap-3">
          {['Musik', 'Vokal', 'Panggung'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-hairline-strong px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-3 divide-x divide-hairline border-t border-hairline pt-5">
          {[
            { value: '124', label: 'Anggota' },
            { value: '8', label: 'Agenda' },
            { value: '4.9', label: 'Rating' },
          ].map((item) => (
            <div key={item.label} className="px-2 first:pl-0">
              <p className="font-display text-2xl tracking-[-0.02em] text-ink">{item.value}</p>
              <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.div
        style={{ x: chipX, y: chipY }}
        className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-lg border border-hairline bg-paper px-4 py-3 shadow-lift sm:-left-8"
      >
        <span className="grid size-8 place-items-center rounded-full bg-moss text-emerald-ink">
          <CalendarDays className="size-4" strokeWidth={1.7} />
        </span>
        <span>
          <span className="block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
            Agenda terdekat
          </span>
          <span className="block text-xs font-medium text-ink">Open Mic · 12 Sep</span>
        </span>
      </motion.div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-10%] size-[26rem] rounded-full bg-moss/50 blur-3xl"
      />
      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="eyebrow"
            >
              01 — Ruang mahasiswa
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-[2.75rem] leading-[1.02] font-medium tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]"
            >
              Ruang mahasiswa untuk <RotatingWord />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              UKM Hub menyatukan seluruh unit kegiatan kampus dalam satu tempat — temukan komunitas,
              ikuti agendanya, dan kelola organisasimu tanpa ribet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link to="/register" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
                Mulai jelajahi
                <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
                Saya sudah punya akun
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted"
            >
              48 UKM · 1.240 mahasiswa · 12 fakultas
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroPoster />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
