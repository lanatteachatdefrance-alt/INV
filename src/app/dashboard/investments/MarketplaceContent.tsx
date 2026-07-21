'use client'

import { useState } from 'react'
import { Layers } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui/SearchBar'
import { GlassCard } from '@/components/ui/GlassCard'
import { InvestmentCard } from '@/components/fintech/InvestmentCard'
import { buyInvestment } from './actions'
import { cn } from '@/lib/utils'

export default function MarketplaceContent({
  initialOffers,
  userBalance,
  isKycValid,
}: {
  initialOffers: any[]
  userBalance: number
  isKycValid: boolean
}) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Tous')
  const router = useRouter()

  const filteredOffers = initialOffers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      (offer.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'Tous' || offer.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="flex flex-col gap-5">
      <GlassCard padding="sm" hover={false} className="space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une action, un ticker…" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['Tous', 'Action', 'Obligation'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={cn(
                'px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all',
                filterType === type
                  ? 'bg-fin-primary text-white shadow-glow'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              )}
            >
              {type === 'Tous' ? 'Tout' : `${type}s`}
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <InvestmentCard
              key={offer.id}
              offer={offer}
              userBalance={userBalance}
              isKycValid={isKycValid}
              onBuy={async (shares) => {
                const formData = new FormData()
                formData.append('offerId', offer.id)
                formData.append('shares', shares.toString())
                formData.append('totalCost', String(shares * offer.price_per_share))
                formData.append('title', offer.title)
                const res = await buyInvestment(formData)
                if (!res?.error) router.refresh()
                return res
              }}
            />
          ))
        ) : (
          <GlassCard className="col-span-full py-16 flex flex-col items-center text-center" hover={false}>
            <Layers size={40} className="text-fin-mute/40 mb-3" />
            <h3 className="font-bold text-lg">Aucun résultat</h3>
            <p className="text-sm text-fin-mute max-w-xs mt-1">Modifiez votre recherche ou vos filtres.</p>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
