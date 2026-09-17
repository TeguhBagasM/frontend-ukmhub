import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { DynamicFormRenderer } from '../../components/dynamic-form/DynamicFormRenderer'
import { Card } from '../../components/ui/Card'
import { QueryState } from '../../components/ui/QueryState'
import { DetailSkeleton } from '../../components/ui/Skeleton'
import { usePublicEventForm, useSubmitPublicRegistration } from '../../hooks/use-public'
import { getErrorMessage } from '../../lib/errors'

export function PublicRegisterPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const form = usePublicEventForm(slug)
  const submit = useSubmitPublicRegistration()
  const current = form.data
  return <div className="mx-auto max-w-3xl"><QueryState isLoading={form.isPending} loading={<DetailSkeleton />} isError={form.isError} error={form.error} onRetry={form.refetch} isEmpty={!current}>{current ? <Card><DynamicFormRenderer fields={current.form.fields} title={current.form.title} description={current.form.description} busy={submit.isPending} onSubmit={(answers) => { if (!slug) return; submit.mutate({ slug, payload: { answers } }, { onSuccess: () => navigate(`/events/${slug}/success`), onError: (error) => toast.error(getErrorMessage(error)) }) }} /></Card> : null}</QueryState><Link to={`/events/${slug}`} className="mt-6 inline-block text-sm text-emerald underline underline-offset-4">Kembali ke detail event</Link></div>
}
