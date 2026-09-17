import { Layers, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { DivisionFormModal } from '../../components/admin/divisions/DivisionFormModal'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { OrganizationStatusBadge } from '../../components/ui/StatusBadge'
import { DataTable } from '../../components/ui/Table'
import { useDeleteDivision, useDivisions } from '../../hooks/use-divisions'
import { useOrganization } from '../../hooks/use-organizations'
import { getErrorMessage } from '../../lib/errors'
import type { Division } from '../../lib/types'

export function DivisionsPage() {
  const { id } = useParams<{ id: string }>()
  const divisions = useDivisions(id)
  const organization = useOrganization(id)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Division | null>(null)
  const [deleting, setDeleting] = useState<Division | null>(null)

  const deleteDivision = useDeleteDivision()

  function handleDelete() {
    if (!deleting || !id) return
    deleteDivision.mutate(
      { id: deleting.id, organizationId: id },
      {
        onSuccess: () => {
          toast.success('Divisi berhasil dihapus.')
          setDeleting(null)
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Divisi"
        title={`Divisi ${organization.data?.name ? '— ' + organization.data.name : ''}`}
        description="Kelompok kerja di dalam organisasi. Anggota bisa ditautkan ke divisi."
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus className="size-4" strokeWidth={1.6} aria-hidden="true" />
            Buat divisi
          </Button>
        }
      />

      <QueryState
        isLoading={divisions.isPending}
        isError={divisions.isError}
        error={divisions.error}
        onRetry={divisions.refetch}
        isEmpty={Boolean(divisions.data && divisions.data.length === 0)}
        empty={
          <EmptyState
            icon={Layers}
            title="Belum ada divisi"
            description="Buat divisi pertama agar anggota bisa dikelompokkan."
          />
        }
      >
        <DataTable<Division>
          ariaLabel="Daftar divisi"
          rowKey={(division) => division.id}
          columns={[
            {
              header: 'Nama',
              render: (division) => <span className="font-medium text-ink">{division.name}</span>,
            },
            {
              header: 'Deskripsi',
              render: (division) => (
                <span className="line-clamp-1 text-muted">{division.description || '—'}</span>
              ),
            },
            {
              header: 'Status',
              render: (division) => <OrganizationStatusBadge status={division.status} />,
            },
            {
              header: 'Aksi',
              className: 'text-right',
              render: (division) => (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditing(division); setFormOpen(true) }}
                    aria-label={`Edit ${division.name}`}
                  >
                    <Pencil className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleting(division)}
                    aria-label={`Hapus ${division.name}`}
                    className="text-clay hover:border-clay hover:text-clay"
                  >
                    <Trash2 className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  </Button>
                </div>
              ),
            },
          ]}
          rows={divisions.data ?? []}
        />
      </QueryState>

      <DivisionFormModal open={formOpen} onClose={() => setFormOpen(false)} organizationId={id ?? ''} division={editing} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Hapus divisi?"
        description={`Divisi "${deleting?.name ?? ''}" akan dihapus. Anggota yang terhubung ke divisi ini menjadi tidak berdivisi.`}
        confirmLabel="Hapus"
        loading={deleteDivision.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}