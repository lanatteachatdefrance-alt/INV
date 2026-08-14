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
  Wallet,
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

type OrderResult = {
  error?: string
  success?: boolean
}

type InvestmentCardProps = {
  offer: InvestmentOffer
  userBalance: number
  isKycValid: boolean

  ownedShares: number

  onBuy: (
    offerId: string,
    shares: number
  ) => Promise<OrderResult | void>

  onSell: (
    offerId: string,
    shares: number
  ) => Promise<OrderResult | void>
}

export function InvestmentCard({
  offer,
  userBalance,
  isKycValid,
  ownedShares,
  onBuy,
  onSell,
}: InvestmentCardProps) {
  const [shares, setShares] = useState(1)
  const [sellShares, setSellShares] = useState(1)

  const [pending, setPending] = useState(false)
  const [sellPending, setSellPending] = useState(false)

  const [success, setSuccess] = useState(false)
  const [sellSuccess, setSellSuccess] = useState(false)

  const [error, setError] = useState('')
  const [sellError, setSellError] = useState('')

  const [showDetails, setShowDetails] =
    useState(false)

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

  // =====================================================
  // ACHAT
  // =====================================================

  const total = shares * price

  const canAfford =
    userBalance >= total

  const meetsMinimum =
    minimumInvestment <= 0 ||
    total >= minimumInvestment

  // =====================================================
  // VENTE
  // =====================================================

  const sellTotal =
    sellShares * price

  const canSell =
    ownedShares > 0 &&
    sellShares >= 1 &&
    sellShares <= ownedShares &&
    price > 0

  // =====================================================
  // ACHETER
  // =====================================================

  const submit = async () => {
    setError('')

    if (!isKycValid) {
      setError(
        'KYC requis avant d’investir.'
      )
      return
    }

    if (price <= 0) {
      setError(
        'Le cours de cette valeur est actuellement indisponible.'
      )
      return
    }

    if (!meetsMinimum) {
      setError(
        `Le montant minimum requis est de ${formatFcfa(
          minimumInvestment
        )}.`
      )
      return
    }

    if (!canAfford) {
      setError('Fonds insuffisants.')
      return
    }

    setPending(true)

    try {
      const result =
        await onBuy(
          offer.id,
          shares
        )

      if (
        result &&
        'error' in result &&
        result.error
      ) {
        setError(result.error)
        return
      }

      setSuccess(true)

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

  // =====================================================
  // VENDRE
  // =====================================================

  const submitSell = async () => {
    setSellError('')

    if (!isKycValid) {
      setSellError(
        'KYC requis avant toute opération.'
      )
      return
    }

    if (ownedShares <= 0) {
      setSellError(
        'Vous ne possédez aucune action de cette valeur.'
      )
      return
    }

    if (
      !Number.isInteger(sellShares) ||
      sellShares < 1
    ) {
      setSellError(
        'Le nombre d’actions à vendre est invalide.'
      )
      return
    }

    if (sellShares > ownedShares) {
      setSellError(
        `Vous ne pouvez vendre que ${ownedShares.toLocaleString(
          'fr-FR'
        )} action(s).`
      )
      return
    }

    if (price <= 0) {
      setSellError(
        'Le cours actuel est indisponible.'
      )
      return
    }

    setSellPending(true)

    try {
      const result =
        await onSell(
          offer.id,
          sellShares
        )

      if (
        result &&
        'error' in result &&
        result.error
      ) {
        setSellError(result.error)
        return
      }

      setSellSuccess(true)

      setTimeout(() => {
        setSellSuccess(false)
        setSellShares(1)
      }, 3000)

    } catch {
      setSellError(
        'Une erreur est survenue lors de la création de la vente.'
      )
    } finally {
      setSellPending(false)
    }
  }

  return (
    <GlassCard
      className="relative overflow-hidden flex flex-col gap-4"
      hover={false}
    >

      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />

      {/* EN-TÊTE */}

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

      {/* COURS + TOTAL */}

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

      {/* POSSESSION */}

      {ownedShares > 0 && (

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <Wallet
                size={16}
                className="text-blue-600"
              />

              <span className="text-xs font-semibold text-blue-700">
                Vos actions
              </span>

            </div>

            <span className="font-bold text-blue-900">
              {ownedShares.toLocaleString(
                'fr-FR'
              )}
            </span>

          </div>

          <p className="mt-1 text-[11px] text-blue-600">
            Valeur actuelle :{' '}
            {formatFcfa(
              ownedShares * price
            )}
          </p>

        </div>

      )}

      {/* DÉTAILS */}

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

      {/* =====================================================
          ACHAT
      ===================================================== */}

      <div>

        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Nombre de titres à acheter
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
            disabled={pending || sellPending}
            className="!px-3"
          >
            −
          </SecondaryButton>

          <input
            type="number"
            min={1}
            value={shares}
            disabled={pending || sellPending}
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
            disabled={pending || sellPending}
            className="!px-3"
          >
            +
          </SecondaryButton>

        </div>

      </div>

      {/* INFORMATIONS ACHAT */}

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
            {formatFcfa(userBalance)}
          </span>

        </div>

      </div>

      {/* =====================================================
          VENTE
      ===================================================== */}

      {ownedShares > 0 && (

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 space-y-3">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                Vente
              </p>

              <p className="mt-1 text-[11px] text-orange-600">
                Vos actions seront débitées après validation administrative.
              </p>
            </div>

            <span className="text-xs font-bold text-orange-800">
              {ownedShares} disponible
              {ownedShares > 1 ? 's' : ''}
            </span>

          </div>

          <div>

            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Nombre de titres à vendre
            </p>

            <div className="flex items-center gap-2">

              <SecondaryButton
                type="button"
                size="sm"
                onClick={() =>
                  setSellShares(
                    (current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                  )
                }
                disabled={
                  pending ||
                  sellPending
                }
                className="!px-3"
              >
                −
              </SecondaryButton>

              <input
                type="number"
                min={1}
                max={ownedShares}
                value={sellShares}
                disabled={
                  pending ||
                  sellPending
                }
                onChange={(event) => {

                  const value =
                    parseInt(
                      event.target.value ||
                        '1',
                      10
                    )

                  setSellShares(
                    Math.min(
                      ownedShares,
                      Math.max(
                        1,
                        Number.isNaN(
                          value
                        )
                          ? 1
                          : value
                      )
                    )
                  )

                }}
                className="fin-input text-center font-bold !py-2.5"
              />

              <SecondaryButton
                type="button"
                size="sm"
                onClick={() =>
                  setSellShares(
                    (current) =>
                      Math.min(
                        ownedShares,
                        current + 1
                      )
                  )
                }
                disabled={
                  pending ||
                  sellPending
                }
                className="!px-3"
              >
                +
              </SecondaryButton>

            </div>

          </div>

          <div className="rounded-xl border border-orange-200 bg-white p-3">

            <div className="flex items-center justify-between">

              <span className="text-xs text-slate-500">
                Valeur de la vente
              </span>

              <span className="font-bold text-orange-700">
                {formatFcfa(sellTotal)}
              </span>

            </div>

            <p className="mt-1 text-[10px] text-slate-400">
              Calculée au cours actuel de{' '}
              {formatFcfa(price)} par action.
            </p>

          </div>

          {sellError && (

            <p className="text-xs text-fin-danger flex items-center gap-1.5 bg-fin-danger/10 border border-fin-danger/20 rounded-xl px-3 py-2">

              <AlertCircle size={14} />

              {sellError}

            </p>

          )}

          {sellSuccess && (

            <p className="text-xs text-fin-success flex items-center gap-1.5 bg-fin-success/10 border border-fin-success/20 rounded-xl px-3 py-2">

              <CheckCircle size={14} />

              Demande de vente enregistrée — en attente de validation.

            </p>

          )}

          <SecondaryButton
            type="button"
            fullWidth
            disabled={
              sellPending ||
              sellSuccess ||
              !canSell
            }
            onClick={submitSell}
            className="!border-orange-300 !text-orange-700 hover:!bg-orange-100"
          >

            {sellPending ? (

              <Loader2
                className="animate-spin"
                size={16}
              />

            ) : (

              <TrendingDown
                size={16}
              />

            )}

            {sellPending
              ? 'Traitement…'
              : 'Vendre'}

          </SecondaryButton>

        </div>

      )}

      {/* KYC */}

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
              Votre compte doit être validé avant de pouvoir investir sur le marché.
            </p>

          </div>

        </div>
      )}

      {/* ERREUR ACHAT */}

      {error && (

        <p className="text-xs text-fin-danger flex items-center gap-1.5 bg-fin-danger/10 border border-fin-danger/20 rounded-xl px-3 py-2">

          <AlertCircle size={14} />

          {error}

        </p>

      )}

      {/* SUCCÈS ACHAT */}

      {success && (

        <p className="text-xs text-fin-success flex items-center gap-1.5 bg-fin-success/10 border border-fin-success/20 rounded-xl px-3 py-2">

          <CheckCircle size={14} />

          Ordre enregistré — en attente de validation

        </p>

      )}

      {/* ACHETER */}

      <PrimaryButton
        type="button"
        fullWidth
        disabled={
          pending ||
          sellPending ||
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