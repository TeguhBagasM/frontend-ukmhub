import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useCreateDivision, useUpdateDivision } from '../../../hooks/use-divisions'
import { getErrorMessage } from '../../../lib/errors'
import type { Division } from '../../../lib/types'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Modal } from '../../ui/Modal'
import { Select } from '../../ui/Select'
import { Textarea } from '../../ui/Textarea'

const schema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter.'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

const emptyValues: FormValues = { name: '', description: '', status: 'active' }

interface DivisionFormModalProps {
  open: boolean
  onClose: () => void
  organizationId: string
  division?: Division | null
}

export function DivisionFormModal({ open, onClose, organizationId, division }: DivisionFormModalProps) {
  const createDivision = useCreateDivision(organizationId)
  const updateDivision = useUpdateDivision()
  const isEdit = Boolean(division)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues })

  useEffect(() => {
    if (open) {
      reset(
        division
          ? {
              name: division.name,
              description: division.description ?? '',
              status: division.status,
            }
          : emptyValues,
      )
    }
  }, [open, division, reset])

  const pending = createDivision.isPending || updateDivision.isPending

  function onSubmit(values: FormValues) {
    const payload = { ...values, description: values.description || undefined }

    if (division) {
      updateDivision.mutate(
        { id: division.id, payload },
        {
          onSuccess: () => {
            toast.success('Divisi berhasil diperbarui.')
            onClose()
          },
          onError: (error) => toast.error(getErrorMessage(error)),
        },
      )
      return
    }

    createDivision.mutate(payload, {
      onSuccess: () => {
        toast.success('Divisi berhasil dibuat.')
        onClose()
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit divisi' : 'Buat divisi'}
      description={isEdit ? 'Perbarui nama, deskripsi, dan status divisi.' : 'Tambahkan divisi baru dalam organisasi.'}
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input label="Nama" placeholder="mis. Programming" error={errors.name?.message} {...register('name')} />
        <Textarea label="Deskripsi" rows={3} placeholder="Tugas dan fokus divisi ini." error={errors.description?.message} {...register('description')} />
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
            {isEdit ? 'Simpan perubahan' : 'Buat divisi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}