import type { SupabaseClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'admin@invest.com'

export async function ensureAdminAccess(supabase: SupabaseClient, user: { id: string; email?: string | null }) {
  if (!user?.id) return false

  if (user.email === ADMIN_EMAIL) {
    await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      role: 'admin',
    }, { onConflict: 'id' })
    return true
  }

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  return profile?.role === 'admin'
}
