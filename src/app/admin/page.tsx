import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ensureAdminAccess } from '@/lib/admin'
import { SyncBalancesButton } from '@/components/admin/SyncBalancesButton'

export default async function AdminPage() {
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

  const { data: profiles } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, kyc_status, balance')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Administration
        </h1>

        <p className="text-sm text-slate-600">
          Validation des comptes, gestion des soldes et supervision du portefeuille.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Comptes clients
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="py-2">Email</th>
                  <th className="py-2">Nom</th>
                  <th className="py-2">Rôle</th>
                  <th className="py-2">KYC</th>
                  <th className="py-2">Solde</th>
                </tr>
              </thead>

              <tbody>
                {(profiles ?? []).map((profile: any) => (
                  <tr
                    key={profile.id}
                    className="border-t border-slate-100"
                  >
                    <td className="py-3">
                      {profile.email}
                    </td>

                    <td className="py-3">
                      {[profile.first_name, profile.last_name]
                        .filter(Boolean)
                        .join(' ') || '—'}
                    </td>

                    <td className="py-3">
                      {profile.role}
                    </td>

                    <td className="py-3">
                      {profile.kyc_status || 'en_attente'}
                    </td>

                    <td className="py-3">
                      {Number(profile.balance ?? 0).toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <SyncBalancesButton />

      </div>
    </div>
  )
}