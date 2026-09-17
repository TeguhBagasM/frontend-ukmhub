import { CalendarDays, Layers, Pencil, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { MetricCard } from '../../components/admin/dashboard/MetricCard'
import { OrganizationFormModal } from '../../components/admin/organizations/OrganizationFormModal'
import { Button } from '../../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { OrganizationStatusBadge } from '../../components/ui/StatusBadge'
import { buttonStyles } from '../../components/ui/button-styles'
import { useOrganizationDashboard } from '../../hooks/use-dashboard'
import { useOrganization, useUpdateOrganization } from '../../hooks/use-organizations'
import { getErrorMessage } from '../../lib/errors'
import { formatDateID } from '../../lib/format'
import { useAuthStore } from '../../stores/auth.store'

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const organization = useOrganization(id)
  const dashboard = useOrganizationDashboard(id)
  const updateOrg = useUpdateOrganization()
  const role = useAuthStore((state) => state.user?.role)
  const isSuperAdmin = role === 'SUPER_ADMIN'

  const [editOpen, setEditOpen] = useState(false)

  const org = organization.data
  const metrics = dashboard.data?.metrics

  function handleStatusToggle() {
    if (!org) return
    const payload = { status: org.status === 'active' ? ('inactive' as const) : ('active' as const) }
    updateOrg.mutate(
      { id: org.id, payload },
      {
        onSuccess: () => toast.success('Status organisasi diperbarui.'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <QueryState
        isLoading={organization.isPending}
        isError={organization.isError}
        error={organization.error}
        isEmpty={!org}
      >
        {org ? (
          <>
            <PageHeader
              eyebrow="Organisasi"
              title={org.name}
              description={org.description || 'Belum ada deskripsi organisasi.'}
              action={
                <div className="flex flex-wrap gap-2">
                  <OrganizationStatusBadge status={org.status} />
                  {isSuperAdmin ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditOpen(true)}
                      >
                        <Pencil className="size-4" strokeWidth={1.6} aria-hidden="true" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleStatusToggle} loading={updateOrg.isPending}>
                        {org.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                    </>
                  ) : null}
                </div>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="eyebrow !font-mono !text-[0.6875rem] uppercase">Slug</CardTitle>
                  <p className="font-mono text-sm text-ink-soft">/{org.slug}</p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="eyebrow !font-mono !text-[0.6875rem] uppercase">Email</CardTitle>
                  <p className="text-sm text-ink-soft">{org.email || '—'}</p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="eyebrow !font-mono !text-[0.6875rem] uppercase">Telepon</CardTitle>
                  <p className="text-sm text-ink-soft">{org.phone || '—'}</p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="eyebrow !font-mono !text-[0.6875rem] uppercase">Terdaftar</CardTitle>
                  <p className="text-sm text-ink-soft">{formatDateID(org.created_at)}</p>
                </CardHeader>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-lg font-medium">Kelola modul</CardTitle>
                  <CardDescription>Buka bagian yang ingin kamu atur dari organisasi ini.</CardDescription>
                </CardHeader>
                <div className="mt-4 flex flex-wrap gap-3 border-t border-hairline pt-4">
                  <Link to={`/organizations/${org.id}/divisions`} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                    <Layers className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    Divisi
                  </Link>
                  <Link to={`/organizations/${org.id}/events`} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                    <CalendarDays className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    Event
                  </Link>
                  <Link to="/members" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                    <Users className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    Anggota
                  </Link>
                </div>
              </Card>
            </div>

            <div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="eyebrow">Ringkasan</p>
                  <h2 className="mt-3 font-display text-xl font-medium tracking-[-0.02em] text-ink">
                    Metrik bulan ini
                  </h2>
                </div>
                <Link
                  to="/dashboard"
                  className={buttonStyles({ variant: 'ghost', size: 'sm' })}
                >
                  Buka dashboard lengkap
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                <MetricCard label="Anggota" value={metrics?.total_members ?? 0} />
                <MetricCard label="Anggota aktif" value={metrics?.active_members ?? 0} accent />
                <MetricCard label="Event aktif" value={metrics?.active_events ?? 0} />
                <MetricCard label="Total event" value={metrics?.total_events ?? 0} />
                <MetricCard label="Total pendaftar" value={metrics?.total_registrations ?? 0} />
                <MetricCard label="Menunggu review" value={metrics?.pending_applications ?? 0} />
              </div>
            </div>
          </>
        ) : null}
      </QueryState>

      <OrganizationFormModal open={editOpen} onClose={() => setEditOpen(false)} organization={org} />
    </div>
  )
}