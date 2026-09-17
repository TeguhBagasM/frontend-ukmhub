import { isAxiosError } from 'axios'

const MESSAGES: Record<string, string> = {
  'email already registered': 'Email ini sudah terdaftar. Coba masuk atau gunakan email lain.',
  'invalid email or password': 'Email atau kata sandi salah. Periksa kembali.',
  'invalid token': 'Sesi Anda sudah berakhir. Silakan masuk kembali.',
  'invalid user id': 'Sesi tidak valid. Silakan masuk kembali.',
  'user not found': 'Pengguna tidak ditemukan.',
  'invalid email or password ': 'Email atau kata sandi salah.',
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Tidak bisa terhubung ke server. Pastikan backend berjalan.'
    }

    const payload = error.response.data as { error?: string } | undefined
    const raw = payload?.error?.trim()

    if (raw) {
      const normalized = raw.toLowerCase()
      if (MESSAGES[normalized]) return MESSAGES[normalized]

      // Validasi binding dari Gin menampilkan teks teknis; alihkan ke pesan ramah.
      if (normalized.startsWith('key:') || normalized.includes('field validation')) {
        return 'Periksa kembali data yang kamu isi.'
      }
      return raw
    }

    if (error.response.status === 401) {
      return 'Sesi Anda sudah berakhir. Silakan masuk kembali.'
    }
    return 'Terjadi kesalahan di server. Coba lagi sebentar.'
  }

  return 'Terjadi kesalahan tak terduga. Coba lagi.'
}
