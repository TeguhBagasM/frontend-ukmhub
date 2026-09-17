import { AlertTriangle } from 'lucide-react'

import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Hapus',
  destructive = true,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={loading ? 'Memproses…' : undefined}
      className="max-w-sm"
    >
      {!loading ? (
        <>
          <div className="flex items-start gap-3 rounded-md border border-clay/30 bg-clay/5 px-3.5 py-3">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-clay"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-clay">
              {description ?? 'Tindakan ini tidak bisa dibatalkan. Lanjutkan?'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button
              variant={destructive ? 'primary' : 'dark'}
              onClick={onConfirm}
              loading={loading}
              className={destructive ? 'bg-clay hover:bg-clay' : ''}
            >
              {confirmLabel}
            </Button>
          </div>
        </>
      ) : null}
    </Modal>
  )
}