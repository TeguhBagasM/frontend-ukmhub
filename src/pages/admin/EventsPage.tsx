import {
  ArrowUpFromDot,
  Archive,
  CalendarDays,
  Inbox,
  InboxIcon,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { EventFormModal } from '../../components/admin/events/EventFormModal'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { EventStatusBadge } from '../../components/ui/StatusBadge'
import { DataTable } from '../../components/ui/Table'
import { buttonStyles } from '../../components/ui/button-styles'
import { useDeleteEvent, useEventStatus, useOrganizationEvents } from '../../hooks/use-events'
import { useOrganization } from '../../hooks/use-organizations'
import { getErrorMessage } from '../../lib/errors'
import { formatDateTimeID, formatNumberID } from '../../lib/format'
import type { Event } from '../../lib/types'

const actionsByStatus: Record<Event['status'], { action: 'publish' | 'close' | 'archive'; label: string } | null> = {
  DRAFT: { action: 'publish', label: 'Terbitkan' },
  PUBLISHED: { action: 'close', label: 'Tutup' },
  CLOSED: { action: 'archive', label: 'Arsipkan' },
  ARCHIVED: null,
}

export function EventsPage() {
  const { id } = useParams<{ id: string }>()
  const organization = useOrganization(id)
  const events = useOrganizationEvents(id)
  const eventStatus = useEventStatus()
  const deleteEvent = useDeleteEvent()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState<Event | null>(null)

  const orgId = id ?? ''

  function handleStatusChange(event: Event, action: 'publish' | 'close' | 'archive') {
    eventStatus.mutate(
      { id: event.id, action },
      {
        onSuccess: () => toast.success('Status event diperbarui.'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  function handleDelete() {
    if (!deleting) return
    deleteEvent.mutate(
      { id: deleting.id, organizationId: orgId },
      {
        onSuccess: () => {
          toast.success('Event berhasil dihapus.')
          setDeleting(null)
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Event"
        title={`Event ${organization.data?.name ? '— ' + organization.data.name : ''}`}
        description="Kegiatan dengan form pendaftaran yang bisa diatur sendiri."
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus className="size-4" strokeWidth={1.6} aria-hidden="true" />
            Buat event
          </Button>
        }
      />

      <QueryState
        isLoading={events.isPending}
        isError={events.isError}
        error={events.error}
        onRetry={events.refetch}
        isEmpty={Boolean(events.data && events.data.length === 0)}
        empty={
          <EmptyState
            icon={CalendarDays}
            title="Belum ada event"
            description="Buat event pertama untuk mulai menerima pendaftaran."
          />
        }
      >
        <DataTable<Event>
          ariaLabel="Daftar event"
          rowKey={(event) => event.id}
          columns={[
            {
              header: 'Nama',
              render: (event) => (
                <Link
                  to={`/organizations/${event.organization_id}/events/${event.id}`}
                  className="font-medium text-ink underline-offset-4 hover:text-emerald hover:underline"
                >
                  {event.name}
                </Link>
              ),
            },
            {
              header: 'Pelaksanaan',
              render: (event) => (
                <span className="text-muted">{formatDateTimeID(event.start_date)}</span>
              ),
            },
            {
              header: 'Kuota',
              render: (event) => (
                <span className="font-mono text-xs text-ink-soft">
                  {formatNumberID(event.registration_count)}/{event.quota ? formatNumberID(event.quota) : '∞'}
                </span>
              ),
            },
            {
              header: 'Status',
              render: (event) => <EventStatusBadge status={event.status} />,
            },
            {
              header: 'Aksi',
              className: 'text-right',
              render: (event) => {
                const statusAction = actionsByStatus[event.status]
                return (
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/organizations/${event.organization_id}/events/${event.id}/registrations`}
                      className={buttonStyles({ variant: 'ghost', size: 'sm' })}
                      aria-label={`Pendaftaran ${event.name}`}
                    >
                      <Inbox className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/organizations/${event.organization_id}/events/${event.id}/form-builder`}
                      className={buttonStyles({ variant: 'ghost', size: 'sm' })}
                      aria-label={`Formulir ${event.name}`}
                    >
                      <ListChecks className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    </Link>
                    {statusAction ? (
                      <Button
                        size="sm"
                        variant={statusAction.action === 'publish' ? 'outline' : 'ghost'}
                        onClick={() => handleStatusChange(event, statusAction.action)}
                        loading={eventStatus.isPending}
                      >
                        {statusAction.action === 'publish' ? (
                          <ArrowUpFromDot className="size-4" strokeWidth={1.6} aria-hidden="true" />
                        ) : statusAction.action === 'close' ? (
                          <InboxIcon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                        ) : (
                          <Archive className="size-4" strokeWidth={1.6} aria-hidden="true" />
                        )}
                        {statusAction.label}
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditing(event); setFormOpen(true) }}
                      aria-label={`Edit ${event.name}`}
                    >
                      <Pencil className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleting(event)}
                      aria-label={`Hapus ${event.name}`}
                      className="text-clay hover:text-clay"
                    >
                      <Trash2 className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    </Button>
                  </div>
                )
              },
            },
          ]}
          rows={events.data ?? []}
        />
      </QueryState>

      <EventFormModal open={formOpen} onClose={() => setFormOpen(false)} organizationId={orgId} event={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Hapus event?"
        description={`Event "${deleting?.name ?? ''}" dan semua pendaftarannya akan dihapus permanen.`}
        confirmLabel="Hapus"
        loading={deleteEvent.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}