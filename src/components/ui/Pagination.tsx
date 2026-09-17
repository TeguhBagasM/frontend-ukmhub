import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '../../lib/cn'
import { buttonStyles } from './button-styles'

function pageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result: Array<number | 'ellipsis'> = []
  let previous = 0
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push('ellipsis')
    result.push(page)
    previous = page
  }
  return result
}

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = pageNumbers(page, totalPages)

  return (
    <nav
      aria-label="Paginasi"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={buttonStyles({ variant: 'outline', size: 'sm' })}
      >
        <ChevronLeft className="size-4" strokeWidth={1.6} aria-hidden="true" />
        Sebelumnya
      </button>

      <div className="flex items-center gap-1">
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 font-mono text-xs text-muted-soft"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'grid size-9 place-items-center rounded-md border font-mono text-xs transition-colors duration-200',
                item === page
                  ? 'border-emerald bg-moss text-emerald-ink'
                  : 'border-hairline-strong text-ink-soft hover:border-emerald hover:text-emerald',
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={buttonStyles({ variant: 'outline', size: 'sm' })}
      >
        Berikutnya
        <ChevronRight className="size-4" strokeWidth={1.6} aria-hidden="true" />
      </button>
    </nav>
  )
}