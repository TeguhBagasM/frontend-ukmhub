import { formatNumberID } from '../../../lib/format'
import { Card, CardHeader } from '../../ui/Card'

interface MetricCardProps {
  label: string
  value: number
  accent?: boolean
}

export function MetricCard({ label, value, accent = false }: MetricCardProps) {
  return (
    <Card className="p-5">
      <CardHeader className="gap-1">
        <p className="eyebrow">{label}</p>
        <p className={`stat-figure text-4xl ${accent ? 'text-emerald' : 'text-ink'}`}>
          {formatNumberID(value)}
        </p>
      </CardHeader>
    </Card>
  )
}