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
  const supabase = createAdminClient()
  const results = await Promise.allSettled([
    sendPushNotificationToAllUsers(supabase, payload),
    sendFcmNotificationToAllUsers(supabase, payload),
  ])

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Un canal de diffusion push a échoué.')
    }
  }

  return {
    webPush:
      results[0].status === 'fulfilled'
        ? results[0].value
        : { sent: 0, failed: 1, removed: 0 },
    fcm:
      results[1].status === 'fulfilled'
        ? results[1].value
        : { sent: 0, failed: 1, removed: 0 },
  }
}

export function formatTransactionAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0)
  return `${(Number.isFinite(amount) ? amount : 0).toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  })} FCFA`
}
