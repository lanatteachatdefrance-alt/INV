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
    const token = typeof input?.token === 'string' ? input.token.trim() : ''
    if (token.length < 20 || token.length > 4096) {
      return Response.json({ error: 'Token FCM invalide.' }, { status: 400 })
    }

    // Le user_id vient exclusivement de la session vérifiée, jamais du corps client.
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('fcm_tokens')
      .upsert(
        { user_id: user.id, token, platform: 'android', updated_at: new Date().toISOString() },
        { onConflict: 'token' }
      )

    if (error) {
      console.error('Enregistrement token FCM:', error.message)
      return Response.json(
        { error: 'Enregistrement du token impossible. Appliquez la migration fcm_tokens.' },
        { status: 500 }
      )
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('API POST /api/push/fcm-token error:', error)
    return Response.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
