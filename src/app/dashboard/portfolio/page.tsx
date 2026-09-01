import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { formatPct } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// =======================================================
// TYPES
// =======================================================

type InvestmentOfferRelation = {
  price_per_share: number | string | null
  title: string | null
  symbol: string | null
}

type InvestmentRow = {
  id: string
  shares_bought: number | string | null
  amount_invested: number | string | null

  investment_offers:
    | InvestmentOfferRelation
    | InvestmentOfferRelation[]
    | null
}

type DividendRelation = {
  id?: string
  company_name: string | null
  symbol: string | null
  dividend_per_share: number | string | null
  ex_date: string | null
  payment_date: string | null
  status?: string | null
}

type DividendPaymentRow = {
  id: string
  dividend_id?: string | null

  shares_eligible: number | string | null
  amount: number | string | null
  status: string | null
  paid_at: string | null
  created_at: string | null

  dividends:
    | DividendRelation
    | DividendRelation[]
    | null
}

type DividendDatabaseRow = {
  id: string
  company_name: string | null
  symbol: string | null
  dividend_per_share: number | string | null
  ex_date: string | null
  payment_date: string | null
  status: string | null
}

type CompanyHolding = {
  title: string
  symbol: string
  shares: number
}

// =======================================================
// FORMAT FCFA
// =======================================================

