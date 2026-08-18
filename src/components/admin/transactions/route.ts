import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const isAdmin = await ensureAdminAccess(supabase, user)

    if (!isAdmin) {
      return Response.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const {
      transactionId,
      action,
      reason,
    } = body as {
      transactionId?: string
      action?: 'approve' | 'reject'
      reason?: string
    }

    if (!transactionId || !action) {
      return Response.json(
        { error: 'Paramètres invalides' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return Response.json(
        { error: 'Action invalide' },
        { status: 400 }
      )
    }

    // Récupérer la transaction
    const { data: transaction, error: transactionError } =
      await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single()

    if (transactionError || !transaction) {
      return Response.json(
        { error: 'Transaction introuvable' },
        { status: 404 }
      )
    }

    // Une transaction déjà traitée ne peut plus être modifiée
    if (transaction.status !== 'pending') {
      return Response.json(
        {
          error:
            'Cette demande a déjà été traitée.'
        },
        { status: 400 }
      )
    }

    const nextStatus =
      action === 'approve'
        ? 'approved'
        : 'rejected'

    const updateData: Record<string, unknown> = {
      status: nextStatus,
      updated_at: new Date().toISOString(),
      approved_by:
        action === 'approve'
          ? user.id
          : null,
      approved_at:
        action === 'approve'
          ? new Date().toISOString()
          : null,
    }

    if (action === 'reject') {
      updateData.rejection_reason =
        reason || 'Demande rejetée par l’administrateur'
    }

    const { error: updateError } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .eq('status', 'pending')

    if (updateError) {
      console.error(
        'Admin transaction update error:',
        updateError
      )

      return Response.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      status: nextStatus,
      message:
        action === 'approve'
          ? 'Demande approuvée avec succès.'
          : 'Demande rejetée avec succès.',
    })
  } catch (error) {
    console.error(
      'Admin transactions API error:',
      error
    )

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur serveur',
      },
      { status: 500 }
    )
  }
}