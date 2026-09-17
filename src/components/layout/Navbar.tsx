import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../lib/cn'
import { useAuthStore } from '../../stores/auth.store'
import { Container } from '../ui/Container'
import { buttonStyles } from '../ui/button-styles'
import { Logo } from '../ui/Logo'

const links = [
  { label: 'Event', href: '/events' },
  { label: 'Jelajahi', href: '/#jelajahi' },
  { label: 'Kegiatan', href: '/#kegiatan' },
  { label: 'Tentang', href: '/#tentang' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500 ease-[var(--ease-editorial)]',
        scrolled
          ? 'border-b border-hairline bg-paper/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <Container className="flex items-center justify-between">
        <div
          className={cn(
            'flex w-full items-center justify-between transition-all duration-500 ease-[var(--ease-editorial)]',
            scrolled ? 'h-14' : 'h-20',
          )}
        >
          <Link to="/" className="rounded-md" aria-label="Beranda UKM Hub">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="link-underline text-[0.8125rem] font-medium tracking-tight text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {token ? (
              <Link to="/dashboard" className={buttonStyles({ variant: 'dark', size: 'sm' })}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                  Masuk
                </Link>
                <Link to="/register" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                  Gabung
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-md border border-hairline-strong text-ink md:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-hairline bg-paper md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-deep"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {token ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={buttonStyles({ variant: 'dark', size: 'md' })}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className={buttonStyles({ variant: 'outline', size: 'md' })}
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className={buttonStyles({ variant: 'primary', size: 'md' })}
                    >
                      Gabung
                    </Link>
                  </>
                )}
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
