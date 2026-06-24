import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

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

    // Customer Stripe
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

    // SetupIntent limité à la carte bancaire uniquement
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { clientId: client.id },
    })

    return NextResponse.json({ clientSecret: setupIntent.client_secret })
  } catch (e) {
    console.error('[SETUP-INTENT]', e?.message)
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}