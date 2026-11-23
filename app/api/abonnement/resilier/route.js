import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/*
 * POST /api/abonnement/resilier  { annuler: true | false }
 *
 * annuler = true  : programme l'arret a la fin de la periode en cours. Le
 *                   promoteur garde l'acces et ses biens restent diffuses
 *                   jusque-la — il a paye pour cette periode.
 * annuler = false : revient en arriere tant que la date n'est pas atteinte.
 *
 * Jamais d'annulation immediate : elle ferait disparaitre des biens d'un mois
 * deja regle, et personne ne demande ca en cliquant « resilier ».
 */
export async function POST(req) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { annuler } = await req.json().catch(() => ({}))

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeSubId) return NextResponse.json({ error: 'Aucun abonnement en cours.' }, { status: 400 })

    const sub = await stripe.subscriptions.update(client.stripeSubId, {
      cancel_at_period_end: annuler !== false,
      // On efface une eventuelle date posee par le portail Stripe, sinon les deux
      // mecanismes coexistent et la reprise ne reprend rien.
      ...(annuler === false ? { cancel_at: '' } : {}),
    })

    const fin = sub.cancel_at || sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null

    return NextResponse.json({
      ok: true,
      resilie: Boolean(sub.cancel_at || sub.cancel_at_period_end),
      le: fin ? fin * 1000 : null,
      message: annuler === false
        ? 'Votre abonnement est réactivé.'
        : 'Votre abonnement prendra fin à la date indiquée. Vos biens restent en ligne jusque-là.',
    })
  } catch (e) {
    console.error('[RESILIER]', e?.message)
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}
