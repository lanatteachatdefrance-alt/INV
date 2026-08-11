import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'
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

  const { data: profiles } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, kyc_status, balance')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Validation des comptes</h1>
      <p className="text-sm text-slate-600">Le compte admin peut vérifier les profils et ajuster les soldes des utilisateurs.</p>

      <div className="grid gap-4">
        {(profiles ?? []).map((profile: any) => (
          <div key={profile.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{profile.email}</p>
                <p className="text-sm text-slate-600">{[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Nom non renseigné'}</p>
              </div>
              <div className="text-sm text-slate-600">KYC: <span className="font-medium text-slate-900">{profile.kyc_status || 'en_attente'}</span></div>
              <div className="text-sm text-slate-600">Solde: <span className="font-medium text-slate-900">{Number(profile.balance ?? 0).toLocaleString('fr-FR')} FCFA</span></div>
            </div>
            <AdminUserActions profile={profile} />
          </div>
        ))}
      </div>
    </div>
  )
}
