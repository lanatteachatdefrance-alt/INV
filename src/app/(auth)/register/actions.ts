'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const supabase = createClient()

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const firstName = String(formData.get('firstName') ?? '').trim()
  const lastName = String(formData.get('lastName') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const dateOfBirth = String(formData.get('dateOfBirth') ?? '').trim()
  const nationality = String(formData.get('nationality') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()

  // Vérification des champs
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !phone ||
    !dateOfBirth ||
    !nationality ||
    !address
  ) {
    redirect(
      '/register?error=' +
        encodeURIComponent('Tous les champs sont requis.')
    )
  }

  // Création du compte Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
        date_of_birth: dateOfBirth,
        nationality,
        address,
      },
    },
  })

  // Erreur Supabase
  if (error) {
    redirect(
      '/register?error=' +
        encodeURIComponent(error.message)
    )
  }

  // Aucun utilisateur créé
  if (!data.user) {
    redirect(
      '/register?error=' +
        encodeURIComponent(
          'Impossible de créer le compte pour le moment.'
        )
    )
  }

  // Si Supabase ouvre directement une session
  if (data.session) {
    redirect('/dashboard/kyc')
  }

  // Si la confirmation e-mail est activée
  redirect(
    '/login?success=' +
      encodeURIComponent(
        'Compte créé avec succès. Vérifiez votre boîte mail pour confirmer votre inscription.'
      )
  )
}