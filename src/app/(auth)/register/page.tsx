import { login } from './actions'
import Link from 'next/link'

export default function Login({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#031A32] text-white">

      {/* =====================================================
          FOND BLEU NUIT
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-b from-[#031A32] via-[#062544] to-[#031426]" />

      {/* Halo lumineux discret */}
      <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D9A72B]/[0.06] blur-[120px]" />

      {/* =====================================================
          SKYLINE EN BAS
      ===================================================== */}

      <div
        className="absolute inset-x-0 bottom-0 h-[38%] bg-cover bg-bottom bg-no-repeat opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(3,26,50,0) 0%, rgba(3,20,38,.35) 25%, rgba(3,20,38,.9) 100%), url('/city-night.jpg')",
        }}
      />

      {/* =====================================================
          CONTENU
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[520px] flex-col px-6 pb-8 pt-10">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="flex flex-col items-center text-center">

          <img
            src="/ICONE.jpeg"
            alt="Investir en Bourse"
            className="h-[105px] w-[105px] rounded-[28px] object-cover shadow-[0_12px_45px_rgba(0,0,0,.35)] ring-1 ring-white/20"
          />

          <h1 className="mt-5 text-[38px] font-black leading-[0.95] tracking-[-0.04em]">
            INVESTIR
          </h1>

          <h2 className="mt-1 text-[34px] font-black leading-none tracking-[-0.04em] text-[#D9A72B]">
            EN BOURSE
          </h2>

          <p className="mt-4 text-[15px] font-medium tracking-wide text-white/75">
            Votre avenir, notre priorité.
          </p>

        </div>

        {/* =====================================================
            INTRODUCTION
        ===================================================== */}

        <section className="mt-10">

          <p className="text-[12px] font-black uppercase tracking-[0.32em] text-[#D9A72B]">
            Espace client
          </p>

          <h2 className="mt-3 text-[42px] font-black leading-none tracking-[-0.04em]">
            Bienvenue
          </h2>

          <p className="mt-4 max-w-[430px] text-[17px] leading-7 text-white/70">
            Connectez-vous pour accéder à votre portefeuille
            et suivre vos investissements.
          </p>

        </section>

        {/* =====================================================
            FORMULAIRE
        ===================================================== */}

        <section className="mt-8">

          {error && (
            <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form action={login} className="space-y-4">

            {/* IDENTIFIANT */}

            <div
              className="
                flex h-[72px] items-center
                rounded-[20px]
                border border-white/25
                bg-white/[0.045]
                px-5
                shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
                backdrop-blur-md
                transition
                focus-within:border-[#D9A72B]
                focus-within:bg-white/[0.07]
              "
            >

              <div className="mr-4 flex h-9 w-9 shrink-0 items-center justify-center text-[#D9A72B]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-3.6 3.1-5.5 7-5.5s6.2 1.9 7 5.5" />
                </svg>
              </div>

              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="Identifiant"
                className="
                  h-full w-full
                  bg-transparent
                  text-[17px]
                  font-medium
                  text-white
                  outline-none
                  placeholder:text-white/60
                "
              />

            </div>

            {/* MOT DE PASSE */}

            <div
              className="
                flex h-[72px] items-center
                rounded-[20px]
                border border-white/25
                bg-white/[0.045]
                px-5
                shadow-[inset_0_1px_0_rgba(255,255,255,.04)]
                backdrop-blur-md
                transition
                focus-within:border-[#D9A72B]
                focus-within:bg-white/[0.07]
              "
            >

              <div className="mr-4 flex h-9 w-9 shrink-0 items-center justify-center text-[#D9A72B]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                  />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </div>

              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Mot de passe"
                className="
                  h-full w-full
                  bg-transparent
                  text-[17px]
                  font-medium
                  text-white
                  outline-none
                  placeholder:text-white/60
                "
              />

              <button
                type="button"
                aria-label="Afficher le mot de passe"
                className="ml-3 text-white/80 transition hover:text-[#D9A72B]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7"
                >
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </button>

            </div>

            {/* MOT DE PASSE OUBLIÉ */}

            <div className="flex justify-end px-1">

              <Link
                href="/forgot-password"
                className="
                  text-sm
                  font-bold
                  text-[#D9A72B]
                  transition
                  hover:text-[#F0C44F]
                "
              >
                Mot de passe oublié ?
              </Link>

            </div>

            {/* =================================================
                BOUTON CONNEXION
            ================================================= */}

            <button
              type="submit"
              className="
                mt-1
                flex h-[68px] w-full
                items-center justify-center
                rounded-[20px]
                border border-[#F0C44F]
                bg-[#D9A72B]
                px-6
                text-[17px]
                font-black
                tracking-wide
                text-white
                shadow-[0_12px_35px_rgba(217,167,43,.28)]
                transition
                hover:bg-[#E4B63A]
                active:scale-[0.985]
              "
            >
              SE CONNECTER
            </button>

          </form>

        </section>

        {/* =====================================================
            SÉCURITÉ
        ===================================================== */}

        <div
          className="
            mt-7
            rounded-[20px]
            border border-white/20
            bg-white/[0.035]
            px-5 py-5
            backdrop-blur-md
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-2xl
                border border-[#D9A72B]/50
                bg-[#D9A72B]/10
                text-[#D9A72B]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
              >
                <path d="M12 3 5 6v5c0 4.6 2.8 8.2 7 10 4.2-1.8 7-5.4 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <div>

              <p className="text-[15px] font-bold text-white">
                Connexion sécurisée
              </p>

              <p className="mt-1 text-[13px] leading-5 text-white/60">
                Vos informations sont protégées par un
                chiffrement avancé.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            CRÉATION DE COMPTE
        ===================================================== */}

        <div className="mt-8">

          <div className="flex items-center gap-4">

            <div className="h-px flex-1 bg-white/20" />

            <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Vous n’avez pas de compte ?
            </p>

            <div className="h-px flex-1 bg-white/20" />

          </div>

          <Link
            href="/register"
            className="
              mt-5
              flex h-[64px] w-full
              items-center justify-center
              rounded-[20px]
              border border-[#D9A72B]
              bg-white/[0.02]
              px-6
              text-[16px]
              font-black
              tracking-wide
              text-[#D9A72B]
              backdrop-blur-md
              transition
              hover:bg-[#D9A72B]/10
              active:scale-[0.985]
            "
          >
            CRÉER UN COMPTE
          </Link>

        </div>

        {/* ESPACE BAS */}

        <div className="h-10 shrink-0" />

      </div>

    </main>
  )
}