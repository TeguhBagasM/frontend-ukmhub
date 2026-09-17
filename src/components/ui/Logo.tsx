import { cn } from '../../lib/cn'

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 28 28"
        className="size-7 shrink-0"
        role="img"
        aria-label="UKM Hub"
        fill="none"
      >
        <rect x="1.25" y="1.25" width="25.5" height="25.5" rx="7" stroke="#16211d" strokeWidth="1.6" />
        <path d="M9 19.5V8.5" stroke="#16211d" strokeWidth="1.6" strokeLinecap="round" />
        <path
          d="M9 14.2a5.3 5.3 0 0 0 10.6 0V8.5"
          stroke="#16211d"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="19.6" cy="8.5" r="2.6" fill="#0f7a5a" />
      </svg>
      {showWordmark ? (
        <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
          UKM<span className="text-emerald">Hub</span>
        </span>
      ) : null}
    </span>
  )
}
