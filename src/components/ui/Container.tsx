import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode
  className?: string
  size?: 'default' | 'wide' | 'narrow'
}) {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-[88rem]',
  }

  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', widths[size], className)}>{children}</div>
  )
}
