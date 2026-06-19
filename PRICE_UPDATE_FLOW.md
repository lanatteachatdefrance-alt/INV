# Réglage Automatique du Portefeuille après Changement de Prix

## Architecture

1. **Trigger DB (`trigger_notify_price_changes.sql`)**
   - S'active lors d'un `UPDATE` de `price_per_share` sur `investment_offers`
   - Envoie une notification PostgreSQL `price_update` avec les détails (offer_id, ancien/nouveau prix, timestamp)

2. **Server Action (`src/app/admin/actions.ts`)**
   - `syncAllBalancesAfterPriceUpdate()` : fonction existante qui appelle `syncPortfolioBalances()`
   - Recalcule `current_value` pour tous les `user_investments` actifs
   - Met à jour les soldes utilisateur et crée des enregistrements de transaction

3. **UI Admin (`src/app/admin/SyncBalancesButton.tsx`)**
   - Bouton pour déclencher manuellement le sync depuis l'interface admin

## Flux de Synchronisation

```
1. Admin met à jour price_per_share via /admin/offers
   ↓
2. Trigger NOTIFY envoie notification 'price_update' (PostgreSQL)
   ↓
3. Admin clique "Sync Balances" ou webhook déclenche l'action
   ↓
4. syncAllBalancesAfterPriceUpdate() exécute syncPortfolioBalances()
   ↓
5. Pour chaque user_investments actif :
   - Recalcule current_value = shares_bought × price_per_share
   - Calcule l'ajustement = nouvelle_valeur - ancienne_valeur
   - Met à jour user.balance avec l'ajustement
   - Crée une transaction 'distribution_dividende' avec les détails
   ↓
6. Les dashboards des clients voient les soldes/portefeuilles mis à jour
```

## Setup

### 1. Exécuter le trigger SQL
```sql
-- Dans Supabase SQL Editor, copier-coller le contenu de :
-- migrations/trigger_notify_price_changes.sql
```

### 2. (Optionnel) Ajouter un Cron / Webhook
Si tu veux automatiser sans action manuelle :
- Via Supabase Edge Functions ou externe (zapier, make.com, etc.)
- Envoyer un POST à `/api/admin/sync-balances` toutes les N heures

### 3. Alternative : Écoute Realtime côté Client
Les clients peuvent s'abonner au canal `price_update` et rafraîchir leur dashboard :
```typescript
supabase
  .channel('price_changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'investment_offers' }, () => {
    // Refresh dashboard
  })
  .subscribe()
```

## Test Local

1. Mettre à jour un prix d'offre :
```sql
UPDATE public.investment_offers
SET price_per_share = 30000
WHERE title ILIKE '%SNTS%';
```

2. Vérifier la notification (Supabase Logs) :
```
postgres_changes: price_update channel received
```

3. Appeler l'action admin (depuis Next.js ou API) :
```typescript
const result = await syncAllBalancesAfterPriceUpdate();
console.log(result); // { success: true, adjustedUsers: X, totalCredited: Y }
```

4. Vérifier les balances utilisateur et les transactions :
```sql
SELECT * FROM public.users ORDER BY updated_at DESC LIMIT 5;
SELECT * FROM public.transactions WHERE type = 'distribution_dividende' ORDER BY created_at DESC LIMIT 10;
```

## Avantages de cette Approche

- ✅ **Découplé** : Pas de blocage pendant la transaction de prix
- ✅ **Auditable** : Chaque ajustement crée une transaction traceable
- ✅ **Flexible** : Peut être manuel (clic admin), automatisé (cron) ou déclenché par événement
- ✅ **Idempotent** : Relancer sans double-crédit si prix inchangé
- ✅ **Scalable** : Fonctionne bien même avec beaucoup d'investissements/utilisateurs

## Notes

- Les soldes sont crédités/débités selon les plus-values/moins-values
- Les transactions sont créées avec description `"Plus-value suite mise à jour des cours"` ou `"Ajustement suite baisse des cours"`
- Le trigger NOTIFY fonctionne même si le sync n'est pas déclenché immédiatement (notifications asynchrones)
