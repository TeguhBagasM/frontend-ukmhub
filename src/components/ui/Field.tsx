import { useId } from 'react'
import type { ReactNode } from 'react'

interface FieldProps {
  label?: string
  hint?: string
  error?: string
  htmlFor?: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, hint, error, htmlFor, required, children }: FieldProps) {
  const generatedId = useId()
  const fieldId = htmlFor ?? generatedId

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={fieldId} className="eyebrow text-ink-soft">
            {label}
            {required ? <span className="text-emerald"> *</span> : null}
          </label>
        </div>
      ) : null}

      {children}

      {error ? (
        <p id={`${fieldId}-error`} className="text-xs leading-relaxed text-clay" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}