'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    const supabase = createClient()

    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

    if (error) {
      setError(
        'Impossible d’envoyer le lien de réinitialisation. Vérifiez votre adresse e-mail.'
      )
    } else {
      setMessage(
        'Un lien de réinitialisation a été envoyé à votre adresse e-mail. Vérifiez également vos courriers indésirables.'
      )
    }

    setLoading(false)
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#061b31] px-5 py-8">

      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="mb-8 flex justify-center">

          <Link
            href="/login"
            className="flex items-center gap-3"
          >

            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
              <img
                src="/ICONE.jpeg"
                alt="Investir en Bourse"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="leading-none">
              <p className="text-[15px] font-black text-white">
                INVESTIR
              </p>

              <p className="mt-0.5 text-[15px] font-black text-[#d4a72c]">
                EN BOURSE
              </p>
            </div>

          </Link>

        </div>

        {/* CARTE */}

        <div className="rounded-[26px] border border-white/10 bg-[#102b47] p-6 shadow-2xl">

          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d4a72c]">
            SÉCURITÉ
          </p>

          <h1 className="mt-2 text-2xl font-black text-white">
            Mot de passe oublié ?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Entrez l’adresse e-mail associée à votre compte.
            Nous vous enverrons un lien sécurisé pour créer
            un nouveau mot de passe.
          </p>

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm leading-5 text-emerald-200">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-200">
              {error}
            </div>
          )}

          {!message && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Votre adresse e-mail"
                className="h-14 w-full rounded-2xl border border-white/10 bg-[#153452] px-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              />

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-[#d4a72c] text-sm font-black text-[#061b31] transition hover:bg-[#bd9223] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'ENVOI EN COURS...'
                  : 'ENVOYER LE LIEN'}
              </button>

            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-5 text-center">

            <Link
              href="/login"
              className="text-sm font-bold text-[#d4a72c]"
            >
              ← Retour à la connexion
            </Link>

          </div>

        </div>

      </div>

    </main>
  )
}