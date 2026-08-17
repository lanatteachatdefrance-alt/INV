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
    <main className="min-h-[100dvh] bg-[#061b31] text-white">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden min-h-[100dvh] lg:grid lg:grid-cols-2">

        {/* ===================================================
            PANNEAU GAUCHE
        =================================================== */}

        <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#061b31] px-12 py-10">

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

                Commencez
                <br />

                <span className="text-[#d4a72c]">
                  à investir.
                </span>

              </h1>


              <p className="mt-7 max-w-lg text-base leading-7 text-slate-300">

                Créez votre compte et accédez à votre
                espace personnel pour suivre et gérer
                vos investissements sur le marché régional.

              </p>


              {/* POINTS */}

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-[#d4a72c]">
                      ✓
                    </span>
                  </div>

                  <p className="text-sm text-white/80">
                    Un espace personnel sécurisé
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-[#d4a72c]">
                      ✓
                    </span>
                  </div>

                  <p className="text-sm text-white/80">
                    Suivez votre portefeuille
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-[#d4a72c]">
                      ✓
                    </span>
                  </div>

                  <p className="text-sm text-white/80">
                    Accédez aux opportunités du marché
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

        <section className="min-h-[100dvh] overflow-y-auto bg-[#f3f7fb] px-10 py-10">

          <div className="mx-auto w-full max-w-xl">

            {/* TITRE */}

            <div className="mb-7">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a72c]">
                ESPACE CLIENT
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0a1b2e]">
                Créer un compte
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Rejoignez la plateforme d’investissement
                et commencez à construire votre avenir.
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


              <form
                action={register}
                className="space-y-4"
              >

                {/* PRÉNOM / NOM */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Prénom
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      required
                      className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                      placeholder="Jean"
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Nom
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      required
                      className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                      placeholder="Kouassi"
                    />

                  </div>

                </div>


                {/* TÉLÉPHONE / DATE */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Téléphone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                      placeholder="+225 07…"
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="dateOfBirth"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Date de naissance
                    </label>

                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    />

                  </div>

                </div>


                {/* NATIONALITÉ / EMAIL */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="nationality"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Nationalité
                    </label>

                    <input
                      id="nationality"
                      name="nationality"
                      required
                      className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                      placeholder="Ivoirienne"
                    />

                  </div>


                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                      placeholder="nom@exemple.com"
                    />

                  </div>

                </div>


                {/* ADRESSE */}

                <div>

                  <label
                    htmlFor="address"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Adresse
                  </label>

                  <input
                    id="address"
                    name="address"
                    required
                    className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    placeholder="Cocody, Abidjan"
                  />

                </div>


                {/* MOT DE PASSE */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Mot de passe
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    className="fin-input !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !py-4 transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
                    placeholder="••••••••"
                  />

                </div>


                {/* BOUTON */}

                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="lg"
                  className="!mt-6 !rounded-2xl !bg-[#d4a72c] !py-4 !text-sm !font-black !text-white !shadow-lg !shadow-[#d4a72c]/20 hover:!bg-[#bd9223]"
                >
                  CRÉER MON COMPTE
                </PrimaryButton>


                {/* SÉCURITÉ */}

                <div className="mt-6 rounded-2xl border border-blue-100 bg-[#f0f5fb] px-4 py-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                      <span className="text-lg">
                        🛡️
                      </span>

                    </div>

                    <div>

                      <p className="text-xs font-bold text-slate-800">
                        Création sécurisée
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        Vos informations sont protégées par
                        des mesures de sécurité avancées.
                      </p>

                    </div>

                  </div>

                </div>


                {/* CONNEXION */}

                <div className="border-t border-slate-100 pt-6 text-center">

                  <p className="text-sm text-slate-500">
                    Vous avez déjà un compte ?
                  </p>

                  <Link
                    href="/login"
                    className="mt-2 inline-block text-sm font-bold text-[#1455d9] hover:text-[#0d3fa5] hover:underline"
                  >
                    Se connecter
                  </Link>

                </div>

              </form>

            </GlassCard>

          </div>

        </section>

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="min-h-[100dvh] bg-[#061b31] lg:hidden">

        {/* HEADER */}

        <header className="sticky top-0 z-50 flex h-[74px] items-center justify-between bg-white px-5 shadow-sm">

          <Link
            href="/login"
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md"
          >

            <img
              src="/ICONE.jpeg"
              alt="Investir en Bourse"
              className="h-full w-full object-contain"
            />

          </Link>


          <h1 className="text-lg font-bold text-[#111827]">
            Créer un compte
          </h1>


          <Link
            href="/login"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-700 shadow-sm"
            aria-label="Connexion"
          >
            →
          </Link>

        </header>


        {/* CONTENU */}

        <section className="px-5 pb-28 pt-10">

          {/* LOGO */}

          <div className="flex flex-col items-center">

            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] bg-white shadow-xl">

              <img
                src="/ICONE.jpeg"
                alt="Investir en Bourse"
                className="h-full w-full object-contain"
              />

            </div>


            <div className="mt-6 text-center">

              <h2 className="text-[34px] font-black leading-none">
                CRÉER UN
              </h2>

              <h3 className="mt-1 text-[34px] font-black leading-none text-[#d4a72c]">
                COMPTE
              </h3>

              <p className="mt-5 text-base text-slate-300">
                Rejoignez Investir en Bourse.
              </p>

            </div>

          </div>


          {/* ERREUR */}

          {error && (

            <div className="mt-8 rounded-[22px] border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {error}
            </div>

          )}


          {/* FORMULAIRE */}

          <form
            action={register}
            className="mt-9 space-y-4"
          >

            {/* PRÉNOM */}

            <input
              name="firstName"
              required
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Prénom"
            />


            {/* NOM */}

            <input
              name="lastName"
              required
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Nom"
            />


            {/* TÉLÉPHONE */}

            <input
              name="phone"
              type="tel"
              required
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Téléphone"
            />


            {/* DATE */}

            <input
              name="dateOfBirth"
              type="date"
              required
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
            />


            {/* NATIONALITÉ */}

            <input
              name="nationality"
              required
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Nationalité"
            />


            {/* EMAIL */}

            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Adresse e-mail"
            />


            {/* ADRESSE */}

            <input
              name="address"
              required
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Adresse"
            />


            {/* MOT DE PASSE */}

            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="h-[68px] w-full rounded-[22px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-300 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
              placeholder="Mot de passe"
            />


            {/* BOUTON */}

            <PrimaryButton
              type="submit"
              fullWidth
              size="lg"
              className="!mt-6 !h-[72px] !rounded-[24px] !bg-[#e0ad27] !text-base !font-black !text-white !shadow-xl !shadow-[#d4a72c]/20"
            >
              CRÉER MON COMPTE
            </PrimaryButton>

          </form>


          {/* SÉCURITÉ */}

          <div className="mt-8 rounded-[24px] border border-white/10 bg-[#102b47] px-5 py-5">

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

                <p className="text-base font-black text-white">
                  Création sécurisée
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Vos informations sont protégées par
                  des mesures de sécurité avancées.
                </p>

              </div>

            </div>

          </div>


          {/* RETOUR CONNEXION */}

          <div className="mt-8 text-center">

            <p className="text-sm text-slate-400">
              Vous avez déjà un compte ?
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block font-bold text-[#d4a72c]"
            >
              Se connecter
            </Link>

          </div>

        </section>


        {/* NAVIGATION BAS */}

        <nav className="fixed bottom-0 left-0 right-0 z-50 h-[82px] border-t border-slate-200 bg-white px-8 shadow-[0_-5px_20px_rgba(0,0,0,0.08)]">

          <div className="mx-auto flex h-full max-w-md items-center justify-between">

            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-slate-500"
            >

              <span className="text-2xl">
                ⌂
              </span>

              <span className="text-xs font-semibold">
                Accueil
              </span>

            </Link>


            <Link
              href="/login"
              className="flex flex-col items-center gap-1 text-slate-500"
            >

              <span className="text-2xl">
                →
              </span>

              <span className="text-xs font-semibold">
                Connexion
              </span>

            </Link>


            <Link
              href="/register"
              className="flex flex-col items-center gap-1 text-[#1455d9]"
            >

              <span className="text-2xl">
                ♙
              </span>

              <span className="text-xs font-bold">
                Compte
              </span>

            </Link>

          </div>

        </nav>

      </div>

    </main>
  )
}