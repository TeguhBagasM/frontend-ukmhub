export interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  data: T
}

export interface ApiErrorPayload {
  success?: boolean
  message?: string
  error?: string
}

/* ------------------------------------------------------------------ */
/* Auth / User                                                          */
/* ------------------------------------------------------------------ */

export interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'USER'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
}

export interface LoginResult {
  token: string
  user: User
}

/* ------------------------------------------------------------------ */
/* Pagination                                                           */
/* ------------------------------------------------------------------ */

export interface Paginated<T> {
  items: T[]
  page: number
  per_page: number
  total: number
  total_pages: number
}

/* ------------------------------------------------------------------ */
/* Organization                                                         */
/* ------------------------------------------------------------------ */

export type OrganizationStatus = 'active' | 'inactive'

export interface Organization {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  email: string
  phone: string
  status: OrganizationStatus
  created_at: string
  updated_at: string
}

export interface CreateOrganizationPayload {
  name: string
  slug: string
  description?: string
  logo?: string
  email?: string
  phone?: string
  status?: OrganizationStatus
}

export type UpdateOrganizationPayload = Partial<CreateOrganizationPayload>

/* ------------------------------------------------------------------ */
/* Division                                                             */
/* ------------------------------------------------------------------ */

export type DivisionStatus = 'active' | 'inactive'

export interface Division {
  id: string
  organization_id: string
  name: string
  description: string
  status: DivisionStatus
  created_at: string
  updated_at: string
}

export interface CreateDivisionPayload {
  name: string
  description?: string
  status?: DivisionStatus
}

export type UpdateDivisionPayload = Partial<CreateDivisionPayload>

/* ------------------------------------------------------------------ */
/* Event                                                                */
/* ------------------------------------------------------------------ */

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'

export interface Event {
  id: string
  organization_id: string
  name: string
  slug: string
  description: string
  location: string
  start_date: string
  end_date: string
  registration_start: string
  registration_end: string
  quota: number
  status: EventStatus
  registration_count: number
  created_at: string
  updated_at: string
}

export interface CreateEventPayload {
  name: string
  slug: string
  description?: string
  location?: string
  start_date?: string
  end_date?: string
  registration_start?: string
  registration_end?: string
  quota?: number
  status?: EventStatus
}

export type UpdateEventPayload = Partial<CreateEventPayload>

/* ------------------------------------------------------------------ */
/* Form Builder                                                         */
/* ------------------------------------------------------------------ */

export type FormFieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'EMAIL'
  | 'NUMBER'
  | 'PHONE'
  | 'DATE'
  | 'SELECT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'URL'

export interface FormField {
  id: string
  form_id: string
  label: string
  name: string
  type: FormFieldType
  placeholder: string
  description: string
  required: boolean
  options: string[]
  sort_order: number
}

export interface Form {
  id: string
  event_id: string
  title: string
  description: string
  submit_webhook_url: string
  is_published: boolean
  fields: FormField[]
  created_at: string
  updated_at: string
}

export interface CreateFormPayload {
  title: string
  description?: string
  submit_webhook_url?: string
  is_published: boolean
}

export interface UpdateFormPayload {
  title?: string
  description?: string
  submit_webhook_url?: string
}

export interface CreateFieldPayload {
  label: string
  name: string
  type: FormFieldType
  placeholder?: string
  description?: string
  required: boolean
  options?: string[]
  sort_order?: number
}

export type UpdateFieldPayload = Partial<CreateFieldPayload>

export interface FieldOrderPayload {
  id: string
  sort_order: number
}

/* ------------------------------------------------------------------ */
/* Registrations                                                        */
/* ------------------------------------------------------------------ */

export type RegistrationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface RegistrationAnswer {
  field_id: string
  label: string
  name: string
  type: string
  value: string
}

export interface Registration {
  id: string
  event_id: string
  status: RegistrationStatus
  rejection_reason: string
  submitted_at: string
  created_at: string
  updated_at: string
  answers: RegistrationAnswer[]
}

export interface RegistrationFilters {
  status?: string
  search?: string
  page?: number
  per_page?: number
}

export interface ConvertMemberPayload {
  division_id: string | null
  name: string
  email: string
  phone: string
  student_id: string
  status: MemberStatus
}

/* ------------------------------------------------------------------ */
/* Members                                                              */
/* ------------------------------------------------------------------ */

export type MemberStatus = 'active' | 'inactive'

export interface Member {
  id: string
  organization_id: string
  division_id: string | null
  registration_id: string | null
  name: string
  email: string
  phone: string
  student_id: string
  status: MemberStatus
  joined_at: string
  created_at: string
  updated_at: string
}

export interface MemberFilters {
  search?: string
  division_id?: string
  page?: number
  per_page?: number
}

export type UpdateMemberPayload = Partial<{
  division_id: string | null
  name: string
  email: string
  phone: string
  student_id: string
  status: MemberStatus
}>

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */

export interface DashboardMetrics {
  total_members: number
  active_members: number
  active_events: number
  total_events: number
  total_registrations: number
  pending_applications: number
}

export type RegistrationStatusDistribution = Record<RegistrationStatus, number>

export interface MemberByDivision {
  division_id: string | null
  division_name: string
  count: number
}

export interface RecentRegistration {
  id: string
  event_id: string
  event_title: string
  status: RegistrationStatus
  submitted_at: string
}

export interface DashboardData {
  metrics: DashboardMetrics
  registration_status_distribution: RegistrationStatusDistribution
  members_by_division: MemberByDivision[]
  recent_registrations: RecentRegistration[]
}

/* ------------------------------------------------------------------ */
/* Public                                                               */
/* ------------------------------------------------------------------ */

export interface PublicEventForm {
  event: Event
  form: {
    id: string
    title: string
    description: string
    fields: FormField[]
  }
}

export interface SubmitRegistrationAnswer {
  field_id: string
  value: string
}

export interface SubmitRegistrationPayload {
  answers: SubmitRegistrationAnswer[]
}