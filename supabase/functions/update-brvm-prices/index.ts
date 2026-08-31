import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BRVM_URL =
  "https://www.brvm.org/fr/cours-actions/0go/1000";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

type BrvmPrice = {
  symbol: string;
  price: number;
};

function normalizeText(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePrice(value: string): number | null {
  const cleaned = normalizeText(value)
    .replace(/\u00a0/g, " ")
    .replace(/\s/g, "")
    .replace(",", ".");

  const number = Number(cleaned);

  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return number;
}

function parseBrvmPrices(html: string): BrvmPrice[] {
  const prices: BrvmPrice[] = [];

  const tableMatch =
    html.match(/<table[\s\S]*?<\/table>/gi);

  if (!tableMatch) {
    throw new Error(
      "Impossible de trouver le tableau des cotations BRVM."
    );
  }

  for (const table of tableMatch) {
    const rows =
      table.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

    for (const row of rows) {
      const cells =
        row.match(
          /<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi
        ) ?? [];

      if (cells.length < 7) {
        continue;
      }

      const values = cells.map((cell) =>
        normalizeText(
          cell.replace(/<[^>]+>/g, " ")
        )
      );

      const symbol =
        values[0]?.toUpperCase().trim();

      /*
       * 6e colonne = cours de clôture
       */
      const closingPrice =
        parsePrice(values[5]);

      if (
        !symbol ||
        !/^[A-Z0-9]{3,10}$/.test(symbol) ||
        closingPrice === null
      ) {
        continue;
      }

      prices.push({
        symbol,
        price: closingPrice,
      });
    }
  }

  const unique =
    new Map<string, BrvmPrice>();

  for (const item of prices) {
    unique.set(item.symbol, item);
  }

  return Array.from(unique.values());
}

Deno.serve(async (req) => {
  /*
   * =====================================================
   * CORS
   * =====================================================
   */

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  /*
   * =====================================================
   * POST UNIQUEMENT
   * =====================================================
   */

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
    /*
     * ===================================================
     * SUPABASE
     * ===================================================
     */

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      );

    if (!supabaseUrl || !serviceRoleKey) {
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

    /*
     * ===================================================
     * RÉCUPÉRATION BRVM
     * ===================================================
     */

    const response =
      await fetch(BRVM_URL, {
        method: "GET",
        headers: {
          "User-Agent":
            "InvestirEnBourse-PriceUpdater/1.0",
          "Accept":
            "text/html,application/xhtml+xml",
        },
      });

    if (!response.ok) {
      throw new Error(
        `La BRVM a répondu avec le statut ${response.status}.`
      );
    }

    const html =
      await response.text();

    /*
     * ===================================================
     * PARSING
     * ===================================================
     */

    const brvmPrices =
      parseBrvmPrices(html);

    if (brvmPrices.length === 0) {
      throw new Error(
        "Aucun cours BRVM n'a été récupéré."
      );
    }

    /*
     * ===================================================
     * RÉCUPÉRATION DES OFFRES
     * ===================================================
     */

    const {
      data: offers,
      error: offersError,
    } = await supabase
      .from("investment_offers")
      .select(
        "id, symbol, price_per_share"
      )
      .eq("is_active", true);

    if (offersError) {
      throw new Error(
        `Erreur récupération des offres : ${offersError.message}`
      );
    }

    /*
     * ===================================================
     * INDEX DES PRIX BRVM
     * ===================================================
     */

    const priceMap =
      new Map<string, number>();

    for (const item of brvmPrices) {
      priceMap.set(
        item.symbol.toUpperCase(),
        item.price
      );
    }

    /*
     * ===================================================
     * MISE À JOUR
     * ===================================================
     */

    let updated = 0;
    let unchanged = 0;
    let skipped = 0;

    const updates: Array<{
      id: string;
      symbol: string;
      oldPrice: number;
      newPrice: number;
      variation: number;
      variationPercent: number;
    }> = [];

    const updateTime =
      new Date().toISOString();

    for (const offer of offers ?? []) {
      const symbol =
        offer.symbol
          ?.toUpperCase()
          .trim();

      if (!symbol) {
        skipped++;
        continue;
      }

      const newPrice =
        priceMap.get(symbol);

      /*
       * Symbole absent de la BRVM
       */
      if (newPrice === undefined) {
        skipped++;
        continue;
      }

      const oldPrice =
        Number(
          offer.price_per_share ?? 0
        );

      /*
       * Calcul de la variation
       */

      const variation =
        newPrice - oldPrice;

      const variationPercent =
        oldPrice > 0
          ? (variation / oldPrice) * 100
          : 0;

      /*
       * Vérification si le cours
       * est réellement différent.
       */

      if (oldPrice === newPrice) {
        unchanged++;
      } else {
        updated++;
      }

      /*
       * =================================================
       * MISE À JOUR COMPLÈTE
       * =================================================
       */

      const {
        error: updateError,
      } = await supabase
        .from("investment_offers")
        .update({
          price_per_share: newPrice,

          /*
           * Ancien cours avant cette mise à jour
           */
          previous_price: oldPrice,

          /*
           * Variation en valeur
           */
          variation: variation,

          /*
           * Variation en pourcentage
           */
          variation_percent:
            variationPercent,

          /*
           * Date/heure de la dernière
           * récupération BRVM
           */
          last_price_update:
            updateTime,

          /*
           * Source officielle
           */
          price_source:
            "BRVM officielle",
        })
        .eq("id", offer.id);

      if (updateError) {
        throw new Error(
          `Erreur mise à jour ${symbol} : ${updateError.message}`
        );
      }

      /*
       * Ajouter au rapport
       */

      updates.push({
        id: offer.id,
        symbol,
        oldPrice,
        newPrice,
        variation,
        variationPercent,
      });
    }

    /*
     * ===================================================
     * RÉSULTAT
     * ===================================================
     */

    return Response.json(
      {
        success: true,

        source:
          "BRVM officielle",

        sourceUrl:
          BRVM_URL,

        updated,

        unchanged,

        skipped,

        totalBrvmPrices:
          brvmPrices.length,

        executedAt:
          updateTime,

        updates,
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
      "BRVM PRICE UPDATE ERROR:",
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