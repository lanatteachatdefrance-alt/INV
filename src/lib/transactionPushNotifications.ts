import 'server-only'

import { sendFcmNotificationToUser } from '@/lib/fcmNotifications'
import { sendPushNotificationToUser, type PushNotificationPayload } from '@/lib/pushNotifications'
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

export function formatTransactionAmount(value: number | string | null | undefined) {
  const amount = Number(value ?? 0)
  return `${(Number.isFinite(amount) ? amount : 0).toLocaleString('fr-FR', {
    maximumFractionDigits: 2,
  })} FCFA`
}
