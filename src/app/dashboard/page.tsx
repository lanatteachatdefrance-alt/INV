import { redirect } from 'next/navigation'
import { BalanceCard } from '@/components/fintech/BalanceCard'
import { PortfolioTable } from '@/components/fintech/PortfolioTable'
import { createClient } from '@/utils/supabase/server'
import { formatFcfa, formatPct } from '@/lib/utils'

type InvestmentRow = {
  id: string
  shares_bought: number | string | null
  amount_invested: number | string | null
  investment_offers:
    | { price_per_share: number | string | null; title: string | null }
    | { price_per_share: number | string | null; title: string | null }[]
    | null
}

async function getDashboardData() {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  const [{ data: profile, error: profileError }, { data: investments, error: investmentsError }] = await Promise.all([
    supabase.from('users').select('balance, first_name, last_name').eq('id', user.id).single(),
    supabase
      .from('user_investments')
      .select('id, shares_bought, amount_invested, investment_offers ( price_per_share, title )')
      .eq('user_id', user.id)
      .eq('status', 'actif')
      .not('investment_offers', 'is', null)
      .gt('shares_bought', 0),
  ])

  if (profileError || !profile) {
    throw new Error(profileError?.message ?? 'Profil utilisateur introuvable')
  }

  if (investmentsError) {
    throw new Error(investmentsError.message)
  }

  const rows = (investments || []).map((row: InvestmentRow) => {
    const offer = Array.isArray(row.investment_offers) ? row.investment_offers[0] : row.investment_offers
    const price = parseFloat(String(offer?.price_per_share ?? '0')) || 0
    const quantity = parseFloat(String(row.shares_bought ?? '0')) || 0
    const invested = parseFloat(String(row.amount_invested ?? '0')) || 0
    const value = quantity * price
    const changePct = invested > 0 ? ((value - invested) / invested) * 100 : 0

    return {
      id: row.id,
      title: offer?.title ?? 'Valeur',
      quantity,
      price,
      value,
      changePct,
    }
  })

  const cashBalance = parseFloat(String(profile.balance ?? '0')) || 0
  const totalPortfolioValue = rows.reduce((sum, row) => sum + row.value, 0)
  const totalInvested = (investments || []).reduce(
    (sum, row: InvestmentRow) => sum + (parseFloat(String(row.amount_invested ?? '0')) || 0),
    0
  )
  const portfolioChangePct = totalInvested > 0 ? ((totalPortfolioValue - totalInvested) / totalInvested) * 100 : 0

  return {
    accountLabel: `${profile.first_name || 'Client'} ${profile.last_name || ''}`.trim() || 'Portefeuille',
    cashBalance,
    totalPortfolioValue,
    portfolioChangePct,
    rows,
    totalInvested,
  }
}

export default async function DashboardPage() {
  const { accountLabel, cashBalance, totalPortfolioValue, portfolioChangePct, rows, totalInvested } = await getDashboardData()

  return (
    <div className="fin-page fin-section space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1.2fr] gap-6">
        <BalanceCard
          accountLabel="Solde disponible"
          balance={cashBalance}
          portfolioValue={totalPortfolioValue}
          portfolioChangePct={portfolioChangePct}
          status="ACTIF"
        />

        <div className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-fin-mute uppercase tracking-[0.24em] mb-4">Résumé du portefeuille</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs text-fin-mute uppercase tracking-[0.24em] mb-2">Valeur totale</p>
                <p className="text-2xl font-semibold text-slate-900">{formatFcfa(totalPortfolioValue)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs text-fin-mute uppercase tracking-[0.24em] mb-2">Investi</p>
                <p className="text-2xl font-semibold text-slate-900">{formatFcfa(totalInvested)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs text-fin-mute uppercase tracking-[0.24em] mb-2">Performance</p>
                <p className="text-2xl font-semibold text-slate-900">{formatPct(portfolioChangePct)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs text-fin-mute uppercase tracking-[0.24em] mb-2">Solde cash</p>
                <p className="text-2xl font-semibold text-slate-900">{formatFcfa(cashBalance)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3">Instructions</h2>
            <p className="text-sm text-fin-mute leading-relaxed">
              Les valeurs ci-dessus sont calculées sur la base des cours actuels des actions détenues et du solde disponible réel
              de votre compte.
            </p>
          </div>
        </div>
      </div>

      <PortfolioTable rows={rows} title="Positions actuelles" />
    </div>
  )
}
