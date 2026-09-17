import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Container } from '../../components/ui/Container'
import { Input } from '../../components/ui/Input'
import { Page } from '../../components/layout/Page'

export function PublicEventsPage() {
  const [slug, setSlug] = useState('')
  const navigate = useNavigate()
  function openEvent(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const value = slug.trim(); if (value) navigate(`/events/${value}`) }
  return <Page><Container className="py-16 sm:py-24"><div className="max-w-2xl"><p className="eyebrow">Event publik</p><h1 className="mt-5 font-display text-4xl font-medium tracking-[-0.04em] text-ink sm:text-5xl">Temukan kegiatan kampus.</h1><p className="mt-4 text-base leading-relaxed text-muted">Masukkan slug event untuk membuka detail dan formulir pendaftaran.</p></div><Card className="mt-10 max-w-xl"><form onSubmit={openEvent} className="flex flex-col gap-4 sm:flex-row sm:items-end"><div className="min-w-0 flex-1"><Input label="Slug event" placeholder="open-recruitment-csa-2026" value={slug} onChange={(event) => setSlug(event.target.value)} /></div><Button type="submit"><Search className="size-4" aria-hidden="true" />Buka event</Button></form></Card><div className="mt-12 border-t border-hairline pt-6"><Link to="/login" className="inline-flex items-center gap-2 text-sm text-emerald hover:underline">Masuk sebagai admin <ArrowRight className="size-4" aria-hidden="true" /></Link></div></Container></Page>
}
