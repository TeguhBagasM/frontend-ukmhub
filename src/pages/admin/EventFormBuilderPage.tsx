import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, GripVertical, ListChecks, Plus, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { FieldFormModal } from '../../components/admin/form-builder/FieldFormModal'
import { FieldSortableList } from '../../components/admin/form-builder/FieldSortableList'
import { FormPreviewPanel } from '../../components/admin/form-builder/FormPreviewPanel'
import { Button } from '../../components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { QueryState } from '../../components/ui/QueryState'
import { Badge } from '../../components/ui/Badge'
import { buttonStyles } from '../../components/ui/button-styles'
import { useEvent } from '../../hooks/use-events'
import {
  useCreateForm,
  useDeleteField,
  useDuplicateField,
  useEventForm,
  useFormPublish,
  useReorderFields,
  useUpdateForm,
} from '../../hooks/use-forms'
import { getErrorMessage } from '../../lib/errors'
import type { FormField } from '../../lib/types'

const settingsSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter.'),
  description: z.string().optional(),
  submit_webhook_url: z.string().url('Tulis URL lengkap, mis. https://…').or(z.literal('')).optional(),
})

type SettingsValues = z.infer<typeof settingsSchema>

export function EventFormBuilderPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const formQuery = useEventForm(eventId)
  const eventQuery = useEvent(eventId)
  const form = formQuery.data

  const createFormMutation = useCreateForm(eventId ?? '')
  const updateFormMutation = useUpdateForm()
  const publishMutation = useFormPublish()
  const reorderMutation = useReorderFields()
  const deleteFieldMutation = useDeleteField()
  const duplicateFieldMutation = useDuplicateField()

  const [orderedFields, setOrderedFields] = useState<FormField[]>([])
  const [fieldModal, setFieldModal] = useState<{ open: boolean; field: FormField | null }>({
    open: false,
    field: null,
  })
  const [deleting, setDeleting] = useState<FormField | null>(null)

  const settingsForm = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { title: '', description: '', submit_webhook_url: '' },
  })

  const defaultSettings: SettingsValues = useMemo(
    () => ({
      title: form?.title ?? eventQuery.data?.name ?? '',
      description: form?.description ?? '',
      submit_webhook_url: form?.submit_webhook_url ?? '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form?.id],
  )

  useEffect(() => {
    if (form) settingsForm.reset(defaultSettings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.id])

  useEffect(() => {
    if (form?.fields) setOrderedFields(form.fields)
  }, [form?.fields])

  const formId = form?.id
  const savingSettings = createFormMutation.isPending || updateFormMutation.isPending

  function saveSettings(values: SettingsValues) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      submit_webhook_url: values.submit_webhook_url || undefined,
    }

    const options = {
      onSuccess: () => toast.success('Pengaturan formulir tersimpan.'),
      onError: (error: unknown) => toast.error(getErrorMessage(error)),
    }

    if (formId) {
      updateFormMutation.mutate({ ...payload, formId }, options)
    } else if (eventId) {
      createFormMutation.mutate({ ...payload, is_published: false }, options)
    }
  }

  function togglePublish() {
    if (!formId) {
      toast.error('Simpan pengaturan formulir terlebih dahulu.')
      return
    }
    publishMutation.mutate(
      { formId, publish: !form.is_published },
      {
        onSuccess: () =>
          toast.success(form.is_published ? 'Formulir diturunkan dari publik.' : 'Formulir dipublikasikan.'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    )
  }

  function handleReorder(next: FormField[]) {
    setOrderedFields(next)
    if (!formId) return
    reorderMutation.mutate(
      { formId, orders: next.map((field, index) => ({ id: field.id, sort_order: index })) },
      { onError: (error) => toast.error(getErrorMessage(error)) },
    )
  }

  function handleDelete() {
    if (!deleting) return
    deleteFieldMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success('Field berhasil dihapus.')
        setDeleting(null)
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  const fieldsToRender = orderedFields.length > 0 ? orderedFields : (form?.fields ?? [])

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Form builder"
        title={`Formulir ${eventQuery.data?.name ? '— ' + eventQuery.data.name : ''}`}
        description="Susun pertanyaan pendaftaran. Perubahan langsung terlihat di pratinjau."
        action={
          form ? (
            <span className="inline-flex items-center gap-2">
              <Badge tone={form.is_published ? 'emerald' : 'neutral'}>
                {form.is_published ? 'Terbit' : 'Draf'}
              </Badge>
              <Link to={`/events/${eventQuery.data?.slug ?? ''}`} target="_blank" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                <Eye className="size-4" strokeWidth={1.6} aria-hidden="true" />
                Lihat publik
              </Link>
            </span>
          ) : null
        }
      />

      <QueryState
        isLoading={formQuery.isPending}
        isError={formQuery.isError}
        error={formQuery.error}
        onRetry={formQuery.refetch}
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex min-w-0 flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg font-medium">Pengaturan</CardTitle>
                <CardDescription>Judul, deskripsi, dan webhook tujuan jawaban (opsional).</CardDescription>
              </CardHeader>
              <form onSubmit={settingsForm.handleSubmit(saveSettings)} noValidate className="mt-5 flex flex-col gap-5">
                <Input
                  label="Judul formulir"
                  error={settingsForm.formState.errors.title?.message}
                  {...settingsForm.register('title')}
                />
                <Input
                  label="Deskripsi (opsional)"
                  error={settingsForm.formState.errors.description?.message}
                  {...settingsForm.register('description')}
                />
                <Input
                  label="Webhook tujuan"
                  hint="Kirim jawaban pendaftar ke URL ini via POST."
                  placeholder="https://contoh.app/webhook"
                  error={settingsForm.formState.errors.submit_webhook_url?.message}
                  {...settingsForm.register('submit_webhook_url')}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" loading={savingSettings}>
                    <Save className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    Simpan pengaturan
                  </Button>
                  <Button variant="outline" onClick={togglePublish} loading={publishMutation.isPending}>
                    {form?.is_published ? 'Tarik dari publik' : 'Publikasikan formulir'}
                  </Button>
                </div>
              </form>
            </Card>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="eyebrow">Field</p>
                  <h2 className="mt-2 font-display text-lg font-medium text-ink">Pertanyaan formulir</h2>
                </div>
                <Button
                  size="sm"
                  onClick={() => setFieldModal({ open: true, field: null })}
                  disabled={!formId}
                >
                  <Plus className="size-4" strokeWidth={1.6} aria-hidden="true" />
                  Tambah field
                </Button>
              </div>

              {!formId ? (
                <p className="mt-4 text-sm text-muted">
                  Simpan pengaturan formulir dulu untuk mulai menambahkan field.
                </p>
              ) : null}

              <div className="mt-5">
                {fieldsToRender.length === 0 ? (
                  <EmptyState
                    icon={ListChecks}
                    title="Belum ada pertanyaan"
                    description="Tambahkan field pertama untuk mulai menyusun formulir pendaftaran."
                    action={
                      <Button size="sm" onClick={() => setFieldModal({ open: true, field: null })} disabled={!formId}>
                        <Plus className="size-4" strokeWidth={1.6} aria-hidden="true" />
                        Tambah field
                      </Button>
                    }
                  />
                ) : (
                  <FieldSortableList
                    fields={fieldsToRender}
                    onReorder={handleReorder}
                    onEdit={(field) => setFieldModal({ open: true, field })}
                    onDuplicate={(field) => {
                      if (!formId) return
                      duplicateFieldMutation.mutate(
                        { formId, fieldId: field.id },
                        {
                          onSuccess: () => toast.success('Field berhasil diduplikasi.'),
                          onError: (error) => toast.error(getErrorMessage(error)),
                        },
                      )
                    }}
                    onDelete={(field) => setDeleting(field)}
                  />
                )}
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                <GripVertical className="size-4" strokeWidth={1.6} aria-hidden="true" />
                Seret pegangan atau gunakan panah untuk mengubah urutan.
              </p>
            </div>
          </div>

          <FormPreviewPanel
            title={settingsForm.watch('title') || defaultSettings.title}
            description={settingsForm.watch('description') || ''}
            fields={fieldsToRender}
          />
        </div>
      </QueryState>

      <FieldFormModal
        open={fieldModal.open}
        onClose={() => setFieldModal({ open: false, field: null })}
        formId={formId ?? ''}
        field={fieldModal.field}
        nextSortOrder={fieldsToRender.length}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Hapus field?"
        description={`Pertanyaan "${deleting?.label ?? ''}" akan dihapus dari formulir.`}
        confirmLabel="Hapus"
        loading={deleteFieldMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  )
}