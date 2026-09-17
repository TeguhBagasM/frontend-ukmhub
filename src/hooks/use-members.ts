import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  convertRegistrationToMember,
  deleteMember,
  getMember,
  getOrganizationMembers,
  updateMember,
} from '../lib/api/members'
import type {
  ConvertMemberPayload,
  MemberFilters,
  UpdateMemberPayload,
} from '../lib/types'
import { queryKeys } from './query-keys'

const organizationMembersPrefix = (organizationId: string) =>
  ['organizations', organizationId, 'members'] as const

export function useOrganizationMembers(
  organizationId: string | undefined,
  filters: MemberFilters,
) {
  return useQuery({
    queryKey: queryKeys.organizationMembersPage(organizationId ?? '', filters),
    queryFn: () => getOrganizationMembers(organizationId!, filters),
    enabled: Boolean(organizationId),
  })
}

export function useMember(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.member(id ?? ''),
    queryFn: () => getMember(id!),
    enabled: Boolean(id),
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMemberPayload }) =>
      updateMember(id, payload),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member(member.id) })
      queryClient.invalidateQueries({ queryKey: organizationMembersPrefix(member.organization_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(member.organization_id) })
    },
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, organizationId }: { id: string; organizationId: string }) =>
      deleteMember(id).then(() => organizationId),
    onSuccess: (organizationId) => {
      queryClient.invalidateQueries({ queryKey: organizationMembersPrefix(organizationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(organizationId) })
    },
  })
}

export function useConvertRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      registrationId,
      payload,
    }: {
      registrationId: string
      payload: ConvertMemberPayload
    }) => convertRegistrationToMember(registrationId, payload),
    onSuccess: (member) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member(member.id) })
      queryClient.invalidateQueries({ queryKey: organizationMembersPrefix(member.organization_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(member.organization_id) })
      queryClient.invalidateQueries({ queryKey: ['registrations' as const] })
      queryClient.invalidateQueries({ queryKey: ['event-registrations' as const] })
    },
  })
}