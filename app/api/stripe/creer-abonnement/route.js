import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, priceForFormule, PRICE_MISE_EN_SERVICE } from '@/lib/stripe'
import { getSettings } from '@/lib/settings'

export async function POST(req) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const { paymentMethodId } = await req.json()
    if (!paymentMethodId) return NextResponse.json({ error: 'Moyen de paiement manquant.' }, { status: 400 })

    const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
    if (!client?.stripeCustomerId) return NextResponse.json({ error: 'Client Stripe introuvable.' }, { status: 404 })

    const customerId = client.stripeCustomerId

    // Décompte : on facture les biens ACTIFS uniquement
    const quantite = await prisma.bien.count({ where: { clientId: client.id, statut: 'ACTIF' } })
    if (quantite < 1) {
      return NextResponse.json({ error: 'Ajoutez au moins un bien actif avant de vous abonner.' }, { status: 400 })
    }

    const price = priceForFormule(client.formule)
    if (!price) return NextResponse.json({ error: 'Tarif de la formule non configuré.' }, { status: 500 })

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    const settings = await getSettings()
    const avecEssai = settings.essaiActif && settings.essaiJours > 0

    const subData = {
      customer: customerId,
      items: [{ price, quantity: quantite }],
      default_payment_method: paymentMethodId,
      payment_settings: { payment_method_types: ['card'] },
      metadata: { clientId: client.id, formule: client.formule },
    }
    if (avecEssai) subData.trial_period_days = settings.essaiJours

    // Frais de mise en service (une seule fois) → ajoutés à la première facture
    const inclutMiseEnService = !client.miseEnServicePayee && !!PRICE_MISE_EN_SERVICE
    if (inclutMiseEnService) {
      subData.add_invoice_items = [{ price: PRICE_MISE_EN_SERVICE }]
    }

    const sub = await stripe.subscriptions.create(subData)

    // Date de fin de période : sur l'item dans les versions récentes de l'API
    const periodEnd = sub.current_period_end || sub.items?.data?.[0]?.current_period_end || null

    await prisma.client.update({
      where: { id: client.id },
      data: {
        stripeSubId: sub.id,
        subStatus: sub.status,
        subEndsAt: periodEnd ? new Date(periodEnd * 1000) : null,
        trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
        ...(inclutMiseEnService ? { miseEnServicePayee: true, miseEnServiceAt: new Date() } : {}),
      },
    })

    return NextResponse.json({ ok: true, status: sub.status })
  } catch (e) {
    console.error('[CREER-ABO]', e?.message)
    return NextResponse.json({ error: e?.message || 'Erreur serveur.' }, { status: 500 })
  }
}