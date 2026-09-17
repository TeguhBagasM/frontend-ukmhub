import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="eyebrow text-ink-soft">
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-11 w-full rounded-md border bg-surface px-3.5 text-sm text-ink transition-colors duration-200',
          'placeholder:text-muted-soft',
          'focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/15',
          error ? 'border-clay' : 'border-hairline-strong hover:border-muted-soft',
          className,
        )}
        {...props}
      />

      {error ? (
        <p id={`${inputId}-error`} className="text-xs leading-relaxed text-clay">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})
