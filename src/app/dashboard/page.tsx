import { redirect } from 'next/navigation'
import { BalanceCard } from '@/components/fintech/BalanceCard'
import { PortfolioTable } from '@/components/fintech/PortfolioTable'
import { createClient } from '@/utils/supabase/server'
import { formatFcfa, formatPct } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type InvestmentRow = {
  id: string
  shares_bought: number | string | null
  amount_invested: number | string | null
  investment_offers:
    | {
        price_per_share: number | string | null
        title: string | null
      }
    | {
        price_per_share: number | string | null
        title: string | null
      }[]
    | null
}

async function getDashboardData() {
  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const [
    { data: profile, error: profileError },
    { data: investments, error: investmentsError },
  ] = await Promise.all([
    supabase
      .from('users')
      .select('balance, first_name, last_name')
      .eq('id', user.id)
      .single(),

    supabase
      .from('user_investments')
      .select(
        'id, shares_bought, amount_invested, investment_offers ( price_per_share, title )'
      )
      .eq('user_id', user.id)
      .eq('status', 'actif')
      .not('investment_offers', 'is', null)
      .gt('shares_bought', 0),
  ])

  if (profileError || !profile) {
    throw new Error(
      profileError?.message ?? 'Profil utilisateur introuvable'
    )
  }

  if (investmentsError) {
    throw new Error(investmentsError.message)
  }

  const rows = (investments || []).map((row: InvestmentRow) => {
    const offer = Array.isArray(row.investment_offers)
      ? row.investment_offers[0]
      : row.investment_offers

    const price = Number(offer?.price_per_share) || 0
    const quantity = Number(row.shares_bought) || 0
    const invested = Number(row.amount_invested) || 0

    const value =
      price > 0 && quantity > 0
        ? price * quantity
        : invested

    const changePct =
      invested > 0
        ? ((value - invested) / invested) * 100
        : 0

    return {
      id: row.id,
      title: offer?.title ?? 'Valeur',
      quantity,
      price,
      value,
      changePct,
    }
  })

  const cashBalance = Number(profile.balance) || 0

  const totalPortfolioValue = rows.reduce(
    (sum, row) => sum + Number(row.value || 0),
    0
  )

  const totalInvested = (investments || []).reduce(
    (sum, row: InvestmentRow) =>
      sum + (Number(row.amount_invested) || 0),
    0
  )

  const portfolioChangePct =
    totalInvested > 0
      ? ((totalPortfolioValue - totalInvested) / totalInvested) * 100
      : 0

  return {
    accountLabel:
      `${profile.first_name || 'Client'} ${profile.last_name || ''}`.trim() ||
      'Portefeuille',
    cashBalance,
    totalPortfolioValue,
    portfolioChangePct,
    rows,
    totalInvested,
  }
}

export default async function DashboardPage() {
  const {
    accountLabel,
    cashBalance,
    totalPortfolioValue,
    portfolioChangePct,
    rows,
    totalInvested,
  } = await getDashboardData()

  return (
    <div className="fin-page fin-section space-y-6">

      {/* =========================================================
          PORTEFEUILLE PRINCIPAL
      ========================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.8fr_1.2fr]">

        {/* Balance */}
        <BalanceCard
          accountLabel={accountLabel}
          balance={cashBalance}
          portfolioValue={totalPortfolioValue}
          portfolioChangePct={portfolioChangePct}
          status="ACTIF"
        />

        <div className="grid gap-6">

          {/* =====================================================
              RÉSUMÉ DU PORTEFEUILLE
          ====================================================== */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Résumé
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                  Portefeuille
                </h2>
              </div>

              <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">

              {/* Valeur totale */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                  Valeur totale
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  {formatFcfa(totalPortfolioValue)}
                </p>
              </div>

              {/* Investi */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Investi
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  {formatFcfa(totalInvested)}
                </p>
              </div>

              {/* Performance */}
              <div
                className={`rounded-2xl border p-4 ${
                  portfolioChangePct >= 0
                    ? 'border-emerald-100 bg-emerald-50/60'
                    : 'border-red-100 bg-red-50/60'
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    portfolioChangePct >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  Performance
                </p>

                <p
                  className={`mt-2 text-xl font-bold tracking-tight ${
                    portfolioChangePct >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatPct(portfolioChangePct)}
                </p>
              </div>

              {/* Solde disponible */}
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
                  Solde disponible
                </p>

                <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  {formatFcfa(cashBalance)}
                </p>
              </div>

            </div>
          </div>

          {/* =====================================================
              INFORMATIONS PORTEFEUILLE
          ====================================================== */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-5 shadow-sm">
            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                i
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Informations
                </p>

                <h2 className="mt-1 text-base font-bold text-slate-900">
                  Suivi de votre portefeuille
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Les valeurs affichées sont calculées à partir des cours
                  actuels des actions détenues et du solde disponible réel
                  de votre compte.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* =========================================================
          POSITIONS ACTUELLES
      ========================================================== */}
      <PortfolioTable
        rows={rows}
        title="Positions actuelles"
      />

    </div>
  )
}