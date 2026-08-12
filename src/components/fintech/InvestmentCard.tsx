'use client'

import { useState } from 'react'
import {
  Loader2,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/GlassCard'
import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/Buttons'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn, formatFcfa, tickerFromTitle } from '@/lib/utils'

type InvestmentOffer = {
  id: string
  title: string
  symbol?: string | null
  description?: string | null
  type?: string | null

  roi_percentage?: number | string | null

  price_per_share: number | string | null

  minimum_investment?: number | string | null

  company_name?: string | null
}

type InvestmentCardProps = {
  offer: InvestmentOffer
  userBalance: number
  isKycValid: boolean
  onBuy: (
    shares: number
  ) => Promise<{ error?: string } | void>
}

export function InvestmentCard({
  offer,
  userBalance,
  isKycValid,
  onBuy,
}: InvestmentCardProps) {
  const [shares, setShares] = useState(1)
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  /*
   * ============================
   * DONNÉES DE L'OFFRE
   * ============================
   */

  const price = Number(
    offer.price_per_share ?? 0
  )

  const roi = Number(
    offer.roi_percentage ?? 0
  )

  const minimumInvestment = Number(
    offer.minimum_investment ?? 0
  )

  /*
   * Le symbole vient directement de Supabase.
   *
   * Si symbol est vide, on utilise le ticker
   * calculé à partir du titre comme solution de secours.
   */
  const symbol =
    offer.symbol?.trim() ||
    tickerFromTitle(offer.title)

  /*
   * Nom affiché
   */
  const companyName =
    offer.company_name?.trim() ||
    offer.title

  /*
   * Type de produit
   */
  const isBond =
    offer.type?.toLowerCase() === 'obligation'

  const productType =
    offer.type ||
    'Action'

  /*
   * ============================
   * CALCUL
   * ============================
   */

  const total =
    shares * price

  const canAfford =
    userBalance >= total

  const meetsMinimum =
    minimumInvestment <= 0 ||
    total >= minimumInvestment

  /*
   * ============================
   * ACHAT
   * ============================
   */

  const submit = async () => {
    setError('')

    /*
     * KYC obligatoire
     */
    if (!isKycValid) {
      setError(
        'KYC requis avant d’investir.'
      )
      return
    }

    /*
     * Vérification du cours
     */
    if (price <= 0) {
      setError(
        'Le cours de cette valeur est actuellement indisponible.'
      )
      return
    }

    /*
     * Vérification du minimum
     */
    if (!meetsMinimum) {
      setError(
        `Le montant minimum requis est de ${formatFcfa(
          minimumInvestment
        )}.`
      )
      return
    }

    /*
     * Vérification du solde
     */
    if (!canAfford) {
      setError(
        'Fonds insuffisants.'
      )
      return
    }

    setPending(true)

    try {
      const result = await onBuy(shares)

      if (
        result &&
        'error' in result &&
        result.error
      ) {
        setError(result.error)
        return
      }

      /*
       * Succès
       */
      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
        setShares(1)
      }, 2200)
    } catch {
      setError(
        'Une erreur est survenue lors du traitement de l’ordre.'
      )
    } finally {
      setPending(false)
    }
  }

  /*
   * ============================
   * AFFICHAGE
   * ============================
   */

  return (
    <GlassCard
      className="relative overflow-hidden flex flex-col gap-4"
      hover={false}
    >

      {/* Décoration */}

      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />


      {/* ============================
          EN-TÊTE
      ============================ */}

      <div className="flex items-start justify-between gap-3 relative">

        <div className="min-w-0">

          {/* Type */}

          <StatusBadge
            status={
              isBond
                ? 'warning'
                : 'info'
            }
          >
            {productType}
          </StatusBadge>


          {/* Nom */}

          <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
            {companyName}
          </h3>


          {/* SYMBOLE SUPABASE */}

          <p className="text-[11px] text-fin-mute mt-1 font-bold uppercase tracking-wider">
            {symbol}
          </p>

        </div>


        {/* Rendement */}

        <div className="text-right shrink-0">

          <p
            className={cn(
              'font-bold text-lg inline-flex items-center gap-1',
              roi >= 0
                ? 'text-fin-success'
                : 'text-fin-danger'
            )}
          >

            {roi >= 0 ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}

            {roi.toLocaleString(
              'fr-FR',
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }
            )}
            %

          </p>

          <p className="text-[10px] text-fin-mute uppercase tracking-wider">
            Rendement
          </p>

        </div>

      </div>


      {/* ============================
          DESCRIPTION
      ============================ */}

      {offer.description && (
        <p className="text-xs text-fin-mute leading-relaxed line-clamp-2">
          {offer.description}
        </p>
      )}


      {/* ============================
          INFORMATIONS
      ============================ */}

      <div className="grid grid-cols-2 gap-3 text-sm">

        {/* Cours */}

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">

          <p className="text-[10px] text-fin-mute uppercase tracking-wider mb-1">
            Cours
          </p>

          <p className="font-bold text-slate-900">

            {price > 0
              ? `${price.toLocaleString(
                  'fr-FR'
                )} FCFA`
              : 'Indisponible'}

          </p>

        </div>


        {/* Total */}

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">

          <p className="text-[10px] text-fin-mute uppercase tracking-wider mb-1">
            Total
          </p>

          <p className="font-bold text-slate-900">
            {formatFcfa(total)}
          </p>

        </div>

      </div>


      {/* Minimum */}

      {minimumInvestment > 0 && (
        <p className="text-[11px] text-fin-mute">
          Minimum :
          {' '}
          <span className="font-semibold text-slate-700">
            {formatFcfa(
              minimumInvestment
            )}
          </span>
        </p>
      )}


      {/* ============================
          QUANTITÉ
      ============================ */}

      <div className="flex items-center gap-2">

        <SecondaryButton
          type="button"
          size="sm"
          onClick={() =>
            setShares(
              (current) =>
                Math.max(
                  1,
                  current - 1
                )
            )
          }
          disabled={pending}
          className="!px-3"
        >
          −
        </SecondaryButton>


        <input
          type="number"
          min={1}
          value={shares}
          disabled={pending}
          onChange={(event) => {
            const value = parseInt(
              event.target.value || '1',
              10
            )

            setShares(
              Math.max(
                1,
                Number.isNaN(value)
                  ? 1
                  : value
              )
            )
          }}
          className="fin-input text-center font-bold !py-2.5"
        />


        <SecondaryButton
          type="button"
          size="sm"
          onClick={() =>
            setShares(
              (current) =>
                current + 1
            )
          }
          disabled={pending}
          className="!px-3"
        >
          +
        </SecondaryButton>

      </div>


      {/* ============================
          ERREUR
      ============================ */}

      {error && (

        <p className="text-xs text-fin-danger flex items-center gap-1.5 bg-fin-danger/10 border border-fin-danger/20 rounded-xl px-3 py-2">

          <AlertCircle size={14} />

          {error}

        </p>

      )}


      {/* ============================
          SUCCÈS
      ============================ */}

      {success && (

        <p className="text-xs text-fin-success flex items-center gap-1.5 bg-fin-success/10 border border-fin-success/20 rounded-xl px-3 py-2">

          <CheckCircle size={14} />

          Ordre exécuté

        </p>

      )}


      {/* ============================
          ACHETER
      ============================ */}

      <PrimaryButton
        type="button"
        fullWidth
        disabled={
          pending ||
          success ||
          price <= 0
        }
        onClick={submit}
        className={cn(
          !canAfford &&
            isKycValid &&
            price > 0 &&
            'opacity-80'
        )}
      >

        {pending ? (

          <Loader2
            className="animate-spin"
            size={16}
          />

        ) : (

          <ShoppingCart
            size={16}
          />

        )}

        {pending
          ? 'Traitement…'
          : 'Acheter'}

      </PrimaryButton>

    </GlassCard>
  )
}