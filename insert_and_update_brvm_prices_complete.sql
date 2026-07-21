-- =============================================================================
-- Script COMPLET : Insertion + Mise à jour des 48 actions BRVM
-- Exécuter dans Supabase SQL Editor
-- =============================================================================

INSERT INTO public.investment_offers (title, description, type, roi_percentage, price_per_share, minimum_investment, is_active)
VALUES 
    ('Africa Global Logistics CI (SDSC)', 'Logistique et transport maritime - Côte d’Ivoire.', 'Action', 6.2, 2210, 2210, true),
    ('Bank of Africa Bénin (BOAB)', 'Secteur Bancaire - Bénin.', 'Action', 8.4, 8750, 8750, true),
    ('Bank of Africa Burkina Faso (BOABF)', 'Secteur Bancaire - Burkina Faso.', 'Action', 9.2, 6050, 6050, true),
    ('Bank of Africa Côte d’Ivoire (BOAC)', 'Secteur Bancaire - Côte d’Ivoire.', 'Action', 7.8, 9500, 9500, true),
    ('Bank of Africa Mali (BOAM)', 'Secteur Bancaire - Mali.', 'Action', 8.8, 5450, 5450, true),
    ('Bank of Africa Niger (BOAN)', 'Secteur Bancaire - Niger.', 'Action', 9.5, 4790, 4790, true),
    ('Bank of Africa Sénégal (BOAS)', 'Secteur Bancaire - Sénégal.', 'Action', 7.9, 7300, 7300, true),
    ('Banque Internationale pour le Commerce du Bénin (BICB)', 'Secteur Bancaire et financier - Bénin.', 'Action', 6.8, 6350, 6350, true),
    ('Bernabé Côte d’Ivoire (BNBC)', 'Distribution de quincaillerie et matériels industriels.', 'Action', 4.5, 1755, 1755, true),
    ('BICI Côte d’Ivoire (BICC)', 'Banque Ivoirienne pour le Commerce et l’Industrie.', 'Action', 8.1, 28800, 28800, true),
    ('Coris Bank International Burkina Faso (CBIBF)', 'Banque commerciale et d’investissement.', 'Action', 9.0, 29610, 29610, true),
    ('CFAO Motors Côte d’Ivoire (CFAC)', 'Distribution automobile et équipements.', 'Action', 5.6, 1575, 1575, true),
    ('CIE (CIEC)', 'Compagnie Ivoirienne d’Électricité.', 'Action', 8.8, 3980, 3980, true),
    ('Ecobank Côte d’Ivoire (ECOC)', 'Services bancaires et financiers.', 'Action', 7.9, 7000, 7000, true),
    ('Ecobank Transnational Inc. (ETIT)', 'Holding bancaire panafricain.', 'Action', 5.5, 64, 3000, true),
    ('Filtisac (FTSC)', 'Leader de l’emballage en Afrique de l’Ouest.', 'Action', 6.1, 3200, 3200, true),
    ('NEI-CEDA (NEIC)', 'Nouvelles Éditions Ivoiriennes - CEDA.', 'Action', 4.8, 2000, 2000, true),
    ('NSIA Banque Côte d’Ivoire (NSBC)', 'Groupe bancaire et assurances.', 'Action', 8.1, 8500, 8500, true),
    ('Onatel Burkina Faso (ONTBF)', 'Opérateur télécom majeur au Burkina Faso.', 'Action', 11.5, 2450, 2450, true),
    ('Orange Côte d’Ivoire (ORAC)', 'Opérateur télécoms et services numériques.', 'Action', 7.2, 11500, 11500, true),
    ('Oragroup (ORGT)', 'Groupe bancaire régional Orabank.', 'Action', 6.5, 9000, 9000, true),
    ('PALMCI (PALC)', 'Production et transformation d’huile de palme.', 'Action', 12.0, 10000, 10000, true),
    ('Tractafric Motors CI (PRSC)', 'Vente et maintenance de véhicules industriels.', 'Action', 5.6, 2350, 2350, true),
    ('SAFCA (SAFC)', 'Société Africaine de Crédit Automobile.', 'Action', 6.3, 4200, 4200, true),
    ('SODECI (SDCC)', 'Société de Distribution d’Eau de Côte d’Ivoire.', 'Action', 7.7, 8400, 8400, true),
    ('Crown Siem Côte d’Ivoire (SEMC)', 'Emballage métallique et sous-traitance industrielle.', 'Action', 4.9, 1500, 1500, true),
    ('SGBCI (SGBC)', 'Société Générale Côte d’Ivoire.', 'Action', 9.1, 16500, 16500, true),
    ('Vivo Energy Côte d’Ivoire (SHEC)', 'Distribution et commercialisation de carburants.', 'Action', 6.4, 1210, 1210, true),
    ('Société Ivoirienne de Banque (SIBC)', 'Filiale du groupe Attijariwafa bank.', 'Action', 7.5, 9900, 9900, true),
    ('SICOR Côte d’Ivoire (SICC)', 'Société Ivoirienne de Coco Râpé.', 'Action', 4.8, 7000, 7000, true),
    ('SAPH Côte d’Ivoire (SPHC)', 'Société Africaine de Plantations d’Hévéas.', 'Action', 6.8, 7550, 7550, true),
    ('SOLIBRA (SLBC)', 'Société de Limonaderies et Brasseries d’Afrique.', 'Action', 4.5, 5500, 5500, true),
    ('SMB (SMBC)', 'Société Multinationale de Bitumes.', 'Action', 7.4, 7000, 7000, true),
    ('Sonatel (SNTS)', 'Télécommunications et réseaux en Afrique de l’Ouest.', 'Action', 8.5, 16000, 16000, true),
    ('SOGB (SOGC)', 'Société Grand-Bereby d’Hévéas et de Palmier à Huile.', 'Action', 8.2, 7000, 7000, true),
    ('SETAO (STAC)', 'Société d’Études et de Travaux pour l’Afrique de l’Ouest.', 'Action', 5.9, 4000, 4000, true),
    ('SITAB Côte d’Ivoire (STBC)', 'Société Ivoirienne des Tabacs.', 'Action', 6.7, 3100, 3100, true),
    ('Unilever Côte d’Ivoire (UNLC)', 'Fabrication et vente de produits de grande consommation.', 'Action', 5.1, 50500, 50500, true),
    ('Uniwax (UNXC)', 'Fabrication et distribution de tissus wax.', 'Action', 5.3, 1340, 1340, true),
    ('TotalEnergies Marketing Côte d’Ivoire (TTLC)', 'Réseau de stations-services et lubrifiants CI.', 'Action', 6.2, 2800, 2800, true),
    ('TotalEnergies Marketing Sénégal (TTLS)', 'Réseau de distribution pétrolière Sénégal.', 'Action', 6.8, 1550, 1550, true),
    ('Air Liquide Côte d’Ivoire (Erium CI) (SIVC)', 'Production et distribution de gaz industriels et médicaux.', 'Action', 5.7, 315000, 315000, true),
    ('Servair Abidjan (ABJC)', 'Restauration et services aéroportuaires.', 'Action', 9.8, 3150, 3150, true),
    ('Nestlé Côte d’Ivoire (NTLC)', 'Transformation et distribution de produits alimentaires.', 'Action', 5.8, 8500, 8500, true),
    ('Sucrivoire (SCRC)', 'Exploitation et raffinage de canne à sucre.', 'Action', 3.5, 15000, 15000, true),
    ('Sicable Côte d’Ivoire (CABC)', 'Fabrication de câbles électriques et téléphoniques.', 'Action', 4.8, 7000, 7000, true),
    ('Société de Distribution d’Eau de Côte d’Ivoire (SDCC)', 'Distribution et traitement de l’eau potable en Côte d’Ivoire.', 'Action', 7.7, 8400, 8400, true),
    ('Bridge Bank Group Côte d’Ivoire (BBGC)', 'Banque d’affaires et services aux entreprises.', 'Action', 8.3, 6750, 6750, true)
