-- =============================================================================
-- Script COMPLET : Insertion + Mise à jour des 48 actions BRVM
-- Exécuter dans Supabase SQL Editor
-- =============================================================================

INSERT INTO public.investment_offers (title, description, type, roi_percentage, price_per_share, minimum_investment, is_active)
VALUES 
    ('Servair Abidjan (ABJC)', 'Restauration et services aéroportuaires.', 'Action', 9.8, 2990, 2990, true),
    ('BIIC Bénin (BICB)', 'Secteur Bancaire et financier - Bénin.', 'Action', 6.8, 6495, 6495, true),
    ('BICI Côte d’Ivoire (BICC)', 'Banque Ivoirienne pour le Commerce et l’Industrie.', 'Action', 8.1, 28100, 28100, true),
    ('Bernabé Côte d’Ivoire (BNBC)', 'Distribution de quincaillerie et matériels industriels.', 'Action', 4.5, 2000, 2000, true),
    ('Bank of Africa Bénin (BOAB)', 'Secteur Bancaire - Bénin.', 'Action', 8.4, 8700, 8700, true),
    ('Bank of Africa Burkina Faso (BOABF)', 'Secteur Bancaire - Burkina Faso.', 'Action', 9.2, 7000, 7000, true),
    ('Bank of Africa Côte d’Ivoire (BOAC)', 'Secteur Bancaire - Côte d’Ivoire.', 'Action', 7.8, 9745, 9745, true),
    ('Bank of Africa Mali (BOAM)', 'Secteur Bancaire - Mali.', 'Action', 8.8, 5755, 5755, true),
    ('Bank of Africa Niger (BOAN)', 'Secteur Bancaire - Niger.', 'Action', 9.5, 5350, 5350, true),
    ('Bank of Africa Sénégal (BOAS)', 'Secteur Bancaire - Sénégal.', 'Action', 7.9, 7500, 7500, true),
    ('Crown Siem CI (CABC)', 'Emballage métallique et sous-traitance industrielle.', 'Action', 4.9, 3650, 3650, true),
    ('Coris Bank International (CBIBF)', 'Banque commerciale et d’investissement.', 'Action', 9.0, 27500, 27500, true),
    ('CFAO Motors CI (CFAC)', 'Distribution automobile et équipements.', 'Action', 5.6, 1710, 1710, true),
    ('Compagnie Ivoirienne d’Électricité (CIEC)', 'Compagnie Ivoirienne d’Électricité.', 'Action', 8.8, 5105, 5105, true),
    ('Ecobank Côte d’Ivoire (ECOC)', 'Services bancaires et financiers.', 'Action', 7.9, 15700, 15700, true),
    ('Ecobank Transnational (ETIT)', 'Holding bancaire panafricain.', 'Action', 5.5, 63, 3000, true),
    ('Filtisac (FTSC)', 'Leader de l’emballage en Afrique de l’Ouest.', 'Action', 6.1, 1990, 1990, true),
    ('Loterie Nationale du Bénin (LNBB)', 'Loterie Nationale du Bénin.', 'Action', 7.2, 4250, 4250, true),
    ('NEI-CEDA (NEIC)', 'Nouvelles Éditions Ivoiriennes - CEDA.', 'Action', 4.8, 2150, 2150, true),
    ('NSIA Banque CI (NSBC)', 'Groupe bancaire et assurances.', 'Action', 8.1, 22000, 22000, true),
    ('Nestlé Côte d’Ivoire (NTLC)', 'Transformation et distribution de produits alimentaires.', 'Action', 5.8, 15930, 15930, true),
    ('Onatel Burkina Faso (ONTBF)', 'Opérateur télécom majeur au Burkina Faso.', 'Action', 11.5, 2700, 2700, true),
    ('Orange Côte d’Ivoire (ORAC)', 'Opérateur télécoms et services numériques.', 'Action', 7.2, 16165, 16165, true),
    ('Oragroup (ORGT)', 'Groupe bancaire régional Orabank.', 'Action', 6.5, 2670, 2670, true),
    ('Palm CI (PALC)', 'Production et transformation d’huile de palme.', 'Action', 12.0, 8700, 8700, true),
    ('Tractafric Motors CI (PRSC)', 'Vente et maintenance de véhicules industriels.', 'Action', 5.6, 4295, 4295, true),
    ('Alios Finance (SAFC)', 'Société Africaine de Crédit Automobile.', 'Action', 6.3, 4550, 4550, true),
    ('Sucrivoire (SCRC)', 'Exploitation et raffinage de canne à sucre.', 'Action', 3.5, 3530, 3530, true),
    ('SODECI (SDCC)', 'Société de Distribution d’Eau de Côte d’Ivoire.', 'Action', 7.7, 11300, 11300, true),
    ('Africa Global Logistics CI (SDSC)', 'Logistique et transport maritime - Côte d’Ivoire.', 'Action', 6.2, 2525, 2525, true),
    ('Siem Côte d’Ivoire (SEMC)', 'Emballage métallique et sous-traitance industrielle.', 'Action', 4.9, 1535, 1535, true),
    ('Société Générale CI (SGBC)', 'Société Générale Côte d’Ivoire.', 'Action', 9.1, 38200, 38200, true),
    ('Sicable (SHEC)', 'Fabrication de câbles électriques et téléphoniques.', 'Action', 6.4, 2200, 2200, true),
    ('Société Ivoirienne de Banque (SIBC)', 'Filiale du groupe Attijariwafa bank.', 'Action', 7.5, 8900, 8900, true),
    ('SICOR (SICC)', 'Société Ivoirienne de Coco Râpé.', 'Action', 4.8, 5100, 5100, true),
    ('Air Liquide CI (SIVC)', 'Production et distribution de gaz industriels et médicaux.', 'Action', 5.7, 2530, 2530, true),
    ('SOLIBRA (SLBC)', 'Société de Limonaderies et Brasseries d’Afrique.', 'Action', 4.5, 39900, 39900, true),
    ('SMB CI (SMBC)', 'Société Multinationale de Bitumes.', 'Action', 7.4, 16400, 16400, true),
    ('Sonatel (SNTS)', 'Télécommunications et réseaux en Afrique de l’Ouest.', 'Action', 8.5, 32450, 32450, true),
    ('SOGB (SOGC)', 'Société Grand-Bereby d’Hévéas et de Palmier à Huile.', 'Action', 8.2, 8005, 8005, true),
    ('SAPH (SPHC)', 'Société Africaine de Plantations d’Hévéas.', 'Action', 6.8, 7500, 7500, true),
    ('SITAB (STAC)', 'Société Ivoirienne des Tabacs.', 'Action', 5.9, 3185, 3185, true),
    ('SETAO (STBC)', 'Société d’Études et de Travaux pour l’Afrique de l’Ouest.', 'Action', 6.7, 24195, 24195, true),
    ('TOTALENERGIES CI (TTLC)', 'Réseau de stations-services et lubrifiants CI.', 'Action', 6.2, 2900, 2900, true),
    ('TOTALENERGIES SÉNÉGAL (TTLS)', 'Réseau de distribution pétrolière Sénégal.', 'Action', 6.8, 4110, 4110, true),
    ('UNILEVER CI (UNLC)', 'Fabrication et vente de produits de grande consommation.', 'Action', 5.1, 53735, 53735, true),
    ('UNIWAX (UNXC)', 'Fabrication et distribution de tissus wax.', 'Action', 5.3, 1660, 1660, true),
    ('VIVO ENERGY CI (VIVO)', 'Distribution et commercialisation de carburants.', 'Action', 6.4, 1800, 1800, true)
