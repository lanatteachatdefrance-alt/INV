'use client'

import { Eye, EyeOff } from 'lucide-react'
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
    <GlassCard className="bg-card-shine relative overflow-hidden" hover={false}>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="text-fin-mute text-sm font-medium">{accountLabel}</p>
          {accountId && (
            <p className="text-slate-900 text-lg md:text-xl font-bold tracking-tight mt-0.5">{accountId}</p>
          )}
        </div>
        <StatusBadge status="success">{status}</StatusBadge>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-fin-mute text-xs font-medium">Solde du compte</p>
            <button
              type="button"
              onClick={() => setHidden((v) => !v)}
              className="text-fin-mute hover:text-slate-900 transition-colors"
              aria-label={hidden ? 'Afficher' : 'Masquer'}
            >
              {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            {hidden ? '••••••••' : (
              <AnimatedNumber
                value={balance}
                formatter={(n) => formatFcfa(Math.round(n))}
              />
            )}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-fin-mute text-xs font-medium mb-1.5">Valorisation du portefeuille</p>
          <div className="flex flex-wrap items-end gap-3">
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-fin-success">
              {hidden ? '••••••••' : (
                <AnimatedNumber
                  value={portfolioValue}
                  formatter={(n) => formatFcfa(Math.round(n))}
                />
              )}
            </p>
            {!hidden && (
              <span
                className={`text-sm font-semibold mb-1 ${
                  positive ? 'text-fin-success' : 'text-fin-danger'
                }`}
              >
                {formatPct(portfolioChangePct)}
              </span>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
