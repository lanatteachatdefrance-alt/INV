'use client'

import { register } from './actions'
import Link from 'next/link'
import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton } from '@/components/ui/Buttons'

type Country = {
  code: string
  name: string
  dialCode: string
  flag: string
  region: string
}

const COUNTRIES: Country[] = [
  // =====================================================
  // UEMOA
  // =====================================================

  {
    code: 'CI',
    name: "Côte d'Ivoire",
    dialCode: '+225',
    flag: '🇨🇮',
    region: 'UEMOA',
  },
  {
    code: 'BJ',
    name: 'Bénin',
    dialCode: '+229',
    flag: '🇧🇯',
    region: 'UEMOA',
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    dialCode: '+226',
    flag: '🇧🇫',
    region: 'UEMOA',
  },
  {
    code: 'GW',
    name: 'Guinée-Bissau',
    dialCode: '+245',
    flag: '🇬🇼',
    region: 'UEMOA',
  },
  {
    code: 'ML',
    name: 'Mali',
    dialCode: '+223',
    flag: '🇲🇱',
    region: 'UEMOA',
  },
  {
    code: 'NE',
    name: 'Niger',
    dialCode: '+227',
    flag: '🇳🇪',
    region: 'UEMOA',
  },
  {
    code: 'SN',
    name: 'Sénégal',
    dialCode: '+221',
    flag: '🇸🇳',
    region: 'UEMOA',
  },
  {
    code: 'TG',
    name: 'Togo',
    dialCode: '+228',
    flag: '🇹🇬',
    region: 'UEMOA',
  },

  // =====================================================
  // AFRIQUE CENTRALE
  // =====================================================

  {
    code: 'CM',
    name: 'Cameroun',
    dialCode: '+237',
    flag: '🇨🇲',
    region: 'Afrique centrale',
  },
  {
    code: 'CF',
    name: 'République centrafricaine',
    dialCode: '+236',
    flag: '🇨🇫',
    region: 'Afrique centrale',
  },
  {
    code: 'TD',
    name: 'Tchad',
    dialCode: '+235',
    flag: '🇹🇩',
    region: 'Afrique centrale',
  },
  {
    code: 'CG',
    name: 'Congo',
    dialCode: '+242',
    flag: '🇨🇬',
    region: 'Afrique centrale',
  },
  {
    code: 'GQ',
    name: 'Guinée équatoriale',
    dialCode: '+240',
    flag: '🇬🇶',
    region: 'Afrique centrale',
  },
  {
    code: 'GA',
    name: 'Gabon',
    dialCode: '+241',
    flag: '🇬🇦',
    region: 'Afrique centrale',
  },

  // =====================================================
  // EUROPE - DIASPORA
  // =====================================================

  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    region: 'Europe',
  },
  {
    code: 'BE',
    name: 'Belgique',
    dialCode: '+32',
    flag: '🇧🇪',
    region: 'Europe',
  },
  {
    code: 'CH',
    name: 'Suisse',
    dialCode: '+41',
    flag: '🇨🇭',
    region: 'Europe',
  },
  {
    code: 'IT',
    name: 'Italie',
    dialCode: '+39',
    flag: '🇮🇹',
    region: 'Europe',
  },
  {
    code: 'ES',
    name: 'Espagne',
    dialCode: '+34',
    flag: '🇪🇸',
    region: 'Europe',
  },
  {
    code: 'PT',
    name: 'Portugal',
    dialCode: '+351',
    flag: '🇵🇹',
    region: 'Europe',
  },
  {
    code: 'DE',
    name: 'Allemagne',
    dialCode: '+49',
    flag: '🇩🇪',
    region: 'Europe',
  },
  {
    code: 'GB',
    name: 'Royaume-Uni',
    dialCode: '+44',
    flag: '🇬🇧',
    region: 'Europe',
  },
  {
    code: 'NL',
    name: 'Pays-Bas',
    dialCode: '+31',
    flag: '🇳🇱',
    region: 'Europe',
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    dialCode: '+352',
    flag: '🇱🇺',
    region: 'Europe',
  },
  {
    code: 'IE',
    name: 'Irlande',
    dialCode: '+353',
    flag: '🇮🇪',
    region: 'Europe',
  },
  {
    code: 'SE',
    name: 'Suède',
    dialCode: '+46',
    flag: '🇸🇪',
    region: 'Europe',
  },
  {
    code: 'NO',
    name: 'Norvège',
    dialCode: '+47',
    flag: '🇳🇴',
    region: 'Europe',
  },
  {
    code: 'DK',
    name: 'Danemark',
    dialCode: '+45',
    flag: '🇩🇰',
    region: 'Europe',
  },
  {
    code: 'FI',
    name: 'Finlande',
    dialCode: '+358',
    flag: '🇫🇮',
    region: 'Europe',
  },
  {
    code: 'AT',
    name: 'Autriche',
    dialCode: '+43',
    flag: '🇦🇹',
    region: 'Europe',
  },
  {
    code: 'GR',
    name: 'Grèce',
    dialCode: '+30',
    flag: '🇬🇷',
    region: 'Europe',
  },

  // =====================================================
  // AMÉRIQUE DU NORD
  // =====================================================

  {
    code: 'US',
    name: 'États-Unis',
    dialCode: '+1',
    flag: '🇺🇸',
    region: 'Amérique du Nord',
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    region: 'Amérique du Nord',
  },
]

