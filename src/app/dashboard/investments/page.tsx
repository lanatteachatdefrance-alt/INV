import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/utils/supabase/server'
import MarketFilters from '@/components/fintech/MarketFilters'

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
  symbol: string | null
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
  const normalized = normalizeKycStatus(status)

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
  const normalized = normalizeKycStatus(status)

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

  // =====================================================
  // UTILISATEUR
  // =====================================================

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // =====================================================
  // PROFIL
  // =====================================================

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('users')
    .select('balance, kyc_status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error(
      'Erreur récupération profil:',
      profileError
    )

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

  const userBalance = Number(
    profile.balance ?? 0
  )

  const kycStatus = profile.kyc_status

  const kycValid = isKycValid(
    kycStatus
  )

  const kycRejected = isKycRejected(
    kycStatus
  )

  // =====================================================
  // POSITIONS ACTUELLES
  // =====================================================

  const ownedShares: Record<string, number> = {}

  let investmentsError: any = null

  let investments: Array<{
    offer_id: string | null
    shares_bought: number | string | null
    status: string | null
  }> = []

  if (kycValid) {
    const result = await supabase
      .from('user_investments')
      .select(
        'offer_id, shares_bought, status'
      )
      .eq('user_id', user.id)
      .eq('status', 'actif')
      .not('offer_id', 'is', null)

    investments =
      result.data ?? []

    investmentsError =
      result.error

    if (investmentsError) {
      console.error(
        'Erreur récupération portefeuille:',
        investmentsError
      )
    } else {
      for (
        const investment of investments
      ) {
        const offerId =
          investment.offer_id

        if (!offerId) {
          continue
        }

        const shares =
          Number(
            investment.shares_bought ?? 0
          )

        if (
          !Number.isFinite(shares) ||
          shares <= 0
        ) {
          continue
        }

        ownedShares[offerId] =
          (
            ownedShares[offerId] ?? 0
          ) + shares
      }
    }

    // =================================================
    // DEBUG PORTEFEUILLE
    // =================================================

    console.log(
      '========================================'
    )

    console.log(
      'PORTFOLIO DEBUG'
    )

    console.log(
      'User ID:',
      user.id
    )

    console.log(
      'KYC:',
      kycStatus
    )

    console.log(
      'Investments:',
      investments
    )

    console.log(
      'Investments error:',
      investmentsError
    )

    console.log(
      'Owned shares:',
      ownedShares
    )

    console.log(
      '========================================'
    )
  }

  // =====================================================
  // OFFRES DU MARCHÉ
  // =====================================================

  let investmentOffers: InvestmentOffer[] =
    []

  let offersError: string | null =
    null

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
          company_name,
          symbol
        `
      )
      .eq(
        'is_active',
        true
      )

    if (error) {
      console.error(
        'Erreur Supabase investment_offers:',
        error
      )

      offersError =
        error.message
    } else {
      investmentOffers =
        (
          offers ?? []
        ).map(
          (offer) => ({
            id: String(
              offer.id
            ),

            title:
              offer.title ??
              offer.company_name ??
              'Valeur BRVM',

            description:
              offer.description ??
              null,

            type:
              offer.type ??
              'Action',

            roi_percentage:
              offer.roi_percentage ??
              0,

            price_per_share:
              offer.price_per_share ??
              0,

            minimum_investment:
              offer.minimum_investment ??
              0,

            company_name:
              offer.company_name ??
              null,

            // IMPORTANT :
            // On utilise désormais le vrai symbole
            // enregistré dans Supabase.
            symbol:
              offer.symbol ??
              null,
          })
        )
    }
  }

  // =====================================================
  // ACHAT
  // =====================================================

  const handleBuy = async (
    offerId: string,
    shares: number
  ) => {
    'use server'

    const supabase =
      createClient()

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
      return {
        error:
          'Vous devez être connecté.',
      }
    }

    const {
      data: currentProfile,
      error:
        currentProfileError,
    } = await supabase
      .from('users')
      .select(
        'balance, kyc_status'
      )
      .eq(
        'id',
        user.id
      )
      .single()

    if (
      currentProfileError ||
      !currentProfile
    ) {
      return {
        error:
          'Impossible de récupérer votre profil.',
      }
    }

    if (
      !isKycValid(
        currentProfile.kyc_status
      )
    ) {
      return {
        error:
          'Votre compte doit être validé par le KYC avant tout investissement.',
      }
    }

    if (
      !Number.isInteger(shares) ||
      shares < 1
    ) {
      return {
        error:
          'Le nombre de titres est invalide.',
      }
    }

    if (!offerId) {
      return {
        error:
          'La valeur sélectionnée est invalide.',
      }
    }

    const {
      data: offer,
      error: offerError,
    } = await supabase
      .from(
        'investment_offers'
      )
      .select(
        `
          id,
          title,
          company_name,
          type,
          price_per_share,
          minimum_investment,
          is_active
        `
      )
      .eq(
        'id',
        offerId
      )
      .single()

    if (
      offerError ||
      !offer
    ) {
      return {
        error:
          'Cette valeur est introuvable.',
      }
    }

    if (
      !offer.is_active
    ) {
      return {
        error:
          'Cette valeur n’est actuellement plus disponible.',
      }
    }

    const unitPrice =
      Number(
        offer.price_per_share ??
          0
      )

    if (
      !Number.isFinite(
        unitPrice
      ) ||
      unitPrice <= 0
    ) {
      return {
        error:
          'Le cours de cette valeur est actuellement indisponible.',
      }
    }

    const amount =
      shares *
      unitPrice

    if (
      !Number.isFinite(
        amount
      ) ||
      amount <= 0
    ) {
      return {
        error:
          'Le montant de l’ordre est invalide.',
      }
    }

    const balance =
      Number(
        currentProfile.balance ??
          0
      )

    if (
      !Number.isFinite(
        balance
      ) ||
      balance < amount
    ) {
      return {
        error:
          'Fonds insuffisants pour passer cet ordre.',
      }
    }

    const minimumInvestment =
      Number(
        offer.minimum_investment ??
          0
      )

    if (
      minimumInvestment > 0 &&
      amount <
        minimumInvestment
    ) {
      return {
        error:
          `Le montant minimum requis est de ${minimumInvestment.toLocaleString(
            'fr-FR'
          )} FCFA.`,
      }
    }

    const companyName =
      offer.company_name ||
      offer.title ||
      'Valeur BRVM'

    const description =
      `Ordre d'achat de ${shares} titre(s) : ${companyName}`

    const {
      data: transaction,
      error:
        transactionError,
    } = await supabase
      .from(
        'transactions'
      )
      .insert({
        user_id:
          user.id,

        type:
          'achat_investissement',

        amount,

        status:
          'pending',

        description,

        offer_id:
          offer.id,

        quantity:
          shares,

        unit_price:
          unitPrice,
      })
      .select('id')
      .single()

    if (
      transactionError ||
      !transaction
    ) {
      console.error(
        'Erreur création transaction achat:',
        transactionError
      )

      return {
        error:
          'Impossible d’enregistrer votre ordre. Veuillez réessayer.',
      }
    }

    revalidatePath(
      '/investments'
    )

    return {
      success:
        true,

      transactionId:
        transaction.id,
    }
  }

  // =====================================================
  // VENTE
  // =====================================================

  const handleSell = async (
    offerId: string,
    shares: number
  ) => {
    'use server'

    const supabase =
      createClient()

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
      return {
        error:
          'Vous devez être connecté.',
      }
    }

    if (
      !Number.isInteger(
        shares
      ) ||
      shares < 1
    ) {
      return {
        error:
          'Le nombre de titres à vendre est invalide.',
      }
    }

    if (!offerId) {
      return {
        error:
          'La valeur sélectionnée est invalide.',
      }
    }

    // =================================================
    // VÉRIFICATION QUANTITÉ DÉTENUE
    // =================================================

    const {
      data: userInvestments,
      error:
        investmentsError,
    } = await supabase
      .from(
        'user_investments'
      )
      .select(
        'offer_id, shares_bought, status'
      )
      .eq(
        'user_id',
        user.id
      )
      .eq(
        'offer_id',
        offerId
      )
      .eq(
        'status',
        'actif'
      )

    if (
      investmentsError
    ) {
      console.error(
        'Erreur vérification actions avant vente:',
        investmentsError
      )

      return {
        error:
          'Impossible de vérifier votre portefeuille.',
      }
    }

    const owned =
      (
        userInvestments ??
        []
      ).reduce(
        (
          total,
          investment
        ) => {
          const quantity =
            Number(
              investment.shares_bought ??
                0
            )

          return (
            total +
            (
              Number.isFinite(
                quantity
              )
                ? quantity
                : 0
            )
          )
        },
        0
      )

    if (
      owned <= 0
    ) {
      return {
        error:
          'Vous ne possédez aucune action de cette valeur.',
      }
    }

    if (
      shares > owned
    ) {
      return {
        error:
          `Vous ne pouvez vendre que ${owned.toLocaleString(
            'fr-FR'
          )} action(s).`,
      }
    }

    // =================================================
    // CRÉATION DE LA VENTE VIA RPC
    // =================================================

    const {
      data,
      error,
    } =
      await supabase.rpc(
        'create_investment_sale',
        {
          p_offer_id:
            offerId,

          p_quantity:
            shares,
        }
      )

    if (error) {
      console.error(
        'Erreur création vente:',
        error
      )

      return {
        error:
          error.message ||
          'Impossible de créer l’ordre de vente.',
      }
    }

    revalidatePath(
      '/investments'
    )

    return {
      success:
        true,

      transactionId:
        data?.transaction_id ??
        null,

      amount:
        data?.amount ??
        null,
    }
  }

  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (
    <div className="fin-page fin-section">

      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <div className="flex flex-col gap-4">

        <div>
          <h1 className="fin-title text-2xl">
            Marché
          </h1>

          <p className="fin-subtitle mt-1 text-sm">
            Découvrez les valeurs disponibles
            sur le marché régional BRVM.
          </p>
        </div>

        {/* =================================================
            SOLDE
        ================================================= */}

        <div className="glass-card flex items-center justify-between gap-4 p-4">

          <div>
            <p className="text-xs uppercase tracking-wider fin-muted">
              Solde disponible
            </p>

            <p className="mt-1 text-xl font-bold text-[var(--fin-primary)]">
              {userBalance.toLocaleString(
                'fr-FR'
              )}{' '}
              FCFA
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              kycValid
                ? 'bg-[var(--fin-success-light)] text-[var(--fin-success)]'
                : kycRejected
                ? 'bg-[var(--fin-danger-light)] text-[var(--fin-danger)]'
                : 'bg-[var(--fin-warning-light)] text-[var(--fin-warning)]'
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

      {/* =================================================
          KYC NON VALIDÉ
      ================================================= */}

      {!kycValid ? (

        <div
          className={`rounded-3xl border p-8 text-center shadow-sm ${
            kycRejected
              ? 'border-[var(--fin-danger)]/20 bg-[var(--fin-danger-light)]'
              : 'border-[var(--fin-warning)]/20 bg-[var(--fin-warning-light)]'
          }`}
        >

          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
              kycRejected
                ? 'bg-[var(--fin-danger)]/10'
                : 'bg-[var(--fin-warning)]/10'
            }`}
          >
            {kycRejected
              ? '!'
              : '🔐'}
          </div>

          <h2
            className={`text-xl font-bold ${
              kycRejected
                ? 'text-[var(--fin-danger)]'
                : 'text-[var(--fin-warning)]'
            }`}
          >
            {kycRejected
              ? 'Accès au marché suspendu'
              : 'Validation KYC requise'}
          </h2>

          <p
            className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed ${
              kycRejected
                ? 'text-[var(--fin-danger)]'
                : 'text-[var(--fin-warning)]'
            }`}
          >
            {kycRejected
              ? 'Votre demande KYC n’a pas été validée. Vous devez effectuer les corrections demandées avant de pouvoir accéder au marché et investir.'
              : 'Votre compte doit être vérifié et validé avant l’accès aux valeurs du marché. Une fois votre KYC approuvé, les valeurs disponibles apparaîtront automatiquement ici.'}
          </p>

          <div className="mt-6 inline-flex items-center rounded-xl border border-[var(--fin-border)] bg-white/80 px-4 py-3 text-xs font-semibold text-[var(--fin-text-secondary)]">
            Statut actuel :

            <span className="ml-2 text-[var(--fin-primary)]">
              {kycStatus ||
                'En attente'}
            </span>
          </div>

        </div>

      ) : (

        <>
          {/* ===========================================
              ERREUR OFFRES
          =========================================== */}

          {offersError ? (

            <div className="rounded-2xl border border-[var(--fin-danger)]/20 bg-[var(--fin-danger-light)] p-6 text-[var(--fin-danger)]">

              <p className="font-bold">
                Impossible de charger les valeurs.
              </p>

              <p className="mt-1 text-sm">
                {offersError}
              </p>

            </div>

          ) : (

            /* =========================================
               MARCHÉ
            ========================================= */

            <MarketFilters
              offers={investmentOffers.map(
                (
                  offer
                ) => ({
                  ...offer,

                  /*
                   * IMPORTANT :
                   * Le symbole vient directement
                   * de investment_offers.symbol.
                   */
                  symbol:
                    offer.symbol ??
                    '—',
                })
              )}

              userBalance={
                userBalance
              }

              isKycValid={
                kycValid
              }

              ownedShares={
                ownedShares
              }

              onBuy={
                handleBuy
              }

              onSell={
                handleSell
              }
            />

          )}

        </>

      )}

    </div>
  )
}