import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

  const sig = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (e) {
    console.error('[STRIPE] Signature invalide :', e?.message)
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 })
  }

  try {
    switch (event.type) {
      // Abonnement créé / mis à jour
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const client = await prisma.client.findFirst({ where: { stripeCustomerId: sub.customer } })
        if (client) {
          const periodEnd = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null
          await prisma.client.update({
            where: { id: client.id },
            data: {
              stripeSubId: sub.id,
              subStatus: sub.status,
              subEndsAt: periodEnd ? new Date(periodEnd * 1000) : null,
              trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            },
          })
        }
        break
      }

      // Abonnement annulé
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const client = await prisma.client.findFirst({ where: { stripeCustomerId: sub.customer } })
        if (client) {
          await prisma.client.update({
            where: { id: client.id },
            data: { subStatus: 'canceled' },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[STRIPE] Erreur traitement webhook :', e?.message)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}