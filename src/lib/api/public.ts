import { api } from '../axios'
import type {
  ApiEnvelope,
  Event,
  PublicEventForm,
  SubmitRegistrationPayload,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getPublicEvent(slug: string): Promise<Event> {
  return unwrap(await api.get<ApiEnvelope<Event>>(`/public/events/${slug}`))
}

export async function getPublicEventForm(slug: string): Promise<PublicEventForm> {
  return unwrap(await api.get<ApiEnvelope<PublicEventForm>>(`/public/events/${slug}/form`))
}

export async function submitPublicRegistration(
  slug: string,
  payload: SubmitRegistrationPayload,
): Promise<unknown> {
  return unwrap(
    await api.post<ApiEnvelope<unknown>>(`/public/events/${slug}/registrations`, payload),
  )
}