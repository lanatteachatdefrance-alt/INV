'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const supabase = createClient()

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  const password = String(formData.get('password') ?? '')

  const firstName = String(
    formData.get('firstName') ?? ''
  ).trim()

  const lastName = String(
    formData.get('lastName') ?? ''
  ).trim()

  const civility = String(
    formData.get('civility') ?? ''
  ).trim()

  const over18 =
    String(formData.get('over18') ?? '') === 'true'

  const phone = String(
    formData.get('phone') ?? ''
  ).trim()

  const countryCode = String(
    formData.get('countryCode') ?? ''
  ).trim()

  const countryName = String(
    formData.get('countryName') ?? ''
  ).trim()

  const dateOfBirth = String(
    formData.get('dateOfBirth') ?? ''
  ).trim()

  const nationality = String(
    formData.get('nationality') ?? ''
  ).trim()

  const address = String(
    formData.get('address') ?? ''
  ).trim()

  const confirmPassword = String(
    formData.get('confirmPassword') ?? ''
  )

  // =========================================================
  // VÉRIFICATION DES CHAMPS
  // =========================================================

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !civility ||
    !phone ||
    !dateOfBirth ||
    !nationality ||
    !address
  ) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Tous les champs sont requis.'
        )
    )
  }

  // =========================================================
  // MAJEUR
  // =========================================================

  if (!over18) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Vous devez confirmer avoir plus de 18 ans.'
        )
    )
  }

  // =========================================================
  // EMAIL
  // =========================================================

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (!emailIsValid) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Veuillez renseigner une adresse e-mail valide.'
        )
    )
  }

  // =========================================================
  // MOT DE PASSE
  // =========================================================

  if (password.length < 8) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Le mot de passe doit contenir au moins 8 caractères.'
        )
    )
  }

  if (!/[a-z]/.test(password)) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Le mot de passe doit contenir au moins une lettre minuscule.'
        )
    )
  }

  if (!/[A-Z]/.test(password)) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Le mot de passe doit contenir au moins une lettre majuscule.'
        )
    )
  }

  if (!/\d/.test(password)) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Le mot de passe doit contenir au moins un chiffre.'
        )
    )
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Le mot de passe doit contenir au moins un caractère spécial.'
        )
    )
  }

  if (password !== confirmPassword) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Les deux mots de passe ne correspondent pas.'
        )
    )
  }

  // =========================================================
  // CRÉATION DU COMPTE SUPABASE
  // =========================================================

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          civility,
          over18,

          phone,
          country_code: countryCode,
          country_name: countryName,

          date_of_birth: dateOfBirth,

          nationality,
          address,

          kyc_status: 'pending',
          account_status: 'pending',
        },
      },
    })

  // =========================================================
  // ERREUR SUPABASE
  // =========================================================

  if (error) {
    let message = error.message

    const lowerMessage =
      error.message.toLowerCase()

    if (
      lowerMessage.includes(
        'user already registered'
      ) ||
      lowerMessage.includes(
        'already registered'
      )
    ) {
      message =
        'Cette adresse e-mail est déjà utilisée. Connectez-vous ou utilisez une autre adresse e-mail.'
    }

    redirect(
      '/register?error=' +
        encodeURIComponent(message)
    )
  }

  // =========================================================
  // UTILISATEUR NON CRÉÉ
  // =========================================================

  if (!data.user) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Impossible de créer le compte pour le moment.'
        )
    )
  }

  // =========================================================
  // SESSION DISPONIBLE
  //
  // Le compte vient d'être créé et Supabase a
  // automatiquement connecté l'utilisateur.
  //
  // PROCHAINE ÉTAPE = KYC
  // =========================================================

  if (data.session) {
    redirect('/dashboard/kyc')
  }

  // =========================================================
  // CONFIRMATION EMAIL ACTIVÉE
  //
  // Dans ce cas, Supabase a créé le compte mais
  // ne fournit pas encore de session.
  //
  // L'utilisateur doit confirmer son email avant
  // de pouvoir poursuivre vers le KYC.
  // =========================================================

  redirect(
    '/login?success=' +
      encodeURIComponent(
        'Votre compte a été créé. Vérifiez votre adresse e-mail pour confirmer votre inscription, puis connectez-vous pour accéder au KYC.'
      )
  )
}