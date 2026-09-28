import 'server-only'

import webpush from 'web-push'
import type { SupabaseClient } from '@supabase/supabase-js'

export type PushNotificationPayload = {
  title: string
  body: string
  url?: string
}

type PushSubscriptionRow = {
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
}

type SendSummary = {
  sent: number
  failed: number
  removed: number
}

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    throw new Error('Les variables VAPID ne sont pas configurées sur le serveur.')
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@invest.com',
    publicKey,
    privateKey
  )
}

function normalizeUrl(url?: string) {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return '/dashboard'
  return url
}

async function sendToSubscriptions(
  supabase: SupabaseClient,
  subscriptions: PushSubscriptionRow[],
  payload: PushNotificationPayload
): Promise<SendSummary> {
  configureWebPush()

  const message = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: normalizeUrl(payload.url),
  })

  const results = await Promise.all(subscriptions.map(async (row) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: row.endpoint,
          keys: { p256dh: row.p256dh, auth: row.auth },
        },
        message
      )
      return 'sent' as const
    } catch (error) {
      const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
        ? Number(error.statusCode)
        : undefined

      if (statusCode === 404 || statusCode === 410) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', row.endpoint)
        return 'removed' as const
      }

      console.error('Échec d’envoi push:', error)
      return 'failed' as const
    }
  }))

  return {
    sent: results.filter((result) => result === 'sent').length,
    failed: results.filter((result) => result === 'failed').length,
    removed: results.filter((result) => result === 'removed').length,
  }
}

async function loadSubscriptions(
  supabase: SupabaseClient,
  userId?: string
) {
  const pageSize = 500
  const subscriptions: PushSubscriptionRow[] = []

  for (let from = 0; ; from += pageSize) {
    let query = supabase
      .from('push_subscriptions')
      .select('user_id, endpoint, p256dh, auth')
      .order('endpoint')
      .range(from, from + pageSize - 1)

    if (userId) query = query.eq('user_id', userId)

    const { data, error } = await query
    if (error) throw new Error(`Lecture des abonnements push impossible: ${error.message}`)

    const page = (data || []) as PushSubscriptionRow[]
    subscriptions.push(...page)
    if (page.length < pageSize) break
  }

  return subscriptions
}

export async function sendPushNotificationToUser(
  supabase: SupabaseClient,
  userId: string,
  payload: PushNotificationPayload
) {
  return sendToSubscriptions(
    supabase,
    await loadSubscriptions(supabase, userId),
    payload
  )
}

export async function sendPushNotificationToAllUsers(
  supabase: SupabaseClient,
  payload: PushNotificationPayload
) {
  return sendToSubscriptions(
    supabase,
    await loadSubscriptions(supabase),
    payload
  )
}
