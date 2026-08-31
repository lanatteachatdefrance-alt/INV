import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BRVM_DIVIDENDS_URL =
  "https://www.brvm.org/fr/taxonomy/term/118";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

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

function normalizeText(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
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

function parseNumber(value: string): number | null {
  let cleaned = normalizeText(value)
    .replace(/\u00a0/g, " ")
    .replace(/FCFA/gi, "")
    .replace(/F CFA/gi, "")
    .replace(/F\s*CFA/gi, "")
    .replace(/\s/g, "");

  /*
   * BRVM peut afficher :
   *
   * 2 606
   * 594,528
   * 164,1709
   *
   * On traite la virgule comme séparateur décimal
   * lorsque nécessaire.
   */

  if (
    cleaned.includes(",") &&
    cleaned.includes(".")
  ) {
    /*
     * Exemple éventuel :
     * 1.234,56
     */
    cleaned = cleaned
      .replace(/\./g, "")
      .replace(",", ".");
  } else {
    cleaned = cleaned.replace(",", ".");
  }

  const number = Number(cleaned);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
}

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
    /(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/
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

function extractTableRows(
  html: string
): string[][] {
  const tables =
    html.match(
      /<table[\s\S]*?<\/table>/gi
    ) ?? [];

  const result: string[][] = [];

  for (const table of tables) {
    const rows =
      table.match(
        /<tr[\s\S]*?<\/tr>/gi
      ) ?? [];

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
            .replace(
              /<[^>]+>/g,
              " "
            )
        )
      );

      result.push(values);
    }
  }

  return result;
}

