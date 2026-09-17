import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCreateOrganization, useUpdateOrganization } from '../../hooks/use-organizations'
import { getErrorMessage } from '../../lib/errors'
import { slugify } from '../../lib/format'
import type { Organization } from '../../lib/types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const schema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter.'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug minimal 2 karakter.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya huruf kecil, angka, dan tanda hubung.'),
  description: z.string().optional(),
  logo: z.string().optional(),
  email: z.string().email('Format email belum benar.').or(z.literal('')).optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

const emptyValues: FormValues = {
  name: '',
  slug: '',
  description: '',
  logo: '',
  email: '',
  phone: '',
  status: 'active',
}

interface OrganizationFormModalProps {
  open: boolean
  onClose: () => void
  organization?: Organization | null
}

function toValues(organization?: Organization | null): FormValues {
  if (!organization) return emptyValues
  return {
    name: organization.name,
    slug: organization.slug,
    description: organization.description ?? '',
    logo: organization.logo ?? '',
    email: organization.email ?? '',
    phone: organization.phone ?? '',
    status: organization.status,
  }
}

export function OrganizationFormModal({ open, onClose, organization }: OrganizationFormModalProps) {
  const createOrg = useCreateOrganization()
  const updateOrg = useUpdateOrganization()
  const isEdit = Boolean(organization)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (open) reset(toValues(organization))
  }, [open, organization, reset])

  const name = watch('name')

  function autoSlug(event: React.SyntheticEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    if (!organization) {
      setValue('slug', slugify(value), { shouldValidate: true })
    }
  }

  const pending = createOrg.isPending || updateOrg.isPending

  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      slug: slugify(values.slug),
      description: values.description || undefined,
      logo: values.logo || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
    }

    if (organization) {
      updateOrg.mutate(
        { id: organization.id, payload },
        {
          onSuccess: () => {
            toast.success('Organisasi berhasil diperbarui.')
            onClose()
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      )
      return
    }

    createOrg.mutate(payload, {
      onSuccess: () => {
        toast.success('Organisasi berhasil dibuat.')
        onClose()
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit organisasi' : 'Buat organisasi'}
      description={isEdit ? 'Perbarui detail organisasi ini.' : 'Tambahkan organisasi baru ke platform.'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input label="Nama" placeholder="Creative Student Association" error={errors.name?.message} {...register('name', { onChange: autoSlug })} />
        <Input
          label="Slug"
          hint="Nama pendek untuk tautan publik."
          placeholder="creative-student-association"
          error={errors.slug?.message}
          {...register('slug')}
        />
        <Textarea label="Deskripsi" rows={3} placeholder="Sekilas tentang organisasi ini." error={errors.description?.message} {...register('description')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Email" type="email" placeholder="nama@kampus.ac.id" error={errors.email?.message} {...register('email')} />
          <Input label="Telepon" placeholder="0812 3456 7890" error={errors.phone?.message} {...register('phone')} />
        </div>
        <Input label="Logo" hint="URL gambar logo." placeholder="https://…" error={errors.logo?.message} {...register('logo')} />
        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
          error={errors.status?.message}
          {...register('status')}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={pending} type="button">
            Batal
          </Button>
          <Button type="submit" loading={pending}>
            {isEdit ? 'Simpan perubahan' : 'Buat organisasi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}