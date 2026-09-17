import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { Textarea } from '../../ui/Textarea'

const schema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, 'Alasan wajib diisi, minimal 3 karakter.'),
})

type FormValues = z.infer<typeof schema>

interface RejectDialogProps {
  open: boolean
  onClose: () => void
  loading: boolean
  onSubmit: (reason: string) => void
}

export function RejectDialog({ open, onClose, loading, onSubmit }: RejectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { reason: '' } })

  useEffect(() => {
    if (open) reset({ reason: '' })
  }, [open, reset])

  function submit(values: FormValues) {
    onSubmit(values.reason)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tolak pendaftaran"
      description="Tuliskan alasan supaya pendaftar bisa memperbaiki dan mendaftar lagi."
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
        <Textarea
          label="Alasan"
          rows={3}
          placeholder="mis. Kuota penuh / jawaban belum lengkap."
          error={errors.reason?.message}
          {...register('reason')}
        />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading} type="button">
            Batal
          </Button>
          <Button type="submit" loading={loading} className="bg-clay hover:bg-clay">
            Tolak pendaftaran
          </Button>
        </div>
      </form>
    </Modal>
  )
}