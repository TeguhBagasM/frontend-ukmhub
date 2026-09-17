import { useMutation, useQuery } from '@tanstack/react-query'

import { getPublicEvent, getPublicEventForm, submitPublicRegistration } from '../lib/api/public'
import type { SubmitRegistrationPayload } from '../lib/types'
import { queryKeys } from './query-keys'

export function usePublicEvent(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.publicEvent(slug ?? ''),
    queryFn: () => getPublicEvent(slug!),
    enabled: Boolean(slug),
  })
}

export function usePublicEventForm(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.publicEventForm(slug ?? ''),
    queryFn: () => getPublicEventForm(slug!),
    enabled: Boolean(slug),
  })
}

export function useSubmitPublicRegistration() {
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: SubmitRegistrationPayload }) =>
      submitPublicRegistration(slug, payload),
  })
}