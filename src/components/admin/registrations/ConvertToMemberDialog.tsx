import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useDivisions } from '../../../hooks/use-divisions'
import { useConvertRegistration } from '../../../hooks/use-members'
import { getErrorMessage } from '../../../lib/errors'
import type { RegistrationAnswer } from '../../../lib/types'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Modal } from '../../ui/Modal'
import { Select } from '../../ui/Select'

function findAnswer(answers: RegistrationAnswer[], keys: string[]): string {
  for (const key of keys) {
    const match = answers.find((answer) =>
      answer.label.toLowerCase().includes(key) || answer.name?.toLowerCase().includes(key),
    )
    if (match?.value?.trim()) return match.value.trim()
  }
  return ''
}

const schema = z.object({
  division_id: z.string().min(1, 'Pilih divisi untuk anggota.'),
  name: z.string().trim().min(3, 'Nama minimal 3 karakter.'),
  email: z.string().email('Format email belum benar.').or(z.literal('')).optional(),
  phone: z.string().optional(),
  student_id: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

interface ConvertToMemberDialogProps {
  open: boolean
  onClose: () => void
  registrationId: string
  organizationId: string
  answers: RegistrationAnswer[]
}

export function ConvertToMemberDialog({
  open,
  onClose,
  registrationId,
  organizationId,
  answers,
}: ConvertToMemberDialogProps) {
  const divisions = useDivisions(organizationId)
  const convert = useConvertRegistration()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      division_id: '',
      name: '',
      email: '',
      phone: '',
      student_id: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        division_id: '',
        name: findAnswer(answers, ['nama', 'name']),
        email: findAnswer(answers, ['email']),
        phone: findAnswer(answers, ['telepon', 'phone', 'whatsapp', 'wa']),
        student_id: findAnswer(answers, ['nim', 'npm', 'nrp', 'student']),
        status: 'active',
      })
    }
  }, [open, answers, reset])

  function onSubmit(values: FormValues) {
    convert.mutate(
      {
        registrationId,
        payload: {
          division_id: values.division_id,
          name: values.name,
          email: values.email || '',
          phone: values.phone || '',
          student_id: values.student_id || '',
          status: values.status,
        },
      },
      {
        onSuccess: () => {
          toast.success('Pendaftar berhasil dijadikan anggota.')
          onClose()
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Jadikan anggota"
      description="Buat data anggota dari pendaftar yang diterima. Data terisi otomatis dari jawaban."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Select
          label="Divisi"
          placeholder="Pilih divisi…"
          options={(divisions.data ?? []).map((division) => ({
            value: division.id,
            label: division.name,
          }))}
          error={errors.division_id?.message}
          {...register('division_id')}
        />
        <Input label="Nama" error={errors.name?.message} {...register('name')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Telepon" error={errors.phone?.message} {...register('phone')} />
        </div>
        <Input label="NIM / No. induk" error={errors.student_id?.message} {...register('student_id')} />
        <Select
          label="Status"
          options={[
            { value: 'active', label: 'Aktif' },
            { value: 'inactive', label: 'Nonaktif' },
          ]}
          {...register('status')}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={convert.isPending} type="button">
            Batal
          </Button>
          <Button type="submit" loading={convert.isPending}>
            Konversi jadi anggota
          </Button>
        </div>
      </form>
    </Modal>
  )
}