import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthShell } from '../components/auth/AuthShell'
import { Page } from '../components/layout/Page'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useLogin } from '../hooks/use-auth'
import { getErrorMessage } from '../lib/errors'

interface FieldErrors {
  email?: string
  password?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const next: FieldErrors = {}
    if (!email.trim()) next.email = 'Email wajib diisi.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Format email belum benar.'
    if (!password) next.password = 'Kata sandi wajib diisi.'

    setErrors(next)
    if (Object.keys(next).length > 0) return

    login.mutate(
      { email: email.trim(), password },
      { onSuccess: () => navigate(from, { replace: true }) },
    )
  }

  return (
    <Page>
      <AuthShell eyebrow="Masuk">
        <h1 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-ink">
          Selamat datang kembali.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Masuk untuk melanjutkan ke dashboard dan agenda kampusmu.
        </p>

        {login.isError ? (
          <div className="mt-6 flex items-start gap-3 rounded-md border border-clay/30 bg-clay/5 px-3.5 py-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-clay" strokeWidth={1.8} />
            <p className="text-xs leading-relaxed text-clay">{getErrorMessage(login.error)}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            error={errors.password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button type="submit" size="lg" loading={login.isPending} className="mt-1 w-full">
            {login.isPending ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>

        <p className="mt-8 text-sm text-muted">
          Belum punya akun?{' '}
          <Link to="/register" className="link-underline font-medium text-emerald">
            Daftar sekarang
          </Link>
        </p>
      </AuthShell>
    </Page>
  )
}
