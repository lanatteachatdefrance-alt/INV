'use client'

import { useState } from 'react'
import { Loader2, ShoppingCart, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn, formatFcfa, tickerFromTitle } from '@/lib/utils'

export function InvestmentCard({
  offer,
  userBalance,
  isKycValid,
  onBuy,
}: {
  offer: {
    id: string
    title: string
    description?: string
    type?: string
    roi_percentage?: number
    price_per_share: number
    minimum_investment?: number
  }
  userBalance: number
  isKycValid: boolean
  onBuy: (shares: number) => Promise<{ error?: string } | void>
}) {
  const [shares, setShares] = useState(1)
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const total = shares * offer.price_per_share
  const canAfford = userBalance >= total

  const submit = async () => {
    if (!isKycValid) {
      setError('KYC requis avant d’investir.')
      return
    }
    if (!canAfford) {
      setError('Fonds insuffisants.')
      return
    }
    setPending(true)
    setError('')
    const res = await onBuy(shares)
    setPending(false)
    if (res && 'error' in res && res.error) {
      setError(res.error)
      return
    }
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setShares(1)
    }, 2200)
  }

  return (
    <GlassCard className="relative overflow-hidden flex flex-col gap-4">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative">
        <div>
          <StatusBadge status={offer.type === 'Obligation' ? 'warning' : 'info'}>
            {offer.type || 'Action'}
          </StatusBadge>
          <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">{offer.title}</h3>
          <p className="text-[11px] text-fin-mute mt-1 font-medium">{tickerFromTitle(offer.title)}</p>
        </div>
        <div className="text-right">
          <p className="text-fin-success font-bold text-lg inline-flex items-center gap-1">
            {offer.roi_percentage ?? 0}% <TrendingUp size={14} />
          </p>
          <p className="text-[10px] text-fin-mute uppercase tracking-wider">Rendement</p>
        </div>
      </div>

      {offer.description && (
        <p className="text-xs text-fin-mute leading-relaxed line-clamp-2">{offer.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
          <p className="text-[10px] text-fin-mute uppercase tracking-wider mb-1">Cours</p>
          <p className="font-bold text-slate-900">{offer.price_per_share.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
          <p className="text-[10px] text-fin-mute uppercase tracking-wider mb-1">Total</p>
          <p className="font-bold text-slate-900">{formatFcfa(total)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SecondaryButton
          type="button"
          size="sm"
          onClick={() => setShares((s) => Math.max(1, s - 1))}
          className="!px-3"
        >
          −
        </SecondaryButton>
        <input
          type="number"
          min={1}
          value={shares}
          onChange={(e) => setShares(Math.max(1, parseInt(e.target.value || '1', 10)))}
          className="fin-input text-center font-bold !py-2.5"
        />
        <SecondaryButton
          type="button"
          size="sm"
          onClick={() => setShares((s) => s + 1)}
          className="!px-3"
        >
          +
        </SecondaryButton>
      </div>

      {error && (
        <p className="text-xs text-fin-danger flex items-center gap-1.5 bg-fin-danger/10 border border-fin-danger/20 rounded-xl px-3 py-2">
          <AlertCircle size={14} /> {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-fin-success flex items-center gap-1.5 bg-fin-success/10 border border-fin-success/20 rounded-xl px-3 py-2">
          <CheckCircle size={14} /> Ordre exécuté
        </p>
      )}

      <PrimaryButton
        type="button"
        fullWidth
        disabled={pending || success}
        onClick={submit}
        className={cn(!canAfford && isKycValid && 'opacity-80')}
      >
        {pending ? <Loader2 className="animate-spin" size={16} /> : <ShoppingCart size={16} />}
        {pending ? 'Traitement…' : 'Acheter'}
      </PrimaryButton>
    </GlassCard>
  )
}
