import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCreateEvent, useUpdateEvent } from '../../../hooks/use-events'
import { getErrorMessage } from '../../../lib/errors'
import { slugify, toInputDatetimeLocal } from '../../../lib/format'
import type { Event } from '../../../lib/types'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Modal } from '../../ui/Modal'
import { Select } from '../../ui/Select'
import { Textarea } from '../../ui/Textarea'

const schema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter.'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug minimal 2 karakter.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya huruf kecil, angka, dan tanda hubung.'),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  registration_start: z.string().optional(),
  registration_end: z.string().optional(),
  quota: z.string().refine((value) => value === '' || /^\d+$/.test(value), 'Cukup angka bulat.'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED']),
})

type FormValues = z.infer<typeof schema>

const emptyValues: FormValues = {
  name: '',
  slug: '',
  description: '',
  location: '',
  start_date: '',
  end_date: '',
  registration_start: '',
  registration_end: '',
  quota: '',
  status: 'DRAFT',
}

interface EventFormModalProps {
  open: boolean
  onClose: () => void
  organizationId: string
  event?: Event | null
}

function toValues(event?: Event | null): FormValues {
  if (!event) return emptyValues
  return {
    name: event.name,
    slug: event.slug,
    description: event.description ?? '',
    location: event.location ?? '',
    start_date: toInputDatetimeLocal(event.start_date),
    end_date: toInputDatetimeLocal(event.end_date),
    registration_start: toInputDatetimeLocal(event.registration_start),
    registration_end: toInputDatetimeLocal(event.registration_end),
    quota: event.quota ? String(event.quota) : '',
    status: event.status,
  }
}

export function EventFormModal({ open, onClose, organizationId, event }: EventFormModalProps) {
  const createEvent = useCreateEvent(organizationId)
  const updateEvent = useUpdateEvent(organizationId)
  const isEdit = Boolean(event)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues })

  useEffect(() => {
    if (open) reset(toValues(event))
  }, [open, event, reset])

  function autoSlug(eventHandler: React.SyntheticEvent<HTMLInputElement>) {
    if (!event) {
      setValue('slug', slugify(eventHandler.currentTarget.value), { shouldValidate: true })
    }
  }

  const pending = createEvent.isPending || updateEvent.isPending

  function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      slug: slugify(values.slug),
      description: values.description || undefined,
      location: values.location || undefined,
      start_date: values.start_date || undefined,
      end_date: values.end_date || undefined,
      registration_start: values.registration_start || undefined,
      registration_end: values.registration_end || undefined,
      quota: values.quota ? Number(values.quota) : undefined,
      status: values.status,
    }

    const options = {
      onSuccess: () => {
        toast.success(isEdit ? 'Event berhasil diperbarui.' : 'Event berhasil dibuat.')
        onClose()
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    }

    if (event) {
      updateEvent.mutate({ id: event.id, payload }, options)
    } else {
      createEvent.mutate(payload, options)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit event' : 'Buat event'}
      description="Atur detail kegiatan dan jendela pendaftarannya."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Nama" placeholder="mis. Open Recruitment 2026" error={errors.name?.message} {...register('name', { onChange: autoSlug })} />
          <Input label="Slug" placeholder="open-recruitment-2026" error={errors.slug?.message} {...register('slug')} />
        </div>
        <Textarea label="Deskripsi" rows={3} placeholder="Apa yang akan terjadi di event ini?" error={errors.description?.message} {...register('description')} />
        <Input label="Lokasi" placeholder="Aula Kampus / Online" error={errors.location?.message} {...register('location')} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Mulai event" type="datetime-local" error={errors.start_date?.message} {...register('start_date')} />
          <Input label="Selesai event" type="datetime-local" error={errors.end_date?.message} {...register('end_date')} />
          <Input label="Buka pendaftaran" type="datetime-local" error={errors.registration_start?.message} {...register('registration_start')} />
          <Input label="Tutup pendaftaran" type="datetime-local" error={errors.registration_end?.message} {...register('registration_end')} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Kuota"
            type="number"
            min={0}
            placeholder="mis. 50"
            error={errors.quota?.message}
            {...register('quota')}
          />
          <Select
            label="Status"
            options={[
              { value: 'DRAFT', label: 'Draf' },
              { value: 'PUBLISHED', label: 'Terbit' },
              { value: 'CLOSED', label: 'Ditutup' },
              { value: 'ARCHIVED', label: 'Arsip' },
            ]}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={pending} type="button">
            Batal
          </Button>
          <Button type="submit" loading={pending}>
            {isEdit ? 'Simpan perubahan' : 'Buat event'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}