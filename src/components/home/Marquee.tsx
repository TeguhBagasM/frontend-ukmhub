import { bidang } from '../../lib/content'

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...bidang, ...bidang]

  return (
    <div className="marquee flex overflow-hidden">
      <div className={reverse ? 'marquee-track marquee-track-reverse' : 'marquee-track'}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span className="px-6 font-display text-2xl tracking-[-0.02em] text-ink sm:text-3xl">
              {item}
            </span>
            <span aria-hidden="true" className="size-1 rounded-full bg-emerald/60" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <section aria-label="Bidang unit kegiatan mahasiswa" className="border-y border-hairline py-8">
      <div className="flex flex-col gap-6">
        <Row />
        <Row reverse />
      </div>
    </section>
  )
}
