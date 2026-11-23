import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, BASE_URL } from '@/lib/stripe'
import { getT } from '@/lib/i18n/server'

export async function POST() {
  const { lang, t } = await getT()
  try {
    if (!stripe) return NextResponse.json({ error: t('Stripe non configuré.', 'Stripe is niet geconfigureerd.') }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeCustomerId || client.stripeCustomerId === 'NULL') {
      return NextResponse.json({ error: t('Aucun abonnement à gérer.', 'Geen abonnement om te beheren.') }, { status: 400 })
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: client.stripeCustomerId,
      return_url: `${BASE_URL}/dashboard/client/abonnement`,
      locale: lang === 'nl' ? 'nl' : 'fr',
    })

    return NextResponse.json({ url: portal.url })
  } catch (e) {
    return NextResponse.json({ error: e?.message || t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}