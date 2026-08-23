'use client'

import { register } from './actions'
import Link from 'next/link'
import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  MapPin,
  Lock,
  CalendarDays,
} from 'lucide-react'

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
  // UEMOA
  { name: 'Bénin', code: '+229', flag: '🇧🇯' },
  { name: 'Burkina Faso', code: '+226', flag: '🇧🇫' },
  { name: "Côte d’Ivoire", code: '+225', flag: '🇨🇮' },
  { name: 'Guinée-Bissau', code: '+245', flag: '🇬🇼' },
  { name: 'Mali', code: '+223', flag: '🇲🇱' },
  { name: 'Niger', code: '+227', flag: '🇳🇪' },
  { name: 'Sénégal', code: '+221', flag: '🇸🇳' },
  { name: 'Togo', code: '+228', flag: '🇹🇬' },

  // Afrique centrale
  { name: 'Cameroun', code: '+237', flag: '🇨🇲' },
  { name: 'République centrafricaine', code: '+236', flag: '🇨🇫' },
  { name: 'Tchad', code: '+235', flag: '🇹🇩' },
  { name: 'Congo', code: '+242', flag: '🇨🇬' },
  { name: 'RDC', code: '+243', flag: '🇨🇩' },
  { name: 'Gabon', code: '+241', flag: '🇬🇦' },
  { name: 'Guinée équatoriale', code: '+240', flag: '🇬🇶' },

  // Afrique
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

  // Europe
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

  // Amérique du Nord
  { name: 'États-Unis', code: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
]

