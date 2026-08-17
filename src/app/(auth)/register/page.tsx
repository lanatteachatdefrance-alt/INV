import { register } from './actions'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton } from '@/components/ui/Buttons'

export default function Register({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error

  return (
    <div className="fin-page flex justify-center">
      <GlassCard
        className="w-full max-w-2xl"
        hover={false}
        padding="lg"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-gradient mx-auto flex items-center justify-center font-black text-lg shadow-glow mb-4">
            IB
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Créer un compte
          </h1>

          <p className="text-sm text-fin-mute mt-1">
            Rejoignez la plateforme d&apos;investissement
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-fin-danger/30 bg-fin-danger/10 px-4 py-3 text-sm text-fin-danger">
            {error}
          </div>
        )}

        <form action={register} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-fin-mute block mb-1.5">
                Prénom
              </label>
              <input
                name="firstName"
                required
                className="fin-input"
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-fin-mute block mb-1.5">
                Nom
              </label>
              <input
                name="lastName"
                required
                className="fin-input"
                placeholder="Kouassi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-fin-mute block mb-1.5">
                Téléphone
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="fin-input"
                placeholder="+225 07…"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-fin-mute block mb-1.5">
                Date de naissance
              </label>
              <input
                name="dateOfBirth"
                type="date"
                required
                className="fin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-fin-mute block mb-1.5">
                Nationalité
              </label>
              <input
                name="nationality"
                required
                className="fin-input"
                placeholder="Ivoirienne"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-fin-mute block mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="fin-input"
                placeholder="nom@exemple.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-fin-mute block mb-1.5">
              Adresse
            </label>
            <input
              name="address"
              required
              className="fin-input"
              placeholder="Cocody, Abidjan"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-fin-mute block mb-1.5">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              className="fin-input"
              placeholder="••••••••"
            />
          </div>

          <PrimaryButton
            type="submit"
            fullWidth
            size="lg"
            className="mt-2"
          >
            Créer mon compte
          </PrimaryButton>

          <p className="text-center text-sm text-fin-mute pt-2">
            Déjà membre ?{' '}
            <Link
              href="/login"
              className="text-fin-primary font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </p>

        </form>
      </GlassCard>
    </div>
  )
}