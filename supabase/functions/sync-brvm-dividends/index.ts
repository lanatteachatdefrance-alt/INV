import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =============================================================
// CONFIGURATION
// =============================================================

const BRVM_DIVIDENDS_URL =
  "https://www.brvm.org/fr/taxonomy/term/118";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

// =============================================================
// TYPES
// =============================================================

type BrvmDividend = {
  emitter: string;
  dividendPerShare: number;
  exDate: string;
  paymentDate: string;
};

type InvestmentOffer = {
  id: string;
  symbol: string | null;
  company_name: string | null;
  title: string | null;
};

// =============================================================
// NORMALISATION
// =============================================================

function normalizeText(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(value: string): string {
  return normalizeText(value)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(
      /\b(CI|COTE D['’]IVOIRE|COTEIVOIRE|S\.?A\.?|SA|SENEGAL|BURKINA FASO|BENIN|TOGO|NIGER|MALI|GUINEE BISSAU)\b/g,
      " "
    )
    .replace(/[^A-Z0-9]/g, "")
    .trim();
}

// =============================================================
// NOMBRES
// =============================================================

function parseNumber(value: string): number | null {
  let cleaned = normalizeText(value)
    .replace(/\u00a0/g, " ")
    .replace(/FCFA/gi, "")
    .replace(/F CFA/gi, "")
    .replace(/F\s*CFA/gi, "")
    .replace(/\s/g, "");

  if (!cleaned) {
    return null;
  }

  /*
   * Cas possibles :
   *
   * 158,827
   * 158.827
   * 1.234,56
   * 1 234,56
   */

  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned
      .replace(/\./g, "")
      .replace(",", ".");
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }

  const number = Number(cleaned);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}

// =============================================================
// DATES FRANÇAISES
// =============================================================

function parseFrenchDate(value: string): string | null {
  const cleaned = normalizeText(value)
    .toLowerCase()
    .replace(/,/g, "");

  const months: Record<string, string> = {
    janvier: "01",
    février: "02",
    fevrier: "02",
    mars: "03",
    avril: "04",
    mai: "05",
    juin: "06",
    juillet: "07",
    août: "08",
    aout: "08",
    septembre: "09",
    octobre: "10",
    novembre: "11",
    décembre: "12",
    decembre: "12",
  };

  const match = cleaned.match(
    /(\d{1,2})\s+([a-zéûàâäèêëîïôöùûüç]+)\s+(\d{4})/
  );

  if (!match) {
    return null;
  }

  const day = match[1].padStart(2, "0");
  const month = months[match[2]];

  if (!month) {
    return null;
  }

  return `${match[3]}-${month}-${day}`;
}

// =============================================================
// EXTRACTION DES TABLEAUX HTML
// =============================================================

function extractTableRows(html: string): string[][] {
  const tables =
    html.match(/<table[\s\S]*?<\/table>/gi) ?? [];

  const result: string[][] = [];

  for (const table of tables) {
    const rows =
      table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

    for (const row of rows) {
      const cells =
        row.match(
          /<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi
        ) ?? [];

      if (!cells.length) {
        continue;
      }

      const values = cells.map((cell) =>
        normalizeText(
          cell
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ")
        )
      );

      result.push(values);
    }
  }

  return result;
}

// =============================================================
// PARSING DES DIVIDENDES BRVM
// =============================================================

function parseBrvmDividends(
  html: string
): BrvmDividend[] {
  const rows = extractTableRows(html);

  const dividends: BrvmDividend[] = [];

  for (const row of rows) {
    /*
     * Structure actuellement observée sur la BRVM :
     *
     * 0 = Emetteur
     * 1 = Obligation
     * 2 = Action
     * 3 = Exercice comptable
     * 4 = Date de paiement
     * 5 = Date ex-dividende
     * 6 = Montant du dividende net
     * 7 = Avis
     */

    if (row.length < 7) {
      continue;
    }

    const emitter = normalizeText(row[0]);

    if (!emitter) {
      continue;
    }

    if (
      emitter.toLowerCase() === "emetteur" ||
      emitter.toLowerCase() === "émetteur"
    ) {
      continue;
    }

    const paymentDate =
      parseFrenchDate(row[4]);

    const exDate =
      parseFrenchDate(row[5]);

    const dividendPerShare =
      parseNumber(row[6]);

    if (
      !paymentDate ||
      !exDate ||
      dividendPerShare === null
    ) {
      continue;
    }

    dividends.push({
      emitter,
      dividendPerShare,
      exDate,
      paymentDate,
    });
  }

  // ===========================================================
  // SUPPRESSION DES DOUBLONS
  // ===========================================================

  const unique =
    new Map<string, BrvmDividend>();

  for (const dividend of dividends) {
    const key = [
      normalizeName(dividend.emitter),
      dividend.dividendPerShare,
      dividend.exDate,
      dividend.paymentDate,
    ].join("|");

    unique.set(key, dividend);
  }

  return Array.from(unique.values());
}

// =============================================================
// CORRESPONDANCE SOCIÉTÉ → INVESTMENT OFFER
// =============================================================

function findOffer(
  emitter: string,
  offers: InvestmentOffer[]
): InvestmentOffer | null {
  const target = normalizeName(emitter);

  if (!target) {
    return null;
  }

  // ===========================================================
  // CORRESPONDANCES EXPLICITES BRVM
  // ===========================================================

  const explicitSymbols: Record<string, string> = {
    TOTAL: "TTLC",
    TOTALCI: "TTLC",
    TOTALENERGIES: "TTLC",
    TOTALENERGIESCI: "TTLC",
    TOTALCOTEIVOIRE: "TTLC",
  };

  const expectedSymbol =
    explicitSymbols[target];

  if (expectedSymbol) {
    const explicitOffer =
      offers.find(
        (offer) =>
          normalizeText(
            offer.symbol ?? ""
          ).toUpperCase() === expectedSymbol
      );

    if (explicitOffer) {
      return explicitOffer;
    }
  }

  // ===========================================================
  // 1. CORRESPONDANCE EXACTE COMPANY_NAME
  // ===========================================================

  for (const offer of offers) {
    if (
      normalizeName(
        offer.company_name ?? ""
      ) === target
    ) {
      return offer;
    }
  }

  // ===========================================================
  // 2. CORRESPONDANCE EXACTE TITLE
  // ===========================================================

  for (const offer of offers) {
    if (
      normalizeName(
        offer.title ?? ""
      ) === target
    ) {
      return offer;
    }
  }

  // ===========================================================
  // 3. CORRESPONDANCE PAR SYMBOL
  // ===========================================================

  for (const offer of offers) {
    if (
      normalizeName(
        offer.symbol ?? ""
      ) === target
    ) {
      return offer;
    }
  }

  // ===========================================================
  // 4. CORRESPONDANCE PAR INCLUSION
  // ===========================================================

  for (const offer of offers) {
    const company =
      normalizeName(
        offer.company_name ?? ""
      );

    const title =
      normalizeName(
        offer.title ?? ""
      );

    const symbol =
      normalizeName(
        offer.symbol ?? ""
      );

    if (
      (company &&
        (company.includes(target) ||
          target.includes(company))) ||
      (title &&
        (title.includes(target) ||
          target.includes(title))) ||
      (symbol &&
        (symbol.includes(target) ||
          target.includes(symbol)))
    ) {
      return offer;
    }
  }

  return null;
}

// =============================================================
// FONCTION EDGE
// =============================================================

Deno.serve(async (req) => {
  // ===========================================================
  // CORS
  // ===========================================================

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  // ===========================================================
  // POST UNIQUEMENT
  // ===========================================================

  if (req.method !== "POST") {
    return Response.json(
      {
        success: false,
        error: "Méthode non autorisée.",
      },
      {
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    // =========================================================
    // SUPABASE
    // =========================================================

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      throw new Error(
        "Variables Supabase manquantes."
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

    // =========================================================
    // RÉCUPÉRATION BRVM
    // =========================================================

    const response =
      await fetch(
        BRVM_DIVIDENDS_URL,
        {
          method: "GET",

          headers: {
            "User-Agent":
              "InvestirEnBourse-Dividends/1.0",

            Accept:
              "text/html,application/xhtml+xml",

            "Accept-Language":
              "fr-FR,fr;q=0.9",
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        `BRVM HTTP ${response.status}`
      );
    }

    const html =
      await response.text();

    if (!html || html.length < 1000) {
      throw new Error(
        "La page BRVM retournée est vide ou invalide."
      );
    }

    // =========================================================
    // PARSING
    // =========================================================

    const brvmDividends =
      parseBrvmDividends(html);

    if (
      brvmDividends.length === 0
    ) {
      throw new Error(
        "Aucun dividende exploitable trouvé sur la BRVM."
      );
    }

    // =========================================================
    // OFFRES DE L'APPLICATION
    // =========================================================

    const {
      data: offers,
      error: offersError,
    } = await supabase
      .from("investment_offers")
      .select(
        "id, symbol, company_name, title"
      )
      .eq(
        "is_active",
        true
      );

    if (offersError) {
      throw new Error(
        `Erreur investment_offers : ${offersError.message}`
      );
    }

    const investmentOffers =
      (offers ??
        []) as InvestmentOffer[];

    // =========================================================
    // COMPTEURS
    // =========================================================

    let inserted = 0;
    let updated = 0;
    let unchanged = 0;
    let unmatched = 0;
    let protectedPaid = 0;

    const results: unknown[] = [];

    // =========================================================
    // TRAITEMENT DE CHAQUE DIVIDENDE
    // =========================================================

    for (
      const dividend
      of brvmDividends
    ) {
      // =======================================================
      // RECHERCHE DE L'OFFRE
      // =======================================================

      const offer =
        findOffer(
          dividend.emitter,
          investmentOffers
        );

      if (!offer) {
        unmatched++;

        results.push({
          action: "unmatched",
          emitter:
            dividend.emitter,
          dividendPerShare:
            dividend.dividendPerShare,
          exDate:
            dividend.exDate,
          paymentDate:
            dividend.paymentDate,
        });

        continue;
      }

      // =======================================================
      // SYMBOL
      // =======================================================

      const symbol =
        offer.symbol?.trim();

      if (!symbol) {
        unmatched++;

        results.push({
          action: "missing_symbol",
          emitter:
            dividend.emitter,
          offerId:
            offer.id,
        });

        continue;
      }

      // =======================================================
      // NOM SOCIÉTÉ
      // =======================================================

      const companyName =
        offer.company_name?.trim() ||
        offer.title?.trim() ||
        dividend.emitter;

      // =======================================================
      // RECHERCHE DU DIVIDENDE EXISTANT
      // =======================================================

      const {
        data: existing,
        error: existingError,
      } = await supabase
        .from("dividends")
        .select(
          `
          id,
          offer_id,
          symbol,
          company_name,
          dividend_per_share,
          payment_date,
          ex_date,
          status
          `
        )
        .eq(
          "symbol",
          symbol
        )
        .eq(
          "ex_date",
          dividend.exDate
        )
        .eq(
          "payment_date",
          dividend.paymentDate
        )
        .limit(1)
        .maybeSingle();

      if (existingError) {
        throw new Error(
          `Erreur lecture dividende ${symbol} : ${existingError.message}`
        );
      }

      // =======================================================
      // NOUVEAU DIVIDENDE
      // =======================================================

      if (!existing) {
        const {
          data: created,
          error: insertError,
        } = await supabase
          .from("dividends")
          .insert({
            offer_id:
              offer.id,

            symbol,

            company_name:
              companyName,

            dividend_per_share:
              dividend.dividendPerShare,

            ex_date:
              dividend.exDate,

            payment_date:
              dividend.paymentDate,

            status:
              "pending",
          })
          .select(
            `
            id,
            offer_id,
            symbol,
            company_name,
            dividend_per_share,
            ex_date,
            payment_date,
            status
            `
          )
          .single();

        if (insertError) {
          throw new Error(
            `Erreur insertion ${symbol} : ${insertError.message}`
          );
        }

        inserted++;

        results.push({
          action: "inserted",

          emitter:
            dividend.emitter,

          symbol,

          dividend:
            created,
        });

        continue;
      }

      // =======================================================
      // DIVIDENDE EXISTANT
      // =======================================================

      const oldAmount =
        Number(
          existing.dividend_per_share
        );

      const changed =
        oldAmount !==
          dividend.dividendPerShare ||
        existing.ex_date !==
          dividend.exDate ||
        existing.payment_date !==
          dividend.paymentDate ||
        existing.offer_id !==
          offer.id ||
        existing.company_name !==
          companyName;

      // =======================================================
      // AUCUN CHANGEMENT
      // =======================================================

      if (!changed) {
        unchanged++;

        results.push({
          action: "unchanged",

          emitter:
            dividend.emitter,

          symbol,

          dividend_id:
            existing.id,
        });

        continue;
      }

      // =======================================================
      // PROTECTION DES DIVIDENDES PAYÉS
      // =======================================================

      if (
        existing.status ===
        "paid"
      ) {
        protectedPaid++;

        results.push({
          action:
            "protected_paid_dividend",

          emitter:
            dividend.emitter,

          symbol,

          dividend_id:
            existing.id,

          message:
            "Dividende déjà payé : aucune modification effectuée.",
        });

        continue;
      }

      // =======================================================
      // MISE À JOUR
      // =======================================================

      const {
        data: updatedDividend,
        error: updateError,
      } = await supabase
        .from("dividends")
        .update({
          offer_id:
            offer.id,

          symbol,

          company_name:
            companyName,

          dividend_per_share:
            dividend.dividendPerShare,

          ex_date:
            dividend.exDate,

          payment_date:
            dividend.paymentDate,

          status:
            "pending",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          existing.id
        )
        .select(
          `
          id,
          offer_id,
          symbol,
          company_name,
          dividend_per_share,
          ex_date,
          payment_date,
          status
          `
        )
        .single();

      if (updateError) {
        throw new Error(
          `Erreur mise à jour ${symbol} : ${updateError.message}`
        );
      }

      updated++;

      results.push({
        action: "updated",

        emitter:
          dividend.emitter,

        symbol,

        dividend:
          updatedDividend,
      });
    }

    // =========================================================
    // RÉSULTAT FINAL
    // =========================================================

    return Response.json(
      {
        success: true,

        source:
          "BRVM officielle",

        sourceUrl:
          BRVM_DIVIDENDS_URL,

        fetched:
          brvmDividends.length,

        inserted,

        updated,

        unchanged,

        unmatched,

        protectedPaid,

        executedAt:
          new Date().toISOString(),

        results,
      },
      {
        status: 200,

        headers: {
          ...corsHeaders,

          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "BRVM DIVIDENDS ERROR:",
      error
    );

    return Response.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue.",
      },
      {
        status: 500,

        headers: {
          ...corsHeaders,

          "Content-Type":
            "application/json",
        },
      }
    );
  }
});