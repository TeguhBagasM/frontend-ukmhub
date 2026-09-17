import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getProfile, loginUser, logoutUser, registerUser, updateProfile } from '../lib/api'
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../lib/types'
import { useAuthStore } from '../stores/auth.store'

export const profileKey = ['profile'] as const

export function useProfile() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: profileKey,
    queryFn: getProfile,
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  })
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (result) => {
      setSession(result.token, result.user)
      queryClient.setQueryData(profileKey, result.user)
    },
  })
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      await registerUser(payload)
      // Backend belum mengembalikan token saat registrasi, jadi langsung masuk
      // memakai kredensial yang baru saja dibuat.
      return loginUser({ email: payload.email, password: payload.password })
    },
    onSuccess: (result) => {
      setSession(result.token, result.user)
      queryClient.setQueryData(profileKey, result.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clear = useAuthStore((state) => state.clear)

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      clear()
      queryClient.clear()
    },
  })
}

export function useUpdateProfile() {
  const setUser = useAuthStore((state) => state.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (user) => {
      setUser(user)
      queryClient.setQueryData(profileKey, user)
    },
  })
}