type FormDataState = {
  firstName: string
  lastName: string
  countryCode: string
  phone: string
  dateOfBirth: string
  nationality: string
  email: string
  address: string
  password: string
}

export default function Register({
  searchParams,
}: {
  searchParams: {
    error?: string
  }
}) {
  const error = searchParams?.error

  const [step, setStep] = useState(1)

  const [formData, setFormData] =
    useState<FormDataState>({
      firstName: '',
      lastName: '',
      countryCode: 'CI',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      email: '',
      address: '',
      password: '',
    })

  const [showPassword, setShowPassword] =
    useState(false)

  const updateField = (
    field: keyof FormDataState,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const selectedCountry =
    COUNTRIES.find(
      (country) =>
        country.code === formData.countryCode
    ) || COUNTRIES[0]

  const nextStep = () => {
    if (step === 1) {
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim()
      ) {
        return
      }
    }

    if (step === 2) {
      if (
        !formData.phone.trim() ||
        !formData.dateOfBirth
      ) {
        return
      }
    }

    if (step === 3) {
      if (
        !formData.nationality.trim() ||
        !formData.email.trim() ||
        !formData.address.trim()
      ) {
        return
      }
    }

    if (step < 4) {
      setStep((value) => value + 1)
    }
  }

  const previousStep = () => {
    if (step > 1) {
      setStep((value) => value - 1)
    }
  }

  const progress =
    step === 1
      ? 25
      : step === 2
        ? 50
        : step === 3
          ? 75
          : 100

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#061b31] text-white">

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden h-[100dvh] lg:grid lg:grid-cols-2">

        {/* ===================================================
            PANNEAU GAUCHE
        =================================================== */}

        <section className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#061b31] px-12 py-10">

          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#d4a72c]/10 blur-3xl" />

          {/* LOGO */}

          <Link
            href="/"
            className="relative z-10 flex items-center gap-4"
          >

            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl">

              <img
                src="/ICONE.jpeg"
                alt="Investir en Bourse"
                className="h-full w-full object-contain"
              />

            </div>

            <div>

              <p className="text-xl font-black tracking-tight">
                INVESTIR
              </p>

              <p className="text-xl font-black leading-none text-[#d4a72c]">
                EN BOURSE
              </p>

            </div>

          </Link>


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

              <div className="mt-10 space-y-4">

                {[
                  'Un espace personnel sécurisé',
                  'Suivez votre portefeuille',
                  'Accédez aux opportunités du marché',
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-4"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <span className="text-[#d4a72c]">
                        ✓
                      </span>
                    </div>

                    <p className="text-sm text-white/80">
                      {text}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

          <div className="relative z-10 border-t border-white/10 pt-5">

            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Investir en Bourse —
              Votre avenir, notre priorité.
            </p>

          </div>

        </section>


        {/* ===================================================
            FORMULAIRE DESKTOP
        =================================================== */}

        <section className="h-[100dvh] overflow-hidden bg-[#f3f7fb] px-10 py-8">

          <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center">

            <div className="mb-5">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4a72c]">
                ESPACE CLIENT
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0a1b2e]">
                Créer un compte
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Étape {step} sur 4
              </p>

            </div>


            {/* PROGRESSION */}

            <div className="mb-5">

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-[#d4a72c] transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">

                <span
                  className={
                    step >= 1
                      ? 'text-[#d4a72c]'
                      : ''
                  }
                >
                  Identité
                </span>

                <span
                  className={
                    step >= 2
                      ? 'text-[#d4a72c]'
                      : ''
                  }
                >
                  Téléphone
                </span>

                <span
                  className={
                    step >= 3
                      ? 'text-[#d4a72c]'
                      : ''
                  }
                >
                  Coordonnées
                </span>

                <span
                  className={
                    step >= 4
                      ? 'text-[#d4a72c]'
                      : ''
                  }
                >
                  Sécurité
                </span>

              </div>

            </div>


            <GlassCard
              className="w-full !border-slate-200 !bg-white !shadow-xl !shadow-slate-900/5"
              hover={false}
              padding="lg"
            >

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form action={register}>

                {/* VALEURS CONSERVÉES */}

                <input
                  type="hidden"
                  name="firstName"
                  value={formData.firstName}
                />

                <input
                  type="hidden"
                  name="lastName"
                  value={formData.lastName}
                />

                <input
                  type="hidden"
                  name="countryCode"
                  value={formData.countryCode}
                />

                <input
                  type="hidden"
                  name="phone"
                  value={formData.phone}
                />

                <input
                  type="hidden"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                />

                <input
                  type="hidden"
                  name="nationality"
                  value={formData.nationality}
                />

                <input
                  type="hidden"
                  name="email"
                  value={formData.email}
                />

                <input
                  type="hidden"
                  name="address"
                  value={formData.address}
                />

                <input
                  type="hidden"
                  name="password"
                  value={formData.password}
                />


                {/* =================================================
                    ÉTAPE 1
                ================================================= */}

                {step === 1 && (
                  <div className="space-y-5">

                    <StepTitle
                      number="01"
                      title="Votre identité"
                      description="Commencez par renseigner vos informations personnelles."
                    />

                    <Input
                      label="Prénom"
                      value={formData.firstName}
                      onChange={(value) =>
                        updateField(
                          'firstName',
                          value
                        )
                      }
                      placeholder="Jean"
                    />

                    <Input
                      label="Nom"
                      value={formData.lastName}
                      onChange={(value) =>
                        updateField(
                          'lastName',
                          value
                        )
                      }
                      placeholder="Kouassi"
                    />

                  </div>
                )}


                {/* =================================================
                    ÉTAPE 2
                ================================================= */}

                {step === 2 && (
                  <div className="space-y-5">

                    <StepTitle
                      number="02"
                      title="Vos coordonnées"
                      description="Indiquez votre numéro et votre date de naissance."
                    />

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Téléphone
                      </label>

                      <div className="flex gap-2">

                        <select
                          value={
                            formData.countryCode
                          }
                          onChange={(event) =>
                            updateField(
                              'countryCode',
                              event.target.value
                            )
                          }
                          className="h-[58px] w-[135px] shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/10"
                        >

                          <optgroup label="UEMOA">

                            {COUNTRIES
                              .filter(
                                (country) =>
                                  country.region ===
                                  'UEMOA'
                              )
                              .map((country) => (
                                <option
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.flag}{' '}
                                  {country.dialCode}
                                </option>
                              ))}

                          </optgroup>

                          <optgroup label="Afrique centrale">

                            {COUNTRIES
                              .filter(
                                (country) =>
                                  country.region ===
                                  'Afrique centrale'
                              )
                              .map((country) => (
                                <option
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.flag}{' '}
                                  {country.dialCode}
                                </option>
                              ))}

                          </optgroup>

                          <optgroup label="Europe">

                            {COUNTRIES
                              .filter(
                                (country) =>
                                  country.region ===
                                  'Europe'
                              )
                              .map((country) => (
                                <option
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.flag}{' '}
                                  {country.dialCode}
                                </option>
                              ))}

                          </optgroup>

                          <optgroup label="Amérique du Nord">

                            {COUNTRIES
                              .filter(
                                (country) =>
                                  country.region ===
                                  'Amérique du Nord'
                              )
                              .map((country) => (
                                <option
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.flag}{' '}
                                  {country.dialCode}
                                </option>
                              ))}

                          </optgroup>

                        </select>


                        <input
                          type="tel"
                          inputMode="tel"
                          value={
                            formData.phone
                          }
                          onChange={(event) =>
                            updateField(
                              'phone',
                              event.target.value
                            )
                          }
                          className="h-[58px] min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/10"
                          placeholder="07 00 00 00 00"
                        />

                      </div>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {selectedCountry.flag}{' '}
                        {selectedCountry.name}{' '}
                        — {selectedCountry.dialCode}
                      </p>

                    </div>


                    <Input
                      label="Date de naissance"
                      type="date"
                      value={
                        formData.dateOfBirth
                      }
                      onChange={(value) =>
                        updateField(
                          'dateOfBirth',
                          value
                        )
                      }
                    />

                  </div>
                )}


                {/* =================================================
                    ÉTAPE 3
                ================================================= */}

                {step === 3 && (
                  <div className="space-y-5">

                    <StepTitle
                      number="03"
                      title="Vos coordonnées"
                      description="Complétez vos informations de résidence et de contact."
                    />

                    <Input
                      label="Nationalité"
                      value={
                        formData.nationality
                      }
                      onChange={(value) =>
                        updateField(
                          'nationality',
                          value
                        )
                      }
                      placeholder="Ivoirienne"
                    />

                    <Input
                      label="Adresse e-mail"
                      type="email"
                      value={formData.email}
                      onChange={(value) =>
                        updateField(
                          'email',
                          value
                        )
                      }
                      placeholder="nom@exemple.com"
                    />

                    <Input
                      label="Adresse"
                      value={formData.address}
                      onChange={(value) =>
                        updateField(
                          'address',
                          value
                        )
                      }
                      placeholder="Cocody, Abidjan"
                    />

                  </div>
                )}


                {/* =================================================
                    ÉTAPE 4
                ================================================= */}

                {step === 4 && (
                  <div className="space-y-5">

                    <StepTitle
                      number="04"
                      title="Sécurisez votre compte"
                      description="Choisissez un mot de passe sécurisé pour protéger votre espace."
                    />

                    <div>

                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mot de passe
                      </label>

                      <div className="relative">

                        <input
                          type={
                            showPassword
                              ? 'text'
                              : 'password'
                          }
                          value={
                            formData.password
                          }
                          onChange={(event) =>
                            updateField(
                              'password',
                              event.target.value
                            )
                          }
                          autoComplete="new-password"
                          className="h-[58px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 pr-14 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/10"
                          placeholder="Votre mot de passe"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (value) =>
                                !value
                            )
                          }
                          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label={
                            showPassword
                              ? 'Masquer le mot de passe'
                              : 'Afficher le mot de passe'
                          }
                        >
                          {showPassword ? (
                            <EyeOff />
                          ) : (
                            <Eye />
                          )}
                        </button>

                      </div>

                    </div>


                    <div className="rounded-2xl border border-blue-100 bg-[#f0f5fb] px-4 py-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                          <span className="text-lg">
                            🛡️
                          </span>

                        </div>

                        <div>

                          <p className="text-xs font-bold text-slate-800">
                            Création sécurisée
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            Vos informations sont protégées
                            par des mesures de sécurité avancées.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                )}


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <div className="mt-7 flex gap-3">

                  {step > 1 && (
                    <button
                      type="button"
                      onClick={previousStep}
                      className="h-[54px] flex-1 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      PRÉCÉDENT
                    </button>
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="h-[54px] flex-1 rounded-2xl bg-[#d4a72c] text-sm font-black text-[#061b31] shadow-lg shadow-[#d4a72c]/20 transition hover:bg-[#bd9223]"
                    >
                      CONTINUER
                    </button>
                  ) : (
                    <PrimaryButton
                      type="submit"
                      fullWidth
                      size="lg"
                      className="!h-[54px] flex-1 !rounded-2xl !bg-[#d4a72c] !text-sm !font-black !text-[#061b31] !shadow-lg !shadow-[#d4a72c]/20 hover:!bg-[#bd9223]"
                    >
                      CRÉER MON COMPTE
                    </PrimaryButton>
                  )}

                </div>

              </form>


              {/* CONNEXION */}

              <div className="mt-6 border-t border-slate-100 pt-5 text-center">

                <p className="text-sm text-slate-500">
                  Vous avez déjà un compte ?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-block text-sm font-bold text-[#1455d9] hover:underline"
                >
                  Se connecter
                </Link>

              </div>

            </GlassCard>

          </div>

        </section>

      </div>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#061b31] lg:hidden">

        {/* HEADER */}

        <header className="flex h-[70px] shrink-0 items-center justify-between bg-white px-5 shadow-lg">

          <Link
            href="/login"
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md"
          >

            <img
              src="/ICONE.jpeg"
              alt="Investir en Bourse"
              className="h-full w-full object-contain"
            />

          </Link>

          <div className="text-center">

            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d4a72c]">
              ESPACE CLIENT
            </p>

            <h1 className="text-base font-black text-[#111827]">
              Créer un compte
            </h1>

          </div>

          <Link
            href="/login"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-700 shadow-sm"
            aria-label="Connexion"
          >
            →
          </Link>

        </header>


        {/* PROGRESSION */}

        <div className="shrink-0 bg-[#061b31] px-5 pt-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#d4a72c]">
                ÉTAPE {step} / 4
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {step === 1 &&
                  'Votre identité'}

                {step === 2 &&
                  'Vos coordonnées'}

                {step === 3 &&
                  'Vos informations'}

                {step === 4 &&
                  'Sécurité du compte'}
              </p>

            </div>

            <span className="text-xs font-bold text-slate-400">
              {progress}%
            </span>

          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-[#d4a72c] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        {/* CONTENU */}

        <section className="min-h-0 flex-1 overflow-hidden px-5 pt-7">

          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-200">
              {error}
            </div>
          )}


          <form
            action={register}
            className="h-full"
          >

            {/* VALEURS */}

            <input
              type="hidden"
              name="firstName"
              value={formData.firstName}
            />

            <input
              type="hidden"
              name="lastName"
              value={formData.lastName}
            />

            <input
              type="hidden"
              name="countryCode"
              value={formData.countryCode}
            />

            <input
              type="hidden"
              name="phone"
              value={formData.phone}
            />

            <input
              type="hidden"
              name="dateOfBirth"
              value={formData.dateOfBirth}
            />

            <input
              type="hidden"
              name="nationality"
              value={formData.nationality}
            />

            <input
              type="hidden"
              name="email"
              value={formData.email}
            />

            <input
              type="hidden"
              name="address"
              value={formData.address}
            />

            <input
              type="hidden"
              name="password"
              value={formData.password}
            />


            {/* =================================================
                ÉTAPE 1
            ================================================= */}

            {step === 1 && (
              <div className="space-y-5">

                <MobileStepHeader
                  number="01"
                  title="Votre identité"
                  description="Commençons par faire connaissance."
                />

                <MobileInput
                  label="Prénom"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(value) =>
                    updateField(
                      'firstName',
                      value
                    )
                  }
                />

                <MobileInput
                  label="Nom"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(value) =>
                    updateField(
                      'lastName',
                      value
                    )
                  }
                />

              </div>
            )}


            {/* =================================================
                ÉTAPE 2
            ================================================= */}

            {step === 2 && (
              <div className="space-y-5">

                <MobileStepHeader
                  number="02"
                  title="Vos coordonnées"
                  description="Indiquez votre téléphone et votre date de naissance."
                />

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Téléphone
                  </label>

                  <div className="flex gap-2">

                    <select
                      value={
                        formData.countryCode
                      }
                      onChange={(event) =>
                        updateField(
                          'countryCode',
                          event.target.value
                        )
                      }
                      className="h-[64px] w-[125px] shrink-0 rounded-[20px] border border-white/15 bg-[#153452] px-3 text-sm font-bold text-white outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                    >

                      <optgroup label="UEMOA">

                        {COUNTRIES
                          .filter(
                            (country) =>
                              country.region ===
                              'UEMOA'
                          )
                          .map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                            >
                              {country.flag}{' '}
                              {country.dialCode}
                            </option>
                          ))}

                      </optgroup>

                      <optgroup label="Afrique centrale">

                        {COUNTRIES
                          .filter(
                            (country) =>
                              country.region ===
                              'Afrique centrale'
                          )
                          .map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                            >
                              {country.flag}{' '}
                              {country.dialCode}
                            </option>
                          ))}

                      </optgroup>

                      <optgroup label="Europe">

                        {COUNTRIES
                          .filter(
                            (country) =>
                              country.region ===
                              'Europe'
                          )
                          .map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                            >
                              {country.flag}{' '}
                              {country.dialCode}
                            </option>
                          ))}

                      </optgroup>

                      <optgroup label="Amérique du Nord">

                        {COUNTRIES
                          .filter(
                            (country) =>
                              country.region ===
                              'Amérique du Nord'
                          )
                          .map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                            >
                              {country.flag}{' '}
                              {country.dialCode}
                            </option>
                          ))}

                      </optgroup>

                    </select>

                    <input
                      type="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={(event) =>
                        updateField(
                          'phone',
                          event.target.value
                        )
                      }
                      className="h-[64px] min-w-0 flex-1 rounded-[20px] border border-white/15 bg-[#153452] px-4 text-base text-white outline-none placeholder:text-slate-400 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                      placeholder="07 00 00 00"
                    />

                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    {selectedCountry.flag}{' '}
                    {selectedCountry.name}{' '}
                    — {selectedCountry.dialCode}
                  </p>

                </div>


                <MobileInput
                  label="Date de naissance"
                  type="date"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={(value) =>
                    updateField(
                      'dateOfBirth',
                      value
                    )
                  }
                />

              </div>
            )}


            {/* =================================================
                ÉTAPE 3
            ================================================= */}

            {step === 3 && (
              <div className="space-y-5">

                <MobileStepHeader
                  number="03"
                  title="Vos informations"
                  description="Quelques informations supplémentaires."
                />

                <MobileInput
                  label="Nationalité"
                  placeholder="Ivoirienne"
                  value={
                    formData.nationality
                  }
                  onChange={(value) =>
                    updateField(
                      'nationality',
                      value
                    )
                  }
                />

                <MobileInput
                  label="Adresse e-mail"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={formData.email}
                  onChange={(value) =>
                    updateField(
                      'email',
                      value
                    )
                  }
                />

                <MobileInput
                  label="Adresse"
                  placeholder="Cocody, Abidjan"
                  value={formData.address}
                  onChange={(value) =>
                    updateField(
                      'address',
                      value
                    )
                  }
                />

              </div>
            )}


            {/* =================================================
                ÉTAPE 4
            ================================================= */}

            {step === 4 && (
              <div className="space-y-5">

                <MobileStepHeader
                  number="04"
                  title="Sécurisez votre compte"
                  description="Choisissez votre mot de passe."
                />

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mot de passe
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={
                        formData.password
                      }
                      onChange={(event) =>
                        updateField(
                          'password',
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                      className="h-[64px] w-full rounded-[20px] border border-white/15 bg-[#153452] px-5 pr-14 text-base text-white outline-none placeholder:text-slate-400 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                      placeholder="Mot de passe"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) =>
                            !value
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff />
                      ) : (
                        <Eye />
                      )}
                    </button>

                  </div>

                </div>


                <div className="rounded-[22px] border border-white/10 bg-[#102b47] px-4 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4a72c]/30 bg-[#061b31]">

                      <span className="text-lg">
                        🛡️
                      </span>

                    </div>

                    <div>

                      <p className="text-xs font-black text-white">
                        Création sécurisée
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-400">
                        Vos informations sont protégées.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* =================================================
                BOUTONS
            ================================================= */}

            <div className="absolute bottom-[95px] left-5 right-5 flex gap-3">

              {step > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="h-[58px] flex-1 rounded-[20px] border border-white/15 bg-white/5 text-sm font-bold text-white"
                >
                  RETOUR
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="h-[58px] flex-1 rounded-[20px] bg-[#d4a72c] text-sm font-black text-[#061b31] shadow-xl shadow-[#d4a72c]/20"
                >
                  CONTINUER
                </button>
              ) : (
                <PrimaryButton
                  type="submit"
                  fullWidth
                  size="lg"
                  className="!h-[58px] flex-1 !rounded-[20px] !bg-[#d4a72c] !text-sm !font-black !text-[#061b31]"
                >
                  CRÉER MON COMPTE
                </PrimaryButton>
              )}

            </div>

          </form>

        </section>


        {/* NAVIGATION */}

        <nav className="flex h-[76px] shrink-0 items-center justify-around border-t border-white/10 bg-[#041526]">

          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <span className="text-xl">
              ⌂
            </span>

            <span className="text-[10px] font-semibold">
              Accueil
            </span>
          </Link>

          <Link
            href="/login"
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <span className="text-xl">
              →
            </span>

            <span className="text-[10px] font-semibold">
              Connexion
            </span>
          </Link>

          <div className="flex flex-col items-center gap-1 text-[#d4a72c]">

            <span className="text-xl">
              ♙
            </span>

            <span className="text-[10px] font-bold">
              Compte
            </span>

          </div>

        </nav>

      </div>

    </main>
  )
}


