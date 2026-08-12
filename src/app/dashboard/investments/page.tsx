import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { InvestmentCard } from '@/components/fintech/InvestmentCard'

export default async function InvestmentsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // =========================
  // PROFIL + SOLDE
  // =========================

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

  // =========================
  // OFFRES DEPUIS SUPABASE
  // =========================

  const { data: offers, error: offersError } = await supabase
    .from('investment_offers')
    .select('*')
    .eq('is_active', true)

  if (offersError) {
    console.error(
      'Erreur Supabase investment_offers:',
      offersError
    )
  }

  const investmentOffers = offers ?? []

  // =========================
  // ACHAT
  // =========================

  const handleBuy = async (shares: number) => {
    'use server'

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return {
          error: 'Vous devez être connecté.',
        }
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

      {/* =========================
          EN-TÊTE
      ========================== */}

      <div className="flex flex-col gap-2">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Marché
          </h1>

          <p className="text-sm text-slate-500">
            Découvrez les valeurs disponibles sur le marché régional BRVM.
          </p>
        </div>

        {/* SOLDE */}

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
            {isKycValid
              ? 'KYC validé'
              : 'KYC en attente'}
          </div>

        </div>

      </div>

      {/* =========================
          NOMBRE D'OFFRES
      ========================== */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-bold text-slate-900">
            Valeurs disponibles
          </h2>

          <p className="text-sm text-slate-500">
            {investmentOffers.length} valeurs disponibles
          </p>

        </div>

      </div>

      {/* =========================
          GRILLE DES INVESTISSEMENTS
      ========================== */}

      {offersError ? (

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-bold">
            Impossible de charger les valeurs.
          </p>

          <p className="mt-1 text-sm">
            {offersError.message}
          </p>
        </div>

      ) : investmentOffers.length === 0 ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">

          <p className="font-bold text-slate-900">
            Aucune valeur disponible
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Aucune offre active n'a été trouvée dans Supabase.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {investmentOffers.map((offer) => (

            <InvestmentCard
              key={offer.id}
              offer={offer}
              userBalance={userBalance}
              isKycValid={isKycValid}
              onBuy={handleBuy}
            />

          ))}

        </div>

      )}

    </div>
  )
}