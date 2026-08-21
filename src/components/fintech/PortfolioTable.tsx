'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/GlassCard'
import {
  cn,
  formatFcfa,
  formatPct,
} from '@/lib/utils'

export type HoldingRow = {
  id: string
  title: string
  symbol?: string | null
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
      {/* =====================================================
          EN-TÊTE
          ===================================================== */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            Portefeuille
          </p>

          {title && (
            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#14283B]">
              {title}
            </h2>
          )}
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-xl bg-[#EEF3F8] px-3.5 py-2.5 text-xs font-bold text-[#14283B] transition hover:bg-[#E5EBF1]"
        >
          Voir tout
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* =====================================================
          TABLEAU
          ===================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full text-left">

          {/* =================================================
              HEADER
              ================================================= */}

          <thead>
            <tr className="border-b border-slate-200 bg-[#F8FAFC] text-[10px] uppercase tracking-[0.16em] text-slate-500">

              <th className="px-5 py-3.5 font-bold">
                Valeur
              </th>

              <th className="px-3 py-3.5 text-right font-bold">
                Quantité
              </th>

              <th className="hidden px-3 py-3.5 font-bold md:table-cell">
                Cours
              </th>

              <th className="hidden px-5 py-3.5 text-right font-bold md:table-cell">
                Variation
              </th>

            </tr>
          </thead>

          {/* =================================================
              POSITIONS
              ================================================= */}

          <tbody>

            {rows.length === 0 ? (

              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-14 text-center"
                >
                  <div className="mx-auto flex max-w-xs flex-col items-center">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3F8] text-[#14283B]">
                      📊
                    </div>

                    <p className="text-sm font-semibold text-[#14283B]">
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

                const change =
                  Number(row.changePct ?? 0)

                const positive =
                  change >= 0

                const symbol =
                  row.symbol?.trim() || '—'

                return (

                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition-colors hover:bg-[#F8FAFC]"
                  >

                    {/* =====================================
                        VALEUR
                        ===================================== */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        {/* SYMBOLE */}

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border-[5px]
                            border-[#E9EDF0]
                            bg-[#14283B]
                            text-[9px]
                            font-black
                            tracking-tight
                            text-[#D6A62C]
                            shadow-sm
                          "
                        >
                          {symbol}
                        </div>

                        {/* INFORMATIONS */}

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#14283B]">
                            {row.title}
                          </p>

                          {/* VRAI SYMBOLE */}

                          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#D6A62C]">
                            {symbol}
                          </p>

                          {/* PERFORMANCE MOBILE */}

                          <span
                            className={cn(
                              'mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold md:hidden',
                              positive
                                ? 'text-[#2E9B63]'
                                : 'text-[#C94B4B]'
                            )}
                          >
                            {positive ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )}

                            {formatPct(change)}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* =====================================
                        QUANTITÉ
                        ===================================== */}

                    <td className="px-3 py-4 text-right">

                      <p className="text-sm font-bold text-[#14283B] sm:text-base">
                        {row.quantity.toLocaleString(
                          'fr-FR'
                        )}
                      </p>

                    </td>

                    {/* =====================================
                        COURS
                        ===================================== */}

                    <td className="hidden px-3 py-4 md:table-cell">

                      <p className="text-sm font-semibold text-[#14283B]">
                        {row.price.toLocaleString(
                          'fr-FR'
                        )}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        FCFA
                      </p>

                    </td>

                    {/* =====================================
                        VARIATION
                        ===================================== */}

                    <td className="hidden px-5 py-4 text-right md:table-cell">

                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold',

                          positive
                            ? 'bg-[#E9F6EF] text-[#2E9B63]'
                            : 'bg-[#FBEEEE] text-[#C94B4B]'
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

      {/* =====================================================
          FOOTER
          ===================================================== */}

      {rows.length > 0 && (

        <div className="border-t border-slate-200 bg-[#F8FAFC] px-5 py-3">

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


/* ===========================================================
   PORTFOLIO CARD
   =========================================================== */

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

  const positive =
    changePct >= 0

  const symbol =
    ticker?.trim() || '—'

  return (

    <GlassCard
      padding="sm"
      className="flex flex-col gap-4 border border-slate-200 bg-white shadow-sm"
    >

      {/* EN-TÊTE */}

      <div className="flex items-center gap-3">

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            border-[5px]
            border-[#E9EDF0]
            bg-[#14283B]
            text-[9px]
            font-black
            text-[#D6A62C]
          "
        >
          {symbol}
        </div>

        <div className="min-w-0">

          <p className="truncate text-sm font-bold text-[#14283B]">
            {title}
          </p>

          <p className="truncate text-[11px] font-semibold uppercase text-[#D6A62C]">
            {symbol}
          </p>

        </div>

      </div>

      {/* INFORMATIONS */}

      <div className="grid grid-cols-2 gap-3 text-sm">

        <div className="rounded-xl bg-[#F8FAFC] p-3">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Parts
          </p>

          <p className="mt-1 font-bold text-[#14283B]">
            {shares.toLocaleString('fr-FR')}
          </p>

        </div>

        <div className="rounded-xl bg-[#F8FAFC] p-3">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Cours
          </p>

          <p className="mt-1 font-bold text-[#14283B]">
            {price.toLocaleString('fr-FR')}
          </p>

        </div>

        <div className="rounded-xl bg-[#EEF3F8] p-3">

          <p className="text-[10px] font-bold uppercase tracking-wider text-[#14283B]">
            Valeur
          </p>

          <p className="mt-1 font-bold text-[#14283B]">
            {formatFcfa(
              value ?? shares * price
            )}
          </p>

        </div>

        <div
          className={cn(
            'rounded-xl p-3',
            positive
              ? 'bg-[#E9F6EF]'
              : 'bg-[#FBEEEE]'
          )}
        >

          <p
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider',
              positive
                ? 'text-[#2E9B63]'
                : 'text-[#C94B4B]'
            )}
          >
            Variation
          </p>

          <p
            className={cn(
              'mt-1 font-bold',
              positive
                ? 'text-[#2E9B63]'
                : 'text-[#C94B4B]'
            )}
          >
            {formatPct(changePct)}
          </p>

        </div>

      </div>

    </GlassCard>

  )
}