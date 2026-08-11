import { ensureAdminAccess } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'
import { syncPortfolioBalances } from '@/lib/syncPortfolioBalances'

/**
 * Test endpoint: POST /api/admin/sync-balances
 * Déclenche manuellement la synchronisation des portefeuilles
 * Retourne le nombre d'utilisateurs ajustés et le total crédité
 * 
 * Usage:
 * curl -X POST http://localhost:3000/api/admin/sync-balances \
 *   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 *   -H "Content-Type: application/json"
 */

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const isAdmin = await ensureAdminAccess(supabase, user)

    if (!isAdmin) {
      return Response.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 })
    }

    // Exécuter la synchronisation des portefeuilles
    const result = await syncPortfolioBalances(supabase)

    return Response.json({
      success: true,
      adjustedUsers: result.adjustedUsers,
      totalCredited: result.totalCredited,
      errors: result.errors.length > 0 ? result.errors : undefined,
    })
  } catch (error) {
    console.error('Sync balances error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
