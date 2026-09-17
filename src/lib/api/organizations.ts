import { api } from '../axios'
import type {
  ApiEnvelope,
  Organization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getOrganizations(): Promise<Organization[]> {
  return unwrap(await api.get<ApiEnvelope<Organization[]>>('/organizations'))
}

export async function getOrganization(id: string): Promise<Organization> {
  return unwrap(await api.get<ApiEnvelope<Organization>>(`/organizations/${id}`))
}

export async function createOrganization(
  payload: CreateOrganizationPayload,
): Promise<Organization> {
  return unwrap(await api.post<ApiEnvelope<Organization>>('/organizations', payload))
}

export async function updateOrganization(
  id: string,
  payload: UpdateOrganizationPayload,
): Promise<Organization> {
  return unwrap(await api.put<ApiEnvelope<Organization>>(`/organizations/${id}`, payload))
}

export async function deleteOrganization(id: string): Promise<void> {
  await api.delete<ApiEnvelope<null>>(`/organizations/${id}`)
}