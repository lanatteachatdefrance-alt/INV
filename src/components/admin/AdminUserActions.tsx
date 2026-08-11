'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Profile = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  role?: string | null
  kyc_status?: string | null
  balance?: number | null
}

export function AdminUserActions({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function runAction(action: 'approve_kyc' | 'reject_kyc' | 'deposit' | 'withdraw' | 'set_balance') {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          action,
          value: action === 'set_balance' || action === 'deposit' || action === 'withdraw' ? Number(value || 0) : undefined,
          reason: reason || `Opération ${action}`,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Échec de l’action')
      }

      setMessage(data.message || 'Action réalisée')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => runAction('approve_kyc')}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Approuver KYC
        </button>
        <button
          onClick={() => runAction('reject_kyc')}
          disabled={loading}
          className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Refuser KYC
        </button>
        <button
          onClick={() => runAction('deposit')}
          disabled={loading}
          className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Déposer
        </button>
        <button
          onClick={() => runAction('withdraw')}
          disabled={loading}
          className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Retirer
        </button>
        <button
          onClick={() => runAction('set_balance')}
          disabled={loading}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Définir solde
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Montant"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Motif"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  )
}
