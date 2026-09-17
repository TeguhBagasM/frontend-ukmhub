import { CalendarDays, Mail, ShieldCheck } from 'lucide-react'

import { formatDateID, initials } from '../../lib/format'
import type { User } from '../../lib/types'
import { Badge } from '../ui/Badge'

export function ProfileCard({ user }: { user: User }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface">
      <div className="flex items-center gap-4 border-b border-hairline p-6">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-emerald-ink font-display text-lg text-surface">
          {initials(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg tracking-[-0.02em] text-ink">{user.name}</p>
          <p className="mt-0.5 truncate text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <dl className="divide-y divide-hairline">
        <div className="flex items-center gap-3 px-6 py-4">
          <Mail className="size-4 shrink-0 text-muted" strokeWidth={1.7} />
          <dt className="sr-only">Email</dt>
          <dd className="truncate text-sm text-ink-soft">{user.email}</dd>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <ShieldCheck className="size-4 shrink-0 text-muted" strokeWidth={1.7} />
          <dt className="sr-only">Peran</dt>
          <dd>
            <Badge tone={user.role === 'admin' ? 'marigold' : 'emerald'}>
              {user.role === 'admin' ? 'Administrator' : 'Mahasiswa'}
            </Badge>
          </dd>
        </div>
        <div className="flex items-center gap-3 px-6 py-4">
          <CalendarDays className="size-4 shrink-0 text-muted" strokeWidth={1.7} />
          <dt className="text-xs text-muted">Bergabung</dt>
          <dd className="ml-auto text-sm text-ink-soft">{formatDateID(user.created_at)}</dd>
        </div>
      </dl>
    </div>
  )
}
