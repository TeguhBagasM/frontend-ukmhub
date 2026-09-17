import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ eyebrow, title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}