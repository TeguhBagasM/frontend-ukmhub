import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createDivision,
  deleteDivision,
  getDivisions,
  updateDivision,
} from '../lib/api/divisions'
import type { CreateDivisionPayload, UpdateDivisionPayload } from '../lib/types'
import { queryKeys } from './query-keys'

export function useDivisions(organizationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.organizationDivisions(organizationId ?? ''),
    queryFn: () => getDivisions(organizationId!),
    enabled: Boolean(organizationId),
  })
}

export function useCreateDivision(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDivisionPayload) => createDivision(organizationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationDivisions(organizationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(organizationId) })
    },
  })
}

export function useUpdateDivision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDivisionPayload }) =>
      updateDivision(id, payload),
    onSuccess: (division) => {
      const orgId = division.organization_id
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationDivisions(orgId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(orgId) })
    },
  })
}

export function useDeleteDivision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, organizationId }: { id: string; organizationId: string }) =>
      deleteDivision(id).then(() => organizationId),
    onSuccess: (organizationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationDivisions(organizationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(organizationId) })
    },
  })
}