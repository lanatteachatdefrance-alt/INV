import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { BRVM_OFFERS } from '@/lib/brvmOffersData'

export const dynamic = 'force-dynamic'

type Transaction = {
  id: string
  created_at: string
  user_id: string
  type: string | null
  amount: number | string | null
  status: string | null
  description: string | null
  updated_at: string | null
}

type Order = {
  id: string
  symbol: string
  title: string
  type: 'Achat' | 'Vente'
  quantity: number
  price: number
  amount: number
  status: string
  created_at: string
}

/*
 * =====================================================
 * FORMATAGE
 * =====================================================
 */

function formatMoney(value: number | string | null) {
  const amount = Number(value ?? 0)

  return amount.toLocaleString('fr-FR', {
    maximumFractionDigits: 0,
  })
}

function formatQuantity(value: number) {
  return value.toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  })
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/*
 * =====================================================
 * EXTRACTION QUANTITÉ
 * =====================================================
 */

function extractQuantity(description: string | null) {
  if (!description) return 0

  const match = description.match(/(\d+)\s*titre/i)

  return match ? Number(match[1]) : 0
}

/*
 * =====================================================
 * RECHERCHE VALEUR
 * =====================================================
 */

function findOffer(description: string | null) {
  if (!description) return null

  const text = description.toLowerCase()

  return (
    BRVM_OFFERS.find((offer) => {
      return (
        text.includes(offer.symbol.toLowerCase()) ||
        text.includes(offer.title.toLowerCase())
      )
    }) ?? null
  )
}

/*
 * =====================================================
 * TYPE TRANSACTION
 * =====================================================
 */

function formatTransactionType(
  type: string | null
): 'Achat' | 'Vente' {
  if (type === 'vente_investissement') {
    return 'Vente'
  }

  return 'Achat'
}

/*
 * =====================================================
 * STATUT
 * =====================================================
 */

