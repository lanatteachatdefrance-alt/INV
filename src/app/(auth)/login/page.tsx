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

        {/* ===================================================
            PANNEAU GAUCHE
        =================================================== */}

        <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#061b31] px-12 py-10 text-white">

          {/* Décorations */}
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

              {/* POINTS */}

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

        {/* ===================================================
            PANNEAU DROIT
        =================================================== */}

        <section className="flex min-h-[100dvh] items-center justify-center bg-[#f3f7fb] px-10 py-12">

          <div className="w-full max-w-md">

            {/* TITRE */}

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

            {/* FORMULAIRE */}

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

                {/* IDENTIFIANT */}

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

                {/* MOT DE PASSE */}

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
                      className="text-xs font-semibold text-[#1455d9] transition hover:text-[#0d3fa5] hover:underline"
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

                {/* CONNEXION */}

                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="lg"
                  className="!mt-7 !rounded-2xl !bg-[#d4a72c] !py-4 !text-sm !font-black !text-white !shadow-lg !shadow-[#d4a72c]/20 hover:!bg-[#bd9223]"
                >
                  SE CONNECTER
                </PrimaryButton>

              </form>

              {/* SÉCURITÉ */}

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

              {/* CRÉATION */}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Vous n’avez pas encore de compte ?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-block text-sm font-bold text-[#1455d9] transition hover:text-[#0d3fa5] hover:underline"
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

      <div className="flex min-h-[100dvh] flex-col lg:hidden">

        {/* HEADER BLEU NUIT */}

        <section className="relative overflow-hidden bg-[#061b31] px-6 pb-10 pt-8 text-white">

          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
                <img
                  src="/ICONE.jpeg"
                  alt="Investir en Bourse"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-black">
                  INVESTIR
                </p>

                <p className="text-sm font-black leading-none text-[#d4a72c]">
                  EN BOURSE
                </p>
              </div>

            </div>

            {/* TITRE */}

            <div className="mt-10">

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d4a72c]">
                ESPACE CLIENT
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight">
                Bienvenue
              </h1>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">
                Connectez-vous pour accéder à votre
                portefeuille et suivre vos investissements.
              </p>

            </div>

          </div>

        </section>

        {/* FORMULAIRE MOBILE */}

        <section className="flex flex-1 items-start bg-[#f3f7fb] px-5 py-7">

          <div className="w-full">

            <GlassCard
              className="w-full !border-slate-200 !bg-white !shadow-lg !shadow-slate-900/5"
              hover={false}
              padding="lg"
            >

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form action={login} className="space-y-5">

                {/* IDENTIFIANT */}

                <div>

                  <label
                    htmlFor="mobile-email"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Identifiant
                  </label>

                  <input
                    id="mobile-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 !text-base focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    placeholder="Votre adresse e-mail"
                  />

                </div>

                {/* MOT DE PASSE */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="mobile-password"
                      className="text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Mot de passe
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-[11px] font-semibold text-[#1455d9]"
                    >
                      Mot de passe oublié ?
                    </Link>

                  </div>

                  <input
                    id="mobile-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 !text-base focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    placeholder="Votre mot de passe"
                  />

                </div>

                {/* BOUTON */}

                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="lg"
                  className="!mt-7 !rounded-2xl !bg-[#d4a72c] !py-4 !text-sm !font-black !text-white !shadow-lg !shadow-[#d4a72c]/20"
                >
                  SE CONNECTER
                </PrimaryButton>

              </form>

              {/* SÉCURITÉ */}

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

              {/* COMPTE */}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Vous n’avez pas encore de compte ?
                </p>

                <Link
                  href="/register"
                  className="mt-2 inline-block text-sm font-bold text-[#1455d9]"
                >
                  Créer un compte
                </Link>

              </div>

            </GlassCard>

            <p className="mt-6 text-center text-[10px] text-slate-400">
              © {new Date().getFullYear()} Investir en Bourse
            </p>

          </div>

        </section>

      </div>

    </main>
  )
}