ON CONFLICT DO NOTHING;

-- Updates to existing offers by ticker
UPDATE public.investment_offers SET price_per_share = 2990, minimum_investment = 2990 WHERE title ILIKE '%ABJC%';
UPDATE public.investment_offers SET price_per_share = 6495, minimum_investment = 6495 WHERE title ILIKE '%BICB%';
UPDATE public.investment_offers SET price_per_share = 28100, minimum_investment = 28100 WHERE title ILIKE '%BICC%' OR title ILIKE '%BICI%';
UPDATE public.investment_offers SET price_per_share = 2000, minimum_investment = 2000 WHERE title ILIKE '%BNBC%';
UPDATE public.investment_offers SET price_per_share = 8700, minimum_investment = 8700 WHERE title ILIKE '%BOAB%' AND title NOT ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 7000, minimum_investment = 7000 WHERE title ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 9745, minimum_investment = 9745 WHERE title ILIKE '%BOAC%';
UPDATE public.investment_offers SET price_per_share = 5755, minimum_investment = 5755 WHERE title ILIKE '%BOAM%';
UPDATE public.investment_offers SET price_per_share = 5350, minimum_investment = 5350 WHERE title ILIKE '%BOAN%';
UPDATE public.investment_offers SET price_per_share = 7500, minimum_investment = 7500 WHERE title ILIKE '%BOAS%';
UPDATE public.investment_offers SET price_per_share = 3650, minimum_investment = 3650 WHERE title ILIKE '%CABC%' OR title ILIKE '%Crown Siem%';
UPDATE public.investment_offers SET price_per_share = 27500, minimum_investment = 27500 WHERE title ILIKE '%CBIBF%';
UPDATE public.investment_offers SET price_per_share = 1710, minimum_investment = 1710 WHERE title ILIKE '%CFAC%';
UPDATE public.investment_offers SET price_per_share = 5105, minimum_investment = 5105 WHERE title ILIKE '%CIEC%';
UPDATE public.investment_offers SET price_per_share = 15700, minimum_investment = 15700 WHERE title ILIKE '%ECOC%' AND title NOT ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 63, minimum_investment = 3000 WHERE title ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 1990, minimum_investment = 1990 WHERE title ILIKE '%FTSC%';
UPDATE public.investment_offers SET price_per_share = 4250, minimum_investment = 4250 WHERE title ILIKE '%LNBB%';
UPDATE public.investment_offers SET price_per_share = 2150, minimum_investment = 2150 WHERE title ILIKE '%NEIC%';
UPDATE public.investment_offers SET price_per_share = 22000, minimum_investment = 22000 WHERE title ILIKE '%NSBC%';
UPDATE public.investment_offers SET price_per_share = 15930, minimum_investment = 15930 WHERE title ILIKE '%NTLC%' OR title ILIKE '%Nestlé Côte%';
UPDATE public.investment_offers SET price_per_share = 2700, minimum_investment = 2700 WHERE title ILIKE '%ONTBF%';
UPDATE public.investment_offers SET price_per_share = 16165, minimum_investment = 16165 WHERE title ILIKE '%ORAC%';
UPDATE public.investment_offers SET price_per_share = 2670, minimum_investment = 2670 WHERE title ILIKE '%ORGT%';
UPDATE public.investment_offers SET price_per_share = 8700, minimum_investment = 8700 WHERE title ILIKE '%PALC%';
UPDATE public.investment_offers SET price_per_share = 4295, minimum_investment = 4295 WHERE title ILIKE '%PRSC%';
UPDATE public.investment_offers SET price_per_share = 4550, minimum_investment = 4550 WHERE title ILIKE '%SAFC%' OR title ILIKE '%Alios%';
UPDATE public.investment_offers SET price_per_share = 3530, minimum_investment = 3530 WHERE title ILIKE '%SCRC%';
UPDATE public.investment_offers SET price_per_share = 11300, minimum_investment = 11300 WHERE title ILIKE '%SDCC%';
UPDATE public.investment_offers SET price_per_share = 2525, minimum_investment = 2525 WHERE title ILIKE '%SDSC%';
UPDATE public.investment_offers SET price_per_share = 1535, minimum_investment = 1535 WHERE title ILIKE '%SEMC%' OR title ILIKE '%Siem%';
UPDATE public.investment_offers SET price_per_share = 38200, minimum_investment = 38200 WHERE title ILIKE '%SGBC%';
UPDATE public.investment_offers SET price_per_share = 2200, minimum_investment = 2200 WHERE title ILIKE '%SHEC%' OR title ILIKE '%Sicable%';
UPDATE public.investment_offers SET price_per_share = 8900, minimum_investment = 8900 WHERE title ILIKE '%SIBC%';
UPDATE public.investment_offers SET price_per_share = 5100, minimum_investment = 5100 WHERE title ILIKE '%SICC%' OR title ILIKE '%SICOR%';
UPDATE public.investment_offers SET price_per_share = 2530, minimum_investment = 2530 WHERE title ILIKE '%SIVC%' OR title ILIKE '%Air Liquide%';
UPDATE public.investment_offers SET price_per_share = 39900, minimum_investment = 39900 WHERE title ILIKE '%SLBC%';
UPDATE public.investment_offers SET price_per_share = 16400, minimum_investment = 16400 WHERE title ILIKE '%SMBC%';
UPDATE public.investment_offers SET price_per_share = 32450, minimum_investment = 32450 WHERE title ILIKE '%SNTS%';
UPDATE public.investment_offers SET price_per_share = 8005, minimum_investment = 8005 WHERE title ILIKE '%SOGC%';
UPDATE public.investment_offers SET price_per_share = 7500, minimum_investment = 7500 WHERE title ILIKE '%SPHC%';
UPDATE public.investment_offers SET price_per_share = 3185, minimum_investment = 3185 WHERE title ILIKE '%STAC%' OR title ILIKE '%SITAB%';
UPDATE public.investment_offers SET price_per_share = 24195, minimum_investment = 24195 WHERE title ILIKE '%STBC%' OR title ILIKE '%SETAO%';
UPDATE public.investment_offers SET price_per_share = 2900, minimum_investment = 2900 WHERE title ILIKE '%TTLC%';
UPDATE public.investment_offers SET price_per_share = 4110, minimum_investment = 4110 WHERE title ILIKE '%TTLS%';
UPDATE public.investment_offers SET price_per_share = 53735, minimum_investment = 53735 WHERE title ILIKE '%UNLC%';
UPDATE public.investment_offers SET price_per_share = 1660, minimum_investment = 1660 WHERE title ILIKE '%UNXC%';
UPDATE public.investment_offers SET price_per_share = 1800, minimum_investment = 1800 WHERE title ILIKE '%VIVO%';
