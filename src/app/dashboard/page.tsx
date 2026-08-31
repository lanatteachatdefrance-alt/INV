import { redirect } from 'next/navigation'
import { BalanceCard } from '@/components/fintech/BalanceCard'
import { PortfolioTable } from '@/components/fintech/PortfolioTable'
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
  company_name: string | null
  symbol: string | null
  dividend_per_share: number | string | null
  ex_date: string | null
  payment_date: string | null
}

type DividendPaymentRow = {
  id: string
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

// =======================================================
// FORMAT FCFA
// Exemple : 1250000 → 1 250 000 FCFA
// =======================================================

function formatFcfa(value: number | string | null | undefined) {
  const amount = Number(value) || 0

  return (
    new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount) + ' FCFA'
  )
}

// =======================================================
// FORMAT NOMBRE
// =======================================================

function formatNumber(value: number | string | null | undefined) {
  const number = Number(value) || 0

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
  }).format(number)
}

// =======================================================
// FORMAT DATE
// =======================================================

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

// =======================================================
// DASHBOARD DATA
// =======================================================

async function getDashboardData() {
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
  // PROFIL + INVESTISSEMENTS + DIVIDENDES
  // =====================================================

  const [
    { data: profile, error: profileError },

    { data: investments, error: investmentsError },

    { data: dividendPayments, error: dividendPaymentsError },
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
    // INVESTISSEMENTS
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
    // DIVIDENDES DE L'UTILISATEUR
    // ---------------------------------------------------

    supabase
      .from('dividend_payments')
      .select(
        `
          id,
          shares_eligible,
          amount,
          status,
          paid_at,
          created_at,
          dividends (
            company_name,
            symbol,
            dividend_per_share,
            ex_date,
            payment_date
          )
        `
      )
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      }),
  ])

  // =====================================================
  // ERREURS
  // =====================================================

  if (profileError || !profile) {
    throw new Error(
      profileError?.message ??
        'Profil utilisateur introuvable'
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

  // =====================================================
  // POSITIONS
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

      // -------------------------------------------------
      // DONNÉES
      // -------------------------------------------------

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

      // -------------------------------------------------
      // VALEUR ACTUELLE
      // -------------------------------------------------

      const value =
        price > 0 &&
        quantity > 0
          ? price * quantity
          : invested

      // -------------------------------------------------
      // PERFORMANCE
      // -------------------------------------------------

      const changePct =
        invested > 0
          ? (
              (
                value -
                invested
              ) /
              invested
            ) * 100
          : 0

      // -------------------------------------------------
      // RETOUR
      // -------------------------------------------------

      return {
        id: row.id,

        title:
          offer?.title ??
          'Valeur',

        symbol:
          offer?.symbol?.trim() ||
          null,

        quantity,

        price,

        value,

        changePct,
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
  // VALEUR TOTALE DU PORTEFEUILLE
  // =====================================================

  const totalPortfolioValue =
    rows.reduce(
      (
        sum,
        row
      ) =>
        sum +
        Number(
          row.value || 0
        ),
      0
    )

  // =====================================================
  // TOTAL INVESTI
  // =====================================================

  const totalInvested =
    (
      investments || []
    ).reduce(
      (
        sum,
        row: InvestmentRow
      ) =>
        sum +
        (
          Number(
            row.amount_invested
          ) || 0
        ),
      0
    )

  // =====================================================
  // PERFORMANCE DU PORTEFEUILLE
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
  // DIVIDENDES
  // =====================================================

  const dividendRows = (
    dividendPayments || []
  ).map(
    (payment: DividendPaymentRow) => {

      const dividend =
        Array.isArray(
          payment.dividends
        )
          ? payment.dividends[0]
          : payment.dividends

      return {
        id: payment.id,

        companyName:
          dividend?.company_name ??
          'Entreprise',

        symbol:
          dividend?.symbol?.trim() ||
          null,

        shares:
          Number(
            payment.shares_eligible
          ) || 0,

        dividendPerShare:
          Number(
            dividend?.dividend_per_share
          ) || 0,

        amount:
          Number(
            payment.amount
          ) || 0,

        status:
          payment.status ??
          'pending',

        paidAt:
          payment.paid_at,

        createdAt:
          payment.created_at,

        paymentDate:
          dividend?.payment_date ??
          null,

        exDate:
          dividend?.ex_date ??
          null,
      }
    }
  )

  // =====================================================
  // TOTAL DIVIDENDES PAYÉS
  // =====================================================

  const totalDividendsPaid =
    dividendRows
      .filter(
        (row) =>
          row.status === 'paid'
      )
      .reduce(
        (sum, row) =>
          sum + row.amount,
        0
      )

  // =====================================================
  // TOTAL DIVIDENDES EN ATTENTE
  // =====================================================

  const totalDividendsPending =
    dividendRows
      .filter(
        (row) =>
          row.status === 'pending'
      )
      .reduce(
        (sum, row) =>
          sum + row.amount,
        0
      )

  // =====================================================
  // NOMBRE DE DIVIDENDES
  // =====================================================

  const paidDividendCount =
    dividendRows.filter(
      (row) =>
        row.status === 'paid'
    ).length

  const pendingDividendCount =
    dividendRows.filter(
      (row) =>
        row.status === 'pending'
    ).length

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

    portfolioChangePct,

    rows,

    totalInvested,

    dividendRows,

    totalDividendsPaid,

    totalDividendsPending,

    paidDividendCount,

    pendingDividendCount,
  }
}

// =======================================================
// PAGE DASHBOARD
// =======================================================

export default async function DashboardPage() {

  const {
    firstName,
    accountLabel,
    cashBalance,
    totalPortfolioValue,
    portfolioChangePct,
    rows,
    totalInvested,

    dividendRows,
    totalDividendsPaid,
    totalDividendsPending,
    paidDividendCount,
    pendingDividendCount,

  } =
    await getDashboardData()

  const positive =
    portfolioChangePct >= 0

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA]">

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        {/* ===================================================
            BIENVENUE
            =================================================== */}

        <section className="mb-6">

          <div className="flex items-end justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A77C12]">
                ESPACE INVESTISSEUR
              </p>

              <h1 className="mt-1.5 text-2xl font-black tracking-tight text-[#061B31] sm:text-3xl">
                Bonjour, {firstName} 👋
              </h1>

              <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
                Retrouvez ici votre portefeuille,
                vos performances et vos dividendes.
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            CARTE PRINCIPALE
            =================================================== */}

        <section className="mb-6">

          <BalanceCard
            accountLabel={accountLabel}
            balance={cashBalance}
            portfolioValue={totalPortfolioValue}
            portfolioChangePct={
              portfolioChangePct
            }
            status="ACTIF"
          />

        </section>

        {/* ===================================================
            RÉSUMÉ PORTEFEUILLE
            =================================================== */}

        <section className="mb-6">

          <div className="mb-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Vue d'ensemble
            </p>

            <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
              Votre portefeuille
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

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
                  tracking-tight
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

          </div>

        </section>

        {/* ===================================================
            DIVIDENDES
            =================================================== */}

        <section className="mb-6">

          <div className="mb-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A77C12]">
              Revenus
            </p>

            <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
              Vos dividendes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Suivez les dividendes générés par vos investissements.
            </p>

          </div>

          {/* -------------------------------------------------
              CARTES DIVIDENDES
              ------------------------------------------------- */}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

            {/* DIVIDENDES REÇUS */}

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
                Total des dividendes
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

        {/* ===================================================
            HISTORIQUE DES DIVIDENDES
            =================================================== */}

        <section className="mb-6">

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Historique
              </p>

              <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
                Dividendes
              </h2>

            </div>

            <div className="rounded-full border border-[#D4A72C]/20 bg-[#FFFBF0] px-3 py-1.5">

              <span className="text-[10px] font-bold text-[#A77C12]">
                {dividendRows.length}{' '}
                {dividendRows.length > 1
                  ? 'opérations'
                  : 'opération'}
              </span>

            </div>

          </div>

          {dividendRows.length === 0 ? (

            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFFBF0] text-lg font-black text-[#A77C12]">
                $
              </div>

              <h3 className="mt-4 text-sm font-black text-[#061B31]">
                Aucun dividende pour le moment
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                Lorsque des dividendes seront attribués
                à vos investissements, ils apparaîtront ici.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[760px] text-left">

                  <thead className="border-b border-slate-100 bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Entreprise
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Actions
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Dividende / action
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Montant
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Statut
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {dividendRows.map(
                      (dividend) => {

                        const isPaid =
                          dividend.status ===
                          'paid'

                        return (

                          <tr
                            key={
                              dividend.id
                            }
                            className="transition-colors hover:bg-slate-50/70"
                          >

                            {/* ENTREPRISE */}

                            <td className="px-5 py-4">

                              <div>

                                <p className="text-sm font-bold text-[#061B31]">
                                  {
                                    dividend.companyName
                                  }
                                </p>

                                {dividend.symbol && (

                                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {
                                      dividend.symbol
                                    }
                                  </p>

                                )}

                              </div>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-5 py-4 text-sm font-semibold text-[#061B31]">

                              {formatNumber(
                                dividend.shares
                              )}

                            </td>

                            {/* DIVIDENDE / ACTION */}

                            <td className="px-5 py-4 text-sm font-semibold text-[#061B31]">

                              {formatFcfa(
                                dividend.dividendPerShare
                              )}

                            </td>

                            {/* MONTANT */}

                            <td className="px-5 py-4">

                              <p className="text-sm font-black text-[#061B31]">
                                {formatFcfa(
                                  dividend.amount
                                )}
                              </p>

                            </td>

                            {/* STATUT */}

                            <td className="px-5 py-4">

                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[9px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  ${
                                    isPaid
                                      ? 'bg-emerald-50 text-emerald-600'
                                      : dividend.status ===
                                          'cancelled'
                                      ? 'bg-red-50 text-red-600'
                                      : 'bg-[#FFFBF0] text-[#A77C12]'
                                  }
                                `}
                              >

                                {isPaid
                                  ? 'Crédité'
                                  : dividend.status ===
                                      'cancelled'
                                  ? 'Annulé'
                                  : dividend.status ===
                                      'failed'
                                  ? 'Échec'
                                  : 'En attente'}

                              </span>

                            </td>

                            {/* DATE */}

                            <td className="px-5 py-4 text-xs font-medium text-slate-500">

                              {formatDate(
                                isPaid
                                  ? dividend.paidAt
                                  : dividend.paymentDate
                              )}

                            </td>

                          </tr>

                        )
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

        {/* ===================================================
            INFORMATIONS
            =================================================== */}

        <section className="mb-6">

          <div className="overflow-hidden rounded-3xl border border-[#D4A72C]/20 bg-[#061B31] p-5 text-white shadow-[0_12px_35px_rgba(6,27,49,0.10)] sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D4A72C] text-sm font-black text-[#061B31]">
                IB
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A72C]">
                  Suivi du portefeuille
                </p>

                <h2 className="mt-1 text-base font-bold">
                  Une vision claire de vos investissements
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6">
                  La valeur de votre portefeuille est calculée
                  à partir des investissements actifs et des
                  cours disponibles sur la plateforme. Les
                  dividendes sont affichés séparément et ne
                  modifient pas le calcul de la performance
                  de vos positions.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            POSITIONS
            =================================================== */}

        <section>

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Investissements
              </p>

              <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
                Positions actuelles
              </h2>

            </div>

            <div className="rounded-full border border-[#D4A72C]/20 bg-[#FFFBF0] px-3 py-1.5">

              <span className="text-[10px] font-bold text-[#A77C12]">
                {rows.length}{' '}

                {rows.length > 1
                  ? 'positions'
                  : 'position'}
              </span>

            </div>

          </div>

          <PortfolioTable
            rows={rows}
            title=""
          />

        </section>

      </div>

    </div>
  )
}