'use client';

import { useState, useTransition } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { syncAllBalancesAfterPriceUpdate } from './actions';

export default function SyncBalancesButton() {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    setMessage('');
    startTransition(async () => {
      const result = await syncAllBalancesAfterPriceUpdate();
      if (result.error && !result.success) {
        setMessage(result.error);
        return;
      }
      const credited = result.totalCredited ?? 0;
      const users = result.adjustedUsers ?? 0;
      if (users === 0) {
        setMessage('Aucun ajustement nécessaire (soldes déjà à jour).');
      } else {
        setMessage(
          `${users} client(s) ajusté(s). Total crédité/débité : ${credited >= 0 ? '+' : ''}${Math.round(credited).toLocaleString('fr-FR')} FCFA`
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={isPending}
        className="bg-primary-gradient text-white px-5 py-2.5 rounded-2xl font-semibold text-xs flex items-center gap-2 disabled:opacity-60 shadow-glow"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
        Sync soldes
      </button>
      {message && <p className="text-xs text-fin-mute max-w-xs text-right">{message}</p>}
    </div>
  );
}
