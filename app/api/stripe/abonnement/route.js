import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, PRICE_ABO, BASE_URL } from '@/lib/stripe'
import { getSettings } from '@/lib/settings'

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

    // Créer ou réutiliser le customer Stripe
    let customerId = client.stripeCustomerId
    if (!customerId || customerId === 'NULL') {
      const customer = await stripe.customers.create({
        email: client.user?.email || undefined,
        name: client.societe || undefined,
        metadata: { clientId: client.id },
      })
      customerId = customer.id
      await prisma.client.update({ where: { id: client.id }, data: { stripeCustomerId: customerId } })
    }

    // Essai gratuit si activé dans les paramètres admin
    const settings = await getSettings()
    const subscriptionData = {}
    if (settings.essaiActif && settings.essaiJours > 0) {
      subscriptionData.trial_period_days = settings.essaiJours
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: PRICE_ABO, quantity: 1 }],
      subscription_data: subscriptionData,
      success_url: `${BASE_URL}/dashboard/client/abonnement?success=1`,
      cancel_url: `${BASE_URL}/dashboard/client/abonnement?canceled=1`,
      metadata: { clientId: client.id },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}