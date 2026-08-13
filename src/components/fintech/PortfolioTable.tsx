'use client'

import Link from 'next/link'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  cn,
  formatFcfa,
  formatPct,
  initialsFromTitle,
  tickerFromTitle,
} from '@/lib/utils'

export type HoldingRow = {
  id: string
  title: string
  symbol?: string
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
    <GlassCard
      padding="none"
      hover={false}
      className="overflow-hidden border border-slate-200 bg-white shadow-sm"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Portefeuille
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
        >
          Voir tout
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-[0.16em] text-slate-400">
              <th className="px-5 py-3.5 font-bold">
                Valeur
              </th>

              <th className="px-3 py-3.5 font-bold">
                Quantité
              </th>

              <th className="px-3 py-3.5 font-bold">
                Cours
              </th>

              <th className="px-5 py-3.5 text-right font-bold">
                Variation
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-14 text-center"
                >
                  <div className="mx-auto flex max-w-xs flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      📊
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      Aucune position ouverte
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Vos investissements apparaîtront ici.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const change = row.changePct ?? 0
                const positive = change >= 0

                return (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition-colors hover:bg-blue-50/30"
                  >
                    {/* Valeur */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[10px] font-bold text-blue-600">
                          {initialsFromTitle(row.title)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900">
                            {row.symbol || tickerFromTitle(row.title)}
                          </p>

                          <p className="mt-0.5 max-w-[180px] truncate text-[11px] text-slate-500">
                            {row.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Quantité */}
                    <td className="px-3 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {row.quantity.toLocaleString('fr-FR')}
                      </p>
                    </td>

                    {/* Cours */}
                    <td className="px-3 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {row.price.toLocaleString('fr-FR')}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        FCFA
                      </p>
                    </td>

                    {/* Variation */}
                    <td className="px-5 py-4 text-right">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold',
                          positive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-red-50 text-red-600'
                        )}
                      >
                        {positive ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}

                        {formatPct(change)}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {rows.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3">
          <p className="text-[11px] text-slate-500">
            {rows.length}{' '}
            {rows.length > 1
              ? 'positions dans votre portefeuille'
              : 'position dans votre portefeuille'}
          </p>
        </div>
      )}
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
    <GlassCard
      padding="sm"
      className="flex flex-col gap-4 border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-xs font-bold text-blue-600">
          {initialsFromTitle(title)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            {ticker || tickerFromTitle(title)}
          </p>

          <p className="truncate text-[11px] text-slate-500">
            {title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Parts
          </p>

          <p className="mt-1 font-bold text-slate-900">
            {shares.toLocaleString('fr-FR')}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Cours
          </p>

          <p className="mt-1 font-bold text-slate-900">
            {price.toLocaleString('fr-FR')}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50/60 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Valeur
          </p>

          <p className="mt-1 font-bold text-slate-900">
            {formatFcfa(value ?? shares * price)}
          </p>
        </div>

        <div
          className={cn(
            'rounded-xl p-3',
            positive ? 'bg-emerald-50' : 'bg-red-50'
          )}
        >
          <p
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider',
              positive ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            Variation
          </p>

          <p
            className={cn(
              'mt-1 font-bold',
              positive ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {formatPct(changePct)}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}