import { api } from '../axios'
import type { ApiEnvelope, DashboardData } from '../types'

function unwrap<T>(response: { data: ApiEnvelope<T> }): T {
  return response.data.data
}

export async function getOrganizationDashboard(organizationId: string): Promise<DashboardData> {
  return unwrap(
    await api.get<ApiEnvelope<DashboardData>>(`/organizations/${organizationId}/dashboard`),
  )
}