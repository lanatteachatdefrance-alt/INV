'use client'

import { useState } from 'react'
import {
  Loader2,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/GlassCard'
import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/Buttons'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  cn,
  formatFcfa,
  tickerFromTitle,
} from '@/lib/utils'

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

  /*
   * L'achat transmet maintenant :
   * - l'identifiant de l'offre
   * - le nombre de titres
   *
   * L'ordre sera ensuite créé côté serveur
   * avec le statut "pending".
   */
  onBuy: (
    offerId: string,
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
  const [showDetails, setShowDetails] = useState(false)

  // =========================
  // DONNÉES
  // =========================

  const price = Number(
    offer.price_per_share ?? 0
  )

  const roi = Number(
    offer.roi_percentage ?? 0
  )

  const minimumInvestment = Number(
    offer.minimum_investment ?? 0
  )

  const symbol =
    offer.symbol?.trim() ||
    tickerFromTitle(offer.title)

  const companyName =
    offer.company_name?.trim() ||
    offer.title

  const productType =
    offer.type?.trim() ||
    'Action'

  const isBond =
    productType.toLowerCase() ===
    'obligation'

  // =========================
  // CALCULS
  // =========================

  const total =
    shares * price

  const canAfford =
    userBalance >= total

  const meetsMinimum =
    minimumInvestment <= 0 ||
    total >= minimumInvestment

  // =========================
  // ACHAT
  // =========================

  const submit = async () => {
    setError('')

    // =========================
    // KYC
    // =========================

    if (!isKycValid) {
      setError(
        'KYC requis avant d’investir.'
      )
      return
    }

    // =========================
    // COURS
    // =========================

    if (price <= 0) {
      setError(
        'Le cours de cette valeur est actuellement indisponible.'
      )
      return
    }

    // =========================
    // MINIMUM
    // =========================

    if (!meetsMinimum) {
      setError(
        `Le montant minimum requis est de ${formatFcfa(
          minimumInvestment
        )}.`
      )
      return
    }

    // =========================
    // SOLDE
    // =========================

    if (!canAfford) {
      setError(
        'Fonds insuffisants.'
      )
      return
    }

    // =========================
    // TRAITEMENT
    // =========================

    setPending(true)

    try {
      /*
       * On transmet maintenant l'ID
       * de la valeur ainsi que la quantité.
       *
       * L'ID permettra au serveur de
       * récupérer le cours directement
       * depuis Supabase.
       */

      const result =
        await onBuy(
          offer.id,
          shares
        )

      // =========================
      // ERREUR SERVEUR
      // =========================

      if (
        result &&
        'error' in result &&
        result.error
      ) {
        setError(result.error)
        return
      }

      // =========================
      // SUCCÈS
      // =========================

      setSuccess(true)

      /*
       * L'ordre n'est pas encore
       * considéré comme exécuté.
       *
       * Il est envoyé à
       * l'administrateur pour validation.
       */

      setTimeout(() => {
        setSuccess(false)
        setShares(1)
      }, 3000)

    } catch {
      setError(
        'Une erreur est survenue lors du traitement de l’ordre.'
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <GlassCard
      className="relative overflow-hidden flex flex-col gap-4"
      hover={false}
    >

      {/* =========================
          DÉCORATION
      ========================== */}

      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />

      {/* =========================
          EN-TÊTE
      ========================== */}

      <div className="flex items-start justify-between gap-3 relative">

        <div className="min-w-0">

          <StatusBadge
            status={
              isBond
                ? 'warning'
                : 'info'
            }
          >
            {productType}
          </StatusBadge>

          <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
            {companyName}
          </h3>

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

      {/* =========================
          COURS + TOTAL
      ========================== */}

      <div className="grid grid-cols-2 gap-3 text-sm">

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

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">

          <p className="text-[10px] text-fin-mute uppercase tracking-wider mb-1">
            Total
          </p>

          <p className="font-bold text-slate-900">
            {formatFcfa(total)}
          </p>

        </div>

      </div>

      {/* =========================
          BOUTON DÉTAILS
      ========================== */}

      <button
        type="button"
        onClick={() =>
          setShowDetails(
            (current) => !current
          )
        }
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >

        {showDetails ? (
          <>
            Masquer les détails
            <ChevronUp size={16} />
          </>
        ) : (
          <>
            Voir les détails
            <ChevronDown size={16} />
          </>
        )}

      </button>

      {/* =========================
          FICHE DÉTAILLÉE
      ========================== */}

      {showDetails && (

        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-4">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Informations sur la valeur
            </p>

            <h4 className="mt-1 text-sm font-bold text-slate-900">
              {companyName}
            </h4>

          </div>

          {/* Informations */}

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-white border border-slate-200 p-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Symbole
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {symbol}
              </p>

            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Type
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {productType}
              </p>

            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Cours
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {price > 0
                  ? `${price.toLocaleString(
                      'fr-FR'
                    )} FCFA`
                  : 'Indisponible'}
              </p>

            </div>

            <div className="rounded-xl bg-white border border-slate-200 p-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Rendement
              </p>

              <p
                className={cn(
                  'mt-1 font-bold',
                  roi >= 0
                    ? 'text-fin-success'
                    : 'text-fin-danger'
                )}
              >
                {roi.toLocaleString(
                  'fr-FR',
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                %
              </p>

            </div>

          </div>

          {/* Description */}

          {offer.description && (

            <div className="rounded-xl bg-white border border-slate-200 p-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {offer.description}
              </p>

            </div>

          )}

          {/* Minimum */}

          {minimumInvestment > 0 && (

            <div className="rounded-xl bg-white border border-slate-200 p-3">

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Investissement minimum
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {formatFcfa(
                  minimumInvestment
                )}
              </p>

            </div>

          )}

        </div>
      )}

      {/* =========================
          QUANTITÉ
      ========================== */}

      <div>

        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Nombre de titres
        </p>

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

              const value =
                parseInt(
                  event.target.value ||
                    '1',
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

      </div>

      {/* =========================
          INFORMATIONS ACHAT
      ========================== */}

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">

        <div className="flex items-center justify-between gap-3">

          <span className="text-xs text-slate-500">
            Montant de l'ordre
          </span>

          <span className="font-bold text-slate-900">
            {formatFcfa(total)}
          </span>

        </div>

        <div className="flex items-center justify-between gap-3 mt-2">

          <span className="text-xs text-slate-500">
            Solde disponible
          </span>

          <span
            className={cn(
              'text-xs font-bold',
              canAfford
                ? 'text-fin-success'
                : 'text-fin-danger'
            )}
          >
            {formatFcfa(
              userBalance
            )}
          </span>

        </div>

      </div>

      {/* =========================
          KYC
      ========================== */}

      {!isKycValid && (

        <div className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-3">

          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-orange-600"
          />

          <div>

            <p className="text-xs font-bold text-orange-700">
              KYC requis
            </p>

            <p className="mt-0.5 text-[11px] leading-relaxed text-orange-600">
              Votre compte doit être validé avant
              de pouvoir investir sur le marché.
            </p>

          </div>

        </div>
      )}

      {/* =========================
          ERREUR
      ========================== */}

      {error && (

        <p className="text-xs text-fin-danger flex items-center gap-1.5 bg-fin-danger/10 border border-fin-danger/20 rounded-xl px-3 py-2">

          <AlertCircle size={14} />

          {error}

        </p>
      )}

      {/* =========================
          SUCCÈS
      ========================== */}

      {success && (

        <p className="text-xs text-fin-success flex items-center gap-1.5 bg-fin-success/10 border border-fin-success/20 rounded-xl px-3 py-2">

          <CheckCircle size={14} />

          Ordre enregistré — en attente de validation

        </p>
      )}

      {/* =========================
          ACHETER
      ========================== */}

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