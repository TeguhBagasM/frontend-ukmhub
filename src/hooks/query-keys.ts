export const queryKeys = {
  organizations: ['organizations'] as const,
  organization: (id: string) => ['organizations', id] as const,
  organizationDivisions: (id: string) => ['organizations', id, 'divisions'] as const,
  organizationEvents: (id: string) => ['organizations', id, 'events'] as const,
  organizationMembers: (id: string) => ['organizations', id, 'members'] as const,
  organizationMembersPage: (id: string, filters: unknown) =>
    ['organizations', id, 'members', filters] as const,
  dashboard: (id: string) => ['dashboard', id] as const,
  event: (id: string) => ['events', id] as const,
  eventForm: (id: string) => ['event-form', id] as const,
  eventRegistrations: (id: string, filters: unknown) =>
    ['event-registrations', id, filters] as const,
  registration: (id: string) => ['registrations', id] as const,
  member: (id: string) => ['members', id] as const,
  publicEvent: (slug: string) => ['public', slug] as const,
  publicEventForm: (slug: string) => ['public', slug, 'form'] as const,
} as const