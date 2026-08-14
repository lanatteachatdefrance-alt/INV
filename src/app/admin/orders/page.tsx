import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

type Transaction = {
  id: string
  created_at: string
  user_id: string
  type: string | null
  amount: number | string | null
  status: string | null
  description: string | null
  offer_id: string | null
  quantity: number | string | null
  unit_price: number | string | null
  approved_by: string | null
  approved_at: string | null
}

type UserProfile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
}

type Order = {
  id: string
  user_id: string
  clientName: string
  email: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  status: string
  createdAt: string
}

function formatStatus(status: string | null) {
  const normalized =
    status?.toLowerCase().trim() ?? ''

  if (normalized === 'approved') {
    return 'Complété'
  }

  if (normalized === 'rejected') {
    return 'Annulé'
  }

  if (
    normalized === 'pending' ||
    normalized === 'en_attente' ||
    normalized === 'en attente'
  ) {
    return 'En attente'
  }

  if (
    normalized === 'completed' ||
    normalized === 'complete' ||
    normalized === 'complété'
  ) {
    return 'Complété'
  }

  if (
    normalized === 'cancelled' ||
    normalized === 'annule' ||
    normalized === 'annulé'
  ) {
    return 'Annulé'
  }

  return status || 'En attente'
}

/*
 * =====================================================
 * VALIDATION / REFUS D'UN ORDRE
 * =====================================================
 */

