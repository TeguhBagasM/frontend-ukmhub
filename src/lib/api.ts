import { api } from './axios'
import type {
  ApiEnvelope,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from './types'

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<ApiEnvelope<User>>('/auth/register', payload)
  return data.data
}

export async function loginUser(payload: LoginPayload): Promise<LoginResult> {
  const { data } = await api.post<ApiEnvelope<LoginResult>>('/auth/login', payload)
  return data.data
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout')
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<ApiEnvelope<User>>('/users/me')
  return data.data
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await api.put<ApiEnvelope<User>>('/users/me', payload)
  return data.data
}
