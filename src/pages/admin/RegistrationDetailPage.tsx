import { CheckCircle2, UserPlus, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { ConvertToMemberDialog } from '../../components/admin/registrations/ConvertToMemberDialog'
import { RejectDialog } from '../../components/admin/registrations/RejectDialog'
import { Button } from '../../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { RegistrationStatusBadge } from '../../components/ui/StatusBadge'
import { DataTable } from '../../components/ui/Table'
import { DetailSkeleton } from '../../components/ui/Skeleton'
import { buttonStyles } from '../../components/ui/button-styles'
import { useEvent } from '../../hooks/use-events'
import { useAcceptRegistration, useRejectRegistration, useRegistration } from '../../hooks/use-registrations'
import { getErrorMessage } from '../../lib/errors'
import { formatDateTimeID } from '../../lib/format'
import type { RegistrationAnswer } from '../../lib/types'

export function RegistrationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const registration = useRegistration(id)
  const current = registration.data

  const event = useEvent(current?.event_id)
  const accept = useAcceptRegistration()
  const reject = useRejectRegistration()

  const [rejectOpen, setRejectOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)

  function handleAccept() {
    if (!current) return
    accept.mutate(current.id, {
      onSuccess: () => toast.success('Pendaftar diterima.'),
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  function handleReject(reason: string) {
    if (!current) return
    reject.mutate(
      { id: current.id, reason },
      {
        onSuccess: () => {
          toast.success('Pendaftaran ditolak. Alasan sudah tersimpan.')
          setRejectOpen(false)
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <QueryState
        isLoading={registration.isPending}
        loading={<DetailSkeleton />}
        isError={registration.isError}
        error={registration.error}
        onRetry={registration.refetch}
        isEmpty={!current}
      >
        {current ? (
          <>
            <PageHeader
              eyebrow="Detail pendaftaran"
              title={`Pendaftaran #${current.id.slice(0, 8)}`}
              action={<RegistrationStatusBadge status={current.status} />}
            />

            <div className="flex flex-wrap items-center gap-3">
              {current.status === 'PENDING' ? (
                <>
                  <Button size="sm" onClick={handleAccept} loading={accept.isPending}>
                    <CheckCircle2 className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    Terima
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRejectOpen(true)} className="text-clay hover:border-clay hover:text-clay">
                    <XCircle className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    Tolak
                  </Button>
                </>
              ) : null}
              {current.status === 'ACCEPTED' ? (
                <Button size="sm" variant="dark" onClick={() => setConvertOpen(true)}>
                  <UserPlus className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  Jadikan anggota
                </Button>
              ) : null}
              {event.data ? (
                <Link
                  to={`/organizations/${event.data.organization_id}/events/${event.data.id}`}
                  className={buttonStyles({ variant: 'ghost', size: 'sm' })}
                >
                  Buka event
                </Link>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    Event
                  </CardTitle>
                  <p className="text-sm font-medium text-ink">{event.data?.name ?? current.event_id}</p>
                </CardHeader>
              </Card>
              <Card className="p-5">
                <CardHeader className="gap-1.5">
                  <CardTitle className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted">
                    Dikirim pada
                  </CardTitle>
                  <p className="text-sm text-ink-soft">{formatDateTimeID(current.submitted_at)}</p>
                </CardHeader>
              </Card>
            </div>

            {current.status === 'REJECTED' && current.rejection_reason ? (
              <div className="rounded-lg border border-clay/30 bg-clay/5 px-4 py-3">
                <p className="eyebrow text-clay">Alasan penolakan</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{current.rejection_reason}</p>
              </div>
            ) : null}

            <div>
              <div className="mb-4">
                <p className="eyebrow">Jawaban</p>
                <h2 className="mt-2 font-display text-lg font-medium text-ink">Data yang dikirim pendaftar</h2>
                <CardDescription className="mt-1">
                  Jawaban diambil dari formulir event; tampilan menyesuaikan isi jawaban.
                </CardDescription>
              </div>
              <DataTable<RegistrationAnswer>
                ariaLabel="Jawaban pendaftar"
                rowKey={(answer) => answer.field_id}
                columns={[
                  {
                    header: 'Pertanyaan',
                    render: (answer) => (
                      <div>
                        <p className="font-medium text-ink">{answer.label}</p>
                        <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                          {answer.type}
                        </p>
                      </div>
                    ),
                  },
                  {
                    header: 'Jawaban',
                    render: (answer) => <span className="whitespace-pre-wrap text-ink-soft">{answer.value || '—'}</span>,
                  },
                ]}
                rows={current.answers ?? []}
              />
            </div>
          </>
        ) : null}
      </QueryState>

      <RejectDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        loading={reject.isPending}
        onSubmit={handleReject}
      />

      {current && event.data ? (
        <ConvertToMemberDialog
          open={convertOpen}
          onClose={() => setConvertOpen(false)}
          registrationId={current.id}
          organizationId={event.data.organization_id}
          answers={current.answers ?? []}
        />
      ) : null}
    </div>
  )
}