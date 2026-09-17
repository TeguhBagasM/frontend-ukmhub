import { Link, useLocation } from 'react-router-dom'

import type { Organization } from '../../lib/types'
import { cn } from '../../lib/cn'

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  profil: 'Profil',
  organizations: 'Organisasi',
  divisions: 'Divisi',
  events: 'Event',
  'form-builder': 'Formulir',
  registrations: 'Pendaftaran',
  members: 'Anggota',
}

interface BreadcrumbProps {
  organizations?: Organization[]
}

export function Breadcrumb({ organizations = [] }: BreadcrumbProps) {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  function labelFor(segment: string): string {
    if (LABELS[segment]) return LABELS[segment]
    const org = organizations.find((candidate) => candidate.id === segment)
    if (org) return org.name
    if (/^[0-9a-f-]{8,}$/i.test(segment)) return `#${segment.slice(0, 8)}`
    return segment
  }

  let cumulative = ''
  const crumbs = segments.map((segment) => {
    cumulative += `/${segment}`
    return { label: labelFor(segment), to: cumulative }
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
        <li>
          <Link to="/dashboard" className="text-muted transition-colors hover:text-emerald">
            Admin
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <li key={crumb.to} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-muted-soft">/</span>
              {isLast ? (
                <span aria-current="page" className="text-ink">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className={cn('text-muted transition-colors hover:text-emerald')}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}