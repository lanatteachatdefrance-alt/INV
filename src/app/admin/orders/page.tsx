import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

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
  role?: string | null
}

type Order = {
  id: string
  user_id: string
  clientName: string
  email: string
  description: string
  type: 'achat' | 'vente'
  quantity: number
  unitPrice: number
  amount: number
  status: string
  createdAt: string
}

type DividendPayment = {
  id: string
  dividend_id: string
  user_id: string
  shares_eligible: number | string
  amount: number | string
  status: string
  paid_at: string | null
  created_at: string

  dividends:
    | {
        symbol: string
        company_name: string
        dividend_per_share: number | string
        ex_date: string
        payment_date: string
      }
    | {
        symbol: string
        company_name: string
        dividend_per_share: number | string
        ex_date: string
        payment_date: string
      }[]
    | null
}

/*
 * =====================================================
 * FORMATAGE
 * =====================================================
 */

function formatMoney(
  value: number | string | null
) {
  const amount = Number(value ?? 0)

  return amount.toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  })
}

function formatStatus(
  status: string | null
) {
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

function formatOrderType(
  type: string | null
): 'achat' | 'vente' {
  if (type === 'vente_investissement') {
    return 'vente'
  }

  return 'achat'
}

/*
 * =====================================================
 * VALIDATION / REFUS ORDRE
 * =====================================================
 */

async function updateOrderStatus(
  formData: FormData
) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin =
    await ensureAdminAccess(
      supabase,
      user
    )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from('transactions')
    .select(`
      id,
      user_id,
      status,
      type,
      amount,
      offer_id,
      quantity,
      unit_price
    `)
    .eq('id', orderId)
    .in('type', [
      'achat_investissement',
      'vente_investissement',
    ])
    .single()

  if (orderError || !order) {
    throw new Error(
      'Ordre introuvable.'
    )
  }

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
      .eq('status', 'pending')

    if (error) {
      throw new Error(
        `Impossible de refuser l’ordre : ${error.message}`
      )
    }

    revalidatePath('/admin/orders')
    revalidatePath('/dashboard/orders')
    revalidatePath('/dashboard/investments')
    revalidatePath('/dashboard/portfolio')

    return
  }

  /*
   * =====================================================
   * VENTE
   * =====================================================
   */

  if (
    order.type ===
    'vente_investissement'
  ) {
    if (!order.offer_id) {
      throw new Error(
        'Cette vente ne possède aucune valeur associée.'
      )
    }

    const quantity =
      Number(order.quantity ?? 0)

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        'La quantité de titres à vendre est invalide.'
      )
    }

    const amount =
      Number(order.amount ?? 0)

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        'Le montant de la vente est invalide.'
      )
    }

    const unitPrice =
      Number(order.unit_price ?? 0)

    if (
      !Number.isFinite(unitPrice) ||
      unitPrice <= 0
    ) {
      throw new Error(
        'Le cours de vente est invalide.'
      )
    }

    const expectedAmount =
      quantity * unitPrice

    if (
      Math.abs(
        expectedAmount - amount
      ) > 0.01
    ) {
      throw new Error(
        'Le montant de la vente ne correspond pas à la quantité et au cours.'
      )
    }

    const {
      error: updateError,
    } = await supabase
      .from('transactions')
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at:
          new Date().toISOString(),
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        'id',
        orderId
      )
      .eq(
        'type',
        'vente_investissement'
      )
      .eq(
        'status',
        'pending'
      )

    if (updateError) {
      throw new Error(
        `Impossible de valider la vente : ${updateError.message}`
      )
    }

    revalidatePath('/admin/orders')
    revalidatePath('/dashboard/orders')
    revalidatePath('/dashboard/investments')
    revalidatePath('/dashboard/portfolio')

    return
  }

  /*
   * =====================================================
   * ACHAT
   * =====================================================
   */

  if (
    order.type ===
    'achat_investissement'
  ) {
    if (!order.offer_id) {
      throw new Error(
        'Cette commande ne possède aucune valeur associée.'
      )
    }

    const {
      data: offer,
      error: offerError,
    } = await supabase
      .from('investment_offers')
      .select(`
        id,
        title,
        price_per_share,
        is_active
      `)
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

    const quantity =
      Number(order.quantity ?? 0)

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        'La quantité de titres est invalide.'
      )
    }

    const purchasePrice =
      Number(order.unit_price ?? 0)

    if (
      !Number.isFinite(purchasePrice) ||
      purchasePrice <= 0
    ) {
      throw new Error(
        'Le cours d’achat est invalide.'
      )
    }

    const amount =
      Number(order.amount ?? 0)

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        'Le montant de l’ordre est invalide.'
      )
    }

    const expectedAmount =
      quantity * purchasePrice

    if (
      Math.abs(
        expectedAmount - amount
      ) > 0.01
    ) {
      throw new Error(
        'Le montant de l’ordre ne correspond pas à la quantité et au cours.'
      )
    }

    const currentPrice =
      Number(
        offer.price_per_share ?? 0
      )

    if (
      !Number.isFinite(currentPrice) ||
      currentPrice <= 0
    ) {
      throw new Error(
        'Le cours actuel de cette valeur est indisponible.'
      )
    }

    const currentValue =
      quantity * currentPrice

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
      .eq(
        'id',
        orderId
      )
      .eq(
        'type',
        'achat_investissement'
      )
      .eq(
        'status',
        'pending'
      )

    if (updateError) {
      throw new Error(
        `La position a été créée mais l’ordre n’a pas pu être validé : ${updateError.message}`
      )
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/investments')
  revalidatePath('/dashboard/portfolio')
}

