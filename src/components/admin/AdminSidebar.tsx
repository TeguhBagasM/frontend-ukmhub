import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  Layers,
  LogOut,
  UserCircle,
  Users,
} from 'lucide-react'

import { cn } from '../../lib/cn'
import { useLogout } from '../../hooks/use-auth'
import type { Organization } from '../../lib/types'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { Select } from '../ui/Select'

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
  organizations?: Organization[]
  loading: boolean
}

function NavItem({
  to,
  icon: Icon,
  label,
  end,
  onNavigate,
}: {
  to: string
  icon: typeof Users
  label: string
  end?: boolean
  onNavigate: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200',
          isActive
            ? 'bg-moss text-emerald-ink'
            : 'text-ink-soft hover:bg-paper-deep hover:text-ink',
        )
      }
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
      {label}
    </NavLink>
  )
}

export function AdminSidebar({ open, onClose, organizations = [], loading }: AdminSidebarProps) {
  const user = useAuthStore((state) => state.user)
  const role = user?.role
  const activeOrgId = useOrgStore((state) => state.activeOrgId)
  const setActiveOrg = useOrgStore((state) => state.setActiveOrg)
  const logout = useLogout()
  const navigate = useNavigate()

  function handleLogout() {
    onClose()
    logout.mutate(undefined, {
      onSettled: () => {
        toast.success('Kamu telah keluar dari akun.')
        navigate('/', { replace: true })
      },
    })
  }

  const orgOptions = organizations.map((org) => ({ value: org.id, label: org.name }))

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-ink/40 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-hairline bg-paper transition-transform duration-300 ease-[var(--ease-editorial)] lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Menu admin"
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-5">
          <Link to="/" className="rounded-md" aria-label="Kembali ke beranda">
            <Logo />
          </Link>
          <span className="eyebrow hidden xl:block">Admin</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="px-2">
            <p className="eyebrow">Organisasi</p>
            <Select
              aria-label="Pilih organisasi"
              value={activeOrgId ?? ''}
              onChange={(event) => setActiveOrg(event.target.value || null)}
              options={orgOptions}
              placeholder={loading ? 'Memuat…' : 'Pilih organisasi'}
              disabled={loading}
              className="mt-3"
            />
          </div>

          <nav className="mt-6 flex flex-col gap-1">
            {role === 'SUPER_ADMIN' ? (
              <NavItem to="/organizations" end icon={Building2} label="Organisasi" onNavigate={onClose} />
            ) : null}

            <NavItem to="/dashboard" end icon={LayoutDashboard} label="Ringkasan" onNavigate={onClose} />

            {activeOrgId ? (
              <NavItem
                to={`/organizations/${activeOrgId}/divisions`}
                icon={Layers}
                label="Divisi"
                onNavigate={onClose}
              />
            ) : null}

            {activeOrgId ? (
              <NavItem
                to={`/organizations/${activeOrgId}/events`}
                icon={CalendarDays}
                label="Event"
                onNavigate={onClose}
              />
            ) : null}

            {activeOrgId ? (
              <NavItem to="/members" icon={Users} label="Anggota" onNavigate={onClose} />
            ) : null}
          </nav>
        </div>

        <div className="border-t border-hairline px-3 py-4">
          <NavItem to="/dashboard/profil" icon={UserCircle} label="Profil" onNavigate={onClose} />
          <Button
            variant="ghost"
            size="md"
            onClick={handleLogout}
            loading={logout.isPending}
            className="mt-1 w-full justify-start text-clay hover:text-clay"
          >
            <LogOut className="size-5" strokeWidth={1.6} aria-hidden="true" />
            Keluar
          </Button>
        </div>
      </aside>
    </>
  )
}