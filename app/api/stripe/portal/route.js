import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, BASE_URL } from '@/lib/stripe'

export async function POST() {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeCustomerId || client.stripeCustomerId === 'NULL') {
      return NextResponse.json({ error: 'Aucun abonnement à gérer.' }, { status: 400 })
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: client.stripeCustomerId,
      return_url: `${BASE_URL}/dashboard/client/abonnement`,
    })

    return NextResponse.json({ url: portal.url })
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}