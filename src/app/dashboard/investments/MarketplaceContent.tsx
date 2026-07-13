'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Layers, Activity } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ClientInvestmentCard from './ClientInvestmentCard';

const fallbackOffers = [
  {
    id: 'fallback-abjc',
    title: 'ABJC - Air Liquide CI',
    description: 'Air Liquide Côte d’Ivoire. Secteur chimie et gaz industriel.',
    type: 'Action',
    roi_percentage: 5.2,
    price_per_share: 3150,
    minimum_investment: 3150,
    is_active: true
  },
  {
    id: 'fallback-boac',
    title: 'BOAC - Bank of Africa Côte d’Ivoire',
    description: 'Groupe Bank of Africa - filiale Côte d’Ivoire.',
    type: 'Action',
    roi_percentage: 7.8,
    price_per_share: 9500,
    minimum_investment: 9500,
    is_active: true
  },
  {
    id: 'fallback-orac',
    title: 'ORAC - Orange Côte d’Ivoire',
    description: 'Orange Côte d’Ivoire. Secteur télécoms.',
    type: 'Action',
    roi_percentage: 7.2,
    price_per_share: 11500,
    minimum_investment: 11500,
    is_active: true
  },
  {
    id: 'fallback-sgbc',
    title: 'SGBC - Société Générale Côte d’Ivoire',
    description: 'Secteur bancaire majeur avec forte liquidité.',
    type: 'Action',
    roi_percentage: 9.1,
    price_per_share: 16500,
    minimum_investment: 16500,
    is_active: true
  },
  {
    id: 'fallback-snts',
    title: 'SNTS - Sonatel',
    description: 'Sonatel Sénégal. Grande capitalisation du marché BRVM.',
    type: 'Action',
    roi_percentage: 8.5,
    price_per_share: 16000,
    minimum_investment: 16000,
    is_active: true
  },
  {
    id: 'fallback-palc',
    title: 'PALC - Palm Côte d’Ivoire',
    description: 'Agro-industrie huile de palme avec fort potentiel.',
    type: 'Action',
    roi_percentage: 12,
    price_per_share: 10000,
    minimum_investment: 10000,
    is_active: true
  }
];

export default function MarketplaceContent({ 
  initialOffers, 
  userBalance, 
  isKycValid 
}: { 
  initialOffers: any[], 
  userBalance: number, 
  isKycValid: boolean 
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [offers, setOffers] = useState(initialOffers);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(initialOffers.length === 0);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (initialOffers && initialOffers.length > 0) {
      setOffers(initialOffers);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const loadOffers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('investment_offers')
          .select('*')
          .eq('is_active', true)
          .order('title', { ascending: true })
          .limit(50);

        if (!error && data && data.length > 0 && isMounted) {
          setOffers(data as any[]);
        } else if (isMounted) {
          setOffers(fallbackOffers as any[]);
        }
      } catch {
        if (isMounted) {
          setOffers(fallbackOffers as any[]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOffers();

    return () => {
      isMounted = false;
    };
  }, [initialOffers, supabase]);

  // Fonction pour mettre à jour un prix localement (sans DB)
  const updateOfferPrice = (offerId: string, newPrice: number) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId 
          ? { ...offer, price_per_share: newPrice }
          : offer
      )
    );
  };

  // Fonction pour mettre à jour plusieurs prix
  const updateOffersPrices = useCallback((priceUpdates: { [key: string]: number }) => {
    setOffers((prev) =>
      prev.map((offer) =>
        priceUpdates[offer.id] 
          ? { ...offer, price_per_share: priceUpdates[offer.id] }
          : offer
      )
    );
  }, []);

  useEffect(() => {
    // S'abonner aux changements de prix en temps réel
    const channel = supabase
      .channel('price_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'investment_offers' },
        (payload) => {
          setIsConnected(true);
          // Quand une offre est modifiée, mettre à jour la liste locale
          if (payload.eventType === 'UPDATE') {
            setOffers((prev) =>
              prev.map((offer) =>
                offer.id === payload.new.id ? payload.new : offer
              )
            );
          } else if (payload.eventType === 'INSERT') {
            // Nouvelle offre insérée
            setOffers((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'DELETE') {
            // Offre supprimée
            setOffers((prev) => prev.filter((offer) => offer.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Exposer les fonctions globalement pour accès console (développement)
    if (typeof window !== 'undefined') {
      (window as any).updateOfferPrice = updateOfferPrice;
      (window as any).updateOffersPrices = updateOffersPrices;
      (window as any).getOffers = () => offers;
    }

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, offers]);

  // Mettre à jour les prix automatiquement toutes les 30 secondes
  useEffect(() => {
    if (isConnected) return; // Ne pas mettre à jour si DB est connectée
    
    const interval = setInterval(() => {
      const updates: { [key: string]: number } = {};
      offers.forEach((offer) => {
        const increase = (Math.random() * 800 - 300); // -300 à +500 FCFA
        updates[offer.id] = Math.max(100, offer.price_per_share + increase);
      });
      updateOffersPrices(updates);
    }, 30000);

    return () => clearInterval(interval);
  }, [offers, isConnected, updateOffersPrices]);

  const filteredOffers = offers.filter((offer) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = (offer.title || '').toLowerCase().includes(searchTerm) ||
      (offer.description || '').toLowerCase().includes(searchTerm);
    const matchesType = filterType === 'Tous' || offer.type === filterType;
    return matchesSearch && matchesType;
  });



  return (
    <div className="flex flex-col gap-6">
      {/* Status Connection */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <span className={isConnected ? 'text-green-600' : 'text-gray-500'}>
          {isConnected ? 'Connecté en temps réel' : 'Mode local (sans DB)'}
        </span>
      </div>
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une action, une obligation..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
          {['Tous', 'Action', 'Obligation'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                filterType === type 
                ? 'bg-white dark:bg-zinc-700 text-brand-dark dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {type === 'Tous' ? 'Tout voir' : type + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
          Chargement des opportunités…
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffers.length > 0 ? (
          filteredOffers.map(offer => (
            <ClientInvestmentCard 
              key={offer.id} 
              offer={offer} 
              userBalance={userBalance} 
              isKycValid={isKycValid} 
            />
          ))
        ) : (
          <div className="col-span-full p-20 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
            <Layers size={48} className="text-gray-200 mb-4" />
            <h3 className="text-gray-800 dark:text-white font-bold text-lg">Aucun résultat trouvé</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Essayez de modifier votre recherche ou vos filtres pour trouver des opportunités.
            </p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
