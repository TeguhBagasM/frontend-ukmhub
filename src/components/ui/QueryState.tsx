import { RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

import { getErrorMessage } from '../../lib/errors'
import { Button } from './Button'
import { EmptyState } from './EmptyState'
import { Spinner } from './Spinner'

interface QueryStateProps {
  isLoading: boolean
  isError: boolean
  error: unknown
  isEmpty?: boolean
  empty?: ReactNode
  loading?: ReactNode
  onRetry?: () => void
  children: ReactNode
}

export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty = false,
  empty,
  loading,
  onRetry,
  children,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        {loading ?? <Spinner className="size-5 text-emerald" />}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-clay/30 bg-clay/5 px-6 py-12 text-center">
        <p className="text-sm leading-relaxed text-clay">{getErrorMessage(error)}</p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-5">
            <RefreshCw className="size-4" strokeWidth={1.6} aria-hidden="true" />
            Coba lagi
          </Button>
        ) : null}
      </div>
    )
  }

  if (isEmpty) {
    return <>{empty ?? <EmptyState title="Kosong" description="Belum ada data di sini." />}</>
  }

  return <>{children}</>
}