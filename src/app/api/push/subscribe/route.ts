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

    const subscription = await request.json()
    const endpoint = typeof subscription?.endpoint === 'string' ? subscription.endpoint : ''
    const p256dh = typeof subscription?.keys?.p256dh === 'string' ? subscription.keys.p256dh : ''
    const auth = typeof subscription?.keys?.auth === 'string' ? subscription.keys.auth : ''

    let endpointUrl: URL
    try {
      endpointUrl = new URL(endpoint)
    } catch {
      return Response.json({ error: 'Abonnement push invalide.' }, { status: 400 })
    }

    if (endpointUrl.protocol !== 'https:' || !p256dh || !auth) {
      return Response.json({ error: 'Abonnement push invalide.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        { user_id: user.id, endpoint, p256dh, auth },
        { onConflict: 'endpoint' }
      )

    if (error) {
      console.error('Enregistrement abonnement push:', error.message)
      return Response.json(
        { error: 'Enregistrement impossible. Vérifiez les colonnes et les règles RLS de push_subscriptions.' },
        { status: 500 }
      )
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('API POST /api/push/subscribe error:', error)
    return Response.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
