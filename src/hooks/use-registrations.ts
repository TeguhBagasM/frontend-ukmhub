import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  acceptRegistration,
  getEventRegistrations,
  getRegistration,
  rejectRegistration,
} from '../lib/api/registrations'
import type { RegistrationFilters } from '../lib/types'
import { queryKeys } from './query-keys'

const eventRegistrationsPrefix = (eventId: string) => ['event-registrations', eventId] as const

export function useEventRegistrations(eventId: string | undefined, filters: RegistrationFilters) {
  return useQuery({
    queryKey: queryKeys.eventRegistrations(eventId ?? '', filters),
    queryFn: () => getEventRegistrations(eventId!, filters),
    enabled: Boolean(eventId),
  })
}

export function useRegistration(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.registration(id ?? ''),
    queryFn: () => getRegistration(id!),
    enabled: Boolean(id),
  })
}

export function useAcceptRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => acceptRegistration(id),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.registration(registration.id) })
      queryClient.invalidateQueries({ queryKey: eventRegistrationsPrefix(registration.event_id) })
      queryClient.invalidateQueries({ queryKey: ['dashboard' as const] })
    },
  })
}

export function useRejectRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectRegistration(id, reason),
    onSuccess: (registration) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.registration(registration.id) })
      queryClient.invalidateQueries({ queryKey: eventRegistrationsPrefix(registration.event_id) })
      queryClient.invalidateQueries({ queryKey: ['dashboard' as const] })
    },
  })
}