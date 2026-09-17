import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'emerald' | 'marigold'

const tones: Record<Tone, string> = {
  neutral: 'border-hairline-strong text-muted',
  emerald: 'border-moss-strong bg-moss text-emerald-ink',
  marigold: 'border-marigold/40 bg-marigold/10 text-marigold',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
        'font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
