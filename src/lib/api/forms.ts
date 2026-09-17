import { api } from '../axios'
import type {
  ApiEnvelope,
  Form,
  CreateFormPayload,
  UpdateFormPayload,
  CreateFieldPayload,
  UpdateFieldPayload,
  FieldOrderPayload,
} from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getEventForm(eventId: string): Promise<Form> {
  return unwrap(await api.get<ApiEnvelope<Form>>(`/events/${eventId}/form`))
}

export async function createForm(
  eventId: string,
  payload: CreateFormPayload,
): Promise<Form> {
  return unwrap(await api.post<ApiEnvelope<Form>>(`/events/${eventId}/form`, payload))
}

export async function updateForm(
  formId: string,
  payload: UpdateFormPayload,
): Promise<Form> {
  return unwrap(await api.put<ApiEnvelope<Form>>(`/forms/${formId}`, payload))
}

export async function publishForm(formId: string): Promise<Form> {
  return unwrap(await api.post<ApiEnvelope<Form>>(`/forms/${formId}/publish`))
}

export async function unpublishForm(formId: string): Promise<Form> {
  return unwrap(await api.post<ApiEnvelope<Form>>(`/forms/${formId}/unpublish`))
}

export async function createField(formId: string, payload: CreateFieldPayload): Promise<FormField> {
  return unwrap(await api.post<ApiEnvelope<FormField>>(`/forms/${formId}/fields`, payload))
}

export async function updateField(
  fieldId: string,
  payload: UpdateFieldPayload,
): Promise<FormField> {
  return unwrap(await api.put<ApiEnvelope<FormField>>(`/fields/${fieldId}`, payload))
}

export async function deleteField(fieldId: string): Promise<void> {
  await api.delete<ApiEnvelope<null>>(`/fields/${fieldId}`)
}

export async function duplicateField(formId: string, fieldId: string): Promise<FormField> {
  return unwrap(
    await api.post<ApiEnvelope<FormField>>(`/forms/${formId}/fields/${fieldId}/duplicate`),
  )
}

export async function reorderFields(formId: string, orders: FieldOrderPayload[]): Promise<Form> {
  return unwrap(await api.post<ApiEnvelope<Form>>(`/forms/${formId}/fields/reorder`, orders))
}

type FormField = import('../types').FormField