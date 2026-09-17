import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    // Fokus pertama ke panel dialog untuk pembaca layar & keyboard.
    requestAnimationFrame(() => dialogRef.current?.focus())

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Tutup dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${title}-title`}
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative w-full max-w-md overflow-hidden rounded-xl border border-hairline bg-surface shadow-lift focus:outline-none',
              className,
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline p-5">
              <div>
                <h2
                  id={`${title}-title`}
                  className="font-display text-lg font-medium tracking-[-0.02em] text-ink"
                >
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup dialog"
                className="grid size-9 shrink-0 place-items-center rounded-md border border-hairline-strong text-ink-soft transition-colors hover:border-emerald hover:text-emerald"
              >
                <X className="size-4" strokeWidth={1.6} aria-hidden="true" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}