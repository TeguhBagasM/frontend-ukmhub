import { Download, ExternalLink, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Pagination } from '../../components/ui/Pagination'
import { QueryState } from '../../components/ui/QueryState'
import { Select } from '../../components/ui/Select'
import { DataTable } from '../../components/ui/Table'
import { TableSkeleton } from '../../components/ui/Skeleton'
import { MemberStatusBadge } from '../../components/ui/StatusBadge'
import { useDivisions } from '../../hooks/use-divisions'
import { useOrganizationMembers } from '../../hooks/use-members'
import { useOrgStore } from '../../stores/org.store'
import { useExportMembersCsv } from '../../hooks/use-exports'
import { formatDateTimeID } from '../../lib/format'
import type { Member } from '../../lib/types'

export function MembersPage() {
  const organizationId = useOrgStore((state) => state.activeOrgId)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [divisionId, setDivisionId] = useState('')
  const [page, setPage] = useState(1)
  const members = useOrganizationMembers(organizationId ?? undefined, { search: appliedSearch || undefined, division_id: divisionId || undefined, page, per_page: 20 })
  const divisions = useDivisions(organizationId ?? undefined)
  const exportMembers = useExportMembersCsv(organizationId ?? '')

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPage(1); setAppliedSearch(search.trim())
  }

  function exportCsv() {
    if (organizationId) exportMembers.mutate()
  }

  const data = members.data
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Anggota" title="Kelola anggota" description="Cari, perbarui, dan ekspor anggota organisasi." action={<Button variant="outline" onClick={exportCsv} loading={exportMembers.isPending}><Download className="size-4" aria-hidden="true" />Ekspor CSV</Button>} />
      {!organizationId ? <QueryState isLoading={false} isError={false} error={null} isEmpty><p /></QueryState> : null}
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_15rem]">
        <form onSubmit={submitSearch} className="flex items-end gap-2"><div className="min-w-0 flex-1"><Input label="Cari anggota" placeholder="Nama, email, NIM…" value={search} onChange={(event) => setSearch(event.target.value)} /></div><Button type="submit" aria-label="Cari"><Search className="size-4" aria-hidden="true" /></Button></form>
        <Select label="Divisi" value={divisionId} onChange={(event) => { setDivisionId(event.target.value); setPage(1) }} options={[{ value: '', label: 'Semua divisi' }, ...(divisions.data ?? []).map((item) => ({ value: item.id, label: item.name }))]} />
      </div>
      <QueryState isLoading={members.isPending} loading={<TableSkeleton rows={6} columns={5} />} isError={members.isError} error={members.error} onRetry={members.refetch} isEmpty={Boolean(data && data.items.length === 0)}>
        <DataTable<Member> ariaLabel="Daftar anggota" rowKey={(member) => member.id} rows={data?.items ?? []} columns={[{ header: 'Nama', render: (member) => <div><p className="font-medium text-ink">{member.name}</p><p className="text-xs text-muted">{member.email || 'Email belum diisi'}</p></div> }, { header: 'Status', render: (member) => <MemberStatusBadge status={member.status} /> }, { header: 'Bergabung', render: (member) => formatDateTimeID(member.joined_at) }, { header: 'Aksi', className: 'text-right', render: (member) => <Link to={`/members/${member.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-emerald hover:underline"><ExternalLink className="size-4" aria-hidden="true" />Lihat</Link> }]} />
        {data && data.total_pages > 1 ? <div className="mt-6 flex items-center justify-between"><p className="text-xs text-muted">{data.total} anggota</p><Pagination page={data.page} totalPages={data.total_pages} onPageChange={setPage} /></div> : null}
      </QueryState>
    </div>
  )
}
