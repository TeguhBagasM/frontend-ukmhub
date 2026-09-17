import { api } from '../axios'
import type {
  ApiEnvelope,
  ConvertMemberPayload,
  Member,
  MemberFilters,
  Paginated,
  UpdateMemberPayload,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getOrganizationMembers(
  organizationId: string,
  filters: MemberFilters = {},
): Promise<Paginated<Member>> {
  return unwrap(
    await api.get<ApiEnvelope<Paginated<Member>>>(
      `/organizations/${organizationId}/members`,
      { params: filters },
    ),
  )
}

export async function getMember(id: string): Promise<Member> {
  return unwrap(await api.get<ApiEnvelope<Member>>(`/members/${id}`))
}

export async function updateMember(
  id: string,
  payload: UpdateMemberPayload,
): Promise<Member> {
  return unwrap(await api.put<ApiEnvelope<Member>>(`/members/${id}`, payload))
}

export async function deleteMember(id: string): Promise<void> {
  await api.delete<ApiEnvelope<null>>(`/members/${id}`)
}

export async function convertRegistrationToMember(
  registrationId: string,
  payload: ConvertMemberPayload,
): Promise<Member> {
  return unwrap(
    await api.post<ApiEnvelope<Member>>(`/registrations/${registrationId}/convert-member`, payload),
  )
}