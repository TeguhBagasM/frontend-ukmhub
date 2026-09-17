import { ExternalLink, Search } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Pagination } from '../../components/ui/Pagination'
import { QueryState } from '../../components/ui/QueryState'
import { RegistrationStatusBadge } from '../../components/ui/StatusBadge'
import { DataTable } from '../../components/ui/Table'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { Select } from '../../components/ui/Select'
import { useEvent } from '../../hooks/use-events'
import { useEventRegistrations } from '../../hooks/use-registrations'
import { formatDateTimeID } from '../../lib/format'
import type { Registration } from '../../lib/types'
import { buttonStyles } from '../../components/ui/button-styles'

export function EventRegistrationsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const event = useEvent(eventId)

  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [page, setPage] = useState(1)

  const registrations = useEventRegistrations(eventId, {
    status: status || undefined,
    search: appliedSearch || undefined,
    page,
    per_page: 20,
  })

  const data = registrations.data

  function applySearch(eventSubmit: React.FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault()
    setPage(1)
    setAppliedSearch(search.trim())
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Pendaftaran"
        title={`Pendaftaran ${event.data?.name ? '— ' + event.data.name : ''}`}
        description="Review calon anggota yang mengisi formulir event ini."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Select
            label="Status"
            value={status}
            onChange={(eventValue) => { setStatus(eventValue.target.value); setPage(1) }}
            options={[
              { value: '', label: 'Semua status' },
              { value: 'PENDING', label: 'Menunggu' },
              { value: 'ACCEPTED', label: 'Diterima' },
              { value: 'REJECTED', label: 'Ditolak' },
            ]}
          />
        </div>
        <form onSubmit={applySearch} className="flex flex-1 items-end gap-2">
          <div className="flex-1">
            <Input
              label="Cari pendaftar"
              placeholder="Nama, email, NIM…"
              value={search}
              onChange={(eventValue) => setSearch(eventValue.target.value)}
            />
          </div>
          <Button type="submit" size="md" aria-label="Cari">
            <Search className="size-4" strokeWidth={1.6} aria-hidden="true" />
          </Button>
        </form>
      </div>

      <QueryState
        isLoading={registrations.isPending}
        loading={<TableSkeleton rows={6} columns={4} />}
        isError={registrations.isError}
        error={registrations.error}
        onRetry={registrations.refetch}
        isEmpty={Boolean(data && data.items.length === 0)}
      >
        <DataTable<Registration>
          ariaLabel="Daftar pendaftaran"
          rowKey={(registration) => registration.id}
          columns={[
            {
              header: 'ID',
              render: (registration) => (
                <span className="font-mono text-xs text-muted">#{registration.id.slice(0, 8)}</span>
              ),
            },
            {
              header: 'Dikirim',
              render: (registration) => (
                <span className="text-muted">{formatDateTimeID(registration.submitted_at)}</span>
              ),
            },
            {
              header: 'Status',
              render: (registration) => <RegistrationStatusBadge status={registration.status} />,
            },
            {
              header: 'Aksi',
              className: 'text-right',
              render: (registration) => (
                <a
                  href={`/registrations/${registration.id}`}
                  className={buttonStyles({ variant: 'outline', size: 'sm' })}
                >
                  <ExternalLink className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  Lihat
                </a>
              ),
            },
          ]}
          rows={data?.items ?? []}
        />

        {data && data.total_pages > 1 ? (
          <div className="mt-6 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-muted">
              Menampilkan {data.items.length} dari {data.total} pendaftaran
            </p>
            <Pagination page={data.page} totalPages={data.total_pages} onPageChange={setPage} />
          </div>
        ) : null}
      </QueryState>
    </div>
  )
}