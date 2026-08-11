import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function KycPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="fin-page fin-section max-w-3xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-fin-primary">Vérification</p>
        <h1 className="text-2xl font-bold text-slate-900 mt-3">Vérification de votre identité</h1>
        <p className="text-sm text-fin-mute mt-3 leading-relaxed">
          Votre compte a bien été créé. Cette étape de conformité vous permettra de finaliser votre inscription et d’accéder à toutes les fonctionnalités.
        </p>
      </div>
    </div>
  )
}
