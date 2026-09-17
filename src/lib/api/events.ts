import { api } from '../axios'
import type {
  ApiEnvelope,
  Event,
  CreateEventPayload,
  UpdateEventPayload,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getOrganizationEvents(organizationId: string): Promise<Event[]> {
  return unwrap(
    await api.get<ApiEnvelope<Event[]>>(`/organizations/${organizationId}/events`),
  )
}

export async function createEvent(
  organizationId: string,
  payload: CreateEventPayload,
): Promise<Event> {
  return unwrap(
    await api.post<ApiEnvelope<Event>>(`/organizations/${organizationId}/events`, payload),
  )
}

export async function getEvent(id: string): Promise<Event> {
  return unwrap(await api.get<ApiEnvelope<Event>>(`/events/${id}`))
}

export async function updateEvent(
  id: string,
  payload: UpdateEventPayload,
): Promise<Event> {
  return unwrap(await api.put<ApiEnvelope<Event>>(`/events/${id}`, payload))
}

export async function deleteEvent(id: string): Promise<void> {
  await api.delete<ApiEnvelope<null>>(`/events/${id}`)
}

export async function publishEvent(id: string): Promise<Event> {
  return unwrap(await api.post<ApiEnvelope<Event>>(`/events/${id}/publish`))
}

export async function closeEvent(id: string): Promise<Event> {
  return unwrap(await api.post<ApiEnvelope<Event>>(`/events/${id}/close`))
}

export async function archiveEvent(id: string): Promise<Event> {
  return unwrap(await api.post<ApiEnvelope<Event>>(`/events/${id}/archive`))
}