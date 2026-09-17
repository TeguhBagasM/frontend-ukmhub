import { ChevronDown } from 'lucide-react'
import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  placeholder?: string
  options: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id, placeholder, options, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={selectId} className="eyebrow text-ink-soft">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full appearance-none rounded-md border bg-surface px-3.5 text-sm text-ink transition-colors duration-200',
            'focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/15',
            error ? 'border-clay' : 'border-hairline-strong hover:border-muted-soft',
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="text-xs leading-relaxed text-clay">
          {error}
        </p>
      ) : hint ? (
        <p id={`${selectId}-hint`} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})