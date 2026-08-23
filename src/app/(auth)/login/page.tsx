'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, CircleHelp, ShieldCheck } from 'lucide-react'

import { login } from './actions'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#061b31]">

      {/* =====================================================
          PAGE FIXE
          ===================================================== */}

      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden">

        {/* ===================================================
            FOND BLEU
            =================================================== */}

        <div className="absolute inset-0 overflow-hidden bg-[#061b31]">

          {/* Cercle décoratif haut droit */}

          <div className="absolute -right-40 -top-48 h-[620px] w-[620px] rounded-full bg-[#153b69]" />

          <div className="absolute -right-20 -top-32 h-[500px] w-[500px] rounded-full border border-white/5" />

          {/* Lumière discrète */}

          <div className="absolute left-[-180px] top-[-150px] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        </div>


        {/* ===================================================
            CONTENU HAUT
            =================================================== */}

        <section className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pt-5">

          {/* =================================================
              HEADER
              ================================================= */}

          <div className="flex shrink-0 items-start justify-end">

            {/* BOUTON AIDE */}

            <div className="relative">

              <button
                type="button"
                onClick={() => setHelpOpen((value) => !value)}
                aria-expanded={helpOpen}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-3.5
                  text-xs
                  font-bold
                  text-white/90
                  shadow-sm
                  backdrop-blur-md
                  transition
                  active:scale-95
                "
              >

                <CircleHelp
                  size={17}
                  strokeWidth={2.2}
                />

                <span>Aide</span>

              </button>


              {/* MENU AIDE */}

              {helpOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-[200]
                    w-56
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#102b47]
                    p-1.5
                    shadow-2xl
                  "
                >

                  <Link
                    href="/forgot-password"
                    onClick={() => setHelpOpen(false)}
                    className="
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-xs
                      font-semibold
                      text-white/90
                      transition
                      hover:bg-white/10
                    "
                  >
                    Mot de passe oublié
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setHelpOpen(false)}
                    className="
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-xs
                      font-semibold
                      text-white/90
                      transition
                      hover:bg-white/10
                    "
                  >
                    Ouvrir un compte
                  </Link>

                  <a
                    href="mailto:contact@investirenbourse.org"
                    onClick={() => setHelpOpen(false)}
                    className="
                      block
                      rounded-xl
                      px-4
                      py-3
                      text-xs
                      font-semibold
                      text-white/90
                      transition
                      hover:bg-white/10
                    "
                  >
                    Nous contacter
                  </a>

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              LOGO CENTRAL IMPOSANT
              ================================================= */}

          <div className="flex min-h-0 flex-1 items-center justify-center">

            <div className="flex flex-col items-center justify-center">

              {/* LOGO */}

              <div
                className="
                  flex
                  h-32
                  w-32
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[32px]
                  bg-white
                  p-3
                  shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                  sm:h-36
                  sm:w-36
                "
              >

                <img
                  src="/ICONE.jpeg"
                  alt="Investir en Bourse"
                  className="h-full w-full object-contain"
                />

              </div>


              {/* NOM DE LA PLATEFORME */}

              <div className="mt-5 text-center">

                <p className="text-[25px] font-black leading-none tracking-tight text-white sm:text-[29px]">
                  INVESTIR
                </p>

                <p className="mt-1 text-[25px] font-black leading-none text-[#d4a72c] sm:text-[29px]">
                  EN BOURSE
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            PANNEAU CONNEXION
            =================================================== */}

        <section
          className="
            relative
            z-20
            shrink-0
            rounded-t-[30px]
            bg-white
            px-5
            pb-6
            pt-7
            shadow-[0_-15px_50px_rgba(0,0,0,0.18)]
            sm:px-8
            lg:rounded-t-[36px]
          "
        >

          <div className="mx-auto w-full max-w-md">

            {/* =================================================
                TITRE
                ================================================= */}

            <div className="mb-5">

              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#d4a72c]">
                ESPACE CLIENT
              </p>

              <h1 className="mt-1.5 text-[27px] font-black leading-none tracking-tight text-[#061b31]">
                Bienvenue
              </h1>

              <p className="mt-2 text-[12px] leading-5 text-slate-500">
                Connectez-vous pour accéder à votre portefeuille
                et suivre vos investissements.
              </p>

            </div>


            {/* =================================================
                ERREUR
                ================================================= */}

            {/* 
              L'erreur est gérée par la redirection actuelle
              de ton Server Action.
              On conserve donc ton système sans le modifier.
            */}


            {/* =================================================
                FORMULAIRE
                ================================================= */}

            <form
              action={login}
              className="space-y-3.5"
            >

              {/* EMAIL */}

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    z-10
                    flex
                    -translate-y-1/2
                    items-center
                    text-[#d4a72c]
                  "
                >

                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                    />

                    <path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6" />
                  </svg>

                </div>


                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Adresse e-mail"
                  className="
                    h-[58px]
                    w-full
                    rounded-[17px]
                    border
                    border-slate-300
                    bg-slate-50
                    pl-12
                    pr-4
                    text-[15px]
                    font-medium
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-[#d4a72c]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#d4a72c]/15
                  "
                />

              </div>


              {/* MOT DE PASSE */}

              <div className="relative">

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    z-10
                    flex
                    -translate-y-1/2
                    items-center
                    text-[#d4a72c]
                  "
                >

                  <svg
                    width="21"
                    height="21"
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
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Mot de passe"
                  className="
                    h-[58px]
                    w-full
                    rounded-[17px]
                    border
                    border-slate-300
                    bg-slate-50
                    pl-12
                    pr-12
                    text-[15px]
                    font-medium
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-[#d4a72c]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#d4a72c]/15
                  "
                />


                {/* OEIL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-10
                    w-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-xl
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                    active:scale-95
                  "
                >

                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}

                </button>

              </div>


              {/* =================================================
                  BOUTON MOT DE PASSE OUBLIÉ
                  ================================================= */}

              <div className="flex justify-end">

                <Link
                  href="/forgot-password"
                  className="
                    text-[12px]
                    font-bold
                    text-[#1455d9]
                    hover:underline
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
                  flex
                  h-[58px]
                  w-full
                  items-center
                  justify-center
                  rounded-[17px]
                  bg-[#d4a72c]
                  px-5
                  text-[14px]
                  font-black
                  text-[#061b31]
                  shadow-[0_8px_20px_rgba(212,167,44,0.25)]
                  transition
                  hover:bg-[#bd9223]
                  active:scale-[0.99]
                "
              >
                SE CONNECTER
              </button>

            </form>


            {/* =================================================
                SÉCURITÉ
                ================================================= */}

            <div
              className="
                mt-4
                rounded-[17px]
                border
                border-blue-100
                bg-[#f0f5fb]
                px-4
                py-3
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    shadow-sm
                  "
                >

                  <ShieldCheck
                    size={19}
                    className="text-[#d4a72c]"
                  />

                </div>


                <div className="min-w-0">

                  <p className="text-[12px] font-black text-slate-800">
                    Connexion sécurisée
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
                    Vos informations sont protégées par des
                    mesures de sécurité avancées.
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                CRÉATION DE COMPTE
                ================================================= */}

            <div className="mt-4 flex items-center justify-center">

              <Link
                href="/forgot-password"
                className="
                  px-3
                  text-[12px]
                  font-semibold
                  text-slate-800
                  hover:text-[#1455d9]
                "
              >
                Mot de passe oublié
              </Link>

              <div className="h-5 w-px bg-slate-300" />

              <Link
                href="/register"
                className="
                  px-3
                  text-[12px]
                  font-semibold
                  text-slate-800
                  hover:text-[#1455d9]
                "
              >
                Ouvrir un compte
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}