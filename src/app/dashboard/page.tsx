import { redirect } from 'next/navigation'
import { BalanceCard } from '@/components/fintech/BalanceCard'
import { PortfolioTable } from '@/components/fintech/PortfolioTable'
import { createClient } from '@/utils/supabase/server'
import { formatFcfa, formatPct } from '@/lib/utils'

export const dynamic = 'force-dynamic'

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
  // PROFIL + INVESTISSEMENTS
  // =====================================================

  const [
    { data: profile, error: profileError },
    { data: investments, error: investmentsError },
  ] = await Promise.all([
    supabase
      .from('users')
      .select(
        'balance, first_name, last_name'
      )
      .eq('id', user.id)
      .single(),

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
  ])

  // =====================================================
  // ERREURS
  // =====================================================

  if (
    profileError ||
    !profile
  ) {
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

        /*
         * IMPORTANT :
         * On utilise maintenant le vrai
         * symbole provenant de Supabase.
         *
         * Aucun tickerFromTitle()
         * Aucun initialsFromTitle()
         */
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
  } =
    await getDashboardData()

  const positive =
    portfolioChangePct >= 0

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA]">

      {/* =====================================================
          CONTENU
          ===================================================== */}

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
                Retrouvez ici votre portefeuille et le suivi de vos investissements.
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
            RÉSUMÉ
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
                  cours disponibles sur la plateforme.
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