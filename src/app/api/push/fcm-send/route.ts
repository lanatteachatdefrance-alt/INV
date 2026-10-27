import { ensureAdminAccess } from '@/lib/admin'
import { sendFcmNotificationToAllUsers, sendFcmNotificationToUser } from '@/lib/fcmNotifications'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'

function hasSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !origin || new URL(origin).origin === new URL(request.url).origin
}

export async function POST(request: Request) {
  try {
    if (!hasSameOrigin(request)) {
      return Response.json({ error: 'Origine de requête invalide.' }, { status: 403 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Non authentifié.' }, { status: 401 })

    const input = await request.json()
    const title = typeof input?.title === 'string' ? input.title.trim() : ''
    const body = typeof input?.body === 'string' ? input.body.trim() : ''
    const url = typeof input?.url === 'string' ? input.url : '/dashboard'
    const broadcast = input?.all === true
    const targetUserId = typeof input?.userId === 'string' ? input.userId : user.id

    if (!title || title.length > 120 || !body || body.length > 500) {
      return Response.json({ error: 'Titre ou message invalide.' }, { status: 400 })
    }
    if (!broadcast && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)) {
      return Response.json({ error: 'Utilisateur cible invalide.' }, { status: 400 })
    }

    const isAdmin = await ensureAdminAccess(supabase, user)
    if ((broadcast || targetUserId !== user.id) && !isAdmin) {
      return Response.json({ error: 'Accès réservé à l’administrateur.' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    const payload = { title, body, url }
    const result = broadcast
      ? await sendFcmNotificationToAllUsers(adminClient, payload)
      : await sendFcmNotificationToUser(adminClient, targetUserId, payload)

    if (result.sent === 0 && result.failed === 0) {
      return Response.json({ error: 'Aucun token FCM actif trouvé.', ...result }, { status: 404 })
    }

    return Response.json({ ok: result.failed === 0, ...result })
  } catch (error) {
    console.error('API POST /api/push/fcm-send error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur.' },
      { status: 500 }
    )
  }
}
