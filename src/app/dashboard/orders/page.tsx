import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { BRVM_OFFERS } from '@/lib/brvmOffersData'

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
  type: string
  quantity: number
  price: number
  amount: number
  status: string
  created_at: string
}

function extractQuantity(description: string | null) {
  if (!description) return 0

  const match = description.match(/(\d+)\s*titre/i)

  return match ? Number(match[1]) : 0
}

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

function formatTransactionType(type: string | null) {
  if (!type) return 'Ordre'

  if (type === 'achat_investissement') {
    return 'Achat'
  }

  if (type === 'vente_investissement') {
    return 'Vente'
  }

  return type
}

function formatStatus(status: string | null) {
  if (!status) return 'En attente'

  const normalized = status.toLowerCase().trim()

 if (
  normalized === 'complété' ||
  normalized === 'complete' ||
  normalized === 'completed' ||
  normalized === 'approved'
) {
  return 'Complété'
}

  if (
    normalized === 'en_attente' ||
    normalized === 'pending' ||
    normalized === 'en attente'
  ) {
    return 'En attente'
  }

  if (
    normalized === 'annulé' ||
    normalized === 'annule' ||
    normalized === 'cancelled'
  ) {
    return 'Annulé'
  }

  return status
}

export default async function OrdersPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(
      'id, created_at, user_id, type, amount, status, description, updated_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const orders: Order[] = (transactions ?? []).map(
    (transaction: Transaction) => {
      const description = transaction.description ?? ''
      const quantity = extractQuantity(description)
      const offer = findOffer(description)

      const amount = Number(transaction.amount ?? 0)

      const price =
        quantity > 0
          ? Math.round(amount / quantity)
          : offer?.price_per_share ?? 0

      return {
        id: transaction.id,
        symbol: offer?.symbol ?? '—',
        title: offer?.title ?? (description || 'Ordre'),
        type: formatTransactionType(transaction.type),
        quantity,
        price,
        amount,
        status: formatStatus(transaction.status),
        created_at: transaction.created_at,
      }
    }
  )

  return (
    <div className="fin-page fin-section space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ordres
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Suivez vos ordres d’achat et de vente.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Historique des ordres
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {orders.length}{' '}
              {orders.length > 1 ? 'ordres enregistrés' : 'ordre enregistré'}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
              📋
            </div>

            <h3 className="font-semibold text-slate-900">
              Aucun ordre
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Vous n’avez encore aucun ordre d’achat ou de vente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3 font-semibold">
                    Valeur
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Type
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Quantité
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Cours
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Montant
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Statut
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const completed =
                    order.status.toLowerCase() === 'complété'

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {order.symbol}
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5 max-w-[220px] truncate">
                            {order.title}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {order.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {order.quantity > 0
                          ? order.quantity.toLocaleString('fr-FR')
                          : '—'}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-900">
                        {order.price > 0
                          ? `${order.price.toLocaleString('fr-FR')} FCFA`
                          : '—'}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {order.amount.toLocaleString('fr-FR')} FCFA
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            completed
                              ? 'bg-green-50 text-green-700'
                              : 'bg-orange-50 text-orange-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {new Date(order.created_at).toLocaleDateString(
                          'fr-FR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}