/*
 * =====================================================
 * VALIDATION DIVIDENDE
 * =====================================================
 */

async function processDividendPayment(
  formData: FormData
) {
  'use server'

  const paymentId = String(
    formData.get('paymentId') ?? ''
  ).trim()

  if (!paymentId) {
    throw new Error(
      'Identifiant du paiement manquant.'
    )
  }

  /*
   * ===================================================
   * CLIENT SUPABASE AUTHENTIFIÉ
   * ===================================================
   */

  const supabase = createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login')
  }

  /*
   * ===================================================
   * VÉRIFICATION ADMINISTRATEUR
   * ===================================================
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
   * ===================================================
   * APPEL RPC
   * ===================================================
   *
   * IMPORTANT :
   *
   * La fonction PostgreSQL possède cette signature :
   *
   * process_dividend_payment(
   *   p_dividend_payment_id uuid
   * )
   *
   * Elle ne possède PAS de p_admin_id.
   *
   * C'est donc volontairement le seul paramètre envoyé.
   */

  const {
    data,
    error,
  } = await supabase.rpc(
    'process_dividend_payment',
    {
      p_dividend_payment_id:
        paymentId,
    }
  )

  /*
   * ===================================================
   * ERREUR RPC
   * ===================================================
   */

  if (error) {
    throw new Error(
      `Impossible de créditer le dividende : ${error.message}`
    )
  }

  /*
   * ===================================================
   * VÉRIFICATION RÉSULTAT
   * ===================================================
   */

  if (!data?.success) {
    throw new Error(
      'Le paiement du dividende n’a pas pu être effectué.'
    )
  }

  /*
   * ===================================================
   * RAFRAÎCHISSEMENT
   * ===================================================
   */

  revalidatePath('/admin/orders')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/portfolio')
  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard/investments')

  return
}

/*
 * =====================================================
 * REFUS DIVIDENDE
 * =====================================================
 */

