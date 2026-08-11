-- =============================================================================
-- Trigger NOTIFY pour notification des changements de prix d'offres
-- Ce trigger envoie une notification Supabase chaque fois que price_per_share change
-- Un worker/edge-function ou un endpoint peut écouter et recalculer les portefeuilles
-- =============================================================================

CREATE OR REPLACE FUNCTION public.notify_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.price_per_share IS DISTINCT FROM OLD.price_per_share THEN
    PERFORM pg_notify(
      'price_update',
      json_build_object(
        'offer_id', NEW.id,
        'title', NEW.title,
        'old_price', OLD.price_per_share,
        'new_price', NEW.price_per_share,
        'timestamp', NOW()
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_price_change ON public.investment_offers;

CREATE TRIGGER trg_notify_price_change
AFTER UPDATE OF price_per_share ON public.investment_offers
FOR EACH ROW
EXECUTE FUNCTION public.notify_price_change();

DROP TRIGGER IF EXISTS trg_sync_portfolio_balances_on_price_change ON public.investment_offers;
CREATE TRIGGER trg_sync_portfolio_balances_on_price_change
AFTER UPDATE OF price_per_share ON public.investment_offers
FOR EACH ROW
EXECUTE FUNCTION public.sync_portfolio_balances_on_price_change();

-- =============================================================================
-- Notes d'utilisation :
-- 1. Exécuter ce script dans la base Supabase (SQL Editor)
-- 2. L'endpoint /api/admin/sync-balances peut être appelé manuellement
--    ou déclenché par webhook/cron pour recalculer les portefeuilles
-- 3. Alternativement, ajouter un écouteur Realtime côté client pour 'price_update'
--    et déclencher un refresh du dashboard
-- =============================================================================
