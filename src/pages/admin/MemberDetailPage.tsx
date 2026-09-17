import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { MemberFormModal } from '../../components/admin/members/MemberFormModal'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { MemberStatusBadge } from '../../components/ui/StatusBadge'
import { DetailSkeleton } from '../../components/ui/Skeleton'
import { useDeleteMember, useMember } from '../../hooks/use-members'
import { getErrorMessage } from '../../lib/errors'
import { formatDateTimeID } from '../../lib/format'

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const member = useMember(id)
  const remove = useDeleteMember()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const current = member.data

  function deleteMember() {
    if (!current) return
    remove.mutate({ id: current.id, organizationId: current.organization_id }, { onSuccess: () => { toast.success('Anggota dihapus.'); navigate('/members') }, onError: (error) => toast.error(getErrorMessage(error)) })
  }

  return <div className="flex flex-col gap-8"><QueryState isLoading={member.isPending} loading={<DetailSkeleton />} isError={member.isError} error={member.error} onRetry={member.refetch} isEmpty={!current}>{current ? <><PageHeader eyebrow="Detail anggota" title={current.name} description={current.email || 'Email belum diisi'} action={<MemberStatusBadge status={current.status} />} /><div className="flex flex-wrap gap-3"><Button size="sm" onClick={() => setEditOpen(true)}><Pencil className="size-4" aria-hidden="true" />Edit</Button><Button size="sm" variant="outline" className="text-clay hover:border-clay hover:text-clay" onClick={() => setDeleteOpen(true)}><Trash2 className="size-4" aria-hidden="true" />Hapus</Button><Link className="text-sm text-emerald underline underline-offset-4" to="/members">Kembali ke anggota</Link></div><div className="grid gap-4 sm:grid-cols-2"><Card><p className="eyebrow">NIM / No. induk</p><p className="mt-3 text-sm text-ink">{current.student_id || '—'}</p></Card><Card><p className="eyebrow">Telepon</p><p className="mt-3 text-sm text-ink">{current.phone || '—'}</p></Card><Card><p className="eyebrow">Divisi</p><p className="mt-3 text-sm text-ink">{current.division_id || 'Belum ditentukan'}</p></Card><Card><p className="eyebrow">Bergabung</p><p className="mt-3 text-sm text-ink">{formatDateTimeID(current.joined_at)}</p></Card></div></> : null}</QueryState>{current ? <MemberFormModal open={editOpen} onClose={() => setEditOpen(false)} member={current} /> : null}<ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Hapus anggota?" description="Data anggota ini akan dihapus dari organisasi." confirmLabel="Hapus" destructive loading={remove.isPending} onConfirm={deleteMember} /></div>
}
