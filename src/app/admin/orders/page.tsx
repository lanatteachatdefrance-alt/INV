import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'

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

function formatStatus(
  status: string | null
) {
  const normalized =
    status?.toLowerCase().trim() ?? ''

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

export default async function AdminOrdersPage() {
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
  // VÉRIFICATION ADMIN
  // =====================================================

  const isAdmin =
    await ensureAdminAccess(
      supabase,
      user
    )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  // =====================================================
  // RÉCUPÉRATION DES TRANSACTIONS
  // =====================================================

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
    throw new Error(error.message)
  }

  // =====================================================
  // UTILISATEURS
  // =====================================================

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

  // =====================================================
  // TRANSFORMATION
  // =====================================================

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

  // =====================================================
  // ORDRES EN ATTENTE
  // =====================================================

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

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

                      <button
                        type="button"
                        disabled
                        className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white opacity-50 cursor-not-allowed"
                      >
                        ✓ Valider
                      </button>

                      <button
                        type="button"
                        disabled
                        className="rounded-xl bg-red-50 border border-red-200 px-5 py-2.5 text-sm font-bold text-red-700 opacity-50 cursor-not-allowed"
                      >
                        Refuser
                      </button>

                    </div>

                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 border border-orange-100 px-3 py-2">

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