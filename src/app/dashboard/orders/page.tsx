'use client'

import { useEffect, useState } from 'react'

type Order = {
  id: string
  symbol: string
  type: string
  quantity: number
  price: number
  status: string
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pour l'instant, on initialise la page sans données.
    // La connexion aux vraies données sera faite ensuite.
    setOrders([])
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Ordres
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Suivez vos ordres d’achat et de vente.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Historique des ordres
          </h2>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : orders.length === 0 ? (
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
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Valeur</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Quantité</th>
                  <th className="px-5 py-3">Cours</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {order.symbol}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.type}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.quantity}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.price.toLocaleString('fr-FR')} FCFA
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.status}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}