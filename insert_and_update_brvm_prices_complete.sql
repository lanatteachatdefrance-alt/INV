-- =============================================================================
-- Script COMPLET : Insertion + Mise à jour des 48 offres BRVM (juillet 2026)
-- Exécuter dans Supabase SQL Editor
-- =============================================================================

-- Supprimer les anciennes offres de test (optionnel - commentez si vous voulez garder d'autres offres)
-- DELETE FROM public.investment_offers WHERE is_active = true;

-- =============================================================================
-- Insertion des 48 offres BRVM avec les prix actuels (juillet 2026)
-- =============================================================================
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
    ('UNXC - Uniwax Côte d''Ivoire', 'Uniwax Côte d''Ivoire. Secteur textile.', 'Action', 5.3, 1535, 1535, true)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- Mise à jour des prix existants (au cas où certaines offres existent déjà)
-- =============================================================================
UPDATE public.investment_offers SET price_per_share = 3200, minimum_investment = 3200 WHERE title ILIKE '%ABJC%';
UPDATE public.investment_offers SET price_per_share = 6275, minimum_investment = 6275 WHERE title ILIKE '%BICB%';
UPDATE public.investment_offers SET price_per_share = 29250, minimum_investment = 29250 WHERE title ILIKE '%BICC%';
UPDATE public.investment_offers SET price_per_share = 1985, minimum_investment = 1985 WHERE title ILIKE '%BNBC%';
UPDATE public.investment_offers SET price_per_share = 9100, minimum_investment = 9100 WHERE title ILIKE '%BOAB%' AND title NOT ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 5940, minimum_investment = 5940 WHERE title ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 9100, minimum_investment = 9100 WHERE title ILIKE '%BOAC%';
UPDATE public.investment_offers SET price_per_share = 4965, minimum_investment = 4965 WHERE title ILIKE '%BOAM%';
UPDATE public.investment_offers SET price_per_share = 4200, minimum_investment = 4200 WHERE title ILIKE '%BOAN%';
UPDATE public.investment_offers SET price_per_share = 7305, minimum_investment = 7305 WHERE title ILIKE '%BOAS%';
UPDATE public.investment_offers SET price_per_share = 4500, minimum_investment = 4500 WHERE title ILIKE '%CABC%';
UPDATE public.investment_offers SET price_per_share = 24000, minimum_investment = 24000 WHERE title ILIKE '%CBIBF%';
UPDATE public.investment_offers SET price_per_share = 1780, minimum_investment = 1780 WHERE title ILIKE '%CFAC%';
UPDATE public.investment_offers SET price_per_share = 5300, minimum_investment = 5300 WHERE title ILIKE '%CIEC%';
UPDATE public.investment_offers SET price_per_share = 17270, minimum_investment = 17270 WHERE title ILIKE '%ECOC%' AND title NOT ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 46, minimum_investment = 3000 WHERE title ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 2055, minimum_investment = 2055 WHERE title ILIKE '%FTSC%';
UPDATE public.investment_offers SET price_per_share = 4350, minimum_investment = 4350 WHERE title ILIKE '%LNBB%';
UPDATE public.investment_offers SET price_per_share = 2270, minimum_investment = 2270 WHERE title ILIKE '%NEIC%';
UPDATE public.investment_offers SET price_per_share = 19990, minimum_investment = 19990 WHERE title ILIKE '%NSBC%';
UPDATE public.investment_offers SET price_per_share = 16450, minimum_investment = 16450 WHERE title ILIKE '%NTLC%';
UPDATE public.investment_offers SET price_per_share = 2800, minimum_investment = 2800 WHERE title ILIKE '%ONTBF%';
UPDATE public.investment_offers SET price_per_share = 16750, minimum_investment = 16750 WHERE title ILIKE '%ORAC%';
UPDATE public.investment_offers SET price_per_share = 2700, minimum_investment = 2700 WHERE title ILIKE '%ORGT%';
UPDATE public.investment_offers SET price_per_share = 8835, minimum_investment = 8835 WHERE title ILIKE '%PALC%';
UPDATE public.investment_offers SET price_per_share = 4520, minimum_investment = 4520 WHERE title ILIKE '%PRSC%';
UPDATE public.investment_offers SET price_per_share = 4555, minimum_investment = 4555 WHERE title ILIKE '%SAFC%';
UPDATE public.investment_offers SET price_per_share = 3625, minimum_investment = 3625 WHERE title ILIKE '%SCRC%';
UPDATE public.investment_offers SET price_per_share = 12045, minimum_investment = 12045 WHERE title ILIKE '%SDCC%';
UPDATE public.investment_offers SET price_per_share = 2435, minimum_investment = 2435 WHERE title ILIKE '%SDSC%';
UPDATE public.investment_offers SET price_per_share = 1505, minimum_investment = 1505 WHERE title ILIKE '%SEMC%';
UPDATE public.investment_offers SET price_per_share = 37000, minimum_investment = 37000 WHERE title ILIKE '%SGBC%';
UPDATE public.investment_offers SET price_per_share = 2200, minimum_investment = 2200 WHERE title ILIKE '%SHEC%';
UPDATE public.investment_offers SET price_per_share = 9000, minimum_investment = 9000 WHERE title ILIKE '%SIBC%';
UPDATE public.investment_offers SET price_per_share = 5200, minimum_investment = 5200 WHERE title ILIKE '%SICC%';
UPDATE public.investment_offers SET price_per_share = 2390, minimum_investment = 2390 WHERE title ILIKE '%SIVC%';
UPDATE public.investment_offers SET price_per_share = 40000, minimum_investment = 40000 WHERE title ILIKE '%SLBC%';
UPDATE public.investment_offers SET price_per_share = 17720, minimum_investment = 17720 WHERE title ILIKE '%SMBC%';
UPDATE public.investment_offers SET price_per_share = 29495, minimum_investment = 29495 WHERE title ILIKE '%SNTS%';
UPDATE public.investment_offers SET price_per_share = 8450, minimum_investment = 8450 WHERE title ILIKE '%SOGC%';
UPDATE public.investment_offers SET price_per_share = 7675, minimum_investment = 7675 WHERE title ILIKE '%SPHC%';
UPDATE public.investment_offers SET price_per_share = 3415, minimum_investment = 3415 WHERE title ILIKE '%STAC%';
UPDATE public.investment_offers SET price_per_share = 24015, minimum_investment = 24015 WHERE title ILIKE '%STBC%';
UPDATE public.investment_offers SET price_per_share = 2900, minimum_investment = 2900 WHERE title ILIKE '%TTLC%';
UPDATE public.investment_offers SET price_per_share = 4045, minimum_investment = 4045 WHERE title ILIKE '%TTLS%';
UPDATE public.investment_offers SET price_per_share = 51395, minimum_investment = 51395 WHERE title ILIKE '%UNLC%';
UPDATE public.investment_offers SET price_per_share = 1535, minimum_investment = 1535 WHERE title ILIKE '%UNXC%';

-- =============================================================================
-- Vérification : afficher les offres mises à jour
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
ORDER BY title ASC;
