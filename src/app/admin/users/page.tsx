import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AdminUserActions } from '@/components/admin/AdminUserActions'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await ensureAdminAccess(supabase, user)

  if (!isAdmin) {
    redirect('/dashboard')
  }

  const { data: profiles, error } = await supabase
    .from('users')
    .select(
      'id, email, first_name, last_name, role, kyc_status, balance'
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(
      `Impossible de récupérer les utilisateurs : ${error.message}`
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Validation des comptes
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Le compte administrateur peut vérifier les profils,
            gérer les soldes et consulter les relevés d'activité.
          </p>
        </div>

        <div className="grid gap-4">
          {(profiles ?? []).map((profile: any) => (
            <div
              key={profile.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="font-semibold text-slate-900">
                    {profile.email}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {[
                      profile.first_name,
                      profile.last_name,
                    ]
                      .filter(Boolean)
                      .join(' ') || 'Nom non renseigné'}
                  </p>
                </div>

                <div className="text-sm text-slate-600">
                  KYC :{' '}
                  <span className="font-semibold text-slate-900">
                    {profile.kyc_status || 'en_attente'}
                  </span>
                </div>

                <div className="text-sm text-slate-600">
                  Solde :{' '}
                  <span className="font-semibold text-slate-900">
                    {Number(profile.balance ?? 0).toLocaleString(
                      'fr-FR'
                    )}{' '}
                    FCFA
                  </span>
                </div>

              </div>

              <div className="mt-4 flex flex-col gap-3">

                <AdminUserActions profile={profile} />

                <div className="border-t border-slate-100 pt-3">
                  <Link
                    href={`/admin/clients/${profile.id}/statement`}
                    className="inline-flex items-center justify-center rounded-lg bg-[#061B31] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123653]"
                  >
                    Voir le relevé
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {(!profiles || profiles.length === 0) && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              Aucun utilisateur trouvé.
            </p>
          </div>
        )}

      </div>
    </main>
  )
}