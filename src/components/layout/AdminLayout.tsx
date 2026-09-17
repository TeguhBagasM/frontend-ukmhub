import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useOrganizations } from '../../hooks/use-organizations'
import { cn } from '../../lib/cn'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'
import { Container } from '../ui/Container'
import { Page } from './Page'
import { AdminSidebar } from '../admin/AdminSidebar'
import { Breadcrumb } from '../admin/Breadcrumb'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const role = useAuthStore((state) => state.user?.role)
  const organizations = useOrganizations()
  const activeOrgId = useOrgStore((state) => state.activeOrgId)
  const setActiveOrg = useOrgStore((state) => state.setActiveOrg)
  const navigate = useNavigate()

  const orgs = organizations.data

  useEffect(() => {
    if (!orgs) return
    const valid = orgs.some((org) => org.id === activeOrgId)

    if (role === 'ORG_ADMIN') {
      if (!valid) {
        setActiveOrg(orgs[0]?.id ?? null)
        if (orgs.length === 1) navigate('/dashboard', { replace: true })
      }
    } else if (role === 'SUPER_ADMIN' && !valid && activeOrgId) {
      setActiveOrg(null)
    }
  }, [orgs, role, activeOrgId, setActiveOrg, navigate])

  return (
    <div className="flex min-h-dvh bg-paper lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        organizations={orgs}
        loading={organizations.isPending}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-hairline bg-paper/85 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu admin"
            className="grid size-12 place-items-center text-ink-soft"
          >
            <Menu className="size-5" strokeWidth={1.6} aria-hidden="true" />
          </button>
          <span className="px-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
            Admin
          </span>
        </header>

        <Page>
          <Container
            size="wide"
            className={cn('py-10 sm:py-12', 'max-w-6xl')}
          >
            <Breadcrumb organizations={orgs} />
            <Outlet />
          </Container>
        </Page>
      </div>
    </div>
  )
}