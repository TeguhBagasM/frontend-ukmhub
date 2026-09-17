import { Check } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'

import { useUpdateProfile } from '../../hooks/use-auth'
import { getErrorMessage } from '../../lib/errors'
import type { UpdateProfilePayload, User } from '../../lib/types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface FieldErrors {
  name?: string
  email?: string
}

export function EditProfileForm({ user }: { user: User }) {
  const update = useUpdateProfile()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [errors, setErrors] = useState<FieldErrors>({})

  const dirty = name.trim() !== user.name || email.trim() !== user.email

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: FieldErrors = {}
    if (name.trim().length < 3) next.name = 'Nama minimal 3 karakter.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Format email belum benar.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    const payload: UpdateProfilePayload = {}
    if (name.trim() !== user.name) payload.name = name.trim()
    if (email.trim() !== user.email) payload.email = email.trim()

    if (Object.keys(payload).length === 0) {
      toast('Belum ada perubahan untuk disimpan.')
      return
    }

    update.mutate(payload, {
      onSuccess: () => toast.success('Profil berhasil diperbarui.'),
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <div className="rounded-lg border border-hairline bg-surface">
      <div className="border-b border-hairline p-6">
        <h2 className="text-base font-medium text-ink">Informasi akun</h2>
        <p className="mt-1 text-sm text-muted">
          Perbarui nama tampilan dan email yang terhubung dengan akunmu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6" noValidate>
        <Input
          label="Nama lengkap"
          value={name}
          error={errors.name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div className="mt-1 flex items-center gap-4">
          <Button type="submit" loading={update.isPending} disabled={!dirty}>
            {update.isPending ? 'Menyimpan…' : 'Simpan perubahan'}
          </Button>
          {!dirty && !update.isPending ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Check className="size-3.5 text-emerald" strokeWidth={2} />
              Tersimpan
            </span>
          ) : null}
        </div>
      </form>
    </div>
  )
}
