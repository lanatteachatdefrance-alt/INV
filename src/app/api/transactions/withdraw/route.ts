import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    /*
     * =====================================================
     * UTILISATEUR
     * =====================================================
     */

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json(
        { error: 'Vous devez être connecté.' },
        { status: 401 }
      )
    }

    /*
     * =====================================================
     * DONNÉES DE LA DEMANDE
     * =====================================================
     */

    const body = await request.json()

    const {
      amount,
      withdrawalMethod,
      withdrawalProvider,
      withdrawalAccount,
      withdrawalName,
      withdrawalPin,
    } = body

    /*
     * =====================================================
     * MONTANT
     * =====================================================
     */

    const numericAmount = Number(amount)

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return Response.json(
        {
          error: 'Montant de retrait invalide.',
        },
        { status: 400 }
      )
    }

    /*
     * =====================================================
     * MODE DE RETRAIT
     * =====================================================
     */

    if (
      ![
        'mobile_money',
        'bank_transfer',
      ].includes(withdrawalMethod)
    ) {
      return Response.json(
        {
          error: 'Mode de retrait invalide.',
        },
        { status: 400 }
      )
    }

    /*
     * =====================================================
     * INFORMATIONS RETRAIT
     * =====================================================
     */

    if (
      !withdrawalProvider ||
      !withdrawalAccount ||
      !withdrawalName
    ) {
      return Response.json(
        {
          error:
            'Veuillez compléter toutes les informations.',
        },
        { status: 400 }
      )
    }

    /*
     * =====================================================
     * VÉRIFICATION DU PIN
     * =====================================================
     */

    if (
      typeof withdrawalPin !== 'string' ||
      !/^[0-9]{6}$/.test(withdrawalPin)
    ) {
      return Response.json(
        {
          error:
            'Veuillez saisir un code de retrait à 6 chiffres.',
        },
        { status: 400 }
      )
    }

    /*
     * Vérification du PIN côté serveur
     */

    const {
      data: pinValid,
      error: pinError,
    } = await supabase.rpc(
      'verify_withdrawal_pin',
      {
        p_pin: withdrawalPin,
      }
    )

    if (pinError) {
      console.error(
        'Withdrawal PIN verification error:',
        pinError
      )

      return Response.json(
        {
          error:
            'Impossible de vérifier votre code de retrait.',
        },
        { status: 500 }
      )
    }

    if (!pinValid) {
      return Response.json(
        {
          error:
            'Code de retrait incorrect.',
        },
        { status: 400 }
      )
    }

    /*
     * =====================================================
     * VÉRIFICATION DU SOLDE
     * =====================================================
     */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return Response.json(
        {
          error:
            'Impossible de récupérer votre solde.',
        },
        { status: 500 }
      )
    }

    const balance =
      Number(profile.balance || 0)

    /*
     * =====================================================
     * RETRAITS EN ATTENTE
     * =====================================================
     *
     * IMPORTANT :
     * On accepte ici les deux anciens types :
     * - withdraw
     * - withdrawal
     *
     * Cela évite de perdre les anciennes demandes.
     */

    const {
      data: pendingWithdrawals,
      error: pendingError,
    } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id)
      .in('type', [
        'withdraw',
        'withdrawal',
      ])
      .eq('status', 'pending')

    if (pendingError) {
      return Response.json(
        {
          error:
            'Impossible de vérifier les retraits en attente.',
        },
        { status: 500 }
      )
    }

    const pendingAmount =
      (
        pendingWithdrawals || []
      ).reduce(
        (
          total,
          transaction
        ) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      )

    const availableForWithdrawal =
      balance - pendingAmount

    /*
     * =====================================================
     * VÉRIFICATION DU SOLDE DISPONIBLE
     * =====================================================
     */

    if (
      numericAmount >
      availableForWithdrawal
    ) {
      return Response.json(
        {
          error:
            'Le montant demandé dépasse votre solde disponible.',
        },
        { status: 400 }
      )
    }

    /*
     * =====================================================
     * CRÉATION DE LA DEMANDE
     * =====================================================
     */

    const {
      data: transaction,
      error: transactionError,
    } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,

        /*
         * Nouveau type standardisé
         */
        type: 'withdrawal',

        amount: numericAmount,

        status: 'pending',

        description:
          `Demande de retrait - ${withdrawalProvider}`,

        withdrawal_method:
          withdrawalMethod,

        withdrawal_provider:
          withdrawalProvider,

        withdrawal_account:
          withdrawalAccount,

        withdrawal_name:
          withdrawalName,
      })
      .select()
      .single()

    if (transactionError) {
      console.error(
        'Withdrawal transaction error:',
        transactionError
      )

      return Response.json(
        {
          error:
            transactionError.message ||
            'Impossible de créer la demande.',
        },
        { status: 500 }
      )
    }

    /*
     * =====================================================
     * RÉPONSE
     * =====================================================
     */

    return Response.json({
      success: true,

      transaction,

      message:
        'Votre demande de retrait a été envoyée et sera traitée par votre gestionnaire.',
    })

  } catch (error) {
    console.error(
      'Withdrawal API error:',
      error
    )

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur serveur.',
      },
      { status: 500 }
    )
  }
}