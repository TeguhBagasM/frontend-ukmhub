import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { FormField, SubmitRegistrationAnswer } from '../../lib/types'
import { Button } from '../ui/Button'
import { DynamicFormField, type DynamicFormValues } from './DynamicFormField'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const urlRe = /^(https?):\/\/[^\s]+$/i
const phoneRe = /^[+\d][\d\s-]{5,20}$/
const numberRe = /^\d+(\.\d+)?$/

function validateType(type: FormField['type'], value: string): boolean {
  switch (type) {
    case 'EMAIL':
      return emailRe.test(value)
    case 'URL':
      return urlRe.test(value)
    case 'PHONE':
      return phoneRe.test(value)
    case 'NUMBER':
      return numberRe.test(value)
    default:
      return true
  }
}

function typeLabel(type: FormField['type']): string {
  switch (type) {
    case 'EMAIL':
      return 'Format email belum benar.'
    case 'URL':
      return 'Tulis URL lengkap, mis. https://contoh.id.'
    case 'PHONE':
      return 'Nomor telepon belum valid.'
    case 'NUMBER':
      return 'Isi dengan angka.'
    default:
      return ''
  }
}

function fieldSchema(field: FormField): z.ZodType<string> {
  if (field.required) {
    return z
      .string()
      .min(1, 'Wajib diisi.')
      .refine((value) => validateType(field.type, value), typeLabel(field.type))
  }
  const optionalType = typeLabel(field.type)
  if (optionalType) {
    return z
      .string()
      .refine((value) => value === '' || validateType(field.type, value), optionalType)
  }
  return z.string()
}

function buildSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodType<string>> = {}
  fields.forEach((field, index) => {
    shape[`f${index}`] = fieldSchema(field)
  })
  return z.object(shape)
}

interface DynamicFormRendererProps {
  fields: FormField[]
  title?: string
  description?: string
  submitLabel?: string
  busy?: boolean
  onSubmit: (answers: SubmitRegistrationAnswer[]) => void
}

export function DynamicFormRenderer({
  fields,
  title,
  description,
  submitLabel = 'Kirim pendaftaran',
  busy = false,
  onSubmit,
}: DynamicFormRendererProps) {
  const schema = buildSchema(fields)
  const defaultValues: DynamicFormValues = Object.fromEntries(
    fields.map((_, index) => [`f${index}`, '']),
  )

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DynamicFormValues>({
    resolver: zodResolver(schema as never),
    defaultValues,
  })

  function submit(values: DynamicFormValues) {
    const answers: SubmitRegistrationAnswer[] = fields.map((field, index) => ({
      field_id: field.id,
      value: values[`f${index}`] ?? '',
    }))
    onSubmit(answers)
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-6">
      {title ? <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink">{title}</h2> : null}
      {description ? <p className="-mt-3 text-sm leading-relaxed text-muted">{description}</p> : null}

      {fields.map((field, index) => (
        <DynamicFormField
          key={field.id}
          field={field}
          name={`f${index}`}
          register={register}
          setValue={setValue}
          getValues={getValues}
          error={errors[`f${index}`]?.message as string | undefined}
        />
      ))}

      <Button type="submit" size="lg" loading={busy || isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  )
}