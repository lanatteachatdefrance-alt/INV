import { ensureAdminAccess } from '@/lib/admin'
import { notifyAllUsers } from '@/lib/transactionPushNotifications'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'nodejs'

function hasSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: 'Origine de requête invalide.' }, { status: 403 })
  }

  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Non authentifié.' }, { status: 401 })
    }

    if (!(await ensureAdminAccess(supabase, user))) {
      return Response.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })
    }

    const input = await request.json().catch(() => null)
    const title = typeof input?.title === 'string' ? input.title.trim() : ''
    const body = typeof input?.body === 'string' ? input.body.trim() : ''
    const url = typeof input?.url === 'string' ? input.url.trim() : '/dashboard'

    if (!title || title.length > 120 || !body || body.length > 500) {
      return Response.json(
        { error: 'Le titre (120 caractères max.) et le message (500 caractères max.) sont obligatoires.' },
        { status: 400 }
      )
    }

    if (url.length > 300 || !url.startsWith('/') || url.startsWith('//') || url.includes('\\')) {
      return Response.json({ error: 'Le lien doit être une adresse interne valide.' }, { status: 400 })
    }

    const delivery = await notifyAllUsers({ title, body, url })
    const sent = delivery.webPush.sent + delivery.fcm.sent
    const failed = delivery.webPush.failed + delivery.fcm.failed
    const status = sent === 0
      ? failed > 0 ? 503 : 404
      : 200

    return Response.json({
      success: sent > 0,
      sent,
      failed,
      webPush: delivery.webPush,
      fcm: delivery.fcm,
      message: sent > 0
        ? failed > 0
          ? 'Diffusion partielle : certains appareils n’ont pas pu être joints.'
          : 'Diffusion terminée.'
        : failed > 0
          ? 'Aucune notification n’a pu être envoyée. Vérifiez la configuration des services push.'
          : 'Aucun appareil n’est abonné aux notifications.',
    }, { status })
  } catch (error) {
    console.error(
      'Diffusion admin impossible:',
      error instanceof Error ? error.message : 'Erreur inconnue'
    )
    return Response.json({ error: 'Impossible d’envoyer la notification. Vérifiez la configuration push du serveur.' }, { status: 500 })
  }
}