async function rejectDividendPayment(
  formData: FormData
) {
  'use server'

  const paymentId = String(
    formData.get('paymentId') ?? ''
  )

  if (!paymentId) {
    throw new Error(
      'Identifiant du paiement manquant.'
    )
  }

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin =
    await ensureAdminAccess(
      supabase,
      user
    )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  const {
    data: payment,
    error: paymentError,
  } = await supabase
    .from('dividend_payments')
    .select(
      'id, status'
    )
    .eq(
      'id',
      paymentId
    )
    .single()

  if (
    paymentError ||
    !payment
  ) {
    throw new Error(
      'Paiement de dividende introuvable.'
    )
  }

  if (
    payment.status !==
    'pending'
  ) {
    throw new Error(
      'Ce paiement de dividende a déjà été traité.'
    )
  }

  const {
    error,
  } = await supabase
    .from('dividend_payments')
    .update({
      status: 'cancelled',
      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      paymentId
    )
    .eq(
      'status',
      'pending'
    )

  if (error) {
    throw new Error(
      `Impossible de refuser le dividende : ${error.message}`
    )
  }

  revalidatePath('/admin/orders')
}

/*
 * =====================================================
 * PAGE ADMIN
 * =====================================================
 */

export default async function AdminOrdersPage() {

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
   * ACHATS + VENTES
   * =====================================================
   */

  const {
    data: transactions,
    error,
  } = await supabase
    .from('transactions')
    .select(`
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
    `)
    .in('type', [
      'achat_investissement',
      'vente_investissement',
    ])
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
   * DIVIDENDES
   * =====================================================
   */

  const {
    data: dividendPayments,
    error: dividendError,
  } = await supabase
    .from('dividend_payments')
    .select(`
      id,
      dividend_id,
      user_id,
      shares_eligible,
      amount,
      status,
      paid_at,
      created_at,

      dividends (
        symbol,
        company_name,
        dividend_per_share,
        ex_date,
        payment_date
      )
    `)
    .order(
      'created_at',
      {
        ascending: false,
      }
    )

  if (dividendError) {
    throw new Error(
      dividendError.message
    )
  }

  /*
   * =====================================================
   * IDS UTILISATEURS
   * =====================================================
   */

  const orderUserIds =
    Array.from(
      new Set(
        (transactions ?? [])
          .map(
            transaction =>
              transaction.user_id
          )
          .filter(Boolean)
      )
    )

  const dividendUserIds =
    Array.from(
      new Set(
        (dividendPayments ?? [])
          .map(
            payment =>
              payment.user_id
          )
          .filter(Boolean)
      )
    )

  const userIds =
    Array.from(
      new Set([
        ...orderUserIds,
        ...dividendUserIds,
      ])
    )

  /*
   * =====================================================
   * PROFILS
   * =====================================================
   */

  let profiles:
    UserProfile[] = []

  if (userIds.length > 0) {

    const {
      data: userProfiles,
    } = await supabase
      .from('users')
      .select(
        'id, email, first_name, last_name, role'
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
   * TRANSFORMATION ORDRES
   * =====================================================
   */

  const orders: Order[] =
    (transactions ?? []).map(
      (
        transaction: Transaction
      ) => {

        const profile =
          profiles.find(
            item =>
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

          id:
            transaction.id,

          user_id:
            transaction.user_id,

          clientName,

          email:
            profile?.email ||
            'Email non renseigné',

          description:
            transaction.description ||
            'Ordre d’investissement',

          type:
            formatOrderType(
              transaction.type
            ),

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
   * DIVIDENDES EN ATTENTE
   * =====================================================
   */

  const pendingDividends =
    (dividendPayments ?? []).filter(
      payment =>
        payment.status ===
        'pending'
    ) as DividendPayment[]

  /*
   * =====================================================
   * STATISTIQUES
   * =====================================================
   */

  const pendingOrders =
    orders.filter(
      order =>
        order.status ===
        'En attente'
    )

  const completedOrders =
    orders.filter(
      order =>
        order.status ===
        'Complété'
    )

  const cancelledOrders =
    orders.filter(
      order =>
        order.status ===
        'Annulé'
    )

  const pendingPurchases =
    pendingOrders.filter(
      order =>
        order.type ===
        'achat'
    )

  const pendingSales =
    pendingOrders.filter(
      order =>
        order.type ===
        'vente'
    )

  /*
   * =====================================================
   * TOTAL DIVIDENDES
   * =====================================================
   */

  const pendingDividendAmount =
    pendingDividends.reduce(
      (
        sum,
        payment
      ) =>
        sum +
        Number(
          payment.amount ?? 0
        ),
      0
    )

  /*
   * =====================================================
   * AFFICHAGE
   * =====================================================
   */

  return (

    <div className="space-y-6 p-6">

      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <div>

        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Validation des opérations
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Gérez les achats, les ventes et les
          distributions de dividendes.
        </p>

      </div>

      {/* =================================================
          STATISTIQUES
      ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">
            En attente
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-800">
            {pendingOrders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Achats
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-800">
            {pendingPurchases.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Ventes
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-800">
            {pendingSales.length}
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

        <div className="rounded-2xl border border-[#D4A72C]/30 bg-[#FFFBF0] p-5">

          <p className="text-xs font-semibold uppercase tracking-wider text-[#A77C12]">
            Dividendes
          </p>

          <p className="mt-2 text-3xl font-bold text-[#8B6508]">
            {pendingDividends.length}
          </p>

          <p className="mt-1 text-xs font-medium text-[#A77C12]">
            {formatMoney(
              pendingDividendAmount
            )}{' '}
            FCFA
          </p>

        </div>

      </div>

      {/* =================================================
          ORDRES
      ================================================= */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="font-semibold text-slate-900">
            Ordres d’investissement
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Les achats et ventes nécessitant
            une validation administrative.
          </p>

        </div>

        {pendingOrders.length === 0 ? (

          <div className="px-5 py-12 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600">
              ✓
            </div>

            <h3 className="font-semibold text-slate-900">
              Aucun ordre en attente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tous les achats et ventes ont été traités.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {pendingOrders.map(
              order => (

                <div
                  key={order.id}
                  className="p-5"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <span
                          className={
                            order.type ===
                            'vente'
                              ? 'rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700'
                              : 'rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700'
                          }
                        >
                          {order.type ===
                          'vente'
                            ? 'Vente'
                            : 'Achat'}
                        </span>

                      </div>

                      <p className="mt-2 font-bold text-slate-900">
                        {order.clientName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.email}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {order.description}
                      </p>

                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Quantité
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {formatMoney(
                            order.quantity
                          )}
                        </p>

                      </div>

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Cours
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {formatMoney(
                            order.unitPrice
                          )}{' '}
                          FCFA
                        </p>

                      </div>

                      <div>

                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Montant
                        </p>

                        <p
                          className={
                            order.type ===
                            'vente'
                              ? 'mt-1 font-bold text-amber-700'
                              : 'mt-1 font-bold text-slate-900'
                          }
                        >
                          {formatMoney(
                            order.amount
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

                    <div className="flex flex-col gap-2 sm:flex-row">

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
                          className={
                            order.type ===
                            'vente'
                              ? 'w-full rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700 active:scale-[0.98]'
                              : 'w-full rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 active:scale-[0.98]'
                          }
                        >
                          ✓ Valider
                        </button>

                      </form>

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
                      {order.type ===
                      'vente'
                        ? 'Vente en attente de validation'
                        : 'Achat en attente de validation'}
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

      {/* =================================================
          DIVIDENDES
      ================================================= */}

      <div className="overflow-hidden rounded-3xl border border-[#D4A72C]/25 bg-white shadow-sm">

        <div className="border-b border-[#D4A72C]/15 bg-[#FFFBF0] px-5 py-5">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4A72C] font-black text-[#061B31]">
                  D
                </span>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Dividendes
                  </h2>

                  <p className="text-xs text-slate-500">
                    Validation et crédit des dividendes
                    des clients.
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-full border border-[#D4A72C]/25 bg-white px-3 py-1.5">

              <span className="text-xs font-bold text-[#A77C12]">
                {pendingDividends.length}{' '}
                en attente
              </span>

            </div>

          </div>

        </div>

        {pendingDividends.length === 0 ? (

          <div className="px-5 py-14 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600">
              ✓
            </div>

            <h3 className="font-semibold text-slate-900">
              Aucun dividende en attente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tous les dividendes générés ont été traités.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {pendingDividends.map(
              payment => {

                const dividend =
                  Array.isArray(
                    payment.dividends
                  )
                    ? payment.dividends[0]
                    : payment.dividends

                const profile =
                  profiles.find(
                    item =>
                      item.id ===
                      payment.user_id
                  )

                const clientName =
                  [
                    profile?.first_name,
                    profile?.last_name,
                  ]
                    .filter(Boolean)
                    .join(' ') ||
                  'Client'

                const shares =
                  Number(
                    payment.shares_eligible
                  )

                const dividendPerShare =
                  Number(
                    dividend?.dividend_per_share ??
                    0
                  )

                const amount =
                  Number(
                    payment.amount
                  )

                return (

                  <div
                    key={
                      payment.id
                    }
                    className="p-5"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <span className="rounded-full bg-[#FFF4CC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B6508]">
                            Dividende
                          </span>

                          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                            En attente
                          </span>

                        </div>

                        <p className="mt-2 font-bold text-slate-900">
                          {clientName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {profile?.email ||
                            'Email non renseigné'}
                        </p>

                        <p className="mt-2 text-sm font-bold text-[#061B31]">
                          {dividend?.company_name ||
                            'Société'}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#A77C12]">
                          {dividend?.symbol ||
                            '—'}
                        </p>

                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            Actions
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {formatMoney(
                              shares
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            Dividende / action
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {formatMoney(
                              dividendPerShare
                            )}{' '}
                            FCFA
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            À créditer
                          </p>

                          <p className="mt-1 font-black text-[#A77C12]">
                            {formatMoney(
                              amount
                            )}{' '}
                            FCFA
                          </p>

                        </div>

                        <div>

                          <p className="text-[10px] uppercase tracking-wider text-slate-400">
                            Paiement prévu
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {dividend?.payment_date
                              ? new Date(
                                  dividend.payment_date
                                ).toLocaleDateString(
                                  'fr-FR'
                                )
                              : '—'}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">

                        <form
                          action={
                            processDividendPayment
                          }
                        >

                          <input
                            type="hidden"
                            name="paymentId"
                            value={
                              payment.id
                            }
                          />

                          <button
                            type="submit"
                            className="w-full rounded-xl bg-[#D4A72C] px-5 py-2.5 text-sm font-bold text-[#061B31] transition hover:bg-[#C49820] active:scale-[0.98]"
                          >
                            ✓ Créditer
                          </button>

                        </form>

                        <form
                          action={
                            rejectDividendPayment
                          }
                        >

                          <input
                            type="hidden"
                            name="paymentId"
                            value={
                              payment.id
                            }
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

                    <div className="mt-4 flex flex-col gap-1 rounded-xl border border-[#D4A72C]/15 bg-[#FFFBF0] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">

                      <span className="text-xs font-semibold text-[#8B6508]">
                        Dividende de{' '}
                        {dividend?.symbol ||
                          'la valeur'}
                        {' '}en attente de crédit
                      </span>

                      <span className="text-[10px] text-[#A77C12]">
                        ID : {payment.id}
                      </span>

                    </div>

                  </div>

                )
              }
            )}

          </div>

        )}

      </div>

    </div>
  )
}