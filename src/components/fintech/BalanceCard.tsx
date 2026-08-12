'use client'

import {
  Eye,
  EyeOff,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { formatFcfa, formatPct } from '@/lib/utils'

export function BalanceCard({
  accountLabel = 'Compte',
  accountId,
  balance,
  portfolioValue,
  portfolioChangePct = 0,
  status = 'ACTIF',
}: {
  accountLabel?: string
  accountId?: string
  balance: number
  portfolioValue: number
  portfolioChangePct?: number
  status?: string
}) {
  const [hidden, setHidden] = useState(false)

  const positive = portfolioChangePct >= 0

  return (
    <GlassCard
      className="relative overflow-hidden border-0 bg-white shadow-md"
      hover={false}
    >
      {/* Décorations */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Wallet size={21} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Portefeuille
              </p>

              <p className="mt-1 text-base font-bold tracking-tight text-slate-900">
                {accountLabel}
              </p>

              {accountId && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {accountId}
                </p>
              )}
            </div>
          </div>

          <StatusBadge status="success">
            {status}
          </StatusBadge>
        </div>

        {/* Grande carte de valeur */}
        <div className="relative mt-7 overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-6 text-white shadow-xl shadow-blue-600/20">
          {/* Accent orange */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 right-16 h-16 w-16 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Valeur actuelle
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  {hidden ? (
                    '••••••••'
                  ) : (
                    <AnimatedNumber
                      value={portfolioValue}
                      formatter={(n) => formatFcfa(Math.round(n))}
                    />
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHidden((value) => !value)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
                aria-label={
                  hidden
                    ? 'Afficher les montants'
                    : 'Masquer les montants'
                }
              >
                {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!hidden && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                    positive
                      ? 'bg-emerald-400/15 text-emerald-100'
                      : 'bg-red-400/15 text-red-100'
                  }`}
                >
                  {positive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}

                  {formatPct(portfolioChangePct)}
                </div>

                <span className="text-xs text-blue-100">
                  performance du portefeuille
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Indicateurs secondaires */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Solde disponible */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Solde disponible
              </p>

              <span className="h-2 w-2 rounded-full bg-orange-500" />
            </div>

            <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
              {hidden ? (
                '••••••••'
              ) : (
                <AnimatedNumber
                  value={balance}
                  formatter={(n) => formatFcfa(Math.round(n))}
                />
              )}
            </p>
          </div>

          {/* Évolution */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600">
              Évolution
            </p>

            <div className="mt-2 flex items-center gap-2">
              {positive ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                  <TrendingUp
                    size={17}
                    className="text-emerald-600"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50">
                  <TrendingDown
                    size={17}
                    className="text-red-600"
                  />
                </div>
              )}

              <p
                className={`text-xl font-bold ${
                  positive
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {hidden
                  ? '••••'
                  : formatPct(portfolioChangePct)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}