import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import PrintStatementButton from '@/components/admin/PrintStatementButton'

export const dynamic = 'force-dynamic'

type Transaction = {
  id: string
  created_at: string | null
  type: string | null
  amount: number | string | null
  status: string | null
  description: string | null
}

type DividendPayment = {
  id: string
  amount: number | string | null
  status: string | null
  paid_at: string | null
  created_at: string | null
  dividends: {
    company_name: string | null
    symbol: string | null
  } | null
}

type HistoryItem = {
  id: string
  date: string | null
  type: string
  description: string
  amount: number
  status: string
}

function formatMoney(value: number | string | null | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR', {
    maximumFractionDigits: 0,
  })} FCFA`
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function normalizeStatus(status: string | null) {
  const value = (status ?? '').toLowerCase().trim()

  if ([
    'approved', 'complete', 'completed', 'complété', 'completé',
    'validé', 'valide', 'paid',
  ].includes(value)) return 'Validé'

  if (['pending', 'en_attente', 'en attente'].includes(value)) {
    return 'En attente'
  }

  if ([
    'rejected', 'cancelled', 'canceled', 'annulé', 'annule',
  ].includes(value)) return 'Rejeté / Annulé'

  return status || 'Non renseigné'
}

function isValidated(status: string | null) {
  return normalizeStatus(status) === 'Validé'
}

function getTypeLabel(type: string | null) {
  switch ((type ?? '').toLowerCase()) {
    case 'deposit': return 'Dépôt'
    case 'withdraw':
    case 'withdrawal': return 'Retrait'
    case 'achat_investissement': return 'Achat d’actions'
    case 'vente_investissement': return 'Vente d’actions'
    default: return type || 'Opération'
  }
}

export default async function PersonalStatementPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Toutes les requêtes sont liées à l'identifiant de la session,
  // aucun identifiant client n'est accepté depuis l'URL.
  const [
    { data: client, error: clientError },
    { data: transactionData, error: transactionError },
    { data: dividendData, error: dividendError },
  ] = await Promise.all([
    supabase
      .from('users')
      .select('id, email, first_name, last_name, balance, kyc_status')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('transactions')
      .select('id, created_at, type, amount, status, description')
      .eq('user_id', user.id)
      .in('type', [
        'deposit', 'withdraw', 'withdrawal',
        'achat_investissement', 'vente_investissement',
      ])
      .order('created_at', { ascending: false }),
    supabase
      .from('dividend_payments')
      .select(`
        id,
        amount,
        status,
        paid_at,
        created_at,
        dividends (
          company_name,
          symbol
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  if (clientError) throw new Error(`Erreur lors du chargement du profil : ${clientError.message}`)
  if (transactionError) throw new Error(`Erreur lors du chargement des opérations : ${transactionError.message}`)
  if (dividendError) throw new Error(`Erreur lors du chargement des dividendes : ${dividendError.message}`)
  if (!client) redirect('/dashboard')

  const transactions = (transactionData ?? []) as Transaction[]
  const dividends = (dividendData ?? []) as unknown as DividendPayment[]

  const totals = [
    {
      label: 'Dépôts validés',
      value: transactions
        .filter((item) => item.type === 'deposit' && isValidated(item.status))
        .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    },
    {
      label: 'Retraits validés',
      value: transactions
        .filter((item) => ['withdraw', 'withdrawal'].includes(item.type ?? '') && isValidated(item.status))
        .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    },
    {
      label: 'Achats validés',
      value: transactions
        .filter((item) => item.type === 'achat_investissement' && isValidated(item.status))
        .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    },
    {
      label: 'Ventes validées',
      value: transactions
        .filter((item) => item.type === 'vente_investissement' && isValidated(item.status))
        .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    },
    {
      label: 'Dividendes payés',
      value: dividends
        .filter((item) => item.status?.toLowerCase() === 'paid')
        .reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    },
  ]

  const history: HistoryItem[] = [
    ...transactions.map((item) => ({
      id: `transaction-${item.id}`,
      date: item.created_at,
      type: getTypeLabel(item.type),
      description: item.description || getTypeLabel(item.type),
      amount: Number(item.amount ?? 0),
      status: normalizeStatus(item.status),
    })),
    ...dividends.map((item) => ({
      id: `dividend-${item.id}`,
      date: item.paid_at || item.created_at,
      type: 'Dividende',
      description: `Dividende ${item.dividends?.company_name || item.dividends?.symbol || ''}`.trim(),
      amount: Number(item.amount ?? 0),
      status: normalizeStatus(item.status),
    })),
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())

  const clientName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Client'

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/dashboard/orders"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Retour à mon historique
          </Link>
          <PrintStatementButton />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:rounded-none print:border-0 print:shadow-none">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">INVESTIR EN BOURSE</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">Relevé d’activité financière</h1>
              <p className="mt-1 text-sm text-slate-500">Votre historique personnel des opérations et dividendes</p>
            </div>
            <div className="text-sm text-slate-500 md:text-right">
              <p>Date d’édition</p>
              <p className="font-semibold text-slate-900">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Informations du client</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">{clientName}</h2>
              <p className="mt-1 text-sm text-slate-600">{client.email || user.email}</p>
              <p className="mt-2 text-sm text-slate-600">Statut KYC : {client.kyc_status || 'Non renseigné'}</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-semibold uppercase text-slate-400">Solde actuel du compte</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatMoney(client.balance)}</p>
              <p className="mt-1 text-xs text-slate-500">Solde enregistré au moment de l’édition</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {totals.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{formatMoney(item.value)}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900">Historique des opérations</h2>
            <p className="mt-1 text-sm text-slate-500">{history.length} opération(s) enregistrée(s)</p>
          </div>
          {history.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">Aucune opération ou distribution de dividendes trouvée.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4 text-right">Montant</th>
                    <th className="px-5 py-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(item.date)}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">{item.type}</td>
                      <td className="px-5 py-4 text-slate-600">{item.description}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-900">{formatMoney(item.amount)}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-xs text-slate-500 print:mt-6">
          Ce document présente les opérations et paiements enregistrés sur votre compte. Le solde actuel correspond au solde du compte au moment de l’édition.
        </p>
      </div>
    </main>
  )
}