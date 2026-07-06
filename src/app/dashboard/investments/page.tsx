import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Activity, ShieldCheck } from 'lucide-react';
import MarketSidebar from '@/components/MarketSidebar';
import ClientInvestmentCard from './ClientInvestmentCard';
import MarketplaceContent from './MarketplaceContent';

export default async function InvestmentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Récupérer toutes les offres actives du marché
  const { data: dbOffers } = await supabase.from('investment_offers').select('*').eq('is_active', true).order('title', { ascending: true });

  const offers = dbOffers || [];
  
  // Récupérer le statut du client pour sécuriser les transactions
  const { data: userData } = await supabase.from('users').select('balance, kyc_status').eq('id', user?.id).single();

  const userBalance = parseFloat(userData?.balance || 0);
  const isKycValid = userData?.kyc_status === 'validé';

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <aside className="w-full lg:w-64 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
        <MarketSidebar />
      </aside>

      <main className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-1 flex items-center gap-2">
               <Activity className="text-brand-accent" /> Placer un Ordre
             </h1>
             <p className="text-gray-500 text-sm font-medium">
               Achetez des actions et obligations directement sur le marché financier.
             </p>
           </div>
           
           <div className="flex flex-col items-end text-right">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Votre Solde Actuel</span>
             <span className="text-2xl font-black text-brand-dark">{userBalance.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span></span>
           </div>
        </div>

        {!isKycValid && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600"><ShieldCheck size={28} /></div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">Vérification de compte requise</h3>
                  <p className="text-sm text-amber-800">Conformément à la réglementation boursière, vous devez valider votre identité avant d'investir.</p>
                </div>
             </div>
             <Link href="/dashboard/kyc" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-bold transition-colors whitespace-nowrap shadow-sm text-sm">
                Valider mon KYC
             </Link>
          </div>
        )}

        <MarketplaceContent 
          initialOffers={offers} 
          userBalance={userBalance} 
          isKycValid={isKycValid} 
        />
      </main>
    </div>
  );
}
