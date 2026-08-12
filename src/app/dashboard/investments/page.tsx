import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { InvestmentCard } from '@/components/fintech/InvestmentCard'
import MarketFilters from '@/components/fintech/MarketFilters'
import { tickerFromTitle } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type InvestmentOffer = {
  id: string
  title: string | null
  description: string | null
  type: string | null
  roi_percentage: number | string | null
  price_per_share: number | string | null
  minimum_investment: number | string | null
  company_name: string | null
}

function normalizeKycStatus(
  status: string | null | undefined
) {
  return (
    status
      ?.toLowerCase()
      .trim()
      .replace(/[_-]/g, ' ') ?? ''
  )
}

function isKycValid(
  status: string | null | undefined
) {
  const normalized =
    normalizeKycStatus(status)

  return (
    normalized === 'valid' ||
    normalized === 'valide' ||
    normalized === 'approved' ||
    normalized === 'approuve' ||
    normalized === 'approuvé'
  )
}

function isKycRejected(
  status: string | null | undefined
) {
  const normalized =
    normalizeKycStatus(status)

  return (
    normalized === 'rejected' ||
    normalized === 'refused' ||
    normalized === 'refuse' ||
    normalized === 'refusé' ||
    normalized === 'rejete' ||
    normalized === 'rejeté'
  )
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
  // PROFIL + KYC
  // =========================

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('users')
    .select('balance, kyc_status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return (
      <div className="fin-page fin-section">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-700">
            Impossible de récupérer votre profil.
          </p>

          <p className="mt-2 text-sm text-red-600">
            Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    )
  }

  const userBalance =
    Number(profile.balance ?? 0)

  const kycStatus =
    profile.kyc_status

  const kycValid =
    isKycValid(kycStatus)

  const kycRejected =
    isKycRejected(kycStatus)

  // =========================
  // OFFRES SUPABASE
  // =========================

  /*
   * IMPORTANT :
   * On ne récupère les valeurs du marché
   * que lorsque le KYC est validé.
   *
   * Le contrôle est donc effectué côté serveur.
   */

  let investmentOffers:
    InvestmentOffer[] = []

  let offersError:
    string | null = null

  if (kycValid) {
    const {
      data: offers,
      error,
    } = await supabase
      .from('investment_offers')
      .select(
        `
          id,
          title,
          description,
          type,
          roi_percentage,
          price_per_share,
          minimum_investment,
          company_name
        `
      )
      .eq('is_active', true)

    if (error) {
      console.error(
        'Erreur Supabase investment_offers:',
        error
      )

      offersError = error.message
    } else {
      investmentOffers = (
        offers ?? []
      ).map((offer) => ({
        id: String(offer.id),

        title:
          offer.title ??
          offer.company_name ??
          'Valeur BRVM',

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
    }
  }

  // =========================
  // ACHAT
  // =========================

  const handleBuy = async (
    shares: number
  ) => {
    'use server'

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

    /*
     * Vérification KYC côté serveur.
     */
    const {
      data: currentProfile,
    } = await supabase
      .from('users')
      .select(
        'balance, kyc_status'
      )
      .eq('id', user.id)
      .single()

    if (
      !currentProfile ||
      !isKycValid(
        currentProfile.kyc_status
      )
    ) {
      return {
        error:
          'Votre compte doit être validé par le KYC avant tout investissement.',
      }
    }

    if (!Number.isInteger(shares) || shares < 1) {
      return {
        error:
          'Le nombre de titres est invalide.',
      }
    }

    return {
      error:
        "La fonction d'achat sera activée lors de la mise en place du système d'ordres.",
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

          <p className="mt-1 text-sm text-slate-500">
            Découvrez les valeurs disponibles
            sur le marché régional BRVM.
          </p>
        </div>

        {/* =========================
            SOLDE + KYC
        ========================== */}

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

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
              kycValid
                ? 'bg-green-100 text-green-700'
                : kycRejected
                ? 'bg-red-100 text-red-700'
                : 'bg-orange-100 text-orange-700'
            }`}
          >
            {kycValid
              ? 'KYC validé'
              : kycRejected
              ? 'KYC refusé'
              : 'KYC en attente'}
          </div>

        </div>

      </div>


      {/* =========================
          KYC NON VALIDÉ
      ========================== */}

      {!kycValid ? (

        <div
          className={`rounded-3xl border p-8 text-center shadow-sm ${
            kycRejected
              ? 'border-red-200 bg-red-50'
              : 'border-orange-200 bg-orange-50'
          }`}
        >

          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
              kycRejected
                ? 'bg-red-100'
                : 'bg-orange-100'
            }`}
          >
            {kycRejected
              ? '!'
              : '🔐'}
          </div>

          <h2
            className={`text-xl font-bold ${
              kycRejected
                ? 'text-red-800'
                : 'text-orange-800'
            }`}
          >
            {kycRejected
              ? 'Accès au marché suspendu'
              : 'Validation KYC requise'}
          </h2>

          <p
            className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${
              kycRejected
                ? 'text-red-700'
                : 'text-orange-700'
            }`}
          >
            {kycRejected
              ? 'Votre demande KYC n’a pas été validée. Vous devez effectuer les corrections demandées avant de pouvoir accéder au marché et investir.'
              : 'Votre compte doit être vérifié et validé avant l’accès aux valeurs du marché. Une fois votre KYC approuvé, les valeurs disponibles apparaîtront automatiquement ici.'}
          </p>

          <div className="mt-6 inline-flex items-center rounded-xl border border-white/70 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-600">
            Statut actuel :
            <span className="ml-2">
              {kycStatus ||
                'En attente'}
            </span>
          </div>

        </div>

      ) : (

        <>
          {/* =========================
              ERREUR SUPABASE
          ========================== */}

          {offersError ? (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">

              <p className="font-bold">
                Impossible de charger les valeurs.
              </p>

              <p className="mt-1 text-sm">
                {offersError}
              </p>

            </div>

          ) : (

            /* =========================
               MARCHÉ
            ========================== */

            <MarketFilters
              offers={investmentOffers.map(
                (offer) => ({
                  ...offer,
                  symbol:
                    tickerFromTitle(
                      offer.title ??
                        offer.company_name ??
                        ''
                    ),
                })
              )}
              userBalance={
                userBalance
              }
              isKycValid={
                kycValid
              }
              onBuy={handleBuy}
            />

          )}

        </>

      )}

    </div>
  )
}