import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  archiveEvent,
  closeEvent,
  createEvent,
  deleteEvent,
  getEvent,
  getOrganizationEvents,
  publishEvent,
  updateEvent,
} from '../lib/api/events'
import type { CreateEventPayload, Event, EventStatus, UpdateEventPayload } from '../lib/types'
import { queryKeys } from './query-keys'

export function useOrganizationEvents(organizationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.organizationEvents(organizationId ?? ''),
    queryFn: () => getOrganizationEvents(organizationId!),
    enabled: Boolean(organizationId),
  })
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.event(id ?? ''),
    queryFn: () => getEvent(id!),
    enabled: Boolean(id),
  })
}

export function useCreateEvent(organizationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => createEvent(organizationId, payload),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationEvents(organizationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(organizationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.event(event.id) })
    },
  })
}

export function useUpdateEvent(organizationId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventPayload }) =>
      updateEvent(id, payload),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.event(event.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationEvents(organizationId ?? event.organization_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(organizationId ?? event.organization_id) })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, organizationId }: { id: string; organizationId: string }) =>
      deleteEvent(id).then(() => organizationId),
    onSuccess: (organizationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationEvents(organizationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(organizationId) })
    },
  })
}

const statusActions: Record<'publish' | 'close' | 'archive', (id: string) => Promise<Event>> =
  {
  publish: publishEvent,
  close: closeEvent,
  archive: archiveEvent,
}

export function useEventStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: keyof typeof statusActions }) =>
      statusActions[action](id),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.event(event.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.organizationEvents(event.organization_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(event.organization_id) })
    },
  })
}

export type { EventStatus }