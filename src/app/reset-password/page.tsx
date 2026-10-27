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
  const [checking, setChecking] = useState(true)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function prepareRecovery() {
      try {
        // Cas 1 : Supabase a redirigé vers la page avec un jeton
        // de récupération dans le fragment de l'URL.
        const hash = window.location.hash
        const hashParams = new URLSearchParams(
          hash.startsWith('#') ? hash.slice(1) : hash
        )

        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const hashType = hashParams.get('type')
        const hashError =
          hashParams.get('error_description') ||
          hashParams.get('error')

        if (hashError) {
          throw new Error(
            'Le lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien.'
          )
        }

        if (
          accessToken &&
          refreshToken &&
          hashType === 'recovery'
        ) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) throw error

          // Retire les jetons de l'adresse du navigateur.
          window.history.replaceState(
            window.history.state,
            '',
            window.location.pathname + window.location.search
          )
        } else {
          // Cas 2 : le code a déjà été échangé par /auth/callback.
          const { data, error } = await supabase.auth.getSession()

          if (error) throw error

          if (!data.session) {
            throw new Error(
              'Le lien est invalide ou expiré. Demandez un nouveau lien de réinitialisation.'
            )
          }
        }

        const { data, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (!data.session) {
          throw new Error(
            'Impossible de valider le lien. Demandez un nouveau lien de réinitialisation.'
          )
        }

        if (!cancelled) {
          setReady(true)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Le lien est invalide ou expiré. Demandez un nouveau lien.'
          )
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    }

    void prepareRecovery()

    return () => {
      cancelled = true
    }
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

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        throw error
      }

      setMessage('Votre mot de passe a été modifié avec succès.')
      setPassword('')
      setConfirmPassword('')

      await supabase.auth.signOut()
      router.replace('/login?password-reset=success')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de modifier le mot de passe. Demandez un nouveau lien.'
      )
    } finally {
      setLoading(false)
    }
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

        {checking && (
          <div className="mt-5 rounded-xl bg-white/5 p-3 text-sm text-slate-200">
            Vérification du lien de réinitialisation…
          </div>
        )}

        {error && (
          <div
            className="mt-5 rounded-xl bg-red-500/10 p-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="mt-5 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200"
            role="status"
          >
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
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nouveau mot de passe"
              className="h-14 w-full rounded-xl border border-white/10 bg-[#153452] px-4 text-white outline-none focus:border-[#d4a72c]"
            />

            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirmer le mot de passe"
              className="h-14 w-full rounded-xl border border-white/10 bg-[#153452] px-4 text-white outline-none focus:border-[#d4a72c]"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-[#d4a72c] font-black text-[#061b31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'MODIFICATION…'
                : 'MODIFIER LE MOT DE PASSE'}
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