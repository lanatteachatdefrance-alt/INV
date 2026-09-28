'use client'

import { useCallback, useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'

type PushState = 'idle' | 'active' | 'working' | 'denied' | 'unsupported' | 'error'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = `${base64String}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from(rawData, (character) => character.charCodeAt(0))
}

async function saveSubscription(subscription: PushSubscription) {
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription.toJSON()),
  })

  if (!response.ok) {
    const result = await response.json().catch(() => null)
    throw new Error(result?.error || 'Impossible d’enregistrer cet appareil.')
  }
}

export default function PushNotificationButton({
  compact = false,
}: {
  compact?: boolean
}) {
  const [state, setState] = useState<PushState>('idle')
  const [message, setMessage] = useState('')

  const isSupported = useCallback(() =>
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window,
  [])

  useEffect(() => {
    if (!isSupported()) {
      setState('unsupported')
      return
    }

    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }

    if (Notification.permission !== 'granted') return

    let cancelled = false

    void navigator.serviceWorker.ready
      .then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription()
        if (!subscription) return
        await saveSubscription(subscription)
        if (!cancelled) setState('active')
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState('error')
          setMessage(error instanceof Error ? error.message : 'Erreur de synchronisation.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [isSupported])

  const handleClick = async () => {
    if (!isSupported()) {
      setState('unsupported')
      return
    }

    setState('working')
    setMessage('')

    try {
      if (state === 'active') {
        const response = await fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Investir Bourse',
            body: 'Les notifications push fonctionnent sur cet appareil.',
          }),
        })
        const result = await response.json().catch(() => null)
        if (!response.ok) throw new Error(result?.error || 'Échec de l’envoi du test.')
        setMessage('Notification de test envoyée.')
        setState('active')
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'idle')
        setMessage(permission === 'denied'
          ? 'Autorisez les notifications dans les réglages du navigateur.'
          : 'Autorisation non accordée.')
        return
      }

      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!publicKey) throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY est manquante.')

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription() ??
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })

      await saveSubscription(subscription)
      setState('active')
      setMessage('Notifications activées. Touchez à nouveau pour recevoir un test.')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Impossible d’activer les notifications.')
    }
  }

  const label = state === 'active'
    ? 'Envoyer une notification test'
    : state === 'denied'
      ? 'Notifications bloquées'
      : state === 'unsupported'
        ? 'Push non pris en charge'
        : state === 'working'
          ? 'Patientez…'
          : state === 'error'
            ? 'Réessayer les notifications'
            : 'Activer les notifications'

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'working' || state === 'unsupported'}
        title={message || label}
        aria-label={label}
        className={`flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? 'w-10 px-0' : ''}`}
      >
        <BellRing size={18} aria-hidden="true" />
        {!compact && <span className="text-xs font-semibold">{label}</span>}
      </button>
      {!compact && message && (
        <span className="max-w-64 text-right text-[11px] text-slate-500" role="status">
          {message}
        </span>
      )}
    </div>
  )
}
