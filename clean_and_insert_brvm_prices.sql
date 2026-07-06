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
    ('ABJC - Air Liquide CI', 'Air Liquide Côte d''Ivoire. Secteur chimie/gaz industriel.', 'Action', 5.2, 3200, 3200, true),
    ('BICB - BIIC Bénin', 'Banque Ivoirienne d''Investissement et de Crédit Bénin.', 'Action', 6.8, 6275, 6275, true),
    ('BICC - BICI Côte d''Ivoire', 'Banque Ivoirienne de Crédit et d''Investissement.', 'Action', 8.1, 29250, 29250, true),
    ('BNBC - Bernabé Côte d''Ivoire', 'Bernabé Côte d''Ivoire. Secteur de la distribution.', 'Action', 4.5, 1985, 1985, true),
    ('BOAB - Bank of Africa Bénin', 'Groupe Bank of Africa - Filiale Bénin.', 'Action', 8.4, 9100, 9100, true),
    ('BOABF - Bank of Africa Burkina Faso', 'Groupe Bank of Africa - Filiale Burkina Faso.', 'Action', 9.2, 5940, 5940, true),
    ('BOAC - Bank of Africa Côte d''Ivoire', 'Groupe Bank of Africa - Filiale Côte d''Ivoire.', 'Action', 7.8, 9100, 9100, true),
    ('BOAM - Bank of Africa Mali', 'Groupe Bank of Africa - Filiale Mali.', 'Action', 8.8, 4965, 4965, true),
    ('BOAN - Bank of Africa Niger', 'Groupe Bank of Africa - Filiale Niger.', 'Action', 9.5, 4200, 4200, true),
    ('BOAS - Bank of Africa Sénégal', 'Groupe Bank of Africa - Filiale Sénégal.', 'Action', 7.9, 7305, 7305, true),
    ('CABC - Sicable Côte d''Ivoire', 'Sicable Côte d''Ivoire. Secteur industriel / Câbles.', 'Action', 4.8, 4500, 4500, true),
    ('CBIBF - Coris Bank Burkina Faso', 'Coris Bank International Burkina Faso. Banque de croissance.', 'Action', 9.0, 24000, 24000, true),
    ('CFAC - CFAO Motors Côte d''Ivoire', 'CFAO Motors Côte d''Ivoire. Distribution automobile.', 'Action', 5.6, 1780, 1780, true),
    ('CIEC - CIE Côte d''Ivoire', 'Compagnie Ivoirienne d''Électricité. Monopole eau/électricité.', 'Action', 8.8, 5300, 5300, true),
    ('ECOC - Ecobank Côte d''Ivoire', 'Ecobank Côte d''Ivoire. Secteur bancaire.', 'Action', 7.9, 17270, 17270, true),
    ('ETIT - Ecobank Transnational Inc.', 'Ecobank Transnational Inc. Holding bancaire panafricain.', 'Action', 5.5, 46, 3000, true),
    ('FTSC - Filtisac', 'Filtisac. Leader de l''emballage en Afrique de l''Ouest.', 'Action', 6.1, 2055, 2055, true),
    ('LNBB - Loterie Nationale du Bénin', 'Loterie Nationale du Bénin.', 'Action', 7.2, 4350, 4350, true),
    ('NEIC - Nestlé Côte d''Ivoire', 'Nestlé Côte d''Ivoire. Secteur agroalimentaire.', 'Action', 5.4, 2270, 2270, true),
    ('NSBC - NSIA Banque Côte d''Ivoire', 'NSIA Banque Côte d''Ivoire. Secteur bancaire.', 'Action', 8.1, 19990, 19990, true),
    ('NTLC - Nestlé Mali', 'Nestlé Mali. Secteur agroalimentaire - Mali.', 'Action', 5.8, 16450, 16450, true),
    ('ONTBF - ONATEL Burkina Faso', 'ONATEL Burkina Faso. Secteur télécom.', 'Action', 11.5, 2800, 2800, true),
    ('ORAC - Orange Côte d''Ivoire', 'Orange Côte d''Ivoire. Secteur télécoms.', 'Action', 7.2, 16750, 16750, true),
    ('ORGT - Oragroup', 'Oragroup. Groupe de télécommunications panafricain.', 'Action', 6.5, 2700, 2700, true),
    ('PALC - Palm Côte d''Ivoire', 'Palm Côte d''Ivoire. Agro-industrie huile de palme.', 'Action', 12.0, 8835, 8835, true),
    ('PRSC - Tractafric Motors CI', 'Tractafric Motors Côte d''Ivoire. Distribution véhicules.', 'Action', 5.6, 4520, 4520, true),
    ('SAFC - SAFCA', 'SAFCA. Secteur agricole.', 'Action', 6.3, 4555, 4555, true),
    ('SCRC - SUCRIVOIRE', 'SUCRIVOIRE. Production et commercialisation du sucre.', 'Action', 3.5, 3625, 3625, true),
    ('SDCC - SODECI', 'SODECI. Distribution d''eau en Côte d''Ivoire.', 'Action', 7.7, 12045, 12045, true),
    ('SDSC - Africa Global Logistics CI', 'Africa Global Logistics Côte d''Ivoire. Logistique.', 'Action', 6.2, 2435, 2435, true),
    ('SEMC - Crown Siem CI', 'Crown Siem Côte d''Ivoire. Secteur industriel.', 'Action', 4.9, 1505, 1505, true),
    ('SGBC - Société Générale Côte d''Ivoire', 'Société Générale Côte d''Ivoire. Secteur bancaire majeur.', 'Action', 9.1, 37000, 37000, true),
    ('SHEC - Vivo Energy Côte d''Ivoire', 'Vivo Energy Côte d''Ivoire. Distribution pétrolière.', 'Action', 6.4, 2200, 2200, true),
    ('SIBC - Société Ivoirienne de Banque', 'Société Ivoirienne de Banque. Banque historique.', 'Action', 7.5, 9000, 9000, true),
    ('SICC - SICOR', 'SICOR. Secteur industriel.', 'Action', 4.8, 5200, 5200, true),
    ('SIVC - Erium Côte d''Ivoire', 'Erium Côte d''Ivoire. Secteur énergies.', 'Action', 5.7, 2390, 2390, true),
    ('SLBC - Solibra', 'Solibra. Leader de la brasserie en Côte d''Ivoire.', 'Action', 4.5, 40000, 40000, true),
    ('SMBC - SMB Côte d''Ivoire', 'SMB Côte d''Ivoire. Action industrielle.', 'Action', 7.4, 17720, 17720, true),
    ('SNTS - Sonatel', 'Sonatel Sénégal. Plus grande capitalisation du marché BRVM.', 'Action', 8.5, 29495, 29495, true),
    ('SOGC - SOGB', 'SOGB. Agro-industrie (Caoutchouc et Palme).', 'Action', 8.2, 8450, 8450, true),
    ('SPHC - SAPH', 'SAPH. Agriculture (Caoutchouc) leader du marché.', 'Action', 6.8, 7675, 7675, true),
    ('STAC - Setao', 'Setao. Secteur agro-industriel.', 'Action', 5.9, 3415, 3415, true),
    ('STBC - Servair Abidjan', 'Servair Abidjan. Services aériens et restauration.', 'Action', 9.8, 24015, 24015, true),
    ('TTLC - TotalEnergies CI', 'TotalEnergies Côte d''Ivoire. Distribution pétrolière.', 'Action', 6.2, 2900, 2900, true),
    ('TTLS - TotalEnergies Sénégal', 'TotalEnergies Sénégal. Distribution pétrolière.', 'Action', 6.8, 4045, 4045, true),
    ('UNLC - Unilever Côte d''Ivoire', 'Unilever Côte d''Ivoire. Distribution et biens de grande consommation.', 'Action', 5.1, 51395, 51395, true),
    ('UNXC - Uniwax Côte d''Ivoire', 'Uniwax Côte d''Ivoire. Secteur textile.', 'Action', 5.3, 1535, 1535, true);

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
