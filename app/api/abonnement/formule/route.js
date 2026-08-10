import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, priceForFormule } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FORMULES_VALIDES = ['PRO', 'PRO_PLUS']
// Ordre pour distinguer upgrade (PRO -> PRO_PLUS) d'un downgrade (PRO_PLUS -> PRO)
const RANG = { PRO: 0, PRO_PLUS: 1 }

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
    }

    const { formule } = await req.json()
    if (!FORMULES_VALIDES.includes(formule)) {
      return NextResponse.json({ error: 'Formule invalide.' }, { status: 400 })
    }

    // Client courant (via l'utilisateur connecté)
    const client = await prisma.client.findFirst({
      where: { user: { email: session.user.email } },
      select: { id: true, formule: true, stripeSubId: true, subStatus: true },
    })
    if (!client) {
      return NextResponse.json({ error: 'Client introuvable.' }, { status: 404 })
    }

    // Rien à faire si déjà sur cette formule
    if (client.formule === formule) {
      return NextResponse.json({ ok: true, formule, message: 'Formule déjà active.' })
    }

    const estAbonne = client.subStatus === 'active' || client.subStatus === 'trialing'
    const estUpgrade = RANG[formule] > RANG[client.formule]

    // ---- CAS 1 : pas encore abonné → on change juste la formule en base ----
    if (!estAbonne || !client.stripeSubId) {
      await prisma.client.update({ where: { id: client.id }, data: { formule } })
      return NextResponse.json({ ok: true, formule, applique: 'immediat', message: 'Formule mise à jour.' })
    }

    // ---- CAS 2 : abonné → on modifie l'abonnement Stripe ----
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })
    }

    const sub = await stripe.subscriptions.retrieve(client.stripeSubId)
    const itemId = sub.items.data[0]?.id
    const newPrice = priceForFormule(formule)
    if (!itemId || !newPrice) {
      return NextResponse.json({ error: 'Abonnement ou tarif introuvable.' }, { status: 500 })
    }

    if (estUpgrade) {
      // UPGRADE immédiat, avec proration (Stripe facture la différence au prorata)
      await stripe.subscriptions.update(client.stripeSubId, {
        items: [{ id: itemId, price: newPrice }],
        proration_behavior: 'create_prorations',
        // si un downgrade était programmé, on l'annule
        cancel_at_period_end: false,
      })
      await prisma.client.update({ where: { id: client.id }, data: { formule } })
      return NextResponse.json({ ok: true, formule, applique: 'immediat', message: 'Passage à la formule supérieure appliqué immédiatement.' })
    }

    // DOWNGRADE programmé en fin de période via un Subscription Schedule
    // On crée un planning à partir de l'abonnement, puis on ajoute une phase suivante au nouveau tarif.
    const schedule = await stripe.subscriptionSchedules.create({
      from_subscription: client.stripeSubId,
    })
    const currentPhase = schedule.phases[0]
    const quantite = sub.items.data[0]?.quantity || 1

    await stripe.subscriptionSchedules.update(schedule.id, {
      phases: [
        {
          items: [{ price: sub.items.data[0].price.id, quantity: quantite }],
          start_date: currentPhase.start_date,
          end_date: currentPhase.end_date,
        },
        {
          items: [{ price: newPrice, quantity: quantite }],
          // la nouvelle phase démarre à la fin de la période courante
        },
      ],
      proration_behavior: 'none',
    })

    // On NE change PAS encore client.formule en base : le downgrade n'est effectif
    // qu'à la fin de période. Le webhook mettra à jour la formule quand la phase basculera.
    return NextResponse.json({
      ok: true,
      formule,
      applique: 'fin_de_periode',
      message: 'Le passage à la formule inférieure prendra effet à la fin de votre période en cours.',
    })
  } catch (e) {
    console.error('[ABO/FORMULE]', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Erreur.' }, { status: 500 })
  }
}