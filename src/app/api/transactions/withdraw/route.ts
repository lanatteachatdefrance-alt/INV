import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    // 1. Vérifier l'utilisateur connecté
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json(
        { error: 'Vous devez être connecté.' },
        { status: 401 }
      )
    }

    // 2. Lire les données du formulaire
    let body: Record<string, unknown>

    try {
      body = await request.json()
    } catch {
      return Response.json(
        { error: 'Les données envoyées sont invalides.' },
        { status: 400 }
      )
    }

    const {
      amount,
      withdrawalMethod,
      withdrawalProvider,
      withdrawalAccount,
      withdrawalName,
      withdrawalPin,
    } = body

    // 3. Vérifier le montant
    const numericAmount = Number(amount)

    if (
      amount === null ||
      amount === undefined ||
      amount === '' ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return Response.json(
        { error: 'Montant de retrait invalide.' },
        { status: 400 }
      )
    }

    // 4. Vérifier le mode de retrait
    if (
      typeof withdrawalMethod !== 'string' ||
      !['mobile_money', 'bank_transfer'].includes(
        withdrawalMethod
      )
    ) {
      return Response.json(
        { error: 'Mode de retrait invalide.' },
        { status: 400 }
      )
    }

    // 5. Vérifier les coordonnées de paiement
    if (
      typeof withdrawalProvider !== 'string' ||
      !withdrawalProvider.trim() ||
      typeof withdrawalAccount !== 'string' ||
      !withdrawalAccount.trim() ||
      typeof withdrawalName !== 'string' ||
      !withdrawalName.trim()
    ) {
      return Response.json(
        {
          error:
            'Veuillez compléter toutes les informations de retrait.',
        },
        { status: 400 }
      )
    }

    // 6. Vérifier le PIN à 6 chiffres
    if (
      typeof withdrawalPin !== 'string' ||
      !/^[0-9]{6}$/.test(withdrawalPin)
    ) {
      return Response.json(
        {
          error:
            'Entrez votre code PIN à 6 chiffres pour continuer.',
        },
        { status: 400 }
      )
    }

    // 7. Vérifier le PIN côté serveur
    const {
      data: pinValid,
      error: pinError,
    } = await supabase.rpc('verify_withdrawal_pin', {
      p_pin: withdrawalPin,
    })

    if (pinError) {
      console.error(
        'Withdrawal PIN verification error:',
        pinError.message
      )

      return Response.json(
        {
          error:
            'Impossible de vérifier votre code PIN. Réessayez plus tard.',
        },
        { status: 500 }
      )
    }

    if (pinValid !== true) {
      return Response.json(
        { error: 'Code PIN incorrect. Vérifiez votre saisie.' },
        { status: 400 }
      )
    }

    // 8. Récupérer le solde du client
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error(
        'Withdrawal balance lookup error:',
        profileError?.message
      )

      return Response.json(
        {
          error: 'Impossible de récupérer votre solde.',
        },
        { status: 500 }
      )
    }

    const balance = Number(profile.balance ?? 0)

    if (!Number.isFinite(balance) || balance < 0) {
      return Response.json(
        { error: 'Votre solde est invalide.' },
        { status: 400 }
      )
    }

    // 9. Calculer les retraits déjà en attente
    // Prend en compte les deux types historiques.
    const {
      data: pendingWithdrawals,
      error: pendingError,
    } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .in('type', ['withdraw', 'withdrawal'])
      .in('status', ['pending', 'en_attente', 'en attente'])

    if (pendingError) {
      console.error(
        'Pending withdrawals lookup error:',
        pendingError.message
      )

      return Response.json(
        {
          error:
            'Impossible de vérifier vos retraits en attente.',
        },
        { status: 500 }
      )
    }

    const pendingAmount = (pendingWithdrawals ?? []).reduce(
      (total, transaction) =>
        total + Number(transaction.amount ?? 0),
      0
    )

    if (!Number.isFinite(pendingAmount) || pendingAmount < 0) {
      return Response.json(
        {
          error:
            'Impossible de calculer le montant disponible.',
        },
        { status: 500 }
      )
    }

    const availableForWithdrawal = balance - pendingAmount

    if (
      availableForWithdrawal <= 0 ||
      numericAmount > availableForWithdrawal
    ) {
      return Response.json(
        {
          error:
            'Le montant demandé dépasse votre solde disponible après prise en compte des retraits en attente.',
        },
        { status: 400 }
      )
    }

    // 10. Enregistrer la demande
    // Type "withdraw" : compatible avec /admin/requests.
    // Aucun débit n'est effectué ici.
    const {
      data: transaction,
      error: transactionError,
    } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'withdraw',
        amount: numericAmount,
        status: 'pending',
        description: `Demande de retrait - ${withdrawalProvider.trim()}`,
        withdrawal_method: withdrawalMethod,
        withdrawal_provider: withdrawalProvider.trim(),
        withdrawal_account: withdrawalAccount.trim(),
        withdrawal_name: withdrawalName.trim(),
      })
      .select(
        'id, created_at, amount, type, status, description'
      )
      .single()

    if (transactionError || !transaction) {
      console.error(
        'Withdrawal transaction creation error:',
        transactionError?.message
      )

      return Response.json(
        {
          error:
            'Impossible d’enregistrer votre demande. Veuillez réessayer.',
        },
        { status: 500 }
      )
    }

    // 11. Confirmer la demande
    return Response.json(
      {
        success: true,
        transaction,
        message:
          'Votre demande de retrait a été envoyée avec succès. Elle est en attente de validation.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Withdrawal API error:', error)

    return Response.json(
      { error: 'Une erreur serveur est survenue.' },
      { status: 500 }
    )
  }
}