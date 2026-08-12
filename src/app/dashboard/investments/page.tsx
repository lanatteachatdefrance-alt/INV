import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BRVM_OFFERS } from '@/lib/brvmOffersData'
import { InvestmentCard } from '@/components/fintech/InvestmentCard'

export default async function InvestmentsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupération du profil et du solde
  const { data: profile } = await supabase
    .from('users')
    .select('balance, kyc_status')
    .eq('id', user.id)
    .single()

  const userBalance = Number(profile?.balance ?? 0)

  const isKycValid =
    profile?.kyc_status === 'valid' ||
    profile?.kyc_status === 'approved' ||
    profile?.kyc_status === 'valide'

  const handleBuy = async (shares: number) => {
    'use server'

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return { error: 'Vous devez être connecté.' }
      }

      return {
        error:
          "La fonction d'achat sera activée après connexion avec le système d'ordres.",
      }
    } catch {
      return {
        error: 'Une erreur est survenue.',
      }
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Marché
          </h1>

          <p className="text-sm text-slate-500">
            Découvrez les valeurs disponibles sur le marché régional BRVM.
          </p>
        </div>

        {/* Solde */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Solde disponible
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {userBalance.toLocaleString('fr-FR')} FCFA
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isKycValid
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {isKycValid ? 'KYC validé' : 'KYC en attente'}
          </div>
        </div>
      </div>

      {/* Nombre d'offres */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Valeurs disponibles
          </h2>

          <p className="text-sm text-slate-500">
            {BRVM_OFFERS.length} valeurs disponibles
          </p>
        </div>
      </div>

      {/* Grille des investissements */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {BRVM_OFFERS.filter((offer) => offer.is_active).map((offer) => (
          <InvestmentCard
            key={offer.id}
            offer={offer}
            userBalance={userBalance}
            isKycValid={isKycValid}
            onBuy={handleBuy}
          />
        ))}
      </div>
    </div>
  )
}