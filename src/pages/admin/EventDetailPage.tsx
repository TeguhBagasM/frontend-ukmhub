import { Archive, ArrowUpFromDot, CalendarClock, Download, Inbox, ListChecks, MapPin, Users } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '../../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { EventStatusBadge } from '../../components/ui/StatusBadge'
import { buttonStyles } from '../../components/ui/button-styles'
import { useEventStatus, useEvent } from '../../hooks/use-events'
import { useExportRegistrationsCsv } from '../../hooks/use-exports'
import { getErrorMessage } from '../../lib/errors'
import { formatDateTimeID, formatNumberID } from '../../lib/format'

export function EventDetailPage() {
  const { eventId, id: orgId } = useParams<{ id: string; eventId: string }>()
  const event = useEvent(eventId)
  const eventStatus = useEventStatus()
  const exportCsv = useExportRegistrationsCsv(orgId ?? '')

  const current = event.data

  function handleStatus(action: 'publish' | 'close' | 'archive') {
    if (!eventId) return
    eventStatus.mutate(
      { id: eventId, action },
      {
        onSuccess: () => toast.success('Status event diperbarui.'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <QueryState isLoading={event.isPending} isError={event.isError} error={event.error} isEmpty={!current}>
        {current ? (
          <>
            <PageHeader
              eyebrow="Detail event"
              title={current.name}
              description={current.description || 'Belum ada deskripsi event.'}
              action={<EventStatusBadge status={current.status} />}
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => handleStatus('publish')} disabled={current.status !== 'DRAFT'} loading={eventStatus.isPending}>
                <ArrowUpFromDot className="size-4" strokeWidth={1.6} aria-hidden="true" />
                Terbitkan
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleStatus('close')} disabled={current.status !== 'PUBLISHED'} loading={eventStatus.isPending}>
                <Archive className="size-4" strokeWidth={1.6} aria-hidden="true" />
                Tutup
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleStatus('archive')} disabled={current.status !== 'CLOSED'} loading={eventStatus.isPending}>
                Arsipkan
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => exportCsv.mutate(current.id)}
                loading={exportCsv.isPending}
                className="ml-auto"
              >
                <Download className="size-4" strokeWidth={1.6} aria-hidden="true" />
                Ekspor CSV
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    <MapPin className="size-4 text-emerald" strokeWidth={1.6} aria-hidden="true" />
                    Lokasi
                  </CardTitle>
                  <p className="text-sm text-ink-soft">{current.location || '—'}</p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    <CalendarClock className="size-4 text-emerald" strokeWidth={1.6} aria-hidden="true" />
                    Pelaksanaan
                  </CardTitle>
                  <p className="text-sm text-ink-soft">{formatDateTimeID(current.start_date)}</p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="inline-flex items-center gap-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    <Users className="size-4 text-emerald" strokeWidth={1.6} aria-hidden="true" />
                    Kuota terisi
                  </CardTitle>
                  <p className="text-sm text-ink-soft">
                    {formatNumberID(current.registration_count)}
                    {current.quota ? ` dari ${formatNumberID(current.quota)}` : ''}
                  </p>
                </CardHeader>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    Jendela pendaftaran
                  </CardTitle>
                  <p className="text-sm text-ink-soft">
                    {formatDateTimeID(current.registration_start)} → {formatDateTimeID(current.registration_end)}
                  </p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    Tautan publik
                  </CardTitle>
                  <p className="text-sm text-ink-soft break-all">/events/{current.slug}</p>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-hairline bg-surface p-5">
              <p className="text-sm text-ink-soft">Kelola pendaftaran dan formulir event ini:</p>
              <div className="flex flex-wrap gap-2">
                <a href={`/events/${current.slug}`} target="_blank" rel="noreferrer" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  Lihat halaman publik
                </a>
                <a href={`/organizations/${orgId}/events/${current.id}/registrations`} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  <Inbox className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  Pendaftaran
                </a>
                <a href={`/organizations/${orgId}/events/${current.id}/form-builder`} className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                  <ListChecks className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  Formulir
                </a>
              </div>
              <CardDescription className="w-full">
                Halaman publik hanya terbuka saat event berstatus Terbit dan form telah dipublikasikan.
              </CardDescription>
            </div>
          </>
        ) : null}
      </QueryState>
    </div>
  )
}