'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        setError(
          'Le lien est invalide ou expiré. Demandez un nouveau lien de réinitialisation.'
        )
      } else {
        setReady(true)
      }
    }

    checkSession()
  }, [])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setError('Impossible de modifier le mot de passe. Demandez un nouveau lien.')
      return
    }

    setMessage('Votre mot de passe a été modifié avec succès.')

    await supabase.auth.signOut()
    router.push('/login?password-reset=success')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#061b31] px-5 py-8">
      <div className="w-full max-w-md rounded-[26px] border border-white/10 bg-[#102b47] p-6 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-widest text-[#d4a72c]">
          INVESTIR EN BOURSE
        </p>

        <h1 className="mt-3 text-2xl font-black text-white">
          Nouveau mot de passe
        </h1>

        <p className="mt-3 text-sm text-slate-300">
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {ready && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="h-14 w-full rounded-xl border border-white/10 bg-[#153452] px-4 text-white outline-none focus:border-[#d4a72c]"
            />

            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              className="h-14 w-full rounded-xl border border-white/10 bg-[#153452] px-4 text-white outline-none focus:border-[#d4a72c]"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-[#d4a72c] font-black text-[#061b31] disabled:opacity-60"
            >
              {loading ? 'MODIFICATION...' : 'MODIFIER LE MOT DE PASSE'}
            </button>
          </form>
        )}

        <Link
          href="/forgot-password"
          className="mt-6 block text-center text-sm font-bold text-[#d4a72c]"
        >
          Demander un nouveau lien
        </Link>
      </div>
    </main>
  )
}