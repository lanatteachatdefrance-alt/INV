import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Activity, ShieldCheck } from 'lucide-react';
import MarketSidebar from '@/components/MarketSidebar';
import MarketplaceContent from './MarketplaceContent';

const fallbackOffers = [
  { id: 'fallback-abjc', title: 'ABJC - Air Liquide CI', description: 'Air Liquide Côte d’Ivoire. Secteur chimie/gaz industriel.', type: 'Action', roi_percentage: 5.2, price_per_share: 3150, minimum_investment: 3150, is_active: true },
  { id: 'fallback-bicb', title: 'BICB - BIIC Bénin', description: 'Banque Ivoirienne d’Investissement et de Crédit Bénin.', type: 'Action', roi_percentage: 6.8, price_per_share: 6350, minimum_investment: 6350, is_active: true },
  { id: 'fallback-bicc', title: 'BICC - BICI Côte d’Ivoire', description: 'Banque Ivoirienne de Crédit et d’Investissement.', type: 'Action', roi_percentage: 8.1, price_per_share: 28800, minimum_investment: 28800, is_active: true },
  { id: 'fallback-bnbc', title: 'BNBC - Bernabé Côte d’Ivoire', description: 'Bernabé Côte d’Ivoire. Secteur de la distribution.', type: 'Action', roi_percentage: 4.5, price_per_share: 1755, minimum_investment: 1755, is_active: true },
  { id: 'fallback-boab', title: 'BOAB - Bank of Africa Bénin', description: 'Groupe Bank of Africa - Filiale Bénin.', type: 'Action', roi_percentage: 8.4, price_per_share: 8750, minimum_investment: 8750, is_active: true },
  { id: 'fallback-boabf', title: 'BOABF - Bank of Africa Burkina Faso', description: 'Groupe Bank of Africa - Filiale Burkina Faso.', type: 'Action', roi_percentage: 9.2, price_per_share: 6050, minimum_investment: 6050, is_active: true },
  { id: 'fallback-boac', title: 'BOAC - Bank of Africa Côte d’Ivoire', description: 'Groupe Bank of Africa - Filiale Côte d’Ivoire.', type: 'Action', roi_percentage: 7.8, price_per_share: 9500, minimum_investment: 9500, is_active: true },
  { id: 'fallback-boam', title: 'BOAM - Bank of Africa Mali', description: 'Groupe Bank of Africa - Filiale Mali.', type: 'Action', roi_percentage: 8.8, price_per_share: 5450, minimum_investment: 5450, is_active: true },
  { id: 'fallback-boan', title: 'BOAN - Bank of Africa Niger', description: 'Groupe Bank of Africa - Filiale Niger.', type: 'Action', roi_percentage: 9.5, price_per_share: 4790, minimum_investment: 4790, is_active: true },
  { id: 'fallback-boas', title: 'BOAS - Bank of Africa Sénégal', description: 'Groupe Bank of Africa - Filiale Sénégal.', type: 'Action', roi_percentage: 7.9, price_per_share: 7300, minimum_investment: 7300, is_active: true },
  { id: 'fallback-cabc', title: 'CABC - Sicable Côte d’Ivoire', description: 'Sicable Côte d’Ivoire. Secteur industriel / Câbles.', type: 'Action', roi_percentage: 4.8, price_per_share: 7000, minimum_investment: 7000, is_active: true },
  { id: 'fallback-cbibf', title: 'CBIBF - Coris Bank Burkina Faso', description: 'Coris Bank International Burkina Faso. Banque de croissance.', type: 'Action', roi_percentage: 9.0, price_per_share: 29610, minimum_investment: 29610, is_active: true },
  { id: 'fallback-cfac', title: 'CFAC - CFAO Motors Côte d’Ivoire', description: 'CFAO Motors Côte d’Ivoire. Distribution automobile.', type: 'Action', roi_percentage: 5.6, price_per_share: 1575, minimum_investment: 1575, is_active: true },
  { id: 'fallback-ciec', title: 'CIEC - CIE Côte d’Ivoire', description: 'Compagnie Ivoirienne d’Électricité. Monopole eau/électricité.', type: 'Action', roi_percentage: 8.8, price_per_share: 3980, minimum_investment: 3980, is_active: true },
  { id: 'fallback-ecoc', title: 'ECOC - Ecobank Côte d’Ivoire', description: 'Ecobank Côte d’Ivoire. Secteur bancaire.', type: 'Action', roi_percentage: 7.9, price_per_share: 7000, minimum_investment: 7000, is_active: true },
  { id: 'fallback-etit', title: 'ETIT - Ecobank Transnational Inc.', description: 'Ecobank Transnational Inc. Holding bancaire panafricain.', type: 'Action', roi_percentage: 5.5, price_per_share: 64, minimum_investment: 3000, is_active: true },
  { id: 'fallback-ftsc', title: 'FTSC - Filtisac', description: 'Filtisac. Leader de l’emballage en Afrique de l’Ouest.', type: 'Action', roi_percentage: 6.1, price_per_share: 3200, minimum_investment: 3200, is_active: true },
  { id: 'fallback-lnbb', title: 'LNBB - Loterie Nationale du Bénin', description: 'Loterie Nationale du Bénin.', type: 'Action', roi_percentage: 7.2, price_per_share: 4350, minimum_investment: 4350, is_active: true },
  { id: 'fallback-neic', title: 'NEIC - Nestlé Côte d’Ivoire', description: 'Nestlé Côte d’Ivoire. Secteur agroalimentaire.', type: 'Action', roi_percentage: 5.4, price_per_share: 2000, minimum_investment: 2000, is_active: true },
  { id: 'fallback-nsbc', title: 'NSBC - NSIA Banque Côte d’Ivoire', description: 'NSIA Banque Côte d’Ivoire. Secteur bancaire.', type: 'Action', roi_percentage: 8.1, price_per_share: 8500, minimum_investment: 8500, is_active: true },
  { id: 'fallback-ntlc', title: 'NTLC - Nestlé Mali', description: 'Nestlé Mali. Secteur agroalimentaire - Mali.', type: 'Action', roi_percentage: 5.8, price_per_share: 8500, minimum_investment: 8500, is_active: true },
  { id: 'fallback-ontbf', title: 'ONTBF - ONATEL Burkina Faso', description: 'ONATEL Burkina Faso. Secteur télécom.', type: 'Action', roi_percentage: 11.5, price_per_share: 2450, minimum_investment: 2450, is_active: true },
  { id: 'fallback-orac', title: 'ORAC - Orange Côte d’Ivoire', description: 'Orange Côte d’Ivoire. Secteur télécoms.', type: 'Action', roi_percentage: 7.2, price_per_share: 11500, minimum_investment: 11500, is_active: true },
  { id: 'fallback-orgt', title: 'ORGT - Oragroup', description: 'Oragroup. Groupe de télécommunications panafricain.', type: 'Action', roi_percentage: 6.5, price_per_share: 9000, minimum_investment: 9000, is_active: true },
  { id: 'fallback-palc', title: 'PALC - Palm Côte d’Ivoire', description: 'Palm Côte d’Ivoire. Agro-industrie huile de palme.', type: 'Action', roi_percentage: 12.0, price_per_share: 10000, minimum_investment: 10000, is_active: true },
  { id: 'fallback-prsc', title: 'PRSC - Tractafric Motors CI', description: 'Tractafric Motors Côte d’Ivoire. Distribution véhicules.', type: 'Action', roi_percentage: 5.6, price_per_share: 2350, minimum_investment: 2350, is_active: true },
  { id: 'fallback-safc', title: 'SAFC - SAFCA', description: 'SAFCA. Secteur agricole.', type: 'Action', roi_percentage: 6.3, price_per_share: 4200, minimum_investment: 4200, is_active: true },
  { id: 'fallback-scrc', title: 'SCRC - SUCRIVOIRE', description: 'SUCRIVOIRE. Production et commercialisation du sucre.', type: 'Action', roi_percentage: 3.5, price_per_share: 15000, minimum_investment: 15000, is_active: true },
  { id: 'fallback-sdcc', title: 'SDCC - SODECI', description: 'SODECI. Distribution d’eau en Côte d’Ivoire.', type: 'Action', roi_percentage: 7.7, price_per_share: 8400, minimum_investment: 8400, is_active: true },
  { id: 'fallback-sdsc', title: 'SDSC - Africa Global Logistics CI', description: 'Africa Global Logistics Côte d’Ivoire. Logistique.', type: 'Action', roi_percentage: 6.2, price_per_share: 2210, minimum_investment: 2210, is_active: true },
  { id: 'fallback-semc', title: 'SEMC - Crown Siem CI', description: 'Crown Siem Côte d’Ivoire. Secteur industriel.', type: 'Action', roi_percentage: 4.9, price_per_share: 1500, minimum_investment: 1500, is_active: true },
  { id: 'fallback-sgbc', title: 'SGBC - Société Générale Côte d’Ivoire', description: 'Société Générale Côte d’Ivoire. Secteur bancaire majeur.', type: 'Action', roi_percentage: 9.1, price_per_share: 16500, minimum_investment: 16500, is_active: true },
  { id: 'fallback-shec', title: 'SHEC - Vivo Energy Côte d’Ivoire', description: 'Vivo Energy Côte d’Ivoire. Distribution pétrolière.', type: 'Action', roi_percentage: 6.4, price_per_share: 1210, minimum_investment: 1210, is_active: true },
  { id: 'fallback-sibc', title: 'SIBC - Société Ivoirienne de Banque', description: 'Société Ivoirienne de Banque. Banque historique.', type: 'Action', roi_percentage: 7.5, price_per_share: 9900, minimum_investment: 9900, is_active: true },
  { id: 'fallback-sicc', title: 'SICC - SICOR', description: 'SICOR. Secteur industriel.', type: 'Action', roi_percentage: 4.8, price_per_share: 7000, minimum_investment: 7000, is_active: true },
  { id: 'fallback-sivc', title: 'SIVC - Erium Côte d’Ivoire', description: 'Erium Côte d’Ivoire. Secteur énergies.', type: 'Action', roi_percentage: 5.7, price_per_share: 315000, minimum_investment: 315000, is_active: true },
  { id: 'fallback-slbc', title: 'SLBC - Solibra', description: 'Solibra. Leader de la brasserie en Côte d’Ivoire.', type: 'Action', roi_percentage: 4.5, price_per_share: 40000, minimum_investment: 40000, is_active: true },
  { id: 'fallback-smbc', title: 'SMBC - SMB Côte d’Ivoire', description: 'SMB Côte d’Ivoire. Action industrielle.', type: 'Action', roi_percentage: 7.4, price_per_share: 7000, minimum_investment: 7000, is_active: true },
  { id: 'fallback-snts', title: 'SNTS - Sonatel', description: 'Sonatel Sénégal. Plus grande capitalisation du marché BRVM.', type: 'Action', roi_percentage: 8.5, price_per_share: 16000, minimum_investment: 16000, is_active: true },
  { id: 'fallback-sogc', title: 'SOGC - SOGB', description: 'SOGB. Agro-industrie (Caoutchouc et Palme).', type: 'Action', roi_percentage: 8.2, price_per_share: 7000, minimum_investment: 7000, is_active: true },
  { id: 'fallback-sphc', title: 'SPHC - SAPH', description: 'SAPH. Agriculture (Caoutchouc) leader du marché.', type: 'Action', roi_percentage: 6.8, price_per_share: 7550, minimum_investment: 7550, is_active: true },
  { id: 'fallback-stac', title: 'STAC - Setao', description: 'Setao. Secteur agro-industriel.', type: 'Action', roi_percentage: 5.9, price_per_share: 4000, minimum_investment: 4000, is_active: true },
  { id: 'fallback-stbc', title: 'STBC - Servair Abidjan', description: 'Servair Abidjan. Services aériens et restauration.', type: 'Action', roi_percentage: 9.8, price_per_share: 3100, minimum_investment: 3100, is_active: true },
  { id: 'fallback-ttlc', title: 'TTLC - TotalEnergies CI', description: 'TotalEnergies Côte d’Ivoire. Distribution pétrolière.', type: 'Action', roi_percentage: 6.2, price_per_share: 2800, minimum_investment: 2800, is_active: true },
  { id: 'fallback-ttls', title: 'TTLS - TotalEnergies Sénégal', description: 'TotalEnergies Sénégal. Distribution pétrolière.', type: 'Action', roi_percentage: 6.8, price_per_share: 1550, minimum_investment: 1550, is_active: true },
  { id: 'fallback-unlc', title: 'UNLC - Unilever Côte d’Ivoire', description: 'Unilever Côte d’Ivoire. Distribution et biens de grande consommation.', type: 'Action', roi_percentage: 5.1, price_per_share: 50500, minimum_investment: 50500, is_active: true },
  { id: 'fallback-unxc', title: 'UNXC - Uniwax Côte d’Ivoire', description: 'Uniwax Côte d’Ivoire. Secteur textile.', type: 'Action', roi_percentage: 5.3, price_per_share: 1340, minimum_investment: 1340, is_active: true }
];

export default async function InvestmentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Récupérer toutes les offres actives du marché
  const { data: dbOffers } = await supabase.from('investment_offers').select('*').eq('is_active', true).order('title', { ascending: true });

  const offers = (dbOffers && dbOffers.length > 0 ? dbOffers : fallbackOffers) as any[];
  
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
