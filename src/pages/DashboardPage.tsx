import { Link, Navigate } from 'react-router-dom'

import { MetricCard } from '../components/admin/dashboard/MetricCard'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { QueryState } from '../components/ui/QueryState'
import { RegistrationStatusBadge } from '../components/ui/StatusBadge'
import { TableSkeleton } from '../components/ui/Skeleton'
import { useOrganizationDashboard } from '../hooks/use-dashboard'
import { formatDateTimeID, formatNumberID } from '../lib/format'
import { useAuthStore } from '../stores/auth.store'
import { useOrgStore } from '../stores/org.store'

export function DashboardPage() {
  const role = useAuthStore((state) => state.user?.role)
  const organizationId = useOrgStore((state) => state.activeOrgId)
  const dashboard = useOrganizationDashboard(organizationId ?? undefined)
  if (!organizationId && role === 'SUPER_ADMIN') return <Navigate to="/organizations" replace />
  const data = dashboard.data
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Dashboard organisasi" title="Ringkasan aktivitas" description="Pantau anggota, event, dan pendaftaran terbaru." />
      <QueryState isLoading={dashboard.isPending} loading={<TableSkeleton rows={3} columns={3} />} isError={dashboard.isError} error={dashboard.error} onRetry={dashboard.refetch} isEmpty={!data}>
        {data ? <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard label="Total anggota" value={data.metrics.total_members} />
            <MetricCard label="Anggota aktif" value={data.metrics.active_members} />
            <MetricCard label="Event aktif" value={data.metrics.active_events} />
            <MetricCard label="Total event" value={data.metrics.total_events} />
            <MetricCard label="Total pendaftar" value={data.metrics.total_registrations} />
            <MetricCard label="Menunggu review" value={data.metrics.pending_applications} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><p className="eyebrow">Status pendaftaran</p><div className="mt-6 flex flex-col gap-4">{(['PENDING', 'ACCEPTED', 'REJECTED'] as const).map((status) => { const count = data.registration_status_distribution[status] ?? 0; const total = Math.max(data.metrics.total_registrations, 1); return <div key={status}><div className="flex items-center justify-between gap-4 text-sm"><RegistrationStatusBadge status={status} /><span className="font-mono text-xs text-muted">{formatNumberID(count)}</span></div><div className="mt-2 h-2 bg-paper-deep"><div className="h-full bg-emerald" style={{ width: `${Math.min(100, (count / total) * 100)}%` }} /></div></div> })}</div></Card>
            <Card><div className="flex items-end justify-between"><div><p className="eyebrow">Anggota per divisi</p><h2 className="mt-2 font-display text-xl font-medium text-ink">Distribusi</h2></div><Link to="/members" className="text-sm text-emerald underline underline-offset-4">Lihat semua</Link></div><div className="mt-6 flex flex-col gap-4">{data.members_by_division.length ? data.members_by_division.map((division) => <div key={division.division_id ?? division.division_name} className="flex items-center justify-between border-b border-hairline pb-3 text-sm"><span className="text-ink-soft">{division.division_name}</span><span className="font-mono text-xs text-muted">{formatNumberID(division.count)}</span></div>) : <p className="text-sm text-muted">Belum ada data divisi.</p>}</div></Card>
          </div>
          <Card><p className="eyebrow">Registrasi terbaru</p><div className="mt-5 flex flex-col">{data.recent_registrations.length ? data.recent_registrations.map((registration) => <Link key={registration.id} to={`/registrations/${registration.id}`} className="flex flex-col gap-2 border-b border-hairline py-4 first:pt-0 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"><span><span className="block font-medium text-ink">{registration.event_title}</span><span className="text-xs text-muted">{formatDateTimeID(registration.submitted_at)}</span></span><RegistrationStatusBadge status={registration.status} /></Link>) : <p className="text-sm text-muted">Belum ada registrasi.</p>}</div></Card>
        </> : null}
      </QueryState>
    </div>
  )
}
