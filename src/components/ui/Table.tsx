import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

export interface DataTableColumn<T> {
  header: string
  render: (row: T) => ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  empty?: ReactNode
  ariaLabel?: string
}

export function DataTable<T>({ columns, rows, rowKey, empty, ariaLabel }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
      <table className="w-full min-w-max border-collapse text-left" aria-label={ariaLabel}>
        <thead>
          <tr className="border-b border-hairline bg-paper-deep/40">
            {columns.map((column, index) => (
              <th
                key={`${column.header}-${index}`}
                scope="col"
                className={cn(
                  'eyebrow px-5 py-3.5 font-medium',
                  index === 0 ? 'pl-5' : '',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-hairline transition-colors last:border-b-0 hover:bg-moss/40"
            >
              {columns.map((column, index) => (
                <td
                  key={`${rowKey(row)}-${index}`}
                  className={cn(
                    'px-5 py-4 align-middle text-sm text-ink-soft',
                    index === 0 ? 'pl-5' : '',
                    column.className,
                  )}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-0">
                {empty ?? (
                  <div className="px-5 py-12 text-center text-sm text-muted">Tidak ada data.</div>
                )}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}