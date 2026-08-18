'use client'

import {
  ArrowDownToLine,
  ArrowUpFromLine,
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
      className="
        relative
        overflow-hidden
        border-0
        bg-white
        shadow-[0_12px_40px_rgba(6,27,49,0.08)]
      "
      hover={false}
    >

      {/* =====================================================
          DÉCORATIONS
          ===================================================== */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#D4A72C]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#061B31]/10 blur-3xl" />

      <div className="relative z-10">

        {/* =====================================================
            EN-TÊTE
            ===================================================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[#061B31]
                text-[#D4A72C]
                shadow-[0_8px_20px_rgba(6,27,49,0.18)]
              "
            >
              <Wallet size={21} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Portefeuille
              </p>

              <p className="mt-1 text-base font-bold tracking-tight text-[#061B31]">
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

        {/* =====================================================
            VALEUR DU PORTEFEUILLE
            ===================================================== */}

        <div
          className="
            relative
            mt-7
            overflow-hidden
            rounded-[28px]
            bg-[#061B31]
            p-6
            text-white
            shadow-[0_18px_35px_rgba(6,27,49,0.18)]
          "
        >

          {/* Décor doré */}

          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#D4A72C]/20 blur-2xl" />

          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-24 rounded-full bg-[#D4A72C]/10 blur-2xl" />

          <div className="relative z-10">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                  Valeur actuelle
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">

                  {hidden ? (
                    '••••••••'
                  ) : (
                    <AnimatedNumber
                      value={portfolioValue}
                      formatter={(n) =>
                        formatFcfa(Math.round(n))
                      }
                    />
                  )}

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setHidden((value) => !value)
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  text-white/80
                  transition
                  hover:border-[#D4A72C]/30
                  hover:bg-[#D4A72C]/10
                  hover:text-[#D4A72C]
                "
                aria-label={
                  hidden
                    ? 'Afficher les montants'
                    : 'Masquer les montants'
                }
              >
                {hidden ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {!hidden && (
              <div className="mt-5 flex flex-wrap items-center gap-2">

                <div
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    ${
                      positive
                        ? 'bg-emerald-400/10 text-emerald-300'
                        : 'bg-red-400/10 text-red-300'
                    }
                  `}
                >

                  {positive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}

                  {formatPct(portfolioChangePct)}

                </div>

                <span className="text-xs text-white/45">
                  performance du portefeuille
                </span>

              </div>
            )}

          </div>

        </div>

        {/* =====================================================
            SOLDE DISPONIBLE
            ===================================================== */}

        <div
          className="
            mt-5
            rounded-[26px]
            border
            border-[#D4A72C]/20
            bg-[#FFFBF0]
            p-5
          "
        >

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A77C12]">
                Solde disponible
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-[#061B31]">

                {hidden ? (
                  '••••••••'
                ) : (
                  <AnimatedNumber
                    value={balance}
                    formatter={(n) =>
                      formatFcfa(Math.round(n))
                    }
                  />
                )}

              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A72C]/15 text-[#A77C12]">
              <Wallet size={18} />
            </div>

          </div>

          {/* ===================================================
              ACTIONS
              =================================================== */}

          <div className="mt-4 grid grid-cols-2 gap-3">

            {/* DÉPÔT */}

            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D4A72C]
                px-4
                py-3
                text-xs
                font-bold
                text-[#061B31]
                shadow-[0_6px_18px_rgba(212,167,44,0.20)]
                transition
                hover:bg-[#C39A25]
                active:scale-[0.98]
              "
            >

              <ArrowDownToLine size={16} />

              Déposer

            </button>

            {/* RETRAIT */}

            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#061B31]/15
                bg-white
                px-4
                py-3
                text-xs
                font-bold
                text-[#061B31]
                transition
                hover:border-[#D4A72C]
                hover:bg-[#FFFBF0]
                active:scale-[0.98]
              "
            >

              <ArrowUpFromLine size={16} />

              Retirer

            </button>

          </div>

        </div>

        {/* =====================================================
            ÉVOLUTION
            ===================================================== */}

        <div
          className="
            mt-4
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
          "
        >

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Évolution
          </p>

          <div className="mt-2 flex items-center gap-3">

            {positive ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <TrendingUp
                  size={17}
                  className="text-emerald-600"
                />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <TrendingDown
                  size={17}
                  className="text-red-600"
                />
              </div>
            )}

            <div>

              <p
                className={`
                  text-xl
                  font-bold
                  ${
                    positive
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }
                `}
              >
                {hidden
                  ? '••••'
                  : formatPct(portfolioChangePct)}
              </p>

              <p className="text-[10px] text-slate-400">
                Performance actuelle
              </p>

            </div>

          </div>

        </div>

      </div>

    </GlassCard>
  )
}