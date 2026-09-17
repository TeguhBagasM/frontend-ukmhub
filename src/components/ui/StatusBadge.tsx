import type { BadgeTone } from './Badge'
import { Badge } from './Badge'

export type { BadgeTone } from './Badge'

export function StatusBadge({ tone = 'neutral', label, ...props }: { tone?: BadgeTone; label: string } & Omit<React.ComponentProps<typeof Badge>, 'tone' | 'children'>) {
  return (
    <Badge tone={tone} {...props}>
      {label}
    </Badge>
  )
}

const eventStatusLabel: Record<string, { label: string; tone: BadgeTone }> = {
  DRAFT: { label: 'Draf', tone: 'neutral' },
  PUBLISHED: { label: 'Terbit', tone: 'emerald' },
  CLOSED: { label: 'Ditutup', tone: 'marigold' },
  ARCHIVED: { label: 'Arsip', tone: 'neutral' },
}

export function EventStatusBadge({ status }: { status: string }) {
  const current = eventStatusLabel[status] ?? { label: status, tone: 'neutral' as BadgeTone }
  return <StatusBadge tone={current.tone} label={current.label} />
}

const registrationStatusLabel: Record<string, { label: string; tone: BadgeTone }> = {
  PENDING: { label: 'Menunggu', tone: 'marigold' },
  ACCEPTED: { label: 'Diterima', tone: 'emerald' },
  REJECTED: { label: 'Ditolak', tone: 'clay' },
}

export function RegistrationStatusBadge({ status }: { status: string }) {
  const current = registrationStatusLabel[status] ?? { label: status, tone: 'neutral' as BadgeTone }
  return <StatusBadge tone={current.tone} label={current.label} />
}

const memberStatusLabel: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: 'Aktif', tone: 'emerald' },
  inactive: { label: 'Nonaktif', tone: 'neutral' },
}

export function MemberStatusBadge({ status }: { status: string }) {
  const current = memberStatusLabel[status] ?? { label: status, tone: 'neutral' as BadgeTone }
  return <StatusBadge tone={current.tone} label={current.label} />
}

const organizationStatusLabel: Record<string, { label: string; tone: BadgeTone }> = {
  active: { label: 'Aktif', tone: 'emerald' },
  inactive: { label: 'Nonaktif', tone: 'neutral' },
}

export function OrganizationStatusBadge({ status }: { status: string }) {
  const current = organizationStatusLabel[status] ?? { label: status, tone: 'neutral' as BadgeTone }
  return <StatusBadge tone={current.tone} label={current.label} />
}