import 'server-only'

import {
  sendFcmNotificationToAllUsers,
  sendFcmNotificationToUser,
} from '@/lib/fcmNotifications'
import {
  sendPushNotificationToAllUsers,
  sendPushNotificationToUser,
  type PushNotificationPayload,
} from '@/lib/pushNotifications'
import { createAdminClient } from '@/utils/supabase/admin'

export async function notifyUserOfTransaction(
  userId: string,
  payload: PushNotificationPayload
) {
  try {
    const supabase = createAdminClient()
    const results = await Promise.allSettled([
      sendPushNotificationToUser(supabase, userId, payload),
      sendFcmNotificationToUser(supabase, userId, payload),
    ])

    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Échec notification transactionnelle:', result.reason)
      }
    }
  } catch (error) {
    // L’échec d’une notification ne doit jamais annuler une opération financière validée.
    console.error('Envoi notification transactionnelle impossible:', error)
  }
}

export async function notifyAllUsers(payload: PushNotificationPayload) {
  type ChannelResult = {
    sent: number
    failed: number
    removed: number
    error?: string
  }

  const supabase = createAdminClient()
  const results = await Promise.allSettled([
    sendPushNotificationToAllUsers(supabase, payload),
    sendFcmNotificationToAllUsers(supabase, payload),
  ])

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(
        'Un canal de diffusion push a échoué:',
        result.reason instanceof Error ? result.reason.message : 'Erreur inconnue'
      )
    }
  }

  const channelResult = (result: typeof results[number]): ChannelResult => {
    if (result.status === 'fulfilled') return result.value

    const message = result.reason instanceof Error ? result.reason.message : ''
    let error = 'Erreur technique du canal. Vérifiez les journaux serveur.'

    if (/VAPID/i.test(message)) {
      error = 'Configuration Web Push manquante : vérifiez NEXT_PUBLIC_VAPID_PUBLIC_KEY et VAPID_PRIVATE_KEY dans l’environnement de déploiement.'
    } else if (/FIREBASE_SERVICE_ACCOUNT_JSON|Firebase|FCM/i.test(message)) {
      error = 'Configuration Android manquante ou invalide : vérifiez FIREBASE_SERVICE_ACCOUNT_JSON dans l’environnement de déploiement.'
    } else if (/push_subscriptions|fcm_tokens|abonnements push|tokens FCM/i.test(message)) {
      error = 'Lecture des appareils abonnés impossible : vérifiez les tables push_subscriptions et fcm_tokens ainsi que les droits du service Supabase.'
    }

    return { sent: 0, failed: 1, removed: 0, error }
  }

  return {
    webPush: channelResult(results[0]),
    fcm: channelResult(results[1]),
  }
}

export function formatTransactionAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0)
  return `${(Number.isFinite(amount) ? amount : 0).toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  })} FCFA`
}
