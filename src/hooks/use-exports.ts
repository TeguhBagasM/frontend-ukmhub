import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { exportMembersCsv, exportRegistrationsCsv } from '../lib/api/exports'
import { downloadBlob } from '../lib/download'
import { getErrorMessage } from '../lib/errors'

export function useExportRegistrationsCsv(organizationId: string) {
  return useMutation({
    mutationFn: (eventId?: string) => exportRegistrationsCsv(organizationId, eventId),
    onSuccess: (result, eventId) => {
      downloadBlob(result.content, result.filename)
      toast.success(eventId ? 'Registrasi berhasil diunduh.' : 'Data registrasi berhasil diunduh.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useExportMembersCsv(organizationId: string) {
  return useMutation({
    mutationFn: () => exportMembersCsv(organizationId),
    onSuccess: (result) => {
      downloadBlob(result.content, result.filename)
      toast.success('Data anggota berhasil diunduh.')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}