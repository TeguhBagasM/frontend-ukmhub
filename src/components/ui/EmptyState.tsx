import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline-strong bg-surface/60 px-8 py-14 text-center',
        className,
      )}
    >
      {Icon ? (
        <span className="mb-5 grid size-11 place-items-center rounded-full border border-hairline-strong bg-paper text-emerald">
          <Icon className="size-5" strokeWidth={1.6} />
        </span>
      ) : null}
      <h3 className="text-base font-medium text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
