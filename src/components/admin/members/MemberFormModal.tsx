import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useDivisions } from '../../../hooks/use-divisions'
import { useUpdateMember } from '../../../hooks/use-members'
import { getErrorMessage } from '../../../lib/errors'
import type { Member } from '../../../lib/types'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { Modal } from '../../ui/Modal'
import { Select } from '../../ui/Select'

const schema = z.object({
  division_id: z.string(),
  name: z.string().trim().min(3, 'Nama minimal 3 karakter.'),
  email: z.string().email('Format email belum benar.').or(z.literal('')),
  phone: z.string(),
  student_id: z.string(),
  status: z.enum(['active', 'inactive']),
})

type FormValues = z.infer<typeof schema>

interface MemberFormModalProps {
  open: boolean
  onClose: () => void
  member: Member
}

export function MemberFormModal({ open, onClose, member }: MemberFormModalProps) {
  const divisions = useDivisions(member.organization_id)
  const update = useUpdateMember()
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      division_id: member.division_id ?? '',
      name: member.name,
      email: member.email ?? '',
      phone: member.phone ?? '',
      student_id: member.student_id ?? '',
      status: member.status,
    },
  })

  function onSubmit(values: FormValues) {
    update.mutate({ id: member.id, payload: values }, {
      onSuccess: () => { toast.success('Data anggota diperbarui.'); onClose() },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit anggota" description="Perbarui data anggota." className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input label="Nama" error={errors.name?.message} {...register('name')} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Telepon" {...register('phone')} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="NIM / No. induk" {...register('student_id')} />
          <Select label="Divisi" options={divisions.data?.map((item) => ({ value: item.id, label: item.name })) ?? []} {...register('division_id')} />
        </div>
        <Select label="Status" options={[{ value: 'active', label: 'Aktif' }, { value: 'inactive', label: 'Nonaktif' }]} {...register('status')} />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
          <Button type="submit" loading={update.isPending}>Simpan</Button>
        </div>
      </form>
    </Modal>
  )
}
