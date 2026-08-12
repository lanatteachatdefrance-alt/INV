import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { InvestmentCard } from '@/components/fintech/InvestmentCard'
import MarketFilters from '@/components/fintech/MarketFilters'

export const dynamic = 'force-dynamic'

type InvestmentOffer = {
  id: string
  title: string | null
  symbol: string | null
  description: string | null
  type: string | null
  roi_percentage: number | string | null
  price_per_share: number | string | null
  minimum_investment: number | string | null
  company_name: string | null
}

export default async function InvestmentsPage() {
  const supabase = createClient()

  // =========================
  // UTILISATEUR
  // =========================

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

  const userBalance = Number(
    profile?.balance ?? 0
  )

  const isKycValid =
    profile?.kyc_status === 'valid' ||
    profile?.kyc_status === 'approved' ||
    profile?.kyc_status === 'valide'

  // =========================
  // OFFRES SUPABASE
  // =========================

  const {
    data: offers,
    error: offersError,
  } = await supabase
    .from('investment_offers')
    .select(
      `
        id,
        title,
        symbol,
        description,
        type,
        roi_percentage,
        price_per_share,
        minimum_investment,
        company_name
      `
    )
    .eq('is_active', true)

  if (offersError) {
    console.error(
      'Erreur Supabase investment_offers:',
      offersError
    )
  }

  /*
   * On normalise les données avant de les envoyer
   * au composant client.
   */
  const investmentOffers: InvestmentOffer[] = (
    offers ?? []
  ).map((offer) => ({
    id: String(offer.id),

    title:
      offer.title ??
      offer.company_name ??
      'Valeur',

    symbol:
      offer.symbol ?? null,

    description:
      offer.description ?? null,

    type:
      offer.type ?? 'Action',

    roi_percentage:
      offer.roi_percentage ?? 0,

    price_per_share:
      offer.price_per_share ?? 0,

    minimum_investment:
      offer.minimum_investment ?? 0,

    company_name:
      offer.company_name ?? null,
  }))

  // =========================
  // ACHAT
  // =========================

  const handleBuy = async (
    shares: number
  ) => {
    'use server'

    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return {
          error:
            'Vous devez être connecté.',
        }
      }

      return {
        error:
          "La fonction d'achat sera activée après connexion avec le système d'ordres.",
      }
    } catch {
      return {
        error:
          'Une erreur est survenue.',
      }
    }
  }

  return (
    <div className="p-6 space-y-6">

      {/* =========================
          EN-TÊTE
      ========================== */}

      <div className="flex flex-col gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Marché
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Découvrez les valeurs disponibles sur
            le marché régional BRVM.
          </p>
        </div>

        {/* =========================
            SOLDE
        ========================== */}

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Solde disponible
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {userBalance.toLocaleString(
                'fr-FR'
              )}{' '}
              FCFA
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
          MARCHÉ
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

      ) : (

        <MarketFilters
          offers={investmentOffers}
          userBalance={userBalance}
          isKycValid={isKycValid}
          onBuy={handleBuy}
        />

      )}

    </div>
  )
}