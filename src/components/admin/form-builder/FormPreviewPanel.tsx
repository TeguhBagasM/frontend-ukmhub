import { toast } from 'sonner'

import type { FormField } from '../../../lib/types'
import { DynamicFormRenderer } from '../../dynamic-form/DynamicFormRenderer'
import { Card, CardDescription, CardHeader, CardTitle } from '../../ui/Card'

interface FormPreviewProps {
  title: string
  description: string
  fields: FormField[]
}

export function FormPreviewPanel({ title, description, fields }: FormPreviewProps) {
  return (
    <Card className="p-6 lg:sticky lg:top-8">
      <CardHeader className="pb-1">
        <p className="eyebrow">Pratinjau</p>
        <CardTitle className="font-display text-lg font-medium">Tampilan pendaftar</CardTitle>
        <CardDescription>Persis seperti yang dilihat mahasiswa di halaman publik.</CardDescription>
      </CardHeader>
      <div className="mt-6">
        <DynamicFormRenderer
          title={title}
          description={description}
          fields={fields}
          submitLabel="Contoh kirim"
          onSubmit={() => toast.success('Contoh jawaban terkirim (mode pratinjau).')}
        />
      </div>
    </Card>
  )
}