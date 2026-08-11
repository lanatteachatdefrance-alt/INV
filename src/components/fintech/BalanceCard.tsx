'use client'

import { Eye, EyeOff, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
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
      className="relative overflow-hidden border border-slate-200 bg-white shadow-sm"
      hover={false}
    >
      {/* Décoration */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-orange-100/50 blur-3xl" />

      <div className="relative z-10">

        {/* En-tête */}
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Wallet size={21} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Portefeuille
              </p>

              <p className="mt-1 text-base font-bold text-slate-900">
                {accountLabel}
              </p>

              {accountId && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {accountId}
                </p>
              )}
            </div>

          </div>

          <StatusBadge status="success">
            {status}
          </StatusBadge>

        </div>

        {/* Valeur du portefeuille */}
        <div className="relative mt-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-100">
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
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              aria-label={hidden ? 'Afficher les montants' : 'Masquer les montants'}
            >
              {hidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>

          {!hidden && (
            <div className="mt-4 flex items-center gap-2">

              <div
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${
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

        {/* Informations complémentaires */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* Solde disponible */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Solde disponible
              </p>

              <div className="h-2 w-2 rounded-full bg-orange-500" />

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

          {/* Performance */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">

            <p className="text-xs font-medium uppercase tracking-[0.12em] text-orange-700">
              Évolution
            </p>

            <div className="mt-2 flex items-center gap-2">

              {positive ? (
                <TrendingUp
                  size={19}
                  className="text-emerald-600"
                />
              ) : (
                <TrendingDown
                  size={19}
                  className="text-red-600"
                />
              )}

              <p
                className={`text-xl font-bold ${
                  positive
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {hidden ? '••••' : formatPct(portfolioChangePct)}
              </p>

            </div>

          </div>

        </div>

      </div>
    </GlassCard>
  )
}