import { login } from './actions'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton } from '@/components/ui/Buttons'

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams?.error

  return (
    <div className="fin-page min-h-[70dvh] flex items-center justify-center">
      <GlassCard className="w-full max-w-md" hover={false} padding="lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-gradient mx-auto flex items-center justify-center font-black text-lg shadow-glow mb-4">
            IB
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Connexion</h1>
          <p className="text-sm text-fin-mute mt-1">Accédez à votre espace investisseur</p>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-fin-surface border border-white/5 mb-6">
          <div className="py-2.5 rounded-xl bg-fin-primary text-white text-xs font-bold text-center">Connexion</div>
          <Link href="/register" className="py-2.5 rounded-xl text-fin-mute text-xs font-bold text-center hover:text-white">
            Inscription
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-fin-danger/30 bg-fin-danger/10 px-4 py-3 text-sm text-fin-danger">
            {error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-fin-mute block mb-1.5">Email</label>
            <input name="email" type="email" required className="fin-input" placeholder="vous@email.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-fin-mute block mb-1.5">Mot de passe</label>
            <input name="password" type="password" required className="fin-input" placeholder="••••••••" />
          </div>
          <PrimaryButton type="submit" fullWidth size="lg">
            Se connecter
          </PrimaryButton>
        </form>
      </GlassCard>
    </div>
  )
}
