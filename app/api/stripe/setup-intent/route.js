import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { resoudreCustomer } from '@/lib/stripe-customer'

export async function POST() {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { email: true } } },
    })
    if (!client) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 404 })

    // Customer Stripe : cree s'il n'existe pas, recree si l'identifiant en base
    // est perime — un customer du mode test n'existe pas en mode live, et sans ce
    // rattrapage le promoteur ne pouvait plus s'abonner du tout.
    const customer = await resoudreCustomer(client)
    const customerId = customer.id

    // Carte bancaire et domiciliation SEPA. Le mandat SEPA est presente et signe
    // par le PaymentElement cote navigateur, il n'y a pas de document a produire.
    //
    // Le SEPA s'active compte par compte chez Stripe, et separement en test et en
    // live. Tant qu'il ne l'est pas, demander sepa_debit fait echouer l'appel —
    // et plus personne ne peut s'abonner. On retombe donc sur la carte seule
    // plutot que de bloquer tout le monde.
    let setupIntent
    try {
      setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card', 'sepa_debit'],
        metadata: { clientId: client.id },
      })
    } catch (e) {
      console.warn('[SETUP-INTENT] SEPA indisponible, repli sur la carte :', e?.message)
      setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        metadata: { clientId: client.id },
      })
    }

    return NextResponse.json({ clientSecret: setupIntent.client_secret })
  } catch (e) {
    console.error('[SETUP-INTENT]', e?.message)
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}