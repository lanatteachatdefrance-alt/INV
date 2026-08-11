import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const isAdmin = await ensureAdminAccess(supabase, user)
    if (!isAdmin) {
      return Response.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, action, value, reason } = body as {
      userId?: string
      action?: 'approve_kyc' | 'reject_kyc' | 'deposit' | 'withdraw' | 'set_balance'
      value?: number
      reason?: string
    }

    if (!userId || !action) {
      return Response.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    if (action === 'approve_kyc') {
      const { error } = await supabase.from('users').update({ kyc_status: 'approuvé', updated_at: new Date().toISOString() }).eq('id', userId)
      if (error) throw error
      return Response.json({ success: true, message: 'KYC approuvé' })
    }

    if (action === 'reject_kyc') {
      const { error } = await supabase.from('users').update({ kyc_status: 'refusé', updated_at: new Date().toISOString() }).eq('id', userId)
      if (error) throw error
      return Response.json({ success: true, message: 'KYC refusé' })
    }

    if (action === 'deposit' || action === 'withdraw' || action === 'set_balance') {
      const { data: profile } = await supabase.from('users').select('balance').eq('id', userId).single()
      const currentBalance = Number(profile?.balance ?? 0)
      let nextBalance = currentBalance

      if (action === 'deposit') {
        nextBalance = currentBalance + Number(value ?? 0)
      } else if (action === 'withdraw') {
        nextBalance = currentBalance - Number(value ?? 0)
      } else if (action === 'set_balance') {
        nextBalance = Number(value ?? 0)
      }

      const { error } = await supabase.from('users').update({ balance: nextBalance, updated_at: new Date().toISOString() }).eq('id', userId)
      if (error) throw error

      await supabase.from('transactions').insert({
        user_id: userId,
        type: action,
        amount: Number(value ?? 0),
        status: 'complété',
        description: reason || `Opération admin ${action}`,
      })

      return Response.json({ success: true, balance: nextBalance })
    }

    return Response.json({ error: 'Action inconnue' }, { status: 400 })
  } catch (error) {
    console.error('Admin users action error:', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
