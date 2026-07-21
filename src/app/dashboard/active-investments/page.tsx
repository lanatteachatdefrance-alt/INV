import { createClient } from '@/utils/supabase/server'
import { TransactionCard, type OrderItem } from '@/components/fintech/TransactionCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { Activity } from 'lucide-react'

export default async function TransactionsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user?.id)
    .neq('type', 'admin_adjustment')
    .order('created_at', { ascending: false })

  const items: OrderItem[] = (transactions || []).map((tx) => {
    const isSell = tx.type === 'retrait' || tx.type === 'vente'
    return {
      id: tx.id,
      title: tx.description || String(tx.type).replaceAll('_', ' '),
      side: isSell ? 'vente' : 'achat',
      amount: parseFloat(tx.amount || 0),
      status: tx.status || 'terminé',
    }
  })

  return (
    <div className="fin-page fin-section">
      <GlassCard hover={false}>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Ordres & historique</h1>
        <p className="text-sm text-fin-mute mt-1">Suivez vos achats, ventes et mouvements de compte.</p>
      </GlassCard>

      {items.length === 0 ? (
        <GlassCard hover={false} className="py-16 flex flex-col items-center text-center">
          <Activity size={40} className="text-fin-mute/40 mb-3" />
          <p className="font-semibold">Aucune transaction</p>
          <p className="text-sm text-fin-mute mt-1">Vos ordres apparaîtront ici.</p>
        </GlassCard>
      ) : (
        <TransactionCard items={items} title="Tous les ordres" href="/dashboard/active-investments" />
      )}
    </div>
  )
}
