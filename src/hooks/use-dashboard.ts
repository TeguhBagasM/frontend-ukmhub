import { useQuery } from '@tanstack/react-query'

import { getOrganizationDashboard } from '../lib/api/dashboard'
import { queryKeys } from './query-keys'

export function useOrganizationDashboard(organizationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboard(organizationId ?? ''),
    queryFn: () => getOrganizationDashboard(organizationId!),
    enabled: Boolean(organizationId),
  })
}