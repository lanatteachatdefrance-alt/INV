import 'server-only'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PushNotificationPayload } from '@/lib/pushNotifications'

type FcmTokenRow = {
  token: string
  user_id: string
}

type FcmSendSummary = {
  sent: number
  failed: number
  removed: number
}

function getFirebaseMessaging() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON doit être configurée côté serveur.')
  }

  let serviceAccount: {
    project_id: string
    client_email: string
    private_key: string
  }
  try {
    serviceAccount = JSON.parse(serviceAccountJson)
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON n’est pas un JSON valide.')
  }

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error('Le compte de service Firebase doit contenir project_id, client_email et private_key.')
  }

  const app = getApps().find((existingApp) => existingApp.name === 'fcm-server') ||
    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
    }, 'fcm-server')

  return getMessaging(app)
}

function safeUrl(url?: string) {
  return url && url.startsWith('/') && !url.startsWith('//') ? url : '/dashboard'
}

async function loadTokens(supabase: SupabaseClient, userId?: string) {
  const tokens: FcmTokenRow[] = []
  const pageSize = 500

  for (let from = 0; ; from += pageSize) {
    let query = supabase
      .from('fcm_tokens')
      .select('token, user_id')
      .order('token')
      .range(from, from + pageSize - 1)

    if (userId) query = query.eq('user_id', userId)

    const { data, error } = await query
    if (error) throw new Error(`Lecture des tokens FCM impossible: ${error.message}`)

    const page = (data || []) as FcmTokenRow[]
    tokens.push(...page)
    if (page.length < pageSize) break
  }

  return tokens
}

async function sendToTokens(
  supabase: SupabaseClient,
  tokens: FcmTokenRow[],
  payload: PushNotificationPayload
): Promise<FcmSendSummary> {
  if (tokens.length === 0) return { sent: 0, failed: 0, removed: 0 }

  const messaging = getFirebaseMessaging()
  const summary: FcmSendSummary = { sent: 0, failed: 0, removed: 0 }
  const invalidTokens: string[] = []

  for (let index = 0; index < tokens.length; index += 500) {
    const batch = tokens.slice(index, index + 500)
    const result = await messaging.sendEachForMulticast({
      tokens: batch.map(({ token }) => token),
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: { url: safeUrl(payload.url) },
      android: { priority: 'high' },
    })

    summary.sent += result.successCount
    summary.failed += result.failureCount

    result.responses.forEach((response, responseIndex) => {
      const code = response.error?.code
      if (code === 'messaging/registration-token-not-registered' ||
          code === 'messaging/invalid-registration-token') {
        invalidTokens.push(batch[responseIndex].token)
      } else if (response.error) {
        console.error('Échec envoi FCM:', code || response.error.message)
      }
    })
  }

  if (invalidTokens.length > 0) {
    const { error } = await supabase
      .from('fcm_tokens')
      .delete()
      .in('token', invalidTokens)
    if (error) console.error('Nettoyage tokens FCM expirés impossible:', error.message)
    else summary.removed = invalidTokens.length
  }

  return summary
}

export async function sendFcmNotificationToUser(
  supabase: SupabaseClient,
  userId: string,
  payload: PushNotificationPayload
) {
  return sendToTokens(supabase, await loadTokens(supabase, userId), payload)
}

export async function sendFcmNotificationToAllUsers(
  supabase: SupabaseClient,
  payload: PushNotificationPayload
) {
  return sendToTokens(supabase, await loadTokens(supabase), payload)
}