function formatFcfa(
  value: number | string | null | undefined
) {
  const amount = Number(value) || 0

  const formatted =
    new Intl.NumberFormat('fr-FR', {
      useGrouping: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace(/\u202F/g, ' ')
      .replace(/\u00A0/g, ' ')

  return `${formatted} FCFA`
}

// =======================================================
// FORMAT NOMBRE
// =======================================================

function formatNumber(
  value: number | string | null | undefined
) {
  const number = Number(value) || 0

  return new Intl.NumberFormat('fr-FR', {
    useGrouping: true,
    maximumFractionDigits: 2,
  })
    .format(number)
    .replace(/\u202F/g, ' ')
    .replace(/\u00A0/g, ' ')
}

// =======================================================
// FORMAT SYMBOLE
// =======================================================

function normalizeSymbol(
  value: string | null | undefined
) {
  return (
    value
      ?.trim()
      .toUpperCase()
      .replace(/\s+/g, '') || ''
  )
}

// =======================================================
// DONNÉES PORTEFEUILLE
// =======================================================

async function getPortfolioData() {
  const supabase = createClient()

  // =====================================================
  // UTILISATEUR
  // =====================================================

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  // =====================================================
  // RÉCUPÉRATION
  // =====================================================

  const [
    { data: profile, error: profileError },

    { data: investments, error: investmentsError },

    { data: dividendPayments, error: dividendPaymentsError },

    { data: dividends, error: dividendsError },
  ] = await Promise.all([
    // ---------------------------------------------------
    // PROFIL
    // ---------------------------------------------------

    supabase
      .from('users')
      .select(
        'balance, first_name, last_name'
      )
      .eq('id', user.id)
      .single(),

    // ---------------------------------------------------
    // INVESTISSEMENTS ACTIFS
    // ---------------------------------------------------

    supabase
      .from('user_investments')
      .select(
        `
          id,
          shares_bought,
          amount_invested,
          investment_offers (
            price_per_share,
            title,
            symbol
          )
        `
      )
      .eq('user_id', user.id)
      .eq('status', 'actif')
      .not(
        'investment_offers',
        'is',
        null
      )
      .gt(
        'shares_bought',
        0
      ),

    // ---------------------------------------------------
    // PAIEMENTS DIVIDENDES
    // ---------------------------------------------------

    supabase
      .from('dividend_payments')
      .select(
        `
          id,
          dividend_id,
          shares_eligible,
          amount,
          status,
          paid_at,
          created_at,
          dividends (
            id,
            company_name,
            symbol,
            dividend_per_share,
            ex_date,
            payment_date,
            status
          )
        `
      )
      .eq(
        'user_id',
        user.id
      )
      .order(
        'created_at',
        {
          ascending: false,
        }
      ),

    // ---------------------------------------------------
    // DIVIDENDES
    // ---------------------------------------------------

    supabase
      .from('dividends')
      .select(
        `
          id,
          company_name,
          symbol,
          dividend_per_share,
          ex_date,
          payment_date,
          status
        `
      )
      .order(
        'payment_date',
        {
          ascending: false,
        }
      ),
  ])

  // =====================================================
  // ERREURS
  // =====================================================

  if (profileError || !profile) {
    throw new Error(
      profileError?.message ??
        'Profil utilisateur introuvable.'
    )
  }

  if (investmentsError) {
    throw new Error(
      investmentsError.message
    )
  }

  if (dividendPaymentsError) {
    throw new Error(
      dividendPaymentsError.message
    )
  }

  if (dividendsError) {
    throw new Error(
      dividendsError.message
    )
  }

  // =====================================================
  // POSITIONS INTERNES
  //
  // Elles servent uniquement aux calculs.
  // Elles ne seront PAS affichées comme positions.
  // =====================================================

  const rows = (
    investments || []
  ).map(
    (row: InvestmentRow) => {

      const offer =
        Array.isArray(
          row.investment_offers
        )
          ? row.investment_offers[0]
          : row.investment_offers

      const price =
        Number(
          offer?.price_per_share
        ) || 0

      const quantity =
        Number(
          row.shares_bought
        ) || 0

      const invested =
        Number(
          row.amount_invested
        ) || 0

      const value =
        price > 0 &&
        quantity > 0
          ? price * quantity
          : invested

      return {
        title:
          offer?.title ??
          'Valeur',

        symbol:
          offer?.symbol?.trim() ||
          null,

        quantity,

        value,

        invested,
      }
    }
  )

  // =====================================================
  // SOLDE DISPONIBLE
  // =====================================================

  const cashBalance =
    Number(
      profile.balance
    ) || 0

  // =====================================================
  // VALEUR TOTALE
  // =====================================================

  const totalPortfolioValue =
    rows.reduce(
      (
        sum,
        row
      ) =>
        sum +
        row.value,
      0
    )

  // =====================================================
  // TOTAL INVESTI
  // =====================================================

  const totalInvested =
    rows.reduce(
      (
        sum,
        row
      ) =>
        sum +
        row.invested,
      0
    )

  // =====================================================
  // PERFORMANCE FCFA
  // =====================================================

  const portfolioChangeAmount =
    totalPortfolioValue -
    totalInvested

  // =====================================================
  // PERFORMANCE %
  // =====================================================

  const portfolioChangePct =
    totalInvested > 0
      ? (
          (
            totalPortfolioValue -
            totalInvested
          ) /
          totalInvested
        ) * 100
      : 0

  // =====================================================
  // REGROUPEMENT DES ACTIONS PAR SOCIÉTÉ
  // =====================================================

  const companyMap =
    new Map<string, CompanyHolding>()

  for (const row of rows) {

    const symbol =
      normalizeSymbol(
        row.symbol
      )

    if (!symbol) {
      continue
    }

    const existing =
      companyMap.get(
        symbol
      )

    if (existing) {

      existing.shares +=
        row.quantity

    } else {

      companyMap.set(
        symbol,
        {
          title:
            row.title,

          symbol,

          shares:
            row.quantity,
        }
      )
    }
  }

  const companyHoldings =
    Array.from(
      companyMap.values()
    ).sort(
      (a, b) =>
        b.shares -
        a.shares
    )

  // =====================================================
  // DIVIDENDES EXISTANTS
  // =====================================================

  const existingPaymentRows =
    (
      dividendPayments || []
    ).map(
      (
        payment: DividendPaymentRow
      ) => {

        const dividend =
          Array.isArray(
            payment.dividends
          )
            ? payment.dividends[0]
            : payment.dividends

        return {
          id:
            payment.id,

          dividendId:
            payment.dividend_id ??
            dividend?.id ??
            null,

          shares:
            Number(
              payment.shares_eligible
            ) || 0,

          amount:
            Number(
              payment.amount
            ) || 0,

          status:
            payment.status ??
            'pending',
        }
      }
    )

  // =====================================================
  // DIVIDENDES DÉJÀ ATTRIBUÉS
  // =====================================================

  const existingDividendIds =
    new Set<string>()

  for (
    const payment
    of existingPaymentRows
  ) {

    if (
      payment.dividendId
    ) {
      existingDividendIds.add(
        payment.dividendId
      )
    }
  }

  // =====================================================
  // DIVIDENDES GÉNÉRÉS
  // =====================================================

  const generatedPendingRows =
    (
      dividends || []
    )
      .filter(
        (
          dividend: DividendDatabaseRow
        ) => {

          if (
            dividend.status ===
            'cancelled'
          ) {
            return false
          }

          if (
            existingDividendIds.has(
              dividend.id
            )
          ) {
            return false
          }

          const symbol =
            normalizeSymbol(
              dividend.symbol
            )

          if (!symbol) {
            return false
          }

          const company =
            companyMap.get(
              symbol
            )

          return Boolean(
            company &&
            company.shares > 0
          )
        }
      )
      .map(
        (
          dividend: DividendDatabaseRow
        ) => {

          const symbol =
            normalizeSymbol(
              dividend.symbol
            )

          const company =
            companyMap.get(
              symbol
            )

          const shares =
            company?.shares || 0

          const dividendPerShare =
            Number(
              dividend.dividend_per_share
            ) || 0

          return {
            amount:
              shares *
              dividendPerShare,

            status:
              'pending',
          }
        }
      )

  // =====================================================
  // DIVIDENDES PAYÉS
  // =====================================================

  const totalDividendsPaid =
    existingPaymentRows
      .filter(
        payment =>
          payment.status ===
          'paid'
      )
      .reduce(
        (
          sum,
          payment
        ) =>
          sum +
          payment.amount,
        0
      )

  // =====================================================
  // DIVIDENDES EN ATTENTE
  // =====================================================

  const existingPendingDividends =
    existingPaymentRows
      .filter(
        payment =>
          payment.status ===
          'pending'
      )
      .reduce(
        (
          sum,
          payment
        ) =>
          sum +
          payment.amount,
        0
      )

  const generatedPendingDividends =
    generatedPendingRows.reduce(
      (
        sum,
        payment
      ) =>
        sum +
        payment.amount,
      0
    )

  const totalDividendsPending =
    existingPendingDividends +
    generatedPendingDividends

  // =====================================================
  // NOMBRE DIVIDENDES
  // =====================================================

  const paidDividendCount =
    existingPaymentRows.filter(
      payment =>
        payment.status ===
        'paid'
    ).length

  const pendingDividendCount =
    existingPaymentRows.filter(
      payment =>
        payment.status ===
        'pending'
    ).length +
    generatedPendingRows.length

  // =====================================================
  // RETOUR
  // =====================================================

  return {
    firstName:
      profile.first_name?.trim() ||
      'Client',

    accountLabel:
      `${profile.first_name || 'Client'} ${
        profile.last_name || ''
      }`.trim() ||
      'Portefeuille',

    cashBalance,

    totalPortfolioValue,

    totalInvested,

    portfolioChangeAmount,

    portfolioChangePct,

    totalDividendsPaid,

    totalDividendsPending,

    paidDividendCount,

    pendingDividendCount,

    companyHoldings,
  }
}

// =======================================================
// PAGE PORTEFEUILLE
// =======================================================

export default async function PortfolioPage() {

  const {
    firstName,

    cashBalance,

    totalPortfolioValue,

    totalInvested,

    portfolioChangeAmount,

    portfolioChangePct,

    totalDividendsPaid,

    totalDividendsPending,

    paidDividendCount,

    pendingDividendCount,

    companyHoldings,

  } =
    await getPortfolioData()

  const positive =
    portfolioChangeAmount >= 0

  return (

    <div className="min-h-[100dvh] bg-[#F5F7FA]">

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        {/* =================================================
            EN-TÊTE
        ================================================= */}

        <section className="mb-7">

          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A77C12]">
            ESPACE INVESTISSEUR
          </p>

          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-[#061B31] sm:text-3xl">
            Mon portefeuille
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
            Bonjour {firstName}, retrouvez ici
            la synthèse de vos investissements.
          </p>

        </section>


        {/* =================================================
            SOLDES ET PERFORMANCE
        ================================================= */}

        <section className="mb-8">

          <div className="mb-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Synthèse
            </p>

            <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
              Vue financière
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            {/* SOLDE */}

            <div className="rounded-2xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A77C12]">
                Solde disponible
              </p>

              <p className="mt-2 text-lg font-black tracking-tight text-[#061B31] sm:text-xl">
                {formatFcfa(
                  cashBalance
                )}
              </p>

            </div>


            {/* VALEUR */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Valeur totale
              </p>

              <p className="mt-2 text-lg font-black tracking-tight text-[#061B31] sm:text-xl">
                {formatFcfa(
                  totalPortfolioValue
                )}
              </p>

            </div>


            {/* INVESTI */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Montant investi
              </p>

              <p className="mt-2 text-lg font-black tracking-tight text-[#061B31] sm:text-xl">
                {formatFcfa(
                  totalInvested
                )}
              </p>

            </div>


            {/* PERFORMANCE */}

            <div
              className={`
                rounded-2xl
                border
                p-4
                shadow-sm
                ${
                  positive
                    ? 'border-emerald-100 bg-emerald-50/70'
                    : 'border-red-100 bg-red-50/70'
                }
              `}
            >

              <p
                className={`
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  ${
                    positive
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }
                `}
              >
                Performance
              </p>

              <p
                className={`
                  mt-2
                  text-lg
                  font-black
                  leading-tight
                  tracking-tight
                  ${
                    positive
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }
                `}
              >
                {positive
                  ? '+'
                  : '−'}
                {formatFcfa(
                  Math.abs(
                    portfolioChangeAmount
                  )
                )}
              </p>

              <p
                className={`
                  mt-1
                  text-xs
                  font-bold
                  ${
                    positive
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }
                `}
              >
                {formatPct(
                  portfolioChangePct
                )}
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            DIVIDENDES
        ================================================= */}

        <section className="mb-8">

          <div className="mb-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A77C12]">
              Revenus
            </p>

            <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
              Dividendes
            </h2>

          </div>


          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

            {/* REÇUS */}

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                Dividendes reçus
              </p>

              <p className="mt-2 text-lg font-black tracking-tight text-emerald-700 sm:text-xl">
                {formatFcfa(
                  totalDividendsPaid
                )}
              </p>

              <p className="mt-1 text-[11px] text-emerald-700/70">
                {paidDividendCount}{' '}
                {paidDividendCount > 1
                  ? 'paiements'
                  : 'paiement'}
              </p>

            </div>


            {/* EN ATTENTE */}

            <div className="rounded-2xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A77C12]">
                Dividendes en attente
              </p>

              <p className="mt-2 text-lg font-black tracking-tight text-[#061B31] sm:text-xl">
                {formatFcfa(
                  totalDividendsPending
                )}
              </p>

              <p className="mt-1 text-[11px] text-[#A77C12]/70">
                {pendingDividendCount}{' '}
                {pendingDividendCount > 1
                  ? 'paiements'
                  : 'paiement'}
              </p>

            </div>


            {/* TOTAL */}

            <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Total dividendes
              </p>

              <p className="mt-2 text-lg font-black tracking-tight text-[#061B31] sm:text-xl">
                {formatFcfa(
                  totalDividendsPaid +
                  totalDividendsPending
                )}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                Reçus + en attente
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            TITRES DÉTENUS
        ================================================= */}

        <section>

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Composition
              </p>

              <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
                Mes titres
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Nombre total d'actions détenues par société.
              </p>

            </div>


            <div className="rounded-full border border-[#D4A72C]/20 bg-[#FFFBF0] px-3 py-1.5">

              <span className="text-[10px] font-bold text-[#A77C12]">
                {companyHoldings.length}{' '}
                {companyHoldings.length > 1
                  ? 'sociétés'
                  : 'société'}
              </span>

            </div>

          </div>


          {/* =================================================
              TABLEAU
          ================================================= */}

          {companyHoldings.length === 0 ? (

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFFBF0] text-lg font-black text-[#A77C12]">
                —
              </div>

              <h3 className="mt-4 text-sm font-black text-[#061B31]">
                Aucun titre détenu
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                Vos actions apparaîtront ici après
                la validation de vos investissements.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[600px] text-left">

                  <thead className="border-b border-slate-100 bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Société
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Symbole
                      </th>

                      <th className="px-5 py-4 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Actions détenues
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {companyHoldings.map(
                      (
                        company,
                        index
                      ) => (

                        <tr
                          key={
                            company.symbol
                          }
                          className="transition-colors hover:bg-slate-50/70"
                        >

                          {/* SOCIÉTÉ */}

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#061B31] text-xs font-black text-white">
                                {index + 1}
                              </div>

                              <div>

                                <p className="text-sm font-bold text-[#061B31]">
                                  {company.title}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  Position globale
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* SYMBOLE */}

                          <td className="px-5 py-5">

                            <span className="inline-flex rounded-full bg-[#FFFBF0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A77C12]">
                              {company.symbol}
                            </span>

                          </td>


                          {/* ACTIONS */}

                          <td className="px-5 py-5 text-right">

                            <p className="text-lg font-black text-[#061B31]">
                              {formatNumber(
                                company.shares
                              )}
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                              actions
                            </p>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            INFORMATION
        ================================================= */}

        <section className="mt-8">

          <div className="overflow-hidden rounded-3xl border border-[#D4A72C]/20 bg-[#061B31] p-5 text-white shadow-[0_12px_35px_rgba(6,27,49,0.10)] sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D4A72C] text-sm font-black text-[#061B31]">
                IB
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A72C]">
                  Mon portefeuille
                </p>

                <h2 className="mt-1 text-base font-bold">
                  Une vue simplifiée de vos titres
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6">
                  Cette page regroupe vos actions par
                  société. Le nombre affiché correspond au
                  total des actions actuellement détenues
                  dans votre portefeuille.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  )
}