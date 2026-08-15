import { login } from './actions'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton } from '@/components/ui/Buttons'

export default function Login({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error

  return (
    <div className="min-h-[100dvh] bg-white flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-md">

        {/* LOGO INVICTUS CAPITAL & FINANCE */}
        <div className="flex justify-center mb-8">
          <img
            src="/ICONE.jpeg"
            alt="Invictus Capital & Finance"
            className="w-52 h-52 object-contain"
          />
        </div>

        {/* FORMULAIRE */}
        <GlassCard
          className="w-full"
          hover={false}
          padding="lg"
        >

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form action={login} className="space-y-5">

            {/* IDENTIFIANT */}
            <div>
              <label className="sr-only">
                Identifiant
              </label>

              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                className="fin-input !rounded-2xl !py-5 !px-6 !text-lg"
                placeholder="Identifiant"
              />
            </div>

            {/* MOT DE PASSE */}
            <div>
              <label className="sr-only">
                Mot de passe
              </label>

              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="fin-input !rounded-2xl !py-5 !px-6 !text-lg"
                placeholder="Mot de passe"
              />
            </div>

            {/* CONNEXION */}
            <PrimaryButton
              type="submit"
              fullWidth
              size="lg"
              className="!rounded-2xl !py-5 !text-lg !font-bold"
            >
              SE CONNECTER
            </PrimaryButton>

          </form>

          {/* SECURITE */}
          <div className="mt-8 rounded-2xl bg-[#f0f5fb] px-5 py-5">
            <div className="flex items-start gap-4">

              <div className="text-3xl">
                🛡️
              </div>

              <p className="text-sm text-slate-600 leading-6">
                <span className="font-semibold">
                  Connexion sécurisée.
                </span>{' '}
                Vos informations sont protégées par un chiffrement avancé.
              </p>

            </div>
          </div>

          {/* CREATION DE COMPTE */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Vous n’avez pas encore de compte ?
            </p>

            <Link
              href="/register"
              className="inline-block mt-2 text-[#1455d9] font-bold text-base hover:underline"
            >
              Créer un compte
            </Link>
          </div>

        </GlassCard>

      </div>
    </div>
  )
}