import type { SupabaseClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'admin@invest.com'

export async function ensureAdminAccess(
  supabase: SupabaseClient,
  user: {
    id: string
    email?: string | null
  }
) {
  if (!user?.id) {
    return false
  }

  const userEmail = user.email?.trim().toLowerCase() || ''
  const adminEmail = ADMIN_EMAIL.trim().toLowerCase()

  // =====================================================
  // ADMIN PRINCIPAL PAR EMAIL
  // =====================================================

  if (userEmail === adminEmail) {
    const { error } = await supabase
      .from('users')
      .upsert(
        {
          id: user.id,
          email: user.email,
          role: 'admin',
        },
        {
          onConflict: 'id',
        }
      )

    if (error) {
      console.error(
        'Erreur synchronisation admin:',
        error.message
      )

      // Même si la synchronisation échoue,
      // l'adresse est bien celle de l'administrateur.
      return true
    }

    return true
  }

  // =====================================================
  // VÉRIFICATION DU RÔLE DANS USERS
  // =====================================================

  const {
    data: profile,
    error,
  } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error(
      'Erreur vérification rôle admin:',
      error.message
    )

    return false
  }

  return profile?.role?.toLowerCase() === 'admin'
}