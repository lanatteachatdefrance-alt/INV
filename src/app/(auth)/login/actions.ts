'use server'

import { ensureAdminAccess } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Email+et+mot+de+passe+requis')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Determine user role and route them
  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const isAdmin = await ensureAdminAccess(supabase, user)
    if (isAdmin) {
      redirect('/admin')
    }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
