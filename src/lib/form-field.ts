import type { FormFieldType } from './types'

export const FORM_FIELD_TYPE_OPTIONS: Array<{ value: FormFieldType; label: string }> = [
  { value: 'TEXT', label: 'Teks' },
  { value: 'TEXTAREA', label: 'Paragraf' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'NUMBER', label: 'Angka' },
  { value: 'PHONE', label: 'Telepon' },
  { value: 'DATE', label: 'Tanggal' },
  { value: 'SELECT', label: 'Dropdown' },
  { value: 'RADIO', label: 'Radio' },
  { value: 'CHECKBOX', label: 'Checkbox' },
  { value: 'URL', label: 'URL' },
]

export function typeLabel(type: FormFieldType): string {
  return FORM_FIELD_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type
}

export function usesOptions(type: FormFieldType): boolean {
  return type === 'SELECT' || type === 'RADIO' || type === 'CHECKBOX'
}