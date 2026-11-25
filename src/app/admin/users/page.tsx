import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import { redirect } from 'next/navigation'
import UsersSearch from '@/components/admin/UsersSearch'

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

        <UsersSearch profiles={profiles ?? []} />

      </div>
    </main>
  )
}