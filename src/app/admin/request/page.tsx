import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

type Withdrawal = {
  id: string
  created_at: string
  user_id: string
  amount: number | string | null
  status: string | null
  description: string | null
  withdrawal_method: string | null
  withdrawal_provider: string | null
  withdrawal_account: string | null
  withdrawal_name: string | null
  rejection_reason: string | null
}

type UserProfile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
}

function formatStatus(status: string | null) {
  const normalized = status?.toLowerCase().trim() ?? ''

  if (normalized === 'approved') return 'Validée'
  if (normalized === 'rejected') return 'Rejetée'

  return 'En attente'
}

function formatMethod(method: string | null) {
  if (method === 'mobile_money') return 'Mobile Money'
  if (method === 'bank_transfer') return 'Virement bancaire'

  return method || 'Non renseigné'
}

/*
 * =====================================================
 * TRAITEMENT D'UNE DEMANDE
 * =====================================================
 */

async function updateRequest(formData: FormData) {
  'use server'

  const transactionId = String(
    formData.get('transactionId') ?? ''
  )

  const action = String(
    formData.get('action') ?? ''
  )

  if (!transactionId) {
    throw new Error('Identifiant de la demande manquant.')
  }

  if (action !== 'approve' && action !== 'reject') {
    throw new Error('Action invalide.')
  }

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await ensureAdminAccess(
    supabase,
    user
  )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  /*
   * Récupération de la demande
   */

  const {
    data: transaction,
    error: transactionError,
  } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .eq('type', 'withdraw')
    .single()

  if (transactionError || !transaction) {
    throw new Error('Demande de retrait introuvable.')
  }

  /*
   * Une demande déjà traitée ne peut plus être modifiée.
   */

  const currentStatus =
    transaction.status?.toLowerCase().trim()

  if (
    currentStatus !== 'pending' &&
    currentStatus !== 'en_attente' &&
    currentStatus !== 'en attente'
  ) {
    throw new Error(
      'Cette demande a déjà été traitée.'
    )
  }

  /*
   * =====================================================
   * REJET
   * =====================================================
   */

  if (action === 'reject') {
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'rejected',
        rejection_reason:
          'Demande de retrait rejetée par l’administrateur.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .eq('type', 'withdraw')
      .eq('status', 'pending')

    if (error) {
      throw new Error(
        `Impossible de rejeter la demande : ${error.message}`
      )
    }

    revalidatePath('/admin/requests')
    revalidatePath('/dashboard')

    return
  }

  /*
   * =====================================================
   * VALIDATION
   * =====================================================
   *
   * Le trigger Supabase s'occupe du débit
   * lorsque status passe à approved.
   */

  const amount = Number(transaction.amount ?? 0)

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      'Le montant du retrait est invalide.'
    )
  }

  /*
   * Vérification supplémentaire du solde
   * avant validation.
   */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('users')
    .select('balance')
    .eq('id', transaction.user_id)
    .single()

  if (profileError || !profile) {
    throw new Error(
      'Impossible de récupérer le solde du client.'
    )
  }

  const balance = Number(profile.balance ?? 0)

  if (amount > balance) {
    throw new Error(
      'Le solde du client est insuffisant pour valider ce retrait.'
    )
  }

  /*
   * Passage à approved.
   *
   * Le trigger de la base doit alors débiter
   * le solde du client.
   */

  const { error: updateError } = await supabase
    .from('transactions')
    .update({
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .eq('type', 'withdraw')
    .eq('status', 'pending')

  if (updateError) {
    throw new Error(
      `Impossible de valider la demande : ${updateError.message}`
    )
  }

  revalidatePath('/admin/requests')
  revalidatePath('/dashboard')
}

/*
 * =====================================================
 * PAGE
 * =====================================================
 */

export default async function AdminRequestsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await ensureAdminAccess(
    supabase,
    user
  )

  if (!isAdmin) {
    redirect('/dashboard')
  }

  /*
   * =====================================================
   * RÉCUPÉRATION DES RETRAITS
   * =====================================================
   */

  const {
    data: withdrawals,
    error,
  } = await supabase
    .from('transactions')
    .select(
      `
        id,
        created_at,
        user_id,
        amount,
        status,
        description,
        withdrawal_method,
        withdrawal_provider,
        withdrawal_account,
        withdrawal_name,
        rejection_reason
      `
    )
    .eq('type', 'withdraw')
    .order('created_at', {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  /*
   * =====================================================
   * CLIENTS
   * =====================================================
   */

  const userIds = Array.from(
    new Set(
      (withdrawals ?? [])
        .map((item) => item.user_id)
        .filter(Boolean)
    )
  )

  let profiles: UserProfile[] = []

  if (userIds.length > 0) {
    const { data } = await supabase
      .from('users')
      .select(
        'id, email, first_name, last_name'
      )
      .in('id', userIds)

    profiles = data ?? []
  }

  /*
   * =====================================================
   * STATISTIQUES
   * =====================================================
   */

  const pending = (withdrawals ?? []).filter(
    (item) => {
      const status =
        item.status?.toLowerCase().trim()

      return (
        status === 'pending' ||
        status === 'en_attente' ||
        status === 'en attente'
      )
    }
  )

  const approved = (withdrawals ?? []).filter(
    (item) =>
      item.status?.toLowerCase().trim() ===
      'approved'
  )

  const rejected = (withdrawals ?? []).filter(
    (item) =>
      item.status?.toLowerCase().trim() ===
      'rejected'
  )

  /*
   * =====================================================
   * AFFICHAGE
   * =====================================================
   */

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* EN-TÊTE */}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Demandes
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Gérez les demandes de retrait des clients.
        </p>
      </div>

      {/* STATISTIQUES */}

      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
            En attente
          </p>

          <p className="mt-2 text-3xl font-bold text-orange-800">
            {pending.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Validées
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {approved.length}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600">
            Rejetées
          </p>

          <p className="mt-2 text-3xl font-bold text-red-800">
            {rejected.length}
          </p>
        </div>

      </div>

      {/* DEMANDES */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="font-bold text-slate-900">
            Demandes de retrait
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Vérifiez les informations avant de valider
            une demande.
          </p>

        </div>

        {pending.length === 0 ? (

          <div className="px-5 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600">
              ✓
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Aucune demande en attente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Les nouvelles demandes apparaîtront ici.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {pending.map((request) => {

              const profile = profiles.find(
                (item) =>
                  item.id === request.user_id
              )

              const clientName =
                [
                  profile?.first_name,
                  profile?.last_name,
                ]
                  .filter(Boolean)
                  .join(' ') ||
                'Client'

              const amount = Number(
                request.amount ?? 0
              )

              return (
                <div
                  key={request.id}
                  className="p-5"
                >

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    {/* CLIENT */}

                    <div className="min-w-0">

                      <p className="font-bold text-slate-900">
                        {clientName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {profile?.email ||
                          'Email non renseigné'}
                      </p>

                      <p className="mt-3 text-lg font-bold text-blue-700">
                        {amount.toLocaleString(
                          'fr-FR'
                        )}{' '}
                        FCFA
                      </p>

                    </div>

                    {/* INFORMATIONS RETRAIT */}

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Mode
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {formatMethod(
                            request.withdrawal_method
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Opérateur / Banque
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {request.withdrawal_provider ||
                            'Non renseigné'}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Compte
                        </p>

                        <p className="mt-1 break-all text-sm font-bold text-slate-900">
                          {request.withdrawal_account ||
                            'Non renseigné'}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Titulaire
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {request.withdrawal_name ||
                            'Non renseigné'}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">

                      <form action={updateRequest}>

                        <input
                          type="hidden"
                          name="transactionId"
                          value={request.id}
                        />

                        <input
                          type="hidden"
                          name="action"
                          value="approve"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
                        >
                          ✓ Valider
                        </button>

                      </form>

                      <form action={updateRequest}>

                        <input
                          type="hidden"
                          name="transactionId"
                          value={request.id}
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
                          Rejeter
                        </button>

                      </form>

                    </div>

                  </div>

                  <div className="mt-4 flex flex-col gap-1 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">

                    <span className="text-xs font-semibold text-orange-700">
                      En attente de validation
                    </span>

                    <span className="text-[10px] text-orange-600">
                      {new Date(
                        request.created_at
                      ).toLocaleString('fr-FR')}
                    </span>

                  </div>

                </div>
              )
            })}

          </div>

        )}

      </div>

    </div>
  )
}