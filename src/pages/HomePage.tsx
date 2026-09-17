import { Agenda } from '../components/home/Agenda'
import { CtaBand } from '../components/home/CtaBand'
import { Features } from '../components/home/Features'
import { Hero } from '../components/home/Hero'
import { Manifesto } from '../components/home/Manifesto'
import { Marquee } from '../components/home/Marquee'
import { StatsStrip } from '../components/home/StatsStrip'
import { Page } from '../components/layout/Page'

export function HomePage() {
  return (
    <Page>
      <Hero />
      <Marquee />
      <StatsStrip />
      <Features />
      <Agenda />
      <Manifesto />
      <CtaBand />
    </Page>
  )
}
