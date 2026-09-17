import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...props },
  ref,
) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <div className="flex items-start gap-3">
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={cn(
          'mt-0.5 size-5 shrink-0 rounded-sm border-hairline-strong bg-surface text-emerald accent-emerald',
          'focus:ring-2 focus:ring-emerald/25 focus:ring-offset-2 focus:ring-offset-surface',
          className,
        )}
        {...props}
      />
      {label ? (
        <label htmlFor={checkboxId} className="cursor-pointer">
          <span className="block text-sm font-medium text-ink">{label}</span>
          {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
        </label>
      ) : null}
    </div>
  )
})