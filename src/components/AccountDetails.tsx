"use client"

import { useEffect, useState } from 'react'

type Profile = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
  kyc_status?: string
}

export default function AccountDetails() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<{ first_name?: string; last_name?: string; phone?: string; address?: string }>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setProfile(data.user)
          setForm({ first_name: data.user.first_name, last_name: data.user.last_name, phone: data.user.phone, address: data.user.address })
        }
      })
      .catch(() => {})
  }, [])

  const maskedPhone = (p?: string) => {
    if (!p) return '—'
    const len = p.length
    if (len <= 4) return p
    return p.slice(0, len - 4) + '••••'
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/user/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data?.user) {
        setProfile(data.user)
        setEditing(false)
        setMessage('Modifications enregistrées')
      } else if (data?.error) {
        setMessage(data.error)
      }
    } catch (err) {
      setMessage('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div className="p-4 text-sm text-gray-500">Chargement du profil...</div>

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-brand-dark text-white font-bold px-5 py-3 flex justify-between items-center text-sm">
        <span>Mon Compte</span>
        <button onClick={() => setEditing(!editing)} className="text-xs bg-white/10 px-2 py-1 rounded">{editing ? 'Annuler' : 'Modifier'}</button>
      </div>
      <div className="p-4 text-sm">
        <div className="mb-2">
          <div className="text-xs text-gray-400">Nom</div>
          {editing ? (
            <input value={form.first_name || ''} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="w-full border p-2 rounded mt-1 text-sm" />
          ) : (
            <div className="font-medium">{(profile.first_name || '') + ' ' + (profile.last_name || '')}</div>
          )}
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400">Email</div>
          <div className="font-medium">{profile.email}</div>
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400">Téléphone</div>
          {editing ? (
            <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border p-2 rounded mt-1 text-sm" />
          ) : (
            <div className="font-medium">{maskedPhone(profile.phone)}</div>
          )}
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400">Adresse</div>
          {editing ? (
            <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border p-2 rounded mt-1 text-sm" />
          ) : (
            <div className="font-medium">{profile.address || '—'}</div>
          )}
        </div>

        <div className="text-xs text-gray-400">KYC</div>
        <div className="font-medium mb-3">{profile.kyc_status || 'en_attente'}</div>

        {editing && (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="bg-brand-accent text-white px-3 py-2 rounded font-bold text-sm">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-100 px-3 py-2 rounded text-sm">Annuler</button>
          </div>
        )}

        {message && <div className="text-sm text-gray-600 mt-3">{message}</div>}
      </div>
    </div>
  )
}
