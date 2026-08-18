import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json(
        { error: 'Vous devez être connecté.' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      amount,
      withdrawalMethod,
      withdrawalProvider,
      withdrawalAccount,
      withdrawalName,
    } = body

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return Response.json(
        { error: 'Montant de retrait invalide.' },
        { status: 400 }
      )
    }

    if (!['mobile_money', 'bank_transfer'].includes(withdrawalMethod)) {
      return Response.json(
        { error: 'Mode de retrait invalide.' },
        { status: 400 }
      )
    }

    if (!withdrawalProvider || !withdrawalAccount || !withdrawalName) {
      return Response.json(
        { error: 'Veuillez compléter toutes les informations.' },
        { status: 400 }
      )
    }

    // Vérification du solde actuel
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return Response.json(
        { error: 'Impossible de récupérer votre solde.' },
        { status: 500 }
      )
    }

    const balance = Number(profile.balance || 0)

    // Vérifier les retraits déjà en attente
    const { data: pendingWithdrawals } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'withdraw')
      .eq('status', 'pending')

    const pendingAmount = (pendingWithdrawals || []).reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    )

    const availableForWithdrawal = balance - pendingAmount

    if (numericAmount > availableForWithdrawal) {
      return Response.json(
        {
          error:
            'Le montant demandé dépasse votre solde disponible.',
        },
        { status: 400 }
      )
    }

    // Création de la demande
    const { data: transaction, error: transactionError } =
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount: numericAmount,
          status: 'pending',
          description: 'Demande de retrait',
          withdrawal_method: withdrawalMethod,
          withdrawal_provider: withdrawalProvider,
          withdrawal_account: withdrawalAccount,
          withdrawal_name: withdrawalName,
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

    return Response.json({
      success: true,
      transaction,
      message:
        'Votre demande de retrait a été envoyée et sera traitée par votre gestionnaire.',
    })
  } catch (error) {
    console.error('Withdrawal API error:', error)

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
// Withdrawal API route