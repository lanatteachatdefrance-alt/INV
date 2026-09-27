import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

async function setWithdrawalPin(formData: FormData) {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const pin = String(formData.get('pin') || '')
  const confirmPin = String(formData.get('confirmPin') || '')

  if (!/^[0-9]{6}$/.test(pin)) {
    redirect('/kyc?pinError=Le+code+doit+contenir+exactement+6+chiffres')
  }

  if (pin !== confirmPin) {
    redirect('/kyc?pinError=Les+deux+codes+ne+correspondent+pas')
  }

  const { error } = await supabase.rpc(
    'set_withdrawal_pin',
    {
      p_pin: pin,
    }
  )

  if (error) {
    console.error('Set withdrawal PIN error:', error)

    redirect(
      '/kyc?pinError=Impossible+de+configurer+le+code+de+retrait'
    )
  }

  redirect('/kyc?pinSuccess=1')
}

export default async function KycPage({
  searchParams,
}: {
  searchParams: Promise<{
    pinSuccess?: string
    pinError?: string
  }>
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const params = await searchParams

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA]">
      <div className="fin-page fin-section mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        {/* =====================================================
            EN-TÊTE
        ===================================================== */}

        <section className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A77C12]">
            Vérification du compte
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#061B31] sm:text-3xl">
            Vérification de votre identité
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Cette étape permet de confirmer votre identité et
            de renforcer la sécurité de votre compte.
          </p>
        </section>

        {/* =====================================================
            CARTE STATUT
        ===================================================== */}

        <section className="mb-5 overflow-hidden rounded-3xl border border-[#D4A72C]/20 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-[#FFFBF0] px-5 py-5 sm:px-6">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#D4A72C]/20 bg-white shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Investir en Bourse"
                  width={44}
                  height={44}
                  className="h-10 w-10 object-contain"
                  priority
                />
              </div>

              <div className="min-w-0">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A77C12]">
                  Statut du compte
                </p>

                <h2 className="mt-1 text-lg font-black text-[#061B31]">
                  Vérification à compléter
                </h2>

              </div>

            </div>

          </div>

          <div className="px-5 py-6 sm:px-6">

            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">

              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm">
                !
              </div>

              <div>

                <p className="text-sm font-bold text-amber-900">
                  Votre compte est actif
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800/80">
                  Votre compte peut continuer à être utilisé
                  normalement. La vérification d’identité
                  constitue une étape complémentaire.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CODE DE RETRAIT
        ===================================================== */}

        <section className="mb-5 overflow-hidden rounded-3xl border border-[#D4A72C]/20 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-[#FFFBF0] px-5 py-5 sm:px-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A77C12]">
              Sécurité du compte
            </p>

            <h2 className="mt-1 text-lg font-black text-[#061B31]">
              Code de retrait
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Configurez un code personnel à 6 chiffres qui sera
              demandé avant chaque demande de retrait.
            </p>

          </div>

          <form
            action={setWithdrawalPin}
            className="space-y-5 px-5 py-6 sm:px-6"
          >

            {/* MESSAGE SUCCÈS */}

            {params.pinSuccess === '1' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                <p className="text-sm font-bold text-emerald-800">
                  Code de retrait configuré
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Votre code de retrait a été enregistré avec succès.
                  Il sera demandé lors de vos prochaines demandes de
                  retrait.
                </p>

              </div>
            )}

            {/* MESSAGE ERREUR */}

            {params.pinError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

                <p className="text-sm font-bold text-red-800">
                  Impossible de configurer le code
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {params.pinError}
                </p>

              </div>
            )}

            {/* NOUVEAU CODE */}

            <div>

              <label
                htmlFor="pin"
                className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                Nouveau code
              </label>

              <input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                placeholder="••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-bold tracking-[0.5em] text-[#061B31] outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
              />

            </div>

            {/* CONFIRMATION */}

            <div>

              <label
                htmlFor="confirmPin"
                className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                Confirmer le code
              </label>

              <input
                id="confirmPin"
                name="confirmPin"
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                placeholder="••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-bold tracking-[0.5em] text-[#061B31] outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
              />

            </div>

            {/* INFORMATION */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

              <p className="text-xs leading-5 text-blue-800">
                🔐 Votre code est personnel. Il sera utilisé pour
                sécuriser vos demandes de retrait. Ne le communiquez
                à personne.
              </p>

            </div>

            {/* BOUTON */}

            <button
              type="submit"
              className="w-full rounded-xl bg-[#061B31] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0A2948]"
            >
              Configurer mon code de retrait
            </button>

          </form>

        </section>

        {/* =====================================================
            PROGRESSION
        ===================================================== */}

        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Progression
            </p>

            <h2 className="mt-1 text-lg font-black text-[#061B31]">
              Votre parcours de vérification
            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex items-start gap-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                ✓
              </div>

              <div className="pt-0.5">

                <p className="text-sm font-bold text-[#061B31]">
                  Compte créé
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Votre compte investisseur a été créé avec succès.
                </p>

              </div>

            </div>

            <div className="ml-4 h-5 w-px bg-slate-200" />

            <div className="flex items-start gap-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFFBF0] text-sm font-black text-[#A77C12] ring-1 ring-[#D4A72C]/30">
                2
              </div>

              <div className="pt-0.5">

                <p className="text-sm font-bold text-[#061B31]">
                  Vérification d’identité
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Cette étape permettra de confirmer votre identité.
                </p>

              </div>

            </div>

            <div className="ml-4 h-5 w-px bg-slate-200" />

            <div className="flex items-start gap-4">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-400">
                3
              </div>

              <div className="pt-0.5">

                <p className="text-sm font-bold text-slate-500">
                  Compte vérifié
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Validation finale de votre dossier.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            INFORMATIONS
        ===================================================== */}

        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Pourquoi cette vérification ?
            </p>

            <h2 className="mt-1 text-lg font-black text-[#061B31]">
              Sécuriser votre compte
            </h2>

          </div>

          <div className="grid gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ✓
              </div>

              <h3 className="text-sm font-bold text-[#061B31]">
                Identité
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Confirmer que les informations du compte
                correspondent à votre identité.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                ✓
              </div>

              <h3 className="text-sm font-bold text-[#061B31]">
                Sécurité
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Renforcer la protection de votre compte
                investisseur.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFFBF0] text-[#A77C12]">
                ✓
              </div>

              <h3 className="text-sm font-bold text-[#061B31]">
                Conformité
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Préparer votre dossier aux exigences
                de conformité.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            INFORMATIONS DU COMPTE
        ===================================================== */}

        <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Compte
            </p>

            <h2 className="mt-1 text-lg font-black text-[#061B31]">
              Informations utilisées
            </h2>

          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Adresse email
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-[#061B31]">
                {user.email || 'Non renseignée'}
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Identifiant du compte
              </p>

              <p className="mt-2 text-xs font-medium text-slate-500">
                Compte investisseur actif
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            BLOC D'INFORMATION
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl bg-[#061B31] p-5 text-white shadow-[0_12px_35px_rgba(6,27,49,0.10)] sm:p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">

              <Image
                src="/logo.png"
                alt="Investir en Bourse"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />

            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A72C]">
                Important
              </p>

              <h2 className="mt-1 text-base font-bold">
                Aucune modification de votre compte
              </h2>

              <p className="mt-2 text-xs leading-5 text-white/60 sm:text-sm sm:leading-6">
                La mise en place de cette étape de vérification
                n’affecte pas votre solde, vos investissements,
                votre portefeuille, vos ordres ou vos dividendes.
                Vos données existantes restent inchangées.
              </p>

            </div>

          </div>

        </section>

      </div>
    </div>
  )
}