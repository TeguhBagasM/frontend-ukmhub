import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCreateField, useUpdateField } from '../../../hooks/use-forms'
import { FORM_FIELD_TYPE_OPTIONS, usesOptions } from '../../../lib/form-field'
import { getErrorMessage } from '../../../lib/errors'
import { slugify } from '../../../lib/format'
import type { FormField, FormFieldType } from '../../../lib/types'
import { Checkbox } from '../../ui/Checkbox'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Modal } from '../../ui/Modal'
import { Select } from '../../ui/Select'
import { Textarea } from '../../ui/Textarea'

const schema = z
  .object({
    label: z.string().trim().min(1, 'Label wajib diisi.'),
    name: z
      .string()
      .trim()
      .min(1, 'Nama field wajib diisi.')
      .regex(/^[a-z0-9_]+$/, 'Hanya huruf kecil, angka, dan garis bawah.'),
    type: z.enum([
      'TEXT',
      'TEXTAREA',
      'EMAIL',
      'NUMBER',
      'PHONE',
      'DATE',
      'SELECT',
      'RADIO',
      'CHECKBOX',
      'URL',
    ]),
    placeholder: z.string().optional(),
    description: z.string().optional(),
    required: z.boolean().default(false),
    optionsText: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const options = (values.optionsText ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (usesOptions(values.type) && options.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['optionsText'],
        message: 'Tulis minimal satu pilihan, satu per baris.',
      })
    }
  })

type FormValues = z.infer<typeof schema>

const emptyValues: FormValues = {
  label: '',
  name: '',
  type: 'TEXT',
  placeholder: '',
  description: '',
  required: false,
  optionsText: '',
}

interface FieldFormModalProps {
  open: boolean
  onClose: () => void
  formId: string
  field?: FormField | null
  nextSortOrder: number
}

function toValues(field?: FormField | null): FormValues {
  if (!field) return emptyValues
  return {
    label: field.label,
    name: field.name,
    type: field.type,
    placeholder: field.placeholder ?? '',
    description: field.description ?? '',
    required: field.required,
    optionsText: (field.options ?? []).join('\n'),
  }
}

export function FieldFormModal({ open, onClose, formId, field, nextSortOrder }: FieldFormModalProps) {
  const createField = useCreateField()
  const updateField = useUpdateField()
  const isEdit = Boolean(field)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues })

  useEffect(() => {
    if (open) reset(toValues(field))
  }, [open, field, reset])

  const type = watch('type')
  const label = watch('label')
  const showOptions = usesOptions(type)

  function autoSlug(event: React.SyntheticEvent<HTMLInputElement>) {
    if (!field) {
      const value = event.currentTarget.value
      setValue('name', slugify(value).replace(/-/g, '_'), { shouldValidate: true })
    }
  }

  const pending = createField.isPending || updateField.isPending

  function onSubmit(values: FormValues) {
    const options = showOptions
      ? (values.optionsText ?? '').split('\n').map((line) => line.trim()).filter(Boolean)
      : []

    const payload = {
      label: values.label,
      name: values.name,
      type: values.type as FormFieldType,
      placeholder: values.placeholder || undefined,
      description: values.description || undefined,
      required: values.required,
      options,
    }

    const optionsHandler = {
      onSuccess: () => {
        toast.success(isEdit ? 'Field berhasil diperbarui.' : 'Field berhasil ditambahkan.')
        onClose()
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    }

    if (field) {
      updateField.mutate({ fieldId: field.id, payload }, optionsHandler)
    } else {
      createField.mutate({ formId, payload: { ...payload, sort_order: nextSortOrder } }, optionsHandler)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit field' : 'Tambah field'}
      description="Jenis field menentukan tampilan di formulir pendaftaran."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Select
          label="Jenis field"
          options={FORM_FIELD_TYPE_OPTIONS}
          error={errors.type?.message}
          {...register('type')}
        />

        <Input label="Label" placeholder="mis. Nama Lengkap" error={errors.label?.message} {...register('label', { onChange: autoSlug })} />
        <Input
          label="Nama field"
          hint="Pengidentifikasi internal, otomatis dari label."
          placeholder="nama_lengkap"
          error={errors.name?.message}
          {...register('name')}
        />

        {showOptions ? (
          <Textarea
            label="Pilihan"
            rows={5}
            hint="Satu pilihan per baris."
            placeholder={'Pilihan A\nPilihan B\nPilihan C'}
            error={errors.optionsText?.message}
            {...register('optionsText')}
          />
        ) : null}

        <Input label="Placeholder" placeholder="mis. Tulis jawabanmu…" error={errors.placeholder?.message} {...register('placeholder')} />
        <Textarea
          label="Deskripsi bantuan"
          rows={2}
          hint="Muncul di bawah field; boleh dikosongkan."
          error={errors.description?.message}
          {...register('description')}
        />

        <Checkbox label="Wajib diisi" description="Petunjuk untuk pendaftar bahwa field ini tidak boleh kosong." {...register('required')} />

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={pending} type="button">
            Batal
          </Button>
          <Button type="submit" loading={pending} disabled={label.trim().length === 0 && !field}>
            {isEdit ? 'Simpan perubahan' : 'Tambah field'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}