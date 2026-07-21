'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusCircle, MinusCircle, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { submitWithdrawalRequest, syncMyPortfolioBalances } from './actions'
import { BalanceCard } from '@/components/fintech/BalanceCard'
import { PerformanceChart, MetricCard } from '@/components/fintech/PerformanceChart'
import { TransactionCard, type OrderItem } from '@/components/fintech/TransactionCard'
import { PortfolioTable, type HoldingRow } from '@/components/fintech/PortfolioTable'
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons'
import { formatFcfa } from '@/lib/utils'

function buildSparkline(seed: number) {
  const points = []
  let v = seed
  for (let i = 0; i < 24; i++) {
    v += (Math.sin(i / 2) + (i % 3 === 0 ? 0.4 : -0.15)) * 1.2
    points.push({ label: `${i}h`, value: Number(v.toFixed(2)) })
  }
  return points
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState({ balance: 0, kyc_status: 'en_attente', accountId: '' })
  const [transactions, setTransactions] = useState<any[]>([])
  const [holdings, setHoldings] = useState<HoldingRow[]>([])
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [showManagerPopup, setShowManagerPopup] = useState(false)
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false)
  const [withdrawMethod, setWithdrawMethod] = useState<'mobile_money' | 'bank_transfer'>('mobile_money')
  const [isWithdrawPending, setIsWithdrawPending] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const chartData = useMemo(() => buildSparkline(262), [])
  const growthPct =
    totalInvested > 0 ? ((portfolioValue - totalInvested) / totalInvested) * 100 : portfolioValue > 0 ? 2.35 : 0

  useEffect(() => {
    const supabase = createClient()

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await syncMyPortfolioBalances()

      const { data: uData } = await supabase
        .from('users')
        .select('balance, kyc_status')
        .eq('id', user.id)
        .single()

      if (uData) {
        setUserData({
          balance: parseFloat(uData.balance || 0),
          kyc_status: uData.kyc_status,
          accountId: user.id.replace(/\D/g, '').slice(0, 10).padStart(10, '0') || '0061954972',
        })
      }

      const { data: investments } = await supabase
        .from('user_investments')
        .select(`
          id,
          amount_invested,
          current_value,
          status,
          shares,
          offer_id,
          investment_offers ( title )
        `)
        .eq('user_id', user.id)

      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .neq('type', 'admin_adjustment')
        .order('created_at', { ascending: false })
        .limit(8)

      if (txs) setTransactions(txs)

      const active = (investments || []).filter((inv: any) => inv.status !== 'clôturé')
      const activePortfolioValue = active.reduce(
        (acc: number, inv: any) => acc + parseFloat(inv.current_value ?? inv.amount_invested ?? 0),
        0
      )
      const activeInvestedAmount = active.reduce(
        (acc: number, inv: any) => acc + parseFloat(inv.amount_invested ?? 0),
        0
      )

      const txPortfolioValue = (txs || [])
        .filter((t) => t.type === 'achat_investissement')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      setPortfolioValue(activePortfolioValue > 0 ? activePortfolioValue : txPortfolioValue)
      setTotalInvested(activeInvestedAmount > 0 ? activeInvestedAmount : txPortfolioValue)

      const mappedHoldings: HoldingRow[] = active.slice(0, 6).map((inv: any, idx: number) => {
        const invested = parseFloat(inv.amount_invested || 0)
        const current = parseFloat(inv.current_value ?? invested)
        const qty = parseInt(inv.shares || '1', 10) || 1
        const changePct = invested > 0 ? ((current - invested) / invested) * 100 : 0
        const offer = Array.isArray(inv.investment_offers)
          ? inv.investment_offers[0]
          : inv.investment_offers
        const title = offer?.title || `Position ${idx + 1}`
        return {
          id: inv.id,
          title,
          quantity: qty,
          price: Math.round(current / qty) || invested,
          changePct,
          value: current,
        }
      })
      setHoldings(mappedHoldings)

      const channel = supabase
        .channel(`user-balance-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` },
          (payload: any) => {
            setUserData((prev) => ({
              ...prev,
              balance: parseFloat(payload.new?.balance || 0),
              kyc_status: payload.new?.kyc_status || 'en_attente',
            }))
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    let cleanup: (() => void) | undefined
    loadData().then((dispose) => {
      cleanup = dispose
    })
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  const mappedOrders: OrderItem[] = transactions.slice(0, 5).map((tx) => {
    const isBuy = tx.type === 'achat_investissement'
    const isSell = tx.type === 'retrait' || tx.type === 'vente'
    return {
      id: tx.id,
      title: tx.description || tx.type.replaceAll('_', ' '),
      side: isSell && !isBuy ? 'vente' : 'achat',
      amount: parseFloat(tx.amount || 0),
      status: tx.status || 'terminé',
    }
  })

  return (
    <div className="fin-page fin-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-fin-mute text-sm">Bon retour</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Votre patrimoine</h1>
        </div>
        <div className="flex gap-2.5">
          <SecondaryButton onClick={() => setShowManagerPopup(true)} className="flex-1 sm:flex-none">
            <PlusCircle size={16} /> Dépôt
          </SecondaryButton>
          <SecondaryButton
            variant="danger"
            onClick={() => {
              setWithdrawError('')
              setWithdrawSuccess(false)
              setShowWithdrawPopup(true)
            }}
            className="flex-1 sm:flex-none"
          >
            <MinusCircle size={16} /> Retrait
          </SecondaryButton>
          <Link href="/dashboard/investments" className="hidden sm:block">
            <PrimaryButton>
              <ArrowUpRight size={16} /> Investir
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {userData.kyc_status !== 'validé' && (
        <Link
          href="/dashboard/kyc"
          className="flex items-center gap-3 rounded-[20px] border border-fin-warning/30 bg-amber-500/10 px-4 py-3.5 hover:bg-amber-500/15 transition-colors"
        >
          <ShieldCheck className="text-amber-600 shrink-0" size={22} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">Finalisez votre vérification KYC</p>
            <p className="text-xs text-fin-mute">Requise pour placer des ordres sur le marché.</p>
          </div>
          <span className="text-xs font-bold text-amber-600">Continuer</span>
        </Link>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3 space-y-5">
          <BalanceCard
            accountId={userData.accountId}
            balance={userData.balance}
            portfolioValue={portfolioValue}
            portfolioChangePct={Number(growthPct.toFixed(2))}
            status={userData.kyc_status === 'validé' ? 'ACTIF' : 'KYC'}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <MetricCard label="Cash disponible" value={formatFcfa(userData.balance)} tone="primary" />
            <MetricCard label="Investi" value={formatFcfa(totalInvested)} />
            <MetricCard
              label="Performance"
              value={`${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(2)}%`}
              tone={growthPct >= 0 ? 'success' : 'danger'}
            />
            <MetricCard
              label="P&L latent"
              value={formatFcfa(portfolioValue - totalInvested)}
              tone={portfolioValue - totalInvested >= 0 ? 'success' : 'danger'}
            />
          </div>
        </div>

        <div className="xl:col-span-2">
          <PerformanceChart
            value={265.48}
            changePct={1.28}
            data={chartData}
            subtitle="Séance du jour"
            volume="Volume: 1 258 963 titres"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="valeurs">
        <TransactionCard items={mappedOrders} />
        <PortfolioTable rows={holdings} />
      </div>

      <Link href="/dashboard/investments" className="sm:hidden block">
        <PrimaryButton fullWidth size="lg">
          <ArrowUpRight size={16} /> Placer un ordre
        </PrimaryButton>
      </Link>

      {showManagerPopup && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center p-0 md:p-4">
          <button type="button" aria-label="Fermer" onClick={() => setShowManagerPopup(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm rounded-t-[24px] md:rounded-[20px] bg-white border border-slate-200 shadow-glass p-6 text-center pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dépôt</h3>
            <p className="text-sm text-fin-mute mb-5">Contactez votre gestionnaire pour créditer votre compte.</p>
            <PrimaryButton fullWidth onClick={() => setShowManagerPopup(false)}>
              Fermer
            </PrimaryButton>
          </div>
        </div>
      )}

      {showWithdrawPopup && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center p-0 md:p-4">
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => !isWithdrawPending && setShowWithdrawPopup(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-t-[24px] md:rounded-[20px] bg-white border border-slate-200 shadow-glass p-6 max-h-[90dvh] overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6">
            <h3 className="text-xl font-bold text-slate-900">Demande de retrait</h3>
            <p className="text-xs text-fin-mute mt-1 mb-4">
              Solde: {formatFcfa(userData.balance)}
            </p>

            <form
              action={async (formData) => {
                setIsWithdrawPending(true)
                setWithdrawError('')
                setWithdrawSuccess(false)
                const res = await submitWithdrawalRequest(formData)
                if (res?.error) setWithdrawError(res.error)
                else {
                  setWithdrawSuccess(true)
                  setTimeout(() => {
                    setShowWithdrawPopup(false)
                    router.refresh()
                  }, 1200)
                }
                setIsWithdrawPending(false)
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-fin-mute block mb-1.5">Montant (FCFA)</label>
                <input type="number" name="amount" min="1" required disabled={isWithdrawPending} className="fin-input" placeholder="50000" />
              </div>

              <div>
                <label className="text-xs font-semibold text-fin-mute block mb-2">Mode de paiement</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('mobile_money')}
                    className={`rounded-2xl border px-3 py-2.5 text-xs font-bold ${
                      withdrawMethod === 'mobile_money'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod('bank_transfer')}
                    className={`rounded-2xl border px-3 py-2.5 text-xs font-bold ${
                      withdrawMethod === 'bank_transfer'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Virement
                  </button>
                </div>
                <input type="hidden" name="method" value={withdrawMethod} />
              </div>

              <div>
                <label className="text-xs font-semibold text-fin-mute block mb-1.5">Bénéficiaire</label>
                <input type="text" name="holderName" required disabled={isWithdrawPending} className="fin-input" placeholder="Nom complet" />
              </div>

              {withdrawMethod === 'mobile_money' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-fin-mute block mb-1.5">Opérateur</label>
                    <select name="mobileOperator" required disabled={isWithdrawPending} className="fin-input bg-fin-surface">
                      <option value="">Sélectionner</option>
                      <option value="Orange Money">Orange Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Moov Money">Moov Money</option>
                      <option value="Wave">Wave</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-fin-mute block mb-1.5">Numéro</label>
                    <input type="text" name="mobileNumber" required disabled={isWithdrawPending} className="fin-input" placeholder="07XXXXXXXX" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-fin-mute block mb-1.5">Banque</label>
                    <input type="text" name="bankName" required disabled={isWithdrawPending} className="fin-input" placeholder="SGCI" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-fin-mute block mb-1.5">Compte</label>
                    <input type="text" name="accountNumber" required disabled={isWithdrawPending} className="fin-input" placeholder="CI00…" />
                  </div>
                </div>
              )}

              {withdrawError && <p className="text-xs font-semibold text-fin-danger bg-fin-danger/10 border border-fin-danger/20 rounded-xl px-3 py-2">{withdrawError}</p>}
              {withdrawSuccess && <p className="text-xs font-semibold text-fin-success bg-fin-success/10 border border-fin-success/20 rounded-xl px-3 py-2">Demande envoyée.</p>}

              <div className="flex gap-2 pt-2">
                <SecondaryButton type="button" fullWidth onClick={() => setShowWithdrawPopup(false)} disabled={isWithdrawPending}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton type="submit" fullWidth disabled={isWithdrawPending} variant="danger">
                  {isWithdrawPending ? 'Envoi…' : 'Soumettre'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