async function updateOrderStatus(formData: FormData) {
  'use server'

  const orderId = String(
    formData.get('orderId') ?? ''
  )

  const action = String(
    formData.get('action') ?? ''
  )

  if (!orderId) {
    throw new Error(
      'Identifiant de l’ordre manquant.'
    )
  }

  if (
    action !== 'approve' &&
    action !== 'reject'
  ) {
    throw new Error(
      'Action invalide.'
    )
  }

  const supabase = createClient()

  /*
   * =====================================================
   * ADMIN CONNECTÉ
   * =====================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  /*
   * =====================================================
   * VÉRIFICATION ADMIN
   * =====================================================
   */

  const isAdmin =
    await ensureAdminAccess(
      supabase,
      user
    )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  /*
   * =====================================================
   * RÉCUPÉRATION DE L'ORDRE
   * =====================================================
   */

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from('transactions')
    .select(
      `
        id,
        user_id,
        status,
        type,
        amount,
        offer_id,
        quantity,
        unit_price
      `
    )
    .eq('id', orderId)
    .eq(
      'type',
      'achat_investissement'
    )
    .single()

  if (orderError || !order) {
    throw new Error(
      'Ordre introuvable.'
    )
  }

  /*
   * =====================================================
   * VÉRIFICATION DU STATUT
   * =====================================================
   */

  const currentStatus =
    order.status
      ?.toLowerCase()
      .trim()

  if (
    currentStatus !== 'pending' &&
    currentStatus !== 'en_attente' &&
    currentStatus !== 'en attente'
  ) {
    throw new Error(
      'Cet ordre a déjà été traité.'
    )
  }

  /*
   * =====================================================
   * REFUS
   * =====================================================
   */

  if (action === 'reject') {
    const {
      error,
    } = await supabase
      .from('transactions')
      .update({
        status: 'rejected',
        updated_at:
          new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq(
        'type',
        'achat_investissement'
      )

    if (error) {
      throw new Error(
        `Impossible de refuser l’ordre : ${error.message}`
      )
    }

    revalidatePath('/admin/orders')
    revalidatePath('/dashboard/orders')

    return
  }

  /*
   * =====================================================
   * VALIDATION
   * =====================================================
   */

  if (action === 'approve') {

    /*
     * ---------------------------------------------------
     * OFFRE ASSOCIÉE
     * ---------------------------------------------------
     */

    if (!order.offer_id) {
      throw new Error(
        'Cette commande ne possède aucune valeur associée.'
      )
    }

    /*
     * ---------------------------------------------------
     * RÉCUPÉRATION DE L'OFFRE
     * ---------------------------------------------------
     */

    const {
      data: offer,
      error: offerError,
    } = await supabase
      .from('investment_offers')
      .select(
        `
          id,
          title,
          price_per_share,
          is_active
        `
      )
      .eq(
        'id',
        order.offer_id
      )
      .single()

    if (
      offerError ||
      !offer
    ) {
      throw new Error(
        'La valeur associée à cet ordre est introuvable.'
      )
    }

    if (!offer.is_active) {
      throw new Error(
        'Cette valeur n’est plus active.'
      )
    }

    /*
     * ---------------------------------------------------
     * QUANTITÉ
     * ---------------------------------------------------
     */

    const quantity =
      Number(
        order.quantity ?? 0
      )

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        'La quantité de titres est invalide.'
      )
    }

    /*
     * ---------------------------------------------------
     * COURS D'ACHAT
     * ---------------------------------------------------
     */

    const purchasePrice =
      Number(
        order.unit_price ?? 0
      )

    if (
      !Number.isFinite(
        purchasePrice
      ) ||
      purchasePrice <= 0
    ) {
      throw new Error(
        'Le cours d’achat est invalide.'
      )
    }

    /*
     * ---------------------------------------------------
     * MONTANT
     * ---------------------------------------------------
     */

    const amount =
      Number(
        order.amount ?? 0
      )

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        'Le montant de l’ordre est invalide.'
      )
    }

    /*
     * ---------------------------------------------------
     * VÉRIFICATION DU CALCUL
     * ---------------------------------------------------
     */

    const expectedAmount =
      quantity *
      purchasePrice

    if (
      Math.abs(
        expectedAmount - amount
      ) > 0.01
    ) {
      throw new Error(
        'Le montant de l’ordre ne correspond pas à la quantité et au cours.'
      )
    }

    /*
     * ---------------------------------------------------
     * COURS ACTUEL
     * ---------------------------------------------------
     */

    const currentPrice =
      Number(
        offer.price_per_share ?? 0
      )

    if (
      !Number.isFinite(
        currentPrice
      ) ||
      currentPrice <= 0
    ) {
      throw new Error(
        'Le cours actuel de cette valeur est indisponible.'
      )
    }

    /*
     * ---------------------------------------------------
     * VALEUR ACTUELLE DE LA POSITION
     * ---------------------------------------------------
     */

    const currentValue =
      quantity *
      currentPrice

    /*
     * ---------------------------------------------------
     * PROTECTION CONTRE LE DOUBLE AJOUT
     * ---------------------------------------------------
     *
     * On vérifie qu'une position identique
     * n'existe pas déjà pour cet utilisateur.
     *
     * Cela évite de créer deux fois la même
     * position si le bouton est envoyé deux fois.
     */

    const {
      data: existingInvestment,
      error: existingError,
    } = await supabase
      .from('user_investments')
      .select('id')
      .eq(
        'user_id',
        order.user_id
      )
      .eq(
        'offer_id',
        order.offer_id
      )
      .eq(
        'amount_invested',
        amount
      )
      .eq(
        'shares_bought',
        quantity
      )
      .limit(1)
      .maybeSingle()

    if (existingError) {
      throw new Error(
        `Impossible de vérifier la position existante : ${existingError.message}`
      )
    }

    /*
     * ---------------------------------------------------
     * CRÉATION DE LA POSITION
     * ---------------------------------------------------
     */

    if (!existingInvestment) {
      const {
        error: investmentError,
      } = await supabase
        .from('user_investments')
        .insert({
          user_id:
            order.user_id,

          offer_id:
            order.offer_id,

          amount_invested:
            amount,

          shares_bought:
            quantity,

          purchase_price:
            purchasePrice,

          current_value:
            currentValue,

          status:
            'actif',
        })

      if (investmentError) {
        throw new Error(
          `Impossible de créer la position : ${investmentError.message}`
        )
      }
    }

    /*
     * ---------------------------------------------------
     * PASSAGE DE L'ORDRE À COMPLÉTÉ
     * ---------------------------------------------------
     */

    const {
      error: updateError,
    } = await supabase
      .from('transactions')
      .update({
        status: 'approved',

        approved_by:
          user.id,

        approved_at:
          new Date().toISOString(),

        updated_at:
          new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq(
        'type',
        'achat_investissement'
      )

    if (updateError) {
      throw new Error(
        `La position a été créée mais l’ordre n’a pas pu être validé : ${updateError.message}`
      )
    }
  }

  /*
   * =====================================================
   * RAFRAÎCHISSEMENT DES PAGES
   * =====================================================
   */

  revalidatePath('/admin/orders')
  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/investments')
  revalidatePath('/dashboard/portfolio')
}

/*
 * =====================================================
 * PAGE ADMIN
 * =====================================================
 */

