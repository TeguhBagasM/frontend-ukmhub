import { api } from '../axios'
import type {
  ApiEnvelope,
  Division,
  CreateDivisionPayload,
  UpdateDivisionPayload,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getDivisions(organizationId: string): Promise<Division[]> {
  return unwrap(
    await api.get<ApiEnvelope<Division[]>>(`/organizations/${organizationId}/divisions`),
  )
}

export async function createDivision(
  organizationId: string,
  payload: CreateDivisionPayload,
): Promise<Division> {
  return unwrap(
    await api.post<ApiEnvelope<Division>>(`/organizations/${organizationId}/divisions`, payload),
  )
}

export async function updateDivision(
  id: string,
  payload: UpdateDivisionPayload,
): Promise<Division> {
  return unwrap(await api.put<ApiEnvelope<Division>>(`/divisions/${id}`, payload))
}

export async function deleteDivision(id: string): Promise<void> {
  await api.delete<ApiEnvelope<null>>(`/divisions/${id}`)
}