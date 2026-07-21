'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, formatFcfa, formatPct, initialsFromTitle, tickerFromTitle } from '@/lib/utils'

export type HoldingRow = {
  id: string
  title: string
  quantity: number
  price: number
  changePct?: number
  value?: number
}

export function PortfolioTable({
  rows,
  href = '/dashboard/investments',
  title = 'Mes valeurs',
}: {
  rows: HoldingRow[]
  href?: string
  title?: string
}) {
  return (
    <GlassCard padding="none" hover={false} className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-fin-primary hover:text-blue-400">
          Voir tout
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[480px]">
          <thead className="sticky top-0 bg-white backdrop-blur">
            <tr className="border-y border-slate-200 text-[11px] uppercase tracking-wider text-fin-mute">
              <th className="px-5 py-3 font-semibold">Valeur</th>
              <th className="px-3 py-3 font-semibold">Quantité</th>
              <th className="px-3 py-3 font-semibold">Cours</th>
              <th className="px-5 py-3 font-semibold text-right">Variation</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-fin-mute">
                  Aucune position ouverte.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const change = row.changePct ?? 0
                const positive = change >= 0
                return (
                  <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-fin-primary">
                          {initialsFromTitle(row.title)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{tickerFromTitle(row.title)}</p>
                          <p className="text-[11px] text-fin-mute truncate max-w-[140px]">{row.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-sm font-medium text-slate-900">{row.quantity}</td>
                    <td className="px-3 py-3.5 text-sm font-medium text-slate-900">
                      {row.price.toLocaleString('fr-FR')}
                    </td>
                    <td
                      className={cn(
                        'px-5 py-3.5 text-sm font-semibold text-right',
                        positive ? 'text-fin-success' : 'text-fin-danger'
                      )}
                    >
                      {formatPct(change)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

export function PortfolioCard({
  title,
  ticker,
  shares,
  price,
  changePct = 0,
  value,
}: {
  title: string
  ticker?: string
  shares: number
  price: number
  changePct?: number
  value?: number
}) {
  const positive = changePct >= 0
  return (
    <GlassCard padding="sm" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-fin-primary">
          {initialsFromTitle(title)}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-900 truncate">{ticker || tickerFromTitle(title)}</p>
          <p className="text-[11px] text-fin-mute truncate">{title}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[10px] text-fin-mute uppercase tracking-wider">Parts</p>
          <p className="font-semibold text-slate-900">{shares}</p>
        </div>
        <div>
          <p className="text-[10px] text-fin-mute uppercase tracking-wider">Cours</p>
          <p className="font-semibold text-slate-900">{price.toLocaleString('fr-FR')}</p>
        </div>
        <div>
          <p className="text-[10px] text-fin-mute uppercase tracking-wider">Valeur</p>
          <p className="font-semibold text-slate-900">{formatFcfa(value ?? shares * price)}</p>
        </div>
        <div>
          <p className="text-[10px] text-fin-mute uppercase tracking-wider">Var.</p>
          <p className={cn('font-semibold', positive ? 'text-fin-success' : 'text-fin-danger')}>
            {formatPct(changePct)}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
