import { Building2, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useDeleteOrganization, useOrganizations } from '../../hooks/use-organizations'
import { getErrorMessage } from '../../lib/errors'
import { useAuthStore } from '../../stores/auth.store'
import { useOrgStore } from '../../stores/org.store'
import { Button } from '../../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { OrganizationStatusBadge } from '../../components/ui/StatusBadge'
import type { Organization } from '../../lib/types'
import { OrganizationFormModal } from '../../components/admin/organizations/OrganizationFormModal'

export function OrganizationsPage() {
  const organizations = useOrganizations()
  const deleteOrg = useDeleteOrganization()
  const navigate = useNavigate()
  const role = useAuthStore((state) => state.user?.role)
  const setActiveOrg = useOrgStore((state) => state.setActiveOrg)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Organization | null>(null)
  const [deleting, setDeleting] = useState<Organization | null>(null)

  const isSuperAdmin = role === 'SUPER_ADMIN'

  function handleOpenOrg(org: Organization) {
    setActiveOrg(org.id)
    navigate(`/organizations/${org.id}`)
  }

  function handleDelete() {
    if (!deleting) return
    deleteOrg.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Organisasi berhasil dihapus.')
        setDeleting(null)
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Admin — Organisasi"
        title="Organisasi"
        description="Semua unit kegiatan yang terdaftar di platform."
        action={
          isSuperAdmin ? (
            <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
              <Plus className="size-4" strokeWidth={1.6} aria-hidden="true" />
              Buat organisasi
            </Button>
          ) : undefined
        }
      />

      <QueryState
        isLoading={organizations.isPending}
        isError={organizations.isError}
        error={organizations.error}
        onRetry={organizations.refetch}
        isEmpty={Boolean(organizations.data && organizations.data.length === 0)}
        empty={
          <EmptyState
            icon={Building2}
            title="Belum ada organisasi"
            description={isSuperAdmin ? 'Buat organisasi pertama untuk mulai mengelola UKM.' : 'Kamu belum terhubung ke organisasi mana pun.'}
          />
        }
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {organizations.data?.map((org) => (
            <Card key={org.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle>{org.name}</CardTitle>
                  <OrganizationStatusBadge status={org.status} />
                </div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                  /{org.slug}
                </p>
                <CardDescription className="mt-2 line-clamp-2">
                  {org.description || 'Belum ada deskripsi.'}
                </CardDescription>
              </CardHeader>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
                <Button
                  size="sm"
                  onClick={() => handleOpenOrg(org)}
                  className="flex-1"
                >
                  <ExternalLink className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  Kelola
                </Button>
                {isSuperAdmin ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditing(org); setFormOpen(true) }}
                      aria-label={`Edit ${org.name}`}
                    >
                      <Pencil className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleting(org)}
                      aria-label={`Hapus ${org.name}`}
                      className="text-clay hover:border-clay hover:text-clay"
                    >
                      <Trash2 className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    </Button>
                  </>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </QueryState>

      <OrganizationFormModal open={formOpen} onClose={() => setFormOpen(false)} organization={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Hapus organisasi?"
        description={`Organisasi "${deleting?.name ?? ''}" beserta divisi dan eventnya akan dihapus permanen.`}
        confirmLabel="Hapus"
        loading={deleteOrg.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}