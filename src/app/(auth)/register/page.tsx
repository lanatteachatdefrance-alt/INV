'use client'

import { register } from './actions'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, User, Mail, MapPin, Lock, CalendarDays } from 'lucide-react'

type Step = 1 | 2 | 3 | 4

type FormData = {
  firstName: string
  lastName: string
  civility: string
  over18: boolean

  countryCode: string
  countryName: string
  phone: string
  dateOfBirth: string

  nationality: string
  email: string
  address: string

  password: string
  confirmPassword: string
}

const countries = [
  // =====================================================
  // UEMOA
  // =====================================================

  { name: 'Bénin', code: '+229', flag: '🇧🇯' },
  { name: 'Burkina Faso', code: '+226', flag: '🇧🇫' },
  { name: "Côte d’Ivoire", code: '+225', flag: '🇨🇮' },
  { name: 'Guinée-Bissau', code: '+245', flag: '🇬🇼' },
  { name: 'Mali', code: '+223', flag: '🇲🇱' },
  { name: 'Niger', code: '+227', flag: '🇳🇪' },
  { name: 'Sénégal', code: '+221', flag: '🇸🇳' },
  { name: 'Togo', code: '+228', flag: '🇹🇬' },

  // =====================================================
  // AFRIQUE CENTRALE
  // =====================================================

  { name: 'Cameroun', code: '+237', flag: '🇨🇲' },
  { name: 'République centrafricaine', code: '+236', flag: '🇨🇫' },
  { name: 'Tchad', code: '+235', flag: '🇹🇩' },
  { name: 'Congo', code: '+242', flag: '🇨🇬' },
  { name: 'RDC', code: '+243', flag: '🇨🇩' },
  { name: 'Gabon', code: '+241', flag: '🇬🇦' },
  { name: 'Guinée équatoriale', code: '+240', flag: '🇬🇶' },

  // =====================================================
  // AFRIQUE
  // =====================================================

  { name: 'Algérie', code: '+213', flag: '🇩🇿' },
  { name: 'Angola', code: '+244', flag: '🇦🇴' },
  { name: 'Botswana', code: '+267', flag: '🇧🇼' },
  { name: 'Burundi', code: '+257', flag: '🇧🇮' },
  { name: 'Cap-Vert', code: '+238', flag: '🇨🇻' },
  { name: 'Comores', code: '+269', flag: '🇰🇲' },
  { name: 'Djibouti', code: '+253', flag: '🇩🇯' },
  { name: 'Égypte', code: '+20', flag: '🇪🇬' },
  { name: 'Érythrée', code: '+291', flag: '🇪🇷' },
  { name: 'Eswatini', code: '+268', flag: '🇸🇿' },
  { name: 'Éthiopie', code: '+251', flag: '🇪🇹' },
  { name: 'Gambie', code: '+220', flag: '🇬🇲' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Guinée', code: '+224', flag: '🇬🇳' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Lesotho', code: '+266', flag: '🇱🇸' },
  { name: 'Libéria', code: '+231', flag: '🇱🇷' },
  { name: 'Libye', code: '+218', flag: '🇱🇾' },
  { name: 'Madagascar', code: '+261', flag: '🇲🇬' },
  { name: 'Malawi', code: '+265', flag: '🇲🇼' },
  { name: 'Maroc', code: '+212', flag: '🇲🇦' },
  { name: 'Maurice', code: '+230', flag: '🇲🇺' },
  { name: 'Mauritanie', code: '+222', flag: '🇲🇷' },
  { name: 'Mozambique', code: '+258', flag: '🇲🇿' },
  { name: 'Namibie', code: '+264', flag: '🇳🇦' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼' },
  { name: 'Sao Tomé-et-Principe', code: '+239', flag: '🇸🇹' },
  { name: 'Seychelles', code: '+248', flag: '🇸🇨' },
  { name: 'Sierra Leone', code: '+232', flag: '🇸🇱' },
  { name: 'Somalie', code: '+252', flag: '🇸🇴' },
  { name: 'Afrique du Sud', code: '+27', flag: '🇿🇦' },
  { name: 'Soudan', code: '+249', flag: '🇸🇩' },
  { name: 'Soudan du Sud', code: '+211', flag: '🇸🇸' },
  { name: 'Tanzanie', code: '+255', flag: '🇹🇿' },
  { name: 'Tunisie', code: '+216', flag: '🇹🇳' },
  { name: 'Ouganda', code: '+256', flag: '🇺🇬' },
  { name: 'Zambie', code: '+260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼' },

  // =====================================================
  // EUROPE
  // =====================================================

  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Belgique', code: '+32', flag: '🇧🇪' },
  { name: 'Suisse', code: '+41', flag: '🇨🇭' },
  { name: 'Luxembourg', code: '+352', flag: '🇱🇺' },
  { name: 'Allemagne', code: '+49', flag: '🇩🇪' },
  { name: 'Espagne', code: '+34', flag: '🇪🇸' },
  { name: 'Italie', code: '+39', flag: '🇮🇹' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Pays-Bas', code: '+31', flag: '🇳🇱' },
  { name: 'Royaume-Uni', code: '+44', flag: '🇬🇧' },
  { name: 'Irlande', code: '+353', flag: '🇮🇪' },
  { name: 'Autriche', code: '+43', flag: '🇦🇹' },
  { name: 'Suède', code: '+46', flag: '🇸🇪' },
  { name: 'Norvège', code: '+47', flag: '🇳🇴' },
  { name: 'Danemark', code: '+45', flag: '🇩🇰' },
  { name: 'Finlande', code: '+358', flag: '🇫🇮' },
  { name: 'Grèce', code: '+30', flag: '🇬🇷' },
  { name: 'Pologne', code: '+48', flag: '🇵🇱' },
  { name: 'Roumanie', code: '+40', flag: '🇷🇴' },
  { name: 'République tchèque', code: '+420', flag: '🇨🇿' },

  // =====================================================
  // AMÉRIQUE DU NORD
  // =====================================================

  { name: 'États-Unis', code: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
]

export default function Register() {
  const [step, setStep] = useState<Step>(1)

  const [error, setError] = useState('')

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    civility: '',
    over18: false,

    countryCode: '+225',
    countryName: "Côte d’Ivoire",
    phone: '',
    dateOfBirth: '',

    nationality: '',
    email: '',
    address: '',

    password: '',
    confirmPassword: '',
  })

  const [showCountries, setShowCountries] =
    useState(false)

  const update = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    setError('')
  }

  const validateStep = () => {
    if (step === 1) {
      if (!form.firstName.trim()) {
        setError('Veuillez renseigner votre prénom.')
        return false
      }

      if (!form.lastName.trim()) {
        setError('Veuillez renseigner votre nom.')
        return false
      }

      if (!form.civility) {
        setError('Veuillez sélectionner votre civilité.')
        return false
      }

      if (!form.over18) {
        setError(
          'Vous devez confirmer avoir plus de 18 ans.'
        )
        return false
      }
    }

    if (step === 2) {
      if (!form.phone.trim()) {
        setError('Veuillez renseigner votre numéro de téléphone.')
        return false
      }

      if (!form.dateOfBirth) {
        setError('Veuillez renseigner votre date de naissance.')
        return false
      }
    }

    if (step === 3) {
      if (!form.nationality.trim()) {
        setError('Veuillez renseigner votre nationalité.')
        return false
      }

      if (!form.email.trim()) {
        setError('Veuillez renseigner votre adresse e-mail.')
        return false
      }

      if (!form.address.trim()) {
        setError('Veuillez renseigner votre adresse.')
        return false
      }
    }

    if (step === 4) {
      if (!form.password) {
        setError('Veuillez créer un mot de passe.')
        return false
      }

      if (form.password.length < 8) {
        setError(
          'Le mot de passe doit contenir au moins 8 caractères.'
        )
        return false
      }

      if (form.password !== form.confirmPassword) {
        setError(
          'Les deux mots de passe ne correspondent pas.'
        )
        return false
      }
    }

    return true
  }

  const nextStep = () => {
    if (!validateStep()) return

    if (step < 4) {
      setStep((step + 1) as Step)
      setError('')
    }
  }

  const previousStep = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
      setError('')
    }
  }

  const selectedCountry =
    countries.find(
      (country) =>
        country.code === form.countryCode &&
        country.name === form.countryName
    ) || countries[0]

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#061b31] text-white">

      {/* =====================================================
          FORMULAIRE COMPLET
      ===================================================== */}

      <form
        action={register}
        className="flex h-full min-h-0 flex-col"
      >

        {/* ===================================================
            CHAMPS CACHÉS POUR L'ACTION SERVER
        =================================================== */}

        <input
          type="hidden"
          name="firstName"
          value={form.firstName}
        />

        <input
          type="hidden"
          name="lastName"
          value={form.lastName}
        />

        <input
          type="hidden"
          name="civility"
          value={form.civility}
        />

        <input
          type="hidden"
          name="over18"
          value={form.over18 ? 'true' : 'false'}
        />

        <input
          type="hidden"
          name="phone"
          value={`${form.countryCode}${form.phone}`}
        />

        <input
          type="hidden"
          name="countryCode"
          value={form.countryCode}
        />

        <input
          type="hidden"
          name="countryName"
          value={form.countryName}
        />

        <input
          type="hidden"
          name="dateOfBirth"
          value={form.dateOfBirth}
        />

        <input
          type="hidden"
          name="nationality"
          value={form.nationality}
        />

        <input
          type="hidden"
          name="email"
          value={form.email}
        />

        <input
          type="hidden"
          name="address"
          value={form.address}
        />

        <input
          type="hidden"
          name="password"
          value={form.password}
        />

        <input
          type="hidden"
          name="confirmPassword"
          value={form.confirmPassword}
        />


        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="relative z-50 flex h-[86px] shrink-0 items-center justify-between border-b border-white/10 bg-[#061b31] px-5">

          {/* RETOUR */}

          <button
            type="button"
            onClick={() => {
              if (step > 1) {
                previousStep()
              } else {
                window.history.back()
              }
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition active:scale-95"
            aria-label="Retour"
          >
            <ChevronLeft size={24} />
          </button>


          {/* LOGO */}

          <Link
            href="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center"
          >
            <img
              src="/ICONE.jpeg"
              alt="Investir en Bourse"
              className="h-[62px] w-[62px] rounded-2xl object-contain"
            />
          </Link>


          {/* ÉTAPE */}

          <div className="text-right">

            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d4a72c]">
              ÉTAPE
            </p>

            <p className="text-sm font-black">
              {step} / 4
            </p>

          </div>

        </header>


        {/* ===================================================
            CONTENU
        =================================================== */}

        <section className="min-h-0 flex-1 overflow-hidden">

          <div className="mx-auto flex h-full w-full max-w-lg flex-col px-5">

            {/* =================================================
                TITRE + PROGRESSION
            ================================================= */}

            <div className="shrink-0 pt-6">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d4a72c]">
                    ÉTAPE {step} / 4
                  </p>

                  <h1 className="mt-2 text-[25px] font-black leading-none">
                    {step === 1 &&
                      'Votre identité'}

                    {step === 2 &&
                      'Vos coordonnées'}

                    {step === 3 &&
                      'Informations générales'}

                    {step === 4 &&
                      'Sécurisez votre compte'}
                  </h1>

                </div>

                <p className="text-sm font-black text-slate-400">
                  {step * 25}%
                </p>

              </div>


              {/* PROGRESSION */}

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#193650]">

                <div
                  className="h-full rounded-full bg-[#d4a72c] transition-all duration-500"
                  style={{
                    width: `${step * 25}%`,
                  }}
                />

              </div>

            </div>


            {/* =================================================
                CARTE FORMULAIRE
            ================================================= */}

            <div className="min-h-0 flex-1 pt-6">

              <div className="h-full overflow-hidden rounded-[28px] bg-white p-5 text-slate-900 shadow-2xl">

                {/* =================================================
                    STEP 1
                ================================================= */}

                {step === 1 && (

                  <div className="flex h-full flex-col">

                    <div className="shrink-0">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#d4a72c] text-lg font-black text-[#061b31]">
                          01
                        </div>

                        <div>

                          <h2 className="text-2xl font-black">
                            Votre identité
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            Commençons par faire connaissance.
                          </p>

                        </div>

                      </div>

                    </div>


                    <div className="mt-7 min-h-0 flex-1">

                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Prénom *
                      </label>

                      <div className="relative">

                        <User
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          value={form.firstName}
                          onChange={(event) =>
                            update(
                              'firstName',
                              event.target.value
                            )
                          }
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="Entrez votre prénom"
                        />

                      </div>


                      <label className="mb-2 mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Nom *
                      </label>

                      <div className="relative">

                        <User
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          value={form.lastName}
                          onChange={(event) =>
                            update(
                              'lastName',
                              event.target.value
                            )
                          }
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="Entrez votre nom"
                        />

                      </div>


                      <p className="mb-3 mt-5 text-xs font-black uppercase tracking-wider text-slate-500">
                        Civilité *
                      </p>

                      <div className="grid grid-cols-3 gap-2">

                        {[
                          ['M.', 'M.'],
                          ['Mme', 'Mme'],
                          ['Mlle', 'Mlle'],
                        ].map(([value, label]) => (

                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              update(
                                'civility',
                                value
                              )
                            }
                            className={`flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-bold transition ${
                              form.civility === value
                                ? 'border-[#d4a72c] bg-[#fff8df] text-[#9a7616]'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >

                            <span
                              className={`h-4 w-4 rounded-full border-2 ${
                                form.civility === value
                                  ? 'border-[#d4a72c] bg-[#d4a72c] shadow-[inset_0_0_0_3px_white]'
                                  : 'border-slate-400'
                              }`}
                            />

                            {label}

                          </button>

                        ))}

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          update(
                            'over18',
                            !form.over18
                          )
                        }
                        className={`mt-5 flex h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left transition ${
                          form.over18
                            ? 'border-[#d4a72c] bg-[#fff8df]'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >

                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                            form.over18
                              ? 'border-[#d4a72c] bg-[#d4a72c] text-[#061b31]'
                              : 'border-slate-400'
                          }`}
                        >
                          {form.over18 && '✓'}
                        </span>

                        <span className="text-sm font-bold">
                          J'ai plus de 18 ans
                        </span>

                      </button>

                    </div>


                    {error && (
                      <p className="mt-3 shrink-0 text-center text-xs font-semibold text-red-600">
                        {error}
                      </p>
                    )}


                    <button
                      type="button"
                      onClick={nextStep}
                      className="mt-4 flex h-[58px] shrink-0 w-full items-center justify-center gap-2 rounded-2xl bg-[#d4a72c] text-sm font-black text-[#061b31] shadow-lg shadow-[#d4a72c]/20 transition active:scale-[0.98]"
                    >
                      CONTINUER
                      <ChevronRight size={18} />
                    </button>

                  </div>

                )}


                {/* =================================================
                    STEP 2
                ================================================= */}

                {step === 2 && (

                  <div className="flex h-full flex-col">

                    <div className="flex items-center gap-4 shrink-0">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4a72c] text-lg font-black text-[#061b31]">
                        02
                      </div>

                      <div>

                        <h2 className="text-2xl font-black">
                          Vos coordonnées
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Comment pouvons-nous vous joindre ?
                        </p>

                      </div>

                    </div>


                    <div className="mt-7 min-h-0 flex-1">

                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Téléphone *
                      </label>


                      {/* PAYS */}

                      <div className="relative">

                        <div className="flex h-[58px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                          <button
                            type="button"
                            onClick={() =>
                              setShowCountries(
                                !showCountries
                              )
                            }
                            className="flex w-[125px] shrink-0 items-center gap-2 border-r border-slate-200 px-3 text-left"
                          >

                            <span className="text-xl">
                              {selectedCountry.flag}
                            </span>

                            <span className="text-sm font-bold">
                              {selectedCountry.code}
                            </span>

                            <ChevronRight
                              size={15}
                              className={`ml-auto text-slate-400 transition ${
                                showCountries
                                  ? 'rotate-90'
                                  : ''
                              }`}
                            />

                          </button>


                          <input
                            value={form.phone}
                            onChange={(event) =>
                              update(
                                'phone',
                                event.target.value.replace(
                                  /\D/g,
                                  ''
                                )
                              )
                            }
                            inputMode="numeric"
                            className="min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold outline-none"
                            placeholder="Votre numéro"
                          />

                        </div>


                        {showCountries && (

                          <div className="absolute left-0 right-0 top-[64px] z-50 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">

                            {countries.map(
                              (country) => (

                                <button
                                  key={`${country.name}-${country.code}`}
                                  type="button"
                                  onClick={() => {

                                    update(
                                      'countryCode',
                                      country.code
                                    )

                                    update(
                                      'countryName',
                                      country.name
                                    )

                                    setShowCountries(
                                      false
                                    )

                                  }}
                                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-slate-50"
                                >

                                  <span className="text-lg">
                                    {country.flag}
                                  </span>

                                  <span className="flex-1 font-semibold">
                                    {country.name}
                                  </span>

                                  <span className="text-slate-400">
                                    {country.code}
                                  </span>

                                </button>

                              )
                            )}

                          </div>

                        )}

                      </div>


                      <label className="mb-2 mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Date de naissance *
                      </label>

                      <div className="relative">

                        <CalendarDays
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="date"
                          value={form.dateOfBirth}
                          onChange={(event) =>
                            update(
                              'dateOfBirth',
                              event.target.value
                            )
                          }
                          className="h-[58px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                        />

                      </div>

                    </div>


                    {error && (
                      <p className="mt-3 shrink-0 text-center text-xs font-semibold text-red-600">
                        {error}
                      </p>
                    )}


                    <div className="mt-4 grid shrink-0 grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={previousStep}
                        className="flex h-[56px] items-center justify-center gap-2 rounded-2xl border-2 border-[#d4a72c] bg-white text-sm font-black text-[#9a7616]"
                      >
                        <ChevronLeft size={18} />
                        PRÉCÉDENT
                      </button>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex h-[56px] items-center justify-center gap-2 rounded-2xl bg-[#d4a72c] text-sm font-black text-[#061b31] shadow-lg shadow-[#d4a72c]/20"
                      >
                        SUIVANT
                        <ChevronRight size={18} />
                      </button>

                    </div>

                  </div>

                )}


                {/* =================================================
                    STEP 3
                ================================================= */}

                {step === 3 && (

                  <div className="flex h-full flex-col">

                    <div className="flex items-center gap-4 shrink-0">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4a72c] text-lg font-black text-[#061b31]">
                        03
                      </div>

                      <div>

                        <h2 className="text-2xl font-black">
                          Informations générales
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Quelques informations complémentaires.
                        </p>

                      </div>

                    </div>


                    <div className="mt-7 min-h-0 flex-1">

                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Nationalité *
                      </label>

                      <div className="relative">

                        <User
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          value={form.nationality}
                          onChange={(event) =>
                            update(
                              'nationality',
                              event.target.value
                            )
                          }
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="Votre nationalité"
                        />

                      </div>


                      <label className="mb-2 mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Adresse e-mail *
                      </label>

                      <div className="relative">

                        <Mail
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) =>
                            update(
                              'email',
                              event.target.value
                            )
                          }
                          autoComplete="email"
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="nom@exemple.com"
                        />

                      </div>


                      <label className="mb-2 mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Adresse *
                      </label>

                      <div className="relative">

                        <MapPin
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          value={form.address}
                          onChange={(event) =>
                            update(
                              'address',
                              event.target.value
                            )
                          }
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="Votre adresse"
                        />

                      </div>

                    </div>


                    {error && (
                      <p className="mt-3 shrink-0 text-center text-xs font-semibold text-red-600">
                        {error}
                      </p>
                    )}


                    <div className="mt-4 grid shrink-0 grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={previousStep}
                        className="flex h-[56px] items-center justify-center gap-2 rounded-2xl border-2 border-[#d4a72c] bg-white text-sm font-black text-[#9a7616]"
                      >
                        <ChevronLeft size={18} />
                        PRÉCÉDENT
                      </button>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex h-[56px] items-center justify-center gap-2 rounded-2xl bg-[#d4a72c] text-sm font-black text-[#061b31] shadow-lg shadow-[#d4a72c]/20"
                      >
                        SUIVANT
                        <ChevronRight size={18} />
                      </button>

                    </div>

                  </div>

                )}


                {/* =================================================
                    STEP 4
                ================================================= */}

                {step === 4 && (

                  <div className="flex h-full flex-col">

                    <div className="flex items-center gap-4 shrink-0">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d4a72c] text-lg font-black text-[#061b31]">
                        04
                      </div>

                      <div>

                        <h2 className="text-2xl font-black">
                          Sécurisez votre compte
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          Choisissez un mot de passe sécurisé.
                        </p>

                      </div>

                    </div>


                    <div className="mt-7 min-h-0 flex-1">

                      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Mot de passe *
                      </label>

                      <div className="relative">

                        <Lock
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="password"
                          value={form.password}
                          onChange={(event) =>
                            update(
                              'password',
                              event.target.value
                            )
                          }
                          autoComplete="new-password"
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="Votre mot de passe"
                        />

                      </div>


                      <label className="mb-2 mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">
                        Répéter le mot de passe *
                      </label>

                      <div className="relative">

                        <Lock
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="password"
                          value={form.confirmPassword}
                          onChange={(event) =>
                            update(
                              'confirmPassword',
                              event.target.value
                            )
                          }
                          autoComplete="new-password"
                          className="h-[56px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none focus:border-[#d4a72c] focus:ring-2 focus:ring-[#d4a72c]/20"
                          placeholder="Confirmez votre mot de passe"
                        />

                      </div>


                      {/* RÈGLES */}

                      <div className="mt-5 space-y-2">

                        {[
                          [
                            form.password.length >= 8,
                            'Au moins 8 caractères',
                          ],
                          [
                            /[a-z]/.test(
                              form.password
                            ),
                            '1 lettre minuscule',
                          ],
                          [
                            /[A-Z]/.test(
                              form.password
                            ),
                            '1 lettre majuscule',
                          ],
                          [
                            /\d/.test(
                              form.password
                            ),
                            '1 chiffre',
                          ],
                          [
                            /[^A-Za-z0-9]/.test(
                              form.password
                            ),
                            '1 caractère spécial',
                          ],
                        ].map(
                          ([valid, text]) => (

                            <div
                              key={String(text)}
                              className="flex items-center gap-2"
                            >

                              <span
                                className={`h-3 w-3 rounded-full ${
                                  valid
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-300'
                                }`}
                              />

                              <span
                                className={`text-xs ${
                                  valid
                                    ? 'font-semibold text-emerald-600'
                                    : 'text-slate-400'
                                }`}
                              >
                                {text}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>


                    {error && (
                      <p className="mt-3 shrink-0 text-center text-xs font-semibold text-red-600">
                        {error}
                      </p>
                    )}


                    <div className="mt-4 grid shrink-0 grid-cols-2 gap-3">

                      <button
                        type="button"
                        onClick={previousStep}
                        className="flex h-[56px] items-center justify-center gap-2 rounded-2xl border-2 border-[#d4a72c] bg-white text-sm font-black text-[#9a7616]"
                      >
                        <ChevronLeft size={18} />
                        PRÉCÉDENT
                      </button>

                      <button
                        type="submit"
                        onClick={(event) => {
                          if (!validateStep()) {
                            event.preventDefault()
                          }
                        }}
                        className="flex h-[56px] items-center justify-center rounded-2xl bg-[#d4a72c] text-sm font-black text-[#061b31] shadow-lg shadow-[#d4a72c]/20"
                      >
                        ENREGISTRER
                      </button>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* =================================================
                LIEN CONNEXION
            ================================================= */}

            <div className="shrink-0 py-4 text-center">

              <p className="text-xs text-slate-400">
                Vous avez déjà un compte ?
              </p>

              <Link
                href="/login"
                className="mt-1 inline-block text-sm font-black text-[#d4a72c]"
              >
                Se connecter
              </Link>

            </div>

          </div>

        </section>

      </form>

    </main>
  )
}