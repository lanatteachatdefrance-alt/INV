'use client'

import { useState } from 'react'

export function SyncBalancesButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  async function handleSync() {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/admin/sync-balances', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(result?.error ?? 'Une erreur est survenue lors de la synchronisation.')
        return
      }

      setStatus('success')
      setMessage(
        `Synchronisation effectuée. Utilisateurs ajustés : ${result.adjustedUsers ?? 0}, total ajusté : ${result.totalCredited ?? 0} FCFA.`
      )
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Erreur réseau lors de la synchronisation.')
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm text-fin-mute uppercase tracking-[0.24em] mb-2">Mise à jour du portefeuille</p>
          <p className="text-sm text-slate-600">Recalcule les valeurs des positions et ajuste les soldes des utilisateurs après un changement de cours.</p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center rounded-2xl bg-fin-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === 'loading' ? 'Synchronisation...' : 'Synchroniser les soldes'}
        </button>

        {message ? (
          <p className={`text-sm ${status === 'error' ? 'text-fin-danger' : 'text-fin-success'}`}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  )
}