function formatStatus(status: string | null) {
  if (!status) return 'En attente'

  const normalized = status
    .toLowerCase()
    .trim()

  if (
    normalized === 'approved' ||
    normalized === 'complete' ||
    normalized === 'completed' ||
    normalized === 'complété'
  ) {
    return 'Complété'
  }

  if (
    normalized === 'pending' ||
    normalized === 'en_attente' ||
    normalized === 'en attente'
  ) {
    return 'En attente'
  }

  if (
    normalized === 'rejected' ||
    normalized === 'cancelled' ||
    normalized === 'cancelled' ||
    normalized === 'annule' ||
    normalized === 'annulé'
  ) {
    return 'Annulé'
  }

  return status
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default async function OrdersPage() {
  const supabase = createClient()

  /*
   * ===================================================
   * UTILISATEUR
   * ===================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  /*
   * ===================================================
   * TRANSACTIONS
   * ===================================================
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
        updated_at
      `
    )
    .eq('user_id', user.id)
    .in('type', [
      'achat_investissement',
      'vente_investissement',
    ])
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  /*
   * ===================================================
   * TRANSFORMATION
   * ===================================================
   */

  const orders: Order[] = (
    transactions ?? []
  ).map(
    (transaction: Transaction) => {
      const description =
        transaction.description ?? ''

      const quantity =
        extractQuantity(description)

      const offer =
        findOffer(description)

      const amount =
        Number(transaction.amount ?? 0)

      const price =
        quantity > 0
          ? Math.round(amount / quantity)
          : offer?.price_per_share ?? 0

      return {
        id: transaction.id,

        symbol:
          offer?.symbol ?? '—',

        title:
          offer?.title ??
          (description || 'Ordre'),

        type:
          formatTransactionType(
            transaction.type
          ),

        quantity,

        price,

        amount,

        status:
          formatStatus(
            transaction.status
          ),

        created_at:
          transaction.created_at,
      }
    }
  )

  /*
   * ===================================================
   * STATISTIQUES
   * ===================================================
   */

  const totalOrders =
    orders.length

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        'Complété'
    )

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        'En attente'
    )

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status ===
        'Annulé'
    )

  const purchaseOrders =
    orders.filter(
      (order) =>
        order.type ===
        'Achat'
    )

  const saleOrders =
    orders.filter(
      (order) =>
        order.type ===
        'Vente'
    )

  /*
   * ===================================================
   * AFFICHAGE
   * ===================================================
   */

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA]">

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 pb-24 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        {/* =================================================
            EN-TÊTE
        ================================================= */}

        <section className="mb-6">

          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A77C12]">
            ACTIVITÉ
          </p>

          <h1 className="mt-1.5 text-2xl font-black tracking-tight text-[#061B31] sm:text-3xl">
            Mes ordres
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
            Consultez et suivez facilement vos
            opérations d’achat et de vente.
          </p>

        </section>

        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <section className="mb-6">

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            {/* TOTAL */}

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Total
              </p>

              <p className="mt-2 text-2xl font-black text-[#061B31]">
                {totalOrders}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                opérations
              </p>

            </div>

            {/* EN ATTENTE */}

            <div className="rounded-2xl border border-[#D4A72C]/20 bg-[#FFFBF0] p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#A77C12]">
                En attente
              </p>

              <p className="mt-2 text-2xl font-black text-[#061B31]">
                {pendingOrders.length}
              </p>

              <p className="mt-1 text-[11px] text-[#A77C12]/70">
                validation
              </p>

            </div>

            {/* ACHATS */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-600">
                Achats
              </p>

              <p className="mt-2 text-2xl font-black text-blue-800">
                {purchaseOrders.length}
              </p>

              <p className="mt-1 text-[11px] text-blue-600/70">
                ordres
              </p>

            </div>

            {/* VENTES */}

            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-amber-600">
                Ventes
              </p>

              <p className="mt-2 text-2xl font-black text-amber-800">
                {saleOrders.length}
              </p>

              <p className="mt-1 text-[11px] text-amber-600/70">
                ordres
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            HISTORIQUE
        ================================================= */}

        <section>

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                HISTORIQUE
              </p>

              <h2 className="mt-1 text-lg font-black tracking-tight text-[#061B31]">
                Toutes les opérations
              </h2>

            </div>

            <div className="rounded-full border border-[#D4A72C]/20 bg-[#FFFBF0] px-3 py-1.5">

              <span className="text-[10px] font-bold text-[#A77C12]">
                {totalOrders}{' '}
                {totalOrders > 1
                  ? 'opérations'
                  : 'opération'}
              </span>

            </div>

          </div>

          {orders.length === 0 ? (

            /* =================================================
               AUCUN ORDRE
            ================================================= */

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFFBF0] text-xl">
                📋
              </div>

              <h3 className="mt-4 text-sm font-black text-[#061B31]">
                Aucun ordre pour le moment
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                Vos ordres d’achat et de vente
                apparaîtront ici dès qu’une opération
                sera enregistrée.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* =================================================
                  VERSION MOBILE
              ================================================= */}

              <div className="divide-y divide-slate-100 md:hidden">

                {orders.map(
                  (order) => {

                    const isPurchase =
                      order.type ===
                      'Achat'

                    const isCompleted =
                      order.status ===
                      'Complété'

                    const isCancelled =
                      order.status ===
                      'Annulé'

                    return (

                      <div
                        key={order.id}
                        className="p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          {/* VALEUR */}

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <div
                                className={
                                  isPurchase
                                    ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[11px] font-black text-blue-700'
                                    : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[11px] font-black text-amber-700'
                                }
                              >
                                {order.symbol ===
                                '—'
                                  ? 'BR'
                                  : order.symbol}
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-black text-[#061B31]">
                                  {order.title}
                                </p>

                                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  {order.symbol}
                                </p>

                              </div>

                            </div>

                          </div>

                          {/* TYPE */}

                          <span
                            className={
                              isPurchase
                                ? 'shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700'
                                : 'shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700'
                            }
                          >
                            {order.type}
                          </span>

                        </div>

                        {/* INFORMATIONS */}

                        <div className="mt-4 grid grid-cols-2 gap-3">

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Quantité
                            </p>

                            <p className="mt-1 text-sm font-black text-[#061B31]">
                              {order.quantity > 0
                                ? formatQuantity(
                                    order.quantity
                                  )
                                : '—'}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Cours
                            </p>

                            <p className="mt-1 text-sm font-black text-[#061B31]">
                              {order.price > 0
                                ? `${formatMoney(
                                    order.price
                                  )} FCFA`
                                : '—'}
                            </p>

                          </div>

                          <div className="rounded-xl bg-[#FFFBF0] p-3">

                            <p className="text-[9px] font-bold uppercase tracking-wider text-[#A77C12]">
                              Montant
                            </p>

                            <p className="mt-1 text-sm font-black text-[#061B31]">
                              {formatMoney(
                                order.amount
                              )}{' '}
                              FCFA
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Date
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {formatDate(
                                order.created_at
                              )}
                            </p>

                          </div>

                        </div>

                        {/* STATUT */}

                        <div className="mt-3 flex items-center justify-between">

                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Statut
                          </span>

                          <span
                            className={
                              isCompleted
                                ? 'rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600'
                                : isCancelled
                                  ? 'rounded-full bg-red-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-red-600'
                                  : 'rounded-full bg-[#FFFBF0] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#A77C12]'
                            }
                          >
                            {order.status}
                          </span>

                        </div>

                      </div>
                    )
                  }
                )}

              </div>

              {/* =================================================
                  VERSION DESKTOP
              ================================================= */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[900px] text-left">

                  <thead className="border-b border-slate-100 bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Valeur
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Type
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Quantité
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Cours
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Montant
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Statut
                      </th>

                      <th className="px-5 py-4 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {orders.map(
                      (order) => {

                        const isPurchase =
                          order.type ===
                          'Achat'

                        const isCompleted =
                          order.status ===
                          'Complété'

                        const isCancelled =
                          order.status ===
                          'Annulé'

                        return (

                          <tr
                            key={order.id}
                            className="transition-colors hover:bg-slate-50/70"
                          >

                            {/* VALEUR */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div
                                  className={
                                    isPurchase
                                      ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[10px] font-black text-blue-700'
                                      : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[10px] font-black text-amber-700'
                                  }
                                >
                                  {order.symbol ===
                                  '—'
                                    ? 'BR'
                                    : order.symbol}
                                </div>

                                <div className="min-w-0">

                                  <p className="text-sm font-black text-[#061B31]">
                                    {order.title}
                                  </p>

                                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {order.symbol}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* TYPE */}

                            <td className="px-5 py-4">

                              <span
                                className={
                                  isPurchase
                                    ? 'inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700'
                                    : 'inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700'
                                }
                              >
                                {order.type}
                              </span>

                            </td>

                            {/* QUANTITÉ */}

                            <td className="px-5 py-4">

                              <p className="text-sm font-bold text-[#061B31]">
                                {order.quantity > 0
                                  ? formatQuantity(
                                      order.quantity
                                    )
                                  : '—'}
                              </p>

                            </td>

                            {/* COURS */}

                            <td className="px-5 py-4">

                              <p className="text-sm font-semibold text-[#061B31]">
                                {order.price > 0
                                  ? `${formatMoney(
                                      order.price
                                    )} FCFA`
                                  : '—'}
                              </p>

                            </td>

                            {/* MONTANT */}

                            <td className="px-5 py-4">

                              <p className="text-sm font-black text-[#061B31]">
                                {formatMoney(
                                  order.amount
                                )}{' '}
                                FCFA
                              </p>

                            </td>

                            {/* STATUT */}

                            <td className="px-5 py-4">

                              <span
                                className={
                                  isCompleted
                                    ? 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600'
                                    : isCancelled
                                      ? 'inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-600'
                                      : 'inline-flex rounded-full bg-[#FFFBF0] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#A77C12]'
                                }
                              >
                                {order.status}
                              </span>

                            </td>

                            {/* DATE */}

                            <td className="px-5 py-4 text-xs font-medium text-slate-500">

                              {formatDate(
                                order.created_at
                              )}

                            </td>

                          </tr>

                        )
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>

        {/* =================================================
            RÉSUMÉ FINAL
        ================================================= */}

        {orders.length > 0 && (

          <section className="mt-6">

            <div className="rounded-3xl border border-[#D4A72C]/20 bg-[#061B31] p-5 text-white shadow-sm sm:p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D4A72C] text-sm font-black text-[#061B31]">
                  IB
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A72C]">
                    SUIVI DES OPÉRATIONS
                  </p>

                  <h2 className="mt-1 text-base font-bold">
                    Vos ordres en un coup d’œil
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6">
                    Les ordres en attente nécessitent
                    une validation administrative.
                    Une fois validés, ils apparaissent
                    comme complétés dans votre historique.
                  </p>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">

                <div className="rounded-2xl bg-white/5 p-3">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                    Complétés
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    {completedOrders.length}
                  </p>

                </div>

                <div className="rounded-2xl bg-white/5 p-3">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                    En attente
                  </p>

                  <p className="mt-1 text-lg font-black text-[#D4A72C]">
                    {pendingOrders.length}
                  </p>

                </div>

                <div className="rounded-2xl bg-white/5 p-3">

                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                    Annulés
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    {cancelledOrders.length}
                  </p>

                </div>

              </div>

            </div>

          </section>

        )}

      </div>

    </div>
  )
}