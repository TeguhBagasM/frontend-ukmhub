import { useId } from 'react'
import type { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { Checkbox } from '../ui/Checkbox'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import type { FormField } from '../../lib/types'
import { Field } from '../ui/Field'

export type DynamicFormValues = Record<string, string>

interface DynamicFormFieldProps {
  field: FormField
  name: string
  register: UseFormRegister<DynamicFormValues>
  setValue: UseFormSetValue<DynamicFormValues>
  getValues: UseFormGetValues<DynamicFormValues>
  error?: string
}

export function DynamicFormField({
  field,
  name,
  register,
  setValue,
  getValues,
  error,
}: DynamicFormFieldProps) {
  const generatedId = useId()
  const inputId = `${field.id}-${generatedId}`
  const hintId = `${inputId}-hint`
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = error ? errorId : field.description ? hintId : undefined

  const common = { id: inputId, error, hint: field.description || undefined, 'aria-describedby': describedBy }

  function toggleCheckbox(option: string, checked: boolean) {
    const current = getValues(name)
    const selected = current ? current.split('; ').filter(Boolean) : []
    const next = checked
      ? [...selected, option]
      : selected.filter((item) => item !== option)
    setValue(name, next.join('; '), { shouldValidate: true })
  }

  switch (field.type) {
    case 'TEXTAREA':
      return (
        <Textarea
          label={`${field.label}${field.required ? ' *' : ''}`}
          placeholder={field.placeholder || undefined}
          rows={4}
          {...common}
          {...register(name)}
        />
      )

    case 'EMAIL':
      return (
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={field.placeholder || undefined}
          {...common}
          {...register(name)}
        />
      )

    case 'NUMBER':
      return (
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          type="number"
          inputMode="numeric"
          placeholder={field.placeholder || undefined}
          {...common}
          {...register(name)}
        />
      )

    case 'PHONE':
      return (
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={field.placeholder || undefined}
          {...common}
          {...register(name)}
        />
      )

    case 'DATE':
      return (
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          type="date"
          placeholder={field.placeholder || undefined}
          {...common}
          {...register(name)}
        />
      )

    case 'URL':
      return (
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          type="url"
          inputMode="url"
          placeholder={field.placeholder || 'https://…'}
          {...common}
          {...register(name)}
        />
      )

    case 'SELECT':
      return (
        <Select
          label={`${field.label}${field.required ? ' *' : ''}`}
          placeholder={field.required ? 'Pilih salah satu…' : (field.placeholder || 'Pilih jika ada…')}
          options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
          {...common}
          {...register(name)}
        />
      )

    case 'RADIO': {
      const options = field.options ?? []
      return (
        <Field label={`${field.label}${field.required ? ' *' : ''}`} error={error} hint={field.description} htmlFor={inputId}>
          <div role="radiogroup" aria-labelledby={inputId} className="flex flex-col gap-3">
            {(options.length ? options : ['']).map((option) => (
              <label key={`${option}-${option.length}`} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  value={option}
                  {...register(name)}
                  className="size-4.5 accent-emerald focus:outline-none focus:ring-2 focus:ring-emerald/25"
                />
                <span className="text-sm text-ink-soft">{option}</span>
              </label>
            ))}
          </div>
        </Field>
      )
    }

    case 'CHECKBOX': {
      const options = field.options ?? []
      const selected = getValues(name) ? getValues(name).split('; ').filter(Boolean) : []
      return (
        <Field label={`${field.label}${field.required ? ' *' : ''}`} error={error} hint={field.description} htmlFor={inputId}>
          {/* Input tersembunyi agar nilai grup masuk ke form dan validasi bekerja. */}
          <input type="hidden" value={getValues(name)} {...register(name)} />
          <div className="flex flex-col gap-3" role="group" aria-labelledby={inputId}>
            {options.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={selected.includes(option)}
                onChange={(event) => toggleCheckbox(option, event.target.checked)}
              />
            ))}
          </div>
        </Field>
      )
    }

    default:
      return (
        <Input
          label={`${field.label}${field.required ? ' *' : ''}`}
          placeholder={field.placeholder || undefined}
          {...common}
          {...register(name)}
        />
      )
  }
}