ON CONFLICT DO NOTHING;

-- Updates to existing offers by ticker
UPDATE public.investment_offers SET price_per_share = 2210, minimum_investment = 2210 WHERE title ILIKE '%SDSC%';
UPDATE public.investment_offers SET price_per_share = 8750, minimum_investment = 8750 WHERE title ILIKE '%BOAB%' AND title NOT ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 6050, minimum_investment = 6050 WHERE title ILIKE '%BOABF%';
UPDATE public.investment_offers SET price_per_share = 9500, minimum_investment = 9500 WHERE title ILIKE '%BOAC%';
UPDATE public.investment_offers SET price_per_share = 5450, minimum_investment = 5450 WHERE title ILIKE '%BOAM%';
UPDATE public.investment_offers SET price_per_share = 4790, minimum_investment = 4790 WHERE title ILIKE '%BOAN%';
UPDATE public.investment_offers SET price_per_share = 7300, minimum_investment = 7300 WHERE title ILIKE '%BOAS%';
UPDATE public.investment_offers SET price_per_share = 6350, minimum_investment = 6350 WHERE title ILIKE '%BICB%';
UPDATE public.investment_offers SET price_per_share = 1755, minimum_investment = 1755 WHERE title ILIKE '%BNBC%';
UPDATE public.investment_offers SET price_per_share = 28800, minimum_investment = 28800 WHERE title ILIKE '%BICC%' OR title ILIKE '%BICI%';
UPDATE public.investment_offers SET price_per_share = 29610, minimum_investment = 29610 WHERE title ILIKE '%CBIBF%';
UPDATE public.investment_offers SET price_per_share = 1575, minimum_investment = 1575 WHERE title ILIKE '%CFAC%';
UPDATE public.investment_offers SET price_per_share = 3980, minimum_investment = 3980 WHERE title ILIKE '%CIEC%';
UPDATE public.investment_offers SET price_per_share = 7000, minimum_investment = 7000 WHERE title ILIKE '%ECOC%' AND title NOT ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 64, minimum_investment = 3000 WHERE title ILIKE '%ETIT%';
UPDATE public.investment_offers SET price_per_share = 3200, minimum_investment = 3200 WHERE title ILIKE '%FTSC%';
UPDATE public.investment_offers SET price_per_share = 2000, minimum_investment = 2000 WHERE title ILIKE '%NEIC%';
UPDATE public.investment_offers SET price_per_share = 8500, minimum_investment = 8500 WHERE title ILIKE '%NSBC%';
UPDATE public.investment_offers SET price_per_share = 2450, minimum_investment = 2450 WHERE title ILIKE '%ONTBF%';
UPDATE public.investment_offers SET price_per_share = 11500, minimum_investment = 11500 WHERE title ILIKE '%ORAC%';
UPDATE public.investment_offers SET price_per_share = 9000, minimum_investment = 9000 WHERE title ILIKE '%ORGT%';
UPDATE public.investment_offers SET price_per_share = 10000, minimum_investment = 10000 WHERE title ILIKE '%PALC%';
UPDATE public.investment_offers SET price_per_share = 2350, minimum_investment = 2350 WHERE title ILIKE '%PRSC%';
UPDATE public.investment_offers SET price_per_share = 4200, minimum_investment = 4200 WHERE title ILIKE '%SAFC%';
UPDATE public.investment_offers SET price_per_share = 8400, minimum_investment = 8400 WHERE title ILIKE '%SDCC%';
UPDATE public.investment_offers SET price_per_share = 1500, minimum_investment = 1500 WHERE title ILIKE '%SEMC%';
UPDATE public.investment_offers SET price_per_share = 16500, minimum_investment = 16500 WHERE title ILIKE '%SGBC%';
UPDATE public.investment_offers SET price_per_share = 1210, minimum_investment = 1210 WHERE title ILIKE '%SHEC%';
UPDATE public.investment_offers SET price_per_share = 9900, minimum_investment = 9900 WHERE title ILIKE '%SIBC%';
UPDATE public.investment_offers SET price_per_share = 7000, minimum_investment = 7000 WHERE title ILIKE '%SICC%';
UPDATE public.investment_offers SET price_per_share = 7550, minimum_investment = 7550 WHERE title ILIKE '%SPHC%';
UPDATE public.investment_offers SET price_per_share = 5500, minimum_investment = 5500 WHERE title ILIKE '%SLBC%';
UPDATE public.investment_offers SET price_per_share = 7000, minimum_investment = 7000 WHERE title ILIKE '%SMBC%';
UPDATE public.investment_offers SET price_per_share = 16000, minimum_investment = 16000 WHERE title ILIKE '%SNTS%';
UPDATE public.investment_offers SET price_per_share = 7000, minimum_investment = 7000 WHERE title ILIKE '%SOGC%';
UPDATE public.investment_offers SET price_per_share = 4000, minimum_investment = 4000 WHERE title ILIKE '%STAC%';
UPDATE public.investment_offers SET price_per_share = 3100, minimum_investment = 3100 WHERE title ILIKE '%STBC%';
UPDATE public.investment_offers SET price_per_share = 50500, minimum_investment = 50500 WHERE title ILIKE '%UNLC%';
UPDATE public.investment_offers SET price_per_share = 1340, minimum_investment = 1340 WHERE title ILIKE '%UNXC%';
UPDATE public.investment_offers SET price_per_share = 2800, minimum_investment = 2800 WHERE title ILIKE '%TTLC%';
UPDATE public.investment_offers SET price_per_share = 1550, minimum_investment = 1550 WHERE title ILIKE '%TTLS%';
UPDATE public.investment_offers SET price_per_share = 315000, minimum_investment = 315000 WHERE title ILIKE '%SIVC%';
UPDATE public.investment_offers SET price_per_share = 3150, minimum_investment = 3150 WHERE title ILIKE '%ABJC%';
UPDATE public.investment_offers SET price_per_share = 8500, minimum_investment = 8500 WHERE title ILIKE '%NTLC%';
UPDATE public.investment_offers SET price_per_share = 15000, minimum_investment = 15000 WHERE title ILIKE '%SCRC%';
UPDATE public.investment_offers SET price_per_share = 7000, minimum_investment = 7000 WHERE title ILIKE '%CABC%';
UPDATE public.investment_offers SET price_per_share = 6750, minimum_investment = 6750 WHERE title ILIKE '%Bridge Bank%';
