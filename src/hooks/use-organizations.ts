import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
} from '../lib/api/organizations'
import type {
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from '../lib/types'
import { queryKeys } from './query-keys'

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: getOrganizations,
  })
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.organization(id ?? ''),
    queryFn: () => getOrganization(id!),
    enabled: Boolean(id),
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) => createOrganization(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.organizations }),
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrganizationPayload }) =>
      updateOrganization(id, payload),
    onSuccess: (organization) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations })
      queryClient.invalidateQueries({ queryKey: queryKeys.organization(organization.id) })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.organizations }),
  })
}