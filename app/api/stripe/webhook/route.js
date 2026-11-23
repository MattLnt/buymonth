import { NextResponse } from 'next/server'
import { stripe, PRICE_PRO, PRICE_PRO_PLUS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { envoyerEmailImpaye } from '@/lib/email'
import { finDelaiDeGrace } from '@/lib/facturation'

// Déduit la formule ('PRO' | 'PRO_PLUS') à partir du price actif de l'abonnement.
// Renvoie null si le price ne correspond à aucune formule connue (on ne touche alors pas la formule).
function formuleDepuisSub(sub) {
  const priceId = sub.items?.data?.[0]?.price?.id
  if (!priceId) return null
  if (priceId === PRICE_PRO_PLUS) return 'PRO_PLUS'
  if (priceId === PRICE_PRO) return 'PRO'
  return null
}

export async function POST(req) {
  if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

  const sig = req.headers.get('stripe-signature')
  // Meme precaution que dans lib/stripe.js : une espace en trop ferait echouer
  // la verification de signature, et la panne serait silencieuse.
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
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
          // On recale la formule sur le price réellement actif : indispensable pour
          // qu'un downgrade programmé (qui bascule en fin de période) se reflète en base.
          const formule = formuleDepuisSub(sub)
          await prisma.client.update({
            where: { id: client.id },
            data: {
              stripeSubId: sub.id,
              subStatus: sub.status,
              subEndsAt: periodEnd ? new Date(periodEnd * 1000) : null,
              trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
              ...(formule ? { formule } : {}),
            },
          })
        }
        break
      }

      // Une phase de planning bascule (utilisé pour le downgrade programmé)
      case 'subscription_schedule.updated':
      case 'subscription_schedule.released': {
        const schedule = event.data.object
        const subId = schedule.subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const client = await prisma.client.findFirst({ where: { stripeCustomerId: sub.customer } })
          if (client) {
            const formule = formuleDepuisSub(sub)
            if (formule) {
              await prisma.client.update({ where: { id: client.id }, data: { formule } })
            }
          }
        }
        break
      }

      // Abonnement annulé
      // Prelevement refuse. Jusqu'au 06/10/2026 aucun evenement de facture n'etait
      // ecoute : un impaye etait totalement invisible, et les biens du promoteur
      // disparaissaient du site sans que personne ne soit prevenu.
      case 'invoice.payment_failed': {
        const facture = event.data.object
        const client = await prisma.client.findFirst({
          where: { stripeCustomerId: facture.customer },
          include: { user: { select: { email: true } } },
        })
        if (client) {
          // On date le premier echec seulement : le delai de grace court a partir
          // de la, meme si Stripe retente plusieurs fois.
          const premier = !client.impayeDepuis
          const maj = premier ? { impayeDepuis: new Date() } : {}
          if (premier) await prisma.client.update({ where: { id: client.id }, data: maj })

          try {
            await envoyerEmailImpaye({
              email: client.user?.email,
              societe: client.societe,
              montant: facture.amount_due,
              devise: facture.currency,
              urlFacture: facture.hosted_invoice_url || null,
              finGrace: finDelaiDeGrace({ impayeDepuis: client.impayeDepuis || new Date() }),
            })
            await prisma.client.update({ where: { id: client.id }, data: { impayeRelanceAt: new Date() } })
          } catch (e) {
            console.error('[STRIPE] Relance impaye non envoyee :', e?.message)
          }
        }
        break
      }

      // Facture payee : l'impaye est regularise, on efface la date.
      case 'invoice.paid': {
        const facture = event.data.object
        const client = await prisma.client.findFirst({ where: { stripeCustomerId: facture.customer } })
        if (client?.impayeDepuis) {
          await prisma.client.update({
            where: { id: client.id },
            data: { impayeDepuis: null, impayeRelanceAt: null },
          })
        }
        break
      }

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