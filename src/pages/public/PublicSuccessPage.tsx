import { CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Page } from '../../components/layout/Page'

export function PublicSuccessPage() {
  const { slug } = useParams<{ slug: string }>()
  return <Page><div className="mx-auto max-w-xl py-16"><Card className="text-center"><CheckCircle2 className="mx-auto size-10 text-emerald" strokeWidth={1.5} aria-hidden="true" /><p className="eyebrow mt-6">Pendaftaran terkirim</p><h1 className="mt-4 font-display text-3xl font-medium text-ink">Terima kasih sudah mendaftar.</h1><p className="mt-4 text-sm leading-relaxed text-muted">Data kamu sudah diterima. Admin organisasi akan meninjau pendaftaran ini.</p><Link to={`/events/${slug}`} className="mt-8 inline-block"><Button variant="outline">Kembali ke event</Button></Link></Card></div></Page>
}
