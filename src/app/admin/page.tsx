import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Users, Wallet } from 'lucide-react'
import SyncBalancesButton from './SyncBalancesButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { MetricCard } from '@/components/fintech/PerformanceChart'
import { formatFcfa } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: users } = await supabase.from('users').select('*')

  const totalUsers = users?.length || 0
  const pendingKyc = users?.filter((u) => u.kyc_status !== 'validé')?.length || 0
  const activeKyc = users?.filter((u) => u.kyc_status === 'validé')?.length || 0
  const totalFunds = users?.reduce((acc, user) => acc + parseFloat(user.balance || 0), 0) || 0

  return (
    <div className="fin-page fin-section">
      <GlassCard hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Administration</h1>
          <p className="text-sm text-fin-mute mt-1">Vue d&apos;ensemble de la plateforme</p>
        </div>
        <SyncBalancesButton />
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard label="Inscrits" value={String(totalUsers)} />
        <MetricCard label="KYC en attente" value={String(pendingKyc)} tone="danger" hint={pendingKyc > 0 ? 'Action requise' : undefined} />
        <MetricCard label="KYC validés" value={String(activeKyc)} tone="success" />
        <MetricCard label="Fonds gérés" value={formatFcfa(totalFunds)} tone="primary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/users">
          <GlassCard className="flex items-center gap-4 h-full">
            <div className="w-12 h-12 rounded-2xl bg-fin-primary/15 text-fin-primary flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="font-bold">Clients</p>
              <p className="text-sm text-fin-mute">KYC & recharges</p>
            </div>
          </GlassCard>
        </Link>
        <Link href="/admin/offers">
          <GlassCard className="flex items-center gap-4 h-full">
            <div className="w-12 h-12 rounded-2xl bg-fin-success/15 text-fin-success flex items-center justify-center">
              <Wallet size={22} />
            </div>
            <div>
              <p className="font-bold">Offres</p>
              <p className="text-sm text-fin-mute">Catalogue marché</p>
            </div>
          </GlassCard>
        </Link>
      </div>
    </div>
  )
}
