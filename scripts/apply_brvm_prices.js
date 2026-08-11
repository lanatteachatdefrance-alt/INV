const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://jfeefinununbzpykwrzp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZWVmaW51bnVuYnpweWt3cnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDE2NTQsImV4cCI6MjA5MjA3NzY1NH0.6LpouUWAYtvnsCicuVVx7UgaZOEDPVw4cVG-IGCADBM';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const offers = [
  { title: 'ABJC - Air Liquide CI', description: 'Air Liquide Côte d\'Ivoire. Secteur chimie/gaz industriel.', roi: 5.2, price_per_share: 3150, minimum_investment: 3150 },
  { title: 'BICB - BIIC Bénin', description: 'Banque Ivoirienne d\'Investissement et de Crédit Bénin.', roi: 6.8, price_per_share: 6350, minimum_investment: 6350 },
  { title: 'BICC - BICI Côte d\'Ivoire', description: 'Banque Ivoirienne de Crédit et d\'Investissement.', roi: 8.1, price_per_share: 28800, minimum_investment: 28800 },
  { title: 'BNBC - Bernabé Côte d\'Ivoire', description: 'Bernabé Côte d\'Ivoire. Secteur de la distribution.', roi: 4.5, price_per_share: 1755, minimum_investment: 1755 },
  { title: 'BOAB - Bank of Africa Bénin', description: 'Groupe Bank of Africa - Filiale Bénin.', roi: 8.4, price_per_share: 8750, minimum_investment: 8750 },
  { title: 'BOABF - Bank of Africa Burkina Faso', description: 'Groupe Bank of Africa - Filiale Burkina Faso.', roi: 9.2, price_per_share: 6050, minimum_investment: 6050 },
  { title: 'BOAC - Bank of Africa Côte d\'Ivoire', description: 'Groupe Bank of Africa - Filiale Côte d\'Ivoire.', roi: 7.8, price_per_share: 9500, minimum_investment: 9500 },
  { title: 'BOAM - Bank of Africa Mali', description: 'Groupe Bank of Africa - Filiale Mali.', roi: 8.8, price_per_share: 5450, minimum_investment: 5450 },
  { title: 'BOAN - Bank of Africa Niger', description: 'Groupe Bank of Africa - Filiale Niger.', roi: 9.5, price_per_share: 4790, minimum_investment: 4790 },
  { title: 'BOAS - Bank of Africa Sénégal', description: 'Groupe Bank of Africa - Filiale Sénégal.', roi: 7.9, price_per_share: 7300, minimum_investment: 7300 },
  { title: 'CABC - Sicable Côte d\'Ivoire', description: 'Sicable Côte d\'Ivoire. Secteur industriel / Câbles.', roi: 4.8, price_per_share: 7000, minimum_investment: 7000 },
  { title: 'CBIBF - Coris Bank Burkina Faso', description: 'Coris Bank International Burkina Faso. Banque de croissance.', roi: 9.0, price_per_share: 29610, minimum_investment: 29610 },
  { title: 'CFAC - CFAO Motors Côte d\'Ivoire', description: 'CFAO Motors Côte d\'Ivoire. Distribution automobile.', roi: 5.6, price_per_share: 1575, minimum_investment: 1575 },
  { title: 'CIEC - CIE Côte d\'Ivoire', description: 'Compagnie Ivoirienne d\'Électricité. Monopole eau/électricité.', roi: 8.8, price_per_share: 3980, minimum_investment: 3980 },
  { title: 'ECOC - Ecobank Côte d\'Ivoire', description: 'Ecobank Côte d\'Ivoire. Secteur bancaire.', roi: 7.9, price_per_share: 7000, minimum_investment: 7000 },
  { title: 'ETIT - Ecobank Transnational Inc.', description: 'Ecobank Transnational Inc. Holding bancaire panafricain.', roi: 5.5, price_per_share: 64, minimum_investment: 3000 },
  { title: 'FTSC - Filtisac', description: 'Filtisac. Leader de l\'emballage en Afrique de l\'Ouest.', roi: 6.1, price_per_share: 3200, minimum_investment: 3200 },
  { title: 'LNBB - Loterie Nationale du Bénin', description: 'Loterie Nationale du Bénin.', roi: 7.2, price_per_share: 4350, minimum_investment: 4350 },
  { title: 'NEIC - Nestlé Côte d\'Ivoire', description: 'Nestlé Côte d\'Ivoire. Secteur agroalimentaire.', roi: 5.4, price_per_share: 2000, minimum_investment: 2000 },
  { title: 'NSBC - NSIA Banque Côte d\'Ivoire', description: 'NSIA Banque Côte d\'Ivoire. Secteur bancaire.', roi: 8.1, price_per_share: 8500, minimum_investment: 8500 },
  { title: 'NTLC - Nestlé Mali', description: 'Nestlé Mali. Secteur agroalimentaire - Mali.', roi: 5.8, price_per_share: 8500, minimum_investment: 8500 },
  { title: 'ONTBF - ONATEL Burkina Faso', description: 'ONATEL Burkina Faso. Secteur télécom.', roi: 11.5, price_per_share: 2450, minimum_investment: 2450 },
  { title: 'ORAC - Orange Côte d\'Ivoire', description: 'Orange Côte d\'Ivoire. Secteur télécoms.', roi: 7.2, price_per_share: 11500, minimum_investment: 11500 },
  { title: 'ORGT - Oragroup', description: 'Oragroup. Groupe de télécommunications panafricain.', roi: 6.5, price_per_share: 9000, minimum_investment: 9000 },
  { title: 'PALC - Palm Côte d\'Ivoire', description: 'Palm Côte d\'Ivoire. Agro-industrie huile de palme.', roi: 12.0, price_per_share: 10000, minimum_investment: 10000 },
  { title: 'PRSC - Tractafric Motors CI', description: 'Tractafric Motors Côte d\'Ivoire. Distribution véhicules.', roi: 5.6, price_per_share: 2350, minimum_investment: 2350 },
  { title: 'SAFC - SAFCA', description: 'SAFCA. Secteur agricole.', roi: 6.3, price_per_share: 4200, minimum_investment: 4200 },
  { title: 'SCRC - SUCRIVOIRE', description: 'SUCRIVOIRE. Production et commercialisation du sucre.', roi: 3.5, price_per_share: 15000, minimum_investment: 15000 },
  { title: 'SDCC - SODECI', description: 'SODECI. Distribution d\'eau en Côte d\'Ivoire.', roi: 7.7, price_per_share: 8400, minimum_investment: 8400 },
  { title: 'SDSC - Africa Global Logistics CI', description: 'Africa Global Logistics Côte d\'Ivoire. Logistique.', roi: 6.2, price_per_share: 2210, minimum_investment: 2210 },
  { title: 'SEMC - Crown Siem CI', description: 'Crown Siem Côte d\'Ivoire. Secteur industriel.', roi: 4.9, price_per_share: 1500, minimum_investment: 1500 },
  { title: 'SGBC - Société Générale Côte d\'Ivoire', description: 'Société Générale Côte d\'Ivoire. Secteur bancaire majeur.', roi: 9.1, price_per_share: 16500, minimum_investment: 16500 },
  { title: 'SHEC - Vivo Energy Côte d\'Ivoire', description: 'Vivo Energy Côte d\'Ivoire. Distribution pétrolière.', roi: 6.4, price_per_share: 1210, minimum_investment: 1210 },
  { title: 'SIBC - Société Ivoirienne de Banque', description: 'Société Ivoirienne de Banque. Banque historique.', roi: 7.5, price_per_share: 9900, minimum_investment: 9900 },
  { title: 'SICC - SICOR', description: 'SICOR. Secteur industriel.', roi: 4.8, price_per_share: 7000, minimum_investment: 7000 },
  { title: 'SIVC - Erium Côte d\'Ivoire', description: 'Erium Côte d\'Ivoire. Secteur énergies.', roi: 5.7, price_per_share: 315000, minimum_investment: 315000 },
  { title: 'SLBC - Solibra', description: 'Solibra. Leader de la brasserie en Côte d\'Ivoire.', roi: 4.5, price_per_share: 40000, minimum_investment: 40000 },
  { title: 'SMBC - SMB Côte d\'Ivoire', description: 'SMB Côte d\'Ivoire. Action industrielle.', roi: 7.4, price_per_share: 7000, minimum_investment: 7000 },
  { title: 'SNTS - Sonatel', description: 'Sonatel Sénégal. Plus grande capitalisation du marché BRVM.', roi: 8.5, price_per_share: 16000, minimum_investment: 16000 },
  { title: 'SOGC - SOGB', description: 'SOGB. Agro-industrie (Caoutchouc et Palme).', roi: 8.2, price_per_share: 7000, minimum_investment: 7000 },
  { title: 'SPHC - SAPH', description: 'SAPH. Agriculture (Caoutchouc) leader du marché.', roi: 6.8, price_per_share: 7550, minimum_investment: 7550 },
  { title: 'STAC - Setao', description: 'Setao. Secteur agro-industriel.', roi: 5.9, price_per_share: 4000, minimum_investment: 4000 },
  { title: 'STBC - Servair Abidjan', description: 'Servair Abidjan. Services aériens et restauration.', roi: 9.8, price_per_share: 3100, minimum_investment: 3100 },
  { title: 'TTLC - TotalEnergies CI', description: 'TotalEnergies Côte d\'Ivoire. Distribution pétrolière.', roi: 6.2, price_per_share: 2800, minimum_investment: 2800 },
  { title: 'TTLS - TotalEnergies Sénégal', description: 'TotalEnergies Sénégal. Distribution pétrolière.', roi: 6.8, price_per_share: 1550, minimum_investment: 1550 },
  { title: 'UNLC - Unilever Côte d\'Ivoire', description: 'Unilever Côte d\'Ivoire. Distribution et biens de grande consommation.', roi: 5.1, price_per_share: 50500, minimum_investment: 50500 },
  { title: 'UNXC - Uniwax Côte d\'Ivoire', description: 'Uniwax Côte d\'Ivoire. Secteur textile.', roi: 5.3, price_per_share: 1340, minimum_investment: 1340 },
];

