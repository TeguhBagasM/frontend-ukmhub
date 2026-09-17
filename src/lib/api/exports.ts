import { api } from '../axios'

export interface CsvDownloadResult {
  filename: string
  content: Blob
}

function filenameFromDisposition(contentDisposition?: string): string {
  if (!contentDisposition) return 'export.csv'
  const match = contentDisposition.match(/filename="?([^";]+)"?/)
  return match?.[1] ?? 'export.csv'
}

export async function exportRegistrationsCsv(
  organizationId: string,
  eventId?: string,
): Promise<CsvDownloadResult> {
  const response = await api.get<Blob>(`/organizations/${organizationId}/registrations/export`, {
    params: eventId ? { event_id: eventId } : undefined,
    responseType: 'blob',
  })
  return {
    filename: filenameFromDisposition(String(response.headers['content-disposition'] ?? '')),
    content: response.data,
  }
}

export async function exportMembersCsv(organizationId: string): Promise<CsvDownloadResult> {
  const response = await api.get<Blob>(`/organizations/${organizationId}/members/export`, {
    responseType: 'blob',
  })
  return {
    filename: filenameFromDisposition(String(response.headers['content-disposition'] ?? '')),
    content: response.data,
  }
}