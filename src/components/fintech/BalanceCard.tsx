'use client'

import {
  Eye,
  EyeOff,
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
  Loader2,
  Building2,
  Smartphone,
} from 'lucide-react'
import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { formatFcfa, formatPct } from '@/lib/utils'

type WithdrawalMethod = 'mobile_money' | 'bank_transfer'

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

  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdrawal, setShowWithdrawal] = useState(false)

  const [amount, setAmount] = useState('')
  const [withdrawalMethod, setWithdrawalMethod] =
    useState<WithdrawalMethod>('mobile_money')

  const [provider, setProvider] = useState('')
  const [account, setAccount] = useState('')
  const [name, setName] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const positive = portfolioChangePct >= 0

  function openDeposit() {
    setError('')
    setMessage('')
    setShowWithdrawal(false)
    setShowDeposit(true)
  }

  function openWithdrawal() {
    setError('')
    setMessage('')
    setShowDeposit(false)
    setShowWithdrawal(true)
  }

  function closeModal() {
    if (loading) return

    setShowDeposit(false)
    setShowWithdrawal(false)
    setError('')
    setMessage('')
  }

  async function submitWithdrawal(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')
    setMessage('')

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Veuillez saisir un montant valide.')
      return
    }

    if (numericAmount > balance) {
      setError('Le montant dépasse votre solde disponible.')
      return
    }

    if (!provider || !account || !name) {
      setError('Veuillez compléter toutes les informations.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/transactions/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: numericAmount,
          withdrawalMethod,
          withdrawalProvider: provider,
          withdrawalAccount: account,
          withdrawalName: name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error || "Impossible d'envoyer la demande."
        )
      }

      setMessage(
        data?.message ||
          'Votre demande de retrait a été envoyée.'
      )

      setAmount('')
      setProvider('')
      setAccount('')
      setName('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <GlassCard
        className="relative overflow-hidden border border-slate-200 bg-white shadow-md"
        hover={false}
      >
        {/* Décorations bleu nuit + or */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4A72C]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#061B31]/10 blur-3xl" />

        <div className="relative z-10">

          {/* En-tête */}
          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#061B31] text-[#D4A72C] shadow-lg shadow-[#061B31]/20">
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

          {/* Grande carte de valeur */}
          <div className="relative mt-7 overflow-hidden rounded-[28px] bg-[#061B31] p-6 text-white shadow-xl shadow-[#061B31]/20">

            {/* Décorations or */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A72C]/20 blur-2xl" />

            <div className="pointer-events-none absolute bottom-0 right-16 h-16 w-16 rounded-full bg-white/10 blur-xl" />

            <div className="relative z-10">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D4A72C]">
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-[#D4A72C]/20"
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
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                      positive
                        ? 'bg-emerald-400/15 text-emerald-200'
                        : 'bg-red-400/15 text-red-200'
                    }`}
                  >

                    {positive ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}

                    {formatPct(portfolioChangePct)}

                  </div>

                  <span className="text-xs text-slate-300">
                    performance du portefeuille
                  </span>

                </div>
              )}

            </div>
          </div>

          {/* Solde disponible */}
          <div className="mt-5 rounded-2xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-4">

            <div className="flex items-center justify-between">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A77C12]">
                Solde disponible
              </p>

              <span className="h-2 w-2 rounded-full bg-[#D4A72C]" />

            </div>

            <p className="mt-2 text-xl font-bold tracking-tight text-[#061B31]">

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

            {/* Actions */}
            {!hidden && (
              <div className="mt-4 grid grid-cols-2 gap-3">

                {/* Déposer */}
                <button
                  type="button"
                  onClick={openDeposit}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#D4A72C] px-4 py-3 text-sm font-bold text-[#061B31] transition hover:bg-[#B88C20] active:scale-[0.98]"
                >
                  <ArrowDownToLine size={17} />
                  Déposer
                </button>

                {/* Retirer */}
                <button
                  type="button"
                  onClick={openWithdrawal}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#061B31] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0B2945] active:scale-[0.98]"
                >
                  <ArrowUpFromLine size={17} />
                  Retirer
                </button>

              </div>
            )}

          </div>

          {/* Évolution */}
          <div className="mt-3 rounded-2xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A77C12]">
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
      </GlassCard>

      {/* =====================================================
          MODALE
          ===================================================== */}

      {(showDeposit || showWithdrawal) && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#061B31]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">

          <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-[28px]">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A77C12]">
                  {showDeposit
                    ? 'Alimentation du compte'
                    : 'Retrait de fonds'}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#061B31]">
                  {showDeposit
                    ? 'Effectuer un dépôt'
                    : 'Demander un retrait'}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={19} />
              </button>

            </div>

            {/* DÉPÔT */}
            {showDeposit && (
              <div className="mt-6">

                <div className="rounded-2xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-5">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061B31] text-[#D4A72C]">
                    <Wallet size={20} />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#061B31]">
                    Contactez votre gestionnaire
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Pour effectuer un dépôt sur votre compte,
                    veuillez contacter votre gestionnaire afin
                    d'obtenir les instructions de paiement
                    sécurisées correspondant à votre compte.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 w-full rounded-xl bg-[#061B31] px-4 py-3 font-bold text-white transition hover:bg-[#0B2945]"
                >
                  Compris
                </button>

              </div>
            )}

            {/* RETRAIT */}
            {showWithdrawal && (
              <form
                onSubmit={submitWithdrawal}
                className="mt-6 space-y-5"
              >

                {message && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {!message && (
                  <>
                    {/* Montant */}
                    <div>

                      <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Montant du retrait
                      </label>

                      <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-[#D4A72C] focus-within:ring-2 focus-within:ring-[#D4A72C]/20">

                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={amount}
                          onChange={(e) =>
                            setAmount(e.target.value)
                          }
                          placeholder="Ex. 100000"
                          className="w-full bg-transparent py-3 text-base font-semibold text-[#061B31] outline-none"
                        />

                        <span className="text-sm font-bold text-slate-400">
                          FCFA
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Solde disponible :{' '}
                        {formatFcfa(balance)}
                      </p>

                    </div>

                    {/* Mode */}
                    <div>

                      <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Mode de retrait
                      </label>

                      <div className="mt-2 grid grid-cols-2 gap-3">

                        <button
                          type="button"
                          onClick={() => {
                            setWithdrawalMethod(
                              'mobile_money'
                            )
                            setProvider('')
                          }}
                          className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                            withdrawalMethod ===
                            'mobile_money'
                              ? 'border-[#D4A72C] bg-[#FFFBF0] text-[#061B31]'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <Smartphone size={22} />

                          <span className="text-sm font-bold">
                            Mobile Money
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setWithdrawalMethod(
                              'bank_transfer'
                            )
                            setProvider('')
                          }}
                          className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                            withdrawalMethod ===
                            'bank_transfer'
                              ? 'border-[#D4A72C] bg-[#FFFBF0] text-[#061B31]'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <Building2 size={22} />

                          <span className="text-sm font-bold">
                            Virement bancaire
                          </span>
                        </button>

                      </div>

                    </div>

                    {/* Fournisseur / Banque */}
                    <div>

                      <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        {withdrawalMethod ===
                        'mobile_money'
                          ? 'Opérateur Mobile Money'
                          : 'Banque'}
                      </label>

                      <select
                        value={provider}
                        onChange={(e) =>
                          setProvider(e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#061B31] outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
                      >
                        <option value="">
                          Sélectionner
                        </option>

                        {withdrawalMethod ===
                        'mobile_money' ? (
                          <>
                            <option value="Orange Money">
                              Orange Money
                            </option>
                            <option value="MTN Mobile Money">
                              MTN Mobile Money
                            </option>
                            <option value="Moov Money">
                              Moov Money
                            </option>
                            <option value="Wave">
                              Wave
                            </option>
                            <option value="Free Money">
                              Free Money
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="NSIA Banque">
                              NSIA Banque
                            </option>
                            <option value="Coris Bank">
                              Coris Bank
                            </option>
                            <option value="SGCI">
                              Société Générale
                            </option>
                            <option value="UBA">
                              UBA
                            </option>
                            <option value="BOA">
                              Bank of Africa
                            </option>
                            <option value="Ecobank">
                              Ecobank
                            </option>
                            <option value="BICICI">
                              BICICI
                            </option>
                            <option value="Orabank">
                              Orabank
                            </option>
                          </>
                        )}
                      </select>

                    </div>

                    {/* Compte / numéro */}
                    <div>

                      <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        {withdrawalMethod ===
                        'mobile_money'
                          ? 'Numéro Mobile Money'
                          : 'Numéro de compte bancaire'}
                      </label>

                      <input
                        type="text"
                        value={account}
                        onChange={(e) =>
                          setAccount(e.target.value)
                        }
                        placeholder={
                          withdrawalMethod ===
                          'mobile_money'
                            ? 'Ex. 07 XX XX XX XX'
                            : 'Numéro de compte'
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#061B31] outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
                      />

                    </div>

                    {/* Titulaire */}
                    <div>

                      <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Nom du titulaire
                      </label>

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Nom complet du titulaire"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#061B31] outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
                      />

                    </div>

                    {/* Information */}
                    <div className="rounded-xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-3 text-xs leading-relaxed text-[#8A6815]">
                      Votre demande sera vérifiée par notre
                      équipe avant traitement. Le montant ne
                      sera pas débité de votre solde avant
                      validation de la demande.
                    </div>

                    {/* Bouton */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#061B31] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#061B31]/20 transition hover:bg-[#0B2945] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <ArrowUpFromLine size={18} />
                          Envoyer la demande
                        </>
                      )}
                    </button>

                  </>
                )}

                {message && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full rounded-xl bg-[#061B31] px-4 py-3 font-bold text-white transition hover:bg-[#0B2945]"
                  >
                    Fermer
                  </button>
                )}

              </form>
            )}

          </div>
        </div>
      )}
    </>
  )
}