export default function Register() {
  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState('')
  const [showCountries, setShowCountries] = useState(false)

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
        setError('Vous devez confirmer avoir plus de 18 ans.')
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
    <main className="fixed inset-0 h-[100dvh] overflow-hidden bg-[#061b31] text-white">

      <form
        action={register}
        className="flex h-full min-h-0 flex-col"
      >

        {/* =====================================================
            DONNÉES ENVOYÉES À L'ACTION SERVER
        ===================================================== */}

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

        {/* =====================================================
            PARTIE BLEUE + LOGO
        ===================================================== */}

        <div className="relative shrink-0 bg-[#061b31]">

          {/* décoration exactement dans l'esprit de l'image */}

          <div className="pointer-events-none absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-[#123b69]/50" />

          <div className="relative flex h-[340px] items-center justify-center">

            <Link
              href="/"
              className="relative z-10 flex items-center justify-center"
            >
              <img
                src="/ICONE.jpeg"
                alt="Investir en Bourse"
                className="h-[105px] w-[105px] rounded-[26px] object-contain shadow-2xl"
              />
            </Link>

          </div>

        </div>

        {/* =====================================================
            CARTE BLANCHE
        ===================================================== */}

        <section className="min-h-0 flex-1 overflow-hidden rounded-t-[24px] bg-white">

          <div className="mx-auto flex h-full w-full max-w-[680px] flex-col px-[37px] pt-[36px]">

            {/* =================================================
                ÉTAPE 1
            ================================================= */}

            {step === 1 && (

              <div className="flex min-h-0 flex-1 flex-col text-[#111827]">

                {/* TYPE DE CLIENT */}

                <div className="relative shrink-0">

                  <select
                    className="h-[82px] w-full appearance-none rounded-[5px] border border-[#9b9b9b] bg-white px-5 text-[17px] font-semibold text-[#111827] outline-none"
                    defaultValue="Client"
                  >
                    <option value="Client">
                      Client
                    </option>
                  </select>

                  <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 border-l-[10px] border-r-[10px] border-t-[11px] border-l-transparent border-r-transparent border-t-[#777]" />

                </div>


                {/* PARTICULIER / ENTREPRISE */}

                <div className="mt-[28px] flex items-center justify-between px-[27px]">

                  <button
                    type="button"
                    className="flex items-center gap-4 text-[17px] font-bold"
                  >

                    <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[4px] border-[#092d61]">
                      <span className="h-[16px] w-[16px] rounded-full bg-[#092d61]" />
                    </span>

                    PARTICULIER

                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-4 text-[17px] font-bold"
                  >

                    <span className="h-[34px] w-[34px] rounded-full border-[4px] border-[#858585]" />

                    ENTREPRISE

                  </button>

                </div>


                {/* NOM */}

                <div className="relative mt-[27px] shrink-0">

                  <label className="absolute -top-[10px] left-[80px] bg-white px-[7px] text-[16px] text-[#999]">
                    Nom *
                  </label>

                  <User
                    size={23}
                    className="absolute left-[30px] top-1/2 -translate-y-1/2 text-[#999]"
                  />

                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      update(
                        'lastName',
                        event.target.value
                      )
                    }
                    className="h-[90px] w-full rounded-[5px] border-[3px] border-[#092d61] bg-white pl-[82px] pr-5 text-[18px] text-[#111827] outline-none"
                    placeholder=""
                  />

                  <span className="absolute right-[38px] top-1/2 -translate-y-1/2 text-[20px] text-[#d65d55]">
                    *
                  </span>

                </div>


                {/* PRÉNOMS */}

                <div className="relative mt-[38px] shrink-0">

                  <User
                    size={23}
                    className="absolute left-[30px] top-1/2 -translate-y-1/2 text-[#999]"
                  />

                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      update(
                        'firstName',
                        event.target.value
                      )
                    }
                    className="h-[90px] w-full rounded-[5px] border border-[#999] bg-white pl-[82px] pr-5 text-[18px] text-[#111827] outline-none focus:border-[#092d61]"
                    placeholder="Prénoms *"
                  />

                </div>


                {/* CIVILITÉ */}

                <div className="mt-[36px] flex items-center justify-between px-[27px]">

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
                      className="flex items-center gap-4 text-[17px] font-bold"
                    >

                      <span
                        className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border-[4px] ${
                          form.civility === value
                            ? 'border-[#092d61]'
                            : 'border-[#858585]'
                        }`}
                      >
                        {form.civility === value && (
                          <span className="h-[16px] w-[16px] rounded-full bg-[#092d61]" />
                        )}
                      </span>

                      {label}

                    </button>

                  ))}

                </div>


                {/* MAJEUR */}

                <button
                  type="button"
                  onClick={() =>
                    update(
                      'over18',
                      !form.over18
                    )
                  }
                  className="mt-[30px] flex h-[92px] shrink-0 items-center gap-[28px] rounded-[5px] border border-[#999] px-[20px] text-left"
                >

                  <span
                    className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[3px] border-[4px] ${
                      form.over18
                        ? 'border-[#d4a72c] bg-[#d4a72c]'
                        : 'border-[#777]'
                    }`}
                  >
                    {form.over18 && (
                      <span className="text-[20px] font-black text-white">
                        ✓
                      </span>
                    )}
                  </span>

                  <span className="text-[18px] font-bold">
                    J'ai plus de 18 ans
                  </span>

                </button>


                {error && (
                  <p className="mt-3 text-center text-[13px] font-semibold text-red-600">
                    {error}
                  </p>
                )}


                {/* BOUTON */}

                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-[28px] h-[84px] shrink-0 rounded-[5px] bg-[#dcae16] text-[18px] font-black text-white shadow-[0_7px_12px_rgba(0,0,0,0.18)]"
                >
                  Suivant
                </button>

              </div>

            )}


            {/* =================================================
                ÉTAPE 2
            ================================================= */}

            {step === 2 && (

              <div className="flex min-h-0 flex-1 flex-col text-[#111827]">

                <div className="mb-[30px]">

                  <p className="text-[12px] font-black uppercase tracking-[0.25em] text-[#d4a72c]">
                    ÉTAPE 2 / 4
                  </p>

                  <h2 className="mt-2 text-[23px] font-black">
                    Vos coordonnées
                  </h2>

                </div>


                {/* TÉLÉPHONE */}

                <label className="mb-2 text-[15px] font-bold text-[#555]">
                  Téléphone *
                </label>

                <div className="relative">

                  <div className="flex h-[72px] overflow-hidden rounded-[5px] border border-[#999]">

                    <button
                      type="button"
                      onClick={() =>
                        setShowCountries(
                          !showCountries
                        )
                      }
                      className="flex w-[130px] shrink-0 items-center gap-3 border-r border-[#aaa] px-4"
                    >

                      <span className="text-[22px]">
                        {selectedCountry.flag}
                      </span>

                      <span className="text-[16px] font-bold">
                        {selectedCountry.code}
                      </span>

                      <ChevronRight
                        size={17}
                        className={`ml-auto transition ${
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
                      className="min-w-0 flex-1 px-4 text-[17px] outline-none"
                      placeholder="Numéro de téléphone"
                    />

                  </div>


                  {showCountries && (

                    <div className="absolute left-0 right-0 top-[80px] z-50 max-h-[300px] overflow-y-auto rounded-[6px] border border-[#aaa] bg-white p-2 shadow-2xl">

                      {countries.map((country) => (

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

                            setShowCountries(false)

                          }}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left text-[14px]"
                        >

                          <span>
                            {country.flag}
                          </span>

                          <span className="flex-1">
                            {country.name}
                          </span>

                          <span className="text-[#777]">
                            {country.code}
                          </span>

                        </button>

                      ))}

                    </div>

                  )}

                </div>


                {/* DATE */}

                <label className="mb-2 mt-[30px] text-[15px] font-bold text-[#555]">
                  Date de naissance *
                </label>

                <div className="relative">

                  <CalendarDays
                    size={22}
                    className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#092d61]"
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
                    className="h-[72px] w-full rounded-[5px] border border-[#999] bg-white pl-[65px] pr-4 text-[16px] outline-none focus:border-[#092d61]"
                  />

                </div>


                {error && (
                  <p className="mt-4 text-center text-[13px] font-semibold text-red-600">
                    {error}
                  </p>
                )}


                <div className="mt-auto grid grid-cols-2 gap-3 pt-[25px]">

                  <button
                    type="button"
                    onClick={previousStep}
                    className="h-[72px] rounded-[5px] border-2 border-[#d4a72c] bg-white text-[15px] font-black text-[#9a7616]"
                  >
                    PRÉCÉDENT
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="h-[72px] rounded-[5px] bg-[#dcae16] text-[15px] font-black text-white shadow-[0_7px_12px_rgba(0,0,0,0.18)]"
                  >
                    SUIVANT
                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                ÉTAPE 3
            ================================================= */}

            {step === 3 && (

              <div className="flex min-h-0 flex-1 flex-col text-[#111827]">

                <div className="mb-[30px]">

                  <p className="text-[12px] font-black uppercase tracking-[0.25em] text-[#d4a72c]">
                    ÉTAPE 3 / 4
                  </p>

                  <h2 className="mt-2 text-[23px] font-black">
                    Informations générales
                  </h2>

                </div>


                {/* NATIONALITÉ */}

                <label className="mb-2 text-[15px] font-bold text-[#555]">
                  Nationalité *
                </label>

                <div className="relative">

                  <User
                    size={22}
                    className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#092d61]"
                  />

                  <input
                    value={form.nationality}
                    onChange={(event) =>
                      update(
                        'nationality',
                        event.target.value
                      )
                    }
                    className="h-[72px] w-full rounded-[5px] border border-[#999] pl-[65px] pr-4 text-[17px] outline-none focus:border-[#092d61]"
                    placeholder="Votre nationalité"
                  />

                </div>


                {/* EMAIL */}

                <label className="mb-2 mt-[28px] text-[15px] font-bold text-[#555]">
                  Adresse e-mail *
                </label>

                <div className="relative">

                  <Mail
                    size={22}
                    className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#092d61]"
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
                    className="h-[72px] w-full rounded-[5px] border border-[#999] pl-[65px] pr-4 text-[17px] outline-none focus:border-[#092d61]"
                    placeholder="nom@exemple.com"
                  />

                </div>


                {/* ADRESSE */}

                <label className="mb-2 mt-[28px] text-[15px] font-bold text-[#555]">
                  Adresse *
                </label>

                <div className="relative">

                  <MapPin
                    size={22}
                    className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#092d61]"
                  />

                  <input
                    value={form.address}
                    onChange={(event) =>
                      update(
                        'address',
                        event.target.value
                      )
                    }
                    className="h-[72px] w-full rounded-[5px] border border-[#999] pl-[65px] pr-4 text-[17px] outline-none focus:border-[#092d61]"
                    placeholder="Votre adresse"
                  />

                </div>


                {error && (
                  <p className="mt-4 text-center text-[13px] font-semibold text-red-600">
                    {error}
                  </p>
                )}


                <div className="mt-auto grid grid-cols-2 gap-3 pt-[25px]">

                  <button
                    type="button"
                    onClick={previousStep}
                    className="h-[72px] rounded-[5px] border-2 border-[#d4a72c] bg-white text-[15px] font-black text-[#9a7616]"
                  >
                    PRÉCÉDENT
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="h-[72px] rounded-[5px] bg-[#dcae16] text-[15px] font-black text-white shadow-[0_7px_12px_rgba(0,0,0,0.18)]"
                  >
                    SUIVANT
                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                ÉTAPE 4
            ================================================= */}

            {step === 4 && (

              <div className="flex min-h-0 flex-1 flex-col text-[#111827]">

                <div className="mb-[30px]">

                  <p className="text-[12px] font-black uppercase tracking-[0.25em] text-[#d4a72c]">
                    ÉTAPE 4 / 4
                  </p>

                  <h2 className="mt-2 text-[23px] font-black">
                    Sécurisez votre compte
                  </h2>

                </div>


                {/* MOT DE PASSE */}

                <label className="mb-2 text-[15px] font-bold text-[#555]">
                  Mot de passe *
                </label>

                <div className="relative">

                  <Lock
                    size={22}
                    className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#092d61]"
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
                    className="h-[72px] w-full rounded-[5px] border border-[#999] pl-[65px] pr-4 text-[17px] outline-none focus:border-[#092d61]"
                    placeholder="Mot de passe"
                  />

                </div>


                {/* CONFIRMATION */}

                <label className="mb-2 mt-[28px] text-[15px] font-bold text-[#555]">
                  Répéter le mot de passe *
                </label>

                <div className="relative">

                  <Lock
                    size={22}
                    className="absolute left-[24px] top-1/2 -translate-y-1/2 text-[#092d61]"
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
                    className="h-[72px] w-full rounded-[5px] border border-[#999] pl-[65px] pr-4 text-[17px] outline-none focus:border-[#092d61]"
                    placeholder="Répéter le mot de passe"
                  />

                </div>


                {/* RÈGLES */}

                <div className="mt-[25px] space-y-[8px]">

                  {[
                    [
                      form.password.length >= 8,
                      'Au moins 8 caractères',
                    ],
                    [
                      /[a-z]/.test(form.password),
                      '1 lettre minuscule',
                    ],
                    [
                      /[A-Z]/.test(form.password),
                      '1 lettre majuscule',
                    ],
                    [
                      /\d/.test(form.password),
                      '1 chiffre',
                    ],
                    [
                      /[^A-Za-z0-9]/.test(form.password),
                      '1 caractère spécial',
                    ],
                  ].map(([valid, text]) => (

                    <div
                      key={String(text)}
                      className="flex items-center gap-3"
                    >

                      <span
                        className={`h-[10px] w-[10px] rounded-full ${
                          valid
                            ? 'bg-emerald-500'
                            : 'bg-[#d0d0d0]'
                        }`}
                      />

                      <span
                        className={`text-[13px] ${
                          valid
                            ? 'text-emerald-600'
                            : 'text-[#c8c8c8]'
                        }`}
                      >
                        {text}
                      </span>

                    </div>

                  ))}

                </div>


                {error && (
                  <p className="mt-3 text-center text-[13px] font-semibold text-red-600">
                    {error}
                  </p>
                )}


                <div className="mt-auto grid grid-cols-2 gap-3 pt-[25px]">

                  <button
                    type="button"
                    onClick={previousStep}
                    className="h-[72px] rounded-[5px] border-2 border-[#d4a72c] bg-white text-[15px] font-black text-[#9a7616]"
                  >
                    PRÉCÉDENT
                  </button>

                  <button
                    type="submit"
                    onClick={(event) => {

                      if (!validateStep()) {
                        event.preventDefault()
                      }

                    }}
                    className="h-[72px] rounded-[5px] bg-[#dcae16] text-[15px] font-black text-white shadow-[0_7px_12px_rgba(0,0,0,0.18)]"
                  >
                    ENREGISTRER
                  </button>

                </div>

              </div>

            )}

          </div>

        </section>

      </form>

    </main>
  )
}