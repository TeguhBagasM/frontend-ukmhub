import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, rows = 4, ...props },
  ref,
) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const describedBy = error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={textareaId} className="eyebrow text-ink-soft">
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-md border bg-surface px-3.5 py-3 text-sm text-ink transition-colors duration-200',
          'placeholder:text-muted-soft',
          'focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/15',
          error ? 'border-clay' : 'border-hairline-strong hover:border-muted-soft',
          className,
        )}
        {...props}
      />

      {error ? (
        <p id={`${textareaId}-error`} className="text-xs leading-relaxed text-clay">
          {error}
        </p>
      ) : hint ? (
        <p id={`${textareaId}-hint`} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
})