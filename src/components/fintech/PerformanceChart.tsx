'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, formatPct } from '@/lib/utils'

export type ChartPoint = { label: string; value: number }

const RANGES = ['1J', '1S', '1M', '1A', 'MAX'] as const

export function PerformanceChart({
  title = 'BRVM COMPOSITE',
  value,
  changePct,
  data,
  subtitle,
  volume,
  className,
}: {
  title?: string
  value: number
  changePct: number
  data: ChartPoint[]
  subtitle?: string
  volume?: string
  className?: string
}) {
  const positive = changePct >= 0
  const stroke = positive ? '#00D26A' : '#FF5C5C'
  const fillId = positive ? 'perfFillUp' : 'perfFillDown'

  return (
    <GlassCard className={cn('overflow-hidden', className)} hover={false}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-fin-mute">{title}</p>
          <div className="flex items-end gap-2.5 mt-2">
            <p className="text-2xl md:text-3xl font-bold tracking-tight">
              {value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-sm font-semibold mb-1',
                positive ? 'text-fin-success' : 'text-fin-danger'
              )}
            >
              {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatPct(changePct)}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex gap-1 p-1 rounded-xl bg-fin-surface border border-white/5">
          {RANGES.map((r, i) => (
            <button
              key={r}
              type="button"
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-bold',
                i === 2 ? 'bg-fin-primary text-white' : 'text-fin-mute hover:text-white'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-28 md:h-36 -mx-1 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{
                background: '#0C1424',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: '#98A2B3' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={2.5}
              fill={`url(#${fillId})`}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {(subtitle || volume) && (
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5 text-[11px] text-fin-mute">
          {subtitle && <span>{subtitle}</span>}
          {volume && <span>{volume}</span>}
        </div>
      )}
    </GlassCard>
  )
}

export function MetricCard({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'success' | 'danger' | 'primary'
}) {
  const tones = {
    default: 'text-white',
    success: 'text-fin-success',
    danger: 'text-fin-danger',
    primary: 'text-fin-primary',
  }

  return (
    <GlassCard padding="sm" className="min-h-[96px]">
      <p className="text-[11px] font-medium text-fin-mute mb-2">{label}</p>
      <p className={cn('text-xl font-bold tracking-tight', tones[tone])}>{value}</p>
      {hint && <p className="text-[11px] text-fin-mute mt-1.5">{hint}</p>}
    </GlassCard>
  )
}
