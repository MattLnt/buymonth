import { NextResponse } from 'next/server'
import { getT } from '@/lib/i18n/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req) {
  const { t } = await getT()
  try {
    if (!stripe) return NextResponse.json({ error: t('Stripe non configuré.', 'Stripe niet geconfigureerd.') }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: t('Non autorisé.', 'Niet toegestaan.') }, { status: 401 })

    const { bienId } = await req.json()
    if (!bienId) return NextResponse.json({ error: t('bienId manquant.', 'bienId ontbreekt.') }, { status: 400 })

    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      include: { user: { select: { email: true } } },
    })
    if (!client) return NextResponse.json({ error: t('Profil introuvable.', 'Profiel niet gevonden.') }, { status: 404 })

    const bien = await prisma.bien.findUnique({ where: { id: bienId } })
    if (!bien || bien.clientId !== client.id) {
      return NextResponse.json({ error: t('Bien introuvable.', 'Pand niet gevonden.') }, { status: 404 })
    }

    // Déjà payé/généré pour ce bien → rien à faire
    const existant = await prisma.widgetPayment.findFirst({
      where: { clientId: client.id, bienId, statut: 'paid' },
    })
    if (existant) {
      return NextResponse.json({ dejaPaye: true })
    }

    // ── Widgets gratuits restants ? ──
    const gratuitsUtilises = await prisma.widgetPayment.count({
      where: { clientId: client.id, montant: 0 },
    })
    const creditsRestants = (client.widgetsGratuits || 0) - gratuitsUtilises

    if (creditsRestants > 0) {
      // Génération gratuite : on enregistre un WidgetPayment à 0€, pas de Stripe
      await prisma.widgetPayment.create({
        data: {
          clientId: client.id,
          bienId,
          montant: 0,
          devise: 'eur',
          statut: 'paid',
        },
      })
      return NextResponse.json({ gratuit: true })
    }

    // ── Sinon : paiement 90€ ──
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 9000,
      currency: 'eur',
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { type: 'widget', clientId: client.id, bienId },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (e) {
    console.error('[WIDGET-PAYER]', e?.message)
    return NextResponse.json({ error: e?.message || t('Erreur serveur.', 'Serverfout.') }, { status: 500 })
  }
}