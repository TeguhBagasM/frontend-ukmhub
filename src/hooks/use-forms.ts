import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createField,
  createForm,
  deleteField,
  duplicateField,
  getEventForm,
  publishForm,
  reorderFields,
  unpublishForm,
  updateField,
  updateForm,
} from '../lib/api/forms'
import type {
  CreateFieldPayload,
  CreateFormPayload,
  FieldOrderPayload,
  UpdateFieldPayload,
  UpdateFormPayload,
} from '../lib/types'
import { queryKeys } from './query-keys'

export function useEventForm(eventId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.eventForm(eventId ?? ''),
    queryFn: () => getEventForm(eventId!),
    enabled: Boolean(eventId),
  })
}

function invalidateFormAndEvent(queryClient: ReturnType<typeof useQueryClient>, eventId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.eventForm(eventId) })
  queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) })
}

export function useCreateForm(eventId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFormPayload) => createForm(eventId, payload),
    onSuccess: () => invalidateFormAndEvent(queryClient, eventId),
  })
}

export function useUpdateForm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateFormPayload & { formId: string }) => {
      const { formId, ...rest } = payload
      return updateForm(formId, rest)
    },
    onSuccess: (form) => invalidateFormAndEvent(queryClient, form.event_id),
  })
}

export function useFormPublish() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formId, publish }: { formId: string; publish: boolean }) =>
      publish ? publishForm(formId) : unpublishForm(formId),
    onSuccess: (form) => invalidateFormAndEvent(queryClient, form.event_id),
  })
}

export function useCreateField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formId, payload }: { formId: string; payload: CreateFieldPayload }) =>
      createField(formId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-form' as const] }),
  })
}

export function useUpdateField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ fieldId, payload }: { fieldId: string; payload: UpdateFieldPayload }) =>
      updateField(fieldId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-form' as const] }),
  })
}

export function useDeleteField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fieldId: string) => deleteField(fieldId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-form' as const] }),
  })
}

export function useDuplicateField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formId, fieldId }: { formId: string; fieldId: string }) =>
      duplicateField(formId, fieldId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event-form' as const] }),
  })
}

export function useReorderFields() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ formId, orders }: { formId: string; orders: FieldOrderPayload[] }) =>
      reorderFields(formId, orders),
    onSuccess: (form) => invalidateFormAndEvent(queryClient, form.event_id),
  })
}