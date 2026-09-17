export interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

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

export interface ApiEnvelope<T> {
  message?: string
  data: T
}

export interface LoginResult {
  token: string
  user: User
}
