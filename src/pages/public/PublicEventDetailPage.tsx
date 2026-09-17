import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { DetailSkeleton } from '../../components/ui/Skeleton'
import { usePublicEvent } from '../../hooks/use-public'
import { formatDateTimeID, formatNumberID } from '../../lib/format'

export function PublicEventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const event = usePublicEvent(slug)
  const current = event.data
  const registrationOpen = current?.status === 'PUBLISHED' && (!current.registration_end || new Date(current.registration_end) > new Date())
  return <div className="flex flex-col gap-8"><QueryState isLoading={event.isPending} loading={<DetailSkeleton />} isError={event.isError} error={event.error} onRetry={event.refetch} isEmpty={!current}>{current ? <><PageHeader eyebrow="Event publik" title={current.name} description={current.description} /><div className="grid gap-4 sm:grid-cols-3"><Card><CalendarDays className="size-5 text-emerald" aria-hidden="true" /><p className="mt-4 text-xs text-muted">Mulai</p><p className="mt-1 text-sm text-ink">{formatDateTimeID(current.start_date)}</p></Card><Card><MapPin className="size-5 text-emerald" aria-hidden="true" /><p className="mt-4 text-xs text-muted">Lokasi</p><p className="mt-1 text-sm text-ink">{current.location || 'Belum ditentukan'}</p></Card><Card><p className="eyebrow">Kuota</p><p className="mt-3 font-display text-2xl text-ink">{formatNumberID(current.registration_count)} <span className="font-sans text-sm text-muted">/ {formatNumberID(current.quota)}</span></p></Card></div><div className="flex flex-wrap items-center gap-4">{registrationOpen && current.registration_count < current.quota ? <Link to={`/events/${current.slug}/register`}><Button>Daftar sekarang <ArrowRight className="size-4" aria-hidden="true" /></Button></Link> : <p className="text-sm text-clay">Pendaftaran sedang ditutup atau kuota sudah penuh.</p>}</div></> : null}</QueryState></div>
}
