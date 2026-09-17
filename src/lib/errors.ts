import { isAxiosError } from 'axios'

import type { ApiErrorPayload } from './types'

const MESSAGES: Record<string, string> = {
  'email already registered': 'Email ini sudah terdaftar. Coba masuk atau gunakan email lain.',
  'invalid email or password': 'Email atau kata sandi salah. Periksa kembali.',
  'invalid token': 'Sesi Anda sudah berakhir. Silakan masuk kembali.',
  'invalid user id': 'Sesi tidak valid. Silakan masuk kembali.',
  'user not found': 'Pengguna tidak ditemukan.',
  'invalid email or password ': 'Email atau kata sandi salah.',
  'unauthorized': 'Kamu tidak punya izin untuk melakukan ini.',
  'forbidden': 'Kamu tidak punya izin untuk mengakses data ini.',
  'organization not found': 'Organisasi tidak ditemukan.',
  'division not found': 'Divisi tidak ditemukan.',
  'event not found': 'Event tidak ditemukan.',
  'form not found': 'Formulir tidak ditemukan.',
  'member not found': 'Anggota tidak ditemukan.',
  'registration not found': 'Pendaftaran tidak ditemukan.',
  'slug already exists': 'Slug sudah dipakai. Gunakan slug lain.',
}

function mapMessage(raw: string | undefined): string | null {
  if (!raw) return null
  const normalized = raw.trim().toLowerCase()

  for (const [key, value] of Object.entries(MESSAGES)) {
    if (normalized === key) return value
  }

  // Validasi binding dari Gin menampilkan teks teknis; alihkan ke pesan ramah.
  if (normalized.startsWith('key:') || normalized.includes('field validation')) {
    return 'Periksa kembali data yang kamu isi.'
  }

  return null
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Tidak bisa terhubung ke server. Pastikan backend berjalan.'
    }

    const payload = error.response.data as ApiErrorPayload | undefined
    const mapped = mapMessage(payload?.message) ?? mapMessage(payload?.error)
    if (mapped) return mapped

    if (payload?.message) return payload.message
    if (payload?.error) return payload.error

    if (error.response.status === 401) {
      return 'Sesi Anda sudah berakhir. Silakan masuk kembali.'
    }
    if (error.response.status === 404) {
      return 'Data tidak ditemukan.'
    }
    if (error.response.status >= 500) {
      return 'Terjadi kesalahan di server. Coba lagi sebentar.'
    }
    return 'Terjadi kesalahan di server. Coba lagi sebentar.'
  }

  return 'Terjadi kesalahan tak terduga. Coba lagi.'
}