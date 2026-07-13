-- =============================================================================
-- Script NETTOYAGE + INSERTION des 48 offres BRVM (juillet 2026)
-- ⚠️ ATTENTION : Supprime TOUTES les offres actives avant d'insérer les nouvelles
-- Exécuter dans Supabase SQL Editor
-- =============================================================================

-- ÉTAPE 1 : Supprimer toutes les offres existantes (anciennes données)
DELETE FROM public.investment_offers WHERE is_active = true;

-- ÉTAPE 2 : Insérer les 48 offres BRVM avec les prix actuels (juillet 2026)
INSERT INTO public.investment_offers (title, description, type, roi_percentage, price_per_share, minimum_investment, is_active)
VALUES 
    ('ABJC - Air Liquide CI', 'Air Liquide Côte d''Ivoire. Secteur chimie/gaz industriel.', 'Action', 5.2, 3150, 3150, true),
    ('BICB - BIIC Bénin', 'Banque Ivoirienne d''Investissement et de Crédit Bénin.', 'Action', 6.8, 6350, 6350, true),
    ('BICC - BICI Côte d''Ivoire', 'Banque Ivoirienne de Crédit et d''Investissement.', 'Action', 8.1, 28800, 28800, true),
    ('BNBC - Bernabé Côte d''Ivoire', 'Bernabé Côte d''Ivoire. Secteur de la distribution.', 'Action', 4.5, 1755, 1755, true),
    ('BOAB - Bank of Africa Bénin', 'Groupe Bank of Africa - Filiale Bénin.', 'Action', 8.4, 8750, 8750, true),
    ('BOABF - Bank of Africa Burkina Faso', 'Groupe Bank of Africa - Filiale Burkina Faso.', 'Action', 9.2, 6050, 6050, true),
    ('BOAC - Bank of Africa Côte d''Ivoire', 'Groupe Bank of Africa - Filiale Côte d''Ivoire.', 'Action', 7.8, 9500, 9500, true),
    ('BOAM - Bank of Africa Mali', 'Groupe Bank of Africa - Filiale Mali.', 'Action', 8.8, 5450, 5450, true),
    ('BOAN - Bank of Africa Niger', 'Groupe Bank of Africa - Filiale Niger.', 'Action', 9.5, 4790, 4790, true),
    ('BOAS - Bank of Africa Sénégal', 'Groupe Bank of Africa - Filiale Sénégal.', 'Action', 7.9, 7300, 7300, true),
    ('CABC - Sicable Côte d''Ivoire', 'Sicable Côte d''Ivoire. Secteur industriel / Câbles.', 'Action', 4.8, 7000, 7000, true),
    ('CBIBF - Coris Bank Burkina Faso', 'Coris Bank International Burkina Faso. Banque de croissance.', 'Action', 9.0, 29610, 29610, true),
    ('CFAC - CFAO Motors Côte d''Ivoire', 'CFAO Motors Côte d''Ivoire. Distribution automobile.', 'Action', 5.6, 1575, 1575, true),
    ('CIEC - CIE Côte d''Ivoire', 'Compagnie Ivoirienne d''Électricité. Monopole eau/électricité.', 'Action', 8.8, 3980, 3980, true),
    ('ECOC - Ecobank Côte d''Ivoire', 'Ecobank Côte d''Ivoire. Secteur bancaire.', 'Action', 7.9, 7000, 7000, true),
    ('ETIT - Ecobank Transnational Inc.', 'Ecobank Transnational Inc. Holding bancaire panafricain.', 'Action', 5.5, 64, 3000, true),
    ('FTSC - Filtisac', 'Filtisac. Leader de l''emballage en Afrique de l''Ouest.', 'Action', 6.1, 3200, 3200, true),
    ('LNBB - Loterie Nationale du Bénin', 'Loterie Nationale du Bénin.', 'Action', 7.2, 4350, 4350, true),
    ('NEIC - Nestlé Côte d''Ivoire', 'Nestlé Côte d''Ivoire. Secteur agroalimentaire.', 'Action', 5.4, 2000, 2000, true),
    ('NSBC - NSIA Banque Côte d''Ivoire', 'NSIA Banque Côte d''Ivoire. Secteur bancaire.', 'Action', 8.1, 8500, 8500, true),
    ('NTLC - Nestlé Mali', 'Nestlé Mali. Secteur agroalimentaire - Mali.', 'Action', 5.8, 8500, 8500, true),
    ('ONTBF - ONATEL Burkina Faso', 'ONATEL Burkina Faso. Secteur télécom.', 'Action', 11.5, 2450, 2450, true),
    ('ORAC - Orange Côte d''Ivoire', 'Orange Côte d''Ivoire. Secteur télécoms.', 'Action', 7.2, 11500, 11500, true),
    ('ORGT - Oragroup', 'Oragroup. Groupe de télécommunications panafricain.', 'Action', 6.5, 9000, 9000, true),
    ('PALC - Palm Côte d''Ivoire', 'Palm Côte d''Ivoire. Agro-industrie huile de palme.', 'Action', 12.0, 10000, 10000, true),
    ('PRSC - Tractafric Motors CI', 'Tractafric Motors Côte d''Ivoire. Distribution véhicules.', 'Action', 5.6, 2350, 2350, true),
    ('SAFC - SAFCA', 'SAFCA. Secteur agricole.', 'Action', 6.3, 4200, 4200, true),
    ('SCRC - SUCRIVOIRE', 'SUCRIVOIRE. Production et commercialisation du sucre.', 'Action', 3.5, 15000, 15000, true),
    ('SDCC - SODECI', 'SODECI. Distribution d''eau en Côte d''Ivoire.', 'Action', 7.7, 8400, 8400, true),
    ('SDSC - Africa Global Logistics CI', 'Africa Global Logistics Côte d''Ivoire. Logistique.', 'Action', 6.2, 2210, 2210, true),
    ('SEMC - Crown Siem CI', 'Crown Siem Côte d''Ivoire. Secteur industriel.', 'Action', 4.9, 1500, 1500, true),
    ('SGBC - Société Générale Côte d''Ivoire', 'Société Générale Côte d''Ivoire. Secteur bancaire majeur.', 'Action', 9.1, 16500, 16500, true),
    ('SHEC - Vivo Energy Côte d''Ivoire', 'Vivo Energy Côte d''Ivoire. Distribution pétrolière.', 'Action', 6.4, 1210, 1210, true),
    ('SIBC - Société Ivoirienne de Banque', 'Société Ivoirienne de Banque. Banque historique.', 'Action', 7.5, 9900, 9900, true),
    ('SICC - SICOR', 'SICOR. Secteur industriel.', 'Action', 4.8, 7000, 7000, true),
    ('SIVC - Erium Côte d''Ivoire', 'Erium Côte d''Ivoire. Secteur énergies.', 'Action', 5.7, 315000, 315000, true),
    ('SLBC - Solibra', 'Solibra. Leader de la brasserie en Côte d''Ivoire.', 'Action', 4.5, 40000, 40000, true),
    ('SMBC - SMB Côte d''Ivoire', 'SMB Côte d''Ivoire. Action industrielle.', 'Action', 7.4, 7000, 7000, true),
    ('SNTS - Sonatel', 'Sonatel Sénégal. Plus grande capitalisation du marché BRVM.', 'Action', 8.5, 16000, 16000, true),
    ('SOGC - SOGB', 'SOGB. Agro-industrie (Caoutchouc et Palme).', 'Action', 8.2, 7000, 7000, true),
    ('SPHC - SAPH', 'SAPH. Agriculture (Caoutchouc) leader du marché.', 'Action', 6.8, 7550, 7550, true),
    ('STAC - Setao', 'Setao. Secteur agro-industriel.', 'Action', 5.9, 4000, 4000, true),
    ('STBC - Servair Abidjan', 'Servair Abidjan. Services aériens et restauration.', 'Action', 9.8, 3100, 3100, true),
    ('TTLC - TotalEnergies CI', 'TotalEnergies Côte d''Ivoire. Distribution pétrolière.', 'Action', 6.2, 2800, 2800, true),
    ('TTLS - TotalEnergies Sénégal', 'TotalEnergies Sénégal. Distribution pétrolière.', 'Action', 6.8, 1550, 1550, true),
    ('UNLC - Unilever Côte d''Ivoire', 'Unilever Côte d''Ivoire. Distribution et biens de grande consommation.', 'Action', 5.1, 50500, 50500, true),
    ('UNXC - Uniwax Côte d''Ivoire', 'Uniwax Côte d''Ivoire. Secteur textile.', 'Action', 5.3, 1340, 1340, true);

-- =============================================================================
-- ÉTAPE 3 : Vérification - Afficher les 48 offres insérées
-- =============================================================================
SELECT 
  id, 
  title, 
  price_per_share, 
  roi_percentage, 
  is_active,
  created_at
FROM public.investment_offers
WHERE is_active = true
ORDER BY title ASC
LIMIT 50;
