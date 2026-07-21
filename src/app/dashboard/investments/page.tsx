import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import MarketplaceContent from './MarketplaceContent'
import { GlassCard } from '@/components/ui/GlassCard'
import { formatFcfa } from '@/lib/utils'

export default async function InvestmentsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: dbOffers } = await supabase
    .from('investment_offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const DEMO_OFFERS = [
    { id: 'snts', title: 'Sonatel (SNTS)', description: 'Secteur des Télécoms - Sénégal.', type: 'Action', roi_percentage: 8.5, price_per_share: 28700, minimum_investment: 28700, is_active: true },
    { id: 'orac', title: "Orange Côte d'Ivoire (ORAC)", description: 'Secteur des Télécoms - CI.', type: 'Action', roi_percentage: 7.2, price_per_share: 15650, minimum_investment: 15650, is_active: true },
    { id: 'sgbc', title: 'Société Générale CI (SGBC)', description: 'Secteur Bancaire.', type: 'Action', roi_percentage: 9.1, price_per_share: 36200, minimum_investment: 36200, is_active: true },
    { id: 'ecoc', title: 'Ecobank CI (ECOC)', description: 'Secteur Bancaire - Côte d\'Ivoire.', type: 'Action', roi_percentage: 8.0, price_per_share: 16000, minimum_investment: 16000, is_active: true },
    { id: 'cbibf', title: 'Coris Bank Int. (CBIBF)', description: 'Banque à fort taux de croissance.', type: 'Action', roi_percentage: 9.0, price_per_share: 20700, minimum_investment: 20700, is_active: true },
    { id: 'etit', title: 'Ecobank Trans. Inc. (ETIT)', description: 'Action holding ETI.', type: 'Action', roi_percentage: 5.5, price_per_share: 30, minimum_investment: 3000, is_active: true },
  ]

  const offers = dbOffers && dbOffers.length > 0 ? dbOffers : DEMO_OFFERS
  const { data: userData } = await supabase.from('users').select('balance, kyc_status').eq('id', user?.id).single()
  const userBalance = parseFloat(userData?.balance || 0)
  const isKycValid = userData?.kyc_status === 'validé'

  return (
    <div className="fin-page fin-section">
      <GlassCard hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Marché</h1>
          <p className="text-sm text-fin-mute mt-1">Achetez des actions et obligations en temps réel.</p>
        </div>
        <div className="rounded-2xl bg-fin-surface border border-white/5 px-4 py-3 sm:text-right">
          <p className="text-[10px] uppercase tracking-wider text-fin-mute font-bold">Solde disponible</p>
          <p className="text-xl font-bold text-fin-primary">{formatFcfa(userBalance)}</p>
        </div>
      </GlassCard>

      {!isKycValid && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-[20px] border border-fin-warning/30 bg-fin-warning/10 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-fin-warning/20 flex items-center justify-center text-fin-warning shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Vérification requise</h3>
              <p className="text-sm text-fin-mute">Validez votre identité avant d&apos;investir.</p>
            </div>
          </div>
          <Link
            href="/dashboard/kyc"
            className="inline-flex items-center justify-center rounded-2xl bg-fin-warning text-[#050B17] px-5 py-3 text-sm font-bold"
          >
            Valider mon KYC
          </Link>
        </div>
      )}

      <MarketplaceContent initialOffers={offers} userBalance={userBalance} isKycValid={isKycValid} />
    </div>
  )
}