// =========================================================
// INPUT DESKTOP
// =========================================================

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required
        className="fin-input !h-[58px] !rounded-2xl !border-slate-200 !bg-slate-50 !px-5 !text-base transition focus:!border-[#d4a72c] focus:!ring-2 focus:!ring-[#d4a72c]/10"
        placeholder={placeholder}
      />

    </div>
  )
}


// =========================================================
// INPUT MOBILE
// =========================================================

function MobileInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required
        className="h-[64px] w-full rounded-[20px] border border-white/15 bg-[#153452] px-5 text-base text-white outline-none placeholder:text-slate-400 focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
        placeholder={placeholder}
      />

    </div>
  )
}


// =========================================================
// TITRE ÉTAPE DESKTOP
// =========================================================

function StepTitle({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="mb-2">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#061b31] text-xs font-black text-[#d4a72c]">
          {number}
        </div>

        <div>

          <h3 className="text-lg font-black text-[#0a1b2e]">
            {title}
          </h3>

          <p className="text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  )
}


// =========================================================
// TITRE ÉTAPE MOBILE
// =========================================================

function MobileStepHeader({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="mb-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4a72c] text-xs font-black text-[#061b31]">
          {number}
        </div>

        <div>

          <h2 className="text-xl font-black text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>

        </div>

      </div>

    </div>
  )
}


// =========================================================
// ICÔNES MOT DE PASSE
// =========================================================

function Eye() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOff() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.1 4.1" />
      <path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 3.5-.6" />
    </svg>
  )
}