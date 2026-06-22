import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// Le webhook a besoin du corps brut (raw body) pour vérifier la signature
export const config = { api: { bodyParser: false } }

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
      // Abonnement créé / mis à jour : on synchronise statut + date de fin
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const client = await prisma.client.findFirst({ where: { stripeCustomerId: sub.customer } })
        if (client) {
          await prisma.client.update({
            where: { id: client.id },
            data: {
              stripeSubId: sub.id,
              subStatus: sub.status, // active, trialing, past_due, canceled...
              subEndsAt: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
              trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
              plan: (sub.status === 'active' || sub.status === 'trialing') ? 'PREMIUM' : 'CLASSIC',
            },
          })
        }
        break
      }

      // Abonnement supprimé / annulé définitivement
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const client = await prisma.client.findFirst({ where: { stripeCustomerId: sub.customer } })
        if (client) {
          await prisma.client.update({
            where: { id: client.id },
            data: { subStatus: 'canceled', plan: 'CLASSIC' },
          })
        }
        break
      }

      // Paiement d'un widget (mode payment one-time)
      case 'checkout.session.completed': {
        const cs = event.data.object
        if (cs.mode === 'payment' && cs.metadata?.type === 'widget') {
          const clientId = cs.metadata.clientId
          if (clientId) {
            await prisma.widgetPayment.create({
              data: {
                clientId,
                bienId: cs.metadata.bienId || null,
                montant: cs.amount_total ? Math.round(cs.amount_total / 100) : 90,
                devise: cs.currency || 'eur',
                statut: 'paid',
                stripeSessionId: cs.id,
              },
            })
          }
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