import { CalendarClock, LogOut, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { EditProfileForm } from '../components/dashboard/EditProfileForm'
import { ProfileCard } from '../components/dashboard/ProfileCard'
import { Page } from '../components/layout/Page'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { buttonStyles } from '../components/ui/button-styles'
import { EmptyState } from '../components/ui/EmptyState'
import { Reveal } from '../components/ui/Reveal'
import { Spinner } from '../components/ui/Spinner'
import { useLogout, useProfile } from '../hooks/use-auth'
import { formatTodayID, greeting } from '../lib/format'
import { useAuthStore } from '../stores/auth.store'

export function DashboardPage() {
  const storeUser = useAuthStore((state) => state.user)
  const profile = useProfile()
  const logout = useLogout()
  const navigate = useNavigate()

  const user = profile.data ?? storeUser

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => {
        toast.success('Kamu telah keluar dari akun.')
        navigate('/', { replace: true })
      },
    })
  }

  if (!user) {
    return (
      <Page>
        <Container className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted">
            <Spinner className="size-5 text-emerald" />
            <p className="text-sm">Memuat profil…</p>
          </div>
        </Container>
      </Page>
    )
  }

  const firstName = user.name.split(' ')[0]

  return (
    <Page>
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-8 border-b border-hairline pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-5 text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
              {greeting()}, {firstName}.
            </h1>
            <p className="mt-3 text-sm text-muted">{formatTodayID()}</p>
          </div>

          <Button
            variant="outline"
            onClick={handleLogout}
            loading={logout.isPending}
            className="self-start sm:self-auto"
          >
            {!logout.isPending ? <LogOut className="size-4" strokeWidth={1.8} /> : null}
            Keluar
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <ProfileCard user={user} />
          </Reveal>
          <Reveal delay={0.08}>
            <EditProfileForm user={user} />
          </Reveal>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Aktivitas</p>
              <h2 className="mt-4 text-xl font-medium tracking-[-0.02em] text-ink">
                Ruang kegiatanmu
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal>
              <EmptyState
                icon={Users}
                title="Belum ada UKM yang diikuti"
                description="Jelajahi unit kegiatan yang sesuai minatmu, lalu ikuti untuk melihat agendanya di sini."
                action={
                  <Link to="/#jelajahi" className={buttonStyles({ variant: 'dark', size: 'sm' })}>
                    Jelajahi UKM
                  </Link>
                }
              />
            </Reveal>
            <Reveal delay={0.06}>
              <EmptyState
                icon={CalendarClock}
                title="Belum ada agenda tersimpan"
                description="Kegiatan yang kamu simpan dari kalender kampus akan muncul di sini."
                action={
                  <Link to="/#kegiatan" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                    Lihat agenda
                  </Link>
                }
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </Page>
  )
}
