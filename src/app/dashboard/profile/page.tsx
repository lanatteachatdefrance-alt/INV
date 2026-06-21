import Link from 'next/link'
import AccountDetails from '@/components/AccountDetails'
import MarketSidebar from '@/components/MarketSidebar'
import { User, Activity, History, ShieldCheck } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <aside className="w-full md:w-64 flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-brand-dark text-white font-bold px-5 py-4 text-sm uppercase tracking-widest">Menu client</div>
          <div className="flex flex-col text-sm">
            <Link href="/dashboard" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
              <Activity size={18} /> Vue d'ensemble
            </Link>
            <Link href="/dashboard/profile" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 text-brand-dark bg-brand-dark/5 font-bold hover:bg-gray-50 transition-colors">
              <User size={18} /> Mon profil
            </Link>
            <Link href="/dashboard/investments" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
              <History size={18} /> Opportunités
            </Link>
            <Link href="/dashboard/active-investments" className="px-5 py-3 border-b border-gray-50 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
              <ShieldCheck size={18} /> Mes transactions
            </Link>
            <Link href="/dashboard/kyc" className="px-5 py-3 flex items-center gap-3 text-gray-600 hover:text-brand hover:bg-gray-50 transition-colors font-medium">
              <ShieldCheck size={18} /> Conformité KYC
            </Link>
          </div>
        </div>

        <MarketSidebar />
      </aside>

      <main className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="text-xs uppercase tracking-[0.25em] font-black text-gray-400">Espace profil</div>
            <h1 className="text-3xl font-black text-brand-dark">Mon profil</h1>
            <p className="text-sm text-gray-500">Consultez et mettez à jour vos informations de compte : nom, email, téléphone et localisation.</p>
          </div>
        </div>

        <AccountDetails />
      </main>
    </div>
  )
}
