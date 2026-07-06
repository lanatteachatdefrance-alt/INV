import { NextRequest, NextResponse } from 'next/server';

/**
 * API pour mettre à jour les prix des offres en temps réel
 * Fonctionne sans dépendre de la DB (permet de tester sans Supabase)
 * 
 * POST /api/offers/update-price
 * Body: { offerId: string, newPrice: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offerId, newPrice } = body;

    if (!offerId || newPrice === undefined) {
      return NextResponse.json(
        { error: 'Missing offerId or newPrice' },
        { status: 400 }
      );
    }

    if (newPrice < 0) {
      return NextResponse.json(
        { error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    // Retourner la mise à jour confirmée
    return NextResponse.json({
      success: true,
      offerId,
      newPrice,
      updatedAt: new Date().toISOString(),
      message: 'Prix mis à jour localement (sans DB)'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