export default async function AdminOrdersPage() {
  const supabase = createClient()

  /*
   * =====================================================
   * UTILISATEUR
   * =====================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  /*
   * =====================================================
   * VÉRIFICATION ADMIN
   * =====================================================
 */

  const isAdmin =
    await ensureAdminAccess(
      supabase,
      user
    )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  /*
   * =====================================================
   * RÉCUPÉRATION DES TRANSACTIONS
   * =====================================================
   */

  const {
    data: transactions,
    error,
  } = await supabase
    .from('transactions')
    .select(
      `
        id,
        created_at,
        user_id,
        type,
        amount,
        status,
        description,
        offer_id,
        quantity,
        unit_price,
        approved_by,
        approved_at
      `
    )
    .eq(
      'type',
      'achat_investissement'
    )
    .order(
      'created_at',
      {
        ascending: false,
      }
    )

  if (error) {
    throw new Error(
      error.message
    )
  }

  /*
   * =====================================================
   * UTILISATEURS
   * =====================================================
   */

  const userIds = Array.from(
    new Set(
      (transactions ?? [])
        .map(
          (transaction) =>
            transaction.user_id
        )
        .filter(Boolean)
    )
  )

  let profiles: UserProfile[] = []

  if (userIds.length > 0) {
    const {
      data: userProfiles,
    } = await supabase
      .from('users')
      .select(
        'id, email, first_name, last_name'
      )
      .in(
        'id',
        userIds
      )

    profiles =
      userProfiles ?? []
  }

  /*
   * =====================================================
   * TRANSFORMATION
   * =====================================================
   */

  const orders: Order[] =
    (transactions ?? []).map(
      (
        transaction: Transaction
      ) => {
        const profile =
          profiles.find(
            (item) =>
              item.id ===
              transaction.user_id
          )

        const quantity =
          Number(
            transaction.quantity ?? 0
          )

        const unitPrice =
          Number(
            transaction.unit_price ?? 0
          )

        const amount =
          Number(
            transaction.amount ?? 0
          )

        const clientName =
          [
            profile?.first_name,
            profile?.last_name,
          ]
            .filter(Boolean)
            .join(' ') ||
          'Client'

        return {
          id: transaction.id,

          user_id:
            transaction.user_id,

          clientName,

          email:
            profile?.email ||
            'Email non renseigné',

          description:
            transaction.description ||
            'Achat investissement',

          quantity,

          unitPrice,

          amount,

          status:
            formatStatus(
              transaction.status
            ),

          createdAt:
            transaction.created_at,
        }
      }
    )

  /*
   * =====================================================
   * STATISTIQUES
   * =====================================================
   */

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        'En attente'
    )

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        'Complété'
    )

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status ===
        'Annulé'
    )

  /*
   * =====================================================
   * AFFICHAGE
   * =====================================================
   */

  return (
    <div className="p-6 space-y-6">

      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Validation des achats
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Vérifiez et validez les ordres
          d’investissement des clients.
        </p>
      </div>

      {/* =================================================
          STATISTIQUES
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            En attente
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-800">
            {pendingOrders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Complétés
          </p>

          <p className="mt-2 text-3xl font-bold text-green-800">
            {completedOrders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Refusés
          </p>

          <p className="mt-2 text-3xl font-bold text-red-800">
            {cancelledOrders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total des ordres
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {orders.length}
          </p>
        </div>

      </div>

      {/* =================================================
          ORDRES EN ATTENTE
      ================================================= */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="font-semibold text-slate-900">
            Ordres en attente
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Ces achats doivent être vérifiés
            avant validation.
          </p>

        </div>

        {pendingOrders.length === 0 ? (

          <div className="px-5 py-16 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl">
              ✓
            </div>

            <h3 className="font-semibold text-slate-900">
              Aucun ordre en attente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tous les achats ont été traités.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {pendingOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="p-5"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* CLIENT */}

                    <div className="min-w-0">

                      <p className="font-bold text-slate-900">
                        {order.clientName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.email}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-blue-700">
                        {order.description}
                      </p>

                    </div>

                    {/* INFORMATIONS */}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Quantité
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {order.quantity.toLocaleString(
                            'fr-FR'
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Cours
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {order.unitPrice.toLocaleString(
                            'fr-FR'
                          )}{' '}
                          FCFA
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Montant
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {order.amount.toLocaleString(
                            'fr-FR'
                          )}{' '}
                          FCFA
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Date
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            'fr-FR'
                          )}
                        </p>
                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-col gap-2 sm:flex-row">

                      {/* VALIDER */}

                      <form
                        action={
                          updateOrderStatus
                        }
                      >
                        <input
                          type="hidden"
                          name="orderId"
                          value={
                            order.id
                          }
                        />

                        <input
                          type="hidden"
                          name="action"
                          value="approve"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 active:scale-[0.98]"
                        >
                          ✓ Valider
                        </button>
                      </form>

                      {/* REFUSER */}

                      <form
                        action={
                          updateOrderStatus
                        }
                      >
                        <input
                          type="hidden"
                          name="orderId"
                          value={
                            order.id
                          }
                        />

                        <input
                          type="hidden"
                          name="action"
                          value="reject"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 active:scale-[0.98]"
                        >
                          Refuser
                        </button>
                      </form>

                    </div>

                  </div>

                  <div className="mt-4 flex flex-col gap-1 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">

                    <span className="text-xs font-semibold text-orange-700">
                      En attente de validation
                    </span>

                    <span className="text-[10px] text-orange-600">
                      ID : {order.id}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  )
}