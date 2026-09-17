import { api } from '../axios'
import type {
  ApiEnvelope,
  Paginated,
  Registration,
  RegistrationFilters,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getEventRegistrations(
  eventId: string,
  filters: RegistrationFilters = {},
): Promise<Paginated<Registration>> {
  return unwrap(
    await api.get<ApiEnvelope<Paginated<Registration>>>(
      `/events/${eventId}/registrations`,
      { params: filters },
    ),
  )
}

export async function getRegistration(id: string): Promise<Registration> {
  return unwrap(await api.get<ApiEnvelope<Registration>>(`/registrations/${id}`))
}

export async function acceptRegistration(id: string): Promise<Registration> {
  return unwrap(await api.post<ApiEnvelope<Registration>>(`/registrations/${id}/accept`))
}

export async function rejectRegistration(id: string, reason: string): Promise<Registration> {
  return unwrap(
    await api.post<ApiEnvelope<Registration>>(`/registrations/${id}/reject`, { reason }),
  )
}