function parseBrvmDividends(
  html: string
): BrvmDividend[] {

  const rows =
    extractTableRows(html);

  const dividends: BrvmDividend[] = [];

  for (const row of rows) {

    /*
     * Structure officielle observée :
     *
     * Emetteur
     * Obligation
     * Action
     * Exercice comptable
     * Date de paiement
     * Date ex-dividende
     * Montant du dividende net
     * Avis
     */

    if (row.length < 7) {
      continue;
    }

    const emitter =
      normalizeText(row[0]);

    const paymentDate =
      parseFrenchDate(row[4]);

    const exDate =
      parseFrenchDate(row[5]);

    const dividendPerShare =
      parseNumber(row[6]);

    if (
      !emitter ||
      !paymentDate ||
      !exDate ||
      dividendPerShare === null
    ) {
      continue;
    }

    /*
     * Évite de récupérer les lignes d'en-tête.
     */

    if (
      emitter.toLowerCase() ===
      "emetteur"
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

  /*
   * Suppression des doublons.
   */

  const unique =
    new Map<string, BrvmDividend>();

  for (const dividend of dividends) {

    const key =
      [
        normalizeName(
          dividend.emitter
        ),
        dividend.dividendPerShare,
        dividend.exDate,
        dividend.paymentDate,
      ].join("|");

    unique.set(key, dividend);
  }

  return Array.from(
    unique.values()
  );
}

function findOffer(
  emitter: string,
  offers: InvestmentOffer[]
): InvestmentOffer | null {

  const target =
    normalizeName(emitter);

  if (!target) {
    return null;
  }

  /*
   * 1. Correspondance exacte avec company_name
   */

  for (const offer of offers) {

    if (
      normalizeName(
        offer.company_name ?? ""
      ) === target
    ) {
      return offer;
    }
  }

  /*
   * 2. Correspondance exacte avec title
   */

  for (const offer of offers) {

    if (
      normalizeName(
        offer.title ?? ""
      ) === target
    ) {
      return offer;
    }
  }

  /*
   * 3. Correspondance par inclusion.
   *
   * Exemple :
   * "CFAO MOTORS"
   * avec
   * "CFAO MOTORS COTE D'IVOIRE"
   */

  for (const offer of offers) {

    const company =
      normalizeName(
        offer.company_name ?? ""
      );

    const title =
      normalizeName(
        offer.title ?? ""
      );

    if (
      (company && (
        company.includes(target) ||
        target.includes(company)
      )) ||
      (title && (
        title.includes(target) ||
        target.includes(title)
      ))
    ) {
      return offer;
    }
  }

  return null;
}

Deno.serve(async (req) => {

  // =====================================================
  // CORS
  // =====================================================

  if (req.method === "OPTIONS") {
    return new Response(
      "ok",
      {
        headers: corsHeaders,
      }
    );
  }

  // =====================================================
  // POST UNIQUEMENT
  // =====================================================

  if (req.method !== "POST") {
    return Response.json(
      {
        success: false,
        error:
          "Méthode non autorisée.",
      },
      {
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {

    // ===================================================
    // SUPABASE
    // ===================================================

    const supabaseUrl =
      Deno.env.get(
        "SUPABASE_URL"
      );

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
            persistSession:
              false,
            autoRefreshToken:
              false,
          },
        }
      );

    // ===================================================
    // RÉCUPÉRATION BRVM
    // ===================================================

    const response =
      await fetch(
        BRVM_DIVIDENDS_URL,
        {
          method: "GET",

          headers: {
            "User-Agent":
              "InvestirEnBourse-Dividends/1.0",

            "Accept":
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

    // ===================================================
    // PARSING
    // ===================================================

    const brvmDividends =
      parseBrvmDividends(html);

    if (
      brvmDividends.length === 0
    ) {
      throw new Error(
        "Aucun dividende exploitable trouvé sur la BRVM."
      );
    }

    // ===================================================
    // OFFRES DE NOTRE APPLICATION
    // ===================================================

    const {
      data: offers,
      error: offersError,
    } = await supabase
      .from(
        "investment_offers"
      )
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
      (offers ?? []) as InvestmentOffer[];

    // ===================================================
    // TRAITEMENT
    // ===================================================

    let inserted = 0;
    let updated = 0;
    let unmatched = 0;
    let unchanged = 0;

    const results: unknown[] = [];

    for (
      const dividend
      of brvmDividends
    ) {

      // -------------------------------------------------
      // CORRESPONDANCE SOCIÉTÉ
      // -------------------------------------------------

      const offer =
        findOffer(
          dividend.emitter,
          investmentOffers
        );

      /*
       * Si nous ne trouvons pas la société
       * dans notre application :
       *
       * ON NE CRÉE PAS DE DIVIDENDE.
       *
       * Cela évite d'associer par erreur un dividende
       * à une mauvaise société.
       */

      if (!offer) {

        unmatched++;

        results.push({
          emitter:
            dividend.emitter,

          status:
            "unmatched",
        });

        continue;
      }

      const symbol =
        offer.symbol?.trim();

      if (!symbol) {

        unmatched++;

        results.push({
          emitter:
            dividend.emitter,

          status:
            "missing_symbol",
        });

        continue;
      }

      const companyName =
        offer.company_name?.trim() ||
        offer.title?.trim() ||
        dividend.emitter;

      // -------------------------------------------------
      // CHERCHE UN DIVIDENDE EXISTANT
      // -------------------------------------------------

      const {
        data: existing,
        error: existingError,
      } = await supabase
        .from(
          "dividends"
        )
        .select(
          "id, dividend_per_share, payment_date, ex_date, status"
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

      // -------------------------------------------------
      // NOUVEAU DIVIDENDE
      // -------------------------------------------------

      if (!existing) {

        const {
          data: created,
          error: insertError,
        } = await supabase
          .from(
            "dividends"
          )
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
            "id, symbol, dividend_per_share, ex_date, payment_date, status"
          )
          .single();

        if (insertError) {
          throw new Error(
            `Erreur insertion ${symbol} : ${insertError.message}`
          );
        }

        inserted++;

        results.push({
          action:
            "inserted",

          emitter:
            dividend.emitter,

          dividend:
            created,
        });

        continue;
      }

      // -------------------------------------------------
      // DIVIDENDE EXISTANT
      // -------------------------------------------------

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
          dividend.paymentDate;

      if (!changed) {

        unchanged++;

        results.push({
          action:
            "unchanged",

          symbol,

          dividend_id:
            existing.id,
        });

        continue;
      }

      /*
       * IMPORTANT :
       *
       * On ne modifie PAS un dividende déjà payé.
       */

      if (
        existing.status ===
        "paid"
      ) {

        results.push({
          action:
            "protected_paid_dividend",

          symbol,

          dividend_id:
            existing.id,
        });

        continue;
      }

      // -------------------------------------------------
      // MISE À JOUR
      // -------------------------------------------------

      const {
        error: updateError,
      } = await supabase
        .from(
          "dividends"
        )
        .update({
          offer_id:
            offer.id,

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
        );

      if (updateError) {
        throw new Error(
          `Erreur mise à jour ${symbol} : ${updateError.message}`
        );
      }

      updated++;

      results.push({
        action:
          "updated",

        symbol,

        dividend_id:
          existing.id,
      });
    }

    // ===================================================
    // RÉSULTAT
    // ===================================================

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