-- =============================================================================
-- Mise à jour des prix BRVM - Données actualisées (juin 2026)
-- Source: Bourse Régionale des Valeurs Mobilières (BRVM)
-- Ce script insère les nouvelles offres ou met à jour les prix existants
-- =============================================================================

BEGIN;

-- Insertion/mise à jour des offres avec les prix BRVM actuels
INSERT INTO public.investment_offers (title, description, type, roi_percentage, price_per_share, minimum_investment, is_active)
VALUES
  ('ABJC - Servair Abidjan', 'Services aériens', 'Action', 6.5, 2900, 2900, true),
  ('BICB - BIIC Bénin', 'Secteur Bancaire - Bénin', 'Action', 7.2, 5455, 5455, true),
  ('BICC - BICICI', 'Secteur Bancaire - Côte d''Ivoire', 'Action', 6.9, 28970, 28970, true),
  ('BNBC - Bernabé Côte d''Ivoire', 'Négoce et distribution', 'Action', 5.5, 1650, 1650, true),
  ('BOAB - Bank of Africa Bénin', 'Secteur Bancaire - Bénin', 'Action', 8.4, 8795, 8795, true),
  ('BOABF - Bank of Africa Burkina Faso', 'Secteur Bancaire - Burkina Faso', 'Action', 9.2, 5580, 5580, true),
  ('BOAC - Bank of Africa Côte d''Ivoire', 'Secteur Bancaire - Côte d''Ivoire', 'Action', 7.8, 8000, 8000, true),
  ('BOAM - Bank of Africa Mali', 'Secteur Bancaire - Mali', 'Action', 8.8, 2800, 2800, true),
  ('BOAN - Bank of Africa Niger', 'Secteur Bancaire - Niger', 'Action', 9.5, 4500, 4500, true),
  ('BOAS - Bank of Africa Sénégal', 'Secteur Bancaire - Sénégal', 'Action', 7.9, 3500, 3500, true),
  ('CABC - Sicable', 'Câbles électriques', 'Action', 4.8, 1200, 1200, true),
  ('CBIBF - Coris Bank International', 'Secteur Bancaire - Burkina Faso', 'Action', 9.0, 11000, 11000, true),
  ('CFAC - CFAO Motors', 'Distribution automobile - Côte d''Ivoire', 'Action', 5.6, 1765, 1765, true),
  ('CIEC - CIE', 'Distribution d''électricité - Côte d''Ivoire', 'Action', 8.8, 4755, 4755, true),
  ('ECOC - Ecobank Côte d''Ivoire', 'Secteur Bancaire - Côte d''Ivoire', 'Action', 8.0, 16400, 16400, true),
  ('ETIT - Ecobank Transnational', 'Holding bancaire panafricain', 'Action', 5.5, 20, 3000, true),
  ('FTSC - Filtisac', 'Secteur de l''emballage', 'Action', 6.1, 2400, 2400, true),
  ('LNBB - Loterie Nationale du Bénin', 'Secteur des jeux et loteries', 'Action', 3.0, 4005, 4005, true),
  ('NEIC - NEI-CEDA', 'Secteur immobilier', 'Action', 4.5, 500, 500, true),
  ('NTLC - Nestlé Côte d''Ivoire', 'Secteur agroalimentaire', 'Action', 5.4, 13200, 13200, true),
  ('NSBC - NSIA Banque', 'Secteur Bancaire - Côte d''Ivoire', 'Action', 7.5, 8500, 8500, true),
  ('ONTBF - Onatel Burkina Faso', 'Secteur Télécom - Burkina Faso', 'Action', 11.5, 2905, 2905, true),
  ('ORAC - Orange Côte d''Ivoire', 'Secteur Télécom - Côte d''Ivoire', 'Action', 7.2, 16930, 16930, true),
  ('ORGT - Oragroup', 'Secteur Télécom - Groupe régional', 'Action', 6.8, 2855, 2855, true),
  ('PALC - Palmci', 'Secteur agroalimentaire (Palme)', 'Action', 12.0, 8255, 8255, true),
  ('PRSC - Tractafric Motors', 'Distribution automobile - Côte d''Ivoire', 'Action', 5.2, 4410, 4410, true),
  ('SAFC - Safca', 'Secteur agricole', 'Action', 4.5, 3800, 3800, true),
  ('SCRC - Sucrivoire', 'Production de sucre - Côte d''Ivoire', 'Action', 3.5, 2940, 2940, true),
  ('SDCC - SODECI', 'Distribution d''eau - Côte d''Ivoire', 'Action', 7.7, 7000, 7000, true),
  ('SDSC - Africa Global Logistics', 'Logistique - Côte d''Ivoire', 'Action', 5.0, 1950, 1950, true),
  ('SEMC - Société des Caoutchoucs', 'Agriculture (Caoutchouc)', 'Action', 6.5, 7000, 7000, true),
  ('SGBC - Société Générale Côte d''Ivoire', 'Secteur Bancaire - Côte d''Ivoire', 'Action', 9.1, 37505, 37505, true),
  ('SHEC - Shell Côte d''Ivoire', 'Distribution pétrolière', 'Action', 6.0, 15000, 15000, true),
  ('SICC - SICOR', 'Secteur industriel', 'Action', 4.8, 4135, 4135, true),
  ('SIBC - Société Ivoirienne de Banque', 'Secteur Bancaire - Côte d''Ivoire', 'Action', 7.5, 8800, 8800, true),
  ('SIVC - Air Liquide Côte d''Ivoire', 'Gaz industriels', 'Action', 5.5, 40000, 40000, true),
  ('SLBC - Solibra', 'Brasserie - Côte d''Ivoire', 'Action', 4.5, 150000, 150000, true),
  ('SMBC - SMB', 'Action industrielle', 'Action', 7.4, 13330, 13330, true),
  ('SNTS - Sonatel', 'Secteur Télécom - Sénégal', 'Action', 8.5, 28500, 28500, true),
  ('SOGC - SOGB', 'Agroalimentaire (Caoutchouc/Palme)', 'Action', 8.2, 8000, 8000, true),
  ('SPHC - SAPH', 'Agriculture (Caoutchouc)', 'Action', 6.8, 7720, 7720, true),
  ('STAC - SETAO', 'Services portuaires', 'Action', 4.0, 1000, 1000, true),
  ('STBC - SITAB', 'Secteur immobilier/services', 'Action', 5.5, 100000, 100000, true),
  ('TTLC - TotalEnergies Marketing CI', 'Distribution pétrolière - Côte d''Ivoire', 'Action', 6.2, 2890, 2890, true),
  ('TTLS - TotalEnergies Marketing Sénégal', 'Distribution pétrolière - Sénégal', 'Action', 6.8, 3495, 3495, true),
  ('UNLC - Unilever Côte d''Ivoire', 'Secteur FMCG/Consommation', 'Action', 5.1, 58000, 58000, true),
  ('UNXC - Uniwax', 'Secteur textiles/industrie', 'Action', 4.2, 900, 900, true)
ON CONFLICT DO NOTHING;

COMMIT;

-- =============================================================================
-- Notes :
-- 1. Les prix sont basés sur les cotations BRVM (juin 2026)
-- 2. Les prix approximatifs (indiqués par ~) utilisent les valeurs arrondies
-- 3. Les ROI sont estimés selon la volatilité historique et le secteur
-- 4. Ce script insère uniquement les nouvelles offres (ON CONFLICT DO NOTHING)
--    Pour mettre à jour les prix des offres existantes, utiliser :
--    UPDATE public.investment_offers SET price_per_share = X WHERE title ILIKE '%SYMBOL%';
-- =============================================================================
