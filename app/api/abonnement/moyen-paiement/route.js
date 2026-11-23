import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

/*
 * POST /api/abonnement/moyen-paiement  { paymentMethodId }
 *
 * Remplace le moyen de paiement par defaut du promoteur, apres que le navigateur
 * a confirme un SetupIntent. Le nouveau devient le moyen de paiement du client ET
 * de l'abonnement en cours, sinon le prochain prelevement partirait encore sur
 * l'ancien. L'ancien est detache pour ne pas accumuler des cartes mortes.
 */
export async function POST(req) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { paymentMethodId } = await req.json().catch(() => ({}))
    if (!paymentMethodId) return NextResponse.json({ error: 'Moyen de paiement manquant.' }, { status: 400 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeCustomerId) return NextResponse.json({ error: 'Client Stripe introuvable.' }, { status: 404 })

    const customer = await stripe.customers.retrieve(client.stripeCustomerId)
    const ancien = customer?.invoice_settings?.default_payment_method
    const ancienId = typeof ancien === 'string' ? ancien : ancien?.id || null

    await stripe.customers.update(client.stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    if (client.stripeSubId) {
      await stripe.subscriptions.update(client.stripeSubId, {
        default_payment_method: paymentMethodId,
      })
    }

    if (ancienId && ancienId !== paymentMethodId) {
      try {
        await stripe.paymentMethods.detach(ancienId)
      } catch {
        // sans importance : l'essentiel est que le nouveau soit par defaut
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[MOYEN-PAIEMENT]', e?.message)
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}
