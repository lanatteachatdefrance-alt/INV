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
    <div className="min-h-[100dvh] bg-[#f4f7fb] flex items-center justify-center px-5 py-8">

      <div className="w-full max-w-2xl">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="flex justify-center mb-8">
          <img
            src="/ICONE.jpeg"
            alt="Investir en Bourse"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* =====================================================
            FORMULAIRE
        ===================================================== */}

        <GlassCard
          className="w-full"
          hover={false}
          padding="lg"
        >

          {/* TITRE */}

          <div className="text-center mb-8">

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#14243a]">
              Créer un compte
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Rejoignez la plateforme d&apos;investissement
            </p>

          </div>

          {/* =====================================================
              MESSAGE D'ERREUR
          ===================================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =====================================================
              FORMULAIRE
          ===================================================== */}

          <form action={register} className="space-y-5">

            {/* PRÉNOM / NOM */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">
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
                <label className="text-xs font-bold text-slate-600 block mb-2">
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

            {/* TÉLÉPHONE / DATE DE NAISSANCE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">
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
                <label className="text-xs font-bold text-slate-600 block mb-2">
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

            {/* NATIONALITÉ / EMAIL */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-2">
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
                <label className="text-xs font-bold text-slate-600 block mb-2">
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

            {/* ADRESSE */}

            <div>

              <label className="text-xs font-bold text-slate-600 block mb-2">
                Adresse
              </label>

              <input
                name="address"
                required
                className="fin-input"
                placeholder="Cocody, Abidjan"
              />

            </div>

            {/* MOT DE PASSE */}

            <div>

              <label className="text-xs font-bold text-slate-600 block mb-2">
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

            {/* =====================================================
                SÉCURITÉ
            ===================================================== */}

            <div className="rounded-2xl border border-slate-200 bg-[#f0f4f9] px-5 py-4">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <span className="text-xl">
                    🛡️
                  </span>
                </div>

                <div>

                  <p className="text-sm font-bold text-[#14243a]">
                    Vos données sont protégées
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Vos informations personnelles sont traitées de manière sécurisée.
                  </p>

                </div>

              </div>

            </div>

            {/* =====================================================
                BOUTON CRÉATION DE COMPTE
            ===================================================== */}

            <PrimaryButton
              type="submit"
              fullWidth
              size="lg"
              className="!mt-2 !rounded-2xl !py-5 !text-sm !font-black !text-white"
              style={{
                backgroundColor: '#d4a72c',
                boxShadow:
                  '0 10px 25px rgba(212, 167, 44, 0.20)',
              }}
            >
              CRÉER MON COMPTE
            </PrimaryButton>

            {/* =====================================================
                CONNEXION
            ===================================================== */}

            <p className="text-center text-sm text-slate-500 pt-2">

              Déjà membre ?{' '}

              <Link
                href="/login"
                className="font-bold text-[#1455d9] hover:underline"
              >
                Se connecter
              </Link>

            </p>

          </form>

        </GlassCard>

      </div>

    </div>
  )
}