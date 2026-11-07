import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ensureAdminAccess } from '@/lib/admin'
import { SyncBalancesButton } from '@/components/admin/SyncBalancesButton'
import UsersSearch from '@/components/admin/UsersSearch'

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

  const { data: profiles, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, kyc_status, balance')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur chargement clients:', error.message)
  }

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
          <UsersSearch profiles={profiles ?? []} />
        </div>

        <SyncBalancesButton />
      </div>
    </div>
  )
}