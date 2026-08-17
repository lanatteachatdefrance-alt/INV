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
    <main className="min-h-[100dvh] bg-[#f3f7fb]">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden min-h-[100dvh] lg:grid lg:grid-cols-2">

        {/* PANNEAU GAUCHE */}

        <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#061b31] px-12 py-10 text-white">

          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#d4a72c]/10 blur-3xl" />

          {/* LOGO */}

          <div className="relative z-10 flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src="/ICONE.jpeg"
                alt="Investir en Bourse"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                INVESTIR
              </p>

              <p className="text-lg font-black leading-none text-[#d4a72c]">
                EN BOURSE
              </p>
            </div>

          </div>

          {/* CONTENU */}

          <div className="relative z-10 flex flex-1 items-center">

            <div className="max-w-xl">

              <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span className="mr-2 h-2 w-2 rounded-full bg-[#d4a72c]" />

                <span className="text-xs font-semibold tracking-wide text-white/70">
                  PLATEFORME D’INVESTISSEMENT
                </span>
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">
                Votre avenir,
                <br />
                <span className="text-[#d4a72c]">
                  notre priorité.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-slate-300">
                Accédez à votre espace personnel et suivez
                vos investissements sur le marché régional.
              </p>

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-[#d4a72c]">✓</span>
                  </div>

                  <p className="text-sm text-white/80">
                    Suivez votre portefeuille en temps réel
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-[#d4a72c]">✓</span>
                  </div>

                  <p className="text-sm text-white/80">
                    Accédez aux opportunités du marché régional
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-[#d4a72c]">✓</span>
                  </div>

                  <p className="text-sm text-white/80">
                    Gérez vos opérations depuis un seul espace
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <div className="relative z-10 border-t border-white/10 pt-5">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Investir en Bourse —
              Votre avenir, notre priorité.
            </p>
          </div>

        </section>

        {/* PANNEAU DROIT */}

        <section className="flex min-h-[100dvh] items-center justify-center bg-[#f3f7fb] px-10 py-12">

          <div className="w-full max-w-md">

            <div className="mb-8">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a72c]">
                ESPACE CLIENT
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0a1b2e]">
                Bienvenue
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Connectez-vous à votre compte pour accéder
                à votre portefeuille.
              </p>

            </div>

            <GlassCard
              className="w-full !border-slate-200 !bg-white !shadow-xl !shadow-slate-900/5"
              hover={false}
              padding="lg"
            >

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                  {error}
                </div>
              )}

              <form action={login} className="space-y-5">

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Identifiant
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 !text-base transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    placeholder="Votre adresse e-mail"
                  />

                </div>

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Mot de passe
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#1455d9] hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>

                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 !text-base transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    placeholder="Votre mot de passe"
                  />

                </div>

                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="lg"
                  className="!mt-7 !rounded-2xl !bg-[#d4a72c] !py-4 !text-sm !font-black !text-white !shadow-lg !shadow-[#d4a72c]/20 hover:!bg-[#bd9223]"
                >
                  SE CONNECTER
                </PrimaryButton>

              </form>

              <div className="mt-7 rounded-2xl border border-blue-100 bg-[#f0f5fb] px-4 py-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <span className="text-lg">
                      🛡️
                    </span>
                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-800">
                      Connexion sécurisée
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Vos informations sont protégées par
                      des mesures de sécurité avancées.
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Vous n’avez pas encore de compte ?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-block text-sm font-bold text-[#1455d9] hover:underline"
                >
                  Créer un compte
                </Link>

              </div>

            </GlassCard>

          </div>

        </section>

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="min-h-[100dvh] bg-[#061b31] text-white lg:hidden pb-24">

        {/* HEADER */}

        <header className="sticky top-0 z-50 flex h-[74px] items-center justify-between bg-white px-5 shadow-sm">

          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md"
          >
            <img
              src="/ICONE.jpeg"
              alt="Investir en Bourse"
              className="h-full w-full object-contain"
            />
          </Link>

          <h1 className="text-lg font-bold text-[#111827]">
            Connexion
          </h1>

          <button
            type="button"
            aria-label="Menu"
            className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white shadow-sm"
          >
            <span className="h-0.5 w-6 bg-slate-700" />
            <span className="h-0.5 w-6 bg-slate-700" />
            <span className="h-0.5 w-6 bg-slate-700" />
          </button>

        </header>


        {/* CONTENU */}

        <section className="px-5 pb-10 pt-10">

          {/* LOGO */}

          <div className="flex flex-col items-center">

            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] bg-white shadow-xl">
              <img
                src="/ICONE.jpeg"
                alt="Investir en Bourse"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-7 text-center">

              <h2 className="text-[42px] font-black leading-none tracking-tight">
                INVESTIR
              </h2>

              <h3 className="mt-1 text-[40px] font-black leading-none text-[#d4a72c]">
                EN BOURSE
              </h3>

              <p className="mt-7 text-[20px] text-slate-300">
                Votre avenir, notre priorité.
              </p>

            </div>

          </div>


          {/* ESPACE CLIENT */}

          <div className="mt-14">

            <p className="text-[13px] font-black uppercase tracking-[0.35em] text-[#d4a72c]">
              ESPACE CLIENT
            </p>

            <h2 className="mt-4 text-[42px] font-black leading-none">
              Bienvenue
            </h2>

            <p className="mt-7 max-w-md text-[20px] leading-8 text-slate-300">
              Connectez-vous pour accéder à votre
              portefeuille et suivre vos investissements.
            </p>

          </div>


          {/* ERREUR */}

          {error && (
            <div className="mt-8 rounded-[22px] border border-red-400/30 bg-red-500/10 px-5 py-4 text-base text-red-200">
              {error}
            </div>
          )}


          {/* FORMULAIRE */}

          <form
            action={login}
            className="mt-10 space-y-5"
          >

            {/* IDENTIFIANT */}

            <div className="relative">

              <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#d4a72c]">

                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
                </svg>

              </div>

              <input
                id="mobile-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="h-[78px] w-full rounded-[24px] border border-white/20 bg-[#153452] pl-[70px] pr-5 text-[18px] text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                placeholder="Identifiant"
              />

            </div>


            {/* MOT DE PASSE */}

            <div className="relative">

              <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#d4a72c]">

                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                  />

                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

              </div>

              <input
                id="mobile-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-[78px] w-full rounded-[24px] border border-white/20 bg-[#153452] pl-[70px] pr-16 text-[18px] text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                placeholder="Mot de passe"
              />

              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-200">

                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>

              </div>

            </div>


            {/* MOT DE PASSE OUBLIÉ */}

            <div className="flex justify-end pt-1">

              <Link
                href="/forgot-password"
                className="text-[16px] font-bold text-[#d4a72c]"
              >
                Mot de passe oublié ?
              </Link>

            </div>


            {/* BOUTON */}

            <PrimaryButton
              type="submit"
              fullWidth
              size="lg"
              className="!mt-7 !h-[78px] !rounded-[26px] !bg-[#e0ad27] !text-[18px] !font-black !text-white !shadow-xl !shadow-[#d4a72c]/20"
            >
              SE CONNECTER
            </PrimaryButton>

          </form>


          {/* SÉCURITÉ */}

          <div className="mt-10 rounded-[26px] border border-white/10 bg-[#102b47] px-5 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d4a72c]/40 bg-[#061b31]">

                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d4a72c"
                  strokeWidth="2"
                >
                  <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>

              </div>

              <div>

                <p className="text-[17px] font-black">
                  Connexion sécurisée
                </p>

                <p className="mt-1 text-[12px] leading-5 text-slate-400">
                  Vos informations sont protégées par
                  des mesures de sécurité avancées.
                </p>

              </div>

            </div>

          </div>


          {/* CRÉATION DE COMPTE */}

          <div className="mt-8 pb-8 text-center">

            <p className="text-sm text-slate-400">
              Vous n’avez pas encore de compte ?
            </p>

            <Link
              href="/register"
              className="mt-2 inline-block font-bold text-[#d4a72c]"
            >
              Créer un compte
            </Link>

          </div>

        </section>


        {/* NAVIGATION */}

        <nav className="fixed bottom-0 left-0 right-0 z-50 h-[82px] border-t border-slate-200 bg-white px-8 shadow-[0_-5px_20px_rgba(0,0,0,0.08)]">

          <div className="mx-auto flex h-full max-w-md items-center justify-between">

            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-slate-500"
            >
              <span className="text-2xl">⌂</span>

              <span className="text-xs font-semibold">
                Accueil
              </span>
            </Link>

            <Link
              href="/login"
              className="flex flex-col items-center gap-1 text-[#1455d9]"
            >
              <span className="text-2xl">→</span>

              <span className="text-xs font-bold">
                Connexion
              </span>
            </Link>

            <Link
              href="/register"
              className="flex flex-col items-center gap-1 text-slate-500"
            >
              <span className="text-2xl">♙</span>

              <span className="text-xs font-semibold">
                Compte
              </span>
            </Link>

          </div>

        </nav>

      </div>

    </main>
  )
}