async function ensureOffer(offer) {
  const { data, error } = await supabase
    .from('investment_offers')
    .select('id,title,price_per_share,minimum_investment,roi_percentage,is_active')
    .eq('title', offer.title)
    .maybeSingle();

  if (error) throw error;

  const payload = {
    title: offer.title,
    description: offer.description,
    type: 'Action',
    roi_percentage: offer.roi,
    price_per_share: offer.price_per_share,
    minimum_investment: offer.minimum_investment,
    is_active: true,
  };

  if (data) {
    const { error: updateError } = await supabase
      .from('investment_offers')
      .update(payload)
      .eq('id', data.id);
    if (updateError) throw updateError;
    return { action: 'updated', id: data.id, title: offer.title };
  }

  const { data: inserted, error: insertError } = await supabase
    .from('investment_offers')
    .insert(payload)
    .select('id,title')
    .single();
  if (insertError) throw insertError;
  return { action: 'inserted', id: inserted.id, title: offer.title };
}

(async () => {
  try {
    const results = [];
    for (const offer of offers) {
      results.push(await ensureOffer(offer));
    }

    const { data, error } = await supabase
      .from('investment_offers')
      .select('title,price_per_share,minimum_investment,roi_percentage,is_active')
      .order('title', { ascending: true });

    if (error) throw error;

    const sample = data.slice(0, 12).map((row) => ({ title: row.title, price_per_share: row.price_per_share, minimum_investment: row.minimum_investment }));

    console.log(JSON.stringify({
      processed: results.length,
      insertedOrUpdated: results.filter((r) => r.action).length,
      sample,
      totalRows: data.length,
    }, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, details: err }, null, 2));
    process.exit(1);
  }
})();
