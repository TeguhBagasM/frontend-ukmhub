import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthShell } from '../components/auth/AuthShell'
import { Page } from '../components/layout/Page'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useRegister } from '../hooks/use-auth'
import { getErrorMessage } from '../lib/errors'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: FieldErrors = {}
    if (name.trim().length < 3) next.name = 'Nama minimal 3 karakter.'
    if (!email.trim()) next.email = 'Email wajib diisi.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Format email belum benar.'
    if (password.length < 6) next.password = 'Kata sandi minimal 6 karakter.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    register.mutate(
      { name: name.trim(), email: email.trim(), password },
      { onSuccess: () => navigate('/dashboard', { replace: true }) },
    )
  }

  return (
    <Page>
      <AuthShell eyebrow="Buat akun">
        <h1 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-ink">
          Mulai dari satu akun.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Gratis untuk seluruh mahasiswa. Tidak butuh verifikasi berbelit.
        </p>

        {register.isError ? (
          <div className="mt-6 flex items-start gap-3 rounded-md border border-clay/30 bg-clay/5 px-3.5 py-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.8} />
            <p className="text-xs leading-relaxed text-clay">{getErrorMessage(register.error)}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
          <Input
            label="Nama lengkap"
            autoComplete="name"
            placeholder="Nama lengkapmu"
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
          />

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="nama@kampus.ac.id"
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            label="Kata sandi"
            type="password"
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            value={password}
            error={errors.password}
            hint="Gunakan kombinasi huruf dan angka agar aman."
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button type="submit" size="lg" loading={register.isPending} className="mt-1 w-full">
            {register.isPending ? 'Membuat akun…' : 'Buat akun'}
          </Button>
        </form>

        <p className="mt-8 text-sm text-muted">
          Sudah punya akun?{' '}
          <Link to="/login" className="link-underline font-medium text-emerald">
            Masuk di sini
          </Link>
        </p>
      </AuthShell>
    </Page>
  )
}
