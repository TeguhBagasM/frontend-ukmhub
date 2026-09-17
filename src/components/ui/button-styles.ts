import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-all duration-300 ease-[var(--ease-editorial)] disabled:cursor-not-allowed disabled:opacity-55'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-emerald text-surface hover:bg-emerald-deep hover:shadow-lift',
  dark: 'bg-ink text-surface hover:bg-forest hover:shadow-lift',
  outline: 'border border-hairline-strong text-ink hover:border-emerald hover:text-emerald',
  ghost: 'text-ink hover:bg-paper-deep',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.9375rem]',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(base, variants[variant], sizes[size], className)
}
