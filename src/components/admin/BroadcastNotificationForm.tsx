'use client'

import { useState } from 'react'

type DeliveryResult = {
  sent: number
  failed: number
  webPush: { sent: number; failed: number; removed: number }
  fcm: { sent: number; failed: number; removed: number }
}

export default function BroadcastNotificationForm() {
  const [title, setTitle] = useState('Information Investir en Bourse')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('/dashboard')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<DeliveryResult | null>(null)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')
    setResult(null)

    if (!confirmed) {
      setError('Confirmez que cette notification sera envoyée à tous les utilisateurs abonnés.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, url }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || data.message || 'Échec de la diffusion.')

      setMessage(data.message)
      setResult(data)
      setConfirmed(false)
      setBody('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="notification-title" className="mb-2 block text-sm font-semibold text-slate-700">
          Titre
        </label>
        <input
          id="notification-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{title.length}/120</p>
      </div>

      <div>
        <label htmlFor="notification-body" className="mb-2 block text-sm font-semibold text-slate-700">
          Message
        </label>
        <textarea
          id="notification-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={500}
          rows={5}
          required
          placeholder="Rédigez le message qui sera envoyé aux utilisateurs abonnés…"
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
        />
        <p className="mt-1 text-right text-xs text-slate-400">{body.length}/500</p>
      </div>

      <div>
        <label htmlFor="notification-url" className="mb-2 block text-sm font-semibold text-slate-700">
          Lien interne à ouvrir
        </label>
        <input
          id="notification-url"
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          maxLength={300}
          required
          placeholder="/dashboard"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
        />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#14283B]"
        />
        <span>Je confirme l’envoi de cette notification à tous les utilisateurs disposant d’un appareil abonné.</span>
      </label>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}

      {result && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-bold text-slate-900">Web Push</p>
            <p className="mt-1 text-slate-600">Envoyées : {result.webPush.sent} · Échecs : {result.webPush.failed} · Expirées supprimées : {result.webPush.removed}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
            <p className="font-bold text-slate-900">Android (FCM)</p>
            <p className="mt-1 text-slate-600">Envoyées : {result.fcm.sent} · Échecs : {result.fcm.failed} · Expirées supprimées : {result.fcm.removed}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !confirmed || !title.trim() || !body.trim()}
        className="w-full rounded-xl bg-[#061B31] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0B2945] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? 'Envoi en cours…' : 'Envoyer à tous les utilisateurs'}
      </button>
    </form>
  )
}